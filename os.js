/* =====================================================
   SARANGOS — portfolio-as-operating-system (desktop overlay)
   Boots after the boot screen; desktop experience on
   fine-pointer desktops. The classic scrolling site stays
   as the mobile/fallback + "CLASSIC" relaunch target.
   ===================================================== */
(function () {
    'use strict';

    const html = document.documentElement;
    const os = document.getElementById('sarangos');
    const force = new URLSearchParams(location.search).get('os') === '1';
    const support = matchMedia('(min-width: 1024px) and (pointer: fine)').matches;
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!os || (!support || reduced) && !force) return;

    const desktop = os.querySelector('.os-desktop');
    const winLayer = document.getElementById('os-windows');
    let zTop = 100;

    // ---------- window manager ----------
    const open = new Map(); // id -> {el, minimized}

    function esc(s) {
        return String(s).replace(/[&<>]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]));
    }

    function focus(el) {
        zTop += 1;
        el.style.zIndex = zTop;
        winLayer.querySelectorAll('.os-window').forEach(w => w.classList.remove('focused'));
        el.classList.add('focused');
    }

    function openWin(id) {
        const spec = APPS[id];
        if (!spec) return;
        if (open.has(id)) {
            const w = open.get(id);
            if (w.minimized) { w.minimized = false; w.el.classList.remove('is-min'); }
            focus(w.el);
            return w.el;
        }
        const el = document.createElement('section');
        el.className = 'os-window';
        el.setAttribute('role', 'dialog');
        el.setAttribute('aria-label', spec.title);
        el.innerHTML =
            '<header class="os-titlebar">' +
            '<span class="os-tdots"><i></i><i></i><i></i></span>' +
            '<span class="os-wtitle mono">' + esc(spec.title) + '</span>' +
            '<button class="os-wbtn os-wmin" aria-label="Minimize ' + esc(spec.title) + '">—</button>' +
            '<button class="os-wbtn os-wclose" aria-label="Close ' + esc(spec.title) + '">✕</button>' +
            '</header>' +
            '<div class="os-wbody os-wbody-' + id + '">' + spec.body() + '</div>' +
            '<i class="os-wresize" aria-hidden="true"></i>';
        winLayer.appendChild(el);
        open.set(id, { el, minimized: false });
        positionWindow(el, spec);
        wireWin(el, id);
        focus(el);
        if (spec.init) spec.init(el);
        return el;
    }

    function closeWin(id) {
        const w = open.get(id);
        if (!w) return;
        w.el.remove();
        open.delete(id);
    }

    function positionWindow(el, spec) {
        const cw = desktop.clientWidth, ch = desktop.clientHeight;
        const n = winLayer.querySelectorAll('.os-window').length % 8;
        const w = Math.min(spec.w, cw - 64);
        const h = Math.min(spec.h, ch - 140);
        const bw = Math.max(360, cw - 80);
        const x = Math.max(16, (cw - w - 42) / 2 + n * 34);
        const y = Math.max(12, (ch - h - 74) / 2 + n * 26);
        el.style.width = Math.min(w, bw) + 'px';
        el.style.height = h + 'px';
        el.style.left = Math.min(x, cw - w - 16) + 'px';
        el.style.top = Math.min(y, ch - h - 80) + 'px';
    }

    function wireWin(el, id) {
        const bar = el.querySelector('.os-titlebar');
        const close = el.querySelector('.os-wclose');
        const min = el.querySelector('.os-wmin');
        const resize = el.querySelector('.os-wresize');

        bar.addEventListener('pointerdown', e => {
            if (e.target.closest('.os-wbtn')) return;
            focus(el);
            const r = el.getBoundingClientRect();
            const dx = e.clientX - r.left, dy = e.clientY - r.top;
            const mv = ev => {
                const x = Math.min(Math.max(ev.clientX - dx, 8), desktop.clientWidth - el.offsetWidth - 8);
                const y = Math.min(Math.max(ev.clientY - dy, 8), desktop.clientHeight - el.offsetHeight - 76);
                el.style.left = x + 'px';
                el.style.top = y + 'px';
            };
            const up = () => {
                window.removeEventListener('pointermove', mv);
                window.removeEventListener('pointerup', up);
            };
            window.addEventListener('pointermove', mv);
            window.addEventListener('pointerup', up);
        });

        close.addEventListener('click', () => closeWin(id));
        min.addEventListener('click', () => {
            open.get(id).minimized = true;
            el.classList.add('is-min');
        });
        el.addEventListener('pointerdown', () => focus(el));

        if (resize) {
            resize.addEventListener('pointerdown', e => {
                e.stopPropagation();
                focus(el);
                const r = el.getBoundingClientRect();
                const mv = ev => {
                    el.style.width = Math.min(Math.max(ev.clientX - r.left, 380), desktop.clientWidth - 16) + 'px';
                    el.style.height = Math.min(Math.max(ev.clientY - r.top, 260), desktop.clientHeight - 76) + 'px';
                };
                const up = () => {
                    window.removeEventListener('pointermove', mv);
                    window.removeEventListener('pointerup', up);
                };
                window.addEventListener('pointermove', mv);
                window.addEventListener('pointerup', up);
            });
        }
    }

    // ---------- apps ----------
    function cloneBlock(sel) {
        const src = document.querySelector(sel);
        if (!src) return '';
        const node = src.cloneNode(true);
        node.querySelectorAll('.reveal, .spec-row').forEach(n => n.classList.add('in'));
        return node.outerHTML;
    }

    const APPS = {
        welcome: {
            title: 'Welcome — SarangOS v2.7',
            w: 640, h: 520,
            body: () =>
                '<div class="os-about">' +
                '<p class="oa-kicker mono">SARANGOS v2.7 · SYSTEM ONLINE</p>' +
                '<h3 class="oa-name">Sarang<br>Rao</h3>' +
                '<p class="oa-role">AI/ML Engineer — production systems, end to end</p>' +
                '<ul class="oa-spec mono">' +
                '<li><span>MODALITIES</span> multi-agent · RAG · LLM pipelines · computer vision</li>' +
                '<li><span>DEPLOYED AT</span> TenancyPassport · FinServe NBFC · Nivana · Elysia-AI</li>' +
                '<li><span>STATUS</span> <em class="ico-dot">●</em> AI Team Lead @ TenancyPassport — JAN 2026 →</li>' +
                '</ul>' +
                '<div class="oa-links">' +
                '<a class="btn btn-primary" href="assets/sarang-rao-resume.pdf" download="Sarang-Rao-Resume.pdf">RESUME <span class="mono btn-suffix">.PDF</span></a>' +
                '<a class="mono text-link" href="https://github.com/SarangRao20" target="_blank" rel="noopener noreferrer">GITHUB ↗</a>' +
                '<a class="mono text-link" href="https://linkedin.com/in/sarang-rao-262bbb324" target="_blank" rel="noopener noreferrer">LINKEDIN ↗</a>' +
                '</div>' +
                '<p class="oa-hint mono">TIP — open the icons on the desktop · windows are draggable + resizable</p>' +
                '</div>',
            init: function () {}
        },
        projects: {
            title: 'Projects — evaluation log',
            w: 900, h: 620,
            body: () => '<div class="os-clone-wrap">' + cloneBlock('.feat-grid') + '</div>' +
                '<p class="os-more-hint mono">FULL LOG + 14 MORE SYSTEMS → <a class="text-link" href="#projects">open in classic site</a></p>',
            init: () => {}
        },
        terminal: {
            title: 'Terminal — sarang@portfolio',
            w: 680, h: 460,
            body: () =>
                '<div class="os-term">' +
                '<div class="term-screen os-term-screen" id="os-term-screen"></div>' +
                '<div class="term-prompt-row os-term-prompt">' +
                '<span class="term-ps1">sarang@portfolio:~$</span>' +
                '<span class="term-cmd" id="os-term-cmd"></span><span class="term-cursor"></span>' +
                '<input class="term-input" id="os-term-input" aria-label="Terminal input" autocomplete="off" spellcheck="false">' +
                '</div>' +
                '</div>',
            init: el => {
                const t = SR.createTerminal({
                    screen: document.getElementById('os-term-screen'),
                    input: document.getElementById('os-term-input'),
                    cmdEl: document.getElementById('os-term-cmd'),
                    body: el.querySelector('.os-term'),
                    bar: null, root: el, autoBoot: true
                });
                if (t) setTimeout(() => t.boot(), 120);
            }
        },
        cases: {
            title: 'Case studies — proof of work',
            w: 720, h: 520,
            body: () =>
                '<div class="os-cases">' +
                '<a class="oc-item" href="case.html?p=elysia" target="_blank" rel="noopener"><span class="oc-id mono">P-01</span><span class="oc-t">Elysia-AI</span><span class="oc-s mono">voice assistant · 110+ tools</span><span class="oc-go mono">↗</span></a>' +
                '<a class="oc-item" href="case.html?p=nbfc" target="_blank" rel="noopener"><span class="oc-id mono">P-02</span><span class="oc-t">FinServe NBFC</span><span class="oc-s mono">multi-agent loan origination · live</span><span class="oc-go mono">↗</span></a>' +
                '<a class="oc-item" href="case.html?p=battery" target="_blank" rel="noopener"><span class="oc-id mono">P-09</span><span class="oc-t">HP Battery Limiter</span><span class="oc-s mono">EC firmware · flagship</span><span class="oc-go mono">↗</span></a>' +
                '</div>',
            init: () => {}
        },
        resume: {
            title: 'Resume — sarang.rao',
            w: 560, h: 400,
            body: () =>
                '<div class="os-resume">' +
                '<p class="mono osr-meta">sarang-rao-resume.pdf · one page · synced to career facts</p>' +
                '<div class="osr-rows mono">' +
                '<span>EDUCATION</span><span>B.Tech E&amp;CE — PICT · 9.07 CGPA · IITM BS DS</span>' +
                '<span>ROLE</span><span>AI Team Lead @ TenancyPassport · 5 interns</span>' +
                '<span>FOCUS</span><span>multi-agent · RAG · CV · voice · FastAPI</span>' +
                '</div>' +
                '<a class="btn btn-primary" href="assets/sarang-rao-resume.pdf" download="Sarang-Rao-Resume.pdf">DOWNLOAD RESUMÉ <span class="mono btn-suffix">.PDF</span></a>' +
                '</div>',
            init: () => {}
        },
        contact: {
            title: 'Contact — uplink',
            w: 640, h: 560,
            body: () =>
                '<div class="os-contact">' +
                '<div class="oc-mail mono"><span>UPLINK_EMAIL</span><a href="mailto:raosarang2006@gmail.com">raosarang2006@gmail.com</a>' +
                '<button class="copy-btn" id="os-copy" data-email="raosarang2006@gmail.com">COPY</button></div>' +
                '<form id="os-form" novalidate>' +
                '<div class="form-group"><label for="os-name">NAME</label><input id="os-name" name="name" type="text" placeholder="Ada Lovelace"><span class="field-error" id="os-name-error"></span></div>' +
                '<div class="form-group"><label for="os-email">EMAIL</label><input id="os-email" name="email" type="email" placeholder="you@company.com"><span class="field-error" id="os-email-error"></span></div>' +
                '<div class="form-group"><label for="os-msg">MESSAGE</label><textarea id="os-msg" name="message" rows="4" placeholder="What should we build?"></textarea><span class="field-error" id="os-msg-error"></span></div>' +
                '<div class="hp-field"><label>Company</label><input name="company" type="text" tabindex="-1" autocomplete="off"></div>' +
                '<button class="btn btn-primary btn-submit" type="submit">SEND MESSAGE</button>' +
                '<p class="form-status mono" id="os-form-status" role="status" aria-live="polite"></p>' +
                '</form>' +
                '</div>',
            init: el => {
                const f = el.querySelector('#os-form');
                SR.initForm(f, document.getElementById('os-form-status'));
                const cb = el.querySelector('#os-copy');
                if (cb && navigator.clipboard) {
                    cb.addEventListener('click', async () => {
                        try {
                            await navigator.clipboard.writeText(cb.dataset.email);
                            cb.textContent = 'COPIED ✓';
                            setTimeout(() => { cb.textContent = 'COPY'; }, 1600);
                        } catch (e) { /* noop */ }
                    });
                }
            }
        }
    };

    // ---------- desktop wiring ----------
    function start() {
        html.classList.add('os-mode');
        document.body.classList.add('os-active');
        os.hidden = false;
        paintWallpaper();
        bindIcons();
        bindDock();
        bindDockRight();
        startClock();
        setTimeout(() => {
            openWin('welcome');
            toast('SARANGOS READY — sarang, the system is yours');
        }, 300);
    }

    function paintWallpaper() {
        const w = os.querySelector('.os-wallpaper');
        if (!w || w.dataset.painted) return;
        w.dataset.painted = '1';
        w.innerHTML =
            '<svg viewBox="0 0 222 170" xmlns="http://www.w3.org/2000/svg" fill="none" aria-hidden="true">' +
            '<path d="M22 46 H76 Q98 46 98 62 Q98 78 76 82 L34 90 Q18 94 18 110 Q18 128 44 128 H104" stroke="currentColor" stroke-width="20" stroke-linecap="round" stroke-linejoin="round"/>' +
            '<path d="M128 46 V128 M128 46 H160 Q186 46 186 70 Q186 94 160 98 H128 M160 98 L192 128" stroke="currentColor" stroke-width="20" stroke-linecap="round" stroke-linejoin="round"/>' +
            '</svg>';
    }

    function bindIcons() {
        os.querySelectorAll('.os-icon').forEach(ic => {
            let clicks = 0, tmr;
            ic.addEventListener('click', () => {
                clicks++;
                clearTimeout(tmr);
                tmr = setTimeout(() => { clicks = 0; }, 320);
                if (clicks === 2) {
                    openWin(ic.dataset.app);
                    toast(ic.dataset.app.toUpperCase() + ' OPENED');
                } else {
                    const w = open.get(ic.dataset.app);
                    if (w) focus(w.el);
                }
            });
        });
    }

    function bindDock() {
        os.querySelectorAll('.dock-app, .dock-logo').forEach(b => {
            b.addEventListener('click', () => {
                const id = b.dataset.app;
                const w = open.get(id);
                if (w && w.minimized) { w.minimized = false; w.el.classList.remove('is-min'); focus(w.el); }
                else openWin(id);
            });
        });
    }

    function bindDockRight() {
        const theme = document.getElementById('os-theme-btn');
        theme.addEventListener('click', () => {
            const cur = html.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
            const next = cur === 'dark' ? 'light' : 'dark';
            html.setAttribute('data-theme', next);
            try { localStorage.setItem('sr-theme', next); } catch (e) { /* noop */ }
            theme.textContent = next === 'dark' ? 'LIGHT' : 'DARK';
        });

        document.getElementById('os-classic').addEventListener('click', leaveOS);
    }

    function toast(msg) {
        let t = os.querySelector('.os-toast');
        if (!t) {
            t = document.createElement('div');
            t.className = 'os-toast mono';
            desktop.appendChild(t);
        }
        t.textContent = '▸ ' + msg;
        t.classList.add('on');
        clearTimeout(t._t);
        t._t = setTimeout(() => t.classList.remove('on'), 2600);
    }

    function startClock() {
        const c = document.getElementById('os-clock');
        const u = document.getElementById('dock-up');
        const t0 = performance.now();
        const tickC = () => {
            c.textContent = new Date().toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata', hour12: false });
        };
        const tickU = () => {
            const s = Math.floor((performance.now() - t0) / 1000);
            const hh = String(Math.floor(s / 3600)).padStart(2, '0');
            const mm = String(Math.floor((s % 3600) / 60)).padStart(2, '0');
            const ss = String(s % 60).padStart(2, '0');
            u.textContent = 'UP ' + hh + ':' + mm + ':' + ss;
        };
        tickC(); tickU();
        window._osTimers = [setInterval(tickC, 1000), setInterval(tickU, 1000)];
    }

    function leaveOS() {
        if (window._osTimers) { window._osTimers.forEach(clearInterval); window._osTimers = null; }
        html.classList.remove('os-mode');
        document.body.classList.remove('os-active');
        os.hidden = true;
        let b = document.getElementById('os-relaunch');
        if (!b) {
            b = document.createElement('button');
            b.id = 'os-relaunch';
            b.className = 'mono';
            b.textContent = '⧉ SARANGOS';
            b.addEventListener('click', enterOS);
            document.body.appendChild(b);
        }
        b.hidden = false;
    }

    function enterOS() {
        const b = document.getElementById('os-relaunch');
        if (b) b.hidden = true;
        start();
    }

    // ---------- boot handshake ----------
    if (document.body.classList.contains('booted')) {
        start();
    } else {
        document.addEventListener('sr.booted', start, { once: true });
    }
})();