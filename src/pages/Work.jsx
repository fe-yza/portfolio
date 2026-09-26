import { useEffect } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { Link, useNavigate, useParams } from "react-router-dom"
import { getProject, projects } from "../data/projects"
import ProjectThumb from "../components/ProjectThumb"
import CaseStudyModal from "../components/CaseStudyModal"
import Footer from "../components/Footer"

export default function Work() {
  const { id } = useParams()
  const navigate = useNavigate()
  const activeProject = id ? getProject(id) : null

  useEffect(() => {
    if (activeProject?.route) navigate(activeProject.route, { replace: true })
  }, [activeProject, navigate])

  return (
    <main className="pb-20 pt-28 sm:pt-32">
      <div className="mx-auto max-w-6xl px-6 sm:px-8">
        <p className="font-script text-3xl text-sky-600">see my work</p>
        <h1 className="mt-2 text-3xl font-semibold text-ink sm:text-4xl">
          See what I've been up to
        </h1>
        <p className="mt-3 max-w-lg text-ink-soft">
          Community, coding, and product
        </p>
      </div>

      <div className="mx-auto mt-12 grid max-w-6xl grid-cols-1 gap-8 px-6 sm:grid-cols-2 sm:px-8">
        {projects.map((project, i) => (
          <motion.button
            key={project.id}
            type="button"
            layoutId={`card-${project.id}`}
            onClick={() => navigate(project.route ?? `/work/${project.id}`)}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5, delay: i * 0.06 }}
            whileHover={{ y: -6 }}
            className="focus-ring group text-left"
          >
            <div className="relative">
              <motion.div layoutId={`image-${project.id}`}>
                <ProjectThumb
                  project={project}
                  className="aspect-[4/3] w-full shadow-soft transition-shadow group-hover:shadow-lift"
                />
              </motion.div>
              {project.category && (
                <span className="pointer-events-none absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-ink-soft shadow-soft">
                  {project.category}
                </span>
              )}
            </div>
            <div className="mt-4 flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-mint-600">
                  {project.type}
                </p>
                <h3 className="mt-1 text-lg font-semibold text-ink">
                  {project.title}
                </h3>
              </div>
              <span className="shrink-0 rounded-full border border-ink/15 px-3 py-1 text-xs font-semibold text-ink-soft transition-colors group-hover:bg-mint-100">
                See more
              </span>
            </div>
            <p className="mt-2 text-sm text-ink-soft">{project.summary}</p>
          </motion.button>
        ))}
      </div>

      <div className="mx-auto mt-16 max-w-6xl px-6 sm:px-8">
        <Link to="/" className="focus-ring font-script text-xl text-mint-600 hover:text-mint-700">
          ← back home
        </Link>
      </div>

      <Footer />

      <AnimatePresence>
        {activeProject && !activeProject.route && (
          <CaseStudyModal project={activeProject} onClose={() => navigate("/work")} />
        )}
      </AnimatePresence>
    </main>
  )
}
