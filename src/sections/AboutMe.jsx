import { motion } from "framer-motion"

export default function AboutMe() {
  return (
    <section id="about" className="paper-texture relative py-24 sm:py-32">
      <div className="mx-auto grid max-w-5xl grid-cols-1 items-center gap-12 px-6 sm:px-8 md:grid-cols-[0.85fr_1.15fr]">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.7 }}
        >
          <img
            src="/hero/about-me-pic.jpg"
            alt="Feyza"
            loading="lazy"
            className="aspect-[4/5] w-full max-w-sm rounded-2xl object-cover shadow-soft"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.7, delay: 0.1 }}
        >
          <p className="font-script text-3xl text-sky-600">a page about me</p>
          <h2 className="mt-2 text-2xl font-semibold text-ink sm:text-3xl">
            About Feyza
          </h2>
          <p className="mt-5 text-base leading-relaxed text-ink-soft">
            I’ve always been somewhere between <strong>creative and technical</strong>.
            I grew up making art, eventually found my way into design, and somewhere
            along the way realized I really like building the things I design, too.
            Now I spend a lot of my time coding side projects, designing, organizing
            builder events, and building my own audience online!
          </p>
          <p className="mt-4 text-base leading-relaxed text-ink-soft">
            I like being able to sketch out a flow in the morning and have it running
            in the browser by night. I’ve found that writing the code makes me a
            better designer because I understand what a decision actually costs to
            build. Lately, I’ve been pushing myself to build more from scratch,
            working with APIs, databases, authentication, AI, and all the less-pretty
            parts that turn an interface into an actual product. <strong>I want to
            keep growing in tech, take on things I don’t fully know how to do yet,
            and become someone who can move comfortably between designing a product
            and actually building it.</strong>
          </p>

        </motion.div>
      </div>
    </section>
  )
}
