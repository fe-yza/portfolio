const artPhotos = [
  {
    id: "art-01",
    src: "/hero/art-gallery/art-01.jpg",
    alt: "Colorful painting of figures beneath a blue umbrella displayed on an easel",
  },
  {
    id: "art-02",
    src: "/hero/art-gallery/art-02.jpg",
    alt: "Expressive painted portraits and a floral study displayed on a wall",
  },
  {
    id: "art-03",
    src: "/hero/art-gallery/art-03-full.png",
    alt: "Mixed-media city storefront artwork displayed on a table",
  },
  {
    id: "art-04",
    src: "/hero/art-gallery/art-04.jpg",
    alt: "Art workspace with colorful figure studies and drawings",
  },
  {
    id: "art-05",
    src: "/hero/art-gallery/art-05.jpg",
    alt: "Portrait of a masked person surrounded by orange and white koi fish",
  },
  {
    id: "art-06",
    src: "/hero/art-gallery/art-06.jpg",
    alt: "Monochrome portrait with hands and flowing abstract details",
  },
  {
    id: "art-07",
    src: "/hero/art-gallery/art-07.jpg",
    alt: "Still life of a stuffed rabbit beside books and a plant",
  },
  {
    id: "art-08",
    src: "/hero/art-gallery/art-08.jpg",
    alt: "Black-and-white portrait of a woman with locs",
  },
  {
    id: "art-09",
    src: "/hero/art-gallery/art-09.jpg",
    alt: "Surreal painting of a tree growing from an eye",
  },
  {
    id: "art-10",
    src: "/hero/art-gallery/art-10.jpg",
    alt: "Portrait of a woman in patterned clothing against a warm background",
  },
]

// Explicit slide groupings preserve the curated order and single-image opening.
export const artSlides = [
  [{ ...artPhotos[2], caption: "oil painting, work in progress" }],
  [artPhotos[0], artPhotos[4]],
  [artPhotos[5], {
    ...artPhotos[9],
    caption: "click on the drawing to see the time lapse!",
    href: "https://www.youtube.com/watch?v=PJYWWW02F0Q",
  }],
  [artPhotos[1], artPhotos[3]],
  [artPhotos[8], artPhotos[7]],
]
