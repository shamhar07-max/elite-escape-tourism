/* Downloads every hotlinked images.unsplash.com URL referenced across the site into
 * assets/img/, then rewrites every .html file to point at the local copy instead.
 *
 * Why: hotlinking images.unsplash.com at this volume (600+ references across 691 pages)
 * is fragile in production — Unsplash throttles/blocks high-volume unauthenticated
 * hotlinking, which is why images intermittently fail to load on a live deploy even
 * though nothing in your own stack is broken.
 *
 * Usage (run on a machine with normal internet access — this sandbox's egress policy
 * blocks images.unsplash.com, so it cannot run this itself):
 *   node scripts/localize-images.mjs
 *
 * Safe to re-run: already-downloaded files are skipped, and it only ever rewrites the
 * exact URLs it finds (no guessing).
 */
import { readdirSync, statSync, readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const IMG_DIR = join(root, "assets", "img");
mkdirSync(IMG_DIR, { recursive: true });

const walk = (dir) => {
  let files = [];
  for (const e of readdirSync(dir)) {
    if (e === "node_modules" || e === ".git") continue;
    const p = join(dir, e);
    if (statSync(p).isDirectory()) files.push(...walk(p));
    else if (e.endsWith(".html")) files.push(p);
  }
  return files;
};

const htmlFiles = walk(root);
const cssFile = join(root, "assets", "css", "main.css");
const targetFiles = existsSync(cssFile) ? [...htmlFiles, cssFile] : htmlFiles;
const URL_RE = /https:\/\/images\.unsplash\.com\/photo-[\w-]+\?[^"'\s)]+/g;
const urlToLocal = new Map();

for (const f of targetFiles) {
  const src = readFileSync(f, "utf8");
  for (const m of src.matchAll(URL_RE)) urlToLocal.set(m[0], null);
}

console.log(`Found ${urlToLocal.size} distinct image URLs across ${targetFiles.length} files.`);

const slugFor = (url) => {
  const id = (url.match(/photo-([\w-]+)/) || [, "img"])[1];
  const w = (url.match(/[?&]w=(\d+)/) || [, "orig"])[1];
  return `${id}-${w}.jpg`;
};

let downloaded = 0, skipped = 0, failed = 0;
for (const url of urlToLocal.keys()) {
  const name = slugFor(url);
  const dest = join(IMG_DIR, name);
  urlToLocal.set(url, `/assets/img/${name}`);
  if (existsSync(dest)) { skipped++; continue; }
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const buf = Buffer.from(await res.arrayBuffer());
    writeFileSync(dest, buf);
    downloaded++;
    if (downloaded % 25 === 0) console.log(`  downloaded ${downloaded}...`);
  } catch (e) {
    failed++;
    console.warn(`  FAILED ${url} — ${e.message}`);
  }
}
console.log(`Downloaded ${downloaded}, skipped (already local) ${skipped}, failed ${failed}.`);

// og:image / twitter:image meta tags require an ABSOLUTE url per spec — leave those
// pointing at Unsplash (fetched rarely, by crawlers, not a throttling concern) and only
// localize real <img>/srcset/CSS background-image usages.
const escapeRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const isSocialMetaContext = (text, idx) => /(?:og:image|twitter:image)"\s+content="$/.test(text.slice(Math.max(0, idx - 60), idx));

let filesChanged = 0;
for (const f of targetFiles) {
  let src = readFileSync(f, "utf8");
  let changed = false;
  for (const [url, local] of urlToLocal) {
    if (!local || !src.includes(url)) continue;
    const re = new RegExp(escapeRe(url), "g");
    const next = src.replace(re, (match, offset) => {
      if (isSocialMetaContext(src, offset)) return match;
      changed = true;
      return local;
    });
    src = next;
  }
  if (changed) { writeFileSync(f, src); filesChanged++; }
}
console.log(`Rewrote image references in ${filesChanged} files (og:image/twitter:image meta tags left as absolute Unsplash URLs, per spec).`);

// Manifest so scripts/build.mjs can resolve id+width -> local file on future rebuilds,
// otherwise a later "node scripts/build.mjs" would regenerate pages with the original
// Unsplash URLs and silently undo this.
const manifestPath = join(IMG_DIR, "manifest.json");
const manifest = existsSync(manifestPath) ? JSON.parse(readFileSync(manifestPath, "utf8")) : {};
for (const [url] of urlToLocal) {
  const id = (url.match(/photo-([\w-]+)/) || [, ""])[1];
  const w = (url.match(/[?&]w=(\d+)/) || [, ""])[1];
  if (id && w) manifest[`${id}-${w}`] = `/assets/img/${slugFor(url)}`;
}
writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
console.log(`Wrote ${Object.keys(manifest).length} entries to assets/img/manifest.json.`);
console.log(`Done. scripts/build.mjs now resolves images through this manifest automatically —`);
console.log(`re-running "node scripts/build.mjs" will keep using these local files.`);
