# Real Manga Data Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Hide the Night Desk prototype and populate Folio + Riso + Beach with real manga titles, real cover images, and real sample panels.

**Architecture:** One-shot Node fetch script pulls cover art from AniList GraphQL and sample panels from Wikipedia REST API, downloads them under `public/assets/manga/<id>/`, writes a single `manifest.json`. Each design's data layer reads the manifest and renders real `<img>` covers + real panel images in readers, with the existing painted-block treatments kept as fallbacks. The `gpt/` route is hidden from the landing nav but its files remain on disk.

**Tech Stack:** Node 18+ (built-in `fetch`), Express static serve, vanilla HTML/CSS, Babel-in-browser React (existing). No test framework — verification is via curl + manual smoke. No new runtime dependencies.

**Note on testing:** This repo is a static review prototype with no test harness. Each task uses curl + file existence checks instead of unit tests. Don't add a test framework.

**Title list (13)** with canonical ids matching beach:
`berserk`, `jojo`, `vagabond`, `onepiece`, `monster`, `slamdunk`, `vinland`, `fma`, `grandblue`, `kingdom`, `ghost-fixers`, `gokuragukai`, `gachiakuta`.

**File map**
- Modify: `public/index.html` (drop Night Desk card)
- Modify: `server.js` (drop /gpt log line)
- Create: `scripts/fetch-manga-assets.js` (AniList + Wikipedia fetcher)
- Modify: `package.json` (add `fetch:assets` script)
- Create: `public/assets/manga/<id>/{cover,banner,panel-1,panel-2,panel-3}.jpg`
- Create: `public/assets/manga/manifest.json`
- Modify: `public/folio/data.jsx` (real catalog from manifest)
- Modify: `public/folio/cover.jsx` (img-with-fallback)
- Modify: `public/folio/reader.jsx` (real panel images)
- Modify: `public/riso/manga-feed/data.jsx` (real catalog from manifest)
- Modify: `public/riso/manga-feed/cover.jsx` (img-with-fallback)
- Modify: `public/riso/manga-feed/riso.jsx` (real panel images in reader)
- Modify: `public/beach/index.html` (real img covers)
- Modify: `public/beach/series.html` (real cover + panels)
- Modify: `public/beach/reader.html` (real panels)

---

### Task 1: Hide gpt/ from review surface

**Files:**
- Modify: `public/index.html`
- Modify: `server.js`

- [ ] **Step 1: Drop the Night Desk card from the landing**

In `public/index.html`, remove the entire `<a class="card" href="gpt/">` block (the one whose `<h2>` is "Night Desk"). Update the headline `<h1>` text from "four design directions" to "three design directions". Leave grid CSS as-is — three cards reflow naturally.

- [ ] **Step 2: Drop the /gpt log line from server**

In `server.js`, delete the line:

```js
console.log(`  /gpt     Night Desk dark IDE workspace`);
```

The `app.use(express.static(PUBLIC))` line stays. The `/gpt` URL still serves if someone hits it directly — that's intentional; we're hiding from review nav, not deleting.

- [ ] **Step 3: Verify**

```bash
node server.js &
sleep 1
curl -s http://localhost:3000/ | grep -c "Night Desk"
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3000/gpt/
kill %1
```

Expected: first command outputs `0` (no Night Desk on landing). Second outputs `200` (gpt files still served).

- [ ] **Step 4: Commit**

```bash
git add public/index.html server.js
git commit -m "Hide Night Desk (gpt) from review surface"
```

---

### Task 2: Scaffold fetch script

**Files:**
- Create: `scripts/fetch-manga-assets.js`
- Modify: `package.json`

- [ ] **Step 1: Create script skeleton**

Create `scripts/fetch-manga-assets.js`:

