// A single loaded-brush ribbon, with independently shaped upper/lower edges.
// The lower edge lies over the matching paper section; no opaque backing box.
export default function HeroBrushDivider() {
  return (
    <div className="hero-brush-divider" aria-hidden="true">
      <svg viewBox="0 0 1600 180" preserveAspectRatio="none">
        <path
          fill="var(--color-paper)"
          d="M-20 26 C140 40 190 4 340 6 C490 8 510 34 690 28 C850 22 890 0 1060 8 C1230 16 1270 38 1440 24 C1510 18 1580 22 1620 30 L1620 145 C1440 166 1390 132 1220 143 C1040 154 1010 177 830 165 C650 153 620 133 450 146 C280 159 180 178 -20 150 Z"
        />
      </svg>
    </div>
  )
}
