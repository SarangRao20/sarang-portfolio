// ============================================
//   SCROLL CINEMA — GSAP + ScrollTrigger scenes
//   S0 hero melt · S1 bench · S2 terminal auto-boot
//   S3 word reveal · S4 exp draw · S5 projects horizontal
//   S6 skills drift · S8 contact zoom · monogram
// ============================================
(function () {
    'use strict';

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const finePointer = window.matchMedia('(pointer: fine)').matches;
    if (reducedMotion || !window.gsap || !window.ScrollTrigger) return;

    document.addEventListener('DOMContentLoaded', () => {
        gsap.registerPlugin(ScrollTrigger);
        ScrollTrigger.config({ ignoreMobileResize: true });

        // ---------- S0 · HERO MELT — layered parallax (photo first) ----------
        const hero = document.querySelector('.hero');
        const nameEl = document.getElementById('hero-name');
        const gridEl = document.querySelector('.hero-grid');
        const specEl = document.getElementById('spec-card');
        const photoEl = document.querySelector('.hero-photo-wrap');
        const eyebrow = document.querySelector('.hero-eyebrow');
        const actions = document.querySelector('.hero-actions');
        if (hero && gridEl) {
            const s0 = gsap.timeline({
                scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: 0.6 }
            });
            if (eyebrow) s0.to(eyebrow, { yPercent: 160, autoAlpha: 0 }, 0);
            if (nameEl) s0.to(nameEl, { yPercent: 28, opacity: 0.18 }, 0);
            s0.to(gridEl, { yPercent: 7 }, 0);
            if (specEl) s0.to(specEl, { yPercent: 20 }, 0);
            if (photoEl) s0.to(photoEl, { yPercent: -10, scale: 1.045, ease: 'power1.out' }, 0);
            if (actions) s0.to(actions, { yPercent: 60, autoAlpha: 0.35 }, 0);
        }

        // Ruler draws left→right as the hero leaves
        const ruler = document.querySelector('.ruler');
        if (ruler) {
            gsap.fromTo(ruler, { scaleX: 0 }, {
                scaleX: 1,
                transformOrigin: '0% 50%',
                ease: 'none',
                scrollTrigger: { trigger: hero, start: 'top top', end: '+=60%', scrub: 0.4 }
            });
        }

        // ---------- S1 · BENCH — rise + counters in place ----------
        const bench = document.querySelector('.bench');
        if (bench) {
            gsap.from('.bench-item', {
                y: 26,
                autoAlpha: 0,
                duration: 0.7,
                stagger: 0.08,
                ease: 'power2.out',
                scrollTrigger: { trigger: bench, start: 'top 88%' }
            });
            gsap.to('.bench-grid', {
                yPercent: -14,
                ease: 'none',
                scrollTrigger: { trigger: bench, start: 'top bottom', end: 'bottom top', scrub: true }
            });
        }

        // Terminal holds its own: pin desktop, larger widths only
        const bDesktop = gsap.matchMedia();
        bDesktop.add('(min-width: 1000px) and (prefers-reduced-motion: no-preference)', () => {
            const termShell = document.querySelector('.term-shell');
            const termScreen = document.getElementById('term-screen');
            const termBody = document.getElementById('term-body');
            const termBar = document.getElementById('term-toggle');
            if (!termShell || !termScreen || !termBody || !termBar) return;

            termBody.hidden = false;
            termBar.setAttribute('aria-expanded', 'true');
            termScreen.dataset.booted = '1';

            const LINES = [
                { p: '$', t: 'whoami', o: 'sarang.rao — AI/ML engineer, generally capable' },
                { p: '$', t: 'ls ~/production', o: 'agentic-doc/&nbsp; cv-inventory/&nbsp; conversational-ai/&nbsp; elysia/&nbsp; nbfc/&nbsp; battery/' },
                { p: '$', t: 'launch agentic-doc', o: '<span class="term-ok">[ OK ]</span>&nbsp; fastapi + google adk · document intelligence' },
                { p: '$', t: 'launch cv-inventory', o: '<span class="term-ok">[ OK ]</span>&nbsp; computer vision · room inventory verification' },
                { p: '$', t: 'launch conversational-ai', o: '<span class="term-ok">[ OK ]</span>&nbsp; tenant / landlord self-service · session state' },
                { p: '$', t: 'git log --oneline -3', o: '9f2d1c1 consolidate two repos → one production codebase<br>4b7a0e2 team docs · onboarding<br>a1c0ffee ship cv pipeline' },
                { p: '$', t: 'status', o: '<span class="term-ok">● RUN-01 RUNNING</span>&nbsp;· 5 interns · JAN 2026 — PRESENT' }
            ];

            const els = [];
            termScreen.innerHTML = '';
            LINES.forEach(ln => {
                const d = document.createElement('div');
                d.className = 'term-out term-scrub';
                d.innerHTML =
                    '<span class="term-ok">' + ln.p + '</span> <span class="term-hl">' + ln.t + '</span><br>' + ln.o;
                termScreen.appendChild(d);
                els.push(d);
            });
            const blinker = document.createElement('span');
            blinker.className = 'term-cursor';
            blinker.style.cssText = 'opacity:1;width:0.5em;height:1em;background:#4ADE80;display:inline-block;animation:term-blink 1.06s steps(1) infinite;';
            termScreen.appendChild(blinker);

            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: termShell,
                    start: 'top top',
                    end: '+=260%',
                    pin: true,
                    scrub: 0.5,
                    anticipatePin: 1
                }
            });
            els.forEach((el, i) => {
                const a = i / els.length;
                const b = (i + 1) / els.length;
                tl.fromTo(el, { autoAlpha: 0, y: 6 }, { autoAlpha: 1, y: 0, duration: b - a, ease: 'none' }, a);
            });
        });

        // ---------- S3 · OVERVIEW LEAD — word-by-word scrub ----------
        const lead = document.querySelector('.overview-text .lead');
        if (lead) {
            const txt = lead.textContent.trim();
            lead.setAttribute('aria-label', txt);
            lead.classList.add('wm');
            lead.innerHTML = txt.split(/\s+/).map(w => `<span class="w">${w}</span>`).join(' ');
            const words = lead.querySelectorAll('.w');
            const blur = finePointer ? 'blur(6px)' : 'blur(2px)';
            gsap.fromTo(words,
                { opacity: 0.06, yPercent: 40, filter: blur },
                {
                    opacity: 1,
                    yPercent: 0,
                    filter: 'blur(0px)',
                    stagger: 0.06,
                    duration: 0.5,
                    ease: 'none',
                    scrollTrigger: { trigger: '.overview-grid', start: 'top 75%', end: 'bottom 45%', scrub: 0.6 }
                }
            );
        }

        // ---------- S4 · EXPERIENCE — points draw in ----------
        const logPoints = document.querySelectorAll('#experience-log .log-points li');
        if (logPoints.length) {
            gsap.from(logPoints, {
                opacity: 0,
                y: 18,
                stagger: 0.12,
                ease: 'power1.out',
                scrollTrigger: { trigger: '#experience-log', start: 'top 80%' }
            });
        }

        // ---------- S5 · PROJECTS — horizontal track (wide desktops) ----------
        const bWide = gsap.matchMedia();
        bWide.add('(min-width: 1200px) and (min-height: 640px) and (pointer: fine) and (prefers-reduced-motion: no-preference)', () => {
            const scroller = document.getElementById('proj-scroll');
            const track = document.getElementById('proj-track');
            if (!scroller || !track) return;

            document.body.classList.add('hscroll');
            document.querySelectorAll('#featured-grid .feat-card').forEach(c => c.classList.add('in'));
            const more = track.querySelector('.more-work');
            if (more) more.open = true;

            const dist = () => Math.max(0, track.scrollWidth - window.innerWidth + 80);
            gsap.to(track, {
                x: () => -dist(),
                ease: 'none',
                scrollTrigger: {
                    trigger: scroller,
                    start: 'top top',
                    end: () => '+=' + dist(),
                    pin: true,
                    scrub: 0.6,
                    anticipatePin: 1,
                    invalidateOnRefresh: true
                }
            });
            requestAnimationFrame(() => ScrollTrigger.refresh());

            return () => {
                document.body.classList.remove('hscroll');
                if (more) more.open = false;
            };
        });

        // ---------- S6 · SKILLS — soft drift ----------
        const skillsMatrix = document.getElementById('skills-matrix');
        if (skillsMatrix) {
            gsap.to(skillsMatrix, {
                yPercent: 8,
                ease: 'none',
                scrollTrigger: { trigger: '#skills', start: 'top bottom', end: 'bottom top', scrub: true }
            });
        }

        // ---------- S8 · CONTACT — big type rises into view ----------
        const big = document.querySelector('.contact-big');
        if (big) {
            gsap.fromTo(big, { scale: 0.72, opacity: 0.35, transformOrigin: '50% 100%' }, {
                scale: 1,
                opacity: 1,
                transformOrigin: '50% 100%',
                ease: 'none',
                scrollTrigger: { trigger: '#contact', start: '20% bottom', end: 'center center', scrub: 0.5 }
            });
            gsap.to('.contact-big-arrow', {
                x: 26,
                ease: 'none',
                scrollTrigger: { trigger: '#contact', start: 'center bottom', end: 'top top', scrub: true }
            });
        }

        // ---------- GLOBAL · watermark monogram + ambient glow ----------
        const mono = document.querySelector('.monogram');
        if (mono) {
            gsap.to(mono, {
                y: -260,
                ease: 'none',
                scrollTrigger: { trigger: 'body', start: 'top top', end: 'bottom bottom', scrub: 0.4 }
            });
        }
        const amb = document.querySelector('.ambient');
        if (amb) {
            gsap.to(amb, {
                y: 320,
                x: -160,
                ease: 'none',
                scrollTrigger: { trigger: 'body', start: 'top top', end: 'bottom bottom', scrub: 0.6 }
            });
        }

        window.addEventListener('load', () => ScrollTrigger.refresh());
    });
})();