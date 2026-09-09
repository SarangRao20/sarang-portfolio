// ============================================
//   SARANG OS v2.7 — DESKTOP OVERLAY
//   Modern-desktop portfolio (Joey-de-Ruiter vibe)
//   Chrome: wallpaper, desktop icons, draggable
//   windows, taskbar+tray, start menu, live clock.
//   Classic is the default on every device; the OS boots via the relaunch pill or ?os=1
// ============================================

(function () {
    'use strict';

    const root = document.documentElement;
    const fine = () => matchMedia('(pointer: fine)').matches;
    const big = () => matchMedia('(min-width: 1024px)').matches;
    const rm = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
    const forced = new URLSearchParams(location.search).get('os') === '1';
    const armed = forced || new URLSearchParams(location.search).get('os') === '0' || (fine() && big() && !rm());

    if (!armed) return;

    const $ = (s, r) => (r || document).querySelector(s);
    const $$ = (s, r) => Array.prototype.slice.call((r || document).querySelectorAll(s));

    const D = (typeof data !== 'undefined') ? data : {};
    const esc = s => String(s).replace(/[&<>]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]));
    const link = (label, url, off) =>
        `<a class="text-link mono os-link" href="${url}"${off ? ' target="_blank" rel="noopener noreferrer"' : ''}>${label}</a>`;
    const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));

    // ===== PERSISTED SETTINGS (localStorage only) =====
    const SET = {
        get(k, d) { try { return localStorage.getItem('sr-' + k) === null ? d : localStorage.getItem('sr-' + k); } catch (e) { return d; } },
        set(k, v) { try { localStorage.setItem('sr-' + k, v); } catch (e) { /* private mode */ } }
    };

    // ===== SOUNDS (WebAudio, no assets) =====
    const SND = (() => {
        let ac = null, on = SET.get('sound', '1') === '1', armed = false, pending = false;
        const tone = (f, o) => {
            if (!on || !armed || typeof AudioContext === 'undefined') return;
            try {
                ac = ac || new AudioContext();
                if (ac.state === 'suspended') ac.resume();
                const t = ac.currentTime + (o.t || 0), d = o.dur || 0.07;
                const osc = ac.createOscillator(), g = ac.createGain();
                osc.type = o.type || 'square';
                osc.frequency.value = f;
                if (o.slide) osc.frequency.exponentialRampToValueAtTime(o.slide, t + d);
                g.gain.setValueAtTime(o.v || 0.025, t);
                g.gain.exponentialRampToValueAtTime(0.0001, t + d);
                osc.connect(g); g.connect(ac.destination);
                osc.start(t); osc.stop(t + d + 0.03);
            } catch (e) { /* audio blocked */ }
        };
        return {
            arm() {
                armed = true;
                try { ac = ac || new AudioContext(); if (ac.state === 'suspended') ac.resume(); } catch (e) {}
                if (pending) { pending = false; this.chime(); }
            },
            prime() {
                if (!on) return;
                pending = true;
                let c = 0;
                const t = setInterval(() => {
                    if (armed) { pending = false; clearInterval(t); this.chime(); }
                    else if (++c > 8) { pending = false; clearInterval(t); }
                }, 250);
            },
            isOn: () => on, setOn(v) { on = !!v; SET.set('sound', on ? '1' : '0'); },
            click: () => tone(560, { dur: 0.04, v: 0.018 }),
            open: () => { tone(640, {}); tone(900, { t: 0.05, dur: 0.07 }); },
            close: () => tone(320, { dur: 0.09, type: 'triangle', v: 0.03 }),
            min: () => tone(240, { dur: 0.05, type: 'triangle', v: 0.02 }),
            max: () => { tone(700, { dur: 0.06 }); tone(1000, { t: 0.04, dur: 0.06 }); },
            togg: () => tone(420, { dur: 0.05, type: 'triangle' }),
            chime() {
                tone(523, { dur: 0.4, type: 'sine', v: 0.05 });
                tone(659, { t: 0.1, dur: 0.45, type: 'sine', v: 0.05 });
                tone(784, { t: 0.2, dur: 0.8, type: 'sine', v: 0.05 });
            }
        };
    })();

    // ===== ONE-TIME WELCOME SPLASH STATS (marketing on mount) =====
    const SPLASH_STATS = [
        ['ROLE', 'AI TEAM LEAD — TENANCYPASS'],
        ['SHIPPED', (((typeof data !== 'undefined' && data.featuredProjects) || []).length || 0) + ' SYSTEMS ROI-READY'],
        ['GROWS', '5 AI INTERNS IN PRODUCTION'],
        ['STACK', 'RAG · MULTI-AGENT · VOICE AI · CV']
    ];

    // ===== ICON GLYPHS (monospace — no assets needed) =====
    const GLYPH = {
        about: '◉', projects: '▦', experience: '⌂', cases: '▤',
        terminal: '>_', resume: '⤓', contact: '@', settings: '⚙',
        explorer: '⧉', notepad: '✎', paint: '◐', calculator: '∑',
        guide: '?'
    };

    // ===== TXT RESUME (for export / cat resume) =====
    function buildTextResume() {
        const L = [];
        L.push('SARANG RAO — AI/ML ENGINEER');
        L.push('Production systems · multi-agent orchestration · RAG · voice AI · CV');
        L.push('');
        L.push('EMAIL   raosarang2006@gmail.com');
        L.push('PHONE   +91 94211 40800');
        L.push('GITHUB  https://github.com/SarangRao20');
        L.push('LINKEDIN https://linkedin.com/in/sarang-rao-262bbb324');
        L.push('');
        L.push('EXPERIENCE');
        ((typeof data !== 'undefined' && data.experience) || []).forEach(x => {
            L.push('· ' + x.role + ' — ' + x.org + ' (' + x.date + ')');
            (x.points || []).forEach(p => L.push('    - ' + p));
        });
        L.push('');
        L.push('SELECTED SYSTEMS');
        ((typeof data !== 'undefined' && data.featuredProjects) || []).forEach(p => {
            L.push('· ' + p.title + ' — ' + (p.category || ''));
            if (p.description) L.push('    ' + p.description);
            L.push('    stack: ' + ((p.tags || []).join(', ') || '-'));
        });
        L.push('');
        L.push('SKILLS');
        ((typeof data !== 'undefined' && data.skills) || []).forEach(s => L.push('· ' + s.group + ': ' + s.items.join(', ')));
        L.push('');
        L.push('ACHIEVEMENTS');
        L.push('· 2 ideathons won · Reliance Foundation Scholar — top 1%');
        L.push('');
        L.push('— generated from the SARANG OS resume panel —');
        return L.join('\n');
    }

    // ===== APPS =====
    function cloneDoc(id) {
        const src = document.getElementById(id);
        if (!src) return document.createElement('div');
        const c = src.cloneNode(true);
        $$('.reveal, .spec-row', c).forEach(el => el.classList.add('in'));
        $$('[data-count]', c).forEach(n => { n.textContent = n.dataset.count; });
        return c;
    }

    const APPS = {
        about: {
            title: 'ABOUT — THE SYSTEM',
            width: 860, height: 680,
            body() {
                const wrap = document.createElement('div');
                wrap.className = 'os-app os-about';
                const photoHTML = `
                    <div class="os-photo">
                        <picture>
                            <source srcset="Images/sarang.avif" type="image/avif">
                            <source srcset="Images/sarang.webp" type="image/webp">
                            <img class="os-photo-img" src="Images/sarang.jpg" alt="Portrait of Sarang Rao, AI / ML Engineer"
                                onerror="this.onerror=null;this.src='Images/sarang.jpg';this.removeAttribute('srcset');">
                        </picture>
                        <span class="os-photo-cap mono">FIG.1 — THE SYSTEM IN QUESTION</span>
                    </div>`;
                wrap.innerHTML = `
                    ${photoHTML}
                    <div class="os-about-main">
                        <p class="os-eyebrow mono">SARANG.RAO — TECHNICAL SPEC · HUMAN, GENERALLY CAPABLE</p>
                        <h2 class="os-about-name">Sarang Rao</h2>
                        <p class="os-about-role mono">AI / ML ENGINEER — PRODUCTION SYSTEMS, END TO END</p>
                        <div class="os-spec"></div>
                        <div class="os-actions">
                            <button class="btn btn-primary" data-open="projects" type="button">View projects</button>
                            <a class="btn btn-ghost" href="assets/sarang-rao-resume.pdf" download="Sarang-Rao-Resume.pdf"><span class="mono btn-suffix">.PDF</span>&nbsp;Resume</a>
                            <button class="btn btn-ghost" data-open="contact" type="button">Get in touch</button>
                        </div>
                    </div>`;
                wrap.querySelector('.os-spec').appendChild(cloneDoc('spec-card'));
                return wrap;
            }
        },

        projects: {
            title: 'PROJECTS — SELECTED SYSTEMS',
            width: 860, height: 660,
            body() {
                const wrap = document.createElement('div');
                wrap.className = 'os-app';
                wrap.appendChild(cloneDoc('featured-grid'));
                const more = cloneDoc('more-list');
                if (more && more.children.length) {
                    const det = document.createElement('details');
                    det.className = 'more-work os-more';
                    det.innerHTML = '<summary class="more-summary mono">MORE WORK <span class="more-chevron" aria-hidden="true">▾</span></summary>';
                    det.appendChild(more);
                    wrap.appendChild(det);
                }
                return wrap;
            }
        },

        experience: {
            title: 'EXPERIENCE — RUN LOG',
            width: 720, height: 620,
            body() {
                const wrap = document.createElement('div');
                wrap.className = 'os-app';
                wrap.appendChild(cloneDoc('bench-grid'));
                wrap.appendChild(cloneDoc('experience-log'));
                return wrap;
            }
        },

        cases: {
            title: 'CASE STUDIES — DEEP DIVES',
            width: 700, height: 600,
            body() {
                const wrap = document.createElement('div');
                wrap.className = 'os-app';
                const list = (D.featuredProjects || []).filter(p => p.caseStudy);
                list.push(D.additionalProjects ? (D.additionalProjects.find(p => p.caseStudy === 'battery') || {}) : {});
                const items = list.filter(p => p && p.title).map(p => {
                    const links = p.caseStudy
                        ? `<a class="text-link mono os-link" href="case.html?p=${p.caseStudy}">CASE STUDY ↗</a>`
                        : '';
                    const extra = (p.links || []).map(l => link(l.name, l.url, true)).join(' ');
                    const tags = (p.tags || []).map(t => `<span class="tag mono">${t}</span>`).join('');
                    return `
                        <article class="os-case">
                            <span class="os-case-type mono">[${esc(p.category || 'SYSTEM')}]</span>
                            <h3 class="os-case-title">${esc(p.title)}</h3>
                            ${p.subtitle ? `<p class="os-case-sub mono">${esc(p.subtitle)}</p>` : ''}
                            <p class="os-case-desc">${esc(p.description || '')}</p>
                            ${tags ? `<div class="tag-row os-case-tags">${tags}</div>` : ''}
                            <div class="link-row os-case-links">${links} ${extra}</div>
                        </article>`;
                }).join('');
                wrap.innerHTML = items || '<p class="os-muted mono">no case studies loaded.</p>';
                return wrap;
            }
        },

        notepad: {
            title: 'NOTEPAD — STICKY NOTES',
            width: 620, height: 470,
            body() {
                const wrap = document.createElement('div');
                wrap.className = 'os-app os-notepad';
                wrap.innerHTML = `
                    <textarea class="os-note-area mono" spellcheck="false" aria-label="notepad"></textarea>
                    <div class="os-note-foot mono">
                        <span class="os-note-count">0 CHARS</span>
                        <span class="os-note-save"></span>
                        <button class="os-tray-key os-note-clear" type="button">CLEAR</button>
                    </div>`;
                const ta = wrap.querySelector('.os-note-area');
                const ct = wrap.querySelector('.os-note-count');
                const sv = wrap.querySelector('.os-note-save');
                ta.value = SET.get('note', '');
                ct.textContent = ta.value.length + ' CHARS';
                let t;
                ta.addEventListener('input', () => {
                    ct.textContent = ta.value.length + ' CHARS';
                    sv.textContent = '...';
                    clearTimeout(t);
                    t = setTimeout(() => { SET.set('note', ta.value); sv.textContent = 'SAVED ✓'; }, 400);
                });
                wrap.querySelector('.os-note-clear').addEventListener('click', () => {
                    ta.value = '';
                    ct.textContent = '0 CHARS';
                    SET.set('note', '');
                    sv.textContent = 'CLEARED';
                });
                return wrap;
            }
        },

        explorer: {
            title: 'FILE EXPLORER — DATA VAULT',
            width: 760, height: 580,
            body() {
                const wrap = document.createElement('div');
                wrap.className = 'os-app os-explorer';
                const files = [
                    ['[DOC]', 'about.sys', 'SYSTEM PROFILE', '4.2 KB', 'about'],
                    ['[DOC]', 'featured-systems.doc', 'PROJECTS — SELECTED SYSTEMS', '12.6 KB', 'projects'],
                    ['[LOG]', 'run-log-2025.lst', 'EXPERIENCE — RUN LOG', '8.9 KB', 'experience'],
                    ['[CASE]', 'case-studies.db', 'DEEP DIVES', '6.4 KB', 'cases'],
                    ['[BIN]', 'sticky-notes.bin', 'NOTEPAD DATA', '0.2 KB', 'notepad'],
                    ['[TXT]', 'sarang-resume.txt', 'RESUME — CONTROL PANEL', '16.0 KB', 'resume'],
                    ['[SH]', 'terminal.sh', 'INTERACTIVE SHELL', 'N/A', 'terminal'],
                    ['[CFG]', 'desktop.settings', 'SETTINGS — SYSTEM CONTROL', '1.1 KB', 'settings'],
                    ['[ART]', 'sketchbook.paint', 'PAINT — PIXEL FORGE', '3.3 KB', 'paint'],
                    ['[CALC]', 'compute.calc', 'CALCULATOR — MATH UNIT', '0.9 KB', 'calculator']
                ];
                wrap.innerHTML = `
                    <div class="os-exp-path mono"><span>→ C:\</span><span>SYS</span><span>SARANGOS</span><span>v2.7</span></div>
                    <div class="os-exp-list">
                        ${files.map(f => `
                            <div class="os-exp-item mono" data-open="${f[4]}" tabindex="0" role="button">
                                <span class="os-exp-glyph">${f[0]}</span>
                                <span><b>${f[1]}</b><i class="os-muted"> — ${f[2]}</i></span>
                                <span class="os-exp-meta">${f[3]}</span>
                            </div>`).join('')}
                    </div>`;
                $$('.os-exp-item', wrap).forEach(it =>
                    it.addEventListener('click', () => WM.open(it.dataset.open)));
                return wrap;
            }
        },

        paint: {
            title: 'PAINT — PIXEL FORGE',
            width: 800, height: 580,
            body() {
                const wrap = document.createElement('div');
                wrap.className = 'os-app os-paint';
                wrap.innerHTML = `
                    <div class="os-paint-bar mono">
                        <span class="os-muted">INK</span>
                        ${['#11141C', '#1F31D6', '#0D9A58', '#E05233', '#F0C939', '#fff'].map((c, i) =>
                            `<button class="os-paint-swatch" data-c="${c}" style="background:${c}" aria-label="color ${i}"></button>`).join('')}
                        <span class="os-muted">SIZE</span>
                        ${[3, 8, 16].map(s => `<button class="os-paint-size" data-s="${s}" type="button">${s}</button>`).join('')}
                        <button class="os-tray-key os-paint-clear" type="button">CLEAR</button>
                        <button class="os-tray-key os-paint-save" type="button">SAVE PNG</button>
                    </div>
                    <canvas class="os-paint-canvas" width="620" height="420" aria-label="paint canvas"></canvas>`;
                const cv = wrap.querySelector('canvas');
                const ctx0 = cv.getContext('2d');
                ctx0.fillStyle = '#fff';
                ctx0.fillRect(0, 0, cv.width, cv.height);
                let color = '#11141C', size = 8, drawing = false;
                let last = null;
                const pos = e => {
                    const r = cv.getBoundingClientRect();
                    return { x: (e.clientX - r.left) * (cv.width / r.width), y: (e.clientY - r.top) * (cv.height / r.height) };
                };
                cv.addEventListener('pointerdown', e => {
                    drawing = true; last = pos(e);
                    cv.setPointerCapture(e.pointerId);
                    SND.click();
                });
                cv.addEventListener('pointermove', e => {
                    if (!drawing) return;
                    const p = pos(e);
                    ctx0.lineWidth = size; ctx0.lineCap = 'round'; ctx0.lineJoin = 'round';
                    ctx0.strokeStyle = color;
                    ctx0.beginPath();
                    ctx0.moveTo(last.x, last.y);
                    ctx0.lineTo(p.x, p.y);
                    ctx0.stroke();
                    last = p;
                });
                cv.addEventListener('pointerup', () => drawing = false);
                $$('.os-paint-swatch', wrap).forEach(b =>
                    b.addEventListener('click', () => { color = b.dataset.c; SND.togg(); }));
                $$('.os-paint-size', wrap).forEach(b =>
                    b.addEventListener('click', () => { size = +b.dataset.s; SND.togg(); }));
                wrap.querySelector('.os-paint-clear').addEventListener('click', () => {
                    ctx0.fillStyle = '#fff'; ctx0.fillRect(0, 0, cv.width, cv.height);
                });
                wrap.querySelector('.os-paint-save').addEventListener('click', () => {
                    const a = document.createElement('a');
                    a.href = cv.toDataURL('image/png');
                    a.download = 'sarang-sketch.png';
                    document.body.appendChild(a);
                    a.click();
                    a.remove();
                });
                return wrap;
            }
        },

        calculator: {
            title: 'CALCULATOR — MATH UNIT',
            width: 420, height: 520,
            body() {
                const wrap = document.createElement('div');
                wrap.className = 'os-app os-calculator';
                const keys = ['C', '±', '%', '÷', '7', '8', '9', '×', '4', '5', '6', '−', '1', '2', '3', '+', '0', '.', '=', '⌫'];
                wrap.innerHTML = `
                    <div class="os-calc-display mono">0</div>
                    <div class="os-calc-grid">
                        ${keys.map(k => `<button class="mono${'+-×÷='.indexOf(k) > -1 ? ' op' : ''}${k === '=' ? ' eq' : ''}" data-k="${k}" type="button">${k}</button>`).join('')}
                    </div>`;
                const disp = wrap.querySelector('.os-calc-display');
                let a = null, op = null, cur = '0';
                const render = () => { disp.textContent = (cur === '' ? '0' : cur); };
                const fmt = v => String(parseFloat(v.toFixed(10)));
                wrap.querySelectorAll('.os-calc-grid button').forEach(b => {
                    b.addEventListener('click', () => {
                        const k = b.dataset.k;
                        SND.click();
                        if (/[0-9]/.test(k)) {
                            cur = cur === '0' ? k : (cur.length < 16 ? cur + k : cur);
                        } else if (k === '.') {
                            if (cur.indexOf('.') < 0) cur += '.';
                        } else if (k === '⌫') {
                            cur = cur.length > 1 ? cur.slice(0, -1) : '0';
                        } else if (k === 'C') {
                            a = null; op = null; cur = '0';
                        } else if (k === '±') {
                            cur = cur && cur !== '0' ? (cur[0] === '-' ? cur.slice(1) : '-' + cur) : cur;
                        } else if (k === '%') {
                            cur = fmt(parseFloat(cur || '0') / 100);
                        } else if (['+', '−', '×', '÷'].indexOf(k) > -1) {
                            if (op && cur !== '') { a = calc(a, parseFloat(cur), op); cur = ''; }
                            else a = parseFloat(cur || '0'), cur = '';
                            op = k;
                        } else if (k === '=') {
                            if (op !== null) {
                                cur = fmt(calc(a, parseFloat(cur || '0'), op));
                                a = null; op = null;
                            }
                        }
                        render();
                    });
                });
                function calc(x, y, o) {
                    switch (o) {
                        case '+': return x + y;
                        case '−': return x - y;
                        case '×': return x * y;
                        case '÷': return y === 0 ? NaN : x / y;
                    }
                }
                return wrap;
            }
        },

        settings: {
            title: 'SETTINGS — SYSTEM CONTROL',
            width: 780, height: 660,
            body() {
                const wrap = document.createElement('div');
                wrap.className = 'os-app os-settings';
                const theme = root.getAttribute('data-theme');
                const accent = root.getAttribute('data-accent');
                const wall = root.getAttribute('data-wall');
                const seg = (items, curVal, onChange) =>
                    `<div class="os-set-seg">${items.map(i =>
                        `<button type="button" data-v="${i}" class="${i === curVal ? 'is-on' : ''}">${i}</button>`).join('')}</div>`;
                wrap.innerHTML = `
                    <div class="os-set-row"><span class="os-set-label">THEME</span>${seg(['LIGHT', 'DARK', 'AMOLED'], theme.toUpperCase(), 'theme')}</div>
                    <div class="os-set-row"><span class="os-set-label">ACCENT</span>
                        <div class="os-set-accents">${ACCENTS.map(a =>
                            `<button class="os-set-swatch is-${a}${a === accent ? ' is-on' : ''}" data-a="${a}" aria-label="accent ${a}"
                                style="background:${({ blue: '#1F31D6', green: '#0D9A58', coral: '#E05233', purple: '#7C3AED', lime: '#2F9E3F' })[a]}"></button>`).join('')}</div></div>
                    <div class="os-set-row"><span class="os-set-label">WALLPAPER</span>${seg(['GRID', 'PULSE', 'CODE'], wall.toUpperCase(), 'wall')}</div>
                    <div class="os-set-row"><span class="os-set-label">MATRIX RAIN</span>${seg(['ON', 'OFF'], SET.get('rain', '1') === '1' ? 'ON' : 'OFF', 'rain')}</div>
                    <div class="os-set-row"><span class="os-set-label">STARTUP SOUND</span>${seg(['ON', 'OFF'], SND.isOn() ? 'ON' : 'OFF', 'sound')}</div>
                    <div class="os-set-row"><span class="os-set-label">CRT SCANLINES</span>${seg(['ON', 'OFF'], SET.get('crt', '0') === '1' ? 'ON' : 'OFF', 'crt')}</div>
                    <div class="os-set-row"><span class="os-set-label">DIM ROOM</span>${seg(['ON', 'OFF'], SET.get('dim', '0') === '1' ? 'ON' : 'OFF', 'dim')}</div>
                    <div class="os-set-row"><span class="os-set-label">CLOCK WIDGET</span>${seg(['ON', 'OFF'], (SET.get('clock', '1') === '1' ? 'ON' : 'OFF'), 'clock')}</div>
                    <div class="os-set-row"><span class="os-set-label">PERSISTENCE</span><span class="os-muted">all choices saved to this browser (localStorage) — reboot-safe.</span></div>`;
                const touch = () => { hideCtx(); SND.togg(); };
                wrap.querySelectorAll('.os-set-row').forEach(row => {
                    row.querySelectorAll('button[data-v]').forEach(b => {
                        b.addEventListener('click', () => {
                            const key = row.querySelector('.os-set-label').textContent.toLowerCase().replace(/ /g, '');
                            const v = b.dataset.v;
                            row.querySelectorAll('button').forEach(x => x.classList.remove('is-on'));
                            b.classList.add('is-on');
                            if (key === 'theme') applyTheme(v.toLowerCase());
                            else if (key === 'wallpaper') applyWall(v.toLowerCase());
                            else if (key === 'matrixrain') { SET.set('rain', v === 'ON' ? '1' : '0'); applyFX(); }
                            else if (key === 'startupsound') SND.setOn(v === 'ON');
                            else if (key === 'crtscanlines') { SET.set('crt', v === 'ON' ? '1' : '0'); applyFX(); }
                            else if (key === 'dimroom') { SET.set('dim', v === 'ON' ? '1' : '0'); applyFX(); }
                            else if (key === 'clockwidget') { SET.set('clock', v === 'ON' ? '1' : '0'); wclock.hidden = v !== 'ON'; }
                            touch();
                        });
                    });
                });
                wrap.querySelectorAll('.os-set-swatch').forEach(s =>
                    s.addEventListener('click', () => {
                        wrap.querySelectorAll('.os-set-swatch').forEach(x => x.classList.remove('is-on'));
                        s.classList.add('is-on');
                        applyAccent(s.dataset.a);
                        touch();
                    }));
                return wrap;
            }
        },

        resume: {
            title: 'RESUME — CONTROL PANEL',
            width: 960, height: 680,
            body() {
                const wrap = document.createElement('div');
                wrap.className = 'os-app os-resume';
                wrap.innerHTML = `
                    <div class="os-tabs mono">
                        <button type="button" class="os-tab is-on" data-p="pdf">VIEW PDF</button>
                        <button type="button" class="os-tab" data-p="sum">QUICK SUMMARY</button>
                    </div>
                    <div class="os-resume-panels">
                        <div class="os-panel os-resume-pdf" data-p="pdf">
                            <div class="os-resume-toolbar mono">
                                <span class="os-resume-file">SARANG_RAO_RESUME_OS.PDF</span>
                                <a class="btn btn-ghost os-resume-dl" href="assets/sarang-rao-resume-os.pdf" download="Sarang-Rao-Resume-OS.pdf">DOWNLOAD<span class="mono btn-suffix">.PDF</span></a>
                                <a class="btn btn-ghost os-resume-mail" href="mailto:raosarang2006@gmail.com?subject=Role%20for%20you%20—%20Sarang%20Rao">EMAIL A ROLE</a>
                            </div>
                            <iframe class="os-resume-frame" src="assets/sarang-rao-resume-os.pdf" title="Sarang Rao — OS-styled resume"></iframe>
                            <div class="os-resume-fallback mono">no pdf viewer? <a href="assets/sarang-rao-resume-os.pdf" download="Sarang-Rao-Resume-OS.pdf">download instead</a></div>
                        </div>
                        <div class="os-panel" data-p="sum" hidden>
                            <div class="os-resume-kv mono">
                                <div class="kv"><span>NAME</span><b>Sarang Rao</b></div>
                                <div class="kv"><span>ROLE</span><b>AI / ML Engineer — end to end</b></div>
                                <div class="kv"><span>BASE</span><b>Pune, India · IST</b></div>
                                <div class="kv"><span>EMAIL</span><b>raosarang2006@gmail.com</b></div>
                                <div class="kv"><span>GITHUB</span><b>@SarangRao20</b></div>
                                <div class="kv"><span>SIGNAL</span><b>+91 94211 40800</b></div>
                            </div>
                            <div class="os-resume-exports">
                                <button class="btn btn-primary os-export-txt" type="button">Export as .TXT<span class="mono btn-suffix">.TXT</span></button>
                                <p class="os-muted">plain-text copy — for ATS, portals &amp; quick paste, not just the PDF.</p>
                            </div>
                        </div>
                    </div>`;
                const tabs = $$('.os-tab', wrap);
                const panels = $$('.os-panel', wrap);
                const sel = p => {
                    tabs.forEach(t => t.classList.toggle('is-on', t.dataset.p === p));
                    panels.forEach(pl => { pl.hidden = pl.dataset.p !== p; });
                };
                tabs.forEach(t => t.addEventListener('click', () => sel(t.dataset.p)));
                wrap.querySelector('.os-export-txt').addEventListener('click', () => {
                    const txt = buildTextResume();
                    const blob = new Blob([txt], { type: 'text/plain;charset=utf-8' });
                    const a = document.createElement('a');
                    a.href = URL.createObjectURL(blob);
                    a.download = 'Sarang-Rao-Resume.txt';
                    document.body.appendChild(a);
                    a.click();
                    a.remove();
                    setTimeout(() => URL.revokeObjectURL(a.href), 3000);
                    const b = wrap.querySelector('.os-export-txt');
                    b.textContent = 'EXPORTED ✓';
                    setTimeout(() => { b.textContent = 'Export as .TXT.TXT'; }, 1800);
                });
                buildTextResume.wrapRef = wrap;
                return wrap;
            }
        },

        terminal: {
            title: 'TERMINAL — INTERACTIVE SHELL',
            width: 680, height: 480,
            body() {
                const wrap = document.createElement('div');
                wrap.className = 'os-app os-term';
                wrap.innerHTML = `
                    <div class="os-term-screen" role="log" aria-live="polite"></div>
                    <div class="os-term-prompt mono">
                        <span class="os-term-ps1">sarang@os:~$</span>
                        <span class="os-term-cmd"></span>
                        <span class="os-term-caret" aria-hidden="true"></span>
                        <input class="os-term-input mono" type="text" autocomplete="off" spellcheck="false" aria-label="terminal command">
                    </div>`;
                initTerm(wrap);
                return wrap;
            }
        },

        contact: {
            title: 'CONTACT — INFERENCE',
            width: 640, height: 600,
            body() {
                const wrap = document.createElement('div');
                wrap.className = 'os-app os-contact';
                wrap.innerHTML = `
                    <div class="os-contact-meta mono">
                        <div class="meta-row"><span class="spec-key mono">EMAIL</span>
                            <span class="meta-email">raosarang2006@gmail.com
                                <button type="button" class="copy-btn mono os-copy" data-email="raosarang2006@gmail.com">COPY</button></span></div>
                        <div class="meta-row"><span class="spec-key mono">PHONE</span><a href="tel:+919421140800">+91 94211 40800</a></div>
                        <div class="meta-row"><span class="spec-key mono">LINKEDIN</span><a href="https://linkedin.com/in/sarang-rao-262bbb324" target="_blank" rel="noopener noreferrer">in/sarang-rao-262bbb324 ↗</a></div>
                        <div class="meta-row"><span class="spec-key mono">GITHUB</span><a href="https://github.com/SarangRao20" target="_blank" rel="noopener noreferrer">@SarangRao20 ↗</a></div>
                        <div class="meta-row"><span class="spec-key mono">LEETCODE</span><a href="https://leetcode.com/u/SarangRao" target="_blank" rel="noopener noreferrer">u/SarangRao ↗</a></div>
                    </div>
                    <form class="os-form" novalidate>
                        <label class="mono os-form-label" for="osf-name">Your Name</label>
                        <input class="mono os-field" id="osf-name" name="name" required maxlength="100" placeholder="Your name" autocomplete="name">
                        <label class="mono os-form-label" for="osf-email">Your Email</label>
                        <input class="mono os-field" id="osf-email" name="email" type="email" required maxlength="150" placeholder="you@company.com" autocomplete="email">
                        <label class="mono os-form-label" for="osf-msg">Message</label>
                        <textarea class="mono os-field" id="osf-msg" name="message" required maxlength="2000" rows="4" placeholder="Role, problem, idea…"></textarea>
                        <button class="btn btn-primary os-send" type="submit">Send message →</button>
                        <p class="form-status mono os-status" role="status" aria-live="polite"></p>
                    </form>`;
                initContact(wrap.querySelector('.os-form'), wrap.querySelector('.os-status'), wrap.querySelector('.os-copy'));
                return wrap;
            }
        },

        guide: {
            title: 'GUIDE — SYSTEM MANUAL',
            width: 780, height: 640,
            body() { return buildGuideBody(); }
        }
    };

