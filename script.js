// ============================================
//   SARANG RAO — MODEL CARD PORTFOLIO 2026
// ============================================

// ===== DATA =====
const data = {

    experience: [
        {
            id: 'RUN-01',
            status: 'running',
            date: 'JAN 2026 — PRESENT',
            role: 'AI Team Lead',
            org: 'TenancyPassport',
            loc: 'Remote',
            points: [
                'Leads a team of 5 AI interns building agentic document intelligence across rental agreements, KYC, and financial documents.',
                'Merged two fragmented codebases into a single production repository; owns LLM pipelines for document processing.',
                'Shipped RAG document processing, LangGraph agent workflows, real-time voice pipelines, and CV room-inventory systems — all in production.',
            ],
            tags: ['Team Lead', 'LangGraph', 'RAG', 'Voice AI', 'Computer Vision']
        },
    ],

    featuredProjects: [
        {
            title: 'Elysia-AI',
            category: 'AI AGENTS',
            caseStudy: 'elysia',
            subtitle: 'Real-time voice AI desktop assistant · Solo project',
            description: 'Built a real-time voice AI assistant using Gemini Live API with bidirectional audio streaming, wake word detection, screen sharing, and text fallback across a 3-process architecture. ~110 tools across 21 modules covering browser automation, file system, terminal, system control, clipboard, OCR, and Google integrations — with persistent memory, canvas visualizer, and video character states.',
            metrics: [
                { v: '110+', k: 'TOOLS' },
                { v: '3', k: 'PROCESS ARCH' },
                { v: '4', k: 'OS BACKENDS' }
            ],
            shipLog: [
                'Designed a 3-process architecture: React shell, Node orchestrator, Python desktop agent — communicating over WebSockets.',
                '~110 tool functions across 21 modules with 4 OS backends (Linux GNOME/Wayland, macOS, Windows).',
                'Persistent memory with 7-category extraction + canvas holographic visualizer with video character states.'
            ],
            tags: ['Gemini Live API', 'LangGraph', 'Electron', 'TypeScript', 'WebRTC'],
            links: [
                { name: 'GITHUB ↗', url: 'https://github.com/SarangRao20/Elysia-AI' }
            ]
        },
        {
            title: 'FinServe NBFC',
            category: 'AI AGENTS',
            caseStudy: 'nbfc',
            subtitle: 'Multi-agent loan origination · Team lead',
            description: 'Led a team building a multi-agent loan origination system using LangGraph connecting KYC, fraud detection, underwriting, and sanction agents with structured state passing. Gemini Vision and OCR for financial document extraction with confidence-based validation and manual review fallback. FastAPI + MongoDB + Redis on Vercel with CI/CD.',
            metrics: [
                { v: '4', k: 'AGENT TYPES' },
                { v: 'OCR', k: 'VISION PARSER' },
                { v: 'CI/CD', k: 'VERCEL DEPLOYED' }
            ],
            shipLog: [
                'Orchestrated KYC → fraud → underwriting → sanction agents with structured state passing on LangGraph.',
                'Gemini Vision + OCR document extraction with confidence checks and manual review fallback.',
                'FastAPI + MongoDB + Redis on Vercel with CI/CD — live production deploy.'
            ],
            tags: ['LangGraph', 'Gemini Vision', 'FastAPI', 'Redis', 'MongoDB'],
            links: [
                { name: 'LIVE DEMO ↗', url: 'https://nbfc-inc.vercel.app/' },
                { name: 'GITHUB ↗', url: 'https://github.com/SarangRao20/NBFC' }
            ]
        },
        {
            title: 'Nivana',
            category: 'AI AGENTS',
            subtitle: 'Mental health conversational AI · Team',
            description: 'Built a mental health platform with an emotional vector engine tracking mood across sessions and triggering interventions on deterioration. Multi-layered AI pipeline: Ollama for local intent classification, Gemini for conversational responses, crisis detection with automatic escalation. Full stack: Flask, PostgreSQL, Redis, Celery, React.',
            metrics: [
                { v: 'PHQ-9', k: 'DEPRESSION' },
                { v: 'GAD-7', k: 'ANXIETY' },
                { v: 'ASYNC', k: 'CELERY WORKERS' }
            ],
            shipLog: [
                'Emotional vector engine tracks mood across sessions; triggers interventions when signals deteriorate.',
                'Three-layer AI pipeline: local intent (Ollama) → conversational (Gemini) → crisis detection with automatic escalation.',
                'Shipped full stack: Flask, PostgreSQL, Redis, Celery async alerts and reports.'
            ],
            tags: ['Flask', 'PostgreSQL', 'Redis', 'Celery', 'Gemini API'],
            links: [
                { name: 'LIVE DEMO ↗', url: 'https://nivana-azure.vercel.app' },
                { name: 'GITHUB ↗', url: 'https://github.com/SarangRao20/Nivana' }
            ]
        },
        {
            title: 'LeetCode Wrapped',
            category: 'DATA VIZ',
            subtitle: 'Spotify Wrapped for LeetCode · Solo project',
            description: 'Full-stack data visualization platform with FastAPI querying the LeetCode GraphQL API to aggregate yearly submission statistics: difficulty breakdowns, active days, and acceptance trends. Redis caching for rate limits, Recharts interactive charts for streak tracking and yearly retrospectives. Deployed on Vercel.',
            metrics: [
                { v: 'GRAPHQL', k: 'API' },
                { v: 'REDIS', k: 'CACHED' },
                { v: 'RECHARTS', k: 'VIZ' }
            ],
            shipLog: [
                'FastAPI queries LeetCode\u2019s GraphQL API to aggregate yearly submission statistics.',
                'Redis caching to respect API rate limits; Recharts for streak tracking and yearly retrospectives.',
                'CI/CD on Vercel \u2014 live deploy with cached analytics pipeline.'
            ],
            tags: ['FastAPI', 'React', 'GraphQL', 'Redis', 'Recharts'],
            links: [
                { name: 'LIVE DEMO ↗', url: 'https://leetcode-wrapped-two.vercel.app' },
                { name: 'GITHUB ↗', url: 'https://github.com/SarangRao20/LeetCodeWrapped' }
            ]
        }
    ],

    additionalProjects: [
        {
            title: 'OLA BDM Analytics',
            category: 'DATA VIZ',
            description: 'Revenue and driver analytics on 50K+ ride records: cohort analysis, executive dashboards, statistical modeling for cancellations and earnings variability.',
            metric: '50K+ RECORDS',
            links: [
                { name: 'DEPLOYED ↗', url: 'https://SarangRao20.github.io/BDM_OLA/' },
                { name: 'GITHUB ↗', url: 'https://github.com/SarangRao20/BDM_OLA' }
            ]
        },
        {
            title: 'Hospital Management System',
            category: 'FULL STACK',
            description: 'Multi-role hospital platform (Admin, Doctor, Patient) with Flask REST API, Vue.js frontend, JWT auth, Celery async task processing, 10+ entity relational schema.',
            metric: 'IITM MAD2 — GRADED A',
            links: [
                { name: 'GITHUB ↗', url: 'https://github.com/SarangRao20/Hospital-Management-System---V2' }
            ]
        },
        {
            title: 'Temple Run (Position-Based)',
            category: 'COMPUTER VISION',
            description: 'Position-based game controller using MediaPipe hand tracking and OpenCV — hand gestures drive in-game movement via grid-based finger position mapping.',
            metric: 'CV · MEDIAPIPE',
            links: [
                { name: 'GITHUB ↗', url: 'https://github.com/SarangRao20/Temple-Run-game-Position-Based' }
            ]
        },
        {
            title: 'Reading Hall Occupancy',
            category: 'COMPUTER VISION',
            description: 'Real-time seat occupancy detection using YOLOv8 and OpenCV with grid calibration for reading hall monitoring.',
            metric: 'YOLOv8 · OPENCV',
            links: [
                { name: 'GITHUB ↗', url: 'https://github.com/SarangRao20/Reading-hall-management' }
            ]
        },
        {
            title: 'HP Battery Charge Limiter',
            category: 'TOOLS & SYSTEMS',
            caseStudy: 'battery',
            description: 'Reverse-engineered HP EC firmware to control battery charge limits — a safety fix shared openly for the community.',
            metric: 'EC FIRMWARE · 2023',
            links: [
                { name: 'GITHUB ↗', url: 'https://github.com/SarangRao20/battery-charge-limiter' }
            ]
        }
    ],

    skills: [
        { group: 'LANGUAGES', items: ['Python', 'C++', 'SQL', 'JavaScript', 'TypeScript'] },
        { group: 'AI / ML', items: ['LangGraph', 'LangChain', 'Gemini API', 'LLM Orchestration', 'Prompt Engineering', 'RAG', 'OpenCV', 'YOLO', 'OCR'] },
        { group: 'BACKEND', items: ['FastAPI', 'Flask', 'REST APIs', 'Celery', 'PostgreSQL', 'MongoDB', 'Redis', 'SQLAlchemy'] },
        { group: 'FRONTEND', items: ['React', 'Vue.js', 'TypeScript', 'Tailwind CSS'] },
        { group: 'TOOLS & SYSTEMS', items: ['Git', 'Linux', 'Docker', 'Google ADK', 'Groq', 'Playwright', 'SQLAlchemy', 'JWT'] }
    ],
    benchmarks: [
        { value: 2, suffix: '', label: 'IDEATHON WINS' },
        { value: 1, suffix: '%', label: 'TOP NATIONAL · RELIANCE SCHOLAR' },
        { value: 4, suffix: '+', label: 'PROD SYSTEMS · LIVE' },
        { value: 5, suffix: '', label: 'INTERNS LED' }
    ]
};

