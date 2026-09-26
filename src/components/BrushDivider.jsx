import { motion, useReducedMotion } from "framer-motion"

// Hand-inked brush-stroke bands: irregular top/bottom edges, no two alike.
const PATHS = [
  "M0,35 C120,10 200,50 320,25 C440,0 520,45 640,20 C760,-5 850,40 970,15 C1090,-10 1180,35 1300,10 C1360,0 1410,20 1440,15 L1440,205 C1380,225 1300,190 1200,210 C1100,230 1020,195 920,215 C820,235 740,200 640,218 C540,236 460,202 360,220 C260,238 180,205 90,222 C50,230 20,215 0,220 Z",
  "M0,20 C100,45 210,5 330,30 C450,55 540,10 660,32 C780,54 860,8 980,28 C1100,48 1190,6 1310,26 C1370,36 1410,18 1440,24 L1440,190 C1360,165 1290,215 1180,185 C1070,155 990,205 880,178 C770,151 690,200 580,172 C470,144 390,196 280,168 C170,140 100,190 40,162 C15,150 5,175 0,168 Z",
  "M0,28 C130,4 240,48 360,18 C480,-8 570,40 690,14 C810,-6 900,38 1020,12 C1140,-8 1230,34 1350,12 C1390,6 1420,22 1440,18 L1440,198 C1350,220 1270,182 1170,206 C1070,228 990,192 890,212 C790,232 710,198 610,216 C510,234 430,200 330,218 C230,236 150,204 70,220 C40,226 15,214 0,216 Z",
]

export default function BrushDivider({ variant = 0, flip = false, className = "" }) {
  const reduceMotion = useReducedMotion()
  const d = PATHS[variant % PATHS.length]

  return (
    <div
      aria-hidden="true"
      className={`relative -my-8 h-20 w-full overflow-hidden sm:h-28 md:-my-12 md:h-36 ${className}`}
    >
      <motion.div
        className="absolute inset-0"
        style={{ transformOrigin: flip ? "left center" : "right center" }}
        initial={{ scaleX: 1 }}
        whileInView={{ scaleX: reduceMotion ? 0 : 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: reduceMotion ? 0 : 1.05, ease: [0.76, 0, 0.24, 1] }}
      >
        <svg viewBox="0 0 1440 220" preserveAspectRatio="none" className="h-full w-full">
          <path d={d} fill="#ffffff" />
        </svg>
      </motion.div>
    </div>
  )
}
