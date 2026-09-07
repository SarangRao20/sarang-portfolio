const CASE_STUDIES = {
    elysia: {
        id: 'P-01',
        category: 'AI AGENTS',
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
        title: 'HP Battery Charge Limiter',
        tagline: 'Reverse-engineered EC firmware — open source.</br>Taking back charge control HP never shipped.',
        intro: 'HP laptops do not expose a battery charge-limit control on every model — so someone has to. Battery Charge Limiter logs into the Embedded Controller (EC) and sets the ceiling your way.',
        problem: 'Keeping a lithium battery between ~20% and ~80% extends its life. HP ships that as a setting on some models and omits it on others, so heavy users were stuck babysitting the charger — or overcharging their battery nightly.',
        approach: [
            { t: 'EMBEDDED CONTROLLER ACCESS', d: 'Reverse-engineered the HP EC interface to read and write the charge-limit registers directly, no vendor UI required.' },
            { t: 'OS-LEVEL WRAPPER', d: 'A small, tooled utility that exposes the register as a simple intended setting — keep charging, or stop where the chemistry is happiest.' },
            { t: 'OPEN SOURCE', d: 'Released openly so every HP owner with the same omission gets the same fix — community tested and adopted.' }
        ],
        impact: [
            { v: '2023', k: 'YEARS OLD' },
            { v: 'EC', k: 'FIRMWARE HACK' },
            { v: 'OSS', k: 'OPEN SOURCE' }
        ],
        stack: ['EC Firmware', 'C', 'Linux'],
        lessons: [
            'The hack that ships is the one nobody bundles: real users adopt software that fixes a gap a vendor ignored.',
            'Reverse engineering with a clear target register is engineering; the discipline is documenting it so strangers can rebuild it.'
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
        note.innerHTML = `
            <div class="case-head">
                <span class="feat-id mono">404</span>
                <h1 class="case-title">CASE STUDY NOT FOUND</h1>
            </div>`;
        document.title = '404 · Sarang Rao';
        return c;
    }
    document.title = `${c.title} — Case Study · Sarang Rao`;
    note.innerHTML = `
        <header class="case-head">
            <span class="feat-id mono">CASE STUDY · ${c.id}</span>
            <span class="more-cat mono">${c.category}</span>
            <h1 class="case-title">${c.title}</h1>
            <p class="case-tagline">${c.tagline}</p>
            <div class="link-row">${c.links.map(l =>
                `<a class="text-link mono" href="${l.url}" target="_blank" rel="noopener noreferrer">${l.name}</a>`).join('')}</div>
        </header>

        <section class="case-section">
            <h2 class="sec-label mono">INTRO</h2>
            <p class="case-body">${c.intro}</p>
        </section>

        <section class="case-section">
            <h2 class="sec-label mono">THE PROBLEM</h2>
            <p class="case-body">${c.problem}</p>
        </section>

        <section class="case-section">
            <h2 class="sec-label mono">THE APPROACH</h2>
            <div class="case-steps">${c.approach.map(s => `
                <div class="case-step reveal">
                    <span class="case-step-id mono">${s.t}</span>
                    <p class="case-body">${s.d}</p>
                </div>`).join('')}</div>
        </section>

        <section class="case-section">
            <h2 class="sec-label mono">IMPACT</h2>
            <div class="case-metrics">${c.impact.map(m => `
                <div class="case-metric">
                    <span class="metric-v">${m.v}</span>
                    <span class="metric-k mono">${m.k}</span>
                </div>`).join('')}</div>
        </section>

        <section class="case-section">
            <h2 class="sec-label mono">STACK</h2>
            <div class="tag-row">${c.stack.map(t => `<span class="tag mono">${t}</span>`).join('')}</div>
        </section>

        <section class="case-section">
            <h2 class="sec-label mono">WHAT I'D DO DIFFERENTLY</h2>
            <ul class="case-lessons">${c.lessons.map(l => `<li>${l}</li>`).join('')}</ul>
        </section>

        <div class="case-cta">
            <a class="text-link mono" href="index.html#projects">← BACK TO WORK</a>
        </div>
    `;
    return c;
}