```js
#!/usr/bin/env node
// Fetch real manga covers + sample panels from AniList + Wikipedia.
// One-shot. Run via: npm run fetch:assets

const fs = require("fs/promises");
const path = require("path");

const OUT_DIR = path.join(__dirname, "..", "public", "assets", "manga");

const TITLES = [
  { id: "berserk",      anilist: "Berserk",                                     wiki: "Berserk_(manga)" },
  { id: "jojo",         anilist: "JoJo no Kimyou na Bouken Part 7: Steel Ball Run", wiki: "Steel_Ball_Run" },
  { id: "vagabond",     anilist: "Vagabond",                                    wiki: "Vagabond_(manga)" },
  { id: "onepiece",     anilist: "One Piece",                                   wiki: "One_Piece" },
  { id: "monster",      anilist: "Monster",                                     wiki: "Monster_(manga)" },
  { id: "slamdunk",     anilist: "Slam Dunk",                                   wiki: "Slam_Dunk_(manga)" },
  { id: "vinland",      anilist: "Vinland Saga",                                wiki: "Vinland_Saga_(manga)" },
  { id: "fma",          anilist: "Fullmetal Alchemist",                         wiki: "Fullmetal_Alchemist" },
  { id: "grandblue",    anilist: "Grand Blue",                                  wiki: "Grand_Blue" },
  { id: "kingdom",      anilist: "Kingdom",                                     wiki: "Kingdom_(manga)" },
  { id: "ghost-fixers", anilist: "Ghost Fixers",                                wiki: null },
  { id: "gokuragukai",  anilist: "Gokurakugai",                                 wiki: null },
  { id: "gachiakuta",   anilist: "Gachiakuta",                                  wiki: "Gachiakuta" },
];

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function ensureDir(p) {
  await fs.mkdir(p, { recursive: true });
}

async function main() {
  await ensureDir(OUT_DIR);
  const manifest = {};
  for (const t of TITLES) {
    console.log(`\n[${t.id}] ${t.anilist}`);
    const dir = path.join(OUT_DIR, t.id);
    await ensureDir(dir);
    // Filled in in later tasks
    manifest[t.id] = { id: t.id, paths: {} };
    await sleep(250);
  }
  await fs.writeFile(
    path.join(OUT_DIR, "manifest.json"),
    JSON.stringify(manifest, null, 2)
  );
  console.log(`\nWrote manifest with ${Object.keys(manifest).length} entries.`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
```

- [ ] **Step 2: Add npm script**

In `package.json`, add to `scripts`:

```json
"fetch:assets": "node scripts/fetch-manga-assets.js"
```

Final `scripts` block:

```json
"scripts": {
  "start": "node server.js",
  "dev": "node server.js",
  "fetch:assets": "node scripts/fetch-manga-assets.js"
}
```

- [ ] **Step 3: Verify scaffold runs**

```bash
npm run fetch:assets
ls public/assets/manga/
cat public/assets/manga/manifest.json | head -20
```

Expected: 13 subdirs created, manifest.json contains 13 keys with empty `paths` objects.

- [ ] **Step 4: Commit**

```bash
git add scripts/fetch-manga-assets.js package.json
echo "public/assets/manga/" >> .gitignore  # only if assets shouldn't be committed
git add .gitignore  # only if you ran the line above
git commit -m "Scaffold fetch-manga-assets script"
```

Note: assets are large binaries. Add `public/assets/manga/` to `.gitignore` so the binaries are not committed. The script is the source of truth — run `npm run fetch:assets` after clone.

---

### Task 3: AniList integration — covers + metadata

**Files:**
- Modify: `scripts/fetch-manga-assets.js`

- [ ] **Step 1: Add AniList query helper**

After `const sleep = ...`, add:

```js
const ANILIST_URL = "https://graphql.anilist.co";

const ANILIST_QUERY = `
query ($search: String) {
  Media(search: $search, type: MANGA, sort: SEARCH_MATCH) {
    id
    title { romaji english native }
    description(asHtml: false)
    chapters
    startDate { year }
    genres
    coverImage { extraLarge large color }
    bannerImage
    staff(perPage: 1, sort: RELEVANCE) {
      edges {
        role
        node { name { full } }
      }
    }
  }
}`;

async function anilistLookup(search) {
  const res = await fetch(ANILIST_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({ query: ANILIST_QUERY, variables: { search } }),
  });
  if (!res.ok) throw new Error(`AniList ${res.status}`);
  const json = await res.json();
  return json.data?.Media || null;
}

async function downloadImage(url, outPath) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Download ${res.status} for ${url}`);
  const buf = Buffer.from(await res.arrayBuffer());
  await fs.writeFile(outPath, buf);
  return outPath;
}

