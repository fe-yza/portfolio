import { Fragment, useEffect } from "react"
import { Link } from "react-router-dom"
import "./StudentBudgetingCaseStudy.css"

const FONTS_HREF =
  "https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,400;12..96,600;12..96,800&family=Figtree:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap"

function useStudentBudgetingFonts() {
  useEffect(() => {
    if (document.querySelector('link[data-student-budgeting-fonts="true"]')) return

    const preconnectGoogle = document.createElement("link")
    preconnectGoogle.rel = "preconnect"
    preconnectGoogle.href = "https://fonts.googleapis.com"

    const preconnectGstatic = document.createElement("link")
    preconnectGstatic.rel = "preconnect"
    preconnectGstatic.href = "https://fonts.gstatic.com"
    preconnectGstatic.crossOrigin = "anonymous"

    const stylesheet = document.createElement("link")
    stylesheet.rel = "stylesheet"
    stylesheet.href = FONTS_HREF
    stylesheet.dataset.studentBudgetingFonts = "true"

    document.head.append(preconnectGoogle, preconnectGstatic, stylesheet)
  }, [])
}

const STAGE_SCREENS = [
  { src: "/hero/scotiabank1.png", alt: "Home dashboard showing monthly spending summary and savings goals", caption: "Home" },
  { src: "/hero/scotiabank2.png", alt: "Savings goals overview with progress bars", caption: "Goals" },
  { src: "/hero/scotiabank3.png", alt: "Add a new goal form", caption: "Add goal" },
]

const STAGE_SCREENS_MORE = [
  { src: "/hero/scotiabank4.png", alt: "Spending analytics with donut chart and monthly trend", caption: "Analytics" },
  { src: "/hero/scotiabank5.png", alt: "Transactions list grouped by day", caption: "Transactions" },
  { src: "/hero/scotiabank6.png", alt: "Budget screen with category budgets", caption: "Budget" },
  { src: "/hero/scotiabank7.png", alt: "Advice tab with personalized tips", caption: "Advice" },
]

const GOALS = [
  {
    title: "Answer in one glance",
    body: "The two facts a student checks most — how much they've spent, how close they are to a goal — surface before anything else, with no tapping required.",
    where: "→ Home",
  },
  {
    title: "Make saving feel achievable",
    body: "Abstract \"saving\" becomes named, sized goals with visible progress and a plain-language status, so momentum is always visible.",
    where: "→ Goals overview",
  },
  {
    title: "Default toward consistency",
    body: "Setting up a goal defaults to automatic weekly transfers, with manual saving as the explicit opt-out — the easy path is also the good habit.",
    where: "→ Add a new goal",
  },
]

const FLOW_STEPS = [
  { n: "01", title: "Home", body: "Check spending & goal progress" },
  { n: "02", title: "Goals overview", body: "Review every goal in one list" },
  { n: "03", title: "Add a new goal", body: "Name it, fund it, done" },
]

const SCREEN_SECTIONS = [
  {
    src: "/hero/scotiabank1.png",
    alt: "Home dashboard",
    label: "01 · Home dashboard",
    title: "Every number framed as a decision, not just data",
    body: "The home screen leads with a personal greeting and a single spending figure — but never in isolation. Every number is framed against something: typical spending, a budget ceiling, a goal's finish line.",
    notes: [
      { b: "$437 vs. \"typical spending\"", text: " — turns a raw total into a comparison, so a student can tell if this month is normal without doing the math." },
      { b: "Budget bar at 79%", text: " reads as color and length before it reads as a number, so status is legible at a glance." },
      { b: "Savings goals preview", text: " surfaces three goals with progress bars right on the dashboard — no separate screen needed just to feel the momentum." },
    ],
  },
  {
    src: "/hero/scotiabank2.png",
    alt: "Savings goals overview",
    label: "02 · Savings goals overview",
    title: "Every goal is its own small win in progress",
    body: "Zooming into savings turns three progress bars into full cards — each with a name, a dollar milestone, and a status written in plain language rather than a raw percentage alone.",
    notes: [
      { b: "\"Add a new goal\"", text: " sits first on the page, always the easiest next action rather than buried in a menu." },
      { b: "Status lines", text: " like \"You're ahead by 3 months\" translate a progress bar into something worth feeling good about." },
      { b: "Overflow menu (•••)", text: " keeps edit and pause actions available without cluttering the primary view." },
    ],
  },
  {
    src: "/hero/scotiabank3.png",
    alt: "Add a new goal form",
    label: "03 · Add a new goal",
    title: "Three decisions, not a spreadsheet",
    body: "Setting up a goal asks for a name and a target, grounds it in a real account, then asks the one question that determines whether the habit sticks: how does the money actually get there?",
    notes: [
      { b: "Placeholder examples", text: " (\"Emergency Fund\") lower the blank-page problem of naming a goal from scratch." },
      { b: "Automatic weekly transfer is the default", text: ", expanded and pre-filled — manual saving is available, but never the assumed choice." },
      { b: "\"Move leftover budget at month-end\"", text: " turns unused spending money into savings without asking the student to remember to do it." },
    ],
  },
]

