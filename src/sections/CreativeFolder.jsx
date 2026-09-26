import { useRef, useState } from "react"
import { photographyPhotos } from "../data/photography"
import { artSlides } from "../data/art"

const PHOTOS_PER_PAGE = 2
const TILTS = [-3, 2.5]

export default function CreativeFolder() {
  const [page, setPage] = useState(null)
  const [photoPage, setPhotoPage] = useState(0)
  const lastChoice = useRef(null)
  const backButton = useRef(null)

  function openFolder(category, button) {
    lastChoice.current = button
    setPage(category)
    requestAnimationFrame(() => backButton.current?.focus({ preventScroll: true }))
  }

  function goBack() {
    const category = lastChoice.current
    setPage(null)
    setPhotoPage(0)
    requestAnimationFrame(() => document.getElementById(category)?.focus({ preventScroll: true }))
  }

  const slides = page === "Art"
    ? artSlides
    : Array.from({ length: Math.ceil(photographyPhotos.length / PHOTOS_PER_PAGE) }, (_, i) =>
      photographyPhotos.slice(i * PHOTOS_PER_PAGE, (i + 1) * PHOTOS_PER_PAGE)
    )
  const pageCount = slides.length
  const visiblePhotos = slides[photoPage]

  return (
    <section id="creative-work" className="paper-texture relative px-2 py-12 sm:px-8 sm:py-20" aria-label="Creative portfolio">
      <div className="relative mx-auto max-w-6xl">
        <img
          src="/hero/yellow-folder.PNG"
          alt=""
          width="1670"
          height="942"
          className="block h-auto w-full"
          style={{ visibility: page ? "hidden" : "visible" }}
        />
        {/* Match the artwork bounds, since the PNGs have different transparent margins.
            Keep both loaded and use the cover to reserve the same space on every page. */}
        <img
          src="/hero/empty-folder-portfolio.PNG"
          alt=""
          width="1672"
          height="941"
          className="absolute max-w-none"
          style={{
            left: "1.2534%",
            top: "0.986%",
            width: "96.7072%",
            height: "98.3435%",
            visibility: page ? "visible" : "hidden",
          }}
        />
        <h2 className="sr-only" aria-live="polite">
          {page ? `${page} portfolio` : "Wanna see some of my creative work?"}
        </h2>
        {page ? (
          <>
            <button
              ref={backButton}
              type="button"
              onClick={goBack}
              aria-label="Back to Art and Photography"
              className="focus-ring absolute left-[25%] top-[17%] flex min-h-11 min-w-11 cursor-pointer items-center justify-center rounded-full text-3xl text-red-700 hover:bg-white/30 sm:text-5xl"
            >
              <span aria-hidden="true">←</span>
            </button>
            {(page === "Photography" || page === "Art") && (
              <div className="absolute left-[27%] right-[8%] top-[24%] bottom-[6%] flex flex-col">
                <div className="flex min-h-0 flex-1 items-center justify-center gap-[4%] overflow-hidden">
                  {visiblePhotos.map((photo, i) => page === "Art" ? (
                    <figure
                      key={photo.id}
                      className={`flex h-[94%] min-h-0 min-w-0 flex-col items-center justify-center ${visiblePhotos.length === 1 ? "w-[90%]" : "w-[44%]"}`}
                    >
                      {photo.href ? (
                        <a
                          href={photo.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`${photo.alt} — watch the time lapse (opens in a new tab)`}
                          className="focus-ring flex min-h-0 w-full flex-1 items-center justify-center rounded-md"
                        >
                          <img src={photo.src} alt={photo.alt} loading="lazy" decoding="async" className="max-h-full max-w-full rounded-sm object-contain shadow-lift" />
                        </a>
                      ) : (
                        <div className="flex min-h-0 w-full flex-1 items-center justify-center">
                          <img src={photo.src} alt={photo.alt} loading="lazy" decoding="async" className="max-h-full max-w-full rounded-sm object-contain shadow-lift" />
                        </div>
                      )}
                      {photo.caption && (
                        <figcaption className="mt-1 shrink-0 text-center text-[clamp(8px,1.2vw,14px)] leading-tight text-ink sm:mt-2">
                          {photo.caption}
                        </figcaption>
                      )}
                    </figure>
                  ) : (
                    <img
                      key={photo.id}
                      src={photo.src}
                      alt={photo.alt}
                      loading="lazy"
                      decoding="async"
                      className="aspect-[3/4] max-h-[90%] w-[42%] min-w-0 max-w-[320px] rounded-md border-2 border-white bg-white object-cover shadow-lift"
                      style={{ transform: `rotate(${TILTS[i % TILTS.length]}deg)` }}
                    />
                  ))}
                </div>
                {pageCount > 1 && (
                  <div className="mt-2 flex items-center justify-center gap-3 sm:mt-4">
                    <button
                      type="button"
                      onClick={() => setPhotoPage((p) => (p - 1 + pageCount) % pageCount)}
                      aria-label={`Previous ${page === "Art" ? "artworks" : "photos"}`}
                      className="focus-ring flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-full bg-white/70 text-ink hover:bg-white"
                    >
                      ‹
                    </button>
                    <div className="flex items-center gap-1.5">
                      {Array.from({ length: pageCount }).map((_, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => setPhotoPage(i)}
                          aria-label={`Go to page ${i + 1}`}
                          aria-current={photoPage === i}
                          className={`focus-ring h-2 w-2 cursor-pointer rounded-full transition-colors ${
                            photoPage === i ? "bg-ink" : "bg-ink/25 hover:bg-ink/40"
                          }`}
                        />
                      ))}
                    </div>
                    <button
                      type="button"
                      onClick={() => setPhotoPage((p) => (p + 1) % pageCount)}
                      aria-label={`Next ${page === "Art" ? "artworks" : "photos"}`}
                      className="focus-ring flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-full bg-white/70 text-ink hover:bg-white"
                    >
                      ›
                    </button>
                  </div>
                )}
              </div>
            )}
          </>
        ) : (
          <div className="absolute left-[27%] right-[12%] top-[65%] flex h-[24%] items-center gap-[6%]">
            <button
              id="creative-art"
              type="button"
              onClick={() => openFolder("Art", "creative-art")}
              className="focus-ring min-h-11 w-[32%] cursor-pointer rounded-lg motion-safe:transition-transform hover:scale-105"
            >
              <img src="/hero/art-text.PNG" alt="Art" className="block w-full" />
            </button>
            <button
              id="creative-photography"
              type="button"
              onClick={() => openFolder("Photography", "creative-photography")}
              className="focus-ring min-h-11 flex-1 cursor-pointer rounded-lg motion-safe:transition-transform hover:scale-105"
            >
              <img src="/hero/photography-text.PNG" alt="Photography" className="block w-full" />
            </button>
          </div>
        )}
      </div>
    </section>
  )
}