function stripHtml(s) {
  if (!s) return "";
  return s.replace(/<br\s*\/?>/gi, "\n").replace(/<[^>]+>/g, "").trim();
}

function pickAuthor(staffEdges) {
  if (!staffEdges?.length) return null;
  const story = staffEdges.find((e) => /story/i.test(e.role));
  return (story || staffEdges[0]).node?.name?.full || null;
}
```

- [ ] **Step 2: Wire AniList into main loop**

Replace the `for (const t of TITLES)` body with:

```js
for (const t of TITLES) {
  console.log(`\n[${t.id}] ${t.anilist}`);
  const dir = path.join(OUT_DIR, t.id);
  await ensureDir(dir);

  let media = null;
  try {
    media = await anilistLookup(t.anilist);
  } catch (e) {
    console.warn(`  AniList failed: ${e.message}`);
  }

  const entry = {
    id: t.id,
    title: media?.title?.romaji || t.anilist,
    jpTitle: media?.title?.native || null,
    englishTitle: media?.title?.english || null,
    author: pickAuthor(media?.staff?.edges) || null,
    year: media?.startDate?.year || null,
    chapters: media?.chapters || null,
    genres: media?.genres || [],
    synopsis: stripHtml(media?.description),
    accentColor: media?.coverImage?.color || null,
    paths: {},
  };

  if (media?.coverImage?.extraLarge) {
    const coverPath = path.join(dir, "cover.jpg");
    try {
      await downloadImage(media.coverImage.extraLarge, coverPath);
      entry.paths.cover = `/assets/manga/${t.id}/cover.jpg`;
      console.log(`  cover ✓`);
    } catch (e) { console.warn(`  cover ✗ ${e.message}`); }
  }

  if (media?.bannerImage) {
    const bannerPath = path.join(dir, "banner.jpg");
    try {
      await downloadImage(media.bannerImage, bannerPath);
      entry.paths.banner = `/assets/manga/${t.id}/banner.jpg`;
      console.log(`  banner ✓`);
    } catch (e) { console.warn(`  banner ✗ ${e.message}`); }
  }

  manifest[t.id] = entry;
  await sleep(700); // be polite (~85/min, under AniList's 90/min)
}
```

- [ ] **Step 3: Run and verify**

```bash
npm run fetch:assets
ls public/assets/manga/berserk/
cat public/assets/manga/manifest.json | python3 -c "import sys,json; m=json.load(sys.stdin); print(m['berserk']['title'], m['berserk']['author'], m['berserk']['chapters'])"
```

Expected: `cover.jpg` exists for at least 10 of 13 titles (some indie ones may miss). Manifest entry for berserk shows "Berserk", "Kentaro Miura", a chapter count.

- [ ] **Step 4: Commit**

```bash
git add scripts/fetch-manga-assets.js
git commit -m "Fetch covers + metadata from AniList"
```

---

### Task 4: Wikipedia panel scrape + fallback

**Files:**
- Modify: `scripts/fetch-manga-assets.js`

- [ ] **Step 1: Add Wikipedia helpers**

Append after the AniList helpers:

```js
const WIKI_HEADERS = {
  "User-Agent": "manga-feed-mvp/0.0.1 (design review prototype; contact: local)",
  Accept: "application/json",
};

async function wikiMediaList(pageTitle) {
  const url = `https://en.wikipedia.org/api/rest_v1/page/media-list/${encodeURIComponent(pageTitle)}`;
  const res = await fetch(url, { headers: WIKI_HEADERS });
  if (!res.ok) return [];
  const json = await res.json();
  return Array.isArray(json.items) ? json.items : [];
}

