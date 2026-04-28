# Manga Feed MVP — Design Spec

**Date:** 2026-04-28
**Status:** Approved (verbal)
**Approach:** Option A — static-serve designer prototypes as-is.

## Goal

Stand up a tiny Express server so the user can open `Folio.html` and `Riso-Read.html` (designer-supplied prototypes) in a browser at stable URLs. Purpose: visual review of the two design directions to decide what to invest in for the production app.

This is a **review harness**, not the production app. It serves the React+Babel-standalone prototypes unchanged.

## Source bundle

Designer handoff bundle extracted at `/tmp/folio-design/manga-feed/`. Two prototype entry points:

- `project/Folio.html` — main reading library design. Loads sibling files: `styles.css`, `data.jsx`, `cover.jsx`, `browse-updates.jsx`, `home.jsx`, `reader.jsx`, `tweaks-panel.jsx`.
- `project/Riso-Read.html` — alternate "risograph zine" reader. Loads `manga-feed/styles.css`, `manga-feed/data.jsx`, `manga-feed/cover.jsx`, `manga-feed/riso.jsx`, and parent-level `tweaks-panel.jsx`.

Both prototypes use React 18 UMD + Babel-standalone via `<script type="text/babel">` from unpkg. No build step required at runtime.

## Architecture

```
manga-feed-mvp/
├── package.json
├── server.js
└── public/
    ├── index.html        # landing — two links
    ├── folio/
    │   ├── index.html    # was Folio.html (renamed)
    │   ├── styles.css
    │   ├── data.jsx
    │   ├── cover.jsx
    │   ├── browse-updates.jsx
    │   ├── home.jsx
    │   ├── reader.jsx
    │   ├── tweaks-panel.jsx
    │   └── uploads/      # only image assets actually referenced
    └── riso/
        ├── index.html    # was Riso-Read.html (renamed)
        ├── tweaks-panel.jsx
        └── manga-feed/
            ├── styles.css
            ├── data.jsx
            ├── cover.jsx
            └── riso.jsx
```

### Why rename to `index.html`

The prototypes use **bare relative paths** for siblings (e.g. `<script src="data.jsx">`). Browsers resolve such paths against the current URL. Serving the file at `/folio` (no trailing slash) would resolve `data.jsx` to `/data.jsx` (404). Serving as `/folio/index.html` (and accessing as `/folio/`) resolves to `/folio/data.jsx` correctly.

Therefore: rename each entry HTML to `index.html` inside its route directory, and 301-redirect `/folio` → `/folio/` and `/riso` → `/riso/` so users typing the bare path hit the trailing-slash form.

## Routes

| URL          | Behavior                                                  |
|--------------|-----------------------------------------------------------|
| `/`          | Landing page (`public/index.html`) with two links         |
| `/folio`     | 301 redirect to `/folio/`                                 |
| `/folio/`    | Serves `public/folio/index.html` (the Folio prototype)    |
| `/folio/*`   | Static asset serving from `public/folio/`                 |
| `/riso`      | 301 redirect to `/riso/`                                  |
| `/riso/`     | Serves `public/riso/index.html` (the Riso/Read prototype) |
| `/riso/*`    | Static asset serving from `public/riso/`                  |

## Server (`server.js`)

Plain Express, single file, ~30 lines:

```js
const express = require('express');
const path = require('path');

const app = express();
const PUBLIC = path.join(__dirname, 'public');

app.get('/folio', (_, res) => res.redirect(301, '/folio/'));
app.get('/riso',  (_, res) => res.redirect(301, '/riso/'));

app.use(express.static(PUBLIC));

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Manga Feed MVP — http://localhost:${port}`));
```

`express.static` auto-serves `index.html` for directory requests. No view engine, no middleware beyond static.

## Landing page (`public/index.html`)

Single static HTML file. Warm cream palette to match the designs (`#f3ead9` background, `#2a2622` text, terracotta accent for links). Two links presented as editorial cards:

- **Folio** — "a reading library" — links to `/folio/`
- **Riso/Read** — "risograph zine" — links to `/riso/`

Plus a one-line note: "MVP review build — toggle through screens with the Tweaks panel in each design."

No JS, no fonts beyond system stack, no build. ~50 lines of HTML+inline CSS.

## Asset selection

`Folio.html`'s `home.jsx`, `reader.jsx`, etc. may reference images in `uploads/`. The bundle ships 9 PNGs but not all are referenced. Action: grep referenced filenames from the jsx files, copy only those into `public/folio/uploads/`. If none referenced, omit the `uploads/` directory entirely.

`Riso-Read.html` and its `manga-feed/*.jsx` files: same audit. Most likely no `uploads/` references (riso design is typography + tone-blocks per chat transcript), but verify before assuming.

## What stays from the prototypes

- **Tweaks panel** — kept. Lets the user toggle theme, accent, layout, font pairing, etc., which is the *exact* point of an MVP review build.
- **Babel-in-browser** — kept. ~1.5 MB on first load; acceptable for local review. Removed in any future production port.
- **All mock data** in `data.jsx` files — unchanged.

## Out of scope (explicit)

- No backend API. No database. No real manga pages.
- No authentication, accounts, comments, bookmarks persistence.
- No build step. No bundler. No TypeScript.
- No production deployment. Localhost only.
- No mobile-specific work beyond whatever the mocks already do.
- No porting the JSX to ES modules — that is a **future** decision once the user picks a direction.
- No removing the Tweaks panel — explicitly kept for review.

## Done definition

1. `cd manga-feed-mvp && npm install && node server.js` runs without error.
2. `http://localhost:3000/` shows the landing page with two working links.
3. `http://localhost:3000/folio/` renders the Folio design with no console errors and Tweaks panel functional.
4. `http://localhost:3000/riso/` renders the Riso/Read design with no console errors and Tweaks panel functional.
5. Both designs visually match the prototypes (no regressions from the bundle).

## Risks / known issues

- **CSP / CORS for unpkg scripts** — designs load React + Babel from unpkg. If the user is offline or behind a strict proxy, both routes break. Acceptable for MVP; a follow-up could vendor the scripts.
- **Babel-in-browser warnings** — Babel-standalone prints a console warning that it is not for production. Expected; ignore.
- **Tweaks panel state is in-memory** — refreshing the page resets toggles. Designer-intended behavior.
- **Path collisions** — if `home.jsx` or other jsx files reference assets via paths like `/uploads/...` (absolute root), they break under the `/folio/` prefix. Mitigation: audit at copy time and rewrite to relative paths if needed.

## Future considerations (not built now)

Once the user reviews and picks a direction, the natural next phases are:

1. Pick which prototype to productionize (Folio likely, given chat history).
2. Port that prototype to a real Vite + React + React Router app.
3. Replace mock data with a content source.
4. Decide on theming as compile-time tokens vs runtime tweaks.

These are explicitly **not** part of this MVP. This spec ends when the user can see both designs in their browser.
