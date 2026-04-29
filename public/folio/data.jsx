// Real manga catalog. Source of truth: /assets/manga/manifest.json (loaded by index.html).
// Falls back to painted blocks if manifest missing.

const MANIFEST = window.MANGA_MANIFEST || {};

const ID_ORDER = [
  "berserk", "jojo", "vagabond", "onepiece", "monster",
  "slamdunk", "vinland", "fma", "grandblue", "kingdom",
  "ghost-fixers", "gokuragukai", "gachiakuta",
];

// Per-title fallback colors for Folio's painted-block treatment.
const FOLIO_OVERRIDES = {
  berserk:        { cover: "#1a1412", accent: "#a4624b", direction: "RTL", featured: false },
  jojo:           { cover: "#1f2531", accent: "#7d8aa1", direction: "RTL", featured: false },
  vagabond:       { cover: "#2a2218", accent: "#a88b58", direction: "RTL", featured: true  },
  onepiece:       { cover: "#3c2e1f", accent: "#c4a06a", direction: "RTL", featured: false },
  monster:        { cover: "#1a1715", accent: "#8a6a5a", direction: "RTL", featured: false },
  slamdunk:       { cover: "#3a2820", accent: "#c9956b", direction: "RTL", featured: false },
  vinland:        { cover: "#2a1f1a", accent: "#a4724b", direction: "RTL", featured: false },
  fma:            { cover: "#473023", accent: "#d9a474", direction: "RTL", featured: false },
  grandblue:      { cover: "#1f2624", accent: "#7c9a8a", direction: "RTL", featured: false },
  kingdom:        { cover: "#3d2a26", accent: "#c08a7b", direction: "RTL", featured: false },
  "ghost-fixers": { cover: "#2e2419", accent: "#b39564", direction: "RTL", featured: false },
  gokuragukai:    { cover: "#3b2823", accent: "#cc9482", direction: "RTL", featured: false },
  gachiakuta:     { cover: "#1e2820", accent: "#7d9b78", direction: "RTL", featured: false },
};

function buildEntry(id) {
  const m = MANIFEST[id] || {};
  const ovr = FOLIO_OVERRIDES[id] || { cover: "#2a2622", accent: "#b39564", direction: "RTL" };
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
    cover: ovr.cover,                             // fallback color
    coverImg: m.paths?.cover || null,             // real image url
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
