import { notFound } from 'next/navigation';
import Link from 'next/link';
import ProductCard from '../../../components/ProductCard';
import { getCategoryBySlug, getItemsByCategorySlug, CATEGORY_ORDER } from '../../../lib/data';

export function generateStaticParams() {
  return CATEGORY_ORDER.map((c) => ({ category: c.slug }));
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category: categorySlug } = await params;

  const category = getCategoryBySlug(categorySlug);
  if (!category) notFound();

  const items = getItemsByCategorySlug(categorySlug);

  return (
    <main className="min-h-screen bg-gray-900 text-gray-100 px-6 py-10">
      <div className="max-w-6xl mx-auto">
        <Link href="/shop" className="text-sm text-gray-500 hover:text-white">
          &larr; All departments
        </Link>
        <h1 className="mt-2 text-3xl font-bold text-white">{category.label}</h1>
        <p className="mt-1 text-gray-400">{items.length} items</p>

        <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {items.map((item) => (
            <ProductCard key={item.ListingId} item={item} />
          ))}
        </div>
      </div>
    </main>
  );
}
