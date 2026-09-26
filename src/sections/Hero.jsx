import { useRef, useState } from "react"
import { Link } from "react-router-dom"
import { motion, useScroll, useTransform, useReducedMotion, useMotionValue } from "framer-motion"

const STARS = [
  { src: "star-icon1.png", left: "18%", top: "42%", duration: "7.5s", delay: "-2s" },
  { src: "star-icon2.png", left: "78%", top: "29%", duration: "9s", delay: "-5s" },
  { src: "star-icon3.png", left: "54%", top: "60%", duration: "8.2s", delay: "-3s" },
]

function DraggableStar({ star, index, boundsRef }) {
  const [dragging, setDragging] = useState(false)
  const [tilt] = useState(() => `${(Math.random() * 16 - 8).toFixed(1)}deg`)
  const reduceMotion = useReducedMotion()
  const x = useMotionValue(0)
  const y = useMotionValue(0)

  const onKeyDown = (event) => {
    const directions = { ArrowLeft: [-12, 0], ArrowRight: [12, 0], ArrowUp: [0, -12], ArrowDown: [0, 12] }
    const direction = directions[event.key]
    if (!direction) return
    event.preventDefault()
    const bounds = boundsRef.current.getBoundingClientRect()
    const rect = event.currentTarget.getBoundingClientRect()
    x.set(x.get() + Math.max(bounds.left - rect.left, Math.min(direction[0], bounds.right - rect.right)))
    y.set(y.get() + Math.max(bounds.top - rect.top, Math.min(direction[1], bounds.bottom - rect.bottom)))
  }

  return (
    <motion.button
      type="button"
      className="hero-star focus-ring"
      aria-label={`Move star ${index + 1}; drag or use arrow keys`}
      style={{ left: `min(${star.left}, calc(100% - var(--star-size) - 8px))`, top: star.top, x, y, "--star-duration": star.duration, "--star-delay": star.delay, "--star-tilt": tilt }}
      data-dragging={dragging}
      drag
      dragConstraints={boundsRef}
      dragElastic={0.08}
      dragTransition={{ bounceStiffness: 160, bounceDamping: 20, timeConstant: 180, power: 0.12 }}
      onDragStart={() => setDragging(true)}
      onDragEnd={() => setDragging(false)}
      onPointerCancel={() => setDragging(false)}
      onKeyDown={onKeyDown}
    >
      <motion.span className="hero-star-hover" whileHover={{ scale: reduceMotion ? 1 : 1.06 }} transition={{ type: "spring", stiffness: 220, damping: 20 }}>
        <img className="hero-star-image" src={`/hero/${star.src}`} alt="" draggable={false} />
      </motion.span>
    </motion.button>
  )
}

// Crop single leaves from the existing sheet without modifying the source asset.
const LEAVES = [
  [3, 8, 17, -3, 5, 300, 150, 120, 130],
  [9, 15, 21, -12, 7, 570, 85, 165, 150],
  [15, 6, 14, -7, -3, 120, 330, 80, 75],
  [21, 19, 24, -18, 8, 380, 425, 165, 125],
  [27, 11, 19, -9, -5, 620, 440, 80, 60],
  [29, 4, 22, -15, 14, 810, 635, 95, 70],
]

function FallingLeavesLayer() {
  return (
    <div className="hero-leaves" aria-hidden="true">
      {LEAVES.map(([x, y, duration, delay, drift, sx, sy, sw, sh], i) => (
        <div key={i} className="hero-leaf-track" style={{
          left: `${x}%`, top: `${y}%`, height: `${110 - y}%`,
          "--fall-duration": `${duration}s`, "--fall-delay": `${delay}s`,
          "--drift": `${drift}vw`, "--turn": `${i % 2 ? -45 : 55}deg`,
        }}>
          <svg className="hero-leaf" viewBox={`${sx} ${sy} ${sw} ${sh}`}>
            <image href="/hero/falling-leaves.png" width="1536" height="1024" />
          </svg>
        </div>
      ))}
    </div>
  )
}

export default function Hero() {
  const reduceMotion = useReducedMotion()
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] })

  const contentOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0])
  const contentY = useTransform(scrollYProgress, [0, 1], [0, 60])

  return (
    <section
      id="hero"
      ref={ref}
      className="hero relative w-full"
    >
      <span className="hero-nav-region" aria-hidden="true" />
      <div className="hero-art" aria-hidden="true">
        <svg className="hero-sky-extension" viewBox="850 0 450 260" preserveAspectRatio="xMidYMid slice">
          <image href="/hero/sky-bg.png" width="1672" height="941" />
        </svg>
        <div className="hero-scene">
          <img src="/hero/sky-bg.png" alt="" className="hero-background" />
          <div className="hero-bird-path">
            <img src="/hero/bird-1.png" alt="" className="hero-bird" />
          </div>
          {/* This lane is entirely below the shoreline and right of the hill. */}
          <div className="hero-boat-lane">
            <div className="hero-boat-crossing">
              <img src="/hero/sailboat-1.png" alt="" className="hero-boat" />
            </div>
          </div>
          <FallingLeavesLayer />
          <img src="/hero/foreground-grass.png" alt="" className="hero-foreground hero-foreground-left" />
          <img src="/hero/foreground-grass.png" alt="" className="hero-foreground hero-foreground-right" />
        </div>
      </div>

      {STARS.map((star, index) => (
        <DraggableStar key={star.src} star={star} index={index} boundsRef={ref} />
      ))}

      {/* content */}
      <motion.div
        style={{ opacity: reduceMotion ? 1 : contentOpacity, y: reduceMotion ? 0 : contentY }}
        className="hero-content relative z-[5] mx-auto flex w-full max-w-3xl flex-col items-center px-6 text-center"
      >
        <motion.h1
          initial={reduceMotion ? false : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="hero-title"
        >
          <img src="/hero/hi-im-feyza.png" alt="Hi, I'm Feyza." width="2172" height="724" />
        </motion.h1>
        <motion.p
          initial={reduceMotion ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="hero-supporting-copy mt-4 text-ink-soft"
        >
          I'm a product designer, builder &amp; creative.
        </motion.p>
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.32 }}
          className="flex flex-col items-center"
        >
          <Link
            to="/work"
            className="focus-ring group mt-6 inline-flex items-center gap-3 rounded-full bg-ink px-12 py-6 text-xl font-semibold text-white shadow-soft transition-transform hover:-translate-y-0.5 hover:shadow-lift active:translate-y-0"
          >
            See my work
            <motion.span
              aria-hidden="true"
              className="inline-block"
              animate={{ x: reduceMotion ? 0 : [0, 4, 0] }}
              transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
            >
              →
            </motion.span>
          </Link>
          <a
            href="https://www.linkedin.com/in/feyzanur-g"
            target="_blank"
            rel="noopener noreferrer"
            className="focus-ring group mt-5 inline-flex items-center gap-2.5 rounded-full border-2 border-ink/15 px-8 py-4 text-base font-semibold text-ink transition-colors hover:bg-mint-100"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="shrink-0">
              <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.02-3.04-1.85-3.04-1.86 0-2.15 1.45-2.15 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.11 20.45H3.56V9h3.55v11.45z" />
            </svg>
            Connect on LinkedIn
          </a>
        </motion.div>
      </motion.div>
    </section>
  )
}