function pickPanelUrls(items, max = 3) {
  // Skip svg + tiny icons; prefer manga-related raster images.
  const picks = [];
  for (const it of items) {
    if (it.type !== "image") continue;
    const src = it.srcset?.[it.srcset.length - 1]?.src || it.original?.source;
    if (!src) continue;
    const url = src.startsWith("//") ? `https:${src}` : src;
    if (/\.svg(\?|$)/i.test(url)) continue;
    if (/(commons-logo|wikiquote|wikidata|edit-icon|red_pencil)/i.test(url)) continue;
    picks.push(url);
    if (picks.length >= max) break;
  }
  return picks;
}
```

- [ ] **Step 2: Add panel fetch + fallback into main loop**

After the `if (media?.bannerImage)` block, before `manifest[t.id] = entry;`, add:

```js
// Sample panels via Wikipedia
let panelUrls = [];
if (t.wiki) {
  try {
    const items = await wikiMediaList(t.wiki);
    panelUrls = pickPanelUrls(items, 3);
  } catch (e) {
    console.warn(`  wiki ✗ ${e.message}`);
  }
}

const panels = [];
for (let i = 0; i < panelUrls.length && i < 3; i++) {
  const p = path.join(dir, `panel-${i + 1}.jpg`);
  try {
    await downloadImage(panelUrls[i], p);
    panels.push(`/assets/manga/${t.id}/panel-${i + 1}.jpg`);
  } catch (e) { console.warn(`  panel-${i + 1} ✗ ${e.message}`); }
}

// Fallback: pad to 3 with banner then cover repeats
const fallbackPool = [entry.paths.banner, entry.paths.cover].filter(Boolean);
let fbi = 0;
while (panels.length < 3 && fallbackPool.length) {
  panels.push(fallbackPool[fbi % fallbackPool.length]);
  fbi++;
}
entry.paths.panels = panels;
console.log(`  panels: ${panels.length} (${panelUrls.length} from wiki)`);
```

- [ ] **Step 3: Run and verify**

```bash
npm run fetch:assets
ls public/assets/manga/berserk/
node -e "const m=require('./public/assets/manga/manifest.json'); for (const k of Object.keys(m)) console.log(k, '→', m[k].paths.panels?.length, 'panels');"
```

Expected: every title shows 3 panels (some may be banner/cover repeats — that's the fallback working).

- [ ] **Step 4: Commit**

```bash
git add scripts/fetch-manga-assets.js
git commit -m "Add Wikipedia panel scrape with cover fallback"
```

---

### Task 5: Wire Folio to manifest

**Files:**
- Modify: `public/folio/index.html`
- Modify: `public/folio/data.jsx`
- Modify: `public/folio/cover.jsx`
- Modify: `public/folio/reader.jsx`

- [ ] **Step 1: Load the manifest in the page**

In `public/folio/index.html`, find the `<script type="text/babel" src="data.jsx"></script>` line. Add this BEFORE it (must run before `data.jsx`):

```html
<script>
  fetch('/assets/manga/manifest.json')
    .then(r => r.ok ? r.json() : {})
    .then(m => { window.MANGA_MANIFEST = m; })
    .catch(() => { window.MANGA_MANIFEST = {}; });
</script>
```

This is best-effort: if the fetch hasn't resolved by the time React mounts, the painted-block fallback covers it.

Important: React mounting in `index.html` is async (Babel transpile in browser). To be safe, switch the manifest load to a synchronous-ish block by awaiting it before React renders. Replace the React mount (the existing `ReactDOM.render(...)` or `createRoot(...).render(...)` call — whichever the file uses) with a wrapper that waits for the manifest:

Find the existing render call near the end of `index.html`. Wrap it:

```html
<script type="text/babel" data-presets="env,react">
  (async () => {
    try {
      const r = await fetch('/assets/manga/manifest.json');
      window.MANGA_MANIFEST = r.ok ? await r.json() : {};
    } catch { window.MANGA_MANIFEST = {}; }
    // EXISTING RENDER CALL GOES HERE — copy it from below
  })();
