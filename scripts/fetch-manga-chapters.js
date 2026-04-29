#!/usr/bin/env node
// Fetch chapter 1 pages for each title via the MangaDex API.
// Run via: npm run fetch:chapters
//
// Output:
//   public/assets/manga/<id>/ch1/p001.<ext> ...
//   manifest.json gains entry[id].chapter1 = { id, lang, title, pages: [...] }

const fs = require("fs/promises");
const path = require("path");

const ASSETS_DIR  = path.join(__dirname, "..", "public", "assets", "manga");
const MANIFEST    = path.join(ASSETS_DIR, "manifest.json");
const MD_BASE     = "https://api.mangadex.org";
const UA          = "manga-feed-mvp/0.1 (design review prototype)";
const HEADERS     = { "User-Agent": UA, Accept: "application/json" };

// Per-title search overrides — used when the auto search misses.
const SEARCH_OVERRIDES = {
  "ghost-fixers": "Ghost Fixers",
  gokuragukai:   "Gokurakugai",
  jojo:          "JoJo's Bizarre Adventure: Steel Ball Run",
};

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function getJson(url, attempt = 1) {
  try {
    const res = await fetch(url, { headers: HEADERS });
    if (res.status === 429 || res.status >= 500) {
      if (attempt > 4) throw new Error(`${res.status} after retries: ${url}`);
      const wait = 500 * 2 ** attempt;
      console.warn(`  retry ${attempt} in ${wait}ms (${res.status})`);
      await sleep(wait);
      return getJson(url, attempt + 1);
    }
    if (!res.ok) throw new Error(`${res.status} ${res.statusText} ${url}`);
    return res.json();
  } catch (err) {
    if (attempt > 4) throw err;
    await sleep(500 * 2 ** attempt);
    return getJson(url, attempt + 1);
  }
}

async function downloadBinary(url, outPath, attempt = 1) {
  try {
    const res = await fetch(url, { headers: { "User-Agent": UA } });
    if (!res.ok) throw new Error(`${res.status} ${url}`);
    const buf = Buffer.from(await res.arrayBuffer());
    await fs.writeFile(outPath, buf);
  } catch (err) {
    if (attempt > 3) throw err;
    await sleep(400 * attempt);
    return downloadBinary(url, outPath, attempt + 1);
  }
}

async function searchManga(query) {
  const url = `${MD_BASE}/manga?title=${encodeURIComponent(query)}&limit=5&order[relevance]=desc&contentRating[]=safe&contentRating[]=suggestive&contentRating[]=erotica`;
  const json = await getJson(url);
  return json.data || [];
}

function pickBestMatch(results, query) {
  if (!results.length) return null;
  const q = query.toLowerCase();
  // prefer exact-ish title match across any locale
  for (const r of results) {
    const titles = Object.values(r.attributes?.title || {});
    const alts   = (r.attributes?.altTitles || []).flatMap((o) => Object.values(o || {}));
    const all    = [...titles, ...alts].map((s) => String(s).toLowerCase());
    if (all.some((t) => t === q || t.includes(q) || q.includes(t))) return r;
  }
  return results[0];
}

async function findChapterOne(mangaId) {
  // Many big-name manga show chapter rows as external links with no pages
  // re-hosted on MangaDex. Strategy:
  //  - pull a wide window of chapters across en+ja (sorted ascending)
  //  - keep only rows with pages > 0 (i.e. actually fetchable)
  //  - prefer chapter "1", else the lowest numeric chapter we have pages for
  // Three sweeps: en, ja, then any-language. Big-name licensed manga usually
  // have all en/ja rows as external links (no pages). Community uploads in
  // other languages still ship real images.
  const sweeps = [
    { langParam: "&translatedLanguage[]=en", lang: "en" },
    { langParam: "&translatedLanguage[]=ja", lang: "ja" },
    { langParam: "", lang: null },
  ];
  const all = [];
  for (const sweep of sweeps) {
    if (all.length) break; // earlier sweep already produced something
    let offset = 0;
    while (offset < 500) {
      const url = `${MD_BASE}/manga/${mangaId}/feed`
        + `?order[chapter]=asc&limit=100&offset=${offset}`
        + sweep.langParam
        + `&contentRating[]=safe&contentRating[]=suggestive&contentRating[]=erotica`
        + `&includes[]=scanlation_group`;
      let json;
      try { json = await getJson(url); } catch { break; }
      const data = json.data || [];
      if (!data.length) break;
      for (const c of data) {
        if ((c.attributes?.pages || 0) > 0) {
          all.push({ chapter: c, lang: sweep.lang || c.attributes?.translatedLanguage || "??" });
        }
      }
      if (data.length < 100) break;
      offset += 100;
      await sleep(150);
    }
  }
  if (!all.length) return null;
  const numOf = (c) => {
    const v = c.chapter.attributes?.chapter;
    const n = Number(v);
    return Number.isFinite(n) ? n : Infinity;
  };
  // Prefer en over ja for ties.
  all.sort((a, b) => {
    const d = numOf(a) - numOf(b);
    if (d !== 0) return d;
    return a.lang === "en" ? -1 : (b.lang === "en" ? 1 : 0);
  });
  const exact = all.find((x) => x.chapter.attributes?.chapter === "1");
  return exact || all[0];
}

