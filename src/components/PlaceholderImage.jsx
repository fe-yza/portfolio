export const VARIANTS = {
  mint: "from-mint-100 via-mint-200/70 to-sky-100",
  sky: "from-sky-100 via-sky-200/70 to-mint-100",
  duo: "from-mint-100 via-white to-sky-100",
}

/**
 * Stand-in for real artwork/photography. Renders the placeholder tag
 * (e.g. [FEYZA_SKETCH_PORTRAIT]) so it's obvious where final assets drop in.
 */
export default function PlaceholderImage({
  tag,
  label,
  variant = "duo",
  className = "",
  rounded = "rounded-3xl",
}) {
  return (
    <div
      className={`relative flex flex-col items-center justify-center gap-1.5 overflow-hidden border border-dashed border-ink/20 bg-gradient-to-br p-3 ${VARIANTS[variant]} ${rounded} ${className}`}
    >
      <svg
        width="28"
        height="28"
        viewBox="0 0 24 24"
        fill="none"
        className="shrink-0 text-ink/30"
      >
        <rect x="3" y="4" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="9" cy="10" r="1.6" stroke="currentColor" strokeWidth="1.5" />
        <path d="M4 17l5-5 3 3 4-5 4 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      {tag && (
        <span className="max-w-full whitespace-normal break-words rounded-full bg-white/70 px-2.5 py-1 text-center font-mono text-[10px] leading-tight tracking-tight text-ink-soft">
          {tag}
        </span>
      )}
      {label && (
        <span className="max-w-[85%] text-center text-xs leading-snug text-ink-soft">{label}</span>
      )}
    </div>
  )
}