</script>
```

Move the existing render call inside the IIFE; remove the old un-wrapped render script. (If the existing render is already in a `<script type="text/babel">` block, transplant its body in.)

- [ ] **Step 2: Rebuild data.jsx from manifest**

Replace `public/folio/data.jsx` entirely with:

```js
// Real manga catalog. Source of truth: /assets/manga/manifest.json
// Falls back to painted blocks if manifest missing.

const MANIFEST = window.MANGA_MANIFEST || {};

const ID_ORDER = [
  "berserk", "jojo", "vagabond", "onepiece", "monster",
  "slamdunk", "vinland", "fma", "grandblue", "kingdom",
  "ghost-fixers", "gokuragukai", "gachiakuta",
];

// Per-title presentation overrides (warm-tone fallback colors + Folio extras)
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
    title: m.title || id,
    jpTitle: m.jpTitle || null,
    author: m.author || "—",
    year: m.year || 2024,
    chapters: m.chapters || 0,
    tags: (m.genres || []).slice(0, 2),
    type: "Manga",
    direction: ovr.direction,
    cover: ovr.cover,                             // fallback color
    coverImg: m.paths?.cover || null,             // real image
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
  { id: "epic",     title: "Long-running epics",      subtitle: "Sit down for a while", ids: ["onepiece", "berserk", "kingdom", "vagabond"] },
  { id: "drama",    title: "Quiet drama, loud panels", subtitle: "Seinen highlights",   ids: ["monster", "vinland", "vagabond", "fma"] },
  { id: "ongoing",  title: "Updated this week",        subtitle: "Fresh chapters",      ids: ["gachiakuta", "gokuragukai", "ghost-fixers", "grandblue"] },
];

