import { motion } from "framer-motion"
import { Link } from "react-router-dom"
import { experience, skills } from "../data/experience"

function ExperienceCard({ item }) {
  const isExternal = item.link?.startsWith("http")
  const className = `rounded-2xl border bg-white p-5 shadow-soft ${
    item.upcoming ? "border-dashed border-mint-400" : "border-ink/10"
  } ${item.link ? "focus-ring group block transition-all hover:-translate-y-0.5 hover:shadow-lift" : ""}`

  const content = (
    <>
      <p className="text-xs font-semibold uppercase tracking-wide text-ink-soft">
        {item.dates}
      </p>
      {item.upcoming && (
        <span className="mt-2 inline-block rounded-full bg-mint-50 px-2 py-1 text-xs font-semibold text-mint-700">
          Upcoming
        </span>
      )}
      <h3 className="mt-1 text-lg font-semibold text-ink">
        {item.role}
        {item.link && (
          <span className="ml-2 inline-block text-sm font-semibold text-ink-soft transition-transform group-hover:translate-x-1">
            →
          </span>
        )}
      </h3>
      {item.company && (
        <p className={`text-sm font-medium ${item.variant === "mint" ? "text-mint-600" : "text-sky-600"}`}>
          {item.company}
        </p>
      )}
      {item.highlights?.length > 0 && (
        <ul className="mt-4 list-disc space-y-2 pl-4 text-sm leading-relaxed text-ink-soft">
          {item.highlights.map((highlight) => <li key={highlight}>{highlight}</li>)}
        </ul>
      )}
      {item.link && (
        <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-sky-600">
          {item.linkLabel ?? "See in more detail"}
        </p>
      )}
    </>
  )

  if (isExternal) {
    return (
      <a href={item.link} target="_blank" rel="noopener noreferrer" className={className}>
        {content}
      </a>
    )
  }
  if (item.link) {
    return <Link to={item.link} className={className}>{content}</Link>
  }
  return <div className={className}>{content}</div>
}

function Timeline({ items }) {
  return (
    <div className="relative mt-8">
      <div className="absolute left-[5px] top-2 bottom-2 w-0.5 bg-mint-200 sm:left-[7px]" />
      <div className="flex flex-col gap-10">
        {items.map((item, i) => (
          <motion.article
            key={item.id}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5, delay: i * 0.06 }}
            className="relative pl-8 sm:pl-10"
          >
            <div
              className={`absolute left-0 top-2 z-10 h-3 w-3 rounded-full ring-4 ring-white ${
                item.variant === "mint" ? "bg-mint-400" : "bg-sky-400"
              }`}
            />
            <ExperienceCard item={item} />
          </motion.article>
        ))}
      </div>
    </div>
  )
}

export default function Experience() {
  const workItems = experience.filter((item) => item.category === "work")
  const educationItems = experience.filter((item) => item.category === "education")

  return (
    <section id="experience" className="relative bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-6 sm:px-8">
        <p className="font-script text-3xl text-mint-600">where I&apos;ve been</p>
        <h2 className="mt-2 text-2xl font-semibold text-ink sm:text-3xl">
          Experience
        </h2>
        <p className="mt-3 max-w-md text-sm text-ink-soft">
          A look through my journey, from what’s next to where I started.
        </p>

        <div className="mt-4 grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <h3 className="font-script text-2xl text-sky-600">work</h3>
            <Timeline items={workItems} />
          </div>

          <div>
            <h3 className="font-script text-2xl text-sky-600">education</h3>
            <Timeline items={educationItems} />

            <div className="mt-12">
              <h3 className="font-script text-2xl text-sky-600">skills</h3>
              <div className="mt-6 flex flex-wrap gap-2">
                {skills.map((skill) => (
                  <span
                    key={skill}
                    className="rounded-full border border-ink/10 bg-mint-50 px-3 py-1.5 text-sm font-medium text-ink-soft"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
