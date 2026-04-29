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
