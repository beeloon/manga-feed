# Manga Feed — brief for designing prototype v4 (UI/UX only, no code)

> Paste this whole file into ChatGPT as your first message. ChatGPT should return **design artifacts only** — no HTML/CSS/JSX. Code comes later, separately.

---

## 1. Your role

You are designing the **fourth visual direction** for a manga reader web app. Three directions already exist (Folio, Riso, beachRead) and the team needs a clearly different fourth option to compare.

**You have full creative freedom on the aesthetic.** Don't duplicate the three existing directions (described below). Pick a posture, justify it, then describe the design end-to-end in enough detail that a developer (or a separate code-generation step) can build it without inventing anything.

**Output: design only. No code.**

---

## 2. Product context

- **Product:** a manga reader web app — browse a catalog of series, follow them, read chapters page-by-page or vertically.
- **Audience:** readers who want a calm, focused reading experience. Not a social platform.
- **Catalog scale:** ~12 invented series for the prototype (titles, authors, synopses, ratings, tags, page counts). All cover art is placeholder — no real images.
- **Surfaces required:** home/landing, browse/library, reader. Plus a tweaks panel for theme/layout toggles and a fixed "back to review" pill.

---

## 3. The three existing directions (DO NOT DUPLICATE)

**01 / Folio** — warm editorial reading library. Cream + terracotta palette. Newsreader serif + Inter sans. Italic serif headings, monospace eyebrow labels. Sparse, typography-first. Reader supports paged single, paged double, vertical with auto-hiding chrome.

**02 / Riso/Read** — print-shop risograph zine. Cream paper + navy ink, halftone dot texture. Monospace-heavy (JetBrains Mono dominant). Hard edges, no blurs. Print-magazine posture, centered container.

**03 / beachRead** — editorial portal / "product"-shaped. Cream + navy + red accent. Playfair Display + Inter + Noto Sans JP. Hero with bleeding ink-wash image, ranked trending tables, news grid, recently-added shelf. The most SaaS-like of the three.

**v4 needs to land somewhere clearly different.** Some axes to push along:
- dense ↔ airy
- illustrated ↔ typographic
- playful ↔ austere
- modern/tech ↔ nostalgic/print
- desktop-first ↔ mobile-first / app-shell
- narrative-driven ↔ data-driven
- chromatic / saturated ↔ monochrome
- skeuomorphic ↔ flat
- formal ↔ informal

---

## 4. What to deliver

Return these sections, in this exact order:

### A. Aesthetic position (1 paragraph)
Where on the design space does v4 sit? Who is it for? Why is it different from Folio / Riso / beachRead? What feeling should the reader have on first open? What inspirations or design references are you drawing on (cite real artifacts: a magazine, a book series, an OS, a film title sequence — be specific).

### B. Design tokens
- **Color palette:** named swatches with hex values, for both light and dark mode if applicable. Show foreground / background / accent / muted / divider roles.
- **Typography:** font families (real Google-Fonts-available choices), pairings, type scale (eyebrow / body / heading / display sizes), italic and weight usage rules.
- **Spacing scale:** the spacing units the design uses (4 / 8 / 12 / 16 …).
- **Radii, shadows, borders, motion:** what the surface treatment is. Crisp? Soft? Floating? Inset? What animations exist and where (page transitions, hover states, reader page turns).
- **Texture / atmosphere:** any grain, noise, halftone, paper texture, gradient effects.

### C. Component vocabulary
For each repeated UI element, describe shape and behavior in prose:
- **Cover placeholder** — how is a cover rendered when there's no real image? (Folio uses solid color + typography; beachRead uses gradient + initials; Riso uses stripes.) Pick your treatment.
- **Card / list-item** — how is a series presented in a grid or list?
- **Buttons / links / chips** — primary, secondary, ghost.
- **Navigation** — top bar, sidebar, tab bar, command bar?
- **Tweaks panel** — how does it present (floating, drawer, modal)? Don't redesign its controls (segmented radios, sliders, toggles already exist), just describe how it sits in your aesthetic.

### D. Screen-by-screen layouts
For each of the three screens, describe layout, hierarchy, and content with enough specificity that a designer or developer can rebuild it without guessing. Use **ASCII wireframes** (or describe regions explicitly), and note the breakpoint behavior at desktop, tablet (~860px), mobile (~560px).

