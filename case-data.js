/* Architecture diagrams — inline HTML */
const DIAGRAMS = {
    elysia: `<div class="cs-arch cs-arch-h">
        <div class="cs-arch-node">
            <div class="cs-arch-node-tech mono">REACT + ELECTRON</div>
            <div class="cs-arch-node-name">UI Shell</div>
            <div class="cs-arch-node-desc mono">Voice · Screen · Controls</div>
        </div>
        <div class="cs-arch-edge">
            <div class="cs-arch-edge-label mono">ws ↔</div>
            <div class="cs-arch-edge-line"><div class="cs-arch-edge-dot"></div><div class="cs-arch-edge-dot"></div><div class="cs-arch-edge-dot"></div></div>
        </div>
        <div class="cs-arch-node cs-arch-center">
            <div class="cs-arch-node-tech mono">NODE.JS</div>
            <div class="cs-arch-node-name">Orchestrator</div>
            <div class="cs-arch-node-desc mono">Routing · Gemini · APIs</div>
        </div>
        <div class="cs-arch-edge">
            <div class="cs-arch-edge-label mono">ws ↔</div>
            <div class="cs-arch-edge-line"><div class="cs-arch-edge-dot"></div><div class="cs-arch-edge-dot"></div><div class="cs-arch-edge-dot"></div></div>
        </div>
        <div class="cs-arch-node">
            <div class="cs-arch-node-tech mono">PYTHON</div>
            <div class="cs-arch-node-name">Desktop Agent</div>
            <div class="cs-arch-node-desc mono">110 Tools · 4 OS</div>
        </div>
    </div>`,

    nbfc: `<div class="cs-arch cs-arch-pipeline">
        <div class="cs-pipe-stage">
            <span class="cs-pipe-idx mono">01</span>
            <span class="cs-pipe-label mono">KYC</span>
            <span class="cs-pipe-desc">ID Proof · Liveness</span>
        </div>
        <div class="cs-pipe-arrow mono">▶</div>
        <div class="cs-pipe-stage">
            <span class="cs-pipe-idx mono">02</span>
            <span class="cs-pipe-label mono">FRAUD</span>
            <span class="cs-pipe-desc">Doc Analysis · OCR</span>
        </div>
        <div class="cs-pipe-arrow mono">▶</div>
        <div class="cs-pipe-stage">
            <span class="cs-pipe-idx mono">03</span>
            <span class="cs-pipe-label mono">UNDERWRITING</span>
            <span class="cs-pipe-desc">Risk · Confidence</span>
        </div>
        <div class="cs-pipe-arrow mono">▶</div>
        <div class="cs-pipe-stage cs-pipe-final">
            <span class="cs-pipe-idx mono">04</span>
            <span class="cs-pipe-label mono">SANCTION</span>
            <span class="cs-pipe-desc">Approve · Review · Reject</span>
        </div>
    </div>`,

    battery: `<div class="cs-arch cs-arch-cycle">
        <div class="cs-cycle-actor cs-cycle-daemon">
            <div class="cs-cycle-actor-label mono">DAEMON</div>
            <div class="cs-cycle-actor-desc">polls every 3s</div>
            <div class="cs-cycle-write mono">→ write 0x45</div>
        </div>
        <div class="cs-cycle-center">
            <div class="cs-cycle-reg">
                <div class="cs-cycle-reg-label mono">EC REG 0x76</div>
                <div class="cs-cycle-reg-name mono">BDVO</div>
                <div class="cs-cycle-reg-pulse"></div>
            </div>
        </div>
        <div class="cs-cycle-actor cs-cycle-firmware">
            <div class="cs-cycle-actor-label mono">HP FIRMWARE</div>
            <div class="cs-cycle-actor-desc">adversarial</div>
            <div class="cs-cycle-reset mono">← resets &lt;3s</div>
        </div>
    </div>`
};

