// Real manga catalog. Source: /assets/manga/manifest.json (loaded by index.html).
// Riso-flavored ink-block fallback colors keep the painted treatment when manifest missing.

const MANIFEST = window.MANGA_MANIFEST || {};

const ID_ORDER = [
  "berserk", "jojo", "vagabond", "onepiece", "monster",
  "slamdunk", "vinland", "fma", "grandblue", "kingdom",
  "ghost-fixers", "gokuragukai", "gachiakuta",
];

const RISO_OVERRIDES = {
  berserk:        { cover: "#1a1412", accent: "#d04a3a", direction: "RTL", featured: false },
  jojo:           { cover: "#1f2531", accent: "#3d6fa0", direction: "RTL", featured: false },
  vagabond:       { cover: "#2a2218", accent: "#d8a440", direction: "RTL", featured: true  },
  onepiece:       { cover: "#3c2e1f", accent: "#e0784a", direction: "RTL", featured: false },
  monster:        { cover: "#1a1715", accent: "#a85a4a", direction: "RTL", featured: false },
  slamdunk:       { cover: "#3a2820", accent: "#e08a4a", direction: "RTL", featured: false },
  vinland:        { cover: "#2a1f1a", accent: "#c4624a", direction: "RTL", featured: false },
  fma:            { cover: "#473023", accent: "#e0a040", direction: "RTL", featured: false },
  grandblue:      { cover: "#1f2624", accent: "#3da098", direction: "RTL", featured: false },
  kingdom:        { cover: "#3d2a26", accent: "#c8704a", direction: "RTL", featured: false },
  "ghost-fixers": { cover: "#2e2419", accent: "#c89040", direction: "RTL", featured: false },
  gokuragukai:    { cover: "#3b2823", accent: "#d87060", direction: "RTL", featured: false },
  gachiakuta:     { cover: "#1e2820", accent: "#5a9870", direction: "RTL", featured: false },
};

function buildEntry(id) {
  const m = MANIFEST[id] || {};
  const ovr = RISO_OVERRIDES[id] || { cover: "#2a2622", accent: "#d04a3a", direction: "RTL" };
  return {
    id,
    title: m.englishTitle || m.title || id,
    jpTitle: m.jpTitle || null,
    author: m.author || "—",
    year: m.year || 2024,
    chapters: m.chapters || 0,
    tags: (m.genres || []).slice(0, 2),
    type: "Manga",
    direction: ovr.direction,
    cover: ovr.cover,
    coverImg: m.paths?.cover || null,
    bannerImg: m.paths?.banner || null,
    panels: m.paths?.panels || [],
    accent: ovr.accent,
    synopsis: m.synopsis || "",
    featured: !!ovr.featured,
    rating: 4.5,
    pages: 18,
  };
}

const MANGA_CATALOG = ID_ORDER.map(buildEntry);

const COLLECTIONS = [
  { id: "epic",    title: "Long-running epics",       subtitle: "Sit down for a while", ids: ["onepiece", "berserk", "kingdom", "vagabond"] },
  { id: "drama",   title: "Quiet drama, loud panels", subtitle: "Seinen highlights",    ids: ["monster", "vinland", "vagabond", "fma"] },
  { id: "ongoing", title: "Updated this week",        subtitle: "Fresh chapters",       ids: ["gachiakuta", "gokuragukai", "ghost-fixers", "grandblue"] },
];

const CONTINUE_READING = [
  { id: "vagabond", chapter: 312,  page: 9,  ofPages: 18, when: "2 hours ago" },
  { id: "berserk",  chapter: 364,  page: 14, ofPages: 19, when: "Yesterday"  },
  { id: "onepiece", chapter: 1100, page: 6,  ofPages: 18, when: "3 days ago" },
];

const EDITORIAL_PICK = {
  id: "vagabond",
  pull: "Strength is not in the sword. Strength is in not needing to draw it.",
  byline: "Editor's pick · Issue 14",
};

window.MANGA_CATALOG = MANGA_CATALOG;
window.COLLECTIONS = COLLECTIONS;
window.CONTINUE_READING = CONTINUE_READING;
window.EDITORIAL_PICK = EDITORIAL_PICK;
window.findManga = (id) => MANGA_CATALOG.find(m => m.id === id);
