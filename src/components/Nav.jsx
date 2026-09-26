import { useEffect, useRef, useState } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { motion } from "framer-motion"

const LINKS = [
  { label: "Work", to: "/work" },
  { label: "About", to: "/#about" },
  { label: "Experience", to: "/#experience" },
  { label: "Play", to: "/#play" },
]

// Routes with their own dark, self-contained visual system where the
// transparent nav needs light text regardless of scroll position.
const FORCE_LIGHT_NAV_ROUTES = ["/work/focusup", "/work/bco"]

export default function Nav() {
  const [overHero, setOverHero] = useState(() => window.location.pathname === "/")
  const navRef = useRef(null)
  const [open, setOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const forceLightNav = FORCE_LIGHT_NAV_ROUTES.includes(location.pathname)

  useEffect(() => {
    if (forceLightNav) return
    const hero = document.querySelector(".hero-nav-region")
    const nav = navRef.current
    if (!hero || !nav) {
      setOverHero(false)
      return
    }
    let observer
    const observe = () => {
      observer?.disconnect()
      // Observe a 1px horizontal band through the actual navigation row.
      const band = Math.round(nav.getBoundingClientRect().height / 2)
      const rect = hero.getBoundingClientRect()
      setOverHero(rect.top <= band && rect.bottom > band)
      observer = new IntersectionObserver(([entry]) => {
        setOverHero(entry.isIntersecting)
      }, { rootMargin: `-${band}px 0px -${Math.max(0, window.innerHeight - band - 1)}px 0px`, threshold: 0 })
      observer.observe(hero)
    }
    observe()
    const resizeObserver = new ResizeObserver(observe)
    resizeObserver.observe(nav)
    window.addEventListener("resize", observe)
    return () => {
      observer?.disconnect()
      resizeObserver.disconnect()
      window.removeEventListener("resize", observe)
    }
  }, [location.pathname, forceLightNav])

  const handleNav = (to) => (e) => {
    setOpen(false)
    if (to.startsWith("/#")) {
      const id = to.slice(2)
      if (location.pathname === "/") {
        e.preventDefault()
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth" })
      } else {
        navigate(to)
      }
    }
  }

  return (
    <header
      className="site-nav fixed inset-x-0 top-0 z-50"
      data-over-hero={forceLightNav || overHero}
    >
      <nav ref={navRef} className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 sm:px-8">
        <Link
          to="/"
          className="focus-ring font-script text-2xl transition-transform hover:-rotate-1"
          onClick={() => setOpen(false)}
        >
          feyza gulbent
        </Link>

        <ul className="hidden items-center gap-1 sm:flex">
          {LINKS.map((link) => (
            <li key={link.label}>
              <Link
                to={link.to}
                onClick={handleNav(link.to)}
                className="focus-ring relative rounded-full px-4 py-2 text-sm font-semibold hover:opacity-75"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <button
          type="button"
          className="focus-ring flex h-9 w-9 flex-col items-center justify-center gap-1.5 rounded-full sm:hidden"
          onClick={() => setOpen((o) => !o)}
          aria-label="Toggle menu"
          aria-expanded={open}
        >
          <motion.span
            className="h-0.5 w-5 bg-current"
            animate={open ? { rotate: 45, y: 4 } : { rotate: 0, y: 0 }}
          />
          <motion.span
            className="h-0.5 w-5 bg-current"
            animate={open ? { rotate: -45, y: -4 } : { rotate: 0, y: 0 }}
          />
        </button>
      </nav>

      {open && (
        <motion.ul
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="flex flex-col gap-1 px-5 pb-4 sm:hidden"
        >
          {LINKS.map((link) => (
            <li key={link.label}>
              <Link
                to={link.to}
                onClick={handleNav(link.to)}
                className="focus-ring block rounded-xl px-4 py-3 text-base font-semibold hover:opacity-75"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </motion.ul>
      )}
    </header>
  )
}
