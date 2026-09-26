// Viewports remove empty source-canvas space, retaining complete people and props.
// Each figure has its own size and position; mobile is a separate park composition.
export const figures = [
  { id: "art", caption: "Self taught artist, been making art since I was 6!", viewport: [37, 279, 547, 359], desktop: { w: 18, x: 13, y: 4 }, mobile: { w: 41, x: 4, y: 3 } },
  { id: "guitar", caption: "I taught myself how to play the electric and acoustic guitar! I love some blues, rnb, and old school rock", viewport: [457, 119, 384, 403], desktop: { w: 13, x: 42, y: 2 }, mobile: { w: 30, x: 59, y: 2 } },
  { id: "photography", caption: "I love to travel, I take my camera with me everywhere and try to capture as much as I can", viewport: [845, 197, 708, 389], desktop: { w: 24, x: 64, y: 4 }, mobile: { w: 46, x: 2, y: 29 } },
  { id: "volleyball", caption: "Volleyball is how I spend my summers", viewport: [215, 425, 481, 368], desktop: { w: 18, x: 22, y: 35 }, mobile: { w: 39, x: 56, y: 31 } },
  { id: "reading", caption: "i love to read before bed, it's either that or sudoku haha", viewport: [571, 197, 697, 553], desktop: { w: 21, x: 51, y: 35 }, mobile: { w: 44, x: 3, y: 52 } },
  { id: "coding", caption: "I love to build and design", viewport: [685, 405, 680, 419], desktop: { w: 24, x: 35, y: 70 }, mobile: { w: 44, x: 53, y: 56 } },
  { id: "running", caption: "I run and lift in my free time! One of my biggest goals is to complete an ironman", viewport: [1066, 215, 467, 554], desktop: { w: 13, x: 76, y: 66 }, mobile: { w: 29, x: 57, y: 78 } },
]
export const FIRST_CLICK_MESSAGE = "actually, these are all me"
// The first discovery reveals the joke; six more activities remain to explore.
export const MAX_TRIES = figures.length - 1
