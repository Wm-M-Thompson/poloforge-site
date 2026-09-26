import Link from 'next/link';
import ProductCard from '../../components/ProductCard';
import { getAllItems, getCategoryCounts } from '../../lib/data';

export default function ShopPage() {
  const items = getAllItems();
  const categories = getCategoryCounts();
  const featured = items.slice(0, 12);

  return (
    <main className="min-h-screen bg-gray-900 text-gray-100 px-6 py-10">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
          The PoloForge Catalog
        </h1>
        <p className="mt-2 text-gray-400">{items.length.toLocaleString()} items, ready to browse.</p>

        <div className="mt-8 flex flex-wrap gap-2">
          {categories.map((c) => (
            <Link
              key={c.id}
              href={`/shop/${c.slug}`}
              className="px-4 py-2 rounded-full border border-gray-700 bg-gray-800 text-sm text-gray-200 hover:border-[#7a1518] hover:text-white transition-colors"
            >
              {c.label} <span className="text-gray-500">({c.count})</span>
            </Link>
          ))}
        </div>

        <h2 className="mt-10 text-xl font-semibold text-white">Featured</h2>
        <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {featured.map((item) => (
            <ProductCard key={item.ListingId} item={item} />
          ))}
        </div>
      </div>
    </main>
  );
}