const DESKTOP = ['about', 'projects', 'experience', 'cases', 'terminal', 'explorer', 'notepad', 'settings', 'resume', 'contact'];

// ===== GUIDE — SYSTEM MANUAL (what / how / why) =====
function buildGuideBody() {
    const wrap = document.createElement('div');
    wrap.className = 'os-app os-guide';
    const KBD = [
        ['F1', 'open this manual, anywhere'],
        ['ESC', 'close the active window'],
        ['SR ↖ start', 'switch apps like a launcher'],
        ['drag title bar', 'move a window'],
        ['double-click title', 'maximize / restore'],
        ['↑ · ↓', 'walk terminal history'],
        ['right-click desktop', 'wallpaper · theme · settings'],
        ['settings → FX', 'matrix rain, CRT, dim, sound']
    ];
    wrap.innerHTML = `
        <section class="os-guide-sec">
            <p class="os-guide-k mono">WHAT IS THIS?</p>
            <p class="os-guide-body">Not a product — a <b>living CV</b>. A portfolio that wears an operating system: every window, shell, canvas and pixel is hand-written HTML/CSS/JS — no frameworks, no templates. It exists as proof of what one person can design and ship.</p>
        </section>
        <section class="os-guide-sec">
            <p class="os-guide-k mono">HOW TO MOVE</p>
            <div class="os-guide-keys">${KBD.map(k => `<div class="os-guide-kbd"><kbd>${k[0]}</kbd><span>${k[1]}</span></div>`).join('')}</div>
        </section>
        <section class="os-guide-sec">
            <p class="os-guide-k mono">THINGS TO TRY</p>
            <ol class="os-guide-try">
                <li>Open <b>Terminal</b> and type <b>help</b> — every command, on tap.</li>
                <li>Type <b>ask "what have you built?"</b> — Gemini answers about Sarang only.</li>
                <li><b>cat resume.txt</b> · <b>neofetch</b> · <b>banner</b> · <b>whoami</b></li>
                <li>Right-click the desktop → <b>WALLPAPER →</b> to re-skin the OS.</li>
                <li>Open <b>Settings</b> → FX: matrix rain, CRT flicker, dim, sound.</li>
            </ol>
        </section>
        <section class="os-guide-sec">
            <p class="os-guide-k mono">FRONT DOOR</p>
            <p class="os-guide-body"><b>About</b> = who · <b>Projects</b> = what shipped · <b>Experience</b> = where worked · <b>Cases</b> = how it failed &amp; got fixed · <b>Resume</b> = take it with you · <b>Contact</b> = reach me. Start with <b>About</b>.</p>
        </section>
        <div class="os-guide-actions">
            <button class="btn btn-primary" data-open="about" type="button">About</button>
            <button class="btn btn-ghost" data-open="projects" type="button">Projects</button>
            <button class="btn btn-ghost" data-open="terminal" type="button">Terminal</button>
            <button class="btn btn-ghost" data-open="contact" type="button">Contact</button>
        </div>`;
    return wrap;
}
const ALL_APPS = DESKTOP.concat(['guide', 'paint', 'calculator']);

    // ===== WINDOW MANAGER =====
    const layer = $('#os-layer');
    const tasksEl = $('#os-tasks');
    const START = $('#os-start');
    const SARANGOS = $('#sarangos');

    const WM = {
        z: 100, wins: {}, order: [], active: null, min: {},

        open(id) {
            const app = APPS[id];
            if (!app) return;
            if (this.wins[id]) { this.restore(id); return; }
            const win = document.createElement('section');
            win.className = 'os-window';
            win.dataset.app = id;
            win.style.width = Math.min(app.width, innerWidth - 120) + 'px';
            win.style.height = Math.min(app.height, innerHeight - 150) + 'px';
            win.innerHTML = `
                <header class="os-title mono">
                    <span class="os-dots" aria-hidden="true"><i></i><i></i><i></i></span>
                    <span class="os-title-txt">${esc(app.title)}</span>
                    <span class="os-title-tools">
                        <button class="os-min mono" type="button" aria-label="Minimize">–</button>
                        <button class="os-close mono" type="button" aria-label="Close">×</button>
                    </span>
                </header>
                <div class="os-win-body"></div>`;
            win.querySelector('.os-win-body').appendChild(app.body());
            layer.appendChild(win);

            const off = (this.order.length * 26) % 130;
            win.style.left = (clamp((innerWidth - app.width) / 2 + off, 8, innerWidth - 120)) + 'px';
            win.style.top = (clamp((innerHeight - app.height) / 2 + off - 20, 4, innerHeight - 160)) + 'px';

            this.wins[id] = win;
            this.order.push(id);
            this.focus(id);
            this.renderTasks();
            SND.open();
            if (rm()) win.classList.add('no-anim');
            return win;
        },

        focus(id) {
            const win = this.wins[id];
            if (!win) return;
            this.z++;
            win.style.zIndex = this.z;
            this.idx(id, this.order.length - 1);
            if (this.active) this.active.classList.remove('active');
            (this.active = win).classList.add('active');
            if (!rm()) {
                win.classList.remove('os-flash');
                void win.offsetWidth;
                win.classList.add('os-flash');
            }
            this.renderTasks();
        },

        idx(id, to) {
            const i = this.order.indexOf(id);
            if (i > -1) { this.order.splice(i, 1); this.order.push(id); }
        },

        close(id) {
            const win = this.wins[id];
            if (!win) return;
            if (rm()) return this._drop(id);
            win.classList.add('os-closing');
            setTimeout(() => this._drop(id), 150);
        },

        _drop(id) {
            const win = this.wins[id];
            if (!win) return;
            delete this.wins[id];
            delete this.min[id];
            win.remove();
            const i = this.order.indexOf(id);
            if (i > -1) this.order.splice(i, 1);
            if (this.active === win) {
                this.active = null;
                const last = this.order[this.order.length - 1];
                if (last) this.focus(last);
            }
            this.renderTasks();
        },

        minimize(id) {
            const win = this.wins[id];
            if (!win) return;
            SND.min();
            const r = win.getBoundingClientRect();
            const btn = tasksEl.querySelector('.os-task[data-app="' + id + '"]');
            const t = btn ? btn.getBoundingClientRect() : { left: innerWidth / 2, top: innerHeight - 26, width: 0, height: 20 };
            const dx = t.left + t.width / 2 - (r.left + r.width / 2);
            const dy = t.top + t.height / 2 - (r.top + r.height / 2);
            this.min[id] = { dx, dy };
            if (rm()) {
                win.classList.add('os-minimized');
            } else {
                win.classList.add('os-no-anim');
                win.animate([
                    { transform: 'none' },
                    { transform: `translate(${dx}px,${dy}px) scale(.1)` },
                    { transform: `translate(${dx}px,${dy}px) scale(0)`, opacity: 0 }
                ], { duration: 250, easing: 'cubic-bezier(.6,0,.85,.35)' }).onfinish =
                    () => { win.classList.add('os-minimized'); win.classList.remove('os-no-anim'); };
            }
            if (this.active === win) {
                this.active = null;
                const last = this.order[this.order.length - 1];
                if (last && this.wins[last]) this.focus(last);
            }
            this.renderTasks();
        },

        restore(id) {
            const win = this.wins[id];
            if (!win) return;
            const m = this.min[id];
            this.min[id] = false;
            win.classList.remove('os-minimized');
            if (!rm() && m) {
                win.classList.add('os-no-anim');
                win.animate([
                    { transform: `translate(${m.dx}px,${m.dy}px) scale(.08)`, opacity: 0 },
                    { transform: 'none', opacity: 1 }
                ], { duration: 230, easing: 'cubic-bezier(.2,.8,.25,1)' }).onfinish = () => win.classList.remove('os-no-anim');
            }
            this.focus(id);
        },

        maxed: {},

        maximize(id) {
            const win = this.wins[id];
            if (!win || win.classList.contains('os-minimized')) return;
            if (this.maxed[id]) return this.unmax(id);
            win.dataset.prev = JSON.stringify({ l: win.style.left, t: win.style.top, w: win.style.width, h: win.style.height });
            this.maxed[id] = true;
            win.classList.add('os-maxed');
            win.style.left = '0';
            win.style.top = '0';
            win.style.width = '100%';
            win.style.height = 'calc(100% - 52px)';
            SND.max();
            this.focus(id);
        },

        unmax(id) {
            const win = this.wins[id];
            if (!win || !this.maxed[id]) return;
            this.maxed[id] = false;
            win.classList.remove('os-maxed');
            let p = {};
            try { p = JSON.parse(win.dataset.prev || '{}'); } catch (e) { p = {}; }
            if (p.l) win.style.left = p.l;
            if (p.t) win.style.top = p.t;
            if (p.w) win.style.width = p.w;
            if (p.h) win.style.height = p.h;
            this.focus(id);
        },

        snap(id, side) {
            const win = this.wins[id];
            if (!win) return;
            if (!win.dataset.prev) {
                win.dataset.prev = JSON.stringify({ l: win.style.left, t: win.style.top, w: win.style.width, h: win.style.height });
            }
            win.classList.remove('os-snap-l', 'os-snap-r');
            win.style.left = side === 'r' ? '50vw' : '0';
            win.style.top = '0';
            win.style.width = '50vw';
            win.style.height = 'calc(100% - 52px)';
            win.style.maxWidth = 'none';
            win.classList.add(side === 'r' ? 'os-snap-r' : 'os-snap-l');
            SND.max();
            this.focus(id);
        },

        unsnap(id) {
            const win = this.wins[id];
            if (!win) return;
            win.classList.remove('os-snap-l', 'os-snap-r');
            let p = {};
            try { p = JSON.parse(win.dataset.prev || '{}'); } catch (e) { p = {}; }
            if (p.l) win.style.left = p.l;
            if (p.t) win.style.top = p.t;
            if (p.w) win.style.width = p.w;
            if (p.h) win.style.height = p.h;
        },

        renderTasks() {
            tasksEl.innerHTML = this.order.map(id => {
                const app = APPS[id];
                const active = this.active && this.active.dataset.app === id;
                const hidden = !!this.min[id];
                return `<button class="os-task mono${active ? ' is-active' : ''}${hidden ? ' is-min' : ''}" data-app="${id}" type="button">
                    <span class="os-task-glyph">${GLYPH[id] || '•'}</span><span>${esc(app.title.split('—')[0].trim())}</span></button>`;
            }).join('') || '<span class="os-tasks-empty mono">—</span>';
        }
    };

    // ===== WINDOW EVENTS (event delegation) =====
    layer.addEventListener('pointerdown', e => {
        if (e.target.closest('.os-close')) {
            const w = e.target.closest('.os-window');
            SND.close();
            WM.close(w.dataset.app);
        } else if (e.target.closest('.os-min')) {
            const w = e.target.closest('.os-window');
            WM.minimize(w.dataset.app);
        } else if (e.target.closest('.os-window')) {
            WM.focus(e.target.closest('.os-window').dataset.app);
        } else if (e.target.closest('[data-open]')) {
            WM.open(e.target.closest('[data-open]').dataset.open);
        }
    });

    layer.addEventListener('click', e => {
        const d = e.target.closest('[data-open]');
        if (d) WM.open(d.dataset.open);
    });

    // Drag via titlebar (with top-edge maximize + left/right snap)
    const dragState = { win: null, dx: 0, dy: 0, moved: false };
    layer.addEventListener('pointerdown', e => {
        const t = e.target.closest('.os-title');
        if (!t || e.target.closest('button')) return;
        const win = t.closest('.os-window');
        WM.focus(win.dataset.app);
        const id = win.dataset.app;
        if (WM.maxed[id]) WM.unmax(id);
        else if (win.classList.contains('os-snap-l') || win.classList.contains('os-snap-r')) WM.unsnap(id);
        const r = win.getBoundingClientRect();
        dragState.win = win;
        dragState.dx = e.clientX - r.left;
        dragState.dy = e.clientY - r.top;
        dragState.moved = false;
        win.setPointerCapture(e.pointerId);
        win.classList.add('os-dragging');
    });
    layer.addEventListener('dblclick', e => {
        const t = e.target.closest('.os-title');
        if (!t || e.target.closest('button')) return;
        WM.maximize(t.closest('.os-window').dataset.app);
    });
    layer.addEventListener('pointermove', e => {
        const w = dragState.win;
        if (!w) return;
        if (Math.abs(e.clientX - w.getBoundingClientRect().left - dragState.dx)
            + Math.abs(e.clientY - w.getBoundingClientRect().top - dragState.dy) > 3) dragState.moved = true;
        const r = w.getBoundingClientRect();
        w.style.left = clamp(e.clientX - dragState.dx, -(r.width - 140), innerWidth - 60) + 'px';
        w.style.top = clamp(e.clientY - dragState.dy, 0, innerHeight - 52) + 'px';
        root.classList.toggle('os-zone-top', (e.clientY - dragState.dy) < 6);
    });
    layer.addEventListener('pointerup', e => {
        const w = dragState.win;
        if (w) {
            dragState.win = null;
            w.classList.remove('os-dragging');
            root.classList.remove('os-zone-top');
            if (dragState.moved) {
                const r = w.getBoundingClientRect();
                const id = w.dataset.app;
                if (r.top < 6) WM.maximize(id);
                else if (r.left <= 3) WM.snap(id, 'l');
                else if (innerWidth - (r.left + r.width) <= 3) WM.snap(id, 'r');
            }
        }
    });

    // Taskbar app buttons
    tasksEl.addEventListener('click', e => {
        const b = e.target.closest('.os-task');
        if (!b) return;
        const id = b.dataset.app;
        if (WM.min[id]) WM.restore(id);
        else if (WM.active && WM.active.dataset.app === id) WM.minimize(id);
        else WM.focus(id);
    });

    // ===== DESKTOP ICONS =====
    const iconsEl = $('#os-icons');
    iconsEl.innerHTML = DESKTOP.map(id => `
        <button class="os-icon" data-open="${id}" type="button">
            <span class="os-icon-glyph mono" aria-hidden="true">${GLYPH[id]}</span>
            <span class="os-icon-label mono">${id.toUpperCase()}</span>
        </button>`).join('');
    iconsEl.addEventListener('click', e => {
        const b = e.target.closest('.os-icon');
        if (b) { WM.open(b.dataset.open); iconsEl.classList.add('os-hint-off'); }
    });

    // ===== START MENU =====
    function buildStart() {
        START.innerHTML = `
            <div class="os-start-head mono"><span class="os-start-logo">SR</span>
                <span>Sarang Rao <i class="os-start-sub">— AI/ML engineer</i></span></div>
            <div class="os-start-quick mono">
                <button class="btn btn-ghost" data-open="about" type="button">ABOUT</button>
                <button class="btn btn-ghost" data-open="projects" type="button">PROJECTS</button>
                <button class="btn btn-ghost" data-open="terminal" type="button">TERMINAL</button>
                <button class="btn btn-ghost" data-open="guide" type="button">GUIDE · F1</button>
            </div>
            <div class="os-start-apps">
                ${ALL_APPS.map(id => `
                    <button class="os-start-app mono" data-app="${id}" type="button">
                        <span class="os-task-glyph">${GLYPH[id]}</span>
                        <span class="os-start-app-n">${id[0].toUpperCase() + id.slice(1)}</span>
                        <span class="os-start-app-d">${esc(APPS[id].title.split('—')[1] || '')}</span>
                    </button>`).join('')}
            </div>
            <div class="os-start-foot mono">
                <span>SARANG OS v2.9.6</span><i></i><span>PUNE · INDIA</span><i></i><span>IST <em id="os-start-clock">--:--:--</em></span>
            </div>
            <p class="os-start-tip mono">F1 = guide · ESC = close window · right-click desktop = wallpaper</p>`;
        START.querySelectorAll('.os-start-app').forEach(b =>
            b.addEventListener('click', () => { WM.open(b.dataset.app); closeStart(); }));
    }
    function openStart() {
        buildStart();
        START.hidden = false;
        requestAnimationFrame(() => START.classList.add('os-open'));
        $('#os-startbtn').setAttribute('aria-expanded', 'true');
    }
    function closeStart() {
        START.classList.remove('os-open');
        setTimeout(() => { START.hidden = true; }, 130);
        $('#os-startbtn').setAttribute('aria-expanded', 'false');
    }
    $('#os-startbtn').addEventListener('click', () => {
        START.hidden || START.classList.contains('os-open') ? closeStart() : openStart();
    });
    document.addEventListener('pointerdown', e => {
        if (!START.hidden && !e.target.closest('#os-start') && !e.target.closest('#os-startbtn')) closeStart();
    });

    // ===== TRAY: clock / theme / classic swtich =====
    const clockFmt = new Intl.DateTimeFormat('en-GB', {
        timeZone: 'Asia/Kolkata', hour12: true, hour: '2-digit', minute: '2-digit', second: '2-digit'
    });
    function tickClock() {
        const t = clockFmt.format(new Date());
        $('#os-clock').textContent = t;
        const sc = $('#os-start-clock');
        if (sc) sc.textContent = t;
    }
    tickClock();
    setInterval(tickClock, 1000);

    const themeBtn = $('#os-theme');

    const THEMES = ['light', 'dark', 'amoled'];
    const ACCENTS = ['blue', 'green', 'coral', 'purple', 'lime'];
    const WALLS = ['grid', 'pulse', 'code'];
    const cur = i => typeof i === 'string' ? i : 'grid';

    function applyTheme(mode) {
        const m = THEMES.indexOf(mode) > -1 ? mode : 'light';
        root.setAttribute('data-theme', m);
        themeBtn.textContent = m === 'amoled' ? 'AMOLED' : m === 'dark' ? 'LIGHT' : 'DARK';
        const meta = document.querySelector('meta[name="theme-color"]');
        if (meta) meta.setAttribute('content', m === 'dark' ? '#101119' : m === 'amoled' ? '#000' : '#F5F3EC');
        SET.set('theme', m);
    }
    function applyAccent(a) {
        root.setAttribute('data-accent', ACCENTS.indexOf(a) > -1 ? a : 'blue');
        SET.set('accent', root.getAttribute('data-accent'));
    }
    function applyWall(w) {
        root.setAttribute('data-wall', WALLS.indexOf(w) > -1 ? w : 'grid');
        SET.set('wall', root.getAttribute('data-wall'));
    }
    function nextWall() {
        const list = WALLS;
        const i = list.indexOf(root.getAttribute('data-wall'));
        applyWall(list[(i + 1) % list.length]);
        SND.togg();
    }
    function applyFX() { /* crt + dim toggles */
        document.getElementById('os-crt').hidden = SET.get('crt', '0') !== '1';
        document.getElementById('os-dim').hidden = SET.get('dim', '0') !== '1';
        const rain = document.getElementById('os-rain');
        if (!rain) return;
        if (SET.get('rain', '1') !== '1' || matchMedia('(prefers-reduced-motion: reduce)').matches) {
            if (RAIN.stop) RAIN.stop();
        } else {
            RAIN.start();
        }
    }
    /* Live re-apply bridge for the CLASSIC terminal (theme/accent/wall/fx set outside the OS) */
    window.OSFX = function OSEFX() {
        if (!root.classList.contains('os-mode')) return;
        applyTheme(root.getAttribute('data-theme'));
        applyAccent(root.getAttribute('data-accent'));
        applyWall(root.getAttribute('data-wall'));
        applyFX();
        const wc = document.getElementById('os-wclock');
        if (wc) wc.hidden = SET.get('clock', '1') !== '1';
    };
    const RAIN = (() => {
        const cv = document.getElementById('os-rain');
        const ctx = cv ? cv.getContext('2d') : null;
        const FS = 14;
        let cols = [], on = false, raf = 0, last = 0;
        function size() {
            cv.width = innerWidth; cv.height = innerHeight;
            cols = Array.from({ length: Math.ceil(innerWidth / FS) }, () => (Math.random() * innerHeight / FS) | 0);
        }
        function draw(t) {
            raf = requestAnimationFrame(draw);
            if (!on || !document.getElementById('sarangos') || document.getElementById('sarangos').hidden) return;
            if (t - last < 78) return; last = t;
            ctx.fillStyle = 'rgba(5, 6, 12, 0.05)';
            ctx.fillRect(0, 0, cv.width, cv.height);
            ctx.font = FS + 'px monospace';
            const accent = getComputedStyle(document.documentElement).getPropertyValue('--blue').trim() || '#34D399';
            const parity = Math.floor(t / 78) % 2;
            ctx.fillStyle = 'rgba(255,255,255,.8)';
            for (let i = 0; i < cols.length; i++) {
                if (i % 2 !== parity) continue;
                const ch = 'アイウエオカキクケコサシスセソタチツテト0123456789<>=+$'.split('')[Math.random() * 40 | 0];
                const x = i * FS, y = cols[i] * FS;
                ctx.fillText(ch, x, y);
                ctx.fillStyle = accent; ctx.globalAlpha = .3; ctx.fillText(ch, x, y);
                ctx.globalAlpha = 1; ctx.fillStyle = 'rgba(255,255,255,.8)';
                if (y > cv.height + FS && Math.random() > .975) cols[i] = 0;
                cols[i]++;
            }
        }
        return {
            start() {
                if (on || !cv || !ctx) return;
                on = true; size(); raf = requestAnimationFrame(draw);
            },
            stop() {
                on = false; cancelAnimationFrame(raf);
                if (ctx) { ctx.globalAlpha = 1; ctx.clearRect(0, 0, cv.width, cv.height); }
            }
        };
    })();
    function cycleTheme() {
        const cur = root.getAttribute('data-theme');
        applyTheme(cur === 'light' ? 'dark' : cur === 'dark' ? 'amoled' : 'light');
        root.classList.add('theme-anim');
        setTimeout(() => root.classList.remove('theme-anim'), 400);
        SND.togg();
    }
    themeBtn.addEventListener('click', cycleTheme);

    // init from persisted settings
    applyTheme(SET.get('theme', 'dark'));
    applyAccent(SET.get('accent', 'green'));
    applyWall(SET.get('wall', 'grid'));
    applyFX();

    // ===== SETTINGS APP (launcher) =====
    $('#os-settings').addEventListener('click', () => WM.open('settings'));

    // ===== DESKTOP CLOCK WIDGET (click = next wallpaper) =====
    const wclock = $('#os-wclock');
    if (wclock) {
        const wt = $('#os-wclock-t'), wd = $('#os-wclock-d');
        const dateFmt = new Intl.DateTimeFormat('en-GB', { timeZone: 'Asia/Kolkata', weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' });
        const fillClock = () => {
            const now = new Date();
            if (wt) wt.textContent = clockFmt.format(now);
            if (wd) wd.textContent = dateFmt.format(now).toUpperCase();
        };
        fillClock();
        setInterval(fillClock, 1000);
        wclock.addEventListener('click', nextWall);
    }

    // ===== GLOBAL UI SOUNDS + AUDIO ARM =====
    document.addEventListener('pointerdown', () => SND.arm(), { once: true });
    document.addEventListener('click', e => {
        if (e.target.closest('button, .os-icon, .os-task, .os-start-app, .os-exp-item')) SND.click();
    });

    // ===== DESKTOP CONTEXT MENU =====
    const ctx = $('#os-ctx');
    function buildCtx() {
        const theme = root.getAttribute('data-theme');
        const wall = root.getAttribute('data-wall');
        const cx = {
            WALLPAPER: [nextWall, wall.toUpperCase() + ' →'],
            THEME: [cycleTheme, theme.toUpperCase() + ' →'],
            'OPEN SETTINGS': [() => { WM.open('settings'); hideCtx(); }, '⚙'],
            'OPEN TERMINAL': [() => { WM.open('terminal'); hideCtx(); }, '>_'],
            'REBOOT SYSTEM': [() => osNav(true), '↻'],
            'EXIT — CLASSIC LAYOUT': [() => { root.classList.remove('os-mode'); SARANGOS.hidden = true; pill.hidden = false; }, '↦']
        };
        ctx.innerHTML = '<div class="os-ctx-head">SYSTEM DESKTOP</div>' +
            Object.keys(cx).map(k =>
                `<button type="button" data-k="${esc(k)}"><span class="os-ctx-n">${esc(k)}</span><span class="os-ctx-ok">${cx[k][1]}</span></button>`).join('') +
            '<div class="os-ctx-sep"></div><button type="button" data-k="CLASSIC">CLOSE MENU</button>';
        ctx.querySelectorAll('button').forEach(b => b.addEventListener('click', () => {
            const k = b.dataset.k;
            if (k === 'CLASSIC') return hideCtx();
            if (cx[k]) cx[k][0]();
            hideCtx();
        }));
    }
    function showCtx(x, y) {
        buildCtx();
        ctx.hidden = false;
        ctx.style.left = clamp(x, 4, innerWidth - 250) + 'px';
        ctx.style.top = clamp(y, 4, innerHeight - 300) + 'px';
        SND.click();
    }
    function hideCtx() { ctx.hidden = true; }
    SARANGOS.addEventListener('contextmenu', e => {
        if (e.target.closest('.os-window') || e.target.closest('#os-taskbar') || e.target.closest('#os-start')) return;
        e.preventDefault();
        showCtx(e.clientX, e.clientY);
    });
    document.addEventListener('pointerdown', e => {
        if (!ctx.hidden && !e.target.closest('#os-ctx')) hideCtx();
    });

    // ===== WELCOME SPLASH (marketing, one per session) =====
    const splash = $('#os-splash');
    function showSplash() {
        if (!splash) return;
        let seen = false;
        try { seen = sessionStorage.getItem('sr-splash') === '1'; } catch (e) { seen = true; }
        if (seen) return;
        try { sessionStorage.setItem('sr-splash', '1'); } catch (e) {}
        splash.innerHTML = `
            <h3>SYS-OP · ONLINE</h3>
            ${SPLASH_STATS.map(s => `<div class="os-splash-stat"><span>${s[0]}</span><b>${s[1]}</b></div>`).join('')}
            <div class="os-splash-hint">press <b>F1</b> for the guide · start menu = SR (bottom-left) · <b>ESC</b> closes a window · type <b>help</b> in the terminal</div>
            <button class="os-splash-close" type="button">DISMISS</button>`;
        splash.hidden = false;
        requestAnimationFrame(() => splash.classList.add('os-on'));
        splash.querySelector('.os-splash-close').addEventListener('click', hideSplash);
        setTimeout(hideSplash, 9000);
    }
    function hideSplash() {
        splash.classList.remove('os-on');
        setTimeout(() => { splash.hidden = true; }, 320);
    }

    // ===== CLASSIC <-> OS SWITCH =====
    const pill = $('#os-relaunch');
    function enterOS() {
        root.classList.add('os-mode');
        SARANGOS.hidden = false;
        window.scrollTo(0, 0);
        pill.hidden = true;
        maybeStarter();
    }
    function osNav(replay) {
        try { replay ? sessionStorage.removeItem('sr-osboot2') : sessionStorage.setItem('sr-osboot2', '1'); } catch (e) {}
        const u = new URL(location.href);
        u.searchParams.set('os', '1');
        location.href = u.href;
    }
    function maybeStarter() {
        try { if (localStorage.getItem('sr-seen-starter')) return; } catch (e) { return; }
        if ($('#os-starter')) return;
        const spl = $('#os-splash');
        if (spl && !spl.hidden) { setTimeout(maybeStarter, 800); return; }
        const st = document.createElement('div');
        st.id = 'os-starter';
        st.className = 'os-starter mono';
        st.innerHTML = `
            <p class="os-starter-title">NEW HERE? START HERE</p>
            <p class="os-starter-sub">This OS is a living CV. Windows open from the icons — or jump straight in:</p>
            <div class="os-starter-actions">
                <button class="btn btn-primary" data-open="about" data-done type="button">ABOUT — who I am</button>
                <button class="btn btn-ghost" data-open="projects" data-done type="button">PROJECTS — what shipped</button>
                <button class="btn btn-ghost" data-open="terminal" data-done type="button">OPEN TERMINAL</button>
                <button class="btn btn-ghost" data-open="guide" data-done type="button">FULL GUIDE (F1)</button>
            </div>
            <p class="os-starter-hint">tip: right-click any blank desktop space for wallpaper &amp; theme · <kbd>ESC</kbd> closes a window</p>`;
        st.hidden = false;
        SARANGOS.insertBefore(st, SARANGOS.firstChild);
        const done = () => { try { localStorage.setItem('sr-seen-starter', '1'); } catch (e) {} st.remove(); };
        st.querySelectorAll('[data-done]').forEach(b => b.addEventListener('click', done));
        const close = document.createElement('button');
        close.type = 'button';
        close.className = 'os-starter-x mono';
        close.setAttribute('aria-label', 'Dismiss');
        close.textContent = '×';
        close.addEventListener('click', done);
        st.appendChild(close);
        setTimeout(() => st.classList.add('os-starter-on'), 20);
    }
    let termEdit = false;
    window.addEventListener('keydown', e => {
        if (!root.classList.contains('os-mode')) return;
        if (termEdit) return;
        if (e.key === 'F1') {
            e.preventDefault();
            WM.open('guide');
        } else if (e.key === 'Escape' && !e.repeat) {
            if (WM.active) WM.close(WM.active.dataset.app);
        }
    });
    $('#os-classic').addEventListener('click', () => {
        root.classList.remove('os-mode');
        SARANGOS.hidden = true;
        pill.hidden = false;
    });
    pill.addEventListener('click', enterOS);

    // ===== TERMINAL (self-contained scratch shell) =====
    function initTerm(win) {
        const screen = win.querySelector('.os-term-screen');
        const input = win.querySelector('.os-term-input');
        const cmdEl = win.querySelector('.os-term-cmd');
        const prompt = win.querySelector('.os-term-prompt');
        const his = [];
        let hi = 0;
        const out = html => {
            const d = document.createElement('div');
            d.className = 'os-term-out';
            d.innerHTML = html;
            screen.appendChild(d);
            screen.scrollTop = screen.scrollHeight;
        };
        const hline = html => out('<span class="os-muted">$</span> <span class="os-term-hl">' + html + '</span>');
        const boot = () => {
            if (screen.dataset.b) return;
            screen.dataset.b = '1';
            setTimeout(() => out('<span class="os-muted">sarang.rao v2.9.6 — booting... ok. <span class="os-term-hl">help</span> for commands.</span>'), 80);
        };
        const gemKey = () => { try { return localStorage.getItem('sr-gemini-key') || ''; } catch (e) { return ''; } };
        const ved = initEditor(screen, input, out);
        const HTOP_ROWS = (k) => {
            const base = [
                ['rag-indexer', 'R'], ['multi-agent-lead', 'S'], ['voice-ai-pipe', 'S'], ['cv-inventory', 'R'],
                ['elysia-bun', 'S'], ['nbfc-fan', 'Z'], ['battery-kalman', 'S'], ['overthinking', 'R']
            ];
            return base.map((r, i) => {
                const cpu = (k + i * 7) % 45 + (i % 3 === 0 ? 2 : 0);
                const mem = (i * 13) % 38 + 4;
                return `2560${i}<span>sarang</span><span>${cpu}.${(i * 3) % 9}</span><span>${mem}.${(i * 5) % 9}</span><span class="os-htop-s${i % 4}">${r[1]}</span><span>${r[0]}</span>`;
            }).join('<span class="os-htop-row">') + '';
        };
        const fetchBlock = () => {
            const feats = (D.featuredProjects || []).length;
            const interns = (D.experience || []).length;
            return `   ____   ___  
  / __ \\ /   \\   <span class="os-ok">sarang@desktop</span>
 ( (_) \\/ /\\\\\\ |  <span class="os-muted">os: sarang.os v2.9.6</span>
  \\___/ /_/\\_\\\\|  <span class="os-muted">host: hp-omen-15</span>
                <span class="os-muted">cpu: overthinking @ 4.20 ghz</span>
                <span class="os-muted">memory: rag + patterns · 32gb/24 usable</span>
                <span class="os-ok">shipped: ${feats} systems</span>
                <span class="os-ok">interns: ${interns} reporting</span>`;
        };
        const CMD = {
            help: (a) => {
                const t = (a || '').trim().toLowerCase();
                const DETAIL = {
                    open: 'usage: <span class="os-term-hl">open</span> &lt;app&gt; — apps: ' + ALL_APPS.join(' · '),
                    ask: 'usage: <span class="os-term-hl">ask</span> "your question" — answers via Gemini (server key first, browser key fallback).',
                    echookey: 'usage: <span class="os-term-hl">echo</span> &lt;text…&gt; — prints what you type back at you.',
                    key: 'usage: <span class="os-term-hl">key</span> &lt;GEMINI_API_KEY&gt; · key clear',
                    accent: 'usage: <span class="os-term-hl">accent</span> [blue|green|coral|purple|lime|list]',
                    wall: 'usage: <span class="os-term-hl">wall</span> [grid|pulse|code|next]',
                    matrix: 'usage: <span class="os-term-hl">matrix</span> [on|off] — wallpaper rain',
                    themes: 'usage: <span class="os-term-hl">themes</span> — cycles LIGHT → DARK → AMOLED',
                    session: 'usage: <span class="os-term-hl">session</span> — prints saved OS settings',
                    history: 'usage: <span class="os-term-hl">history</span> — prints this session’s commands',
                    guide: 'usage: <span class="os-term-hl">open guide</span> or press <span class="os-term-hl">F1</span> — the system manual (what / how / why).',
                    motive: 'why an OS? this portfolio became a desktop so the CV is operated, not just read; raw HTML/CSS/JS, no frameworks.',
                    cd: 'usage: <span class="os-term-hl">cd</span> &lt;dir&gt; — agents: agentic-doc · cv-inventory · elysia · nbfc · nivana · battery · .. ',
                    ls: 'usage: <span class="os-term-hl">ls</span> [dir] — list the current (or given) folder.',
                    cat: 'usage: <span class="os-term-hl">cat</span> &lt;file&gt; — README.md · bat-config.toml · server.ts · soc-kalman.py …',
                    tree: 'usage: <span class="os-term-hl">tree</span> — the whole /home/sarang/systems at a glance.',
                    vim: 'usage: <span class="os-term-hl">vim</span> [file] — mini-editor. <span class="os-term-hl">i</span>=insert · <span class="os-term-hl">Esc</span>=normal · <span class="os-term-hl">:w</span> <span class="os-term-hl">:q</span> <span class="os-term-hl">:wq</span>.',
                    htop: 'usage: <span class="os-term-hl">htop</span> — six ticks of live-ish feel, then it files a report.',
                    ping: 'usage: <span class="os-term-hl">ping</span> &lt;host&gt; — polite ICMP to anyone, even figments.'
                };
                if (t && DETAIL[t]) return out(DETAIL[t]);
                out('apps: <span class="os-term-hl">open</span> &lt;app&gt; · <span class="os-term-hl">apps</span> — ' + ALL_APPS.slice(0, 4).join(', ') + ' +' + (ALL_APPS.length - 4) + '<br>shell: ls · cd &lt;dir&gt; · cat &lt;file&gt; · tree · echo · whoami · date · uname · uptime · neofetch · history<br>skills: about · projects · experience · achievements · contact · resume · cat resume.txt<br>AI: <span class="os-term-hl">ask</span> "…" · <span class="os-term-hl">gemini</span> · <span class="os-term-hl">ai</span> · <span class="os-term-hl">keys</span> · <span class="os-term-hl">key</span> &lt;API_KEY&gt;<br>toys: <span class="os-term-hl">vim</span> · htop · ping · fastfetch · screenfetch<br>system: themes · accent · wall · matrix · crt · dim · sound · clock · session · banner<br>guide: <span class="os-term-hl">open guide</span> (or <span class="os-term-hl">F1</span>) · <span class="os-term-hl">motive</span><br>sw: reboot · reload · clear · konami · <span class="os-term-hl">help &lt;cmd&gt;</span> for detail');
            },
            echo: (a) => out(esc((a || '').replace(/^["']|["']$/g, ''))),
            history: () => { out(his.length ? his.map((h, i) => String(i).padStart(3, ' ') + '  ' + esc(h)).join('<br>') : 'history: empty'); },
            apps: () => out('<span class="os-term-hl">apps (' + ALL_APPS.length + ')</span><br>' + ALL_APPS.map(x => '<span class="os-muted">·</span> ' + esc(x)).join('<br>')),
            guide: () => WM.open('guide'),
            motive: () => out('<span class="os-term-hl">MOTIVE</span> — why is this a desktop?<br>So the CV is operated, not just read: a real window manager, a live shell, persistence via localStorage — all raw HTML/CSS/JS, no frameworks. It doubles as the product: this OS <i>is</i> the demo. <span class="os-muted">open guide</span> (or F1) for the manual.'),
            themes: () => { cycleTheme(); out('theme → <span class="os-ok">' + root.getAttribute('data-theme').toUpperCase() + '</span>'); },
            accent: (a) => {
                const v = (a || '').trim().toLowerCase();
                const names = { blue: '#1F31D6', green: '#0D9A58', coral: '#E05233', purple: '#7C3AED', lime: '#2F9E3F' };
                if (v === 'list' || !v) return out('accents: ' + Object.keys(names).map(k => '<span class="os-term-hl">' + k + '</span>').join(' · ') + ' — <span class="os-term-hl">accent &lt;color&gt;</span>');
                if (!names[v]) return out('<span class="os-term-err">accent: unknown</span> — try: ' + Object.keys(names).join(' · '));
                applyAccent(v); SND.togg();
                out('accent → <span class="os-ok">' + v.toUpperCase() + '</span> <span style="color:' + names[v] + '">■</span>');
            },
            wall: (a) => {
                const v = (a || '').trim().toLowerCase();
                const walls = WALLS;
                let next;
                if (v === 'next' || !v) next = walls[(walls.indexOf(root.getAttribute('data-wall')) + 1) % walls.length];
                else if (walls.indexOf(v) > -1) next = v;
                else return out('walls: <span class="os-term-hl">' + walls.join(' · ') + '</span> — <span class="os-term-hl">wall &lt;name&gt;</span> · wall next');
                applyWall(next); SND.togg();
                out('wallpaper → <span class="os-ok">' + next.toUpperCase() + '</span>');
            },
            matrix: (a) => {
                const v = (a || '').trim().toLowerCase();
                const next = v === 'on' || (v !== 'off' && SET.get('rain', '1') !== '1');
                SET.set('rain', next ? '1' : '0'); applyFX();
                out('matrix rain → <span class="os-ok">' + (next ? 'ON' : 'OFF') + '</span>');
            },
            crt: (a) => { const next = !(a === 'off') && (a === 'on' || SET.get('crt', '0') !== '1'); SET.set('crt', next ? '1' : '0'); applyFX(); out('CRT scanlines → <span class="os-ok">' + (next ? 'ON' : 'OFF') + '</span>'); },
            dim: (a) => { const next = !(a === 'off') && (a === 'on' || SET.get('dim', '0') !== '1'); SET.set('dim', next ? '1' : '0'); applyFX(); out('DIM ROOM → <span class="os-ok">' + (next ? 'ON' : 'OFF') + '</span>'); },
            sound: (a) => { const next = !(a === 'off') && (a === 'on' || !SND.isOn()); SND.setOn(next); out('STARTUP + UI SOUND → <span class="os-ok">' + (next ? 'ON' : 'OFF') + '</span>'); },
            clock: (a) => { const next = !(a === 'off') && (a === 'on' || SET.get('clock', '1') !== '1'); SET.set('clock', next ? '1' : '0'); wclock.hidden = !next; out('CLOCK WIDGET → <span class="os-ok">' + (next ? 'ON' : 'OFF') + '</span>'); },
            session: () => {
                const g = k => SET.get(k, k === 'crt' || k === 'dim' ? '0' : '1') === '1' ? 'ON' : 'OFF';
                out(
                    'theme&nbsp; <span class="os-term-hl">' + root.getAttribute('data-theme').toUpperCase() + '</span><br>' +
                    'accent&nbsp; <span class="os-term-hl">' + root.getAttribute('data-accent').toUpperCase() + '</span><br>' +
                    'wall&nbsp;&nbsp; <span class="os-term-hl">' + root.getAttribute('data-wall').toUpperCase() + '</span><br>' +
                    'crt ' + g('crt') + ' · dim ' + g('dim') + ' · sound ' + (SND.isOn() ? 'ON' : 'OFF') + ' · clock ' + g('clock') + '<br>' +
                    'matrix rain ' + g('rain') + '<br>' +
                    'gemini: ' + (gemKey() ? '<span class="os-ok">browser key set</span>' : 'server key / browser fallback') + '<br>' +
                    '<span class="os-muted">session persists in localStorage (sr-*) — survives reboots.</span>');
            },
            banner: () => out(
                '<span class="os-term-hl">   ____  _   __ _   _                  <br>' +
                '  / ___|| | / /\_\_\ | __ _ _ __   __ _   <br>' +
                '  \___ \| |/ / _ \| |/ _` | `_ \ / _` |  <br>' +
                '   ___) |   <  (_) | | (_| | | | | (_| |  <br>' +
                '  |____/|_|\_\\\\___/|_|\__,_|_| |_|\__,_|  <br>' +
                '</span><span class="os-muted">sarang.rao — AI/ML engineer · the system betrays nothing.</span>'),
            reload: () => { out('reloading…'); setTimeout(() => osNav(false), 450); },
            about: () => out('sarang.rao — AI/ML engineer building production systems.<br>multi-agent orchestration · RAG · voice AI · CV · full-stack backend.'),
            projects: () => {
                const feats = (D.featuredProjects || []).map(p => `<span class="os-term-hl">${esc(p.title)}</span> <span class="os-muted">— ${esc(p.category)}</span>`).join('<br>');
                out(feats + `<br><span class="os-muted">+ ${(D.additionalProjects || []).length} more systems in the classic view.</span>`);
            },
            experience: () => {
                (D.experience || []).forEach(x =>
                    out(`<span class="os-term-hl">${esc(x.role)}</span> — ${esc(x.org)} · ${esc(x.date)}<br>` +
                        x.points.slice(0, 1).map(p => `<span class="os-muted">· ${esc(p)}</span>`).join('<br>')));
            },
            skills: () => {
                (D.skills || []).forEach(s => out(`<span class="os-term-hl">${esc(s.group)}</span> ${esc(s.items.slice(0, 4).join(' · '))}`));
            },
            achievements: () => out('2 ideathons won (Innowave 2025 — PICT ACM, FY Healthcare) · Reliance Foundation Scholar — top 1%'),
            contact: () => out(`email ${link('raosarang2006@gmail.com', 'mailto:raosarang2006@gmail.com')} · github ${link('@SarangRao20', 'https://github.com/SarangRao20', true)}`),
            resume: () => out(`→ ${link('sarang-rao-resume-os.pdf', 'assets/sarang-rao-resume-os.pdf')} · <span class="os-term-hl">cat resume.txt</span> for plain text`),
            open: (a) => {
                const t = (a || '').trim().replace(/\/+$/, '');
                const low = t.toLowerCase();
                if (!t) return out('usage: <span class="os-term-hl">open</span> &lt;app | folder&gt; — apps: ' + ALL_APPS.join(' · '));
                if (APPS[low]) { WM.open(low); out(`<span class="os-ok">✓</span> opening ${esc(low)} …`); return; }
                if (HFS.dirs[HFS.cwd + '/' + t]) { HFS.cwd = HFS.cwd + '/' + t; out(`<span class="os-ok">✓</span> opening folder <span class="os-term-hl">${esc(t)}/</span> — ls to browse`); return; }
                const rp = hfs_resolve(t);
                if (rp && HFS.dirs[rp]) { HFS.cwd = rp; out(`<span class="os-ok">✓</span> opening folder <span class="os-term-hl">${esc(rp)}</span> — ls to browse`); return; }
                out(`✗ no such app or folder: <span class="os-term-hl">${esc(t)}</span> (see help)`);
            },
            cat: (a) => {
                const f = (a || '').trim();
                if (!f) return out('usage: <span class="os-term-hl">cat</span> &lt;file&gt; — README.md · bat-config.toml · server.ts · soc-kalman.py …');
                if (/resume/i.test(f)) {
                    out(buildTextResume().replace(/[&<>]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c])).replace(/\n/g, '<br>'));
                    return;
                }
                const cands = [HFS.cwd + '/' + f, '~/' + f, '~/' + f.replace(/^.*\//, '')];
                for (const c of cands) {
                    if (c !== '~' && HFS.files[c]) {
                        out(esc(HFS.files[c]).replace(/\n/g, '<br>') + '<br><span class="os-muted">→ ' + esc(c) + '</span>');
                        return;
                    }
                }
                out(`<span class="os-term-err">cat: ${esc(f)}: no such file</span> — try "cat README.md" inside a repo`);
            },
            ls: (a) => {
                const t = (a || '').trim();
                let p = HFS.cwd;
                if (t) {
                    const r = hfs_resolve(t);
                    if (r && HFS.dirs[r]) p = r;
                    else if (HFS.dirs[HFS.cwd + '/' + t.replace(/\/$/, '')]) p = HFS.cwd + '/' + t.replace(/\/$/, '');
                    else return out(`<span class="os-term-err">ls: cannot access '${esc(t)}'</span>`);
                }
                const list = HFS.dirs[p] || [];
                const L = list.map(n => n.endsWith('/')
                    ? 'drwxr-xr-x  sarang  sarang  4.0K  <span class="os-ok">' + esc(n) + '</span>'
                    : n === 'sarang-resume.txt'
                        ? '-rw-r--r--  sarang  sarang   16K   <span class="os-ok">' + esc(n) + '</span>'
                        : '-rw-r--r--  sarang  sarang  4.0K   ' + esc(n));
                out('<span class="os-muted">' + esc(p) + ' — ' + list.length + ' entries</span><br>' + L.join('<br>'));
            },
            cd: (a) => {
                const t = (a || '').trim();
                if (!t || t === '~' || t === '.' || t === '/home/sarang' || t === '/') { HFS.cwd = '~'; out('→ ~ — the desktop is your home.'); return; }
                if (t === '..') { const p = hfs_parent(HFS.cwd); HFS.cwd = p; out('→ ' + esc(p)); return; }
                let p = hfs_resolve(t);
                if (p && HFS.dirs[p]) { HFS.cwd = p; out('→ ' + esc(p) + ' · ' + HFS.dirs[p].length + ' entries · <span class="os-muted">ls</span> to look around'); return; }
                if (HFS.dirs[HFS.cwd + '/' + t.replace(/\/$/, '')]) { HFS.cwd = HFS.cwd + '/' + t.replace(/\/$/, ''); out('→ ' + esc(HFS.cwd)); return; }
                out(`<span class="os-term-err">cd: ${esc(t)}: no such directory</span> — agents: agentic-doc · cv-inventory · elysia · nbfc · nivana · battery`);
            },
            tree: () => {
                let t = '~<br>│';
                const walk = (p, depth) => {
                    const ind = '│' + '   '.repeat(depth);
                    (HFS.dirs[p] || []).forEach(n => {
                        if (n.endsWith('/')) { t += `<br>${ind}├─ <span class="os-ok">${esc(n)}</span>`; walk(p + '/' + n.replace(/\/$/, ''), depth + 1); }
                        else t += `<br>${ind}├─ ${esc(n)}`;
                    });
                };
                HFS.dirs['~'].filter(n => !n.endsWith('/')).forEach(n => { t += `<br>│   ├─ ${esc(n)}`; });
                walk('~', 1);
                t += '<br>│<br>└─ (6 agents · all humming along)';
                out(t);
            },
            pwd: () => out(HFS.cwd === '~' ? '/home/sarang/systems/production' : '/home/sarang/systems/production/' + HFS.cwd.slice(2)),
            whoami: () => out('sarang.rao — AI/ML engineer, AI Team Lead'),
            date: () => out(new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', hour12: false }) + ' IST'),
            uname: () => out('Linux hp-arch 6.12-GNU x86_64 · Sarang Rao, AI Team Lead'),
            uptime: () => out('up 3 years-ish — but who\'s counting. 2 ideathons fought, 1 scholarship won, ∞ rewrites.'),
            reboot: () => { out('rebooting…'); setTimeout(() => osNav(true), 500); },
            version: () => out('SARANG OS v2.9.6 · build 9c2e1a · SARANG SYSTEMS · 2026 · <span class="os-muted">+ mini vim · holo-fs · toys</span>'),
            konami: () => out('→ ↑↑↓↓←→←→BA → <span class="os-ok">ROOT ACCESS GRANTED.</span> you already owned this thought.'),
            sudo: () => out('<span class="os-muted">[sudo] password for sarang: ********</span><br><span class="os-ok">permission granted.</span>'),
            rm: () => out('rm: cannot remove / — the system says: your career is fine.'),
            neofetch: () => out(fetchBlock()),
            fastfetch: () => out('<span class="os-muted">fastfetch 2.87 (fake ascii, real vibes)</span><br>' + fetchBlock()),
            screenfetch: () => out('<span class="os-muted">screenfetch 3.9.9 — "don\'t worry, it works."</span><br>' + fetchBlock()),
            htop: () => {
                const el = document.createElement('div');
                el.className = 'os-htop mono';
                screen.appendChild(el);
                let n = 0;
                const paint = () => {
                    el.innerHTML = `<div class="os-htop-head"><span>PID</span><span>USER</span><span>CPU%</span><span>MEM%</span><span>S</span><span>COMMAND</span></div>` +
                        (() => { let r = ''; for (let i = 0; i < 8; i++) { const cpu = (n * 13 + i * 7) % 45 + (i % 3 === 0 ? 2 : 0); const mem = (i * 13) % 38 + 4; r += `<div class="os-htop-row${i === n % 8 ? ' is-sel' : ''}"><span>2560${i}</span><span>sarang</span><span>${cpu}.${(i * 3) % 9}</span><span>${mem}.${(i * 5) % 9}</span><span class="os-htop-s${i % 4}">${['R', 'S', 'S', 'R'][i % 4]}</span><span>${['rag-indexer', 'multi-agent-lead', 'voice-ai-pipe', 'cv-inventory', 'elysia-bun', 'nbfc-fan', 'battery-kalman', 'overthinking'][i]}</span></div>`; } return r; })();
                    n++;
                    if (n >= 6) { clearInterval(t); out('<span class="os-muted">htop: six ticks captured. processes continue bravely without us.</span>'); }
                };
                const t = setInterval(paint, 480);
                paint();
            },
            ping: (a) => {
                const host = (a || '').trim() || 'vercel-edge';
                const base = 16 + (host.length * 7) % 34;
                let seq = 1;
                out('PING ' + esc(host) + ' (146.75.112.' + (10 + (host.length % 240)) + ') 56(84) bytes of data.');
                const t = setInterval(() => {
                    if (seq > 4) { clearInterval(t); out('--- ' + esc(host) + ' ping statistics ---<br>4 packets transmitted, 4 received, 0% packet loss, time 3004ms<br><span class="os-ok">rtt min/avg/max/mdev = ' + base + '.' + seq + '/' + (base + 2) + '.' + seq + '/' + (base + 5) + '.' + seq + ' ms</span>'); return; }
                    out('64 bytes from ' + esc(host) + ': icmp_seq=' + seq + ' ttl=52 time=' + (base + (seq * 17) % 22) + '.' + seq + ' ms');
                    seq++;
                }, 350);
            },
            vim: (a) => ved.open(a || 'index.md'),
            nvim: (a) => ved.open(a || 'index.md'),
            vi: (a) => ved.open(a || 'index.md'),
            keys: () => {
                const k = gemKey();
                out(k
                    ? `✓ Gemini AI: <span class="os-ok">SET</span> (${esc(k.slice(0, 4))}…${esc(k.slice(-4))}) — browser-local key (fallback). Server proxy uses GEMINI_API_KEY if configured.`
                    : '<span class="os-term-hl">ask</span> works via the server key (GEMINI_API_KEY) when deployed; optional browser key: <span class="os-term-hl">key</span> &lt;your_GEMINI_API_KEY&gt;<br><span class="os-muted">browser keys stay in localStorage — never sent to github or the repo.</span>');
            },
            key: (arg) => {
                const a = (arg || '').trim();
                if (!a) return out('usage: <span class="os-term-hl">key</span> &lt;GEMINI_API_KEY&gt; &nbsp;|&nbsp; key clear');
                if (a === 'clear') {
                    try { localStorage.removeItem('sr-gemini-key'); } catch (e) { /* ignore */ }
                    return out('✓ API key cleared.');
                }
                if (!/^(AIza|AQ\.)[0-9A-Za-z._-]{10,}$/.test(a)) return out('✗ that does not look like a Gemini API key (starts with AIza… or AQ.…).');
                try { localStorage.setItem('sr-gemini-key', a); } catch (e) { return out('✗ could not save (private mode?) — run key again.'); }
                out(`✓ key saved — browser local only.<br><span class="os-muted">try: ask "why use multi-agent orchestration?"</span>`);
            },
            ask: async (arg) => {
                const q = (arg || '').replace(/^["“”']|["“”']$/g, '').trim();
                if (!q) return out('usage: <span class="os-term-hl">ask</span> &lt;&quot;your question&quot;&gt;');
                if (typeof SR_AI === 'undefined' || !SR_AI || typeof SR_AI.ask !== 'function') return out('<span class="os-term-err">✗ AI engine offline — classic layer failed to load.</span>');
                out('<span class="os-ok">ask ›</span> ' + esc(q));
                try {
                    const { text } = await SR_AI.ask(q);
                    out('<span class="os-ok">ai ›</span> ' + esc(text).replace(/\n/g, '<br>'));
                } catch (e) {
                    out('<span class="os-term-err">✗ ' + esc((e && e.message) || 'request failed') + '</span>');
                }
            },
            gemini: async (arg) => CMD.ask(arg),
            ai: async (arg) => CMD.ask(arg),
            clear: () => { screen.innerHTML = ''; },
            cls: () => { screen.innerHTML = ''; },
        };
        input.addEventListener('input', () => { cmdEl.textContent = input.value; });
        input.addEventListener('keydown', e => {
            if (e.key === 'Enter') {
                e.preventDefault();
                const v = input.value.trim();
                input.value = ''; cmdEl.textContent = '';
                if (!v) return;
                hline(esc(v));
                his.push(v); hi = his.length;
                const parts = v.split(/\s+/);
                const n = parts[0].toLowerCase();
                const rest = parts.slice(1).join(' ');
                const f = CMD[n];
                if (f) f(rest); else out(`<span class="os-term-err">bash: ${esc(n)}: command not found</span>`);
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                if (his.length && hi > 0) { hi--; input.value = his[hi] || ''; cmdEl.textContent = input.value; }
            } else if (e.key === 'ArrowDown') {
                e.preventDefault();
                if (hi < his.length) { hi++; input.value = his[hi] || ''; cmdEl.textContent = input.value; }
            }
        });
        prompt.addEventListener('click', () => input.focus());
        setTimeout(() => input.focus(), 150);
        boot();
    }

    // ===== HOLO-FS — pretend filing cabinet over real repos =====
    const FILES = {
        '~/agentic-doc/ARCHITECTURE.md': '# memosys · agentic doc\n\nmeta-agent walks the repo, flags stale docs, drafts diffs.\nPRs get an architecture layer, humans approve.\n\n## pipeline\nparse → graph → route → draft → review → merge',
        '~/agentic-doc/README.md': 'a doc-agent that keeps specs honest.\nstack: graphrag + code-parse + pr-review',
        '~/cv-inventory/README.md': 'inventory a CV like a warehouse.\nsku = skill · batch = project · replenish = new systems',
        '~/cv-inventory/expanded-offer.md': '# expansion — terms for the next role\n\n## what i bring\nproduction rag · multi-agent flow · voice-ai pipelines\nmentoring → 5 interns, shipped\n\n## the ask\nlead the ai build, own it end to end',
        '~/cv-inventory/ats-export.csv': 'skill,level,years\npython,expert,4\nlangchain/graphrag,expert,2\nvoice-ai,strong,1\ncv,strong,2\nmentoring,captain,2',
        '~/elysia/README.md': 'elysia + bun experiment — type-safe api at lightspeed.\nhealthy side-hustle, zero regrets.',
        '~/elysia/server.ts': "import { Elysia } from 'elysia'\n\nnew Elysia()\n  .get('/', () => 'sarang.rao')\n  .get('/stack', () => ['rag','multi-agent','voice'])\n  .listen(3000)\n\nconsole.log('swiftly, in types')",
        '~/elysia/package.json': '{ "name": "elysia-lab", "type": "module", "scripts": { "dev": "bun run server.ts" } }',
        '~/nbfc/README.md': 'nbfc reimagined — fan curves that respect the metal.\nnoctua-grade politeness for an hp-omen.',
        '~/nbfc/bat-config.toml': '[general]\nflavor = "crispy"\n\n[fan]\ncurve = [ [0, 0], [50, 40], [70, 70], [84, 100] ]\nsilence = true\n\n# re-flash with every reboot, legally-ish',
        '~/nbfc/ec-probe.log': 'chip: EC-0 · fans: 2 · tach locked in @ 4200rpm\neverything quiet, boss.',
        '~/nivana/README.md': 'nivana — lighter-than-air navigation model.\nclaims optimizer rides along.',
        '~/nivana/train-config.yaml': 'model: nav_transformer_s\nepochs: 120\nlr: 3e-4  # tuned, don\'t touch (you WILL touch)\nbatch: 64',
        '~/nivana/nav-model.onnx': '\u0000\u0000\u0000\u0000 opset 17 · 12.4MB tensor soup\n(eat the bytes, taste the gradient)',
        '~/battery/README.md': 'battery care for a laptop that runs on rage + ac power.',
        '~/battery/soc-kalman.py': 'import numpy as np\n\n# state: [soc, drifting_voltage]\n# obs:  pack terminal voltage + a wild guess\nsoc_hat = 0.82\nfor v in voltage_stream:\n    soc_hat += kalman_gain * (estimate(v) - soc_hat)\n\nprint("soc stays honest:", round(soc_hat, 3))',
        '~/battery/thermal-limit.py': 'def charge_like_a_pro(t_cell):\n    if t_cell > 41: return "chill"\n    return "full send"'
    };
    const DIRS = {
        '~': ['agentic-doc/', 'cv-inventory/', 'elysia/', 'nbfc/', 'nivana/', 'battery/', 'sarang-resume.txt', 'README.md'],
        '~/agentic-doc': ['ARCHITECTURE.md', 'README.md'],
        '~/cv-inventory': ['cv-db.sqlite', 'expanded-offer.md', 'ats-export.csv', 'README.md'],
        '~/elysia': ['server.ts', 'package.json', 'README.md'],
        '~/nbfc': ['bat-config.toml', 'ec-probe.log', 'README.md'],
        '~/nivana': ['nav-model.onnx', 'train-config.yaml', 'README.md'],
        '~/battery': ['soc-kalman.py', 'thermal-limit.py', 'README.md']
    };
    const HFS = { cwd: '~', dirs: DIRS, files: FILES };
    function hfs_resolve(dir) {
        const seg = dir.trim().replace(/\/$/g, '').split('/').filter(Boolean).map(s => s.replace(/\.\./g, ''));
        let path = '~';
        if (dir.startsWith('/')) path = '/home/sarang/systems/' + seg.join('/');
        else for (const s of seg) { path = s === '~' ? '~' : path.replace(/\/$/, '') + '/' + s; }
        if (path in HFS.dirs) return path.replace(/\/$/g, '');
        return dir.trim() in HFS.dirs ? dir.trim().replace(/\/$/g, '') : null;
    }
    function hfs_parent(p) {
        const m = p.split('/');
        m.pop();
        let q = m.length > 1 ? m.join('/') : '~';
        return q === '~/.' ? '~' : q;
    }

    // ===== MINI VIM + HTOP (the show) =====
    function initEditor(screen, input, out) {
        const ed = { on: false, file: '', x: 0, y: 0, mode: 'N', cmd: '', keys: '', lines: [], root: null, buf: null, status: null, dead: false };
        const render = () => {
            if (!ed.root || ed.dead) return;
            let html = '';
            for (let i = 0; i < ed.lines.length; i++) {
                html += `<div class="os-ved-l"><span class="os-ved-n">${String(i + 1).padStart(3)}</span><span>${i === ed.y ? '<span class="os-ved-cur"></span>' : ''}${esc(ed.lines[i])}</span></div>`;
            }
            ed.buf.innerHTML = html;
            const cx = ed.file + ' · ' + (ed.y + 1) + ',' + (ed.x + 1);
            const modeTxt = ed.mode === 'I' ? 'INSERT' : ed.mode === 'C' ? ':' + ed.cmd : 'NORMAL';
            ed.status.innerHTML = `<span>${esc(cx)}</span><span class="os-ved-mode">${modeTxt}</span>`;
            const cur = ed.root.querySelector('.os-ved-cur');
            if (cur) { cur.scrollIntoView({ block: 'nearest' }); }
        };
        const open = (file) => {
            const f = String(file || 'README.md');
            ed.dead = false; ed.file = f; ed.mode = 'N'; ed.cmd = ''; ed.keys = '';
            const src = HFS.files['~/' + f] || HFS.files[HFS.cwd + '/' + f] || HFS.files[HFS.cwd + '/' + f.split('/').pop()] || `# ${f}\n\n—— new scratch ——\n\n(insert what must be written)\n`;
            ed.lines = src.split('\n').map(l => l.slice(0, 120));
            ed.y = 0; ed.x = 0;
            const root = document.createElement('div');
            root.className = 'os-ved mono';
            root.innerHTML = `<div class="os-ved-title">VIM ← ${esc(f)}</div><div class="os-ved-buf"></div><div class="os-ved-status"></div>`;
            ed.root = root; ed.buf = root.querySelector('.os-ved-buf'); ed.status = root.querySelector('.os-ved-status');
            out('<span class="os-muted">vim: now editing — <span class="os-term-hl">i</span>=insert · <span class="os-term-hl">Esc</span>=normal · <span class="os-term-hl">:w / :q / :wq</span></span>');
            screen.appendChild(root);
            render();
            ed.on = true; termEdit = true;
            input.blur();
            input.placeholder = '…inside vim · Esc → :q to leave';
        };
        const quit = (msg) => {
            ed.on = false; termEdit = false; ed.dead = true;
            if (ed.root) ed.root.classList.add('os-ved-exit');
            out(`<span class="os-muted">${msg || 'vim: abandoned.'}</span>`);
            input.placeholder = 'type a command…';
            setTimeout(() => input.focus(), 60);
        };
        document.addEventListener('keydown', e => {
            if (!ed.on) return;
            e.preventDefault(); e.stopPropagation();
            if (e.repeat && ed.mode !== 'I' && e.key !== 'Backspace') return;
            if (ed.mode === 'I') {
                if (e.key === 'Escape') { ed.mode = 'N'; ed.keys = ''; }
                else if (e.key === 'Enter') { ed.lines.splice(ed.y + 1, 0, ''); ed.y++; ed.x = 0; }
                else if (e.key === 'Backspace') {
                    if (ed.x > 0) { ed.lines[ed.y] = ed.lines[ed.y].slice(0, ed.x - 1) + ed.lines[ed.y].slice(ed.x); ed.x--; }
                    else if (ed.y > 0) { ed.x = ed.lines[ed.y - 1].length; ed.lines.splice(ed.y, 1); ed.y--; }
                }
                else if (e.key === 'ArrowLeft') { if (ed.x > 0) ed.x--; }
                else if (e.key === 'ArrowRight') { if (ed.x < ed.lines[ed.y].length) ed.x++; }
                else if (e.key === 'ArrowUp') { if (ed.y > 0) { ed.y--; ed.x = Math.min(ed.x, ed.lines[ed.y].length); } }
                else if (e.key === 'ArrowDown') { if (ed.y < ed.lines.length - 1) { ed.y++; ed.x = Math.min(ed.x, ed.lines[ed.y].length); } }
                else if (e.key.length === 1) { const l = ed.lines[ed.y]; ed.lines[ed.y] = l.slice(0, ed.x) + e.key + l.slice(ed.x); ed.x++; }
            } else if (ed.mode === 'C') {
                if (e.key === 'Enter') {
                    const argv = ed.cmd.trim().split(/\s+/);
                    if (argv[0] === 'q') return quit('vim: abandon. unchanged feelings, unchanged file.');
                    if (argv[0] === 'w') { out('vim: "<span class="os-term-hl">' + esc(ed.file) + '</span>" ' + ed.lines.length + 'L, written — to a parallel universe. (state lives in RAM not disk, obviously)'); ed.mode = 'N'; ed.cmd = ''; render(); return; }
                    if (argv[0] === 'wq') { out('vim: wrote ' + ed.lines.length + 'L · bye.'); return quit(''); }
                    ed.cmd = ''; ed.mode = 'N'; ed.status.innerHTML = '<span>E492: not a command</span><span></span>';
                } else if (e.key === 'Escape') { ed.mode = 'N'; ed.cmd = ''; }
                else if (e.key.length === 1 && /[\w :/?*]/.test(e.key)) { ed.cmd += e.key; }
            } else {
                if (e.key === 'i' || e.key === 'a') { ed.mode = 'I'; ed.keys = ''; if (e.key === 'a' && ed.x < ed.lines[ed.y].length) ed.x++; }
                else if (e.key === ':') { ed.mode = 'C'; ed.cmd = ''; }
                else if (e.key === 'Escape') { ed.keys = ''; }
                else if (e.key === 'G') { ed.y = ed.lines.length - 1; ed.x = ed.lines[ed.y].length; ed.keys = ''; }
                else if (e.key === 'u') { ed.keys = ''; out('vim: an undo that this mini-vim does not own. pray, or craft again.'); }
                else if (e.key.length === 1 && /[A-Za-z0-9]/.test(e.key)) {
                    ed.keys += e.key;
                    if (ed.keys === 'dd' || ed.keys === 'DD') {
                        ed.keys = '';
                        if (ed.lines.length > 1) { ed.lines.splice(ed.y, 1); ed.y = Math.min(ed.y, ed.lines.length - 1); ed.x = 0; out('vim: "dd" — line ' + (ed.y + 1) + ' deleted. <span class="os-term-hl">u</span> if you meant that.'); }
                    }
                    else if (ed.keys.slice(-2) === 'gg') { ed.y = 0; ed.x = 0; ed.keys = ''; }
                    else if (ed.keys.length > 2) ed.keys = ed.keys.slice(-1);
                }
            }
            render();
        });
        return { open, quit };
    }

    // ===== CONTACT (mini form + copy) =====
    function initContact(form, status, copyBtn) {
        const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
        const validate = () => {
            const n = form.elements.name.value.trim(), e = form.elements.email.value.trim(), m = form.elements.message.value.trim();
            let err = '';
            if (n.length < 2) err = 'Please enter your name.';
            else if (!EMAIL_RE.test(e)) err = 'Please enter a valid email.';
            else if (m.length < 10) err = 'Message needs at least 10 characters.';
            return err;
        };
        form.addEventListener('submit', async ev => {
            ev.preventDefault();
            status.textContent = '';
            status.className = 'form-status mono os-status';
            const err = validate();
            if (err) { status.textContent = '✗ ' + err.toUpperCase(); status.className += ' err'; return; }
            if (typeof emailjs === 'undefined') {
                status.textContent = '✗ EMAIL SERVICE OFFLINE — email me directly at raosarang2006@gmail.com';
                status.className += ' err';
                return;
            }
            const btn = form.querySelector('.os-send');
            const orig = btn.textContent;
            btn.disabled = true; btn.textContent = 'Sending…';
            try {
                const res = await emailjs.send('service_erua80f', 'template_9eusq77', {
                    from_name: form.elements.name.value.trim(),
                    from_email: form.elements.email.value.trim(),
                    message: form.elements.message.value.trim()
                }, { publicKey: '3FTJumtq2gKLYBWT7' });
                if (res.status === 200) {
                    status.textContent = '✓ MESSAGE SENT — I’ll get back to you soon.';
                    status.className += ' ok';
                    form.reset();
                } else throw new Error('send failed');
            } catch (err2) {
                console.error('OS contact error:', err2);
                status.textContent = '✗ SEND FAILED — email me directly at raosarang2006@gmail.com';
                status.className += ' err';
            } finally {
                btn.disabled = false; btn.textContent = orig;
            }
        });
        if (copyBtn) {
            let t;
            copyBtn.addEventListener('click', async () => {
                try {
                    await navigator.clipboard.writeText(copyBtn.dataset.email);
                    copyBtn.textContent = 'COPIED ✓';
                    clearTimeout(t);
                    t = setTimeout(() => { copyBtn.textContent = 'COPY'; }, 1600);
                } catch (e) { /* clipboard blocked — mailto still works */ }
            });
        }
    }

    // ===== KEYBOARD / BOOT: TV-style boot sequence =====
    const OSBoot = (function () {
        let self;
        function el() { return document.getElementById('os-boot'); }
        function stage() { return document.getElementById('os-boot-stage'); }

        const BIOS = [
            'SARANG SYSTEMS BIOS — v2.7',
            'CPU  : OVERTHINKING @ 4.20GHz x64  ·  CACHE : RAG-16MB',
            'MEM  : <b id="os-bios-ram">0000000M OK</b>',
            'BOOT : [SSD: SARANG-OS v2.7]',
            'ML PIPELINES .......... <span class="ok">READY</span>',
            'INTERNS CUES .......... <span class="ok">MOUNTED</span>',
            'SHIPPED SYSTEMS ....... <span class="ok">ONLINE</span>'
        ];
        const LOAD_LINES = [
            'loading kernel image……',
            'mounting /home/sarang/systems/production',
            'starting window manager……',
            'waking multi-agent pipeline…',
            'warming cv-inventory / nbfc / nivana……',
            'agents warmed · systems nominal……'
        ];

        self = {
            sel: 0, timers: [], phase: 'idle', cb: null,

            _clear() { this.timers.forEach(t => clearInterval(t)); this.timers = []; },

            run(done) {
                this.cb = done;
                if (rm() || sessionStorage.getItem('sr-osboot2')) { this.finish(true); return; }
                const b = el();
                if (!b) { this.finish(true); return; }
                b.hidden = false;
                b.setAttribute('aria-hidden', 'false');
                this.phase = 'bios';
                this.renderBios();
                window.addEventListener('keydown', this.onKey);
            },

            renderBios() {
                const s = stage();
                s.classList.remove('os-grub', 'os-load');
                s.innerHTML = `<div class="os-bios mono">${BIOS.map(l => `<p>${l}</p>`).join('')}</div>`;
                const p = s.querySelectorAll('p');
                p.forEach((pEl, i) => pEl.style.animationDelay = (0.12 + i * 0.09) + 's');
                let mem = 0;
                const t = setInterval(() => {
                    mem += 2048;
                    const r = s.querySelector('#os-bios-ram');
                    if (r) r.textContent = String(mem).padStart(7, '0') + 'M OK';
                    if (mem >= 8192) {
                        clearInterval(t);
                        setTimeout(() => this.menu(), 260);
                    }
                }, 60);
                this.timers.push(t);
            },

            menu() {
                if (this.phase !== 'bios') return;
                this.phase = 'menu';
                const s = stage();
                s.classList.add('os-grub');
                s.innerHTML = `
                    <div class="os-grub mono">
                        <div class="os-grub-brand">SR · SARANG OS v2.7</div>
                        <div class="os-grub-label">PICK A BOOT TARGET</div>
                        <div class="os-grub-row is-sel" data-t="about">
                            <span class="os-grub-caret">▸</span> SARANG OS
                            <span class="os-grub-dim">(desktop)</span>
                        </div>
                        <div class="os-grub-row" data-t="terminal">
                            <span class="os-grub-caret"> </span> Terminal — rescue shell
                            <span class="os-grub-dim">(no desktop)</span>
                        </div>
                        <div class="os-grub-count">AUTO-BOOT SARANG OS IN <b id="os-boot-cd">4</b>s</div>
                        <div class="os-grub-hint">↑/↓ choose · ENTER boot · ESC skip</div>
                    </div>`;
                let cd = 4;
                const t = setInterval(() => {
                    cd--;
                    const c = document.getElementById('os-boot-cd');
                    if (c) c.textContent = cd;
                    if (cd <= 0) {
                        clearInterval(t);
                        if (this.phase === 'menu') this.boot();
                    }
                }, 1000);
                this.timers.push(t);
                this.paintMenu();
            },

            paintMenu() {
                const rows = document.querySelectorAll('.os-grub-row');
                rows.forEach((r, i) => {
                    r.classList.toggle('is-sel', i === this.sel);
                    r.querySelector('.os-grub-caret').textContent = i === this.sel ? '▸' : ' ';
                });
            },

            target() { return this.sel === 0 ? 'about' : 'terminal'; },

            boot() {
                if (this.phase !== 'menu') return;
                this.phase = 'load';
                this._clear();
                const s = stage();
                s.classList.remove('os-grub');
                s.classList.add('os-load');
                s.innerHTML = `
                    <div class="os-load mono">
                        <p class="os-load-title">Booting ${this.sel === 0 ? 'SARANG OS' : 'RESCUE SHELL'} ...</p>
                        <div class="os-load-bar"><span id="os-load-fill"></span></div>
                        <p class="os-load-line" id="os-load-line">${LOAD_LINES[0]}</p>
                    </div>`;
                const fill = s.querySelector('#os-load-fill');
                const line = s.querySelector('#os-load-line');
                const t0 = performance.now();
                const DUR = 720;
                let li = 0;
                const il = setInterval(() => {
                    li++;
                    if (line && LOAD_LINES[li]) line.textContent = LOAD_LINES[li];
                }, 220);
                this.timers.push(il);
                const tick = now => {
                    const p = Math.min((now - t0) / DUR, 1);
                    if (fill) fill.style.width = p * 100 + '%';
                    if (p < 1) requestAnimationFrame(tick); else this.finish();
                };
                requestAnimationFrame(tick);
            },

            finish(skipFade) {
                if (this.phase === 'done') return;
                this.phase = 'done';
                this._clear();
                window.removeEventListener('keydown', this.onKey);
                const b = el();
                const target = this.target();
                if (!b) return this._done(target);
                b.classList.add('os-boot-done');
                b.setAttribute('aria-hidden', 'true');
                const done = () => { b.remove(); this._done(target); };
                if (skipFade) return done();
                setTimeout(done, 320);
            },

            _done(target) {
                sessionStorage.setItem('sr-osboot2', '1');
                if (this.cb) this.cb(target);
            },

            onKey(e) {
                if (!document.getElementById('os-boot')) return;
                if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
                    e.preventDefault();
                    if (!self.phase.match(/bios|menu/)) return;
                    if (self.phase === 'bios') { self.phase = 'menu'; return self.menu(); }
                    self.sel = Number(self.sel) === 0 ? 1 : 0;
                    self.paintMenu();
                } else if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowRight') {
                    e.preventDefault();
                    if (self.phase === 'bios') self.menu();
                    else if (self.phase === 'menu') self.boot();
                    else if (self.phase === 'load') self.finish(true);
                } else if (e.key === 'Escape') {
                    e.preventDefault();
                    self.finish();
                }
            }
        };
        el().addEventListener('click', () => {
            if (self.phase === 'bios') self.menu();
            else if (self.phase === 'menu') self.boot();
            else if (self.phase === 'load') self.finish(true);
        });
        return self;
    })();

    // ===== INIT (after script.js has rendered the page data) =====
    // Classic is the default everywhere. The OS boots explicitly via the
    // "SARANG OS ↵" pill, or instantly when the URL has ?os=1.
    document.addEventListener('DOMContentLoaded', () => {
        if (new URLSearchParams(location.search).get('os') !== '1') {
            pill.hidden = false;
            return;
        }
        enterOS();
        OSBoot.run(target => {
            WM.open(target);
            if (target === 'terminal') {
                const w = WM.wins.terminal;
                if (w) {
                    w.style.width = Math.min(860, innerWidth - 120) + 'px';
                    w.style.height = Math.min(560, innerHeight - 160) + 'px';
                }
            }
            SND.prime();
            showSplash();
        });
    });
})();