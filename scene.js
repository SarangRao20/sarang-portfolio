/* =====================================================
   HERO WEBGL SCENE (Three.js) — ambient particle field
   Core galaxy-blob + drifting dust + signal sparks.
   Theme-aware · pointer parallax · pauses offscreen · reduced-motion static.
   ===================================================== */
(function () {
    'use strict';
    if (!window.THREE) return;

    const hero = document.querySelector('.hero');
    const canvas = document.getElementById('bg-scene');
    if (!hero || !canvas) return;

    let renderer, scene, camera, particles = [];
    let running = false, inView = true;

    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const mobile = matchMedia('(max-width: 720px)').matches;

    function isDark() {
        return document.documentElement.getAttribute('data-theme') === 'dark';
    }
    const PAL = {
        light: { core: 0x1828CE, hi: 0x2A3DF5, dust: 0x4B4F57, lime: 0x2F9E3F, coral: 0xE05233 },
        dark:  { core: 0x8B96FF, hi: 0xC6CCFF, dust: 0x2C2F3A, lime: 0x7CFF4D, coral: 0xFF5E3A }
    };

    function colorOf(kind, i, P) {
        const c = new THREE.Color();
        if (kind === 'core') c.set(Math.random() < 0.16 ? P.hi : P.core);
        else if (kind === 'dust') c.set(P.dust);
        else c.set(Math.random() < 0.5 ? P.lime : P.coral);
        return c;
    }

    function addPoints(kind, n) {
        const pos = new Float32Array(n * 3);
        const col = new Float32Array(n * 3);
        for (let i = 0; i < n; i++) {
            if (kind === 'dust') {
                pos[i * 3]     = (Math.random() - 0.5) * 760;
                pos[i * 3 + 1] = (Math.random() - 0.5) * 460;
                pos[i * 3 + 2] = (Math.random() - 0.5) * 300;
            } else {
                const r = 95 + Math.pow(Math.random(), 1.7) * 105;
                const th = Math.random() * Math.PI * 2;
                const ph = Math.acos(2 * Math.random() - 1);
                pos[i * 3]     = r * Math.sin(ph) * Math.cos(th);
                pos[i * 3 + 1] = r * Math.cos(ph) * 0.62 + (Math.random() - 0.5) * 8;
                pos[i * 3 + 2] = r * Math.sin(ph) * Math.sin(th);
            }
            const c = colorOf(kind, i, PAL[isDark() ? 'dark' : 'light']);
            col[i * 3] = c.r; col[i * 3 + 1] = c.g; col[i * 3 + 2] = c.b;
        }
        const geo = new THREE.BufferGeometry();
        geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
        geo.setAttribute('color', new THREE.BufferAttribute(col, 3));
        const size = kind === 'core' ? (mobile ? 1.9 : 2.7)
                   : kind === 'dust' ? (mobile ? 1.1 : 1.5) : (mobile ? 2.2 : 3.2);
        const mat = new THREE.PointsMaterial({
            size, vertexColors: true, transparent: true,
            opacity: kind === 'dust' ? 0.4 : 0.9,
            depthWrite: false, sizeAttenuation: true
        });
        const pts = new THREE.Points(geo, mat);
        scene.add(pts);
        particles.push(pts);
        return pts;
    }

    function recolor() {
        const P = PAL[isDark() ? 'dark' : 'light'];
        particles.forEach(pts => {
            const kind = pts.userData.kind;
            const arr = pts.geometry.attributes.color.array;
            for (let i = 0; i < arr.length / 3; i++) {
                const c = colorOf(kind, i, P);
                arr[i * 3] = c.r; arr[i * 3 + 1] = c.g; arr[i * 3 + 2] = c.b;
            }
            pts.geometry.attributes.color.needsUpdate = true;
        });
    }

    function build() {
        scene = new THREE.Scene();
        camera = new THREE.PerspectiveCamera(55, hero.clientWidth / hero.clientHeight, 1, 2000);
        camera.position.z = 330;

        [['core', mobile ? 380 : 1050],
         ['dust', mobile ? 150 : 460],
         ['spark', mobile ? 18 : 46]].forEach(([kind, n]) => {
            const pts = addPoints(kind, n);
            pts.userData.kind = kind;
        });

        try {
            renderer = new THREE.WebGLRenderer({ canvas, antialias: false, alpha: true });
        } catch (e) {
            return false;
        }
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.setSize(hero.clientWidth, hero.clientHeight, false);
        return true;
    }

    // Pointer parallax
    let nx = 0, ny = 0, cx = 0, cy = 0;
    window.addEventListener('pointermove', e => {
        nx = e.clientX / window.innerWidth - 0.5;
        ny = e.clientY / window.innerHeight - 0.5;
    });

    // Pause when the hero scrolls out of view
    if ('IntersectionObserver' in window) {
        new IntersectionObserver(entries => {
            inView = entries[0].isIntersecting;
            started();
        }, { rootMargin: '0px 0px 15% 0px' }).observe(hero);
    }

    function started() {
        if (reduced || inView === running) return;
        running = inView;
        if (running) requestAnimationFrame(frame);
    }

    let t0 = performance.now();
    function frame(now) {
        if (!running) return;
        const t = now - t0;
        [0, 2].forEach(i => {                    // core + sparks spin
            const p = particles[i];
            if (p) { p.rotation.y += 0.0014; p.rotation.x = Math.sin(t * 0.00018) * 0.05; }
        });
        const d = particles[1];                  // dust counter-drift
        if (d) d.rotation.y -= 0.0005;

        cx += (nx * 52 - cx) * 0.035;
        cy += (-ny * 34 - cy) * 0.035;
        camera.position.x = cx;
        camera.position.y = cy;
        camera.lookAt(0, 0, 0);

        renderer.render(scene, camera);
        requestAnimationFrame(frame);
    }

    function onResize() {
        if (!renderer) return;
        const w = hero.clientWidth, h = hero.clientHeight;
        if (!h) return;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h, false);
    }
    window.addEventListener('resize', onResize);

    // Theme recolour
    new MutationObserver(recolor).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

    if (!build()) return;
    onResize();
    if (reduced) {
        renderer.render(scene, camera);          // static frame only
    } else {
        started();
    }
})();