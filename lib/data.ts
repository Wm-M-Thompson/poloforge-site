import itemsData from '../data/items.json';
import itemDetailsData from '../data/item-details.json';

export interface Item {
  ListingId: string;
  Title: string;
  PriceText: string;
  ThumbnailUrl: string;
  FullImageUrl: string;
  ItemUrl: string;
  CategoryId: string;
  CategoryLabel: string;
}

export interface ItemDetail {
  condition: string | null;
  quantitySoldText: string | null;
  shippingText: string | null;
  specifics: Record<string, string> | null;   // ← added | null
  description: string | null;
  imageUrls: string[] | null;                 // ← added | null
}

const items = itemsData as Item[];
const itemDetails = itemDetailsData as Record<string, ItemDetail>;

// Human-facing labels and display order for departments - keyed by
// CategoryId, matching exactly what EbayHarvester's Layer 1 writes.
export const CATEGORY_ORDER = [
  { id: '260012', slug: 'men', label: 'Men' },
  { id: '260010', slug: 'women', label: 'Women' },
  { id: '260033', slug: 'specialty', label: 'Specialty' },
  { id: '171146', slug: 'kids', label: 'Kids' },
  { id: '64482', slug: 'sports-mem', label: 'Sports Mem, Cards & Fan Shop' },
  { id: '1', slug: 'collectibles', label: 'Collectibles' },
  { id: '45100', slug: 'entertainment', label: 'Entertainment Memorabilia' },
  { id: '11700', slug: 'home-garden', label: 'Home & Garden' },
  { id: '12576', slug: 'business-industrial', label: 'Business & Industrial' },
  { id: '220', slug: 'toys-hobbies', label: 'Toys & Hobbies' },
];

export function getAllItems(): Item[] {
  return items;
}

export function getCategoryBySlug(slug: string) {
  return CATEGORY_ORDER.find((c) => c.slug === slug) || null;
}

export function getCategoryById(id: string) {
  return CATEGORY_ORDER.find((c) => c.id === id) || null;
}

export function getItemsByCategorySlug(slug: string): Item[] {
  const category = getCategoryBySlug(slug);
  if (!category) return [];
  return items.filter((item) => item.CategoryId === category.id);
}

export function getCategoryCounts() {
  const counts: Record<string, number> = {};
  for (const item of items) counts[item.CategoryId] = (counts[item.CategoryId] || 0) + 1;
  return CATEGORY_ORDER.map((c) => ({ ...c, count: counts[c.id] || 0 }));
}

export function getItemById(id: string): Item | null {
  return items.find((item) => item.ListingId === id) || null;
}

export function getItemDetails(listingId: string): ItemDetail | null {
  return itemDetails[listingId] || null;
}

export function searchItems(query: string): Item[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return items.filter((item) => item.Title.toLowerCase().includes(q));
}