#### D.1 Home / landing
- Above-the-fold hierarchy
- Featured / hero treatment
- Discovery surfaces (collections, continue-reading, editorial pick)
- Footer / persistent chrome

#### D.2 Browse / library
- Filter / sort surfaces
- Grid vs list mode (and which is default)
- Card density
- Empty state, loading state

#### D.3 Reader
- Single-page / double-page / vertical scroll — pick which v4 supports and why
- Chrome behavior (always visible? auto-hide? click-to-toggle?)
- Page progress indicator
- Chapter list access (drawer? overlay? back button?)
- Settings affordances (brightness, layout switch, etc. if applicable)

### E. Microcopy & voice
- Eyebrow / label voice (formal? terse? playful?)
- Empty-state copy samples
- One sample series-card with the actual rendered text (title, author, synopsis snippet, tag chips)

### F. Mood references
Either:
- 3–5 emoji "mood collages" (e.g., 🌫️ 🪟 ✒️ 🕰️) with one-line explanations, OR
- 3–5 specific real-world references (book cover designers, web designers, print magazines, films, games) with one line each on what to borrow and what to leave behind

### G. Differentiation summary (1 short table)
A 4-row table showing **Folio / Riso / beachRead / v4** across 3–4 dimensions (e.g., palette, type, posture, primary feeling). Make it obvious at a glance how v4 stands apart.

### H. Open questions (optional)
If you intentionally left something undecided, list it here as 2–3 bullets so the team can answer.

---

## 5. Constraints — what v4 must respect

- **Same content model:** 12 invented series with title, author, year, chapters, tags, type (Manga/Webtoon), direction (RTL/TTB), synopsis, rating, pages. Plus three curated collections, three "continue reading" entries, and one editorial pull-quote. Don't propose new content fields without justification.
- **No real manga IP** — no real series titles, no real artist names, no copyrighted covers.
- **No real cover images required** — placeholders are fine; show how they look.
- **Web only.** Desktop-first or mobile-first your call, but it ships in a browser.
- **Three breakpoints** the project already uses: 1100 / 860 / 560 px.
- **Tweaks panel must exist** — it's a project-wide convention. Theme toggle minimum; you can add more knobs.
- **A fixed "← back to review" pill is mandatory** — the design lives in a review harness alongside Folio / Riso / beachRead.

---

## 6. Format & rendering rules

- **No code blocks of HTML/CSS/JSX.** If you catch yourself writing `<div>` or `style={{}}`, stop.
- **ASCII wireframes are welcome.** Use box-drawing characters or simple `+--+` boxes.
- **Tables welcome** for token palettes and the differentiation summary.
- **Markdown headings** at H2/H3 so the document is scannable.
- **Be specific.** "A muted earthy palette" is not specific. "#2f3a2c forest, #d8c8a4 oat, #b34a2e brick, with #1a1a1a near-black for ink and #f6f1e6 cream paper" is specific.
- **Length:** thorough but not padded. ~1500–3000 words plus wireframes is reasonable.

---

## 7. Reference: the catalog content the design must accommodate

Sample series (so your wireframes use real-feeling content, not lorem):
- *Still Water* — R. Inoue · 2023 · 47 chapters · Slice of life, Drama · "A retired ferry captain returns to the inland sea after thirty years away…"
- *Lantern Quarter* — M. Sato · 2024 · 12 chapters · Mystery, Historical · "Edo, late autumn. A clerk who can read the small handwriting of the dead…"
- *The Glassblower* — K. Hayashi · 2022 · 86 chapters · Drama, Coming of age
- *North of Eight* — T. Mori · 2024 · 8 chapters · Sci-fi, Quiet · Webtoon (vertical)
- *Salt and Paper* — A. Fujita · 2023 · 28 chapters · Slice of life, Food

Editorial pull-quote (Editor's Pick):
> "He had not expected the harbor to be smaller. He had expected, if anything, that thirty years away would have made everything else smaller, and the harbor by contrast enormous."

Use these for sample cards in your wireframes.

---

Now: declare your aesthetic position, then deliver sections A–H.
