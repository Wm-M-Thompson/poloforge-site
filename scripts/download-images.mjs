// Downloads every item photo listed in data/item-details.json into a local folder, ready to upload to
//   images.thompsonsoftware.tech/poloforge-business/
// Photo N of listing L is saved as  <folder>/L/NN.<extension of the eBay link>  (the site's lib/images.ts builds the same names).
//
// Run from the poloforge-site folder (Node 18 or newer, nothing to install):
//   node scripts/download-images.mjs --out D:\poloforge-business --limit-items 5      <- small test first
//   node scripts/download-images.mjs --out D:\poloforge-business                      <- everything (can be stopped with Ctrl+C and started again; it skips files it already has)
// Options: --size 800   picture size taken from eBay (64,140,225,300,400,500,640,800,960,1200,1600). Default 800. 1600 = biggest.
//          --parallel 4 simultaneous downloads (default 4; please keep it modest)
//          --details <file>  (default data/item-details.json)
import fs from 'node:fs';
import path from 'node:path';

const args = process.argv.slice(2);
const opt = (name, def) => { const i = args.indexOf(name); return i >= 0 && args[i + 1] ? args[i + 1] : def; };
const OUT = opt('--out', 'poloforge-business');
const SIZE = opt('--size', '800');
const PARALLEL = Math.max(1, Math.min(8, parseInt(opt('--parallel', '4'), 10) || 4));
const LIMIT = parseInt(opt('--limit-items', '0'), 10) || 0;
const DETAILS = opt('--details', path.join('data', 'item-details.json'));

if (!fs.existsSync(DETAILS)) { console.error(`Not found: ${DETAILS}. Run this from the poloforge-site folder.`); process.exit(1); }
const details = JSON.parse(fs.readFileSync(DETAILS, 'utf8'));

// the job list: [listingId, number, url, file]
const jobs = [];
let items = 0;
for (const [id, d] of Object.entries(details)) {
  if (!d || !Array.isArray(d.imageUrls) || d.imageUrls.length === 0) continue;
  if (LIMIT && items >= LIMIT) break;
  items++;
  d.imageUrls.forEach((u, i) => {
    const m = u.match(/\.([A-Za-z0-9]{3,4})(?:\?.*)?$/);
    const ext = (m ? m[1] : 'jpg').toLowerCase();
    const url = u.replace(/s-l\d+(\.[A-Za-z0-9]+)$/, `s-l${SIZE}$1`);
    jobs.push({ id, url, file: path.join(OUT, id, `${String(i + 1).padStart(2, '0')}.${ext}`) });
  });
}
console.log(`${items} items, ${jobs.length} pictures, size s-l${SIZE}, saving into ${path.resolve(OUT)}`);

fs.mkdirSync(OUT, { recursive: true });
const failedPath = path.join(OUT, 'failed.txt');
let done = 0, skipped = 0, failed = 0, bytes = 0, next = 0, stop = false;
process.on('SIGINT', () => { stop = true; console.log('\nStopping after the current downloads. Run the same command again to continue.'); });

async function fetchWithRetry(url) {
  let lastErr;
  for (let attempt = 1; attempt <= 4; attempt++) {
    try {
      const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0 (PoloForge image copy)' } });
      if (res.ok) return Buffer.from(await res.arrayBuffer());
      if (res.status === 404 || res.status === 403) throw new Error(`HTTP ${res.status}`); // will not get better
      lastErr = new Error(`HTTP ${res.status}`);
    } catch (e) { lastErr = e; if (/HTTP (404|403)/.test(String(e))) break; }
    await new Promise((r) => setTimeout(r, 800 * attempt));
  }
  throw lastErr;
}

async function worker() {
  while (!stop) {
    const j = jobs[next++];
    if (!j) return;
    if (fs.existsSync(j.file) && fs.statSync(j.file).size > 0) { skipped++; continue; }
    try {
      const buf = await fetchWithRetry(j.url);
      fs.mkdirSync(path.dirname(j.file), { recursive: true });
      const tmp = j.file + '.part';
      fs.writeFileSync(tmp, buf);
      fs.renameSync(tmp, j.file);
      done++; bytes += buf.length;
    } catch (e) {
      failed++;
      fs.appendFileSync(failedPath, `${j.id}\t${j.url}\t${e.message}\n`);
    }
    const n = done + skipped + failed;
    if (n % 200 === 0) console.log(`${n} / ${jobs.length}  downloaded ${done}, already had ${skipped}, failed ${failed}, ${(bytes / 1048576).toFixed(0)} MB this run`);
  }
}

await Promise.all(Array.from({ length: PARALLEL }, worker));
console.log(`\nFinished. Downloaded ${done}, already had ${skipped}, failed ${failed} (see ${failedPath}), ${(bytes / 1048576).toFixed(0)} MB this run.`);
