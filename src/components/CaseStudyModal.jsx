import { useEffect } from "react"
import { motion } from "framer-motion"
import PlaceholderImage from "./PlaceholderImage"
import ProjectThumb from "./ProjectThumb"

const BLOCKS = [
  { key: "problem", label: "Problem" },
  { key: "process", label: "Process" },
  { key: "myRole", label: "My Role" },
  { key: "outcome", label: "Outcome" },
]

export default function CaseStudyModal({ project, onClose }) {
  useEffect(() => {
    document.body.style.overflow = "hidden"
    const onKey = (e) => e.key === "Escape" && onClose()
    window.addEventListener("keydown", onKey)
    return () => {
      document.body.style.overflow = ""
      window.removeEventListener("keydown", onKey)
    }
  }, [onClose])

  return (
    <div className="fixed inset-0 z-[60] overflow-y-auto">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-ink/40 backdrop-blur-sm"
        aria-hidden="true"
      />

      <div className="relative flex min-h-full items-start justify-center px-4 py-10 sm:px-6">
        <motion.div
          layoutId={`card-${project.id}`}
          transition={{ type: "spring", stiffness: 220, damping: 26 }}
          className="relative w-full max-w-3xl rounded-3xl bg-white p-6 shadow-lift sm:p-10"
          role="dialog"
          aria-modal="true"
        >
          <button
            type="button"
            onClick={onClose}
            className="focus-ring absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-full border border-ink/10 text-ink-soft transition-colors hover:bg-mint-100 hover:text-ink"
            aria-label="Close case study"
          >
            ✕
          </button>

          <motion.div layoutId={`image-${project.id}`}>
            <ProjectThumb project={project} className="aspect-[16/9] w-full" />
          </motion.div>

          <div className="mt-6 flex flex-wrap items-center gap-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-mint-600">
              {project.type}
            </p>
            {project.category && (
              <span className="rounded-full border border-ink/15 px-3 py-1 text-xs font-semibold text-ink-soft">
                {project.category}
              </span>
            )}
          </div>
          <h2 className="mt-1 text-2xl font-semibold text-ink sm:text-3xl">
            {project.title}
          </h2>
          <p className="mt-2 text-ink-soft">{project.summary}</p>

          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
            {BLOCKS.map((block, i) => (
              <motion.div
                key={block.key}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.06 }}
                className="rounded-2xl border border-ink/10 p-5"
              >
                <h3 className="font-script text-2xl text-sky-600">{block.label}</h3>
                {Array.isArray(project[block.key]) ? (
                  <ul className="mt-2 list-disc space-y-1.5 pl-4 text-sm leading-relaxed text-ink-soft">
                    {project[block.key].map((point) => (
                      <li key={point}>{point}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                    {project[block.key]}
                  </p>
                )}
                {!project.screens && (
                  <PlaceholderImage
                    tag={`[${project.tag.slice(1, -1)}_${block.key.toUpperCase()}]`}
                    variant={i % 2 === 0 ? "mint" : "sky"}
                    className="mt-4 aspect-video w-full"
                  />
                )}
              </motion.div>
            ))}
          </div>

          {project.screens && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + BLOCKS.length * 0.06 }}
              className="mt-6 rounded-2xl border border-ink/10 p-5"
            >
              <h3 className="font-script text-2xl text-sky-600">The Flow</h3>
              <p className="mt-1 text-sm text-ink-soft">
                Setup → home → configure → focus → completion.
              </p>
              <div className="mt-4 flex gap-4 overflow-x-auto pb-2">
                {project.screens.map((screen) => (
                  <img
                    key={screen.src}
                    src={screen.src}
                    alt={screen.alt}
                    className="h-72 w-auto shrink-0 rounded-2xl shadow-soft"
                  />
                ))}
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  )
}
