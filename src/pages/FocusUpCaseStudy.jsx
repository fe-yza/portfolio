import ProjectNavigation from "../components/ProjectNavigation"
import { Fragment, useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { AnimatePresence, motion } from "framer-motion"
import "./FocusUpCaseStudy.css"

const FONTS_HREF =
  "https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,400;12..96,600;12..96,800&family=Figtree:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap"

function useFocusUpFonts() {
  useEffect(() => {
    if (document.querySelector('link[data-focusup-fonts="true"]')) return

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
    stylesheet.dataset.focusupFonts = "true"

    document.head.append(preconnectGoogle, preconnectGstatic, stylesheet)
  }, [])
}

const STAGE_SCREENS = [
  { src: "/hero/focusup-frames-1.png", alt: "Onboarding screen asking what you are focusing on today", caption: "Onboard" },
  { src: "/hero/focusup-frames-2.png", alt: "Home screen with weekly focus total and today's activity", caption: "Home" },
  { src: "/hero/focusup-frames-3.png", alt: "New focus session setup screen", caption: "Set up" },
  { src: "/hero/focusup-frames-4.png", alt: "Active focus timer showing 42:18 of 90 minutes", caption: "Focus" },
  { src: "/hero/focusup-frames-5.png", alt: "Session complete screen celebrating 90 minutes of focus", caption: "Complete" },
]

const GOALS = [
  {
    title: "Start in seconds",
    body: "Every extra decision is a chance to procrastinate. The primary action is always the biggest thing on screen, and smart defaults do the rest.",
    where: "→ Home, Set up",
  },
  {
    title: "Protect the zone",
    body: "Once a session starts, the interface steps back: one timer, one motivating line, and only the controls you might need.",
    where: "→ Focus",
  },
  {
    title: "Make progress felt",
    body: "Finishing should feel like a win. Streaks, focus points and a completed task turn an invisible habit into something you can see grow.",
    where: "→ Complete, Home",
  },
]

const FLOW_STEPS = [
  { n: "01", title: "Onboard", body: "Pick what you’re focusing on" },
  { n: "02", title: "Home", body: "See the week, tap Start" },
  { n: "03", title: "Set up", body: "Task, length, environment" },
  { n: "04", title: "Focus", body: "Timer runs, tasks tick off" },
  { n: "05", title: "Complete", body: "Stats, streak, reward" },
]

const SCREEN_SECTIONS = [
  {
    src: "/hero/focusup-frames-1.png",
    alt: "Onboarding screen",
    label: "01 · Onboarding",
    title: "Start with intent, not a sign-up form",
    body: "The first question the app asks is the one that matters most: what are you focusing on today? Answering it sets up the rest of the experience before the user has typed a single thing.",
    notes: [
      { b: "Horizontal carousel picker", text: " — Exams, Assignments, Notes and more slide past a centred, highlighted chip. It’s faster than a list and feels playful on first open." },
      { b: "Headline as motivation", text: " — “It’s time to FocusUp” doubles as brand moment and nudge, with a single glowing CTA." },
    ],
  },
  {
    src: "/hero/focusup-frames-2.png",
    alt: "Home screen",
    label: "02 · Home",
    title: "Your week at a glance, one button to begin",
    body: "Home answers two questions instantly: how am I doing, and what’s next? A personal greeting and weekly total lead into a single, oversized “Start Focus Session” button.",
    notes: [
      { b: "Week strip", text: " keeps today anchored in context without a full calendar view." },
      { b: "Today’s Activity", text: " pairs a time-goal pill with a task list showing estimated minutes, so planning and doing live side by side." },
      { b: "Centre play button", text: " in the tab bar makes starting a session reachable from anywhere in the app." },
    ],
  },
  {
    src: "/hero/focusup-frames-3.png",
    alt: "New focus session setup",
    label: "03 · Session setup",
    title: "Three choices, then you’re in",
    body: "Setup is deliberately short: what you’re working on, how long, and how protected you want to be. Everything else is optional.",
    notes: [
      { b: "Duration presets", text: " (25, 50, 90 min) reflect common study rhythms, with Custom for everyone else." },
      { b: "Environment toggles", text: " — focus music, silenced notifications, focus mode — turn the phone from distraction into ally." },
      { b: "Optional goal field", text: " gives the session a finish line without forcing extra input." },
    ],
  },
  {
    src: "/hero/focusup-frames-4.png",
    alt: "Active focus timer",
    label: "04 · Focus session",
    title: "A calm timer that stays out of the way",
    body: "During a session the interface quiets down. A glowing progress ring and large numerals carry the screen, readable at a glance from across a desk.",
    notes: [
      { b: "Progress ring", text: " shows elapsed time spatially, so you feel how far you’ve come, not just the minutes left." },
      { b: "Motivational line", text: " — “Discipline today creates freedom tomorrow” — sits above the timer as a quiet reminder of why." },
      { b: "Today’s Tasks", text: " stay in reach at the bottom, so checking something off never means leaving the session." },
    ],
  },
  {
    src: "/hero/focusup-frames-5.png",
    alt: "Session complete",
    label: "05 · Session complete",
    title: "Celebrate the finish, set up the next start",
    body: "The reward screen is where the habit is built. It names the user, names the achievement, and turns one session into visible progress.",
    notes: [
      { b: "Four stat tiles", text: " — goals completed, focus time, current streak, focus points — give different kinds of motivation to different kinds of students." },
      { b: "Completed task card", text: " connects the session back to real work." },
      { b: "“Take a break” leads", text: ", with “Back to home” secondary — encouraging healthy rest instead of burnout." },
    ],
  },
]

const SWATCHES = [
  { hex: "#0c0d1c", name: "Midnight", label: "Base background" },
  { hex: "#1a1e63", name: "Deep indigo", label: "Surface gradient" },
  { hex: "#576eee", name: "Periwinkle", label: "Primary, gradient start" },
  { hex: "#5ab3c5", name: "Aqua", label: "Gradient end, progress" },
  { hex: "#81bdea", name: "Sky", label: "Highlight numerals" },
]

const TAKEAWAYS = [
  { strong: "Hierarchy is behaviour design.", text: " Making “Start” the largest element on every screen did more for the goal than any feature." },
  { strong: "Rewards need restraint.", text: " The complete screen celebrates without gamifying so hard that the work itself gets lost." },
  { strong: "A consistent signal builds trust.", text: " Reserving the gradient for primary actions made each screen instantly readable." },
]

const NEXT_STEPS = [
  { strong: "Usability testing", text: " with students during exam season to validate session lengths and the setup flow." },
  { strong: "Accessibility pass", text: " on the smallest labels and captions, checking contrast against the dark gradient." },
  { strong: "Stats & streaks tab", text: " to expand the weekly view into long-term progress and study patterns." },
]

export default function FocusUpCaseStudy() {
  useFocusUpFonts()
  const [lightboxIndex, setLightboxIndex] = useState(null)

  const closeLightbox = () => setLightboxIndex(null)
  const showNext = () =>
    setLightboxIndex((i) => (i === null ? i : (i + 1) % STAGE_SCREENS.length))
  const showPrev = () =>
    setLightboxIndex((i) => (i === null ? i : (i - 1 + STAGE_SCREENS.length) % STAGE_SCREENS.length))

  useEffect(() => {
    if (lightboxIndex === null) return
    document.body.style.overflow = "hidden"
    const onKey = (e) => {
      if (e.key === "Escape") closeLightbox()
      else if (e.key === "ArrowRight") showNext()
      else if (e.key === "ArrowLeft") showPrev()
    }
    window.addEventListener("keydown", onKey)
    return () => {
      document.body.style.overflow = ""
      window.removeEventListener("keydown", onKey)
    }
  }, [lightboxIndex])

  return (
    <div className="fu-page pt-28 sm:pt-32">
      <div className="fu-wrap">
        <nav className="fu-crumbs" aria-label="Breadcrumb">
          <Link to="/work">← All work</Link>
          <span className="fu-label">Case study · Mobile app</span>
        </nav>

        <header className="fu-hero">
          <span className="fu-label">iOS app · UX / UI design</span>
          <h1>
            <img className="fu-logo" src="/hero/focusup-frames-title.png" alt="FocusUp" />
          </h1>
          <p className="fu-lead">
            A study companion that turns “I should really focus” into a session you can start in one tap — and finish feeling proud of.
          </p>
          <dl className="fu-meta">
            <div><dt className="fu-label">Role</dt><dd>Product designer — research, UX flows, UI &amp; visual design</dd></div>
            <div><dt className="fu-label">Platform</dt><dd>iOS, iPhone 15 Pro frame</dd></div>
            <div><dt className="fu-label">Tools</dt><dd>Figma</dd></div>
            <div><dt className="fu-label">Timeline</dt><dd>September 2025 – February 2026</dd></div>
            <div><dt className="fu-label">Scope</dt><dd>End-to-end concept, 5 core screens</dd></div>
          </dl>
        </header>
      </div>

      <div className="fu-wrap">
        <div
          className="fu-stage"
          aria-label="Five FocusUp screens: onboarding, home, new session setup, active focus timer, and session complete"
        >
          <div className="fu-stage-scroll">
            <div className="fu-phones">
              {STAGE_SCREENS.map((screen, i) => (
                <figure
                  key={screen.src}
                  role="button"
                  tabIndex={0}
                  onClick={() => setLightboxIndex(i)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault()
                      setLightboxIndex(i)
                    }
                  }}
                  aria-label={`Enlarge the ${screen.caption} screen`}
                >
                  <img src={screen.src} alt={screen.alt} />
                  <figcaption>{screen.caption}</figcaption>
                </figure>
              ))}
            </div>
          </div>
        </div>
        <p className="fu-label fu-stage-caption">Click each screen to enlarge</p>
      </div>

      <div className="fu-wrap">
        <section className="fu-block fu-split" id="overview">
          <div>
            <span className="fu-label">Overview</span>
            <h2 style={{ marginTop: "12px" }}>The problem with “just focus”</h2>
          </div>
          <div className="fu-prose">
            <p>
              <strong>Students don’t lack study time — they lose it.</strong> A two-hour block becomes forty minutes of real work between notifications, tab-switching and deciding what to do next. Most timer apps solve the clock but not the friction: they don’t know what you’re working on, and they give you nothing when you finish.
            </p>
            <p>
              FocusUp treats a study session as a small ritual with a beginning, a middle and a reward. It asks what you’re working on, protects the time while you’re in it, and makes the payoff visible when you’re done — so the next session is easier to start.
            </p>
            <p className="fu-hmw">
              <span className="fu-label">How might we</span>
              help students start focused work faster, stay in it longer, and actually feel the progress they make?
            </p>
          </div>
        </section>

        <section className="fu-block" id="goals">
          <span className="fu-label">Design goals</span>
          <h2 style={{ marginTop: "12px", fontSize: "clamp(30px,4vw,44px)", fontWeight: 600, maxWidth: "20ch" }}>
            Three principles shaped every screen
          </h2>
          <div className="fu-goals">
            {GOALS.map((goal) => (
              <div className="fu-goal" key={goal.title}>
                <h3>{goal.title}</h3>
                <p>{goal.body}</p>
                <span className="fu-where">{goal.where}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="fu-block" id="flow">
          <span className="fu-label">User flow</span>
          <h2 style={{ marginTop: "12px", fontSize: "clamp(30px,4vw,44px)", fontWeight: 600, maxWidth: "22ch" }}>
            One loop, designed to repeat
          </h2>
          <p style={{ color: "var(--muted)", maxWidth: "60ch", marginTop: "16px" }}>
            The core journey is a single loop. The end of one session hands you straight back to the start of the next — either a break or home.
          </p>
          <div className="fu-flow-scroll">
            <div className="fu-flow">
              {FLOW_STEPS.map((step, i) => (
                <Fragment key={step.n}>
                  {i > 0 && <div className="fu-arrow" aria-hidden="true">→</div>}
                  <div className="fu-step">
                    <span className="fu-n">{step.n}</span>
                    <b>{step.title}</b>
                    <span>{step.body}</span>
                  </div>
                </Fragment>
              ))}
            </div>
            <div className="fu-loop" aria-hidden="true">
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
            <div className="fu-loop" style={{ marginTop: 0 }}>
              <span className="fu-label" style={{ width: "78%", textAlign: "center" }}>
                Back to home / take a break
              </span>
            </div>
          </div>
        </section>

        <section className="fu-block" id="screens" style={{ paddingBottom: "24px" }}>
          <span className="fu-label">Key screens</span>
          <h2 style={{ marginTop: "12px", fontSize: "clamp(30px,4vw,44px)", fontWeight: 600 }}>Screen by screen</h2>

          {SCREEN_SECTIONS.map((screen) => (
            <article className="fu-screen" key={screen.src}>
              <div className="fu-shot">
                <img src={screen.src} alt={screen.alt} />
              </div>
              <div className="fu-screen-text">
                <span className="fu-label">{screen.label}</span>
                <h3>{screen.title}</h3>
                <p>{screen.body}</p>
                <ul className="fu-notes">
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

        <section className="fu-block" id="system">
          <span className="fu-label">Visual system</span>
          <h2 style={{ marginTop: "12px", fontSize: "clamp(30px,4vw,44px)", fontWeight: 600, maxWidth: "22ch" }}>
            Designed for late-night study
          </h2>
          <p style={{ color: "var(--muted)", maxWidth: "62ch", marginTop: "16px" }}>
            Students often study in the evening, so FocusUp uses a deep midnight palette that’s easy on the eyes in a dark room. A periwinkle-to-aqua gradient marks every primary action, giving the app a single, recognisable signal for “go.”
          </p>

          <div className="fu-swatches">
            {SWATCHES.map((swatch) => (
              <div className="fu-sw" key={swatch.hex}>
                <i style={{ background: swatch.hex }}></i>
                <div>
                  <b>{swatch.name}</b>
                  <code>{swatch.hex.toUpperCase()}</code>
                  <small>{swatch.label}</small>
                </div>
              </div>
            ))}
          </div>

          <div className="fu-sys-grid">
            <div className="fu-panel">
              <h3>Type</h3>
              <div className="fu-specimen">
                <span className="fu-big">42:18</span>
                <span style={{ fontWeight: 600, fontSize: "20px" }}>Great work, Feyza.</span>
                <span style={{ color: "var(--muted)", fontSize: "14px" }}>Rounded geometric sans throughout</span>
              </div>
              <p>A friendly, rounded sans keeps the tone encouraging rather than clinical. Bold weights carry timers and headlines; small regular text handles supporting detail.</p>
            </div>
            <div className="fu-panel">
              <h3>Components</h3>
              <div className="fu-demo">
                <div className="fu-chips">
                  <span className="fu-chip">25min</span>
                  <span className="fu-chip">50min</span>
                  <span className="fu-chip fu-chip-on">90min</span>
                </div>
                <div className="fu-btn-p">Start Session</div>
                <div className="fu-btn-s">Back to home</div>
              </div>
              <p>Gradient pill for the one primary action per screen, outlined pill for secondary, and translucent glass cards for grouped content.</p>
            </div>
          </div>
        </section>

        <section className="fu-block" id="reflection">
          <span className="fu-label">Reflection</span>
          <h2 style={{ marginTop: "12px", fontSize: "clamp(30px,4vw,44px)", fontWeight: 600, maxWidth: "22ch" }}>
            What I learned, and where it goes next
          </h2>
          <div className="fu-two">
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

        <ProjectNavigation current="/work/focusup" />
      </div>

      <FocusUpLightbox
        screens={STAGE_SCREENS}
        index={lightboxIndex}
        onClose={closeLightbox}
        onNext={showNext}
        onPrev={showPrev}
      />
    </div>
  )
}

function FocusUpLightbox({ screens, index, onClose, onNext, onPrev }) {
  const screen = index === null ? null : screens[index]

  const handleDragEnd = (_event, info) => {
    if (info.offset.x < -80) onNext()
    else if (info.offset.x > 80) onPrev()
  }

  return (
    <AnimatePresence>
      {screen && (
        <motion.div
          className="fu-lightbox-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <button
            type="button"
            className="fu-lightbox-close"
            onClick={(e) => {
              e.stopPropagation()
              onClose()
            }}
            aria-label="Close"
          >
            ✕
          </button>

          {screens.length > 1 && (
            <>
              <button
                type="button"
                className="fu-lightbox-arrow fu-lightbox-prev"
                onClick={(e) => {
                  e.stopPropagation()
                  onPrev()
                }}
                aria-label="Previous screen"
              >
                ‹
              </button>
              <button
                type="button"
                className="fu-lightbox-arrow fu-lightbox-next"
                onClick={(e) => {
                  e.stopPropagation()
                  onNext()
                }}
                aria-label="Next screen"
              >
                ›
              </button>
            </>
          )}

          <AnimatePresence mode="wait">
            <motion.div
              key={screen.src}
              className="fu-lightbox"
              role="dialog"
              aria-modal="true"
              aria-label={`${screen.caption} screen, ${index + 1} of ${screens.length}`}
              onClick={(e) => e.stopPropagation()}
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.92 }}
              transition={{ type: "spring", stiffness: 220, damping: 26 }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.2}
              onDragEnd={handleDragEnd}
            >
              <img src={screen.src} alt={screen.alt} draggable={false} />
              <p className="fu-lightbox-caption">
                {screen.caption} · {index + 1} / {screens.length}
              </p>
            </motion.div>
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