// ===== RENDERERS =====
function renderExperience() {
    const el = document.getElementById('experience-log');
    if (!el) return;
    el.innerHTML = data.experience.map(exp => `
        <li class="log-entry reveal ${exp.status === 'running' ? 'is-running' : ''}" id="${exp.id}">
            <div class="log-rail">
                <span class="log-id mono">${exp.id}</span>
                <span class="log-status mono ${exp.status === 'running' ? 'status-run' : 'status-done'}">
                    ${exp.status === 'running' ? '<span class="dot" aria-hidden="true"></span>RUNNING' : 'COMPLETE'}
                </span>
            </div>
            <div class="log-body">
                <p class="log-date mono">${exp.date}${exp.loc ? ` · ${exp.loc}` : ''}</p>
                <h3 class="log-role">${exp.role}</h3>
                <p class="log-org">${exp.org}</p>
                ${exp.points.length ? `<ul class="log-points">
                    ${exp.points.map(p => `<li>${p}</li>`).join('')}
                </ul>` : ''}
                <div class="tag-row">
                    ${exp.tags.map(t => `<span class="tag mono">${t}</span>`).join('')}
                </div>
            </div>
        </li>
    `).join('');
}

function renderFeatured() {
    const el = document.getElementById('featured-grid');
    if (!el) return;
    el.innerHTML = data.featuredProjects.map((p, i) => `
        <article class="feat-card reveal">
            <header class="feat-head">
                <span class="feat-id mono">P-${String(i + 1).padStart(2, '0')}</span>
                <h3 class="feat-title">${p.title}</h3>
                ${p.subtitle ? `<p class="feat-sub mono">${p.subtitle}</p>` : ''}
            </header>
            <p class="feat-desc">${p.description}</p>
            <footer class="feat-foot">
                <div class="tag-row">${p.tags.map(t => `<span class="tag mono">${t}</span>`).join('')}</div>
                <div class="link-row">${p.caseStudy ?
                    `<a class="text-link mono" href="case.html?p=${p.caseStudy}">CASE STUDY ↗</a>` : ''}${p.links.map(l =>
                    `<a class="text-link mono" href="${l.url}" target="_blank" rel="noopener noreferrer">${l.name}</a>`).join('')}</div>
            </footer>
        </article>
    `).join('');
    const count = document.getElementById('more-count');
    if (count) count.textContent = data.additionalProjects.length + ' SYSTEMS';
    setupReveals(el);
}

