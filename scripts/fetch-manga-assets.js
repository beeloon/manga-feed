#!/usr/bin/env node
// Fetch real manga covers + sample panels from AniList + Wikipedia.
// One-shot. Run via: npm run fetch:assets

const fs = require("fs/promises");
const path = require("path");

const OUT_DIR = path.join(__dirname, "..", "public", "assets", "manga");

const TITLES = [
  { id: "berserk",      anilist: "Berserk",                                     wiki: "Berserk_(manga)" },
  { id: "jojo",         anilist: "Steel Ball Run",                              wiki: "Steel_Ball_Run" },
  { id: "vagabond",     anilist: "Vagabond",                                    wiki: "Vagabond_(manga)" },
  { id: "onepiece",     anilist: "One Piece",                                   wiki: "One_Piece" },
  { id: "monster",      anilist: "Monster", anilistId: 30001,                   wiki: "Monster_(manga)" },
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

const ANILIST_URL = "https://graphql.anilist.co";

const ANILIST_QUERY = `
query ($search: String, $id: Int) {
  Media(search: $search, id: $id, type: MANGA, sort: SEARCH_MATCH) {
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

async function anilistLookup({ search, id }) {
  const variables = id ? { id } : { search };
  const res = await fetch(ANILIST_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({ query: ANILIST_QUERY, variables }),
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

    let media = null;
    try {
      media = await anilistLookup({ search: t.anilist, id: t.anilistId });
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

    manifest[t.id] = entry;
    await sleep(700); // be polite (~85/min, under AniList's 90/min)
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
