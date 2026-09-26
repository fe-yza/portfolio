import { useEffect, useRef, useState } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import PlaceholderImage from "../components/PlaceholderImage"
import { photos } from "../data/photos"
import "./CameraRoll.css"

function FilmCanister() {
  return (
    <svg width="52" height="64" viewBox="0 0 52 64" aria-hidden="true" className="shrink-0">
      <rect x="4" y="14" width="44" height="46" rx="6" fill="#5fae85" />
      <rect x="4" y="14" width="44" height="14" rx="6" fill="#82c7a3" />
      <rect x="16" y="2" width="20" height="14" rx="3" fill="#357354" />
      <circle cx="26" cy="40" r="10" fill="#f4faf6" />
      <circle cx="26" cy="40" r="3" fill="#357354" />
    </svg>
  )
}

function FilmFrame({ photo, index, activePhoto, onToggleCaption }) {
  const tape = index % 3 === 0
  const hasCaption = Boolean(photo.caption)
  const captionId = `${photo.id}-caption`
  return (
    <motion.figure
      whileHover={{ y: -8, rotate: 0 }}
      transition={{ type: "spring", stiffness: 260, damping: 18 }}
      className="film-frame relative w-52 shrink-0 rotate-[var(--tilt)] rounded-lg border border-ink/10 bg-white p-3 pb-5 shadow-soft sm:w-60"
      data-caption-open={activePhoto === photo.id}
      style={{ "--tilt": `${(index % 2 === 0 ? -1 : 1) * (2 + (index % 3))}deg` }}
    >
      {tape && (
        <span className="tape absolute -top-3 left-1/2 h-5 w-14 -translate-x-1/2 -rotate-2" aria-hidden="true" />
      )}
      <button
        type="button"
        className="film-photo focus-ring block w-full border-0 bg-transparent p-0"
        disabled={!hasCaption}
        aria-describedby={hasCaption ? captionId : undefined}
        onClick={() => onToggleCaption(photo.id)}
      >
        {photo.src ? (
          <img
            src={photo.src}
            alt={photo.alt}
            loading="lazy"
            decoding="async"
            className="aspect-square w-full rounded object-cover"
          />
        ) : <PlaceholderImage
          tag={photo.tag}
          variant={index % 2 === 0 ? "mint" : "sky"}
          rounded="rounded"
          className="aspect-square w-full"
        />}
      </button>
      <figcaption className="film-caption-slot relative mt-3 h-7 text-center">
        {hasCaption && (
          <span id={captionId} className="film-caption font-script text-ink-soft">
            {photo.caption}
          </span>
        )}
      </figcaption>
    </motion.figure>
  )
}

export default function CameraRoll() {
  const sectionRef = useRef(null)
  const trackRef = useRef(null)
  const [isMobile, setIsMobile] = useState(false)
  const [trackWidth, setTrackWidth] = useState(0)
  const [activePhoto, setActivePhoto] = useState(null)

  const toggleCaption = (id) => setActivePhoto((current) => current === id ? null : id)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener("resize", check)
    return () => window.removeEventListener("resize", check)
  }, [])

  useEffect(() => {
    const measure = () => {
      if (trackRef.current) setTrackWidth(trackRef.current.scrollWidth)
    }
    measure()
    window.addEventListener("resize", measure)
    return () => window.removeEventListener("resize", measure)
  }, [isMobile])

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  })

  const viewportWidth = typeof window !== "undefined" ? window.innerWidth : 1440
  const x = useTransform(
    scrollYProgress,
    [0, 1],
    [0, -(Math.max(trackWidth - viewportWidth + 160, 0))]
  )

  const heading = (
    <div className="mx-auto max-w-6xl px-6 sm:px-8">
      <p className="font-script text-3xl text-sky-600">get to know me</p>
      <h2 className="mt-2 text-2xl font-semibold text-ink sm:text-3xl">
        A little bit of my world
      </h2>
      <p className="mt-3 max-w-md text-sm text-ink-soft">
        A scrapbook camera roll — swap in the real photos any time.
      </p>
    </div>
  )

  if (isMobile) {
    return (
      <section id="camera-roll" className="bg-white py-24">
        {heading}
        <div className="sprocket-row mt-10 h-3 w-full" />
        <div className="flex gap-5 overflow-x-auto px-6 py-8 [scroll-snap-type:x_mandatory]">
          {photos.map((photo, i) => (
            <div key={photo.id} className="[scroll-snap-align:center]">
              <FilmFrame photo={photo} index={i} activePhoto={activePhoto} onToggleCaption={toggleCaption} />
            </div>
          ))}
        </div>
        <div className="sprocket-row h-3 w-full" />
      </section>
    )
  }

  return (
    <section id="camera-roll" ref={sectionRef} className="relative bg-white" style={{ height: "300vh" }}>
      <div className="sticky top-0 flex h-screen flex-col justify-center overflow-hidden py-16">
        {heading}
        <div className="sprocket-row mt-10 h-3 w-full" />
        <div className="flex-1 overflow-hidden">
          <motion.div
            ref={trackRef}
            style={{ x }}
            className="flex h-full items-center gap-6 pl-[8vw] pr-[20vw]"
          >
            <FilmCanister />
            {photos.map((photo, i) => (
              <FilmFrame key={photo.id} photo={photo} index={i} activePhoto={activePhoto} onToggleCaption={toggleCaption} />
            ))}
            <span className="font-script whitespace-nowrap pl-6 text-2xl text-mint-600">
              that&apos;s a wrap ✂
            </span>
          </motion.div>
        </div>
        <div className="sprocket-row h-3 w-full" />
      </div>
    </section>
  )
}