function renderMore() {
    const el = document.getElementById('more-work');
    if (!el) return;
    el.innerHTML = data.additionalProjects.map((p, i) => `
        <li class="more-item">
            <span class="more-id mono">P-${String(data.featuredProjects.length + i + 1).padStart(2, '0')}</span>
            <span class="more-cat mono">${p.category}</span>
            <h4 class="more-title">${p.title}</h4>
            <span class="tag mono">${p.metric}</span>
            ${p.links.length ? `<div class="link-row">${p.caseStudy ?
                `<a class="text-link mono" href="case.html?p=${p.caseStudy}">CASE STUDY ↗</a>` : ''}${p.links.map(l =>
                `<a class="text-link mono" href="${l.url}" target="_blank" rel="noopener noreferrer">${l.name}</a>`).join('')}</div>` : ''}
        </li>
    `).join('');
}

function renderSkills() {
    const el = document.getElementById('skills-matrix');
    if (!el) return;
    el.innerHTML = data.skills.map(s => `
        <div class="cap-row reveal">
            <h3 class="cap-group mono">${s.group}</h3>
            <div class="tag-row">
                ${s.items.map(i => `<span class="tag tag-lg mono">${i}</span>`).join('')}
            </div>
        </div>
    `).join('');
}

function renderBenchmarks() {
    const el = document.getElementById('bench-grid');
    if (!el) return;
    el.innerHTML = data.benchmarks.map(b => `
        <div class="bench-item">
            <span class="bench-num"><span data-count="${b.value}"${b.decimals ? ` data-decimals="${b.decimals}"` : ''}>0</span>${b.suffix}</span>
            <span class="bench-label mono">${b.label}</span>
        </div>
    `).join('');
}