async function fetchAtHome(chapterId) {
  const json = await getJson(`${MD_BASE}/at-home/server/${chapterId}`);
  return {
    baseUrl: json.baseUrl,
    hash: json.chapter.hash,
    pages: json.chapter.data, // full quality filenames
  };
}

function pad(n, width = 3) {
  return String(n).padStart(width, "0");
}

async function processTitle(id, manifestEntry) {
  const query = SEARCH_OVERRIDES[id]
    || manifestEntry.englishTitle
    || manifestEntry.title
    || id;
  console.log(`\n• ${id}  query="${query}"`);

  let mangaId, mangaTitle;
  try {
    const results = await searchManga(query);
    const match = pickBestMatch(results, query);
    if (!match) { console.warn("  no search results"); return null; }
    mangaId = match.id;
    mangaTitle = Object.values(match.attributes?.title || {})[0] || query;
    console.log(`  matched: ${mangaTitle} (${mangaId})`);
  } catch (e) {
    console.warn(`  search failed: ${e.message}`); return null;
  }

  await sleep(250);

  let pick;
  try {
    pick = await findChapterOne(mangaId);
    if (!pick) { console.warn("  no chapter 1 found"); return null; }
  } catch (e) {
    console.warn(`  feed failed: ${e.message}`); return null;
  }

  const chapterId  = pick.chapter.id;
  const chapterNum = pick.chapter.attributes?.chapter || "1";
  const chapterLang = pick.lang;
  const chapterName = pick.chapter.attributes?.title || `Chapter ${chapterNum}`;
  console.log(`  chapter ${chapterNum} (${chapterLang}) — ${chapterId}`);

  await sleep(250);

  let serv;
  try {
    serv = await fetchAtHome(chapterId);
  } catch (e) {
    console.warn(`  at-home failed: ${e.message}`); return null;
  }

  if (!serv.pages?.length) { console.warn("  zero pages"); return null; }

  const outDir = path.join(ASSETS_DIR, id, "ch1");
  await fs.mkdir(outDir, { recursive: true });

  const pagePaths = [];
  for (let i = 0; i < serv.pages.length; i++) {
    const filename = serv.pages[i];
    const ext = path.extname(filename) || ".jpg";
    const url = `${serv.baseUrl}/data/${serv.hash}/${filename}`;
    const localName = `p${pad(i + 1)}${ext}`;
    const localPath = path.join(outDir, localName);
    process.stdout.write(`  page ${i + 1}/${serv.pages.length}\r`);
    try {
      await downloadBinary(url, localPath);
      pagePaths.push(`/assets/manga/${id}/ch1/${localName}`);
    } catch (e) {
      console.warn(`\n  page ${i + 1} failed: ${e.message}`);
    }
    await sleep(120);
  }
  console.log(`  saved ${pagePaths.length} pages`);

  return {
    id: chapterId,
    chapter: chapterNum,
    lang: chapterLang,
    title: chapterName,
    pages: pagePaths,
  };
}

async function main() {
  const raw = await fs.readFile(MANIFEST, "utf8");
  const manifest = JSON.parse(raw);
  // CLI flags: --only=a,b,c   --force (refetch existing)
  const args = process.argv.slice(2);
  const onlyArg = args.find((a) => a.startsWith("--only="));
  const onlyIds = onlyArg ? onlyArg.slice("--only=".length).split(",").filter(Boolean) : null;
  const force = args.includes("--force");

  const ids = Object.keys(manifest).filter((id) => !onlyIds || onlyIds.includes(id));

  for (const id of ids) {
    if (!force && manifest[id]?.chapter1?.pages?.length) {
      console.log(`\n• ${id}  skip (already has ${manifest[id].chapter1.pages.length} pages)`);
      continue;
    }
    try {
      const result = await processTitle(id, manifest[id]);
      if (result && result.pages.length) {
        manifest[id].chapter1 = result;
        // Persist incrementally so partial runs aren't wasted.
        await fs.writeFile(MANIFEST, JSON.stringify(manifest, null, 2) + "\n", "utf8");
      }
    } catch (e) {
      console.warn(`! ${id} failed: ${e.message}`);
    }
    await sleep(400);
  }

  console.log("\ndone.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
