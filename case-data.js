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
        intro: 'Elysia is a desktop AI that you actually talk to — wake word, bidirectional audio, screen sharing, and text fallback — built around a 3-process architecture so the voice loop never blocks the tool loop. The assistant persists memory across sessions, renders a live character on screen, and can operate the machine through ~110 tool functions across browser, filesystem, terminal, system control, and Google integrations.',
        problem: 'Desktop assistants that feel "voice-first" are either cloud-bottlenecked (mic → server → reply with seconds of latency), parking-lot wake-word hacks, or single-OS science projects. The hard part is not the voice — it is keeping voice responsive while a tool call takes 30 seconds to execute, across 4 operating systems, without the whole thing freezing.',
        challenges: [
            { icon: '🔊', title: 'Real-Time Voice Loop', desc: 'Audio must stream both ways continuously — a 2-second freeze kills the conversation flow.' },
            { icon: '⚡', title: 'Tool Execution Latency', desc: 'File search or browser automation can take 30+ seconds — the voice loop cannot block during this.' },
            { icon: '🖥️', title: 'Cross-Platform Tools', desc: 'The same tool must work on Linux GNOME, macOS, and Windows with wildly different OS APIs.' },
            { icon: '🧠', title: 'Memory Persistence', desc: 'The assistant must remember context across sessions — not just chat history, but extracted facts, preferences, and relationships.' }
        ],
        beforeAfter: {
            before: {
                label: 'BEFORE · TYPICAL ASSISTANT',
                content: 'Voice sends request to server, waits for processing, streams response back. Average round-trip: 2–4 seconds. During tool execution, the UI freezes — no feedback, no cancellation.',
                issues: ['Cloud latency bottleneck', 'Frozen UI during tools', 'No cross-session memory', 'Single-OS only']
            },
            after: {
                label: 'AFTER · ELYSIA ARCHITECTURE',
                content: '3-process separation: voice stays responsive in its own event loop while tools execute in a background agent. Round-trip under 800ms. Live status updates during long-running tools.',
                wins: ['Local voice pipeline', 'Non-blocking tool execution', '7-category persistent memory', '4 OS backends']
            }
        },
        visualWorkflow: [
            { icon: '🎤', label: 'STEP 01', title: 'Wake Word Detection', desc: 'Passive listening triggers on keyword. The assistant enters active listening mode with screen context capture.' },
            { icon: '🌊', label: 'STEP 02', title: 'Bidirectional Audio Stream', desc: 'User speech streams to Gemini Live API. Voice Activity Detection gates silence. Text fallback activates if voice fails.' },
            { icon: '🧠', label: 'STEP 03', title: 'Intent & Tool Routing', desc: 'Orchestrator parses intent, routes tool calls to Python agent over WebSocket. Voice loop never touches tool execution.' },
            { icon: '⚙️', label: 'STEP 04', title: 'Tool Execution', desc: 'Agent executes in separate process — browser automation, file ops, system control. Progress streams back to UI.' },
            { icon: '💬', label: 'STEP 05', title: 'Response Synthesis', desc: 'Gemini synthesizes response with tool results. Audio streams back. Memory extraction runs asynchronously.' }
        ],
        keyDecisions: [
            { icon: '🔄', title: 'Why 3 Processes Instead of Threads', rationale: 'Node is single-threaded. A synchronous tool call blocks the event loop — and the WebSocket heartbeat stops. Separate processes mean the voice loop stays free no matter what the agent is doing.' },
            { icon: '⏱️', title: 'Latency Budget: 800ms Target', rationale: 'Real-time voice is not a feature, it is a latency budget. Every serialization, model call, and WebSocket hop sits inside that 800ms window. Miss it and the conversation feels broken.' },
            { icon: '📦', title: 'Tool Abstraction Layer', rationale: 'One contract for 110 tools across 4 OS backends. Adding Windows support meant implementing the interface, not rewriting the orchestrator. The abstraction cost ~15% more code; the payoff is that a new OS is a weekend, not a rewrite.' }
        ],
        outcomes: [
            { metric: '110+', label: 'TOOL FUNCTIONS', desc: 'Browser automation, file system, terminal, clipboard, OCR, Google integrations — all with OS abstraction' },
            { metric: '<800ms', label: 'VOICE LATENCY', desc: 'End-of-speech to first audio byte. Text fallback activates if voice path degrades past 2 seconds' },
            { metric: '4', label: 'OS BACKENDS', desc: 'Linux GNOME/Wayland, macOS, Windows — same orchestrator, different agent implementations' },
            { metric: '7', label: 'MEMORY CATEGORIES', desc: 'Identity, preferences, facts, context, relationships, history, feedback — extracted and persisted across sessions' }
        ],
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
            'Process boundaries beat "clever" threading — separating the voice loop from the tool loop removed an entire class of freezes. The hardest bugs were always "the UI froze during a tool call" — putting tools in another process eliminated them by construction.',
            'Real-time voice is a latency budget, not a feature: every model call and every serialization sits inside that 800ms window. The text fallback is not nice-to-have — it is the difference between "degraded" and "broken."',
            'Abstraction cost paid off — 4 OS backends stayed alive only because the tool layer had a single contract. Adding a new OS backend was implementing the interface, not rewriting the orchestrator.'
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
        intro: 'A loan is a gauntlet, not a form. NBFC strings KYC, fraud detection, underwriting, and sanction into a single LangGraph where documents are parsed by Gemini Vision and every decision can fall back to a human. Each agent owns its stage, passes structured state to the next, and the graph itself enforces the sequence.',
        problem: 'Loan origination at an NBFC was a chain of disconnected systems — KYC reads ID proofs, fraud checks bank docs, underwriting wants statements, sanction wants a memo. Each step touched a different document, model and API. An applicant would upload everything once, then re-upload fragments at each stage because the systems did not talk. And in regulated finance, "the model decided" is not an acceptable answer — every auto-decision needs a human escape hatch.',
        challenges: [
            { icon: '🔗', title: 'Disconnected Stages', desc: 'KYC, fraud, underwriting, and sanction lived in different systems — no shared state, constant re-uploads.' },
            { icon: '📄', title: 'Document Parsing Confidence', desc: 'Financial docs (bank statements, ID proofs) must be extracted with high confidence — or routed to human review.' },
            { icon: '⚖️', title: 'Regulatory Compliance', desc: 'The model can recommend, but a human must sign off on denials. Auto-approve has strict thresholds.' },
            { icon: '👥', title: 'Team Coordination', desc: 'Led 5 interns building separate agent modules — needed single state schema and consistent deployment pipeline.' }
        ],
        beforeAfter: {
            before: {
                label: 'BEFORE · FRAGMENTED PIPELINE',
                content: 'Four separate systems, four manual handoffs. Applicant uploads docs 3+ times. KYC verification takes 2 days. Fraud detection re-OCRs the same documents. No audit trail.',
                issues: ['Manual handoffs at every stage', 'Re-upload same documents', 'No confidence scores', 'No human review path']
            },
            after: {
                label: 'AFTER · UNIFIED GRAPH',
                content: 'One LangGraph, one upload. KYC → fraud → underwriting → sanction with structured state passing. Confidence-gated parsing routes low-confidence extractions to human review. Full audit trail.',
                wins: ['Single state graph', 'Upload once, parsed once', 'Confidence-based routing', 'Three-tier decisioning']
            }
        },
        visualWorkflow: [
            { icon: '🆔', label: 'AGENT 01', title: 'KYC Verification', desc: 'Gemini Vision extracts ID proof fields. Liveness check matches selfie to ID. Writes { verified, id_type, confidence } to state.' },
            { icon: '🚨', label: 'AGENT 02', title: 'Fraud Detection', desc: 'Analyzes bank statements for anomalies. Checks document authenticity. Emits [ { type, severity, source } ] fraud flags to state.' },
            { icon: '📊', label: 'AGENT 03', title: 'Underwriting', desc: 'Risk scoring based on financial documents. Reads KYC + fraud results from state. Writes { risk_score, recommendation } for sanction.' },
            { icon: '✅', label: 'AGENT 04', title: 'Sanction Decision', desc: 'Three-tier routing: risk < 0.3 → auto-approve, risk > 0.75 → human review, middle → review with model suggestion.' }
        ],
        keyDecisions: [
            { icon: '📊', title: 'Structured State Over Chat', rationale: 'A chat-based agent re-reads all documents at every turn. The graph edge carries the parsed result — KYC verifies the ID once, and fraud reads that verification from state. Token usage dropped ~60%.' },
            { icon: '🎯', title: 'Confidence as the Gate', rationale: 'Extraction confidence below 0.85 routes to manual review. The threshold was tuned with the team — below it, the model does not auto-decide. A wrong auto-approval costs more than a slow manual review.' },
            { icon: '🤝', title: 'Human-in-the-Loop by Design', rationale: 'The sanction agent can recommend, but only a human reviewer can finalize a rejection. This is not a cop-out — it is the product spec for regulated software.' }
        ],
        outcomes: [
            { metric: '60%', label: 'TOKEN REDUCTION', desc: 'Structured state passing means each agent reads parsed results from state, not by re-OCR-ing documents' },
            { metric: '0.85', label: 'CONFIDENCE THRESHOLD', desc: 'Below this, extraction routes to manual review with partial parse shown. Model never silently decides on uncertain data' },
            { metric: '3-tier', label: 'DECISIONING', desc: 'Auto-approve (low risk, no fraud), human review (high risk or mid-range), reject (human-only with model recommendation)' },
            { metric: '5', label: 'INTERNS LED', desc: 'Each owned an agent module. Single state schema kept integration clean. CI/CD on Vercel — same demo the team ships' }
        ],
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
            'Structured state between agents beats chatty agents — a graph edge carries evidence; a chat re-derives it. Token usage dropped ~60% and "the model forgot what it already read" failures disappeared.',
            'Confidence-based parsing is what lets a demo survive production: sprinkle "I do not know" into the model path and the fallback logic finds itself. The threshold is not a random number — it is the line between "the model decided" and "a human decided."',
            'Human-in-the-loop is not a cop-out, it is the product spec for regulated software. The model can recommend; in an NBFC, a human must sign off on denials. The graph enforces this by construction.'
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
        intro: 'Many HP laptops have an Embedded Controller that physically supports charging limits — HP just never wired up a UI for them. This project finds that hidden register, keeps it capped at 80%, and fights the firmware continuously to hold it there. The EC register resets within 3 seconds of any write, so the daemon cannot set-and-forget — it has to re-assert the value on every poll cycle. Ships as a one-click Windows installer with a system-tray GUI, and an AUR package for Arch Linux.',
        problem: 'Lithium cells age fastest when held at 100%. HP ships a "Battery Care" setting on some models that caps at 80% — and silently omits it on others, including the Pavilion 15-eg series. No third-party tool existed, no BIOS option, no workaround. The register is there in the Embedded Controller firmware — HP uses it on their business line — but the consumer Pavilion ships without the UI toggle. The only path was hardware-level reverse engineering.',
        challenges: [
            { icon: '🔍', title: 'Hidden Register Discovery', desc: 'The charge control register exists in EC firmware but has zero public documentation for this model.' },
            { icon: '⚡', title: 'Firmware Reset Race', desc: 'HP firmware resets the register within 3 seconds of any write — set-and-forget is impossible.' },
            { icon: '🖥️', title: 'Cross-Platform Delivery', desc: 'Windows needs WinRing0 driver + system tray GUI. Linux needs systemd daemon + ACPI WMI path.' },
            { icon: '🌍', title: 'Community Scalability', desc: 'Register locations vary by model — needed a detection script + community register database.' }
        ],
        beforeAfter: {
            before: {
                label: 'BEFORE · NO LIMIT CONTROL',
                content: 'HP Pavilion 15-eg charges to 100% and holds there permanently. Lithium cells degrade fastest at high SoC. Business-line HP models have Battery Care UI — consumer line silently omits it.',
                issues: ['100% charge hold damages battery', 'No BIOS option for Pavilion series', 'No third-party tool existed', 'Register undocumented']
            },
            after: {
                label: 'AFTER · DAEMON ENFORCEMENT',
                content: 'Daemon continuously writes to EC register 0x76 (BDVO). Windows polls every 3s via WinRing0. Linux polls every 60s via ACPI WMI. One-click installer + AUR package.',
                wins: ['80% charge limit enforced', 'System tray status (🟢 limited, 🔴 auto)', 'AUR package for Arch', 'Community register database']
            }
        },
        visualWorkflow: [
            { icon: '📖', label: 'STEP 01', title: 'DSDT Disassembly', desc: 'Extracted ACPI DSDT table from /sys/firmware. Disassembled to ASL. Manually mapped Embedded Controller namespace — found BDVO at offset 0x76.' },
            { icon: '🧪', label: 'STEP 02', title: 'Empirical Testing', desc: 'Wrote values to 0x76 and observed charging LED. 0x40 = AUTO (resume), 0x45 = INHIBIT (stop). No docs existed — every value was trial-and-observation.' },
            { icon: '🔄', label: 'STEP 03', title: 'Firmware Fight Discovery', desc: 'Firmware resets 0x76 within 3 seconds. A one-time write does not hold. The daemon IS the fix — continuous re-assertion every poll cycle.' },
            { icon: '🛠️', label: 'STEP 04', title: 'Cross-Platform Packaging', desc: 'Windows: WinRing0 driver + PowerShell daemon + C# GUI + Inno Setup installer. Linux: Python daemon + systemd unit + PKGBUILD for AUR.' },
            { icon: '📚', label: 'STEP 05', title: 'Community Extension', desc: 'Shipped detect-ec.sh scanner + docs/known-registers.md. Owners of other HP models can find their register and submit PRs.' }
        ],
        keyDecisions: [
            { icon: '🔬', title: 'Manual DSDT Analysis', rationale: 'No public docs for register 0x76 on HP Pavilion 15-eg. Disassembling the DSDT and mapping EC field names by hand produced the register location. The detect-ec.sh scanner turns this manual process into a repeatable discovery for other models.' },
            { icon: '⏱️', title: 'Continuous Enforcement Loop', rationale: 'The register resets within 3 seconds. Set-and-forget is impossible. The daemon is not a configuration tool — it is a continuous enforcement loop. Uninstall the daemon and the limit disappears.' },
            { icon: '📦', title: 'One-Click Native Packaging', rationale: 'Windows: Inno Setup installer registers a logon-persistent scheduled task — no service management. Arch: PKGBUILD installs systemd unit. An affected HP owner should not need to know what a DSDT is to protect their battery.' }
        ],
        outcomes: [
            { metric: '0x76', label: 'EC REGISTER', desc: 'BDVO register at offset 0x76. Values: 0x40 (AUTO), 0x45 (INHIBIT). Found via manual DSDT disassembly — zero public docs' },
            { metric: '<3s', label: 'FIRMWARE RESET', desc: 'HP firmware resets the register within 3 seconds. Windows daemon polls every 3s, Linux every 60s. The polling loop is the fix' },
            { metric: '15', label: 'GITHUB STARS', desc: 'Community adoption across HP Pavilion and Omen models. AUR package published. Known-registers.md database growing' },
            { metric: '2', label: 'PLATFORMS', desc: 'Windows (WinRing0 + system tray GUI) and Arch Linux (Python daemon + systemd). Same enforcement logic, native packaging' }
        ],
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
            'Firmware volatility is the real adversary — the register resets. The engineering answer is not "set once" but "hold continuously": the daemon is the fix. Remove it and the limit disappears within seconds.',
            'Manual reverse engineering is a skill, not a shortcut. Disassembling the DSDT and mapping EC namespaces by hand produced the register that no existing public resource documented. The detect-ec.sh scanner turns that manual process into a repeatable one for other models.',
            'Open infrastructure multiplies individual work: a PKGBUILD and a known-registers.md turn a one-laptop fix into a community-maintained tool that every affected HP owner can use without knowing what a DSDT is.'
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
                ${c.challenges ? `
                <div class="cs-challenges">
                    ${c.challenges.map(ch => `
                    <div class="cs-challenge-card reveal">
                        <div class="cs-challenge-icon">${ch.icon}</div>
                        <h3 class="cs-challenge-title">${ch.title}</h3>
                        <p class="cs-challenge-desc">${ch.desc}</p>
                    </div>`).join('')}
                </div>` : ''}
            </div>
        </section>

        ${c.beforeAfter ? `
        <section class="cs-section reveal">
            <div class="cs-sec-num mono">03</div>
            <div class="cs-sec-inner">
                <h2 class="cs-sec-title mono">BEFORE / AFTER</h2>
                <div class="cs-before-after">
                    <div class="cs-ba-panel cs-ba-before">
                        <span class="cs-ba-label mono">${c.beforeAfter.before.label}</span>
                        <p class="cs-ba-content">${c.beforeAfter.before.content}</p>
                        ${c.beforeAfter.before.issues ? `
                        <ul class="cs-ba-list">
                            ${c.beforeAfter.before.issues.map(i => `<li>${i}</li>`).join('')}
                        </ul>` : ''}
                    </div>
                    <div class="cs-ba-panel cs-ba-after">
                        <span class="cs-ba-label mono">${c.beforeAfter.after.label}</span>
                        <p class="cs-ba-content">${c.beforeAfter.after.content}</p>
                        ${c.beforeAfter.after.wins ? `
                        <ul class="cs-ba-list">
                            ${c.beforeAfter.after.wins.map(w => `<li>${w}</li>`).join('')}
                        </ul>` : ''}
                    </div>
                </div>
            </div>
        </section>` : ''}

        ${c.visualWorkflow ? `
        <section class="cs-section reveal">
            <div class="cs-sec-num mono">${c.beforeAfter ? '04' : '03'}</div>
            <div class="cs-sec-inner">
                <h2 class="cs-sec-title mono">HOW IT WORKS</h2>
                <div class="cs-visual-workflow">
                    ${c.visualWorkflow.map(step => `
                    <div class="cs-wf-step reveal">
                        <div class="cs-wf-node">${step.icon}</div>
                        <div class="cs-wf-content">
                            <span class="cs-wf-label mono">${step.label}</span>
                            <h3 class="cs-wf-title">${step.title}</h3>
                            <p class="cs-wf-desc">${step.desc}</p>
                        </div>
                    </div>`).join('')}
                </div>
            </div>
        </section>` : ''}

        ${c.keyDecisions ? `
        <section class="cs-section reveal">
            <div class="cs-sec-num mono">${(c.beforeAfter ? 1 : 0) + (c.visualWorkflow ? 1 : 0) + 3}</div>
            <div class="cs-sec-inner">
                <h2 class="cs-sec-title mono">KEY DECISIONS</h2>
                <div class="cs-decisions">
                    ${c.keyDecisions.map(kd => `
                    <div class="cs-decision-card reveal">
                        <div class="cs-decision-icon">${kd.icon}</div>
                        <div class="cs-decision-body">
                            <h3 class="cs-decision-title">${kd.title}</h3>
                            <p class="cs-decision-rationale">${kd.rationale}</p>
                        </div>
                    </div>`).join('')}
                </div>
            </div>
        </section>` : ''}

        ${c.outcomes ? `
        <section class="cs-section reveal">
            <div class="cs-sec-num mono">${(c.beforeAfter ? 1 : 0) + (c.visualWorkflow ? 1 : 0) + (c.keyDecisions ? 1 : 0) + 3}</div>
            <div class="cs-sec-inner">
                <h2 class="cs-sec-title mono">OUTCOMES</h2>
                <div class="cs-outcomes">
                    ${c.outcomes.map(out => `
                    <div class="cs-outcome-card reveal">
                        <div class="cs-outcome-metric">${out.metric}</div>
                        <div class="cs-outcome-label mono">${out.label}</div>
                        <p class="cs-outcome-desc">${out.desc}</p>
                    </div>`).join('')}
                </div>
            </div>
        </section>` : ''}

        <section class="cs-section reveal">
            <div class="cs-sec-num mono">${(c.beforeAfter ? 1 : 0) + (c.visualWorkflow ? 1 : 0) + (c.keyDecisions ? 1 : 0) + (c.outcomes ? 1 : 0) + 3}</div>
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
            <div class="cs-sec-num mono">${(c.beforeAfter ? 1 : 0) + (c.visualWorkflow ? 1 : 0) + (c.keyDecisions ? 1 : 0) + (c.outcomes ? 1 : 0) + 4}</div>
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
            <div class="cs-sec-num mono">${(c.beforeAfter ? 1 : 0) + (c.visualWorkflow ? 1 : 0) + (c.keyDecisions ? 1 : 0) + (c.outcomes ? 1 : 0) + 5}</div>
            <div class="cs-sec-inner">
                <h2 class="cs-sec-title mono">STACK</h2>
                <div class="cs-stack-grid">
                    ${c.stack.map(t => `<span class="tag tag-lg mono">${t}</span>`).join('')}
                </div>
            </div>
        </section>

        <section class="cs-section reveal">
            <div class="cs-sec-num mono">${(c.beforeAfter ? 1 : 0) + (c.visualWorkflow ? 1 : 0) + (c.keyDecisions ? 1 : 0) + (c.outcomes ? 1 : 0) + 6}</div>
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