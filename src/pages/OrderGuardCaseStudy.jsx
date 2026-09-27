import { useEffect, useRef } from "react"
import { Link } from "react-router-dom"
import "./OrderGuardCaseStudy.css"

const FONTS_HREF =
  "https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600;700&family=Geist+Mono:wght@400;500;600&display=swap"

function useOrderGuardFonts() {
  useEffect(() => {
    if (document.querySelector('link[data-orderguard-fonts="true"]')) return

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
    stylesheet.dataset.orderguardFonts = "true"

    document.head.append(preconnectGoogle, preconnectGstatic, stylesheet)
  }, [])
}

const LIVE_URL = "https://orderguard-silk.vercel.app/"

export default function OrderGuardCaseStudy() {
  useOrderGuardFonts()
  const rootRef = useRef(null)

  useEffect(() => {
    const root = rootRef.current
    if (!root) return

    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches
    const $ = (sel) => root.querySelector(sel)
    const $$ = (sel) => [...root.querySelectorAll(sel)]

    const io = new IntersectionObserver(
      (es) =>
        es.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("og-in")
            io.unobserve(e.target)
          }
        }),
      { threshold: 0.08 }
    )
    $$(".og-reveal").forEach((el) => io.observe(el))

    const rng = (seed) => () => {
      seed |= 0
      seed = (seed + 0x6d2b79f5) | 0
      let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296
    }
    const R = rng(21)
    const fmt = (v) => "$" + v.toFixed(2)

    const ACTS = [
      { k: "do_nothing", cost: 0, red: 0 },
      { k: "update_eta", cost: 0.05, red: 0.18 },
      { k: "notify_merchant", cost: 0.25, red: 0.3 },
      { k: "offer_credit", cost: 2.0, red: 0.35 },
      { k: "reassign_driver", cost: 1.5, red: 0.55 },
    ]
    const pFromScore = (s) => Math.min(0.95, Math.pow(s / 100, 1.35) * 0.9)
    const evaluate = (score, C) => {
      const p = pFromScore(score)
      return ACTS.map((a) => {
        const pr = p * (1 - a.red)
        const residual = pr * C
        return { ...a, p: pr, residual, total: a.cost + residual }
      })
    }

    const merchants = Array.from({ length: 10 }, (_, i) => ({
      id: "merchant-" + String(i + 1).padStart(3, "0"),
      x: 90 + R() * 460,
      y: 50 + R() * 330,
    }))
    const custs = Array.from({ length: 46 }, () => ({ x: 40 + R() * 560, y: 30 + R() * 380 }))
    const STATUSES = ["confirmed", "en_route_to_merchant", "at_merchant", "en_route_to_customer"]
    const PRED = ["late_delivery", "late_delivery", "late_delivery", "customer_unreachable", "merchant_stockout", "driver_offline"]
    const FACT = [
      { k: "merchant_backlog", w: 0.3, sig: (o) => `${o.f.backlog} open orders` },
      { k: "driver_reliability", w: 0.25, sig: (o) => `${Math.round(o.f.driver * 100)}% on-time` },
      { k: "customer_reachability", w: 0.15, sig: (o) => (o.f.reach > 0.8 ? "verified contact" : o.f.reach > 0.5 ? "1 missed contact" : "2 missed contacts") },
      { k: "projected_lateness", w: 0.3, sig: (o) => `${o.f.late >= 0 ? "+" : ""}${o.f.late.toFixed(1)} min vs ETA` },
    ]
    const signals = (o) => [
      Math.min(1, o.f.backlog / 8),
      Math.max(0, 1 - (o.f.driver - 0.55) / 0.45),
      1 - o.f.reach,
      Math.max(0, Math.min(1, (o.f.late + 5) / 25)),
    ]
    const scoreOf = (o) => {
      const s = signals(o)
      return FACT.reduce((t, f, i) => t + f.w * s[i] * 100, 0)
    }

    const orders = Array.from({ length: 34 }, (_, i) => {
      const m = merchants[Math.floor(R() * merchants.length)]
      const c = custs[Math.floor(R() * custs.length)]
      const hot = R() < 0.45
      return {
        id: "order-" + String(440 + i * 7 + Math.floor(R() * 6)).padStart(6, "0"),
        m,
        c,
        status: Math.floor(R() * 4),
        t: R(),
        pred: PRED[Math.floor(R() * PRED.length)],
        f: {
          backlog: hot ? 4 + Math.floor(R() * 5) : Math.floor(R() * 4),
          driver: hot ? 0.58 + R() * 0.25 : 0.82 + R() * 0.17,
          reach: hot ? 0.3 + R() * 0.5 : 0.7 + R() * 0.3,
          late: hot ? 4 + R() * 16 : -8 + R() * 10,
        },
        created: 9 * 60 + 5 + Math.floor(R() * 40),
      }
    })
    orders.forEach((o) => {
      o.score = scoreOf(o)
      o.conf = o.score > 70 ? 66 + Math.round(R() * 14) : 55 + Math.round(R() * 20)
      if (o.score < 35) o.pred = "none"
    })

    let thr = 50
    let sel = null
    const svg = $("#og-map")
    const NS = "http://www.w3.org/2000/svg"
    const el = (n, a) => {
      const e = document.createElementNS(NS, n)
      for (const k in a) e.setAttribute(k, a[k])
      return e
    }
    const gNet = el("g", {})
    const gRoutes = el("g", {})
    const gMer = el("g", {})
    const gDrv = el("g", {})
    svg.append(gNet, gRoutes, gMer, gDrv)
    custs.forEach((c, i) => {
      if (i % 2 === 0) {
        const m = merchants[i % merchants.length]
        gNet.append(el("line", { x1: c.x, y1: c.y, x2: m.x, y2: m.y, stroke: "#1f3326", "stroke-width": 1 }))
      }
    })
    custs.forEach((c) => gNet.append(el("circle", { cx: c.x, cy: c.y, r: 2.2, fill: "#3a3f47" })))
    merchants.forEach((m) => gMer.append(el("rect", { x: m.x - 6, y: m.y - 6, width: 12, height: 12, fill: "#e3a53a", rx: 1 })))

    const drawMap = () => {
      gRoutes.innerHTML = ""
      gDrv.innerHTML = ""
      orders.forEach((o) => {
        const hi = o.score >= thr
        const isSel = o.id === sel
        const line = el("line", {
          x1: o.m.x,
          y1: o.m.y,
          x2: o.c.x,
          y2: o.c.y,
          stroke: hi ? "#e46a6a" : "#2b4a34",
          "stroke-width": isSel ? 4.5 : hi ? 2.6 : 1.1,
          "stroke-linecap": "round",
          opacity: !isSel && hi ? 0.6 : 1,
        })
        line.style.cursor = "pointer"
        line.addEventListener("click", () => select(o.id))
        gRoutes.append(line)
        const t = o.status < 2 ? o.t * 0.4 : 0.4 + o.t * 0.6
        const d = el("circle", {
          cx: o.m.x + (o.c.x - o.m.x) * t,
          cy: o.m.y + (o.c.y - o.m.y) * t,
          r: isSel ? 8 : 5.5,
          fill: "#6f9cff",
          stroke: isSel ? "#fff" : "#0d0f12",
          "stroke-width": isSel ? 2 : 1.5,
        })
        d.style.cursor = "pointer"
        d.addEventListener("click", () => select(o.id))
        const tt = el("title", {})
        tt.textContent = `${o.id} · risk ${o.score.toFixed(1)}`
        d.append(tt)
        gDrv.append(d)
      })
    }

    const drawFeed = () => {
      const list = orders.filter((o) => o.score >= thr).sort((a, b) => b.score - a.score)
      $("#og-feed").innerHTML = list.length
        ? list
            .map(
              (o) =>
                `<tr data-id="${o.id}" class="${o.id === sel ? "og-sel" : ""}"><td class="og-id">${o.id}</td><td class="og-c-stat">${STATUSES[o.status]}</td><td class="og-risk${o.score < 60 ? " og-mid" : ""}">${o.score.toFixed(1)}</td><td>${o.pred}</td><td class="og-c-conf">${o.conf}%</td></tr>`
            )
            .join("")
        : `<tr><td colspan="5" class="og-empty">No orders at or above ${thr}</td></tr>`
      $("#og-feed")
        .querySelectorAll("tr[data-id]")
        .forEach((tr) => tr.addEventListener("click", () => select(tr.dataset.id)))
    }

    const hhmm = (m) => {
      const h = Math.floor(m / 60)
      const mm = m % 60
      return `${((h + 11) % 12) + 1}:${String(mm).padStart(2, "0")}:00 ${h >= 12 ? "PM" : "AM"}`
    }

    const drawDetail = () => {
      const o = orders.find((x) => x.id === sel)
      if (!o) return
      const r = rng(parseInt(o.id.slice(-6), 10) + 7)
      const steps = [
        ["order_created", 0],
        ["order_confirmed", 0],
        ["driver_assigned", 1],
        ["driver_en_route_to_merchant", 1],
        ["driver_arrived_at_merchant", 2],
        ["order_picked_up", 3],
        ["driver_en_route_to_customer", 3],
      ]
      let tm = o.created
      const tl = []
      const gap = [0, 0, 1, 0, 4, 5, 0]
      steps.forEach(([ev, need], i) => {
        if (o.status >= need) {
          tm += gap[i] + (gap[i] ? Math.floor(r() * 5) : 0)
          tl.push([ev, tm, ev === "driver_assigned" ? `{"driver_id":"driver-00${10 + Math.floor(r() * 25)}"}` : "—"])
        }
      })
      const pts = tl.map((_, i) => Math.max(0, Math.min(100, o.score * (0.3 + 0.7 * (i / Math.max(1, tl.length - 1))) + (r() - 0.5) * 6)))
      pts[pts.length - 1] = o.score
      const cw = 560
      const ch = 190
      const L = 34
      const B = 26
      const T = 12
      const Rr = 14
      const xs = (i) => L + (i * (cw - L - Rr)) / Math.max(1, pts.length - 1)
      const ys = (v) => T + (1 - v / 100) * (ch - T - B)
      const path = pts.map((v, i) => (i ? "L" : "M") + xs(i).toFixed(1) + " " + ys(v).toFixed(1)).join(" ")
      const shortT = (m) => hhmm(m).replace(":00 ", " ")
      const chart = `<svg id="og-riskChart" viewBox="0 0 ${cw} ${ch}" role="img" aria-label="Risk score over time for ${o.id}"><g class="g">${[0, 25, 50, 75, 100].map((v) => `<line x1="${L}" x2="${cw - Rr}" y1="${ys(v)}" y2="${ys(v)}"/>`).join("")}</g>
        <g class="ax">${[0, 25, 50, 75, 100].map((v) => `<text x="${L - 6}" y="${ys(v) + 3}" text-anchor="end">${v}</text>`).join("")}${pts
        .map((_, i) =>
          i === 0 || i === pts.length - 1 || (pts.length > 4 && i === Math.floor(pts.length / 2))
            ? `<text x="${xs(i)}" y="${ch - 8}" text-anchor="${i === 0 ? "start" : i === pts.length - 1 ? "end" : "middle"}">${shortT(tl[i][1])}</text>`
            : ""
        )
        .join("")}</g>
        <line x1="${L}" x2="${cw - Rr}" y1="${ys(thr)}" y2="${ys(thr)}" stroke="#e3a53a" stroke-width="1" stroke-dasharray="5 4" opacity=".7"/><text x="${L + 6}" y="${ys(thr) - 5}" font-family="Geist Mono, monospace" font-size="10" fill="#e3a53a">threshold ${thr}</text>
        <path d="${path}" fill="none" stroke="#e46a6a" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"/>
        ${pts.map((v, i) => `<circle cx="${xs(i)}" cy="${ys(v)}" r="4" fill="#e46a6a" stroke="#15181d" stroke-width="1.5"><title>${tl[i][0]} · ${v.toFixed(1)}</title></circle>`).join("")}</svg>`
      const s = signals(o)
      const contrib = FACT.map((f, i) => ({ ...f, v: f.w * s[i] * 100 })).sort((a, b) => b.v - a.v)
      const C = 10
      const ev = evaluate(o.score, C)
      const best = ev.reduce((a, b) => (b.total < a.total ? b : a))
      const base = ev[0]
      $("#og-detail").innerHTML = `
        <div class="og-d-head"><div><h3>${o.id}</h3><div class="og-st">${STATUSES[o.status]} · from ${o.m.id}</div></div><span class="og-badge og-synthetic">click any order or route to inspect</span></div>
        <div class="og-d-grid">
          <div class="og-panel">
            <div class="og-p-head"><span class="og-l"><span class="og-lbl">Timeline</span><span class="og-badge og-measured">measured</span></span></div>
            <div class="og-scroll-x" style="padding:0 6px 8px"><table><thead><tr><th>Event</th><th>Time</th><th>Details</th></tr></thead><tbody>${tl.map((t) => `<tr><td>${t[0]}</td><td>${hhmm(t[1])}</td><td style="color:var(--muted)">${t[2]}</td></tr>`).join("")}</tbody></table></div>
          </div>
          <div class="og-panel">
            <div class="og-p-head"><span class="og-l"><span class="og-lbl">Risk score over time</span><span class="og-badge og-estimate">model estimate</span></span></div>
            <div style="padding:0 14px 6px">${chart}</div>
            <p class="og-note">Recomputed each time an event fired for this order (event-reactive, not polled).</p>
          </div>
          <div class="og-panel og-full">
            <div class="og-p-head"><span class="og-l"><span class="og-lbl">Latest risk assessment</span><span class="og-badge og-estimate">model estimate</span></span></div>
            <div class="og-stats"><div><span>Score</span><b style="color:${o.score >= thr ? "var(--red)" : "var(--text)"}">${o.score.toFixed(1)}</b></div><div><span>Predicted</span><b>${o.pred}</b></div><div><span>Confidence</span><b>${o.conf}%</b></div><div><span>Predicted delay</span><b>${o.f.late.toFixed(1)} min</b></div></div>
            <div class="og-scroll-x" style="padding:0 6px 8px"><table><thead><tr><th>Factor</th><th>Weight</th><th>Signal</th><th>Contribution</th><th style="width:28%"></th></tr></thead><tbody>${contrib.map((f) => `<tr><td>${f.k}</td><td>${f.w.toFixed(2)}</td><td style="color:var(--text-2)">${f.sig(o)}</td><td>${f.v.toFixed(1)}</td><td><div class="og-bar"><span style="width:${Math.min(100, (f.v / 30) * 100).toFixed(0)}%"></span></div></td></tr>`).join("")}</tbody></table></div>
          </div>
          <div class="og-panel og-full">
            <div class="og-p-head"><span class="og-l"><span class="og-lbl">Recommended intervention — expected-value reasoning</span><span class="og-badge og-estimate">model estimate</span></span></div>
            <p class="og-reason">Chosen: <b>${best.k}</b> — ${best.k === "do_nothing" ? `no intervention costs less than the risk it removes.` : `${fmt(best.cost)} direct plus ${fmt(best.residual)} residual expected failure cost (${fmt(best.total)} total), saving ${fmt(base.total - best.total)} vs. doing nothing.`}</p>
            <div class="og-scroll-x" style="padding:0 6px 8px"><table><thead><tr><th>Intervention</th><th>Direct cost</th><th>Implied P(fail)</th><th>Est. prob. reduction</th><th>Failure cost</th><th>Residual cost</th><th>Total expected</th></tr></thead><tbody>${ev.map((a) => `<tr class="${a === best ? "og-chosen" : ""}"><td>${a.k}</td><td>${fmt(a.cost)}</td><td>${(a.p * 100).toFixed(1)}%</td><td>${a.red ? Math.round(a.red * 100) + "%" : "—"}</td><td>${fmt(C)}</td><td>${fmt(a.residual)}</td><td>${fmt(a.total)}</td></tr>`).join("")}</tbody></table></div>
          </div>
        </div>`
    }

    const select = (id) => {
      sel = id
      drawMap()
      drawFeed()
      drawDetail()
    }

    const thrButtons = $$("#og-thr button")
    const thrHandlers = thrButtons.map((b) => {
      const handler = () => {
        thrButtons.forEach((x) => x.classList.remove("og-on"))
        b.classList.add("og-on")
        thr = +b.dataset.t
        const cur = orders.find((o) => o.id === sel)
        const top = orders.filter((o) => o.score >= thr).sort((a, c) => c.score - a.score)[0]
        if (top && cur.score < thr) sel = top.id
        drawMap()
        drawFeed()
        drawDetail()
      }
      b.addEventListener("click", handler)
      return { b, handler }
    })

    sel = [...orders].sort((a, b) => b.score - a.score)[0].id
    drawMap()
    drawFeed()
    drawDetail()

    let secs = 0
    let refreshTimer = null
    if (!reduce) {
      refreshTimer = setInterval(() => {
        orders.forEach((o) => {
          o.t += 0.015
          if (o.t >= 1) o.t = 0
        })
        drawMap()
        secs += 2
        const upd = $("#og-upd")
        if (upd) upd.textContent = `replica console · updated ${secs < 60 ? secs + "s" : Math.floor(secs / 60) + "m"} ago`
      }, 2000)
    }

    /* EV calculator */
    const evRisk = $("#og-evRisk")
    const evFail = $("#og-evFail")
    const evDraw = () => {
      const s = +evRisk.value
      const C = +evFail.value
      $("#og-evRiskV").textContent = s
      $("#og-evFailV").textContent = fmt(C)
      const ev = evaluate(s, C)
      const best = ev.reduce((a, b) => (b.total < a.total ? b : a))
      const base = ev[0]
      $("#og-evChosen").innerHTML = `Chosen: <b>${best.k}</b>`
      $("#og-evStats").innerHTML = `<div><span>Direct cost</span><b>${fmt(best.cost)}</b></div><div><span>Est. residual failure cost</span><b>${fmt(best.residual)}</b></div><div><span>Baseline (do nothing) cost</span><b>${fmt(base.total)}</b></div><div><span>Expected net value vs. doing nothing</span><b class="og-pos">+${fmt(base.total - best.total)}</b></div>`
      $("#og-evTable").innerHTML = ev
        .map(
          (a) =>
            `<tr class="${a === best ? "og-chosen" : ""}"><td>${a.k}</td><td>${fmt(a.cost)}</td><td>${(a.p * 100).toFixed(1)}%</td><td>${a.red ? Math.round(a.red * 100) + "%" : "—"}</td><td>${fmt(a.residual)}</td><td>${fmt(a.total)}</td></tr>`
        )
        .join("")
    }
    evRisk.addEventListener("input", evDraw)
    evFail.addEventListener("input", evDraw)
    const presetButtons = $$(".og-presets button")
    const presetHandlers = presetButtons.map((b) => {
      const handler = () => {
        evRisk.value = b.dataset.r
        evFail.value = b.dataset.f
        evDraw()
      }
      b.addEventListener("click", handler)
      return { b, handler }
    })
    evDraw()

    /* architecture */
    const setLayer = (k) => {
      $$("#og-layers button").forEach((b) => b.classList.toggle("og-on", b.dataset.k === k))
      $$("#og-arch .og-box").forEach((b) => b.classList.toggle("og-on", b.dataset.k === k))
    }
    const layerEls = $$("#og-layers button, #og-arch .og-box")
    const layerHandlers = layerEls.map((elx) => {
      const handler = () => setLayer(elx.dataset.k)
      elx.addEventListener("click", handler)
      return { elx, handler }
    })

    return () => {
      io.disconnect()
      if (refreshTimer) clearInterval(refreshTimer)
      thrHandlers.forEach(({ b, handler }) => b.removeEventListener("click", handler))
      evRisk.removeEventListener("input", evDraw)
      evFail.removeEventListener("input", evDraw)
      presetHandlers.forEach(({ b, handler }) => b.removeEventListener("click", handler))
      layerHandlers.forEach(({ elx, handler }) => elx.removeEventListener("click", handler))
    }
  }, [])

  return (
    <div className="og-page" ref={rootRef}>
      <div className="og-wrap">
        <nav className="og-crumbs" aria-label="Breadcrumb">
          <Link to="/work">← All work</Link>
        </nav>

        <div className="og-top">
          <div className="og-heading-actions">
          <div className="og-brand">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round">
              <path d="M12 2.5l8 3v6c0 5.2-3.4 8.8-8 10.3C7.4 20.3 4 16.7 4 11.5v-6z" />
              <path d="M8.5 13.5l2.5 2.5 4.5-5" />
            </svg>
            OrderGuard
          </div>
          <a className="og-btn og-primary" href={LIVE_URL} target="_blank" rel="noopener noreferrer">Visit OrderGuard →</a>
          </div>
          <div className="og-meta">Case study · synthetic marketplace — no real company data</div>
        </div>

        <div className="og-panel og-banner">
          <b>OrderGuard</b> predicts delivery failure risk and evaluates cost-justified interventions in a synthetic on-demand delivery marketplace simulation.
          <span className="og-q" tabIndex={0} data-tip="Merchants, drivers, customers and orders are all generated by a seeded simulation run.">?</span>
          <span className="og-dim">All data is generated by a seeded simulation — no real company, courier, or customer data is used anywhere.</span>
        </div>

        <header className="og-hero">
          <div>
            <h1>Spot failing deliveries early — and <span>only intervene when it pays.</span></h1>
            <p>A delivery operations dashboard that identifies orders at risk of failure, explains the likely causes, and evaluates whether an intervention is worth its cost.</p>
          </div>
          <div className="og-tags">
            <a className="og-tag og-live" href={LIVE_URL} target="_blank" rel="noopener noreferrer"><i></i>live on vercel</a>
            <span className="og-tag">full-stack</span>
            <span className="og-tag">simulation</span>
            <span className="og-tag">design + build</span>
          </div>
        </header>

        <div className="og-runbar">
          <div className="og-select">
            <span>run-fcb1aa39 · seed 21 · 480 sim min</span>
            <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M4 6l4 4 4-4" /></svg>
          </div>
          <span className="og-q" tabIndex={0} data-tip="The KPIs come from a real OrderGuard run (seed 21). The console below them is an interactive replica built for this case study.">?</span>
          <span className="og-upd" id="og-upd">replica console · updated just now</span>
        </div>

        <div className="og-kpis">
          <div className="og-panel og-kpi"><span className="og-lbl">Active deliveries</span><b>49</b></div>
          <div className="og-panel og-kpi"><span className="og-lbl">High-risk orders</span><b style={{ color: "var(--amber)" }}>22</b><small>score ≥ 50</small></div>
          <div className="og-panel og-kpi"><span className="og-lbl">Failure rate</span><b style={{ color: "var(--green)" }}>0.6%</b></div>
          <div className="og-panel og-kpi"><span className="og-lbl">Interventions triggered</span><b>626</b><small>$119.45 spent</small></div>
          <div className="og-panel og-kpi"><span className="og-lbl">Avg. cost / intervention</span><b>$0.19</b><small>cheap actions first</small></div>
        </div>

        <div className="og-console">
          <div className="og-panel">
            <div className="og-p-head"><span className="og-l"><span className="og-lbl">Marketplace map</span></span><span style={{ fontSize: "12.5px", color: "var(--dim)" }}>synthetic coordinate plane — not a real map</span></div>
            <div className="og-map-wrap">
              <svg id="og-map" viewBox="0 0 640 460" aria-label="Synthetic marketplace map with merchants, drivers and delivery routes"></svg>
              <div className="og-map-legend">
                <span><i style={{ width: "9px", height: "9px", background: "var(--amber)" }}></i>merchant</span>
                <span><i style={{ width: "9px", height: "9px", borderRadius: "50%", background: "var(--blue)" }}></i>driver</span>
                <span><i style={{ width: "16px", height: "2px", background: "var(--red)" }}></i>high-risk route</span>
                <span><i style={{ width: "16px", height: "1px", background: "#3a5a44" }}></i>route</span>
              </div>
            </div>
          </div>
          <div className="og-panel">
            <div className="og-p-head">
              <span className="og-l"><span className="og-lbl">High-risk order feed</span><span className="og-q" tabIndex={0} data-tip="Orders whose current risk score is at or above the selected threshold, highest first. Click one to open its detail.">?</span></span>
              <span className="og-seg" id="og-thr">risk ≥ <button data-t="25">25</button><button data-t="50" className="og-on">50</button><button data-t="75">75</button></span>
            </div>
            <div className="og-feed">
              <table>
                <thead><tr><th>Order</th><th className="og-c-stat">Status</th><th>Risk</th><th>Predicted</th><th className="og-c-conf">Conf.</th></tr></thead>
                <tbody id="og-feed"></tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="og-panel og-detail" id="og-detail"></div>

        <div className="og-under">
          <a className="og-btn og-primary" href={LIVE_URL} target="_blank" rel="noopener noreferrer">Visit OrderGuard →</a>
          <a className="og-btn og-outline" href={LIVE_URL} target="_blank" rel="noopener noreferrer">Take the guided tour</a>
          <span className="og-dim">Replica console for this case study · the live app runs the full backend simulation</span>
        </div>

        <section className="og-sec og-reveal">
          <div className="og-sec-h"><span className="og-n">01</span><h2 className="og-h2">How it works</h2></div>
          <p className="og-sub">Can we spot delivery problems early enough to prevent them — and choose a response that costs less than the expected failure? OrderGuard answers it in four steps.</p>
          <div className="og-pipe">
            <div className="og-panel og-stage"><span className="og-k">simulate</span><h3>Run a marketplace</h3><p>Merchants, drivers, customers and orders, each order tracked through preparation, driver assignment, travel and its final outcome.</p><code>seed · duration · supply · demand</code></div>
            <div className="og-panel og-stage"><span className="og-k">score</span><h3>Detect risk</h3><p>Every event re-scores the order 0–100 from observable factors like merchant backlog, driver reliability, customer reachability and projected lateness.</p><code>event-reactive, not polled</code></div>
            <div className="og-panel og-stage"><span className="og-k">decide</span><h3>Price the response</h3><p>Each intervention is compared against doing nothing on expected cost: direct cost plus the residual cost of failure.</p><code>min(direct + residual)</code></div>
            <div className="og-panel og-stage"><span className="og-k">measure</span><h3>Compare strategies</h3><p>The same seeded scenario runs three ways, so outcomes and intervention spend can be compared like-for-like.</p><code>none · threshold · expected-value</code></div>
          </div>
        </section>

        <section className="og-sec og-reveal">
          <div className="og-sec-h"><span className="og-n">02</span><h2 className="og-h2">Ground truth vs. what the engine can see</h2></div>
          <p className="og-sub">The simulator decides what actually goes wrong. The risk engine has to infer it — the same way a real operations system would.</p>
          <div className="og-gt">
            <div className="og-panel og-big">
              <p>Failure hazard rates are the simulator's hidden ground truth. <span className="og-amber">The risk engine never receives these values directly</span> — it must infer risk from observable marketplace state.</p>
              <small>That separation keeps the evaluation honest: the model can't score well by peeking at the answer.</small>
              <div className="og-wall"><span>hazard rates</span><span className="og-x">✕</span><span>risk engine</span><span className="og-brk"></span><span className="og-ok">observable state</span><span className="og-arr">→</span><span>risk engine</span></div>
            </div>
            <div className="og-panel">
              <div className="og-p-head"><span className="og-l"><span className="og-lbl">Failure hazard rates</span><span className="og-badge og-synthetic">ground truth</span></span></div>
              <div className="og-scroll-x">
                <table>
                  <thead><tr><th>Hazard</th><th>Default</th><th>When it's checked</th></tr></thead>
                  <tbody>
                    <tr><td>driver_goes_offline</td><td>0.0008</td><td><span className="og-how">every tick, while delivering</span></td></tr>
                    <tr><td>merchant_stockout</td><td>0.03</td><td><span className="og-how">once, at order confirmation</span></td></tr>
                    <tr><td>customer_unreachable</td><td>0.02</td><td><span className="og-how">once, at arrival</span></td></tr>
                    <tr><td>perishable_spoilage</td><td>0.05</td><td><span className="og-how">every tick, once already late</span></td></tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>

        <section className="og-sec og-reveal" id="og-ev">
          <div className="og-sec-h"><span className="og-n">03</span><h2 className="og-h2">Expected-value reasoning</h2></div>
          <p className="og-sub">OrderGuard's engine doesn't act just because risk is high. It picks the option with the lowest total expected cost — and "do nothing" is always on the table. Drag the inputs to see the choice change.</p>
          <div className="og-ev">
            <div className="og-panel og-form">
              <div className="og-field"><label htmlFor="og-evRisk">Risk score <b id="og-evRiskV">72</b></label><input type="range" id="og-evRisk" min="0" max="100" defaultValue="72" /></div>
              <div className="og-field"><label htmlFor="og-evFail">Failure cost <b id="og-evFailV">$10.00</b></label><input type="range" id="og-evFail" min="2" max="60" defaultValue="10" /></div>
              <div className="og-field"><label>Scenario presets</label>
                <div className="og-presets">
                  <button data-r="4" data-f="10">Healthy order</button>
                  <button data-r="55" data-f="10">Borderline</button>
                  <button data-r="86" data-f="10">Likely late</button>
                  <button data-r="86" data-f="45">High-value, likely late</button>
                </div>
              </div>
              <p style={{ fontSize: "12.5px", color: "var(--dim)" }}>Intervention costs and effects in this calculator are illustrative modelling assumptions.</p>
            </div>
            <div className="og-panel">
              <div className="og-p-head"><span className="og-l"><span className="og-lbl">Recommended intervention — expected-value reasoning</span><span className="og-badge og-estimate">model estimate</span></span></div>
              <div className="og-chosen-line" id="og-evChosen"></div>
              <div className="og-ev-stats" id="og-evStats"></div>
              <div className="og-scroll-x" style={{ padding: "0 6px 8px" }}>
                <table>
                  <thead><tr><th>Intervention</th><th>Direct cost</th><th>Implied P(fail)</th><th>Est. prob. reduction</th><th>Residual cost</th><th>Total expected</th></tr></thead>
                  <tbody id="og-evTable"></tbody>
                </table>
              </div>
            </div>
          </div>
        </section>

        <section className="og-sec og-reveal">
          <div className="og-sec-h"><span className="og-n">04</span><h2 className="og-h2">One seed, three strategies</h2></div>
          <p className="og-sub">The Simulation Lab runs the same seeded marketplace three ways and reports real, measured outcomes from an actual simulation run. Nothing is precomputed.</p>
          <div className="og-strats">
            <div className="og-panel og-strat"><div className="og-k"><span className="og-lbl">Baseline</span><span className="og-badge og-synthetic">control</span></div><h3>No intervention</h3><p>Every order plays out untouched. The floor everything else is measured against.</p><code>action = do_nothing</code></div>
            <div className="og-panel og-strat"><div className="og-k"><span className="og-lbl">Naive</span><span className="og-badge og-synthetic">baseline</span></div><h3>Threshold-based</h3><p>If an order's risk score crosses a fixed trigger, act. Simple — but it spends the same way on every flagged order.</p><code>if score ≥ 50: intervene</code></div>
            <div className="og-panel og-strat og-win"><div className="og-k"><span className="og-lbl" style={{ color: "var(--blue)" }}>OrderGuard</span><span className="og-badge og-measured">engine</span></div><h3>Expected-value engine</h3><p>No fixed threshold. For each order, choose the action with the lowest direct cost plus residual expected failure cost.</p><code>argmin(direct + P(fail|a) × cost)</code></div>
          </div>
          <div className="og-panel og-lab-form">
            <div className="og-lab-top"><h3>Configure &amp; run experiment</h3><a className="og-btn og-primary" href={LIVE_URL} target="_blank" rel="noopener noreferrer">Open Simulation Lab →</a></div>
            <p style={{ fontSize: "14.5px", color: "var(--muted)", marginTop: "6px" }}>Every field maps directly to a parameter the backend simulation engine accepts.</p>
            <div className="og-lab-sec">Marketplace scale</div>
            <div className="og-lab-grid">
              <div><span>Random seed</span><b>42</b></div>
              <div><span>Duration (sim. minutes)</span><b>480</b></div>
              <div><span>Merchants</span><b>20</b></div>
              <div><span>Drivers (supply)</span><b>35</b></div>
              <div><span>Customers</span><b>300</b></div>
              <div><span>Map size (km)</span><b>10</b></div>
              <div><span>Order arrival rate (/min)</span><b>1</b></div>
              <div><span>Avg prep time (min)</span><b>12 ± 3</b></div>
            </div>
            <div className="og-lab-sec">Baseline policy</div>
            <div className="og-lab-grid"><div><span>Threshold-based trigger score</span><b>50</b></div></div>
          </div>
        </section>

        <section className="og-sec og-reveal">
          <div className="og-sec-h"><span className="og-n">05</span><h2 className="og-h2">Architecture</h2></div>
          <p className="og-sub">Simulation, explainable risk scoring, backend services, persistent data and an interactive dashboard, working together.</p>
          <div className="og-arch">
            <div className="og-panel" style={{ padding: "18px" }}>
              <svg id="og-arch" viewBox="0 0 620 360" aria-label="Architecture diagram">
                <defs><marker id="og-ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill="#5d626b" /></marker></defs>
                <path className="og-e og-f" d="M170 70 H 250" markerEnd="url(#og-ah)" /><text className="og-el" x="210" y="60" textAnchor="middle">events</text>
                <path className="og-e" d="M400 110 V 150" markerEnd="url(#og-ah)" /><text className="og-el" x="410" y="136">persist</text>
                <path className="og-e" d="M400 230 V 250" markerEnd="url(#og-ah)" />
                <path className="og-e og-f" d="M250 290 H 170" markerEnd="url(#og-ah)" /><text className="og-el" x="210" y="280" textAnchor="middle">JSON API</text>
                <g className="og-box og-on" data-k="sim"><rect x="10" y="30" width="160" height="80" rx="7" /><text x="90" y="64" textAnchor="middle">Simulation engine</text><text className="og-s" x="90" y="84" textAnchor="middle">python · seeded</text></g>
                <g className="og-box" data-k="api"><rect x="250" y="30" width="300" height="80" rx="7" /><text x="400" y="64" textAnchor="middle">Risk + intervention service</text><text className="og-s" x="400" y="84" textAnchor="middle">rules · expected value</text></g>
                <g className="og-box" data-k="db"><rect x="250" y="150" width="300" height="80" rx="7" /><text x="400" y="184" textAnchor="middle">PostgreSQL</text><text className="og-s" x="400" y="204" textAnchor="middle">sqlalchemy · alembic migrations</text></g>
                <g className="og-box" data-k="api2"><rect x="250" y="250" width="300" height="80" rx="7" /><text x="400" y="284" textAnchor="middle">FastAPI</text><text className="og-s" x="400" y="304" textAnchor="middle">runs · orders · experiments</text></g>
                <g className="og-box" data-k="ui"><rect x="10" y="250" width="160" height="80" rx="7" /><text x="90" y="284" textAnchor="middle">Dashboard</text><text className="og-s" x="90" y="304" textAnchor="middle">next.js · react · ts</text></g>
              </svg>
            </div>
            <div className="og-panel og-layers" id="og-layers">
              <button className="og-on" data-k="sim"><b>Simulation engine <i>01</i></b><small>Seeded marketplace: merchants, drivers, customers and orders moving through their lifecycle, with hidden hazard rates generating outcomes.</small></button>
              <button data-k="api"><b>Risk + intervention service <i>02</i></b><small>Re-scores an order on every event from observable state, and prices each intervention against doing nothing.</small></button>
              <button data-k="db"><b>PostgreSQL <i>03</i></b><small>Runs, orders, event timelines, risk assessments and experiment results — managed with SQLAlchemy and Alembic.</small></button>
              <button data-k="api2"><b>FastAPI <i>04</i></b><small>Endpoints serving runs, order detail and Simulation Lab experiments to the frontend.</small></button>
              <button data-k="ui"><b>Dashboard <i>05</i></b><small>Next.js, React and TypeScript: Overview, Simulation Lab and a guided tour.</small></button>
              <div className="og-chips"><span>Python 3.12</span><span>FastAPI</span><span>SQLAlchemy</span><span>Alembic</span><span>PostgreSQL</span><span>Next.js</span><span>React</span><span>TypeScript</span><span>Vercel</span></div>
            </div>
          </div>
        </section>

        <section className="og-sec og-reveal">
          <div className="og-sec-h"><span className="og-n">06</span><h2 className="og-h2">Scope &amp; limitations</h2></div>
          <p className="og-sub">A working simulation and decision-support prototype — scoped deliberately, and labelled honestly throughout the product.</p>
          <div className="og-two">
            <div className="og-panel">
              <div className="og-p-head"><span className="og-lbl">By design</span></div>
              <ul className="og-list og-in">
                <li><i>✓</i><span><b>Fully synthetic</b>All merchants, drivers, customers and orders are generated. No real platform, drivers or customers are contacted.</span></li>
                <li><i>✓</i><span><b>Explicit rules, not ML</b>Risk scoring uses transparent rules, so every score can be broken down factor by factor.</span></li>
                <li><i>✓</i><span><b>Measured vs. estimated</b>Timelines are badged <span className="og-badge og-measured" style={{ fontSize: "9.5px" }}>measured</span>; scores and recommendations are badged <span className="og-badge og-estimate" style={{ fontSize: "9.5px" }}>model estimate</span>.</span></li>
                <li><i>✓</i><span><b>Assumptions are assumptions</b>Intervention costs and effects are modelling inputs, and one simulation doesn't establish real-world effectiveness.</span></li>
              </ul>
            </div>
            <div className="og-panel">
              <div className="og-p-head"><span className="og-lbl">Out of scope</span></div>
              <ul className="og-list og-out">
                <li><i>—</i><span><b>Authentication</b>A public demo, open to anyone exploring it.</span></li>
                <li><i>—</i><span><b>Live marketplace integrations</b>No connection to a real delivery platform or dispatch system.</span></li>
                <li><i>—</i><span><b>Large-scale distributed processing</b>Built to run a city-sized simulation clearly, not millions of orders.</span></li>
              </ul>
            </div>
          </div>
        </section>

        <section className="og-sec og-reveal">
          <div className="og-sec-h"><span className="og-n">07</span><h2 className="og-h2">My role</h2></div>
          <div className="og-two">
            <div className="og-panel og-role">
              <p>I designed and built OrderGuard end to end — the marketplace simulation, the risk and expected-value engine, the FastAPI backend and PostgreSQL schema, and the Next.js dashboard on top. It's my exploration of how operations teams can make fast, defensible decisions under uncertainty.</p>
              <div className="og-who"><div className="og-av">F</div><div><b>Feyza Gulbent</b><span>Designer &amp; developer</span></div></div>
            </div>
            <div className="og-panel">
              <div className="og-p-head"><span className="og-lbl">Key decisions</span></div>
              <div className="og-scroll-x">
                <table className="og-dec"><tbody>
                  <tr><td>explainable_scores</td><td>Rules over a black box, so an operator can see why an order is flagged before acting.</td></tr>
                  <tr><td>do_nothing_is_valid</td><td>Every intervention is priced against doing nothing — the engine can say "not worth it."</td></tr>
                  <tr><td>hidden_ground_truth</td><td>The risk engine never sees hazard rates, so evaluation can't cheat.</td></tr>
                  <tr><td>seeded_runs</td><td>Same seed, same world — every strategy faces identical orders.</td></tr>
                  <tr><td>honest_labels</td><td>Measured data and model estimates are badged separately across the UI.</td></tr>
                </tbody></table>
              </div>
            </div>
          </div>
        </section>

        <div className="og-panel og-cta og-reveal">
          <div><h2>Run your own scenario.</h2><p>Open the Simulation Lab, configure a marketplace, and see when interventions improve outcomes — and when they just add cost.</p></div>
          <div className="og-btns"><a className="og-btn og-primary" href={LIVE_URL} target="_blank" rel="noopener noreferrer">Visit OrderGuard →</a><a className="og-btn og-outline" href={LIVE_URL} target="_blank" rel="noopener noreferrer">Take the guided tour</a></div>
        </div>

        <footer><span>OrderGuard · synthetic marketplace — no real company data</span><span>Case study · Feyza Gulbent</span></footer>
      </div>
    </div>
  )
}
