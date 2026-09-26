import { useEffect } from "react"
import { Link, useLocation } from "react-router-dom"
import HeroBrushDivider from "../components/HeroBrushDivider"
import Hero from "../sections/Hero"
import AboutMe from "../sections/AboutMe"
import Experience from "../sections/Experience"
import CreativeFolder from "../sections/CreativeFolder"
import FindFeyza from "../sections/FindFeyza"
import CameraRoll from "../sections/CameraRoll"
import BrushDivider from "../components/BrushDivider"
import Footer from "../components/Footer"

export default function Home() {
  const { hash } = useLocation()

  useEffect(() => {
    if (!hash) return
    const id = hash.replace("#", "")
    const el = document.getElementById(id)
    if (el) {
      requestAnimationFrame(() => el.scrollIntoView({ behavior: "smooth" }))
    }
  }, [hash])

  return (
    <main>
      <Hero />
      <HeroBrushDivider />
      <AboutMe />
      <BrushDivider variant={1} flip />
      <section className="bg-white px-6 py-14 text-center sm:px-8">
        <h2 className="font-script text-3xl text-ink sm:text-4xl">Take a closer look at my projects</h2>
        <p className="mt-3 text-ink-soft">Explore the ideas, decisions, and details behind my work.</p>
        <Link to="/work" className="focus-ring mt-6 inline-flex items-center gap-3 rounded-full bg-ink px-6 py-3 font-semibold text-white transition-opacity hover:opacity-80">View my work <span aria-hidden="true">→</span></Link>
      </section>
      <Experience />
      <CreativeFolder />
      <BrushDivider variant={2} />
      <FindFeyza />
      <BrushDivider variant={0} flip />
      <CameraRoll />
      <Footer />
    </main>
  )
}
