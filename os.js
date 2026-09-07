// ============================================
//   SARANG OS v2.7 — DESKTOP OVERLAY
//   Modern-desktop portfolio (Joey-de-Ruiter vibe)
//   Chrome: wallpaper, desktop icons, draggable
//   windows, taskbar+tray, start menu, live clock.
//   Gate: min-width 1024px + fine pointer, or ?os=1
// ============================================

(function () {
    'use strict';

    const root = document.documentElement;
    const fine = () => matchMedia('(pointer: fine)').matches;
    const big = () => matchMedia('(min-width: 1024px)').matches;
    const rm = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
    const forced = new URLSearchParams(location.search).get('os') === '1';

    if (!((fine() && big() && !rm()) || forced)) return;

    const $ = (s, r) => (r || document).querySelector(s);
    const $$ = (s, r) => Array.prototype.slice.call((r || document).querySelectorAll(s));

    const D = (typeof data !== 'undefined') ? data : {};
    const esc = s => String(s).replace(/[&<>]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]));
    const link = (label, url, off) =>
        `<a class="text-link mono os-link" href="${url}"${off ? ' target="_blank" rel="noopener noreferrer"' : ''}>${label}</a>`;
    const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));

    // ===== ICON GLYPHS (monospace — no assets needed) =====
    const GLYPH = {
        about: '◉', projects: '▦', experience: '⌂', cases: '▤',
        terminal: '>_', resume: '⤓', contact: '@'
    };

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
            width: 780, height: 640,
            body() {
                const wrap = document.createElement('div');
                wrap.className = 'os-app os-about';
                const photo = document.querySelector('.hero-photo-wrap');
                let photoHTML = '';
                if (photo) {
                    const pic = photo.querySelector('picture');
                    photoHTML = `<div class="os-photo">${pic ? pic.outerHTML : '<img src="Images/sarang.jpg" alt="Sarang Rao">'}`
                        + `<span class="os-photo-cap mono">FIG.1 — THE SYSTEM IN QUESTION</span></div>`;
                }
                wrap.innerHTML = `
                    <p class="os-eyebrow mono">SARANG.RAO — TECHNICAL SPEC · HUMAN, GENERALLY CAPABLE</p>
                    <h2 class="os-about-name">Sarang Rao</h2>
                    <p class="os-about-role mono">AI / ML ENGINEER — PRODUCTION SYSTEMS, END TO END</p>
                    ${photoHTML}
                    <div class="os-spec"></div>
                    <div class="os-actions">
                        <button class="btn btn-primary" data-open="projects" type="button">View projects</button>
                        <a class="btn btn-ghost" href="assets/sarang-rao-resume.pdf" download="Sarang-Rao-Resume.pdf"><span class="mono btn-suffix">.PDF</span>&nbsp;Resume</a>
                        <button class="btn btn-ghost" data-open="contact" type="button">Get in touch</button>
                    </div>`;
                wrap.querySelector('.os-spec').appendChild(cloneDoc('spec-card'));
                return wrap;
            }
        },

        projects: {
            title: 'PROJECTS — SELECTED SYSTEMS',
            width: 800, height: 620,
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
            width: 660, height: 580,
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
            width: 640, height: 560,
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

        resume: {
            title: 'RESUME — CURRICULUM VITAE',
            width: 480, height: 380,
            body() {
                const wrap = document.createElement('div');
                wrap.className = 'os-app os-resume';
                wrap.innerHTML = `
                    <p class="os-lead">Sarang Rao — AI/ML engineer.</p>
                    <p class="os-muted mono">PDF, one page. Honest numbers, production systems.</p>
                    <div class="os-resume-actions">
                        <a class="btn btn-primary" href="assets/sarang-rao-resume.pdf" download="Sarang-Rao-Resume.pdf">Download resume<span class="mono btn-suffix">.PDF</span></a>
                        <button class="btn btn-ghost" data-open="contact" type="button">Request a tailored version</button>
                    </div>
                    <div class="os-resume-links mono">
                        ${link('GITHUB ↗', 'https://github.com/SarangRao20', true)}<br>
                        ${link('LINKEDIN ↗', 'https://linkedin.com/in/sarang-rao-262bbb324', true)}<br>
                        ${link('LEETCODE ↗', 'https://leetcode.com/u/SarangRao', true)}
                    </div>`;
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
        }
    };

    const DESKTOP = ['about', 'projects', 'experience', 'cases', 'terminal', 'resume', 'contact'];

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
            this.min[id] = true;
            win.classList.add('os-minimized');
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
            this.min[id] = false;
            win.classList.remove('os-minimized');
            this.focus(id);
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

    // Drag via titlebar
    const dragState = { win: null, dx: 0, dy: 0, moved: false };
    layer.addEventListener('pointerdown', e => {
        const t = e.target.closest('.os-title');
        if (!t || e.target.closest('button')) return;
        const win = t.closest('.os-window');
        WM.focus(win.dataset.app);
        const r = win.getBoundingClientRect();
        dragState.win = win;
        dragState.dx = e.clientX - r.left;
        dragState.dy = e.clientY - r.top;
        dragState.moved = false;
        win.setPointerCapture(e.pointerId);
        win.classList.add('os-dragging');
    });
    layer.addEventListener('pointermove', e => {
        const w = dragState.win;
        if (!w) return;
        if (Math.abs(e.clientX - w.getBoundingClientRect().left - dragState.dx)
            + Math.abs(e.clientY - w.getBoundingClientRect().top - dragState.dy) > 3) dragState.moved = true;
        const r = w.getBoundingClientRect();
        w.style.left = clamp(e.clientX - dragState.dx, -(r.width - 140), innerWidth - 60) + 'px';
        w.style.top = clamp(e.clientY - dragState.dy, 0, innerHeight - 52) + 'px';
    });
    layer.addEventListener('pointerup', e => {
        if (dragState.win) {
            dragState.win.classList.remove('os-dragging');
            dragState.win = null;
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
            <div class="os-start-apps">
                ${DESKTOP.map(id => `
                    <button class="os-start-app mono" data-app="${id}" type="button">
                        <span class="os-task-glyph">${GLYPH[id]}</span>
                        <span class="os-start-app-n">${id[0].toUpperCase() + id.slice(1)}</span>
                        <span class="os-start-app-d">${esc(APPS[id].title.split('—')[1] || '')}</span>
                    </button>`).join('')}
            </div>
            <div class="os-start-foot mono">
                <span>SARANG OS v2.7</span><i></i><span>PUNE · INDIA</span><i></i><span>IST <em id="os-start-clock">--:--:--</em></span>
            </div>`;
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
    function applyTheme(mode, store) {
        root.setAttribute('data-theme', mode);
        themeBtn.textContent = mode === 'dark' ? 'LIGHT' : 'DARK';
        const meta = document.querySelector('meta[name="theme-color"]');
        if (meta) meta.setAttribute('content', mode === 'dark' ? '#101119' : '#F5F3EC');
        if (store) { try { localStorage.setItem('sr-theme', mode); } catch (e) { } }
    }
    applyTheme(root.getAttribute('data-theme') || 'light', false);
    themeBtn.addEventListener('click', () => {
        const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        applyTheme(next, true);
        root.classList.add('theme-anim');
        setTimeout(() => root.classList.remove('theme-anim'), 400);
    });

    // ===== CLASSIC <-> OS SWITCH =====
    const pill = $('#os-relaunch');
    function enterOS() {
        root.classList.add('os-mode');
        SARANGOS.hidden = false;
        window.scrollTo(0, 0);
        pill.hidden = true;
    }
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
            setTimeout(() => out('<span class="os-muted">sarang.rao v2.7 — booting... ok. <span class="os-term-hl">help</span> for commands.</span>'), 80);
        };
        const CMD = {
            help: () => out('projects · experience · skills · achievements · contact · resume · ls · whoami · date · neofetch · sudo · clear'),
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
            resume: () => out(`→ ${link('sarang-rao-resume.pdf', 'assets/sarang-rao-resume.pdf')}`),
            ls: () => out('<span class="os-ok">agentic-doc/</span>&nbsp; cv-inventory/&nbsp; elysia/&nbsp; nbfc/&nbsp; nivana/&nbsp; battery/'),
            pwd: () => out('/home/sarang/systems/production'),
            whoami: () => out('sarang.rao — AI/ML engineer, generally capable'),
            date: () => out(new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', hour12: false }) + ' IST'),
            uname: () => out('Linux hp-arch 6.12-GNU x86_64 · Sarang Rao, AI Team Lead'),
            neofetch: () => out('<span class="os-ok">oop25@desktop</span><br>OS: Arch · HP Omen 15 · CPU: overthinking @ 4.2 GHz · Memory: RAG + patterns'),
            sudo: () => out('<span class="os-muted">[sudo] password for sarang: ********</span><br><span class="os-ok">permission granted.</span>'),
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
                const n = v.toLowerCase().split(/\s+/)[0];
                const f = CMD[n];
                if (f) f(); else out(`<span class="os-term-err">bash: ${esc(n)}: command not found</span>`);
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

    // ===== INIT (after script.js has rendered the page data) =====
    document.addEventListener('DOMContentLoaded', () => {
        enterOS();
        WM.open('about');
    });
})();