// ===== INTERACTIONS =====
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function setupReveals(root = document) {
    const els = root.querySelectorAll('.reveal:not(.in)');
    if (reducedMotion || !('IntersectionObserver' in window)) {
        els.forEach(el => el.classList.add('in'));
        return;
    }
    const obs = new IntersectionObserver(entries => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                e.target.classList.add('in');
                obs.unobserve(e.target);
            }
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });
    els.forEach(el => obs.observe(el));
}

function setupSpecCard() {
    const rows = document.querySelectorAll('#spec-card .spec-row');
    if (reducedMotion) {
        rows.forEach(r => r.classList.add('in'));
        return;
    }
    rows.forEach((r, i) => setTimeout(() => r.classList.add('in'), 250 + i * 140));
}

function setupCounters() {
    const nums = document.querySelectorAll('[data-count]');
    if (reducedMotion || !('IntersectionObserver' in window)) {
        nums.forEach(n => { n.textContent = n.dataset.count; });
        return;
    }
    const animate = el => {
        const target = parseFloat(el.dataset.count);
        const decimals = parseInt(el.dataset.decimals || '0', 10);
        const dur = 900;
        const t0 = performance.now();
        const tick = now => {
            const p = Math.min((now - t0) / dur, 1);
            const eased = 1 - Math.pow(1 - p, 3);
            el.textContent = (target * eased).toFixed(decimals);
            if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
    };
    const obs = new IntersectionObserver(entries => {
        entries.forEach(e => {
            if (e.isIntersecting) { animate(e.target); obs.unobserve(e.target); }
        });
    }, { threshold: 0.5 });
    nums.forEach(n => obs.observe(n));
}

function setupNav() {
    const topbar = document.getElementById('topbar');
    const menuBtn = document.getElementById('menu-btn');
    const nav = document.getElementById('topbar-nav');

    window.addEventListener('scroll', () => {
        topbar.classList.toggle('scrolled', window.scrollY > 24);
    }, { passive: true });

    menuBtn.addEventListener('click', () => {
        const open = nav.classList.toggle('open');
        menuBtn.classList.toggle('open', open);
        menuBtn.setAttribute('aria-expanded', String(open));
    });

    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            nav.classList.remove('open');
            menuBtn.classList.remove('open');
            menuBtn.setAttribute('aria-expanded', 'false');
        });
    });

    // Active section highlighting
    const sections = document.querySelectorAll('section[id]');
    const links = document.querySelectorAll('.nav-link');
    const spy = new IntersectionObserver(entries => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                links.forEach(l => l.classList.toggle('active',
                    l.getAttribute('href') === `#${e.target.id}`));
            }
        });
    }, { rootMargin: '-40% 0px -55% 0px' });
    sections.forEach(s => spy.observe(s));
}

