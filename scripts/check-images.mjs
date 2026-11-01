// check-images.mjs -- asks your image server whether every photo the site will request is really there.
// Reads data/items.json + data/item-details.json (nothing is changed) and requests each photo address the site builds.
//
//   node scripts/check-images.mjs https://images.thompsonsoftware.tech/poloforge-business
//
// Prints how many photos were checked and how many are missing, and writes data/missing-images.csv (ListingId, photo number, address, result).
// Items with 0 or 1 photos in their list are skipped: the site is being changed to show the eBay photo for those.
import fs from 'node:fs';
import path from 'node:path';

const BASE = (process.argv[2] || process.env.NEXT_PUBLIC_IMAGE_BASE || '').replace(/\/+$/, '');
if (!BASE) { console.error('Give the image address, e.g.  node scripts/check-images.mjs https://images.thompsonsoftware.tech/poloforge-business'); process.exit(1); }
const root = process.cwd();
const read = (f) => JSON.parse(fs.readFileSync(path.join(root, f), 'utf8'));
const items = read('data/items.json');
const details = read('data/item-details.json');

function loadBlocked() {
  const f = path.join(root, 'lib', 'blocked-teams.ts');
  if (!fs.existsSync(f)) return () => false;
  const terms = [...fs.readFileSync(f, 'utf8').matchAll(/^\s*"([^"]+)",?\s*$/gm)].map((m) => ' ' + m[1] + ' ');
  const norm = (t) => ' ' + t.toLowerCase().replace(/’/g, "'").replace(/&/g, ' and ').replace(/[^a-z0-9/' ]/g, ' ').replace(/\//g, ' ').replace(/'/g, '').replace(/\s+/g, ' ').trim() + ' ';
  return (title) => { const n = norm(title); return terms.some((p) => n.includes(p)); };
}
const blocked = loadBlocked();

// same address rule as lib/images.ts
const addr = (id, i, orig) => {
  const m = orig.match(/\.([A-Za-z0-9]{3,4})(?:\?.*)?$/);
  return `${BASE}/${id}/${String(i + 1).padStart(2, '0')}.${(m ? m[1] : 'jpg').toLowerCase()}`;
};
const jobs = [];
for (const it of items) {
  if (blocked(it.Title || '')) continue;
  const urls = details[it.ListingId]?.imageUrls;
  if (!urls || urls.length <= 1) continue;
  urls.forEach((u, i) => jobs.push({ id: it.ListingId, n: i + 1, url: addr(it.ListingId, i, u) }));
}
console.log(`Photos to check: ${jobs.length}`);

async function status(url) {
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      let r = await fetch(url, { method: 'HEAD' });
      if (r.status === 405 || r.status === 501) r = await fetch(url, { method: 'GET' });
      return r.status;
    } catch { await new Promise((r) => setTimeout(r, 500 * (attempt + 1))); }
  }
  return 'error';
}
const bad = []; let done = 0, next = 0;
async function worker() {
  while (next < jobs.length) {
    const j = jobs[next++];
    const s = await status(j.url);
    if (s !== 200) bad.push({ ...j, s });
    if (++done % 500 === 0) console.log(`  ${done}/${jobs.length} checked, ${bad.length} missing so far`);
  }
}
await Promise.all(Array.from({ length: 12 }, worker));
const lines = ['ListingId,Photo,Address,Result', ...bad.map((b) => `${b.id},${b.n},${b.url},${b.s}`)];
fs.writeFileSync(path.join(root, 'data', 'missing-images.csv'), '﻿' + lines.join('\n'));
const items_ = new Set(bad.map((b) => b.id));
console.log(`Checked ${jobs.length}. Missing or failed: ${bad.length} photos, in ${items_.size} items.`);
console.log('List written: data/missing-images.csv');
