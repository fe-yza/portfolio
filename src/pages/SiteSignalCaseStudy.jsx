import { useEffect, useRef } from "react"
import { Link } from "react-router-dom"
import "./SiteSignalCaseStudy.css"

const FONTS_HREF =
  "https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=JetBrains+Mono:wght@400;500;700&family=Caveat:wght@500;700&family=Inter:wght@400;500;600&display=swap"

function useSiteSignalFonts() {
  useEffect(() => {
    if (document.querySelector('link[data-sitesignal-fonts="true"]')) return

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
    stylesheet.dataset.sitesignalFonts = "true"

    document.head.append(preconnectGoogle, preconnectGstatic, stylesheet)
  }, [])
}

const LIVE_URL = "https://site-signal-phi.vercel.app/"

const CHECKS = [
  { t: "Broken internal links", sev: "high", w: 10, why: "Links that return 4xx errors waste crawl budget and send visitors to dead ends. Search engines treat them as a sign of a poorly maintained site." },
  { t: "Pages missing a title tag", sev: "high", w: 9, why: "The title is the headline shown in search results. Without one, search engines guess — usually badly — and click-through suffers." },
  { t: "Pages blocked by noindex", sev: "high", w: 8, why: "These pages tell search engines not to index them. If that wasn't intentional, they can't rank at all." },
  { t: "Duplicate title tags", sev: "med", w: 7, why: "When several pages share a title, search engines struggle to tell them apart and may rank the wrong one." },
  { t: "Missing meta descriptions", sev: "med", w: 6, why: "The meta description is your pitch in the search results. Without it, a random snippet of page text is shown instead." },
  { t: "Missing H1 heading", sev: "med", w: 5, why: "The H1 signals what the page is about to both readers and crawlers. Pages without one lose a clear topical signal." },
  { t: "Redirect chains", sev: "med", w: 5, why: "Each extra hop slows the page down and dilutes link signals. Point links straight at the final URL." },
  { t: "Images without alt text", sev: "low", w: 3, why: "Alt text makes images accessible to screen readers and helps images appear in image search." },
  { t: "Title tags too long", sev: "low", w: 2, why: "Titles past roughly 60 characters get cut off in results, hiding the part that might earn the click." },
  { t: "Thin content", sev: "low", w: 2, why: "Pages with very little text give search engines little to understand and rarely rank for anything useful." },
]
const PATHS = ["/", "/about", "/contact", "/shop", "/services", "/blog", "/pricing", "/faq", "/team", "/careers", "/blog/getting-started", "/blog/spring-update", "/products/gift-card", "/products/new", "/events", "/gallery", "/menu", "/locations", "/privacy", "/terms", "/book", "/press"]
const LABEL = { high: "High impact", med: "Medium", low: "Low" }

const CHART_DATA = [
  { a: "Audit 1", d: "Jan 12", issues: 48, pages: 31 },
  { a: "Audit 2", d: "Feb 02", issues: 41, pages: 27 },
  { a: "Audit 3", d: "Feb 23", issues: 33, pages: 22 },
  { a: "Audit 4", d: "Mar 16", issues: 29, pages: 19 },
  { a: "Audit 5", d: "Apr 06", issues: 19, pages: 13 },
  { a: "Audit 6", d: "Apr 27", issues: 14, pages: 9 },
]