function setupForm() {
    const form = document.getElementById('contact-form');
    const status = document.getElementById('form-status');
    if (!form) return;

    // EmailJS — replace with your own service/template/public key from emailjs.com
    const EMAILJS_PUBLIC_KEY = '3FTJumtq2gKLYBWT7';
    const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

    const validators = {
        name: v => v.length >= 2 ? '' : 'Please enter your name.',
        email: v => EMAIL_RE.test(v) ? '' : 'Please enter a valid email address.',
        message: v => v.length >= 10 ? '' : 'Please write a message (at least 10 characters).'
    };

    const setFieldError = (field, msg) => {
        const input = form.elements[field];
        const errEl = document.getElementById(`${field}-error`);
        input.classList.toggle('invalid', !!msg);
        input.setAttribute('aria-invalid', msg ? 'true' : 'false');
        if (errEl) errEl.textContent = msg;
    };

    const validateField = field => {
        const msg = validators[field](form.elements[field].value.trim());
        setFieldError(field, msg);
        return !msg;
    };

    // Validate on blur, clear the error as soon as the fix is typed
    Object.keys(validators).forEach(field => {
        const input = form.elements[field];
        input.addEventListener('blur', () => {
            if (input.value.trim()) validateField(field);
        });
        input.addEventListener('input', () => {
            if (input.classList.contains('invalid')) validateField(field);
        });
    });

    form.addEventListener('submit', async e => {
        e.preventDefault();
        status.textContent = '';
        status.className = 'form-status mono';

        // Honeypot: real visitors never see or fill this field
        if (form.elements.company && form.elements.company.value) return;

        const fields = Object.keys(validators);
        const invalid = fields.filter(f => !validateField(f));
        if (invalid.length) {
            form.elements[invalid[0]].focus();
            status.textContent = '✗ PLEASE FIX THE HIGHLIGHTED FIELDS ABOVE.';
            status.className = 'form-status mono err';
            return;
        }

        if (typeof emailjs === 'undefined') {
            status.textContent = '✗ EMAIL SERVICE UNAVAILABLE — email me directly at raosarang2006@gmail.com';
            status.className = 'form-status mono err';
            return;
        }

        const btn = form.querySelector('button[type="submit"]');
        const original = btn.textContent;
        btn.textContent = 'Sending…';
        btn.disabled = true;

        try {
            const payload = {
                from_name: form.elements.name.value.trim(),
                from_email: form.elements.email.value.trim(),
                message: form.elements.message.value.trim()
            };
            const res = await emailjs.send('service_erua80f', 'template_9eusq77', payload,
                { publicKey: EMAILJS_PUBLIC_KEY });
            if (res.status === 200) {
                status.textContent = '✓ MESSAGE SENT — I\'ll get back to you soon.';
                status.className = 'form-status mono ok';
                form.reset();
                fields.forEach(f => setFieldError(f, ''));
            } else {
                throw new Error('send failed');
            }
        } catch (err) {
            console.error('Contact form error:', err);
            status.textContent = '✗ SEND FAILED — email me directly at raosarang2006@gmail.com';
            status.className = 'form-status mono err';
        } finally {
            btn.textContent = original;
            btn.disabled = false;
        }
    });
}

// ===== AWARD LAYER =====
const finePointer = window.matchMedia('(pointer: fine)').matches;

// Boot sequence — once per session, skipped for reduced motion
function runBoot(onDone) {
    const boot = document.getElementById('boot');
    const skip = reducedMotion || sessionStorage.getItem('sr-booted');
    if (!boot || skip) {
        if (boot) boot.remove();
        document.body.classList.add('booted');
        onDone();
        return;
    }
    document.body.classList.add('booting');
    const linesEl = document.getElementById('boot-lines');
    const pctEl = document.getElementById('boot-pct');
    const fillEl = document.getElementById('boot-fill');
    const lines = [
        'SARANG.RAO — SYSTEM INIT',
        'LOADING WEIGHTS ............. <span class="ok">OK</span>',
        'CALIBRATING TYPE ............ <span class="ok">OK</span>',
        'MOUNTING PROJECTS ........... <span class="ok">OK</span>',
        'HUMAN VERIFIED .............. <span class="ok">OK</span>'
    ];
    lines.forEach((l, i) => setTimeout(() => {
        const div = document.createElement('div');
        div.innerHTML = l;
        linesEl.appendChild(div);
    }, 120 + i * 170));

    const dur = 1250;
    const t0 = performance.now();
    const tick = now => {
        const p = Math.min((now - t0) / dur, 1);
        const eased = 1 - Math.pow(1 - p, 2);
        pctEl.textContent = Math.round(eased * 100) + '%';
        fillEl.style.width = (eased * 100) + '%';
        if (p < 1) { requestAnimationFrame(tick); return; }
        sessionStorage.setItem('sr-booted', '1');
        boot.classList.add('done');
        document.body.classList.remove('booting');
        document.body.classList.add('booted');
        setTimeout(() => boot.remove(), 750);
        onDone();
    };
    requestAnimationFrame(tick);
}

