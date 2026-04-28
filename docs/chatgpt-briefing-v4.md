# Manga Feed — brief for designing prototype v4

> Paste this whole file into ChatGPT as your first message, then ask it to propose v4. Everything ChatGPT needs to produce drop-in code lives here.

---

## 1. Your role

You are designing the **fourth visual prototype** for a manga reader web app. Three prototypes already exist (Folio, Riso, beachRead). Your output will live alongside them in a static review harness so the team can compare four directions side-by-side before picking one to productionize.

**You have full creative freedom on the aesthetic.** You must not duplicate the visual language of the three existing prototypes (described below). Pick a posture, then deliver code.

**Deliverable:** a folder of files (one HTML + one CSS + a few JSX files) that drops into `public/v4/` and just works when the static server reloads. No build step, no install step.

---

## 2. The harness (how the project is wired)

- **Repo:** static-only review build. Express (`server.js`) serves `public/` locally; GitHub Pages serves the same `public/` in deploy.
- **No bundler. No TypeScript. No Tailwind. No preprocessor.** Plain CSS + plain JSX.
- **React in the browser:** each prototype loads React 18 UMD + Babel-standalone from unpkg, and runs `<script type="text/babel">` blocks. Babel transpiles in-page. ~1.5MB first load — acceptable for a review harness, not for production.
- **Each prototype is a self-contained folder** under `public/`. Express does no routing; it just `express.static('public')`.
- **Landing page** at `public/index.html` lists every prototype as a card. You will need to add one card linking to `v4/`.

Routes today:
- `/` → `public/index.html` (landing)
- `/folio/` → Folio
- `/riso/` → Riso
- `/beach/` → beachRead
- `/v4/` ← **your output goes here**

---

## 3. The three existing prototypes (DO NOT DUPLICATE)

Stake out a clearly different visual direction. v4 should not look like any of these.

**01 / Folio — `public/folio/`**
- Posture: warm editorial reading library. Calm, sparse, typography-first.
- Palette: cream + terracotta (light) / dark warm + amber (dark). Toggleable.
- Type: Newsreader (serif), Inter Tight (sans), JetBrains Mono (mono labels). Italic serif headings, monospace eyebrow labels.
- Layout: max-width 1280px, generous whitespace, blurred floating Tweaks panel.
- Reader: paged single / paged double / vertical. Auto-hide or persistent chrome. Drawer for chapters.

**02 / Riso/Read — `public/riso/`**
- Posture: print-shop risograph zine. Unexpected, bold, two-tone.
- Palette: cream paper + navy ink. Halftone dot texture overlay.
- Type: monospace-heavy (JetBrains Mono dominant), Space Grotesk for sans, Lora occasional serif.
- Layout: centered container, margin-heavy, print-magazine posture. No blurs, hard edges.

