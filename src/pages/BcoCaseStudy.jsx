import ProjectNavigation from "../components/ProjectNavigation"
import { useEffect, useRef } from "react"
import { Link } from "react-router-dom"
import "./BcoCaseStudy.css"

const FONTS_HREF =
  "https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=JetBrains+Mono:wght@400;500;700&family=Caveat:wght@500;700&family=Inter:wght@400;500;600&display=swap"

function useBcoFonts() {
  useEffect(() => {
    if (document.querySelector('link[data-bco-fonts="true"]')) return

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
    stylesheet.dataset.bcoFonts = "true"

    document.head.append(preconnectGoogle, preconnectGstatic, stylesheet)
  }, [])
}

const asset = (name) => `/hero/bco/assets/${name}`

const MARQUEE_WORDS = ["Coders", "Builders", "Designers", "Entrepreneurs", "Marketers", "Hackers"]

export default function BcoCaseStudy() {
  useBcoFonts()
  const rootRef = useRef(null)

  useEffect(() => {
    const root = rootRef.current
    if (!root) return

    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches
    const $ = (sel) => root.querySelector(sel)
    const $$ = (sel) => [...root.querySelectorAll(sel)]

    // scroll progress + hero parallax + timeline fill
    const prog = $("#bco-progress")
    const heroImg = $("#bco-heroImg")
    const tl = $("#bco-timeline")
    const fill = $("#bco-tlFill")
    const onScroll = () => {
      const y = scrollY
      const h = document.documentElement.scrollHeight - innerHeight
      if (prog) prog.style.width = (h > 0 ? y / h : 0) * 100 + "%"
      if (!reduce && heroImg && y < innerHeight * 1.2) {
        heroImg.style.transform = `scale(1.08) translateY(${y * 0.25}px)`
      }
      if (tl && fill) {
        const r = tl.getBoundingClientRect()
        const p = Math.min(Math.max((innerHeight * 0.6 - r.top) / r.height, 0), 1)
        fill.style.height = p * r.height + "px"
      }
    }
    addEventListener("scroll", onScroll, { passive: true })
    onScroll()

    // reveal on scroll
    const io = new IntersectionObserver(
      (es) =>
        es.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("bco-in")
            io.unobserve(e.target)
          }
        }),
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    )
    $$(".bco-reveal").forEach((el) => io.observe(el))

    // animated counters
    const co = new IntersectionObserver(
      (es) =>
        es.forEach((e) => {
          if (!e.isIntersecting) return
          const el = e.target
          const end = +el.dataset.count
          const suf = el.dataset.suffix || ""
          co.unobserve(el)
          if (reduce) {
            el.textContent = end + suf
            return
          }
          const t0 = performance.now()
          const dur = 1600
          const tick = (t) => {
            const k = Math.min((t - t0) / dur, 1)
            const v = Math.round(end * (1 - Math.pow(1 - k, 3)))
            el.textContent = v + suf
            if (k < 1) requestAnimationFrame(tick)
          }
          requestAnimationFrame(tick)
        }),
      { threshold: 0.5 }
    )
    $$("[data-count]").forEach((el) => co.observe(el))

    // timeline filter
    const filterButtons = $$(".bco-tl-filter button")
    const onFilterClick = (b) => () => {
      filterButtons.forEach((x) => x.classList.remove("bco-on"))
      b.classList.add("bco-on")
      const f = b.dataset.f
      $$(".bco-ev").forEach((ev) => ev.classList.toggle("bco-hide", f !== "all" && ev.dataset.s !== f))
    }
    const filterHandlers = filterButtons.map((b) => {
      const handler = onFilterClick(b)
      b.addEventListener("click", handler)
      return { b, handler }
    })

    // draggable polaroids
    let z = 6
    const polCleanups = []
    $$(".bco-pol").forEach((p) => {
      let sx, sy, ox = 0, oy = 0
      const onPointerDown = (e) => {
        e.preventDefault()
        p.setPointerCapture(e.pointerId)
        p.classList.add("bco-dragging")
        p.style.zIndex = ++z
        sx = e.clientX - ox
        sy = e.clientY - oy
        const mv = (ev) => {
          ox = ev.clientX - sx
          oy = ev.clientY - sy
          p.style.translate = `${ox}px ${oy}px`
        }
        const up = () => {
          p.classList.remove("bco-dragging")
          p.removeEventListener("pointermove", mv)
          p.removeEventListener("pointerup", up)
        }
        p.addEventListener("pointermove", mv)
        p.addEventListener("pointerup", up)
      }
      p.addEventListener("pointerdown", onPointerDown)
      polCleanups.push(() => p.removeEventListener("pointerdown", onPointerDown))
    })

    // film strip
    const film = $("#bco-film")
    const cnt = $("#bco-filmCount")
    let filmCleanup = () => {}
    if (film && cnt) {
      const frames = film.querySelectorAll("figure")
      const cur = () => Math.round(film.scrollLeft / (frames[0].offsetWidth + 10))
      const upd = () => (cnt.textContent = String(cur() + 1).padStart(2, "0") + " / " + String(frames.length).padStart(2, "0"))
      film.addEventListener("scroll", upd, { passive: true })
      const go = (d) => {
        const i = Math.max(0, Math.min(frames.length - 1, cur() + d))
        frames[i].scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" })
      }
      const prevBtn = $("#bco-filmPrev")
      const nextBtn = $("#bco-filmNext")
      const prevHandler = () => go(-1)
      const nextHandler = () => go(1)
      prevBtn?.addEventListener("click", prevHandler)
      nextBtn?.addEventListener("click", nextHandler)
      let down = false, fx, fl
      const onPointerDown = (e) => {
        if (e.pointerType !== "mouse") return
        down = true
        fx = e.clientX
        fl = film.scrollLeft
        film.style.scrollSnapType = "none"
      }
      const onPointerMove = (e) => {
        if (down) film.scrollLeft = fl - (e.clientX - fx)
      }
      const onPointerUp = () => {
        if (!down) return
        down = false
        film.style.scrollSnapType = ""
        go(0)
      }
      film.addEventListener("pointerdown", onPointerDown)
      addEventListener("pointermove", onPointerMove)
      addEventListener("pointerup", onPointerUp)
      filmCleanup = () => {
        film.removeEventListener("scroll", upd)
        prevBtn?.removeEventListener("click", prevHandler)
        nextBtn?.removeEventListener("click", nextHandler)
        film.removeEventListener("pointerdown", onPointerDown)
        removeEventListener("pointermove", onPointerMove)
        removeEventListener("pointerup", onPointerUp)
      }
    }

    // spotlight on win cards
    const winCleanups = []
    $$(".bco-win").forEach((w) => {
      const onMove = (e) => {
        const r = w.getBoundingClientRect()
        w.style.setProperty("--mx", e.clientX - r.left + "px")
        w.style.setProperty("--my", e.clientY - r.top + "px")
      }
      w.addEventListener("pointermove", onMove)
      winCleanups.push(() => w.removeEventListener("pointermove", onMove))
    })

    // role accordion
    const roleItems = $$("#bco-roleList li")
    const roleCleanups = []
    roleItems.forEach((li) => {
      const onClick = () => {
        const was = li.classList.contains("bco-open")
        roleItems.forEach((x) => x.classList.remove("bco-open"))
        if (!was) li.classList.add("bco-open")
      }
      li.addEventListener("click", onClick)
      roleCleanups.push(() => li.removeEventListener("click", onClick))
    })

    // lightbox
    const lb = $("#bco-lb")
    const lbImg = lb?.querySelector("img")
    const lbCap = lb?.querySelector(".bco-lb-cap")
    const galleryImgs = $$("#bco-gallery img[data-lb]")
    const allLbImgs = $$("img[data-lb]")
    let idx = 0
    const show = (src) => {
      idx = Math.max(0, galleryImgs.findIndex((i) => i.src === src))
      lbImg.src = src
      const a = allLbImgs.find((i) => i.src === src)
      lbCap.textContent = a ? a.alt : ""
      lb.classList.add("bco-open")
    }
    const lbImgHandlers = allLbImgs.map((i) => {
      const handler = () => show(i.src)
      i.addEventListener("click", handler)
      return { i, handler }
    })
    const step = (d) => {
      idx = (idx + d + galleryImgs.length) % galleryImgs.length
      lbImg.src = galleryImgs[idx].src
      lbCap.textContent = galleryImgs[idx].alt
    }
    const closeBtn = lb?.querySelector(".bco-x")
    const prevLbBtn = lb?.querySelector(".bco-pv")
    const nextLbBtn = lb?.querySelector(".bco-nx")
    const closeHandler = () => lb.classList.remove("bco-open")
    const prevLbHandler = (e) => {
      e.stopPropagation()
      step(-1)
    }
    const nextLbHandler = (e) => {
      e.stopPropagation()
      step(1)
    }
    const lbBackdropHandler = (e) => {
      if (e.target === lb) lb.classList.remove("bco-open")
    }
    const keyHandler = (e) => {
      if (!lb || !lb.classList.contains("bco-open")) return
      if (e.key === "Escape") lb.classList.remove("bco-open")
      if (e.key === "ArrowRight") step(1)
      if (e.key === "ArrowLeft") step(-1)
    }
    closeBtn?.addEventListener("click", closeHandler)
    prevLbBtn?.addEventListener("click", prevLbHandler)
    nextLbBtn?.addEventListener("click", nextLbHandler)
    lb?.addEventListener("click", lbBackdropHandler)
    addEventListener("keydown", keyHandler)

    return () => {
      removeEventListener("scroll", onScroll)
      removeEventListener("keydown", keyHandler)
      io.disconnect()
      co.disconnect()
      filterHandlers.forEach(({ b, handler }) => b.removeEventListener("click", handler))
      polCleanups.forEach((fn) => fn())
      filmCleanup()
      winCleanups.forEach((fn) => fn())
      roleCleanups.forEach((fn) => fn())
      lbImgHandlers.forEach(({ i, handler }) => i.removeEventListener("click", handler))
      closeBtn?.removeEventListener("click", closeHandler)
      prevLbBtn?.removeEventListener("click", prevLbHandler)
      nextLbBtn?.removeEventListener("click", nextLbHandler)
      lb?.removeEventListener("click", lbBackdropHandler)
    }
  }, [])

  return (
    <div className="bco-page" ref={rootRef}>
      <div className="bco-progress" id="bco-progress" />

      {/* reusable mark */}
      <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true">
        <symbol id="bco-mark" viewBox="-50 -50 100 100">
          <g fill="currentColor">
            <rect x="-5" y="-46" width="10" height="46" rx="5" />
            <rect x="-5" y="-40" width="10" height="40" rx="5" transform="rotate(52)" />
            <rect x="-5" y="-44" width="10" height="44" rx="5" transform="rotate(103)" />
            <rect x="-5" y="-38" width="10" height="38" rx="5" transform="rotate(154)" />
            <rect x="-5" y="-45" width="10" height="45" rx="5" transform="rotate(206)" />
            <rect x="-5" y="-39" width="10" height="39" rx="5" transform="rotate(257)" />
            <rect x="-5" y="-43" width="10" height="43" rx="5" transform="rotate(308)" />
          </g>
        </symbol>
      </svg>

      <div className="bco-wrap">
        <nav className="bco-crumbs" aria-label="Breadcrumb">
          <Link to="/work">← All work</Link>
          <span className="bco-mono">Case study · Community</span>
        </nav>
      </div>

      {/* HERO */}
      <header className="bco-hero" id="bco-top">
        <div className="bco-hero-bg">
          <img id="bco-heroImg" src={asset("cursor-x-bco.jpg")} alt="BCO members pointing up in front of a Cursor × BCO slide" />
        </div>
        <div className="bco-wrap">
          <div className="bco-tag-row">
            <span className="bco-tag">Builders Collective Ottawa</span>
            <span className="bco-tag">Co-founder</span>
            <span className="bco-tag bco-ice">Ottawa</span>
          </div>
          <h1>
            <span className="bco-line"><span>Build it</span></span>
            <span className="bco-line"><span><em className="bco-ice">in Ottawa.</em></span></span>
          </h1>
          <div className="bco-hero-foot">
            <p>Everyone tells ambitious students to pack a bag and leave. We called the bluff — and built a home for Ottawa's coders, designers, founders and marketers to ship real products together.</p>
            <div className="bco-hero-stats">
              <div><b data-count="500" data-suffix="+">0</b><span>Members</span></div>
              <div><b data-count="10" data-suffix="+">0</b><span>Events run</span></div>
              <div><b>2×</b><span>Co-Hacks / month</span></div>
            </div>
          </div>
          <div className="bco-scroll-cue bco-mono"><i></i>Scroll the story</div>
        </div>
      </header>

      {/* MARQUEE */}
      <div className="bco-marquee" aria-hidden="true">
        <div className="bco-marquee-track" id="bco-marq">
          {[0, 1].map((rep) =>
            MARQUEE_WORDS.map((word, i) => (
              <span key={`${rep}-${word}`} className={i % 2 === 1 ? "bco-ice" : ""}>
                {word} <svg className={i % 2 === 0 ? "bco-ice" : ""}><use href="#bco-mark" /></svg>
              </span>
            ))
          )}
        </div>
      </div>

      {/* ABOUT */}
      <section className="bco-pad" id="bco-about">
        <div className="bco-wrap bco-manifesto">
          <div>
            <div className="bco-eyebrow bco-mono bco-reveal">01 — What BCO is</div>
            <h2 className="bco-h2 bco-reveal bco-d1">A room where Ottawa's builders <em>ship together.</em></h2>
            <p className="bco-lede bco-reveal bco-d2" style={{ marginTop: "32px" }}>
              Builders Collective Ottawa is the city's cross-disciplinary tech community — 500+ people who'd rather build something this weekend than talk about it next quarter. We run biweekly Co-Hacks, bring global tech companies to Ottawa, and connect our members with local founders, investors and the press.
            </p>
            <div className="bco-who bco-reveal bco-d3">
              <span>Coders</span><span>Builders</span><span>Designers</span><span>Entrepreneurs</span><span>Marketers</span>
            </div>
          </div>
          <div className="bco-polaroids bco-reveal bco-d2">
            <figure className="bco-pol bco-a"><img src={asset("community-night.jpg")} alt="BCO community members posing together" /><figcaption>the regulars ✦</figcaption></figure>
            <figure className="bco-pol bco-b"><img src={asset("cohack-crew.jpg")} alt="Three members at a Co-Hack table with a laptop" /><figcaption>co-hack, 6pm saturday</figcaption></figure>
            <figure className="bco-pol bco-c"><img src={"/hero/bco-cohack-group.jpg"} alt="Seven BCO members giving a thumbs up in front of a wall reading 'Use the collective wisdom of those around you to help guide you on your journey'" /><figcaption>collective wisdom ✦</figcaption></figure>
            <span className="bco-drag-hint">(drag us around)</span>
          </div>
        </div>
      </section>

      {/* NUMBERS */}
      <section className="bco-pad bco-numbers">
        <div className="bco-wrap">
          <div className="bco-eyebrow bco-mono bco-reveal">02 — By the numbers</div>
          <h2 className="bco-h2 bco-reveal bco-d1">Small city. <em style={{ color: "var(--ice-deep)" }}>Loud signal.</em></h2>
          <div className="bco-num-grid">
            <div className="bco-num bco-reveal"><b><span data-count="500">0</span><sup>+</sup></b><p>builders across code, design, business and marketing.</p><span className="bco-mono">Community</span></div>
            <div className="bco-num bco-reveal bco-d1"><b><span data-count="10">0</span><sup>+</sup></b><p>successful events, from Co-Hacks to a Cursor collab.</p><span className="bco-mono">Events</span></div>
            <div className="bco-num bco-reveal bco-d2"><b><span data-count="7">0</span><sup>+</sup></b><p>partners — global names and Ottawa's own.</p><span className="bco-mono">Partners</span></div>
            <div className="bco-num bco-reveal bco-d3"><b><span data-count="26">0</span><sup>/yr</sup></b><p>Co-Hacks on the calendar, every other Saturday.</p><span className="bco-mono">Cadence</span></div>
          </div>
        </div>
      </section>

      {/* JOURNEY */}
      <section className="bco-pad" id="bco-journey">
        <div className="bco-wrap">
          <div className="bco-tl-head">
            <div>
              <div className="bco-eyebrow bco-mono bco-reveal">03 — The journey</div>
              <h2 className="bco-h2 bco-reveal bco-d1">What we've built,<br /><em className="bco-ice">and what's next.</em></h2>
            </div>
            <div className="bco-tl-filter bco-reveal bco-d2" role="tablist">
              <button className="bco-on" data-f="all">All</button>
              <button data-f="done">Done</button>
              <button data-f="next">Up next</button>
            </div>
          </div>

          <div className="bco-timeline" id="bco-timeline">
            <div className="bco-tl-fill" id="bco-tlFill" />

            <article className="bco-ev bco-done bco-reveal" data-s="done">
              <span className="bco-ev-dot" />
              <div className="bco-ev-date"><b>Toronto Tech Week</b>2026</div>
              <div className="bco-ev-body">
                <span className="bco-ev-status">✓ Done</span>
                <h3>Toronto Tech Week <em>2026</em></h3>
                <p>The BCO team took Ottawa to Toronto Tech Week 2026, representing the community at 15+ events, including Homecoming, the biggest event of the week.</p>
                <div className="bco-ev-card">
                  <div className="bco-imgbox">
                    <img
                      src={"/hero/bco-ttw-homecoming.jpg"}
                      alt="Feyza sitting on a red bench at the Homecoming event, in front of a large Toronto Tech Week wall graphic"
                      data-lb="true"
                      style={{ objectPosition: "center 55%" }}
                    />
                    <span className="bco-photo-note">front row seat ✦</span>
                  </div>
                  <div className="bco-imgbox">
                    <img
                      src={"/hero/bco-ttw-ground.jpg"}
                      alt="A sidewalk decal reading 'See you at Tech Week, Toronto, May 25-29, 2026' beside a wrist wearing a Toronto Tech Week wristband"
                      data-lb="true"
                    />
                  </div>
                </div>
              </div>
            </article>

            <article className="bco-ev bco-done bco-reveal" data-s="done">
              <span className="bco-ev-dot" />
              <div className="bco-ev-date"><b>Summer 2026</b>Flagship</div>
              <div className="bco-ev-body">
                <span className="bco-ev-status">✓ Done</span>
                <h3>Cursor <em>×</em> BCO</h3>
                <p>Our biggest night yet. We partnered with Cursor to bring Ottawa's builders into one room to hack with the tools shaping how software gets written — and proved the city shows up.</p>
                <div className="bco-ev-card bco-single">
                  <div className="bco-imgbox"><img src={asset("cursor-x-bco.jpg")} alt="Group photo at Cursor × BCO" data-lb="true" /></div>
                </div>
              </div>
            </article>

            <article className="bco-ev bco-done bco-reveal" data-s="done">
              <span className="bco-ev-dot" />
              <div className="bco-ev-date"><b>PitchTank</b>Ottawa</div>
              <div className="bco-ev-body">
                <span className="bco-ev-status">✓ Done</span>
                <h3>Showing up for <em>PitchTank</em></h3>
                <p>BCO came out to support our local entrepreneur and tech friends at PitchTank's biggest event, because a community is only as strong as the people who show up for each other.</p>
                <div className="bco-ev-card bco-single">
                  <div className="bco-imgbox"><img src={"/hero/bco-pitchtank.jpg"} alt="Feyza and four BCO members smiling for a group selfie under a neon PITCH TANK sign" data-lb="true" /></div>
                </div>
              </div>
            </article>

            <article className="bco-ev bco-done bco-reveal" data-s="done">
              <span className="bco-ev-dot" />
              <div className="bco-ev-date"><b>Ongoing</b>Every 2 weeks</div>
              <div className="bco-ev-body">
                <span className="bco-ev-status">✓ Running</span>
                <h3>Biweekly <em>Co-Hacks</em></h3>
                <p>The heartbeat of the community. Every other Saturday, members bring what they're building, pair up across disciplines and leave with progress — not just business cards.</p>
              </div>
            </article>

            <article className="bco-ev bco-done bco-reveal" data-s="done">
              <span className="bco-ev-dot" />
              <div className="bco-ev-date"><b>cuHacking</b>Carleton U</div>
              <div className="bco-ev-body">
                <span className="bco-ev-status">✓ Done</span>
                <h3>Collab with <em>cuHacking</em></h3>
                <p>We teamed up with Carleton University's biggest hackathon, and one of our team members led a workshop for its hackers.</p>
                <div className="bco-ev-card bco-single">
                  <div className="bco-imgbox"><img src={asset("big-event.jpg")} alt="Crowd arriving at the cuHacking hackathon collab" data-lb="true" /></div>
                </div>
              </div>
            </article>

            <article className="bco-ev bco-done bco-reveal" data-s="done">
              <span className="bco-ev-dot" />
              <div className="bco-ev-date"><b>Partnership</b>Ottawa</div>
              <div className="bco-ev-body">
                <span className="bco-ev-status">✓ Active</span>
                <h3>AGI Ventures <em>network</em></h3>
                <p>An ongoing collaboration with AGI Ventures in Ottawa to widen the circle for us and our members — more founders, more operators, more doors opened.</p>
              </div>
            </article>

            <article className="bco-ev bco-next bco-reveal" data-s="next">
              <span className="bco-ev-dot" />
              <div className="bco-ev-date"><b>October 2026</b>Headliner</div>
              <div className="bco-ev-body">
                <span className="bco-ev-status">● Up next</span>
                <h3>Our biggest lineup <em>yet.</em></h3>
                <p>A three-partner night bringing some of the most talked-about names in AI to Ottawa, for Ottawa's builders.</p>
                <div className="bco-ev-card">
                  <div className="bco-lineup">
                    <span className="bco-mono">Featuring</span>
                    <div>SpaceX AI <small>01</small></div>
                    <div>GrokBot <small>02</small></div>
                    <div>Cursor <small>03 · Returning</small></div>
                  </div>
                  <div className="bco-imgbox"><img src={asset("grokbot.jpg")} alt="Feyza on the Brooklyn Bridge with GrokBot characters" data-lb="true" style={{ objectPosition: "center 40%" }} /></div>
                </div>
              </div>
            </article>

            <article className="bco-ev bco-next bco-reveal" data-s="next">
              <span className="bco-ev-dot" />
              <div className="bco-ev-date"><b>Fall 2026</b>Local</div>
              <div className="bco-ev-body">
                <span className="bco-ev-status">● Up next</span>
                <h3>Panel night with <em>Caffriend</em></h3>
                <p>A panel and networking night with Caffriend, an Ottawa company founded by young entrepreneurs — proof that you can start here and grow here.</p>
              </div>
            </article>

            <article className="bco-ev bco-next bco-reveal" data-s="next">
              <span className="bco-ev-dot" />
              <div className="bco-ev-date"><b>November 2026</b>Ottawa → Toronto</div>
              <div className="bco-ev-body">
                <span className="bco-ev-status">● Up next</span>
                <h3>Representing <em>Snap</em> in Ottawa</h3>
                <p>We're hosting a Snapchat workshop as Snap's presence in Ottawa, then heading to their Toronto office to judge at Snap's global hackathon.</p>
                <div className="bco-route">
                  <div className="bco-stop"><small>Stop 01</small><div>Ottawa workshop</div></div>
                  <svg viewBox="0 0 72 24" fill="none"><path d="M2 12h60" stroke="#8ccdf2" strokeWidth="2" /><path d="M60 5l8 7-8 7" stroke="#8ccdf2" strokeWidth="2" fill="none" /></svg>
                  <div className="bco-stop"><small>Stop 02</small><div>Judging in Toronto</div></div>
                </div>
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* CO-HACK */}
      <section className="bco-pad bco-cohack" id="bco-cohack">
        <div className="bco-wrap bco-ch-grid">
          <div>
            <div className="bco-eyebrow bco-mono bco-reveal">04 — The Co-Hack format</div>
            <h2 className="bco-h2 bco-reveal bco-d1">Show up. <em className="bco-ice">Ship something.</em></h2>
            <p className="bco-lede bco-reveal bco-d2" style={{ marginTop: "28px" }}>Not a lecture, not a mixer. A Co-Hack is a working session built for momentum — the format at the core of a 500-person community.</p>
            <ul className="bco-ch-steps">
              <li className="bco-reveal"><div><b>Pitch what you're building</b><span>Everyone shares a project, a problem or an idea in under a minute.</span></div></li>
              <li className="bco-reveal bco-d1"><div><b>Find your people</b><span>Engineers meet designers, founders meet marketers. Teams form on the spot.</span></div></li>
              <li className="bco-reveal bco-d2"><div><b>Heads-down hacking</b><span>Real building time, with the room around you to unblock you.</span></div></li>
              <li className="bco-reveal bco-d3"><div><b>Demo &amp; feedback</b><span>Show progress, get honest feedback, come back in two weeks with more.</span></div></li>
            </ul>
            <div className="bco-meta-strip bco-reveal">
              <span><b>When</b> · Biweekly Saturdays</span>
              <span><b>Time</b> · 6 PM</span>
              <span><b>Where</b> · CRX, uOttawa</span>
            </div>
          </div>
          <div className="bco-film bco-reveal bco-d2">
            <span className="bco-film-note">swipe →</span>
            <div className="bco-film-frame">
              <div className="bco-film-track" id="bco-film">
                <figure><img src={"/hero/bco-cohack-logo.jpg"} alt="A member in a cap coding, with the BCO asterisk mark glowing on a monitor in front of him" /><figcaption>Co-Hack · Built here</figcaption></figure>
                <figure><img src={asset("cohack-feyza.jpg")} alt="Feyza at a Co-Hack table" /><figcaption>Co-Hack · Heads-down</figcaption></figure>
                <figure><img src={asset("cohack-talk.jpg")} alt="Members talking through an idea" /><figcaption>Co-Hack · Feedback loop</figcaption></figure>
                <figure><img src={asset("cohack-crew.jpg")} alt="Members at a table with a laptop" /><figcaption>Co-Hack · The crew</figcaption></figure>
                <figure><img src={asset("big-event.jpg")} alt="Crowd at a BCO event" /><figcaption>BCO · Doors open</figcaption></figure>
                <figure><img src={"/hero/bco-cohack-laptop.jpg"} alt="A member in a navy and red polo smiling while working on his laptop" /><figcaption>Co-Hack · Good vibes</figcaption></figure>
              </div>
            </div>
            <div className="bco-film-nav">
              <button id="bco-filmPrev" aria-label="Previous">←</button>
              <span className="bco-count" id="bco-filmCount">01 / 06</span>
              <button id="bco-filmNext" aria-label="Next">→</button>
            </div>
          </div>
        </div>
      </section>

      {/* PRESS */}
      <section className="bco-pad bco-press" id="bco-press">
        <div className="bco-wrap bco-press-grid">
          <div className="bco-press-img bco-reveal">
            <span className="bco-sticker">Featured</span>
            <img src={asset("press-article.jpg")} alt="BYVI feature: They told us to leave for San Francisco. We built it in Ottawa instead." data-lb="true" />
          </div>
          <div>
            <div className="bco-eyebrow bco-mono bco-reveal">05 — In the press</div>
            <blockquote className="bco-reveal bco-d1">"They told us to leave for San Francisco. We built it <em>in Ottawa instead.</em>"</blockquote>
            <p className="bco-src bco-reveal bco-d2">BYVI · Startup Ecosystem feature</p>
            <p className="bco-lede bco-reveal bco-d2" style={{ marginTop: "24px", color: "var(--muted-ink)" }}>BYVI profiled BCO's co-founders, Feyza Gulbent and Qurb E Muhammad Syed, on building a real startup community from a city nobody put on the startup map.</p>
            <a className="bco-btn bco-reveal bco-d3" href="https://lnkd.in/gUcZcd2J" target="_blank" rel="noopener noreferrer">Read the article <span>→</span></a>
          </div>
        </div>
      </section>

      {/* WINS */}
      <section className="bco-pad">
        <div className="bco-wrap">
          <div className="bco-eyebrow bco-mono bco-reveal">06 — Community wins</div>
          <h2 className="bco-h2 bco-reveal bco-d1">The best metric is<br /><em className="bco-ice">what members build.</em></h2>
          <div className="bco-wins-grid">
            <div className="bco-win bco-reveal">
              <div className="bco-ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M4 4h12l4 4v12H4z" /><path d="M8 10h8M8 14h8M8 18h5" /></svg></div>
              <div><h4>Members, published.</h4><p>BCO's exposure has helped members of our community get their own stories and work published.</p></div>
            </div>
            <div className="bco-win bco-reveal bco-d1">
              <div className="bco-ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><rect x="2" y="7" width="20" height="11" rx="5" /><path d="M7 11v3M5.5 12.5h3" /><circle cx="16" cy="11.5" r=".8" fill="currentColor" /><circle cx="18" cy="13.5" r=".8" fill="currentColor" /></svg></div>
              <div><h4>A game production studio.</h4><p>One of the companies growing inside the community — creative and technical talent building games out of Ottawa.</p></div>
            </div>
            <div className="bco-win bco-reveal bco-d2">
              <div className="bco-ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M12 21v-8" /><path d="M12 13c0-4 3-6 7-6 0 4-3 6-7 6zM12 15c0-3-2.5-5-6-5 0 3 2.5 5 6 5z" /><path d="M4 21h16" /></svg></div>
              <div><h4>Agriculture robotics.</h4><p>Another member company, bringing robotics to farming — the kind of hard-tech ambition we want Ottawa known for.</p></div>
            </div>
          </div>
        </div>
      </section>

      {/* PARTNERS */}
      <section className="bco-pad bco-partners">
        <div className="bco-wrap">
          <div className="bco-eyebrow bco-mono bco-reveal">07 — Who we build with</div>
          <h2 className="bco-h2 bco-reveal bco-d1">Global names. <em className="bco-ice">Local roots.</em></h2>
          <div className="bco-p-grid bco-reveal bco-d2">
            <div className="bco-p"><small>Summer '26 · Oct '26</small><b>Cursor</b></div>
            <div className="bco-p"><small>October '26</small><b>SpaceX AI</b></div>
            <div className="bco-p"><small>October '26</small><b>GrokBot</b></div>
            <div className="bco-p"><small>November '26</small><b>Snapchat</b></div>
            <div className="bco-p"><small>Ottawa · Network</small><b>AGI Ventures</b></div>
            <div className="bco-p"><small>Ottawa · Panel</small><b>Caffriend</b></div>
            <div className="bco-p"><small>Carleton U</small><b>cuHacking</b></div>
            <div className="bco-p"><small>Toronto · 2026</small><b>Toronto Tech Week</b></div>
            <div className="bco-p"><small>Ottawa · Community</small><b>PitchTank</b></div>
            <div className="bco-p bco-cta"><small>Your company?</small><b>Let's build.</b></div>
          </div>
        </div>
      </section>

      {/* ROLE */}
      <section className="bco-pad bco-role" id="bco-role">
        <div className="bco-wrap bco-role-grid">
          <div>
            <div className="bco-eyebrow bco-mono bco-reveal">08 — My role</div>
            <h2 className="bco-h2 bco-reveal bco-d1">Co-founder.<br /><em>Builder of the room.</em></h2>
            <p className="bco-lede bco-reveal bco-d2" style={{ marginTop: "28px", color: "var(--muted-ink)" }}>I co-founded BCO to prove Ottawa's talent doesn't need to leave to build something that matters. I lead how the community looks, sounds and grows — and who we bring into the room.</p>
            <div className="bco-sig bco-reveal bco-d3">
              <img src={asset("feyza-avatar.jpg")} alt="Feyza Gulbent" />
              <div><div className="bco-hand">Feyza Gulbent</div><div className="bco-mono">Co-founder, BCO</div></div>
            </div>
          </div>
          <ul className="bco-role-list bco-reveal bco-d2" id="bco-roleList">
            <li className="bco-open"><h5>Community &amp; growth</h5><span className="bco-plus">+</span><div className="bco-ans"><p>Grew BCO into a 500+ member community of coders, designers, founders and marketers across Ottawa.</p></div></li>
            <li><h5>Partnerships</h5><span className="bco-plus">+</span><div className="bco-ans"><p>Brought Cursor, SpaceX AI, GrokBot and Snapchat to Ottawa, and built local ties with AGI Ventures, Caffriend and cuHacking.</p></div></li>
            <li><h5>Brand &amp; content</h5><span className="bco-plus">+</span><div className="bco-ans"><p>Own BCO's visual identity and social content, including the Co-Hack Instagram carousel system.</p></div></li>
            <li><h5>Events</h5><span className="bco-plus">+</span><div className="bco-ans"><p>10+ events delivered, from biweekly Co-Hacks to our flagship Cursor × BCO night.</p><p>Represented BCO at 15+ events during Toronto Tech Week 2026.</p></div></li>
          </ul>
        </div>
      </section>

      {/* GALLERY */}
      <section className="bco-pad">
        <div className="bco-wrap">
          <div className="bco-eyebrow bco-mono bco-reveal">09 — Camera roll</div>
          <h2 className="bco-h2 bco-reveal bco-d1">Proof it <em className="bco-ice">happened.</em></h2>
          <div className="bco-gallery" id="bco-gallery">
            <figure className="bco-reveal"><img src={asset("cursor-x-bco.jpg")} alt="Cursor × BCO group photo" data-lb="true" /><figcaption>Cursor × BCO</figcaption></figure>
            <figure className="bco-reveal bco-d1"><img src={"/hero/bco-ttw-ground.jpg"} alt="Sidewalk decal for Toronto Tech Week 2026" data-lb="true" /><figcaption>Toronto Tech Week</figcaption></figure>
            <figure className="bco-reveal bco-d2"><img src={asset("grokbot.jpg")} alt="Feyza with GrokBot characters" data-lb="true" /><figcaption>GrokBot</figcaption></figure>
            <figure className="bco-reveal"><img src={"/hero/bco-ttw-homecoming.jpg"} alt="Feyza at the Homecoming event during Toronto Tech Week" data-lb="true" /><figcaption>Homecoming</figcaption></figure>
            <figure className="bco-reveal bco-d1"><img src={asset("cohack-feyza.jpg")} alt="Feyza at a Co-Hack" data-lb="true" /><figcaption>Co-Hack</figcaption></figure>
            <figure className="bco-reveal bco-d2"><img src={"/hero/bco-pitchtank.jpg"} alt="Group selfie under a neon PITCH TANK sign" data-lb="true" /><figcaption>PitchTank</figcaption></figure>
            <figure className="bco-reveal"><img src={asset("big-event.jpg")} alt="Crowd arriving at a BCO event" data-lb="true" /><figcaption>Doors open</figcaption></figure>
            <figure className="bco-reveal bco-d1"><img src={"/hero/bco-cohack-laptop.jpg"} alt="A member smiling while working on his laptop at a Co-Hack" data-lb="true" /><figcaption>Co-Hack</figcaption></figure>
            <figure className="bco-reveal bco-d2"><img src={asset("community-night.jpg")} alt="Community group photo" data-lb="true" /><figcaption>Community night</figcaption></figure>
            <figure className="bco-reveal"><img src={"/hero/bco-cohack-logo.jpg"} alt="A member coding with the BCO asterisk mark glowing on a monitor" data-lb="true" /><figcaption>Co-Hack</figcaption></figure>
            <figure className="bco-reveal bco-d1"><img src={asset("cohack-talk.jpg")} alt="Members in discussion" data-lb="true" /><figcaption>Co-Hack</figcaption></figure>
            <figure className="bco-reveal bco-d2"><img src={"/hero/bco-cohack-group.jpg"} alt="Members giving a thumbs up in front of the collective wisdom wall" data-lb="true" /><figcaption>Co-Hack crew</figcaption></figure>
            <figure className="bco-reveal"><img src={asset("cohack-crew.jpg")} alt="Members at a laptop" data-lb="true" /><figcaption>Co-Hack</figcaption></figure>
            <figure className="bco-reveal bco-d1"><img src={asset("press-article.jpg")} alt="BYVI article cover" data-lb="true" /><figcaption>BYVI feature</figcaption></figure>
          </div>
        </div>
      </section>

      {/* CLOSING */}
      <section className="bco-closing">
        <div className="bco-closing-bg"><img src={asset("community-night.jpg")} alt="" /></div>
        <div className="bco-wrap">
          <div className="bco-reveal"><svg className="bco-big-mark bco-spin"><use href="#bco-mark" /></svg></div>
          <h2 className="bco-reveal bco-d1">Ottawa's on<br /><em>the map now.</em></h2>
          <p className="bco-reveal bco-d2">500+ builders, 10+ events, and a lineup that keeps getting bigger. This is what happens when you stop waiting for permission to build where you are.</p>
          <a className="bco-btn bco-light bco-reveal bco-d3" href="https://ca.linkedin.com/company/builders-collective-ottawa" target="_blank" rel="noopener noreferrer">Follow BCO <span>→</span></a>
        </div>
      </section>

      <ProjectNavigation current="/work/bco" />
      <footer>
        <div className="bco-wrap bco-mono" style={{ fontSize: "10px" }}>
          <span>Builders Collective Ottawa</span>
          <span>Case study · Feyza Gulbent</span>
        </div>
      </footer>

      {/* LIGHTBOX */}
      <div className="bco-lb" id="bco-lb" role="dialog" aria-modal="true">
        <button className="bco-x" aria-label="Close">✕</button>
        <button className="bco-pv" aria-label="Previous">←</button>
        <img alt="" />
        <button className="bco-nx" aria-label="Next">→</button>
        <div className="bco-lb-cap"></div>
      </div>
    </div>
  )
}