export default function SiteSignalCaseStudy() {
  useSiteSignalFonts()
  const rootRef = useRef(null)

  useEffect(() => {
    const root = rootRef.current
    if (!root) return

    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches
    const $ = (sel) => root.querySelector(sel)
    const $$ = (sel) => [...root.querySelectorAll(sel)]

    // reveal
    const io = new IntersectionObserver(
      (es) =>
        es.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("ss-in")
            io.unobserve(e.target)
          }
        }),
      { threshold: 0.12 }
    )
    $$(".ss-reveal, #ss-steps").forEach((el) => io.observe(el))

    // spotlight
    const prCleanups = []
    $$(".ss-pr").forEach((c) => {
      const onMove = (e) => {
        const r = c.getBoundingClientRect()
        c.style.setProperty("--mx", e.clientX - r.left + "px")
        c.style.setProperty("--my", e.clientY - r.top + "px")
      }
      c.addEventListener("pointermove", onMove)
      prCleanups.push(() => c.removeEventListener("pointermove", onMove))
    })

    /* ============ DEMO AUDIT ============ */
    const hash = (s) => {
      let h = 2166136261
      for (const c of s) {
        h ^= c.charCodeAt(0)
        h = Math.imul(h, 16777619)
      }
      return h >>> 0
    }
    const rng = (seed) => () => {
      seed |= 0
      seed = (seed + 0x6d2b79f5) | 0
      let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296
    }

    const state = $("#ss-state")
    const btn = $("#ss-runBtn")
    const input = $("#ss-urlIn")
    const appUrl = $("#ss-appUrl")
    const clean = (u) => u.trim().replace(/^https?:\/\//, "").replace(/\/.*$/, "").toLowerCase() || "example.com"
    let timer

    function audit(domain) {
      const r = rng(hash(domain))
      const pages = 38 + Math.floor(r() * 63)
      const found = CHECKS.map((c) => {
        if (r() < 0.25) return null
        const n = 1 + Math.floor(r() * Math.max(2, pages * (c.sev === "low" ? 0.35 : 0.18)))
        const on = [...PATHS].sort(() => r() - 0.5).slice(0, Math.min(3, n))
        return { ...c, n, on, score: c.w * Math.log2(n + 1) }
      }).filter(Boolean).sort((a, b) => b.score - a.score)
      return { pages, found, total: found.reduce((s, f) => s + f.n, 0) }
    }

    function run(e) {
      if (e) e.preventDefault()
      clearInterval(timer)
      const domain = clean(input.value)
      input.value = domain
      appUrl.textContent = "sitesignal · auditing " + domain
      const res = audit(domain)
      btn.disabled = true
      state.innerHTML = `<div class="ss-crawl-head"><b><span id="ss-pc">0</span> <span style="color:var(--muted);font-size:.6em">/ ${res.pages} pages</span></b><span class="ss-mono" style="color:var(--signal)">Crawling</span></div>
        <div class="ss-bar"><span id="ss-pb"></span></div><div class="ss-log" id="ss-log"></div>`
      const log = $("#ss-log")
      const pc = $("#ss-pc")
      const pb = $("#ss-pb")
      const r = rng(hash(domain) ^ 99)
      let i = 0
      const step = reduce ? res.pages : Math.max(1, Math.round(res.pages / 45))
      const line = (h) => {
        const d = document.createElement("div")
        d.innerHTML = h
        log.appendChild(d)
        while (log.children.length > 14) log.firstChild.remove()
      }
      line(`<span class="ss-dim">→ resolving https://${domain}</span>`)
      timer = setInterval(() => {
        for (let k = 0; k < step && i < res.pages; k++, i++) {
          const p = PATHS[Math.floor(r() * PATHS.length)] + (r() < 0.4 ? "" : "/" + (100 + Math.floor(r() * 900)))
          const ms = 80 + Math.floor(r() * 520)
          const roll = r()
          const code = roll < 0.05 ? `<span class="ss-err">404</span>` : roll < 0.12 ? `<span class="ss-warn">301</span>` : `<span class="ss-ok">200</span>`
          if (k === 0) line(`${code} GET ${p} <span class="ss-dim">${ms}ms</span>`)
        }
        pc.textContent = i
        pb.style.width = (i / res.pages) * 100 + "%"
        if (i >= res.pages) {
          clearInterval(timer)
          line(`<span class="ss-dim">→ running checks on ${res.pages} pages…</span>`)
          line(`<span class="ss-ok">✓ ${res.found.length} issue types · ranked by impact</span>`)
          setTimeout(() => show(domain, res), reduce ? 0 : 700)
        }
      }, 55)
    }

    function show(domain, res) {
      btn.disabled = false
      appUrl.textContent = "sitesignal · " + domain + " · audit #1"
      const high = res.found.filter((f) => f.sev === "high").length
      state.innerHTML = `
        <div class="ss-sum">
          <div><b>${res.pages}</b><span>Pages crawled</span></div>
          <div><b>${res.total}</b><span>Issues found</span></div>
          <div><b style="color:var(--high)">${high}</b><span>High impact</span></div>
        </div>
        <div class="ss-opp-head"><span class="ss-mono">Fix these first</span><span class="ss-mono">Pages</span></div>
        <div class="ss-opps">${res.found.map((f, idx) => `
          <div class="ss-opp${idx === 0 ? " ss-open" : ""}" style="animation-delay:${idx * 70}ms">
            <button aria-expanded="${idx === 0}"><span class="ss-rank">${String(idx + 1).padStart(2, "0")}</span>
              <span class="ss-t">${f.t}<small>${f.n} page${f.n > 1 ? "s" : ""} affected</small></span>
              <span class="ss-sev ss-${f.sev}">${LABEL[f.sev]}</span></button>
            <div class="ss-why"><div class="ss-why-in"><span class="ss-mono">Why it matters</span>${f.why}<span class="ss-mono">Found on</span>${f.on.map((p) => `<code>${p}</code>`).join("")}${f.n > f.on.length ? `<code>+${f.n - f.on.length} more</code>` : ""}</div></div>
          </div>`).join("")}
        </div>
        <div class="ss-again">same URL, same result — <button id="ss-againBtn">run it again</button></div>`
      state.querySelectorAll(".ss-opp button").forEach((b) =>
        b.addEventListener("click", () => {
          const o = b.parentElement
          const open = o.classList.toggle("ss-open")
          b.setAttribute("aria-expanded", open)
        })
      )
      $("#ss-againBtn").onclick = () => run()
    }

    const runForm = $("#ss-runForm")
    runForm.addEventListener("submit", run)

    let auto = false
    const autoIo = new IntersectionObserver(
      (es) => {
        if (es[0].isIntersecting && !auto) {
          auto = true
          setTimeout(run, 700)
        }
      },
      { threshold: 0.5 }
    )
    autoIo.observe($("#ss-app"))

    /* ============ HISTORY CHART ============ */
    const svg = $("#ss-chart")
    const tip = $("#ss-tip")
    const card = $("#ss-chartCard")
    const W = 560, H = 280, L = 40, R = 84, T = 16, B = 36
    let metric = "issues"
    const x = (i) => L + (i * (W - L - R)) / (CHART_DATA.length - 1)
    const draw = () => {
      const max = Math.ceil(Math.max(...CHART_DATA.map((d) => d[metric])) / 10) * 10 + 10
      const y = (v) => T + (1 - v / max) * (H - T - B)
      const ticks = [0, max / 4, max / 2, (max * 3) / 4, max]
      svg.querySelector(".ss-grid").innerHTML = ticks.map((t) => `<line x1="${L}" x2="${W - R}" y1="${y(t)}" y2="${y(t)}"/>`).join("")
      svg.querySelector(".ss-axis").innerHTML =
        ticks.map((t) => `<text x="${L - 8}" y="${y(t) + 3}" text-anchor="end">${t}</text>`).join("") +
        CHART_DATA.map((d, i) => `<text x="${x(i)}" y="${H - 12}" text-anchor="middle">${d.d}</text>`).join("")
      const pts = CHART_DATA.map((d, i) => [x(i), y(d[metric])])
      const line = pts.map((p, i) => (i ? "L" : "M") + p[0] + " " + p[1]).join(" ")
      svg.querySelector(".ss-ln").setAttribute("d", line)
      svg.querySelector(".ss-area").setAttribute("d", line + ` L ${x(CHART_DATA.length - 1)} ${y(0)} L ${x(0)} ${y(0)} Z`)
      svg.querySelector(".ss-pts").innerHTML = pts.map((p) => `<circle class="ss-pt" cx="${p[0]}" cy="${p[1]}" r="4.5"/>`).join("")
      const last = pts[pts.length - 1]
      const first = CHART_DATA[0][metric]
      const lastV = CHART_DATA[CHART_DATA.length - 1][metric]
      const lbl = svg.querySelector(".ss-lbl")
      lbl.setAttribute("x", last[0] + 12)
      lbl.setAttribute("y", last[1] + 4)
      lbl.textContent = `${lastV} · −${Math.round((1 - lastV / first) * 100)}%`
      svg.dataset.max = max
    }
    draw()
    const ln = svg.querySelector(".ss-ln")
    const len = ln.getTotalLength()
    let chartLineTimeout
    let chartLineIo
    if (!reduce) {
      ln.style.strokeDasharray = len
      ln.style.strokeDashoffset = len
      ln.style.transition = "stroke-dashoffset 1.6s cubic-bezier(.7,0,.3,1)"
      chartLineIo = new IntersectionObserver(
        (es, o) => {
          if (es[0].isIntersecting) {
            ln.style.strokeDashoffset = 0
            o.disconnect()
            chartLineTimeout = setTimeout(() => {
              ln.style.strokeDasharray = ""
              ln.style.transition = ""
            }, 1700)
          }
        },
        { threshold: 0.4 }
      )
      chartLineIo.observe(svg)
    }

    const metricButtons = $$("#ss-metricToggle button")
    const metricHandlers = metricButtons.map((b) => {
      const handler = () => {
        metricButtons.forEach((x) => x.classList.remove("ss-on"))
        b.classList.add("ss-on")
        metric = b.dataset.m
        draw()
        svg.setAttribute("aria-label", `Line chart of ${metric === "issues" ? "open issues" : "pages affected"} across six audits`)
        card.querySelector("h4").textContent = metric === "issues" ? "Open issues per audit" : "Pages affected per audit"
      }
      b.addEventListener("click", handler)
      return { b, handler }
    })

    const xh = svg.querySelector(".ss-xh")
    const hit = svg.querySelector(".ss-hit")
    const hover = (e) => {
      const r = svg.getBoundingClientRect()
      const sx = ((e.clientX - r.left) * W) / r.width
      const i = Math.max(0, Math.min(CHART_DATA.length - 1, Math.round((sx - L) / ((W - L - R) / (CHART_DATA.length - 1)))))
      const d = CHART_DATA[i]
      const prev = CHART_DATA[i - 1]
      xh.style.display = ""
      xh.setAttribute("x1", x(i))
      xh.setAttribute("x2", x(i))
      svg.querySelectorAll(".ss-pt").forEach((p, k) => p.setAttribute("r", k === i ? 6.5 : 4.5))
      const diff = prev ? d[metric] - prev[metric] : null
      tip.innerHTML = `<b>${d.a} · ${d.d}</b><span><strong>${d.issues}</strong> open issues</span><span><strong>${d.pages}</strong> pages affected</span>${diff !== null ? `<span>${diff <= 0 ? "▼" : "▲"} ${Math.abs(diff)} vs previous</span>` : ""}`
      const cr = card.getBoundingClientRect()
      const px = (x(i) * r.width) / W + r.left - cr.left
      tip.style.left = Math.min(cr.width - 190, Math.max(10, px + 14)) + "px"
      tip.style.top = r.top - cr.top + 30 + "px"
      tip.classList.add("ss-on")
    }
    const hoverLeave = () => {
      tip.classList.remove("ss-on")
      xh.style.display = "none"
      svg.querySelectorAll(".ss-pt").forEach((p) => p.setAttribute("r", 4.5))
    }
    hit.addEventListener("pointermove", hover)
    hit.addEventListener("pointerleave", hoverLeave)

    const tbl = $("#ss-tbl")
    tbl.querySelector("tbody").innerHTML = CHART_DATA.map((d) => `<tr><td>${d.a}</td><td>${d.d}</td><td>${d.issues}</td><td>${d.pages}</td></tr>`).join("")
    const tblBtn = $("#ss-tblBtn")
    const tblHandler = (e) => {
      const on = tbl.classList.toggle("ss-on")
      e.target.textContent = on ? "Hide table" : "Show table"
    }
    tblBtn.addEventListener("click", tblHandler)

    /* ============ ARCHITECTURE ============ */
    const setLayer = (k) => {
      $$("#ss-layers button").forEach((b) => b.classList.toggle("ss-on", b.dataset.k === k))
      $$("#ss-diag .ss-box").forEach((b) => b.classList.toggle("ss-on", b.dataset.k === k))
    }
    const layerEls = $$("#ss-layers button, #ss-diag .ss-box")
    const layerHandlers = layerEls.map((el) => {
      const handler = () => setLayer(el.dataset.k)
      el.addEventListener("click", handler)
      return { el, handler }
    })

    return () => {
      io.disconnect()
      autoIo.disconnect()
      chartLineIo?.disconnect()
      clearTimeout(chartLineTimeout)
      clearInterval(timer)
      prCleanups.forEach((fn) => fn())
      runForm.removeEventListener("submit", run)
      metricHandlers.forEach(({ b, handler }) => b.removeEventListener("click", handler))
      hit.removeEventListener("pointermove", hover)
      hit.removeEventListener("pointerleave", hoverLeave)
      tblBtn.removeEventListener("click", tblHandler)
      layerHandlers.forEach(({ el, handler }) => el.removeEventListener("click", handler))
    }
  }, [])

  return (
    <div className="ss-page" ref={rootRef}>
      <div className="ss-wrap">
        <nav className="ss-crumbs" aria-label="Breadcrumb">
          <Link to="/work">← All work</Link>
          <span className="ss-mono">Case study · Web app</span>
        </nav>
      </div>

      <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true">
        <symbol id="ss-logo" viewBox="0 0 40 40">
          <circle cx="20" cy="26" r="3.2" fill="currentColor" />
          <path d="M12.5 19.5a10.5 10.5 0 0 1 15 0" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" />
          <path d="M7 14a18 18 0 0 1 26 0" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" opacity=".55" />
        </symbol>
      </svg>

      {/* ============ HERO ============ */}
      <header className="ss-hero" id="ss-top">
        <div className="ss-wrap ss-hero-grid">
          <div>
            <div className="ss-tags">
              <a className="ss-tag ss-live" href={LIVE_URL} target="_blank" rel="noopener noreferrer"><i></i>Live on Vercel</a>
              <span className="ss-tag">Full-stack product</span>
              <span className="ss-tag">Design + build</span>
            </div>
            <div className="ss-brandline"><svg><use href="#ss-logo" /></svg><b>SiteSignal</b></div>
            <h1>Know what to fix <em>next.
              <svg viewBox="0 0 200 20" preserveAspectRatio="none"><path d="M3 14 C 50 4, 120 4, 197 12" stroke="currentColor" strokeWidth="4" fill="none" strokeLinecap="round" /></svg>
            </em></h1>
            <p className="ss-lede">SiteSignal crawls your website, finds the technical and on-page SEO problems holding back your rankings, and turns them into a prioritized list of what to fix first.</p>
            <span className="ss-hero-note">a little clarity for your corner of the web ✦</span>
            <div className="ss-hero-meta">
              <div><b>100</b><span>Pages per crawl</span></div>
              <div><b>0</b><span>Plugins to install</span></div>
              <div><b>1</b><span>Ranked to-do list</span></div>
            </div>
          </div>

          <div className="ss-app-wrap">
            <div className="ss-demo-hand">try it
              <svg viewBox="0 0 50 50" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M40 4C30 16 20 26 8 40" /><path d="M8 40l2-11M8 40l11-2" /></svg>
            </div>
            <div className="ss-app" id="ss-app">
              <div className="ss-app-bar"><i></i><i></i><i></i><span className="ss-url" id="ss-appUrl">sitesignal · new audit</span><span className="ss-demo">Demo</span></div>
              <div className="ss-app-body">
                <form className="ss-run" id="ss-runForm" autoComplete="off">
                  <label htmlFor="ss-urlIn">Website URL</label>
                  <input id="ss-urlIn" defaultValue="yourcornerstore.ca" spellCheck="false" aria-label="Website URL" />
                  <button id="ss-runBtn" type="submit">Audit →</button>
                </form>
                <div className="ss-state" id="ss-state">
                  <div className="ss-idle">
                    <div className="ss-radar"></div>
                    <p>Enter any homepage and run an audit.</p>
                    <span className="ss-mono">Simulated crawl · sample findings</span>
                  </div>
                </div>
              </div>
            </div>
            <a className="ss-btn ss-dark ss-visit-btn" href={LIVE_URL} target="_blank" rel="noopener noreferrer">
              <span className="ss-live-dot"></span>Visit SiteSignal <span>→</span>
            </a>
          </div>
        </div>
      </header>

      <div className="ss-marquee" aria-hidden="true">
        <div className="ss-mq" id="ss-mq">
          {[0, 1].flatMap((rep) => [
            <span key={`${rep}-a`}>Real crawl data</span>,
            <span key={`${rep}-b`}>Deterministic analysis</span>,
            <span key={`${rep}-c`}>No guesswork</span>,
            <span key={`${rep}-d`}>Ranked by impact</span>,
            <span key={`${rep}-e`}>Every audit saved</span>,
          ])}
        </div>
      </div>

      {/* ============ PROBLEM ============ */}
      <section className="ss-pad">
        <div className="ss-wrap ss-problem">
          <div>
            <div className="ss-eyebrow ss-mono ss-reveal">01 — The problem</div>
            <h2 className="ss-h2 ss-reveal ss-d1">A score tells you <em>how bad.</em> Not what to do.</h2>
            <p className="ss-lede ss-reveal ss-d2" style={{ marginTop: "28px" }}>Most SEO tools hand small site owners a number out of 100 and a wall of warnings. That's a grade, not a plan. SiteSignal starts from what's actually on your pages and ends with a short, ordered list of fixes.</p>
          </div>
          <div className="ss-reveal ss-d2">
            <div className="ss-compare">
              <div className="ss-cmp ss-bad">
                <span className="ss-mono">Typical SEO tool</span>
                <svg className="ss-gauge" viewBox="0 0 120 80" aria-label="A generic score of 62 out of 100">
                  <path d="M10 70 A50 50 0 0 1 110 70" fill="none" stroke="rgba(16,19,26,.12)" strokeWidth="10" strokeLinecap="round" />
                  <path d="M10 70 A50 50 0 0 1 90 30" fill="none" stroke="#7b8290" strokeWidth="10" strokeLinecap="round" />
                  <text x="60" y="66" textAnchor="middle" fontSize="30" fill="#4a5160">62</text>
                </svg>
                <p>"Your site scores 62." …so what do I fix first?</p>
              </div>
              <div className="ss-cmp ss-good">
                <span className="ss-mono">SiteSignal</span>
                <ol>
                  <li><b>01</b>Fix 4 broken internal links</li>
                  <li><b>02</b>Add titles to 7 pages</li>
                  <li><b>03</b>Write 12 meta descriptions</li>
                </ol>
              </div>
            </div>
            <p className="ss-cmp-cap">same site, different question ↑</p>
          </div>
        </div>
      </section>

      {/* ============ HOW IT WORKS ============ */}
      <section className="ss-pad ss-how" id="ss-how">
        <div className="ss-wrap">
          <div className="ss-eyebrow ss-mono ss-reveal">02 — How it works</div>
          <h2 className="ss-h2 ss-reveal ss-d1">URL in. <em>Priorities out.</em></h2>
          <div className="ss-steps" id="ss-steps">
            <div className="ss-fill"></div>
            <div className="ss-step">
              <div className="ss-n">01</div>
              <h3>Connect your website</h3>
              <p>Enter your homepage URL — no code, no plugin to install.</p>
              <span className="ss-mono">Input · 1 URL</span>
            </div>
            <div className="ss-step">
              <div className="ss-n">02</div>
              <h3>We crawl and analyze it</h3>
              <p>We crawl up to 100 pages and run a deterministic set of technical and on-page SEO checks.</p>
              <span className="ss-mono">Crawl · ≤100 pages</span>
            </div>
            <div className="ss-step">
              <div className="ss-n">03</div>
              <h3>Get prioritized opportunities</h3>
              <p>Issues are grouped and ranked by real impact, so you know exactly what to fix first.</p>
              <span className="ss-mono">Output · Ranked list</span>
            </div>
            <div className="ss-step">
              <div className="ss-n">04</div>
              <h3>Track improvements</h3>
              <p>Every audit is saved, so you can see what changed after each fix.</p>
              <span className="ss-mono">History · Every audit</span>
            </div>
          </div>
        </div>
      </section>

      {/* ============ HISTORY ============ */}
      <section className="ss-pad" id="ss-history">
        <div className="ss-wrap ss-hist-grid">
          <div>
            <div className="ss-eyebrow ss-mono ss-reveal">03 — Progress over time</div>
            <h2 className="ss-h2 ss-reveal ss-d1">Fix it, re-run it, <em>see it move.</em></h2>
            <p className="ss-lede ss-reveal ss-d2" style={{ marginTop: "28px" }}>Because every audit is stored, SiteSignal can show exactly what changed between runs — which issues you closed, and which new ones appeared — instead of a score that drifts for reasons nobody can explain.</p>
            <div className="ss-changes ss-reveal ss-d3">
              <div><span className="ss-tagx ss-fixed">Fixed</span>Broken internal links · 4 pages</div>
              <div><span className="ss-tagx ss-fixed">Fixed</span>Missing page titles · 7 pages</div>
              <div><span className="ss-tagx ss-new">New</span>Images missing alt text · 3 pages</div>
            </div>
          </div>
          <div className="ss-chart-card ss-reveal ss-d2" id="ss-chartCard">
            <div className="ss-chart-top">
              <div><h4>Open issues per audit</h4><div className="ss-sub">Sample site · six audits</div></div>
              <div className="ss-toggle" id="ss-metricToggle">
                <button className="ss-on" data-m="issues">Issues</button>
                <button data-m="pages">Pages affected</button>
              </div>
            </div>
            <svg className="ss-chart" id="ss-chart" viewBox="0 0 560 280" role="img" aria-label="Line chart of open issues across six audits, falling over time">
              <defs><linearGradient id="ss-areaGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#2f6bff" stopOpacity=".16" /><stop offset="1" stopColor="#2f6bff" stopOpacity="0" /></linearGradient></defs>
              <g className="ss-grid"></g><g className="ss-axis"></g>
              <path className="ss-area" /><path className="ss-ln" />
              <line className="ss-xh" y1="16" y2="244" style={{ display: "none" }} />
              <g className="ss-pts"></g>
              <text className="ss-lbl" textAnchor="start"></text>
              <rect className="ss-hit" x="40" y="0" width="510" height="250" fill="transparent" />
            </svg>
            <div className="ss-tip" id="ss-tip"></div>
            <div className="ss-chart-foot"><span>Illustrative data for the demo</span><button id="ss-tblBtn">Show table</button></div>
            <table className="ss-tbl" id="ss-tbl"><thead><tr><th>Audit</th><th>Date</th><th>Issues</th><th>Pages affected</th></tr></thead><tbody></tbody></table>
          </div>
        </div>
      </section>

      {/* ============ PRINCIPLES ============ */}
      <section className="ss-pad ss-principles">
        <div className="ss-wrap">
          <div className="ss-eyebrow ss-mono ss-reveal">04 — What makes it different</div>
          <h2 className="ss-h2 ss-reveal ss-d1">Real crawl data. Deterministic analysis. <em>No guesswork.</em></h2>
          <div className="ss-pr-grid">
            <div className="ss-pr ss-reveal">
              <svg className="ss-viz" viewBox="0 0 84 84" fill="none" stroke="#9fb8ff" strokeWidth="1.4"><rect x="10" y="12" width="28" height="20" rx="3" /><rect x="46" y="12" width="28" height="20" rx="3" /><rect x="10" y="52" width="28" height="20" rx="3" /><rect x="46" y="52" width="28" height="20" rx="3" strokeDasharray="3 3" /><path d="M38 22h8M24 32v20M60 32v20" /></svg>
              <span className="ss-k">01</span>
              <h3>Real crawl data</h3>
              <p>Every finding comes from pages SiteSignal actually fetched on your site — not estimates, not industry averages.</p>
            </div>
            <div className="ss-pr ss-reveal ss-d1">
              <svg className="ss-viz" viewBox="0 0 84 84" fill="none" stroke="#9fb8ff" strokeWidth="1.4"><path d="M12 42h18l6-14 12 28 6-14h18" /><circle cx="12" cy="42" r="3" fill="#9fb8ff" /><circle cx="72" cy="42" r="3" fill="#9fb8ff" /></svg>
              <span className="ss-k">02</span>
              <h3>Deterministic analysis</h3>
              <p>The same site produces the same results. A fixed set of checks means changes in your audit reflect changes on your site.</p>
            </div>
            <div className="ss-pr ss-reveal ss-d2">
              <svg className="ss-viz" viewBox="0 0 84 84" fill="none" stroke="#9fb8ff" strokeWidth="1.4"><circle cx="42" cy="42" r="26" /><path d="M42 30v14l9 6" /><path d="M42 16v-4M42 72v-4M16 42h-4M72 42h-4" /></svg>
              <span className="ss-k">03</span>
              <h3>Reasoning shown</h3>
              <p>Each recommendation traces back to what was found, with the reasoning alongside it — so you can trust it, and explain it.</p>
            </div>
          </div>
          <div className="ss-quote ss-reveal">
            <div className="ss-mark">"</div>
            <div>
              <p>SiteSignal isn't a generic SEO score generator — every recommendation traces back to something we actually found on your site.</p>
              <span>Product principle</span>
            </div>
          </div>
        </div>
      </section>

      {/* ============ ARCHITECTURE ============ */}
      <section className="ss-pad" id="ss-build">
        <div className="ss-wrap ss-arch-grid">
          <div>
            <div className="ss-eyebrow ss-mono ss-reveal">05 — Under the hood</div>
            <h2 className="ss-h2 ss-reveal ss-d1">Built <em>end to end.</em></h2>
            <p className="ss-lede ss-reveal ss-d2" style={{ marginTop: "24px" }}>A Next.js frontend talks to an API that runs the crawl and the check engine, then stores every audit in Postgres so history is a query, not a guess.</p>
            <div className="ss-layer-list ss-reveal ss-d3" id="ss-layers">
              <button className="ss-on" data-k="web"><span className="ss-i">01</span><span><b>Web app</b><small>Next.js landing page, auth (register / log in) and the audit dashboard, deployed on Vercel.</small></span></button>
              <button data-k="api"><span className="ss-i">02</span><span><b>API</b><small>Receives an audit request, kicks off the crawl and returns results to the dashboard.</small></span></button>
              <button data-k="crawl"><span className="ss-i">03</span><span><b>Crawler + checks</b><small>Follows internal links up to 100 pages and runs the same fixed set of technical and on-page checks on each one.</small></span></button>
              <button data-k="db"><span className="ss-i">04</span><span><b>Postgres</b><small>Stores users, audits, pages and issues, so every run can be compared with the last.</small></span></button>
            </div>
            <div className="ss-stack ss-reveal"><span>Next.js</span><span>Postgres</span><span>Vercel</span></div>
          </div>
          <div className="ss-diagram ss-reveal ss-d2">
            <svg viewBox="0 0 520 420" id="ss-diag" aria-label="Architecture diagram: web app, API, crawler and check engine, Postgres">
              <defs><marker id="ss-ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill="#7b8290" /></marker></defs>
              <path className="ss-edge" d="M140 78 H 250" markerEnd="url(#ss-ah)" />
              <path className="ss-edge ss-flow" d="M380 110 V 170" markerEnd="url(#ss-ah)" />
              <path className="ss-edge" d="M380 250 V 310" markerEnd="url(#ss-ah)" />
              <path className="ss-edge" d="M300 340 H 190 V 110" markerEnd="url(#ss-ah)" />
              <text x="195" y="68" fontFamily="JetBrains Mono" fontSize="9" fill="#7b8290" textAnchor="middle">POST /audit</text>
              <text x="392" y="144" fontFamily="JetBrains Mono" fontSize="9" fill="#7b8290">crawl</text>
              <text x="392" y="284" fontFamily="JetBrains Mono" fontSize="9" fill="#7b8290">save</text>
              <text x="245" y="360" fontFamily="JetBrains Mono" fontSize="9" fill="#7b8290" textAnchor="middle">history</text>
              <g className="ss-box ss-on" data-k="web"><rect x="20" y="46" width="120" height="64" rx="10" /><text x="80" y="76" textAnchor="middle">Web app</text><text className="ss-s" x="80" y="94" textAnchor="middle">NEXT.JS · VERCEL</text></g>
              <g className="ss-box" data-k="api"><rect x="250" y="46" width="250" height="64" rx="10" /><text x="375" y="76" textAnchor="middle">API</text><text className="ss-s" x="375" y="94" textAnchor="middle">AUDIT REQUESTS · RESULTS</text></g>
              <g className="ss-box" data-k="crawl"><rect x="250" y="170" width="250" height="80" rx="10" /><text x="375" y="202" textAnchor="middle">Crawler + check engine</text><text className="ss-s" x="375" y="222" textAnchor="middle">≤100 PAGES · FIXED CHECKS</text></g>
              <g className="ss-box" data-k="db"><rect x="300" y="310" width="200" height="64" rx="10" /><text x="400" y="340" textAnchor="middle">Postgres</text><text className="ss-s" x="400" y="358" textAnchor="middle">AUDITS · PAGES · ISSUES</text></g>
              <g opacity=".9">
                <rect x="20" y="190" width="150" height="100" rx="8" fill="none" stroke="#2f6bff" strokeDasharray="4 4" />
                <text x="95" y="212" textAnchor="middle" fontFamily="JetBrains Mono" fontSize="9" fill="#2f6bff">YOUR WEBSITE</text>
                <g fill="#dfe8ff" stroke="#2f6bff" strokeWidth=".8"><rect x="36" y="224" width="30" height="22" rx="3" /><rect x="80" y="224" width="30" height="22" rx="3" /><rect x="124" y="224" width="30" height="22" rx="3" /><rect x="58" y="256" width="30" height="22" rx="3" /><rect x="102" y="256" width="30" height="22" rx="3" /></g>
              </g>
              <path className="ss-edge ss-flow" d="M250 212 H 176" markerEnd="url(#ss-ah)" />
              <text x="213" y="204" fontFamily="JetBrains Mono" fontSize="9" fill="#7b8290" textAnchor="middle">fetch</text>
            </svg>
          </div>
        </div>
      </section>

      {/* ============ ROLE ============ */}
      <section className="ss-pad ss-role" id="ss-role">
        <div className="ss-wrap ss-role-grid">
          <div>
            <div className="ss-eyebrow ss-mono ss-reveal">06 — My role</div>
            <h2 className="ss-h2 ss-reveal ss-d1">Product, design <em>and code.</em></h2>
            <p className="ss-lede ss-reveal ss-d2" style={{ marginTop: "24px" }}>I designed and built SiteSignal from the ground up — the product thinking, the interface and the full stack behind it. The goal was an SEO tool a small business owner could open once and immediately know where to start.</p>
            <div className="ss-chips ss-reveal ss-d3"><span>Product strategy</span><span>UX / UI</span><span>Frontend</span><span>Backend</span><span>Database</span><span>Deployment</span></div>
            <div className="ss-role-card ss-reveal ss-d3">
              <div className="ss-av">F</div>
              <div><div className="ss-hand">Feyza Gulbent</div><div className="ss-mono">Designer &amp; developer</div></div>
            </div>
          </div>
          <ol className="ss-dec ss-reveal ss-d2">
            <li><div><h4>Priorities over scores</h4><p>The core output is an ordered list, not a grade. Everything in the dashboard serves the question "what do I fix first?"</p><div className="ss-vs"><span className="ss-no">Score / 100</span><span className="ss-yes">Ranked fixes</span></div></div></li>
            <li><div><h4>Explain every finding</h4><p>Each issue carries its reasoning and the pages it was found on, so recommendations are checkable instead of mysterious.</p><div className="ss-vs"><span className="ss-no">Black box</span><span className="ss-yes">Reasoning shown</span></div></div></li>
            <li><div><h4>Zero-install onboarding</h4><p>A URL is the only input. No code snippet, no plugin — the first audit is one step away from sign-up.</p><div className="ss-vs"><span className="ss-no">Install plugin</span><span className="ss-yes">Paste a URL</span></div></div></li>
            <li><div><h4>Deterministic by design</h4><p>A fixed check set makes audits comparable run to run, which is what makes progress tracking meaningful.</p><div className="ss-vs"><span className="ss-no">Fuzzy estimates</span><span className="ss-yes">Same input, same output</span></div></div></li>
          </ol>
        </div>
      </section>

      {/* ============ CTA ============ */}
      <section className="ss-cta">
        <div className="ss-rings"><i></i><i></i><i></i></div>
        <div className="ss-wrap">
          <h2 className="ss-reveal">Audit your<br /><em>website.</em></h2>
          <p className="ss-reveal ss-d1">SiteSignal is live. Paste a homepage and get your first prioritized list in minutes.</p>
          <div className="ss-btns ss-reveal ss-d2">
            <a className="ss-btn ss-primary" href={LIVE_URL} target="_blank" rel="noopener noreferrer">Visit SiteSignal <span>→</span></a>
            <a className="ss-btn ss-ghost" href="#ss-top">Try the demo again <span>↑</span></a>
          </div>
        </div>
      </section>
      <footer><div className="ss-wrap ss-mono" style={{ fontSize: "10px" }}><span>SiteSignal</span><span>Case study · Feyza Gulbent</span></div></footer>
    </div>
  )
}