const MORE_CARDS = [
  { src: "/hero/scotiabank4.png", alt: "Spending analytics", title: "Analytics", body: "Category breakdown & monthly trend" },
  { src: "/hero/scotiabank5.png", alt: "Transactions list", title: "Transactions", body: "Searchable, grouped by day" },
  { src: "/hero/scotiabank6.png", alt: "Budget screen", title: "Budget", body: "Category-level limits & pacing" },
  { src: "/hero/scotiabank7.png", alt: "Advice tab", title: "Advice", body: "Personalized, actionable tips" },
]

const SWATCHES = [
  { hex: "#ec111a", name: "Signal red", label: "Headers, primary actions" },
  { hex: "#a80d14", name: "Deep red", label: "Pressed states, emphasis" },
  { hex: "#0d0d0d", name: "Near-black", label: "Body text, headings" },
  { hex: "#f7f7f8", name: "Cool grey", label: "Cards, secondary surfaces", swatchStyle: { background: "#f7f7f8", borderBottom: "1px solid var(--line)" } },
  { hex: "#fdecec", name: "Blush tint", label: "Soft callouts" },
]

const TAKEAWAYS = [
  { strong: "Comparison beats raw numbers.", text: " \"$57 above typical spending\" did more work than the $437 total ever could on its own." },
  { strong: "Small goals need their own language.", text: " A $150 gift and a $900 trip both deserve a status line, not just a percentage." },
  { strong: "Defaults are a design decision.", text: " Making automatic transfer the pre-filled option nudges behavior more than any copy could." },
]

const NEXT_STEPS = [
  { strong: "Usability testing", text: " with current students to validate goal sizes and whether the automatic-transfer default feels safe." },
  { strong: "Accessibility pass", text: " on red/white contrast ratios across every screen, especially small status text." },
  { strong: "Shared goals", text: " — letting a group split a savings goal, like a trip planned with friends." },
]