const CONTINUE_READING = [
  { id: "vagabond",  chapter: 312, page: 9,  ofPages: 18, when: "2 hours ago" },
  { id: "berserk",   chapter: 364, page: 14, ofPages: 19, when: "Yesterday"  },
  { id: "onepiece",  chapter: 1100, page: 6, ofPages: 18, when: "3 days ago" },
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
```

- [ ] **Step 3: Render real cover image in cover.jsx**

In `public/folio/cover.jsx`, locate the outer `<div>` whose style sets `background: manga.cover` (the painted block). Replace its inner content (everything inside the outer div) with a conditional:

```jsx
{manga.coverImg ? (
  <img
    src={manga.coverImg}
    alt={manga.title}
    style={{
      position: "absolute",
      inset: 0,
      width: "100%",
      height: "100%",
      objectFit: "cover",
      display: "block",
    }}
    onError={(e) => { e.currentTarget.style.display = "none"; }}
  />
) : (
  <>
    {/* existing painted-block content: grain texture, hairline rule, title block, year */}
  </>
)}
```

Concretely: copy the existing children (the four sibling `<div>` blocks for grain, hairline, title block, year meta) into the `else` branch (`<>...</>`). The outer div keeps its `background: manga.cover` so loading state / failure show the painted color.

- [ ] **Step 4: Render real panels in reader.jsx**

In `public/folio/reader.jsx`, find `function ReaderPage({ pageNum, totalPages, accent, baseColor, mode, side })`. Add `panelImg` to its destructured props (caller pass-through next):

```js
function ReaderPage({ pageNum, totalPages, accent, baseColor, mode, side, panelImg }) {
```

Inside its returned JSX, immediately after the outer container div opens, add:

```jsx
{panelImg && (
  <img
    src={panelImg}
    alt=""
    className="reader-page-panel"
    style={{
      position: "absolute",
      inset: 0,
      width: "100%",
      height: "100%",
      objectFit: "cover",
      zIndex: 0,
    }}
    onError={(e) => { e.currentTarget.style.display = "none"; }}
  />
)}
```

Keep the existing painted page contents but wrap them in a div with `style={{ position: "relative", zIndex: 1 }}` so the page number stays readable on top of (or in absence of) the image.

Then find every place `ReaderPage` is rendered. For each, pass `panelImg={manga.panels[(pageNum - 1) % (manga.panels.length || 1)]}`. (`pageNum` is the prop already being passed; if the variable name in scope differs, use that.)

- [ ] **Step 5: Verify**

```bash
node server.js &
sleep 1
# Confirm the manifest is reachable
curl -s -o /dev/null -w "manifest=%{http_code}\n" http://localhost:3000/assets/manga/manifest.json
# Confirm a real cover serves
curl -s -o /dev/null -w "cover=%{http_code}\n" http://localhost:3000/assets/manga/vagabond/cover.jpg
# Confirm folio page loads
curl -s -o /dev/null -w "folio=%{http_code}\n" http://localhost:3000/folio/
kill %1
```

Expected: all three return `200`. Open `http://localhost:3000/folio/` in a browser; covers should show real art for known titles. Click into Vagabond → reader should show real panels.

- [ ] **Step 6: Commit**

```bash
git add public/folio/
git commit -m "Wire Folio to real manga manifest"
```

---

### Task 6: Wire Riso to manifest

**Files:**
- Modify: `public/riso/index.html`
- Modify: `public/riso/manga-feed/data.jsx`
- Modify: `public/riso/manga-feed/cover.jsx`
- Modify: `public/riso/manga-feed/riso.jsx`

- [ ] **Step 1: Load manifest before render in riso/index.html**

Same pattern as Folio Task 5 Step 1: wrap the existing React render call in an async IIFE that first fetches `/assets/manga/manifest.json` and assigns it to `window.MANGA_MANIFEST`, then performs the render.

- [ ] **Step 2: Rebuild riso data.jsx**

Replace `public/riso/manga-feed/data.jsx` with the same template as Folio Task 5 Step 2, but with riso-flavored overrides — riso's halftone styles read these `cover` colors as ink-block tones, so swap the palette:

```js
const RISO_OVERRIDES = {
  berserk:        { cover: "#1a1412", accent: "#d04a3a" },
  jojo:           { cover: "#1f2531", accent: "#3d6fa0" },
  vagabond:       { cover: "#2a2218", accent: "#d8a440" },
  onepiece:       { cover: "#3c2e1f", accent: "#e0784a" },
  monster:        { cover: "#1a1715", accent: "#a85a4a" },
  slamdunk:       { cover: "#3a2820", accent: "#e08a4a" },
  vinland:        { cover: "#2a1f1a", accent: "#c4624a" },
  fma:            { cover: "#473023", accent: "#e0a040" },
  grandblue:      { cover: "#1f2624", accent: "#3da098" },
  kingdom:        { cover: "#3d2a26", accent: "#c8704a" },
  "ghost-fixers": { cover: "#2e2419", accent: "#c89040" },
  gokuragukai:    { cover: "#3b2823", accent: "#d87060" },
  gachiakuta:     { cover: "#1e2820", accent: "#5a9870" },
};
```

Use the same `buildEntry` shape, `MANGA_CATALOG`, `findManga` exports as Folio. Riso's home/series components consume the same shape.

- [ ] **Step 3: img-with-fallback in riso cover.jsx**

In `public/riso/manga-feed/cover.jsx`, apply the same pattern as Folio Task 5 Step 3 — wrap the painted-block contents in a conditional that prefers `manga.coverImg` when present. The riso cover treatment may use blend modes or filters in CSS (`mix-blend-mode`, `filter: grayscale(...)` etc.) — leave those CSS rules alone; they'll apply on top of the `<img>` for the riso ink look.

- [ ] **Step 4: Real panels in riso reader spread**

In `public/riso/manga-feed/riso.jsx`, find the reader spread component (`READER` section, the function that renders left/right pages). Locate the `.rz2-page-shape` div for each page (left and right). Add an optional `<img>` overlay:

```jsx
{m.panels && m.panels[(pageIdx) % m.panels.length] && (
  <img
    src={m.panels[(pageIdx) % m.panels.length]}
    alt=""
    style={{
      position: "absolute",
      inset: 0,
      width: "100%",
      height: "100%",
      objectFit: "cover",
      mixBlendMode: "multiply",
      opacity: 0.85,
    }}
    onError={(e) => { e.currentTarget.style.display = "none"; }}
  />
)}
```

`pageIdx` is the per-page index in scope (use whichever variable computes "which page is this" — `left` and `right` exist near line 977). Use `left - 1` for the left page, `right - 1` for the right.

- [ ] **Step 5: Verify**

```bash
node server.js &
sleep 1
curl -s -o /dev/null -w "riso=%{http_code}\n" http://localhost:3000/riso/
kill %1
```

Open `http://localhost:3000/riso/` — cards show real art with riso ink treatment; reader shows real panels with multiply blend.

- [ ] **Step 6: Commit**

```bash
git add public/riso/
git commit -m "Wire Riso to real manga manifest"
```

---

### Task 7: Wire Beach to manifest

**Files:**
- Modify: `public/beach/index.html`
- Modify: `public/beach/series.html`
- Modify: `public/beach/reader.html`

- [ ] **Step 1: Add manifest fetch + img helper to beach landing**

In `public/beach/index.html`, just before the closing `</body>` tag, add:

```html
<script>
(async () => {
  let manifest = {};
  try {
    const r = await fetch('/assets/manga/manifest.json');
    if (r.ok) manifest = await r.json();
  } catch {}

  // Replace .rank-cover letter tiles with real cover images
  document.querySelectorAll('.rank-row').forEach((row) => {
    const href = row.getAttribute('href') || '';
    const m = href.match(/id=([^&]+)/);
    if (!m) return;
    const id = m[1];
    const entry = manifest[id];
    const tile = row.querySelector('.rank-cover');
    if (!tile || !entry?.paths?.cover) return;
    tile.textContent = '';
    tile.style.backgroundImage = `url(${entry.paths.cover})`;
    tile.style.backgroundSize = 'cover';
    tile.style.backgroundPosition = 'center';
  });

  // Same for recent-update tiles
  document.querySelectorAll('.recent-item').forEach((row) => {
    const href = row.getAttribute('href') || '';
    const m = href.match(/id=([^&]+)/);
    if (!m) return;
    const id = m[1];
    const entry = manifest[id];
    const tile = row.querySelector('.cover');
    if (!tile || !entry?.paths?.cover) return;
    tile.textContent = '';
    tile.style.backgroundImage = `url(${entry.paths.cover})`;
    tile.style.backgroundSize = 'cover';
    tile.style.backgroundPosition = 'center';
  });

  // Hero: swap to vagabond banner if present
  const hero = manifest.vagabond;
  if (hero?.paths?.banner) {
    const heroImg = document.querySelector('.hero img, .hero-art img');
    if (heroImg) heroImg.src = hero.paths.banner;
  }
})();
</script>
```

(If `.hero img` doesn't match — beach uses an `<img src="vagabond-hero.jpg">`. Update the selector to whatever matches that hero image element. Inspect `index.html` and adjust if needed.)

- [ ] **Step 2: Apply same pattern to series.html**

In `public/beach/series.html`, parse the URL `?id=` query and look up the manifest entry. Replace the placeholder cover element and any "page" tiles with real cover + panels. Add at end of body:

```html
<script>
(async () => {
  const id = new URLSearchParams(location.search).get('id');
  if (!id) return;
  let manifest = {};
  try {
    const r = await fetch('/assets/manga/manifest.json');
    if (r.ok) manifest = await r.json();
  } catch {}
  const entry = manifest[id];
  if (!entry) return;

  // Title + meta
  document.querySelectorAll('[data-bind="title"]').forEach(el => el.textContent = entry.title);
  document.querySelectorAll('[data-bind="jpTitle"]').forEach(el => el.textContent = entry.jpTitle || '');
  document.querySelectorAll('[data-bind="author"]').forEach(el => el.textContent = entry.author || '');
  document.querySelectorAll('[data-bind="synopsis"]').forEach(el => el.textContent = entry.synopsis || '');

  // Cover
  const coverEl = document.querySelector('[data-bind="cover"]');
  if (coverEl && entry.paths?.cover) {
    coverEl.style.backgroundImage = `url(${entry.paths.cover})`;
    coverEl.style.backgroundSize = 'cover';
    coverEl.style.backgroundPosition = 'center';
    coverEl.textContent = '';
  }
})();
</script>
```

For each placeholder element that should bind, add the corresponding `data-bind="..."` attribute in the HTML. (If `series.html` is mostly static stub copy, leave hardcoded copy where it makes sense and only annotate the cover/title/synopsis nodes.)

- [ ] **Step 3: Apply same pattern to reader.html**

In `public/beach/reader.html`, swap each "page" placeholder (currently a colored tile) for a real panel. Add at end of body:

```html
<script>
(async () => {
  const id = new URLSearchParams(location.search).get('id');
  if (!id) return;
  let manifest = {};
  try {
    const r = await fetch('/assets/manga/manifest.json');
    if (r.ok) manifest = await r.json();
  } catch {}
  const entry = manifest[id];
  if (!entry?.paths?.panels?.length) return;

  document.querySelectorAll('[data-page]').forEach((el) => {
    const idx = parseInt(el.getAttribute('data-page'), 10) || 0;
    const src = entry.paths.panels[idx % entry.paths.panels.length];
    if (!src) return;
    el.style.backgroundImage = `url(${src})`;
    el.style.backgroundSize = 'cover';
    el.style.backgroundPosition = 'center';
    // Clear any placeholder text
    Array.from(el.children).forEach(c => { c.style.opacity = 0.0; });
  });
})();
</script>
```

In `reader.html`, on each page tile element, add `data-page="0"`, `data-page="1"`, `data-page="2"` etc. (cycle as needed).

- [ ] **Step 4: Verify**

```bash
node server.js &
sleep 1
curl -s -o /dev/null -w "beach=%{http_code}\n" http://localhost:3000/beach/
curl -s -o /dev/null -w "series=%{http_code}\n" "http://localhost:3000/beach/series.html?id=vagabond"
curl -s -o /dev/null -w "reader=%{http_code}\n" "http://localhost:3000/beach/reader.html?id=berserk"
kill %1
```

Expected: all `200`. Open beach in browser; ranking rows and recent updates show real covers. Click into Vagabond series page; cover/title bound. Open reader; pages show real panels.

- [ ] **Step 5: Commit**

```bash
git add public/beach/
git commit -m "Wire Beach to real manga manifest"
```

---

### Task 8: Final review pass

**Files:** read-only review

- [ ] **Step 1: Smoke test all three designs**

```bash
node server.js &
sleep 1
for path in / /folio/ /riso/ /beach/ /assets/manga/manifest.json; do
  printf "%-40s " "$path"
  curl -s -o /dev/null -w "%{http_code}\n" "http://localhost:3000$path"
done
kill %1
```

Expected: all `200`. Then open each in a browser and confirm:
- Landing has 3 cards (no Night Desk)
- Folio home shows real covers; Vagabond reader shows real panels
- Riso home shows real covers with ink treatment; reader spread shows real panels
- Beach ranking + recent show real covers; series + reader show real cover + panels
- `/gpt/` direct hit still 200 (file kept), no nav points to it

- [ ] **Step 2: Verify gpt files untouched**

```bash
git log --oneline -- public/gpt/ | head -5
```

Expected: most recent commit on `public/gpt/` is older than today's session — no new commits modifying it.

- [ ] **Step 3: Final commit (only if anything changed in this task)**

If polish edits were needed, commit them. Otherwise skip.

```bash
git status
# if changes: git add -p && git commit -m "Polish review build"
```