const CASE_STUDIES = {
    elysia: {
        id: 'P-01',
        category: 'AI AGENTS',
        diagramKey: 'elysia',
        title: 'Elysia-AI',
        tagline: 'Real-time voice AI desktop assistant — solo.</br>110 tools, 4 OS backends, 3 processes, one pipeline.',
        intro: 'Elysia is a desktop AI that you actually talk to — wake word, bidirectional audio, screen sharing, and text fallback — built around a 3-process architecture so the voice loop never blocks the tool loop.',
        problem: 'Desktop assistants that feel "voice-first" are either cloud-bottlenecked (mic → server → reply with seconds of latency), parking-lot wake-word hacks, or single-OS science projects. I wanted one that wakes itself, streams audio both ways in real time, and can genuinely operate the machine it runs on.',
        approach: [
            { t: '3-PROCESS ARCHITECTURE', d: 'React shell (UI) ⇋ Node orchestrator ⇋ Python desktop agent, communicating over WebSockets. The voice stream belongs to its own process so a long-running tool call never freezes audio.' },
            { t: 'BIDIRECTIONAL AUDIO', d: 'Gemini Live API with streaming audio both ways, voice activity detection, and an automatic text fallback so conversations never brick when the voice layer hiccups.' },
            { t: 'WAKE WORD + THE LOOP', d: 'Wake word detection gates the assistant — it listens, then talks, in a tight low-latency loop with screen sharing context.' },
            { t: 'THE TOOL LAYER', d: '~110 tool functions across 21 modules — browser automation, filesystem, terminal, system control, clipboard, OCR, Google integrations — across 4 OS backends (Linux GNOME/Wayland, macOS, Windows).' },
            { t: 'MEMORY + PRESENCE', d: 'Persistent memory with 7-category extraction, plus a canvas holographic visualizer and video character states so the assistant has a face on screen.' }
        ],
        impact: [
            { v: '110+', k: 'TOOLS' },
            { v: '21', k: 'MODULES' },
            { v: '4', k: 'OS BACKENDS' },
            { v: '3', k: 'PROCESSES' }
        ],
        stack: ['Gemini Live API', 'LangGraph', 'Electron', 'TypeScript', 'WebRTC', 'Node.js'],
        lessons: [
            'Process boundaries beat "clever" threading — separating the voice loop from the tool loop removed an entire class of freezes.',
            'Real-time voice is a latency budget, not a feature: every model call and every serialization sits inside it.',
            'Abstraction cost paid off — 4 OS backends stayed alive only because the tool layer had a single contract.'
        ],
        links: [
            { name: 'GITHUB ↗', url: 'https://github.com/SarangRao20/Elysia-AI' }
        ]
    },

    nbfc: {
        id: 'P-02',
        category: 'AI AGENTS',
        diagramKey: 'nbfc',
        title: 'FinServe NBFC',
        tagline: 'Multi-agent loan origination — team lead.</br>Four agents, one state graph, humans in the loop.',
        intro: 'A loan is a gauntlet, not a form. NBFC strings KYC, fraud detection, underwriting, and sanction into a single LangGraph where documents are parsed by Gemini Vision and every decision can fall back to a human.',
        problem: 'Loan origination at an NBFC was a chain of disconnected systems — KYC reads ID proofs, fraud checks bank docs, underwriting wants statements, sanction wants a memo. Each step touched a different document, model and API. The team needed one graph that moved an application through every stage with structured evidence, not a chat.',
        approach: [
            { t: 'ONE GRAPH, FOUR AGENTS', d: 'KYC → fraud → underwriting → sanction agents connected on LangGraph with structured state passing between nodes.' },
            { t: 'DOCUMENT PARSING WITH CONFIDENCE', d: 'Gemini Vision + OCR extracted financial documents; extraction carried confidence checks and dropped to manual review when it could not stand behind its own parse.' },
            { t: 'HUMAN-IN-THE-LOOP', d: 'Three-tier decisioning — auto-approve, manual review, reject — so the model never quietly auto-denies a customer.' },
            { t: 'PRODUCTION SHAPING', d: 'FastAPI + MongoDB + Redis on Vercel with CI/CD; the same pipeline the team demos is the one that ships.' }
        ],
        impact: [
            { v: '4', k: 'AGENT TYPES' },
            { v: 'OCR', k: 'VISION PARSER' },
            { v: 'CI/CD', k: 'VERCEL DEPLOYED' },
            { v: '5', k: 'INTERNS LED' }
        ],
        stack: ['LangGraph', 'Gemini Vision', 'FastAPI', 'Redis', 'MongoDB', 'Python'],
        lessons: [
            'Structured state between agents beats chatty agents — a graph edge carries evidence; a chat re-derives it.',
            'Confidence-based parsing is what lets a demo survive production: sprinkle "I do not know" into the model path and the fallback logic finds itself.',
            'Human-in-the-loop is not a cop-out, it is the product spec for regulated software.'
        ],
        links: [
            { name: 'LIVE DEMO ↗', url: 'https://nbfc-inc.vercel.app/' },
            { name: 'GITHUB ↗', url: 'https://github.com/SarangRao20/NBFC' }
        ]
    },

    battery: {
        id: 'P-09',
        category: 'TOOLS & SYSTEMS',
        diagramKey: 'battery',
        title: 'HP Battery Charge Limiter',
        tagline: 'HP omits the charge limit on your model. So I reverse-engineered it.</br>Manual DSDT analysis. Cross-platform daemon. AUR package. Windows installer.',
        intro: 'Many HP Pavilion laptops have an Embedded Controller that physically supports charging limits — HP just never wired up a UI for them. This project finds that hidden register, keeps it capped at 80%, and fights the firmware continuously to hold it there. Ships as a one-click Windows installer and an AUR package for Arch Linux.',
        problem: 'Lithium cells age fastest when held at 100%. HP ships a "Battery Care" setting on some models that caps at 80% — and silently omits it on others, including the Pavilion 15-eg series. No third-party tool, no BIOS option, no workaround. The only path was to find the register at the hardware level and write to it directly.',
        approach: [
            { t: 'MANUAL REVERSE ENGINEERING', d: 'Disassembled the ACPI DSDT table to map Embedded Controller namespaces. Located register 0x76 (BDVO) as the charge-control register. Empirically verified: 0x40 = AUTO (resume), 0x45 = INHIBIT (stop). No existing public documentation existed for this model.' },
            { t: 'THE FIRMWARE FIGHT', d: 'HP Pavilion firmware resets register 0x76 within seconds of any write. The daemon cannot set-and-forget — it has to continuously re-assert the value. Windows daemon polls every 3 seconds; Linux uses the ACPI WMI path (\\_SB.WMID.SBCO) which is stable enough for a 60-second poll.' },
            { t: 'CROSS-PLATFORM DELIVERY', d: 'Windows: WinRing0 EC I/O driver, PowerShell daemon with system-tray icons (🟢🔴⚫), C# WinForms GUI dashboard, one-click Inno Setup installer that registers a logon-persistent scheduled task. Arch Linux: Python daemon as a systemd service, detect-ec.sh scanner, one-command setup.sh, and a full PKGBUILD published to AUR.' },
            { t: 'COMMUNITY EXTENSION', d: 'The reverse engineering is model-specific — register 0x76 and values 0x40/0x45 are HP Pavilion 15-eg. To scale this, the repo ships docs/known-registers.md (community register database), docs/GENERIC_GUIDE.md (how to find your own register), and detect scripts for both platforms so owners of different models can replicate the discovery.' }
        ],
        impact: [
            { v: '15', k: 'GITHUB STARS' },
            { v: 'AUR', k: 'ARCH LINUX PACKAGE' },
            { v: 'EXE', k: 'WINDOWS INSTALLER' },
            { v: '2', k: 'PLATFORMS' }
        ],
        stack: ['Python', 'PowerShell', 'C# WinForms', 'DSDT / ACPI', 'systemd', 'AUR / PKGBUILD', 'WinRing0'],
        lessons: [
            'Firmware volatility is the real adversary — the register resets. The engineering answer is not "set once" but "hold continuously": the daemon is the fix.',
            'Manual reverse engineering is a skill, not a shortcut. Disassembling the DSDT and mapping EC namespaces by hand produced the register that no existing public resource documented.',
            'Open infrastructure multiplies individual work: a PKGBUILD and a known-registers.md turn a one-laptop fix into a community-maintained tool that every affected HP owner can use.'
        ],
        links: [
            { name: 'GITHUB ↗', url: 'https://github.com/SarangRao20/battery-charge-limiter' }
        ]
    }
};