export default function StudentBudgetingCaseStudy() {
  useStudentBudgetingFonts()

  return (
    <div className="sb-page pt-28 sm:pt-32">
      <div className="sb-wrap">
        <nav className="sb-crumbs" aria-label="Breadcrumb">
          <Link to="/work">← All work</Link>
          <span className="sb-brand">
            <img src="/hero/scotiabankicon.png" alt="" />
            <span className="sb-label">Case study · Mobile app</span>
          </span>
        </nav>

        <header className="sb-hero">
          <span className="sb-label">iOS app · UX / UI design · Personal project</span>
          <h1>Student <span>Budgeting</span> App</h1>
          <p className="sb-lead">
            A banking dashboard rebuilt around how students actually spend and save — small goals, tight budgets, and the need to see it all in one glance.
          </p>
          <dl className="sb-meta">
            <div><dt className="sb-label">Role</dt><dd>Product designer — research, UX flows, UI &amp; visual design</dd></div>
            <div><dt className="sb-label">Platform</dt><dd>iOS, iPhone 15 Pro frame</dd></div>
            <div><dt className="sb-label">Tools</dt><dd>Figma</dd></div>
            <div><dt className="sb-label">Timeline</dt><dd>December 2025 – January 2026</dd></div>
            <div><dt className="sb-label">Scope</dt><dd>End-to-end concept, 7 core screens</dd></div>
          </dl>
        </header>
      </div>

      <div className="sb-wrap">
        <div
          className="sb-stage"
          role="img"
          aria-label="Seven Student Budgeting App screens: home dashboard, savings goals overview, add a new goal, spending analytics, transactions, budget, and advice"
        >
          <div className="sb-stage-scroll">
            <div className="sb-phones">
              {STAGE_SCREENS.map((screen) => (
                <figure key={screen.src}>
                  <img src={screen.src} alt={screen.alt} />
                  <figcaption>{screen.caption}</figcaption>
                </figure>
              ))}
            </div>
            <div className="sb-phones-more">
              {STAGE_SCREENS_MORE.map((screen) => (
                <figure key={screen.src}>
                  <img src={screen.src} alt={screen.alt} />
                  <figcaption>{screen.caption}</figcaption>
                </figure>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="sb-wrap">
        <section className="sb-block sb-split" id="overview">
          <div>
            <span className="sb-label">Overview</span>
            <h2 style={{ marginTop: "12px" }}>Banking apps aren't built for a student's money</h2>
          </div>
          <div className="sb-prose">
            <p>
              <strong>Most banking dashboards are built for a general adult user</strong> — a mortgage, a car payment, a retirement fund. A student's financial life looks different: irregular income, small recurring costs, and savings goals sized in the hundreds, not the thousands — a trip, a gadget, a gift. Squeezed into a generic dashboard, those goals get buried under features that don't apply yet.
            </p>
            <p>
              This concept keeps the trusted visual language of a bank's app — the red, the density, the credibility — but restructures the information around what a student checks daily: <em>how much is left, and how close am I to what I'm saving for.</em>
            </p>
            <p className="sb-hmw">
              <span className="sb-label">How might we</span>
              help students see their spending clearly and stay motivated toward small, specific savings goals?
            </p>
          </div>
        </section>

        <section className="sb-block" id="goals">
          <span className="sb-label">Design goals</span>
          <h2 style={{ marginTop: "12px", fontSize: "clamp(30px,4vw,44px)", fontWeight: 600, maxWidth: "20ch" }}>
            Three principles shaped every screen
          </h2>
          <div className="sb-goals">
            {GOALS.map((goal) => (
              <div className="sb-goal" key={goal.title}>
                <h3>{goal.title}</h3>
                <p>{goal.body}</p>
                <span className="sb-where">{goal.where}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="sb-block" id="flow">
          <span className="sb-label">User flow</span>
          <h2 style={{ marginTop: "12px", fontSize: "clamp(30px,4vw,44px)", fontWeight: 600, maxWidth: "22ch" }}>
            From checking in to committing to a goal
          </h2>
          <p style={{ color: "var(--muted)", maxWidth: "60ch", marginTop: "16px" }}>
            The core path a student takes weekly: check the dashboard, review what they're saving for, and — when something new comes up — set up a goal for it in under a minute.
          </p>
          <div className="sb-flow-scroll">
            <div className="sb-flow">
              {FLOW_STEPS.map((step, i) => (
                <Fragment key={step.n}>
                  {i > 0 && <div className="sb-arrow" aria-hidden="true">→</div>}
                  <div className="sb-step">
                    <span className="sb-n">{step.n}</span>
                    <b>{step.title}</b>
                    <span>{step.body}</span>
                  </div>
                </Fragment>
              ))}
            </div>
            <div className="sb-loop" aria-hidden="true">
              <svg viewBox="0 0 600 40" preserveAspectRatio="none">
                <path
                  d="M590 2 V26 H10 V2"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeDasharray="4 5"
                  vectorEffect="non-scaling-stroke"
                  style={{ color: "var(--accent)" }}
                />
                <path
                  d="M4 10 L10 2 L16 10"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  vectorEffect="non-scaling-stroke"
                  style={{ color: "var(--accent)" }}
                />
              </svg>
            </div>
            <div className="sb-loop" style={{ marginTop: 0 }}>
              <span className="sb-label" style={{ width: "78%", textAlign: "center" }}>
                Back to home, goal now tracked automatically
              </span>
            </div>
          </div>
        </section>

        <section className="sb-block" id="screens" style={{ paddingBottom: "24px" }}>
          <span className="sb-label">Key screens</span>
          <h2 style={{ marginTop: "12px", fontSize: "clamp(30px,4vw,44px)", fontWeight: 600 }}>
            Where the redesign does the most work
          </h2>

          {SCREEN_SECTIONS.map((screen) => (
            <article className="sb-screen" key={screen.src}>
              <div className="sb-shot">
                <img src={screen.src} alt={screen.alt} />
              </div>
              <div className="sb-screen-text">
                <span className="sb-label">{screen.label}</span>
                <h3>{screen.title}</h3>
                <p>{screen.body}</p>
                <ul className="sb-notes">
                  {screen.notes.map((note) => (
                    <li key={note.b}>
                      <span>
                        <b>{note.b}</b>
                        {note.text}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </section>

        <section className="sb-block" id="more">
          <div className="sb-more-intro">
            <div>
              <span className="sb-label">Also in the app</span>
              <h2 style={{ marginTop: "12px", fontSize: "clamp(26px,3.4vw,36px)", fontWeight: 600, maxWidth: "26ch" }}>
                Supporting screens that round out the experience
              </h2>
            </div>
          </div>
          <p style={{ color: "var(--muted)", maxWidth: "60ch", marginTop: "16px" }}>
            Analytics, transactions, budget and advice extend the same dashboard logic into deeper detail — built out, but secondary to the three screens above that carry the core idea.
          </p>
          <div className="sb-more-grid">
            {MORE_CARDS.map((card) => (
              <div className="sb-more-card" key={card.src}>
                <img src={card.src} alt={card.alt} />
                <b>{card.title}</b>
                <span>{card.body}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="sb-block" id="system">
          <span className="sb-label">Visual system</span>
          <h2 style={{ marginTop: "12px", fontSize: "clamp(30px,4vw,44px)", fontWeight: 600, maxWidth: "22ch" }}>
            A white canvas, one red signal
          </h2>
          <p style={{ color: "var(--muted)", maxWidth: "62ch", marginTop: "16px" }}>
            The system stays deliberately restrained — white surfaces, near-black text, and a single confident red reserved for headers and primary actions. No gradients, no secondary accent competing for attention: red always means "this is the important thing on the screen."
          </p>

          <div className="sb-swatches">
            {SWATCHES.map((swatch) => (
              <div className="sb-sw" key={swatch.hex}>
                <i style={swatch.swatchStyle ?? { background: swatch.hex }}></i>
                <div>
                  <b>{swatch.name}</b>
                  <code>{swatch.hex.toUpperCase()}</code>
                  <small>{swatch.label}</small>
                </div>
              </div>
            ))}
          </div>

          <div className="sb-sys-grid">
            <div className="sb-panel">
              <h3>Type</h3>
              <div className="sb-specimen">
                <span className="sb-big">$437</span>
                <span style={{ fontWeight: 600, fontSize: "20px" }}>Good morning, Feyza</span>
                <span style={{ color: "var(--muted)", fontSize: "14px" }}>Rounded geometric sans throughout</span>
              </div>
              <p>A confident, rounded sans keeps the tone reassuring rather than alarming — bold weights carry dollar figures and headlines, regular weight handles supporting detail and disclaimers.</p>
            </div>
            <div className="sb-panel">
              <h3>Components</h3>
              <div className="sb-demo">
                <div className="sb-bar-demo">
                  <div className="sb-row">
                    <span>79% of budget</span>
                    <span>$550 / $700</span>
                  </div>
                  <div className="sb-track">
                    <div className="sb-fill"></div>
                  </div>
                </div>
                <div className="sb-chips">
                  <span className="sb-chip">Spending</span>
                  <span className="sb-chip sb-chip-on">Saving</span>
                  <span className="sb-chip">Tips</span>
                </div>
                <div className="sb-btn-p">Add a new goal</div>
              </div>
              <p>A single progress-bar language runs through the whole app — budgets, goals, category limits — so status is always readable the same way, wherever it appears.</p>
            </div>
          </div>
        </section>

        <section className="sb-block" id="reflection" style={{ borderBottom: "none" }}>
          <span className="sb-label">Reflection</span>
          <h2 style={{ marginTop: "12px", fontSize: "clamp(30px,4vw,44px)", fontWeight: 600, maxWidth: "22ch" }}>
            What I learned, and where it goes next
          </h2>
          <div className="sb-two">
            <div>
              <h3>Takeaways</h3>
              <ul>
                {TAKEAWAYS.map((item) => (
                  <li key={item.strong}>
                    <strong>{item.strong}</strong>
                    {item.text}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3>Next steps</h3>
              <ul>
                {NEXT_STEPS.map((item) => (
                  <li key={item.strong}>
                    <strong>{item.strong}</strong>
                    {item.text}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <nav className="sb-next" aria-label="More projects">
          <Link to="/work/focusup"><span className="sb-label">← Previous</span><b>FocusUp</b></Link>
          <a href="#"><span className="sb-label">Next →</span><b>Project name</b></a>
        </nav>
      </div>
    </div>
  )
}