**03 / beachRead — `public/beach/`**
- Posture: editorial portal / "product"-shaped. Tables, ranked lists, news grid.
- Palette: cream (#f5efe1) + navy (#0e1a36) + red accent (#c14a2a).
- Type: Playfair Display (serif headings), Inter (sans), Noto Sans JP (Japanese).
- Layout: hero with a real bleeding image (Vagabond ink-wash), trending table, "Latest Updates" cards, "Latest News" grid.
- **Stack note:** beachRead uses NO React — pure static multi-page HTML.

**Where should v4 land?** Pick a clearly different position. Some axes to push along:
- dense ↔ airy
- illustrated ↔ typographic
- playful ↔ austere
- modern/tech ↔ nostalgic/print
- desktop-first ↔ mobile-first / app-shell
- narrative-driven ↔ data-driven

Before writing code, declare your aesthetic position in one paragraph.

---

## 4. Required surfaces for v4

At minimum:

1. **Home / landing screen** — entry point. Hero or featured slot, plus a way to discover series.
2. **Browse or library view** — the full catalog accessible.
3. **Reader view** — paged, vertical, or your novel reading layout. v4 picks.
4. **Tweaks panel** (floating, top-right or bottom-right) — at least theme toggle. Use the shared `useTweaks` hook (see §6).
5. **Review bar** — fixed pill, bottom-right, with a `← back to review` link to `../`. Mandatory across all prototypes.

---

## 5. Shared data — REUSE VERBATIM

Every prototype reads the same invented catalog. v4 must too. You do **not** need to write new data; just `<script src="data.jsx">` it.

The shape (already in `public/folio/data.jsx` — copy this file or symlink-equivalent into `public/v4/data.jsx`):

```js
// 12 invented manga series (titles & authors fictional)
const MANGA_CATALOG = [
  {
    id: "still-water",          // kebab-case slug, used for navigation
    title: "Still Water",
    author: "R. Inoue",
    year: 2023,
    chapters: 47,
    tags: ["Slice of life", "Drama"],
    type: "Manga",              // "Manga" | "Webtoon"
    direction: "RTL",           // "RTL" | "TTB"
    cover: "#3a2820",           // hex — placeholder color, no real cover image
    accent: "#c9956b",          // hex — secondary highlight
    synopsis: "A retired ferry captain returns…",
    featured: true,             // optional, only one is true
    rating: 4.7,
    pages: 18,
  },
  // … 11 more
];

const COLLECTIONS = [           // 3 curated groups, each ids: [...]
  { id: "quiet", title: "Quiet stories", subtitle: "For long evenings", ids: [...] },
  …
];

const CONTINUE_READING = [      // 3 in-progress bookmarks
  { id: "still-water", chapter: 23, page: 9, ofPages: 18, when: "2 hours ago" },
  …
];

const EDITORIAL_PICK = {        // single pull-quote feature
  id: "still-water",
  pull: "He had not expected the harbor to be smaller…",
  byline: "Editor's pick · Issue 14",
};

// Exposed globally so other JSX files can read them:
window.MANGA_CATALOG = MANGA_CATALOG;
window.COLLECTIONS = COLLECTIONS;
window.CONTINUE_READING = CONTINUE_READING;
window.EDITORIAL_PICK = EDITORIAL_PICK;
window.findManga = (id) => MANGA_CATALOG.find(m => m.id === id);
```

**No real cover images, no real manga IP.** All covers are placeholder color blocks rendered however your aesthetic dictates (typography, gradients, halftone, illustration glyphs — your call).

---

## 6. Conventions v4 must follow

**Folder layout:**
```
public/v4/
  index.html       — React root, fonts, review bar, App switcher
  styles.css       — all design tokens in :root
  data.jsx         — copy of public/folio/data.jsx (verbatim)
  cover.jsx        — your CoverPlaceholder component (window.Cover = ...)
  home.jsx         — HomeScreen component (window.HomeScreen = ...)
  reader.jsx       — Reader component (window.Reader = ...)
  [more].jsx       — additional screens as needed
```

**Module system:** there isn't one. Each `<script type="text/babel">` is independent. Components communicate by attaching themselves to `window.*`:

```jsx
function Cover({ manga, size }) { ... }
window.Cover = Cover;            // <-- required
```

**App-level view state pattern (from Folio):**
```jsx
function App() {
  const [view, setView] = useState({ name: "home" });   // or library, browse, reader
  const [tweaks, setTweak] = window.useTweaks(TWEAK_DEFAULTS);

  const openManga = (id) => setView({ name: "reader", id });
  const goHome    = () => setView({ name: "home" });
  const navigate  = (page) => setView({ name: page });

  return (
    <>
      {view.name === "home"   && <HomeScreen onOpenManga={openManga} onNavigate={navigate} />}
      {view.name === "browse" && <BrowseScreen onOpenManga={openManga} onNavigate={navigate} />}
      {view.name === "reader" && <Reader mangaId={view.id} onBack={goHome} layout={tweaks.layout} />}
      <window.TweaksPanel title="Tweaks">…</window.TweaksPanel>
    </>
  );
}
```

**Theming:** put all design tokens in `:root` as CSS custom properties. Drive light/dark via `[data-theme="light"]` / `[data-theme="dark"]` on `<html>`. Optional accent variants via `[data-accent="..."]`. Toggle by setting `document.documentElement.dataset.theme` from a `useEffect`.

**Mobile breakpoints** (match the rest of the project): 1100px / 860px / 560px.

**Tweaks panel API** (already exists at `public/folio/tweaks-panel.jsx` — `<script src>` it directly into v4):
```jsx
const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "theme": "light",
  // …whatever knobs your design wants to expose
}/*EDITMODE-END*/;

const [tweaks, setTweak] = window.useTweaks(TWEAK_DEFAULTS);

<window.TweaksPanel title="Tweaks">
  <window.TweakSection title="Appearance">
    <window.TweakRadio
      label="Theme" value={tweaks.theme}
      onChange={(v) => setTweak("theme", v)}
      options={[{ value: "light", label: "Light" }, { value: "dark", label: "Dark" }]}
    />
  </window.TweakSection>
</window.TweaksPanel>
```
Available controls: `TweakSection`, `TweakRadio`, `TweakSelect`, `TweakSlider`, `TweakColor`, `TweakToggle`, `TweakButton`, `TweakNumber`. Don't hand-roll inputs — use these. The `/*EDITMODE-BEGIN*/.../*EDITMODE-END*/` markers are required (host harness uses them).

---

## 7. Boilerplate to copy into `public/v4/index.html`

```html
<!DOCTYPE html>
<html lang="en" data-theme="light">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>v4 — [your aesthetic statement]</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <!-- Replace with the fonts your design needs: -->
  <link href="https://fonts.googleapis.com/css2?family=YourSerif:wght@400;500&family=YourSans:wght@400;500;600&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="styles.css" />

  <script src="https://unpkg.com/react@18.3.1/umd/react.development.js" crossorigin="anonymous"></script>
  <script src="https://unpkg.com/react-dom@18.3.1/umd/react-dom.development.js" crossorigin="anonymous"></script>
  <script src="https://unpkg.com/@babel/standalone@7.29.0/babel.min.js" crossorigin="anonymous"></script>
</head>
<body>
  <div id="root"></div>

  <style>
    .review-bar {
      position: fixed; bottom: 18px; right: 18px; z-index: 9999;
      background: #0e1a36; color: #e8dec4;
      padding: 10px 14px; border-radius: 10px;
      font-size: 11px; font-weight: 500;
      font-family: 'Inter Tight', system-ui, sans-serif;
      box-shadow: 0 4px 20px rgba(0,0,0,0.2);
      display: flex; gap: 10px; align-items: center;
    }
    .review-bar a { color: #c14a2a; font-weight: 600; text-decoration: none; }
    .review-bar a:hover { color: #e8dec4; }
  </style>
  <div class="review-bar">
    <span>v4 — design 04 · [short descriptor]</span>
    <a href="../">← back to review</a>
  </div>

  <!-- Reuse Folio's tweaks panel & data; add your own components -->
  <script type="text/babel" src="data.jsx"></script>
  <script type="text/babel" src="../folio/tweaks-panel.jsx"></script>
  <script type="text/babel" src="cover.jsx"></script>
  <script type="text/babel" src="home.jsx"></script>
  <script type="text/babel" src="reader.jsx"></script>

  <script type="text/babel">
    const { useState, useEffect } = React;

    const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
      "theme": "light"
      // add your knobs
    }/*EDITMODE-END*/;

    function App() {
      const [view, setView] = useState({ name: "home" });
      const [tweaks, setTweak] = window.useTweaks(TWEAK_DEFAULTS);

      useEffect(() => {
        document.documentElement.dataset.theme = tweaks.theme;
      }, [tweaks.theme]);

      const openManga = (id) => setView({ name: "reader", id });
      const goHome = () => setView({ name: "home" });

      return (
        <>
          {view.name === "home"   && <window.HomeScreen onOpenManga={openManga} />}
          {view.name === "reader" && <window.Reader mangaId={view.id} onBack={goHome} />}

          <window.TweaksPanel title="Tweaks">
            <window.TweakSection title="Appearance">
              <window.TweakRadio
                label="Theme" value={tweaks.theme}
                onChange={(v) => setTweak("theme", v)}
                options={[
                  { value: "light", label: "Light" },
                  { value: "dark", label: "Dark" },
                ]}
              />
            </window.TweakSection>
          </window.TweaksPanel>
        </>
      );
    }

    ReactDOM.createRoot(document.getElementById("root")).render(<App />);
  </script>
</body>
</html>
```

**Cover component skeleton** (`public/v4/cover.jsx` — replace internals with your aesthetic):
```jsx
function Cover({ manga, size = "md" }) {
  const dims = {
    xs: { w: 80,  h: 116 },
    sm: { w: 132, h: 196 },
    md: { w: 188, h: 278 },
    lg: { w: 260, h: 384 },
    xl: { w: 360, h: 528 },
  }[size];

  return (
    <div style={{ width: dims.w, height: dims.h, background: manga.cover, /* your treatment */ }}>
      {/* Your placeholder design — typography? gradients? halftone? glyphs? */}
    </div>
  );
}
window.Cover = Cover;
```

**Landing-page card** (add to `public/index.html` inside `.cards`):
```html
<a class="card" href="v4/">
  <span class="num">04 / [v4 name]</span>
  <h2>[v4 name]</h2>
  <p class="sub">[one-line aesthetic tagline]</p>
  <p>[2–3 sentence pitch — what's distinctive about this direction]</p>
  <span class="arrow">Open [v4 name] →</span>
</a>
```

---

## 8. Out of scope / forbidden

- ❌ No backend, no API, no real manga IP, no copyrighted cover art
- ❌ No build tools (Vite, webpack, esbuild), no TypeScript, no Tailwind/Sass/Less, no CSS-in-JS libraries
- ❌ No npm dependencies (everything from CDN)
- ❌ No localStorage / sessionStorage persistence — refresh resets state, that's intended
- ❌ Don't replicate Folio's, Riso's, or beachRead's visual language

---

## 9. What to deliver, in order

**Step 1 — Aesthetic statement.** One paragraph. Where on the design space does v4 sit? Why is it different from Folio / Riso / beachRead? Who would prefer this direction?

**Step 2 — Token palette.** Colors (light + dark if applicable), font families & sizes, spacing scale, radii, shadows. As CSS custom property declarations.

**Step 3 — File-by-file code.** Each file in its own fenced block, with the file path as a heading. Order:
```
## public/v4/index.html
[fenced html block]

## public/v4/styles.css
[fenced css block]

## public/v4/data.jsx
(copy verbatim from public/folio/data.jsx — say "copy as-is" rather than re-pasting 200 lines)

## public/v4/cover.jsx
[fenced jsx block]

## public/v4/home.jsx
[fenced jsx block]

## public/v4/reader.jsx
[fenced jsx block]

## public/index.html (patch)
[the new <a class="card"> snippet to insert]
```

**Step 4 — Drop-in instructions.** One short paragraph: "create folder, paste files, restart server, visit `/v4/`."

---

## 10. Reference files (already in the repo — read if you want to study the patterns)

- `server.js` — the entire server (16 lines)
- `package.json` — dependency list (just `express`)
- `README.md` — project status & stack rationale
- `public/index.html` — landing page (cards layout you'll add to)
- `public/folio/index.html` — most complete example of the App switcher pattern
- `public/folio/styles.css` — full CSS-variable theming approach (1292 lines, comprehensive)
- `public/folio/data.jsx` — the catalog (copy this verbatim)
- `public/folio/cover.jsx` — example cover component (yours should look different)
- `public/folio/tweaks-panel.jsx` — the shared Tweaks API (don't rewrite, just `<script src>`)
- `public/riso/index.html` & `public/beach/index.html` — different stylistic takes

---

Now: declare your aesthetic position, then deliver the files.