function renderCaseStudy(id) {
    const c = CASE_STUDIES[id];
    const note = document.getElementById('case-root');
    if (!note) return null;
    if (!c) {
        note.innerHTML = `<div class="cs-404"><span class="mono" style="color:var(--blue);font-size:.7rem;letter-spacing:.14em">404 — NOT FOUND</span><h1 style="font-stretch:124%;font-weight:850;font-size:clamp(3rem,10vw,6rem);line-height:.93;letter-spacing:-.03em;margin-top:.5rem">CASE STUDY</h1><a class="text-link mono" href="index.html#projects" style="margin-top:2rem;display:inline-block">← BACK TO WORK</a></div>`;
        document.title = '404 · Sarang Rao';
        return c;
    }
    document.title = `${c.title} — Case Study · Sarang Rao`;
    const diagram = c.diagramKey && DIAGRAMS[c.diagramKey] ? DIAGRAMS[c.diagramKey] : null;
    note.innerHTML = `
        <section class="cs-hero">
            <div class="cs-hero-top">
                <span class="cs-breadcrumb mono">CASE STUDY · ${c.id}</span>
                <span class="cs-category-badge mono">${c.category}</span>
            </div>
            <h1 class="cs-title">${c.title}</h1>
            <p class="cs-tagline">${c.tagline}</p>
            <div class="cs-hero-links">${c.links.map(l =>
                `<a class="text-link mono" href="${l.url}" target="_blank" rel="noopener noreferrer">${l.name}</a>`).join('')}
            </div>
        </section>

        <div class="cs-stats-strip">
            ${c.impact.map(m => `
                <div class="cs-stat-cell">
                    <span class="cs-stat-num mono" data-cs-val="${m.v}">${m.v}</span>
                    <span class="cs-stat-key mono">${m.k}</span>
                </div>`).join('')}
        </div>

        ${diagram ? `
        <div class="cs-diagram-wrap reveal">
            <div class="cs-diagram-label mono">SYSTEM ARCHITECTURE</div>
            ${diagram}
        </div>` : ''}

        <section class="cs-section reveal">
            <div class="cs-sec-num mono">01</div>
            <div class="cs-sec-inner">
                <h2 class="cs-sec-title mono">INTRO</h2>
                <p class="cs-body cs-lead-body">${c.intro}</p>
            </div>
        </section>

        <section class="cs-section cs-section-problem reveal">
            <div class="cs-sec-num mono">02</div>
            <div class="cs-sec-inner">
                <h2 class="cs-sec-title mono">THE PROBLEM</h2>
                <blockquote class="cs-pullquote">${c.problem}</blockquote>
            </div>
        </section>

        <section class="cs-section reveal">
            <div class="cs-sec-num mono">03</div>
            <div class="cs-sec-inner">
                <h2 class="cs-sec-title mono">THE APPROACH</h2>
                <ol class="cs-timeline">
                    ${c.approach.map((s, i) => `
                        <li class="cs-timeline-item reveal">
                            <div class="cs-timeline-counter mono">${String(i + 1).padStart(2, '0')}</div>
                            <div class="cs-timeline-body">
                                <h3 class="cs-timeline-title mono">${s.t}</h3>
                                <p class="cs-body">${s.d}</p>
                            </div>
                        </li>`).join('')}
                </ol>
            </div>
        </section>

        <section class="cs-section reveal">
            <div class="cs-sec-num mono">04</div>
            <div class="cs-sec-inner">
                <h2 class="cs-sec-title mono">IMPACT</h2>
                <div class="cs-impact-grid">
                    ${c.impact.map(m => `
                        <div class="cs-impact-cell">
                            <span class="cs-impact-v">${m.v}</span>
                            <span class="cs-impact-k mono">${m.k}</span>
                        </div>`).join('')}
                </div>
            </div>
        </section>

        <section class="cs-section reveal">
            <div class="cs-sec-num mono">05</div>
            <div class="cs-sec-inner">
                <h2 class="cs-sec-title mono">STACK</h2>
                <div class="cs-stack-grid">
                    ${c.stack.map(t => `<span class="tag tag-lg mono">${t}</span>`).join('')}
                </div>
            </div>
        </section>

        <section class="cs-section reveal">
            <div class="cs-sec-num mono">06</div>
            <div class="cs-sec-inner">
                <h2 class="cs-sec-title mono">WHAT I'D DO DIFFERENTLY</h2>
                <ul class="cs-lessons-new">
                    ${c.lessons.map((l, i) => `
                        <li class="cs-lesson-item reveal">
                            <span class="cs-lesson-idx mono">${String(i + 1).padStart(2, '0')}</span>
                            <p class="cs-body">${l}</p>
                        </li>`).join('')}
                </ul>
            </div>
        </section>

        <div class="cs-footer-cta">
            <div class="cs-cta-links">
                ${c.links.map(l =>
                    `<a class="text-link mono" href="${l.url}" target="_blank" rel="noopener noreferrer">${l.name}</a>`).join('')}
            </div>
            <a class="text-link mono cs-back-link" href="index.html#projects">← ALL PROJECTS</a>
        </div>
    `;
    return c;
}