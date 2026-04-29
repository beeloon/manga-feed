# Real Manga Data — Design Spec

Date: 2026-04-29
Status: Approved (draft)

## Goal

Make the three review designs (Folio, Riso, Beach) feel real by populating them with actual manga titles and cover art instead of invented placeholders. Hide the Night Desk (`gpt/`) prototype from the review surface without deleting it.

## Scope

In:
- Hide `/gpt` route from the landing review surface.
- Replace placeholder catalog in Folio + Riso with the same 13 real titles already used by Beach.
- Fetch real cover images, banners, and 2–3 sample panels per title, stored locally.
- Wire those assets into Folio, Riso, and Beach (covers + reader pages).

Out:
- No new design work.
- No changes to `public/gpt/`.
- No build pipeline beyond a single one-shot Node script.
- No DB, no CMS, no live API at runtime.

## Title list (13)

From `public/beach/index.html` ranking + recent updates:

1. Berserk
2. JoJo no Kimyou na Bouken Part 7: Steel Ball Run
3. Vagabond
4. One Piece
5. Monster
6. Slam Dunk
7. Vinland Saga
8. Fullmetal Alchemist
9. Grand Blue
10. Kingdom
11. Ghost Fixers
12. Gokurakugai
13. Gachiakuta

## Hide gpt/

- `public/index.html`: remove the Night Desk `<a class="card" href="gpt/">` block. Update headline copy "four design directions" → "three design directions". Grid auto-fits to 3 cards (current 2-col layout still reads fine; one card wraps to second row on wide, single col on mobile).
- `server.js`: remove the `console.log` line for `/gpt`.
- `public/gpt/` directory: untouched. Static middleware will still serve the route directly if a URL is hit, but no nav surface points to it.

## Asset pipeline

One-shot Node script: `scripts/fetch-manga-assets.js`. Run via `npm run fetch:assets`.

For each title:

1. Query AniList GraphQL (`https://graphql.anilist.co`, no auth key) by romaji title. Pull:
   - `coverImage.extraLarge` and `coverImage.large`
   - `bannerImage`
   - `title.romaji`, `title.native`, `title.english`
   - `description` (HTML — strip tags), `startDate.year`, `chapters`, `genres`
   - `staff` first edge for author
2. Download cover → `public/assets/manga/<id>/cover.jpg`.
3. Download banner if present → `public/assets/manga/<id>/banner.jpg`.
4. Sample panels (best effort):
   - Hit Wikipedia REST `page/media-list/<title>` for each title's English Wikipedia article. Pull up to 3 image URLs that are not the cover. Download as `panel-1.jpg`, `panel-2.jpg`, `panel-3.jpg`.
   - If fewer than 3 distinct panels found, repeat banner then cover to fill out 3 slots. Log the fallback.
5. Append entry to `public/assets/manga/manifest.json`.

`id` slugs match the ids already used in beach (`berserk`, `jojo`, `vagabond`, `onepiece`, `monster`, `slamdunk`, `vinland`, `fma`, `grandblue`, `kingdom`, `ghost-fixers`, `gokuragukai`, `gachiakuta`).

### Manifest shape

```json
{
  "berserk": {
    "id": "berserk",
    "title": "Berserk",
    "jpTitle": "ベルセルク",
    "englishTitle": "Berserk",
    "author": "Kentaro Miura",
    "year": 1989,
    "chapters": 376,
    "genres": ["Action", "Drama", "Fantasy"],
    "synopsis": "...",
    "cover": "/assets/manga/berserk/cover.jpg",
    "banner": "/assets/manga/berserk/banner.jpg",
    "panels": [
      "/assets/manga/berserk/panel-1.jpg",
      "/assets/manga/berserk/panel-2.jpg",
      "/assets/manga/berserk/panel-3.jpg"
    ]
  }
}
```

Beach, Folio, and Riso all read from this single manifest at runtime (already-fetched static JSON).

## Wiring into designs

### Folio (`public/folio/`)

- Add `<script src="../assets/manga/manifest.json">`-style fetch in `data.jsx` (or inline `<script>` that assigns to `window.MANGA_MANIFEST`).
- Rewrite `MANGA_CATALOG` to 13 real entries built from the manifest. Keep Folio's extra fields (`tags`, `direction`, `cover` color, `accent`, `pages`, `featured`, `rating`) — derive `tags` from genres, default `direction: "RTL"` for all, keep an accent palette, set Vagabond featured.
- Update `COLLECTIONS` so the three groups reference real ids (any sensible split — e.g. seinen drama / shounen action / recent updates).
- Update `CONTINUE_READING` to reference real ids.
- Replace `EDITORIAL_PICK` with a Vagabond pull quote.
- `cover.jsx`: when an entry has `coverPath`, render `<img>` instead of the painted div. Keep painted-div fallback for resilience.

### Riso (`public/riso/manga-feed/`)

- Same swap in `data.jsx`. Riso's color/halftone treatments keep working over real covers via CSS blend modes (already in styles).
- `cover.jsx`: same `<img>` upgrade with painted fallback.

### Beach (`public/beach/`)

- Replace `.rank-cover cv*` letter tiles with `<img class="rank-cover" src="...">` referencing the manifest. Keep the same dimensions and border treatment.
- Replace `.recent-item .cover cv*` letter tiles likewise.
- Hero already says Vagabond — point `vagabond-hero.jpg` reference at the new banner if AniList provides one; otherwise keep the existing illustration.
- Update `series.html` and `reader.html` to use real cover + sample panels by id query param.

## Reader pages

For each design's reader:

- On open, look up the active title in the manifest.
- Use `panels[0..2]` as the three reading spreads. If a design's reader expects more pages than panels, repeat panels.
- Keep the existing chrome (page count, RTL/LTR toggle, etc.) — only the image source changes.

## Risks / mitigations

- AniList rate limit: 90 req/min. 13 lookups is well under. Sleep 200ms between calls just to be polite.
- Wikipedia panel coverage spotty: fallback to banner+cover repeat keeps every title with 3 image slots filled.
- Image licensing: cover art and small panel excerpts are used as editorial reference inside a non-public design review prototype. Acceptable for this review build. Not for production deployment.
- Manifest fetch failure: each design keeps its current placeholder code path as a fallback so prototypes still render offline.

## Acceptance criteria

- Visiting `/` shows three cards (Folio, Riso, Beach), no Night Desk card.
- `npm run fetch:assets` populates `public/assets/manga/<id>/cover.jpg`, `banner.jpg` (where available), and 3 panel files for all 13 titles, plus `manifest.json`.
- Folio, Riso, and Beach landing pages all render real covers for the 13 titles.
- Opening any series in any of the three designs shows real cover + 2–3 real panels in the reader.
- `public/gpt/` files unchanged on disk.
- No external network calls at request time — all assets served from `public/assets/manga/`.
