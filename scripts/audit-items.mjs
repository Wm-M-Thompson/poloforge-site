// audit-items.mjs  --  finds weak and duplicate items in the PoloForge catalog.
// It reads the data files already in the project (nothing is fetched from the web, nothing is changed):
//     data/items.json, data/item-details.json   (and lib/blocked-teams.ts, so items already hidden for team names are not counted)
//
//   node scripts/audit-items.mjs           REPORT ONLY: prints a summary and writes data/audit-report.csv
//   node scripts/audit-items.mjs --hide    also writes data/hidden-items.json (the IDs to hide). The site changes only after
//                                          lib/data.ts is told to read that file. Delete the file's contents ( [] ) to bring items back.
//
// What the flags mean:
//   no-details   the item has no entry in item-details.json (no photo list, no description, no specifics)
//   one-photo    the entry exists but lists 0 or 1 photos
//   thin         the entry has neither a description nor any item specifics (information only, not hidden)
//   dup-photo    another item uses the same main photo; this is the poorer copy
//   dup-title    another item has the same title; this is the poorer copy
// "Weak" = no-details or one-photo.  "Poorer copy" = fewer photos, or no details; the richest copy is kept.
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const read = (f) => JSON.parse(fs.readFileSync(path.join(root, f), 'utf8'));
const items = read('data/items.json');
const details = read('data/item-details.json');
const doHide = process.argv.includes('--hide');

// ---- items the site already hides for pro-team names (same rules as lib/blocked-teams.ts) ----
function loadBlocked() {
  const f = path.join(root, 'lib', 'blocked-teams.ts');
  if (!fs.existsSync(f)) return () => false;
  const src = fs.readFileSync(f, 'utf8');
  const terms = [...src.matchAll(/^\s*"([^"]+)",?\s*$/gm)].map((m) => ' ' + m[1] + ' ');
  const norm = (t) => ' ' + t.toLowerCase().replace(/’/g, "'").replace(/&/g, ' and ').replace(/[^a-z0-9/' ]/g, ' ')
    .replace(/\//g, ' ').replace(/'/g, '').replace(/\s+/g, ' ').trim() + ' ';
  return (title) => { const n = norm(title); return terms.some((p) => n.includes(p)); };
}
const blocked = loadBlocked();

const visible = items.filter((it) => !blocked(it.Title || ''));
const photoCount = (id) => (details[id]?.imageUrls?.length) || 0;
const imgKey = (it) => {
  const u = it.FullImageUrl || it.ThumbnailUrl || '';
  const m = u.match(/\/images\/g\/([^/]+)\//);
  return m ? m[1] : u.split('?')[0];
};
const titleKey = (it) => (it.Title || '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
const richness = (it) => photoCount(it.ListingId) * 10 + (details[it.ListingId] ? 5 : 0) + (details[it.ListingId]?.description ? 1 : 0);

const flags = new Map(visible.map((it) => [it.ListingId, []]));
for (const it of visible) {
  const d = details[it.ListingId];
  const f = flags.get(it.ListingId);
  if (!d) f.push('no-details');
  else {
    if (photoCount(it.ListingId) <= 1) f.push('one-photo');
    const hasSpec = d.specifics && Object.keys(d.specifics).length > 0;
    if (!hasSpec && !(d.description && d.description.trim())) f.push('thin');
  }
}
function markDups(keyFn, flagName) {
  const groups = new Map();
  for (const it of visible) { const k = keyFn(it); if (!k) continue; (groups.get(k) || groups.set(k, []).get(k)).push(it); }
  let groupsFound = 0;
  for (const g of groups.values()) {
    if (g.length < 2) continue;
    groupsFound++;
    g.sort((a, b) => richness(b) - richness(a) || String(a.ListingId).localeCompare(String(b.ListingId)));
    for (const it of g.slice(1)) flags.get(it.ListingId).push(`${flagName}:${g[0].ListingId}`);
  }
  return groupsFound;
}
const photoGroups = markDups(imgKey, 'dup-photo');
const titleGroups = markDups(titleKey, 'dup-title');

const isWeak = (f) => f.includes('no-details') || f.includes('one-photo');
const isDup = (f) => f.some((x) => x.startsWith('dup-'));
const weak = visible.filter((it) => isWeak(flags.get(it.ListingId)));
const dups = visible.filter((it) => isDup(flags.get(it.ListingId)));
const toHide = visible.filter((it) => { const f = flags.get(it.ListingId); return isWeak(f) || isDup(f); });
const count = (flag) => visible.filter((it) => flags.get(it.ListingId).some((x) => x === flag || x.startsWith(flag + ':'))).length;

console.log(`Items in items.json                 : ${items.length}`);
console.log(`Already hidden for team names       : ${items.length - visible.length}`);
console.log(`Items the site shows now            : ${visible.length}`);
console.log(`  no-details                        : ${count('no-details')}`);
console.log(`  one-photo                         : ${count('one-photo')}`);
console.log(`  weak (no-details or one-photo)    : ${weak.length}`);
console.log(`  thin (information only)           : ${count('thin')}`);
console.log(`  dup-photo (${photoGroups} groups)  : ${count('dup-photo')}`);
console.log(`  dup-title (${titleGroups} groups)  : ${count('dup-title')}`);
console.log(`  duplicates in all                 : ${dups.length}`);
console.log(`Would be hidden with --hide         : ${toHide.length}   (the site would keep ${visible.length - toHide.length})`);
const byCat = {};
for (const it of visible) { const c = it.CategoryLabel || it.CategoryId; (byCat[c] ||= { shown: 0, hide: 0 }).shown++; if (toHide.includes(it)) byCat[c].hide++; }
console.log('By department (shown / would hide):');
for (const [c, v] of Object.entries(byCat)) console.log(`  ${c.padEnd(32)} ${String(v.shown).padStart(5)} / ${v.hide}`);

const q = (s) => `"${String(s ?? '').replace(/"/g, '""')}"`;
const lines = ['ListingId,Title,Department,Price,Photos,Flags,HideWithFlag'];
for (const it of visible) {
  const f = flags.get(it.ListingId);
  lines.push([it.ListingId, q(it.Title), q(it.CategoryLabel), q(it.PriceText), photoCount(it.ListingId), q(f.join(' ')), isWeak(f) || isDup(f) ? 'yes' : ''].join(','));
}
fs.writeFileSync(path.join(root, 'data', 'audit-report.csv'), '﻿' + lines.join('\n'));
console.log('Report written: data/audit-report.csv');
if (doHide) {
  fs.writeFileSync(path.join(root, 'data', 'hidden-items.json'), JSON.stringify(toHide.map((it) => it.ListingId), null, 0));
  console.log(`data/hidden-items.json written (${toHide.length} IDs). The site ignores it until lib/data.ts reads it.`);
} else console.log('Report only. Nothing was hidden. Add --hide to write the list of IDs.');
