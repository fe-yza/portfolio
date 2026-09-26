import { useState } from "react"
import { motion, useReducedMotion } from "framer-motion"
import { figures, FIRST_CLICK_MESSAGE, MAX_TRIES } from "../data/findFeyzaFigures"

function FigureHotspot({ figure, isRevealed, onSelect }) {
  const reduceMotion = useReducedMotion()
  const { desktop, mobile, viewport } = figure
  return (
    <div
      className="park-figure"
      style={{
        "--figure-width": `${desktop.w}%`, "--figure-x": `${desktop.x}%`, "--figure-y": `${desktop.y}%`,
        "--mobile-width": `${mobile.w}%`, "--mobile-x": `${mobile.x}%`, "--mobile-y": `${mobile.y}%`,
      }}
    >
      <motion.button
        type="button"
        className="park-figure-trigger focus-ring"
        style={{ transformOrigin: "50% 85%" }}
        whileHover={reduceMotion ? undefined : { scale: 1.03, y: -2 }}
        whileTap={reduceMotion ? undefined : { scale: 0.99 }}
        transition={reduceMotion ? { duration: 0 } : { type: "spring", stiffness: 280, damping: 24 }}
        onClick={() => onSelect(figure)}
        aria-label={`Explore ${figure.id}`}
        aria-expanded={isRevealed}
        aria-controls={`park-description-${figure.id}`}
      >
        <svg viewBox={viewport.join(" ")} className="block h-auto w-full" aria-hidden="true">
          <image href={`/hero/${figure.id}-figure.png`} width="1672" height="941" />
        </svg>
      </motion.button>
      <div id={`park-description-${figure.id}`} className="park-figure-caption" aria-live="polite">
        {isRevealed && (
          <motion.p
            initial={reduceMotion ? false : { opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.2 }}
          >
            {figure.caption}
          </motion.p>
        )}
      </div>
    </div>
  )
}

export default function FindFeyza() {
  const [exploredActivities, setExploredActivities] = useState(() => new Set())
  const hasRevealed = exploredActivities.size > 0

  const handleSelect = (figure) => {
    setExploredActivities((previous) => new Set(previous).add(figure.id))
  }
  const remaining = Math.min(MAX_TRIES, figures.length - exploredActivities.size)

  return (
    <section id="play" className="relative overflow-hidden bg-mint-50 py-12 sm:py-16">
      <div className="mx-auto max-w-6xl px-6 sm:px-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <h2 className="font-script max-w-xl text-3xl leading-tight text-ink sm:text-4xl">
            Can you tell which one of these I love doing?
          </h2>
          <div className="shrink-0 rounded-full border border-ink/10 bg-white/90 px-4 py-2 text-sm font-semibold text-ink shadow-soft" role="status">
            {remaining === 0 ? `you found all ${figures.length} :)` : `you have ${remaining}/${MAX_TRIES} tries`}
          </div>
        </div>
        <div className="mt-3 min-h-8 max-w-xl" aria-live="polite" aria-atomic="true">
          {hasRevealed && <p className="font-script text-2xl text-ink">{FIRST_CLICK_MESSAGE}</p>}
        </div>
      </div>
      <div className="park-composition relative mx-auto mt-4 w-full max-w-6xl px-4 sm:px-8">
        <div className="park-scene relative w-full">
          <div className="absolute inset-0 overflow-hidden rounded-[2rem] shadow-soft" aria-hidden="true">
            <img src="/hero/grass-bg.png" alt="" className="pointer-events-none absolute inset-0 h-full w-full object-cover" />
            <img src="/hero/leaves-shadow.png" alt="" className="park-leaf-shadow pointer-events-none absolute inset-0 h-full w-full object-cover" />
          </div>
          {figures.map((figure) => (
            <FigureHotspot key={figure.id} figure={figure} isRevealed={exploredActivities.has(figure.id)} onSelect={handleSelect} />
          ))}
        </div>
      </div>
    </section>
  )
}
