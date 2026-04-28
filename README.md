# Manga Feed

A manga reader web app — browse, follow, and read series in a clean reading-first interface.

This repository currently hosts an **MVP review build**: two designer-supplied HTML/CSS/JS prototypes served side-by-side so the team can compare directions before committing to a production stack.

## Live demo

After GitHub Pages is configured, the site will be available at:
**https://beeloon.github.io/manga-feed/**

- `/` — landing page with two design cards
- `/folio/` — "Folio", a warm editorial reading library
- `/riso/` — "Riso/Read", a risograph-zine alternate

Each prototype includes a Tweaks panel (top-right) for toggling theme, accent, layout, and font pairing.

## Run locally

```bash
npm install
npm start
# open http://localhost:3000
```

The local server is plain Express serving `public/` as static files. GitHub Pages serves the same `public/` directory without Express — it only handles directory `index.html` resolution and trailing-slash redirects, both of which Pages does natively.

## Stack

- **Static-only.** No build step. No bundler. No framework runtime in the repo.
- Prototypes use React 18 UMD + Babel-standalone via `<script type="text/babel">` (loaded from unpkg). Babel runs in the browser. ~1.5 MB on first load — acceptable for review, replaced when productionizing.
- Express is local-dev convenience only.

## Status

This is **not** the production app. It's a review harness. Once a design direction is chosen, the next phase is a Vite + React + React Router port.

See `docs/superpowers/specs/2026-04-28-manga-feed-mvp-design.md` for the full MVP spec.
