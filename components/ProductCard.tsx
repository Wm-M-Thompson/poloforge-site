import Link from 'next/link';
import type { Item } from '../lib/data';

export default function ProductCard({ item }: { item: Item }) {
  return (
    <Link
      href={`/shop/item/${item.ListingId}`}
      className="block bg-gray-800 border border-gray-700 rounded-2xl overflow-hidden hover:border-[#7a1518] transition-colors"
    >
      <div className="aspect-square bg-gray-900 flex items-center justify-center p-3">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={item.ThumbnailUrl}
          alt={item.Title}
          loading="lazy"
          className="max-h-full max-w-full object-contain"
        />
      </div>
      <div className="p-3">
        <p className="text-sm text-gray-200 line-clamp-2">{item.Title}</p>
        <p className="mt-2 font-bold text-white">{item.PriceText}</p>
      </div>
    </Link>
  );
}
