import { projects } from "../data/projects"

export default function ProjectNavigation({ current }) {
  const caseStudies = projects.filter((project) => project.route)
  const index = caseStudies.findIndex((project) => project.route === current)
  const previous = caseStudies[(index - 1 + caseStudies.length) % caseStudies.length]
  const next = caseStudies[(index + 1) % caseStudies.length]
  return (
    <nav className="project-navigation" aria-label="More projects">
      <a href={previous.route}><span>← Previous</span><b>{previous.title}</b></a>
      <a href={next.route}><span>Next →</span><b>{next.title}</b></a>
    </nav>
  )
}