// Split hero name into letters for staggered entrance + kinetic type
function splitHeroName() {
    const h1 = document.getElementById('hero-name');
    if (!h1) return;
    let idx = 0;
    h1.innerHTML = ['Sarang', 'Rao'].map(word =>
        `<span class="hn-line" aria-hidden="true">${[...word].map(c =>
            `<span class="ch" style="--d:${(idx++ * 0.035).toFixed(3)}s">${c}</span>`).join('')}</span>`
    ).join('');
}

// Variable-font letters respond to cursor proximity (Archivo wght/wdth axes)
function setupKineticName() {
    if (reducedMotion || !finePointer) return;
    const hero = document.querySelector('.hero');
    const chars = [...document.querySelectorAll('#hero-name .ch')];
    if (!hero || !chars.length) return;
    let raf = null, mx = 0, my = 0;
    const RADIUS = 220;
    const update = () => {
        raf = null;
        chars.forEach(ch => {
            const r = ch.getBoundingClientRect();
            const d = Math.hypot(mx - (r.left + r.width / 2), my - (r.top + r.height / 2));
            const t = Math.max(0, 1 - d / RADIUS);
            ch.style.fontVariationSettings = t > 0.01
                ? `'wght' ${(850 - 330 * t).toFixed(0)}, 'wdth' ${(125 - 45 * t).toFixed(1)}`
                : '';
        });
    };
    hero.addEventListener('pointermove', e => {
        mx = e.clientX; my = e.clientY;
        if (!raf) raf = requestAnimationFrame(update);
    });
    hero.addEventListener('pointerleave', () => {
        chars.forEach(ch => { ch.style.fontVariationSettings = ''; });
    });
}

// "EMAIL ME" pill trails the pointer over the big contact CTA
function setupCtaTip() {
    if (!finePointer) return;
    const cta = document.querySelector('.contact-big');
    const tip = document.getElementById('cta-tip');
    if (!cta || !tip) return;
    cta.addEventListener('pointermove', e => {
        tip.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
    }, { passive: true });
    cta.addEventListener('pointerenter', () => tip.classList.add('on'));
    cta.addEventListener('pointerleave', () => tip.classList.remove('on'));
}

// Decode/scramble effect on labels as they enter the viewport
function setupScramble() {
    const els = document.querySelectorAll('[data-scramble]');
    if (!els.length || reducedMotion || !('IntersectionObserver' in window)) return;
    const CHARS = '█▓▒░<>/[]{}=+*#01';
    const scramble = el => {
        const text = el.textContent;
        const dur = 650;
        const t0 = performance.now();
        const tick = now => {
            const p = Math.min((now - t0) / dur, 1);
            const settled = Math.floor(p * text.length);
            el.textContent = [...text].map((c, i) =>
                i < settled || c === ' ' ? c : CHARS[Math.random() * CHARS.length | 0]).join('');
            if (p < 1) requestAnimationFrame(tick);
            else el.textContent = text;
        };
        requestAnimationFrame(tick);
    };
    const obs = new IntersectionObserver(entries => {
        entries.forEach(e => {
            if (e.isIntersecting) { scramble(e.target); obs.unobserve(e.target); }
        });
    }, { threshold: 0.6 });
    els.forEach(el => obs.observe(el));
}

// Reading progress bar (native scrolling everywhere else)
function setupScrolling() {
    const progress = document.getElementById('progress');
    if (!progress) return;
    let raf = null;
    const updateProgress = () => {
        raf = null;
        const max = document.documentElement.scrollHeight - innerHeight;
        progress.style.transform = `scaleX(${max > 0 ? Math.min(scrollY / max, 1) : 0})`;
    };
    window.addEventListener('scroll', () => {
        if (!raf) raf = requestAnimationFrame(updateProgress);
    }, { passive: true });
    updateProgress();
}

// Duplicate marquee content for a seamless -50% loop
function setupMarquee() {
    const track = document.getElementById('marquee-track');
    if (track) track.innerHTML += track.innerHTML;
}

