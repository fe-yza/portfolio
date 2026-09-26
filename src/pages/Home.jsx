import { useEffect } from "react"
import { useLocation } from "react-router-dom"
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
