// Where item photos come from.
// - NEXT_PUBLIC_IMAGE_BASE not set  -> the original eBay picture links stored in item-details.json (what the site does today).
// - NEXT_PUBLIC_IMAGE_BASE set      -> our own copy, e.g. https://images.thompsonsoftware.tech/poloforge-business
//   The copy is made by scripts/download-images.mjs, which saves photo number N of listing L as  L/NN.<same extension as the eBay link>.
const BASE = (process.env.NEXT_PUBLIC_IMAGE_BASE || '').replace(/\/+$/, '');

export function itemImageUrl(listingId: string, index: number, originalUrl: string): string {
  if (!BASE) return originalUrl;
  const m = originalUrl.match(/\.([A-Za-z0-9]{3,4})(?:\?.*)?$/);
  const ext = (m ? m[1] : 'jpg').toLowerCase();
  return `${BASE}/${listingId}/${String(index + 1).padStart(2, '0')}.${ext}`;
}