// Magnetic pull on buttons
function setupMagnetic() {
    if (reducedMotion || !finePointer) return;
    document.querySelectorAll('.btn, .theme-btn').forEach(el => {
        el.addEventListener('pointermove', e => {
            const r = el.getBoundingClientRect();
            const dx = e.clientX - (r.left + r.width / 2);
            const dy = e.clientY - (r.top + r.height / 2);
            el.style.transform = `translate(${dx * 0.16}px, ${dy * 0.3}px)`;
        });
        el.addEventListener('pointerleave', () => { el.style.transform = ''; });
    });
}

// Subtle 3D tilt on the hero photo
function setupTilt() {
    if (reducedMotion || !finePointer) return;
    const wrap = document.querySelector('.hero-photo-wrap');
    const img = document.querySelector('.hero-photo');
    if (!wrap || !img) return;
    wrap.addEventListener('pointermove', e => {
        const r = wrap.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;
        img.style.transform = `perspective(700px) rotateY(${(px * 6).toFixed(2)}deg) rotateX(${(-py * 6).toFixed(2)}deg)`;
    });
    wrap.addEventListener('pointerleave', () => { img.style.transform = ''; });
}

// Dark / light toggle, persisted
function setupTheme() {
    const btn = document.getElementById('theme-btn');
    const meta = document.querySelector('meta[name="theme-color"]');
    if (!btn) return;
    const root = document.documentElement;
    const apply = (mode, animate) => {
        if (animate) {
            root.classList.add('theme-anim');
            setTimeout(() => root.classList.remove('theme-anim'), 400);
        }
        root.setAttribute('data-theme', mode);
        btn.textContent = mode === 'dark' ? 'LIGHT' : 'DARK';
        btn.setAttribute('aria-pressed', String(mode === 'dark'));
        if (meta) meta.setAttribute('content', mode === 'dark' ? '#101116' : '#F2F1EB');
    };
    apply(root.getAttribute('data-theme') || 'light', false);
    btn.addEventListener('click', () => {
        const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        try { localStorage.setItem('sr-theme', next); } catch (e) { /* private mode */ }
        apply(next, true);
    });
}

// Copy email address to clipboard
function setupCopyEmail() {
    const btn = document.getElementById('copy-email');
    if (!btn || !navigator.clipboard) return;
    let timer;
    btn.addEventListener('click', async () => {
        try {
            await navigator.clipboard.writeText(btn.dataset.email);
            btn.textContent = 'COPIED ✓';
            btn.classList.add('copied');
            clearTimeout(timer);
            timer = setTimeout(() => {
                btn.textContent = 'COPY';
                btn.classList.remove('copied');
            }, 1800);
        } catch (e) { /* clipboard unavailable — mailto link still works */ }
    });
}

// Live Denver clock in the footer
function setupClock() {
    const el = document.getElementById('local-time');
    if (!el) return;
    const fmt = new Intl.DateTimeFormat('en-US', {
        timeZone: 'Asia/Kolkata', hour12: false,
        hour: '2-digit', minute: '2-digit', second: '2-digit'
    });
    const tick = () => { el.textContent = fmt.format(new Date()); };
    tick();
    setInterval(tick, 1000);
}

function consoleEgg() {
    console.log(
        '%c SARANG.RAO %c You opened the console — clearly we should talk.\n' +
        '%c → raosarang2006@gmail.com · github.com/SarangRao20',
        'background:#1828CE;color:#F2F1EB;font-weight:bold;padding:4px 8px;',
        'color:inherit;padding:4px 0;',
        'color:#1828CE;padding:2px 0;'
    );
}

// ===== INIT =====
document.addEventListener('DOMContentLoaded', () => {
    renderExperience();
    renderFeatured();
    renderMore();
    renderSkills();
    renderBenchmarks();
    splitHeroName();

    setupTheme();
    setupNav();
    setupForm();
    setupMarquee();
    setupClock();
    setupCopyEmail();
    setupScrolling();
    setupCtaTip();
    setupMagnetic();
    setupTilt();
    setupKineticName();
    consoleEgg();

    // Choreography that should wait for the boot screen to lift
    runBoot(() => {
        setupSpecCard();
        setupReveals();
        setupCounters();
        setupScramble();
    });
});