import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getItemById, getItemDetails, getCategoryById } from '../../../../lib/data';

export default async function ItemPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const item = getItemById(id);
  
  if (!item) notFound();



  const details = getItemDetails(item.ListingId);
  const category = getCategoryById(item.CategoryId);
  const image = details?.imageUrls?.[0] || item.FullImageUrl || item.ThumbnailUrl;

  return (
    <main className="min-h-screen bg-gray-900 text-gray-100 px-6 py-10">
      <div className="max-w-5xl mx-auto">
        <p className="text-sm text-gray-500">
          <Link href="/shop" className="hover:text-white">Shop</Link>
          {category && (
            <>
              {' / '}
              <Link href={`/shop/${category.slug}`} className="hover:text-white">
                {category.label}
              </Link>
            </>
          )}
        </p>

        <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div className="bg-gray-800 border border-gray-700 rounded-2xl p-6 flex items-center justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={image} alt={item.Title} className="max-h-[420px] object-contain" />
          </div>

          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-white leading-tight">{item.Title}</h1>
            <p className="mt-4 text-3xl font-extrabold text-[#c73a3f]">{item.PriceText}</p>

            {details?.condition && (
              <p className="mt-4 text-sm text-gray-400">
                <span className="text-gray-200 font-semibold">Condition: </span>
                {details.condition}
              </p>
            )}
            {details?.quantitySoldText && (
              <p className="mt-1 text-sm text-gray-400">{details.quantitySoldText}</p>
            )}
            {details?.shippingText && (
              <p className="mt-1 text-sm text-gray-400">
                <span className="text-gray-200 font-semibold">Shipping: </span>
                {details.shippingText}
              </p>
            )}

            <a
              href={item.ItemUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-block',
                marginTop: '24px',
                padding: '14px 28px',
                borderRadius: '4px',
                border: '2px solid #7a1518',
                background: 'linear-gradient(180deg, #8c1d21 0%, #5c1013 100%)',
                color: 'white',
                fontWeight: 800,
                fontSize: '15px',
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
                textDecoration: 'none',
              }}
            >
              View &amp; Buy on eBay
            </a>

            {details?.specifics && Object.keys(details.specifics).length > 0 && (
              <div className="mt-8 bg-gray-800 border border-gray-700 rounded-2xl overflow-hidden">
                <div className="px-4 py-2 bg-gray-900 border-b border-gray-700 font-semibold text-white">
                  Item Specifics
                </div>
                <dl>
                  {Object.entries(details.specifics).map(([label, value]) => (
                    <div key={label} className="flex px-4 py-2 border-b border-gray-700 last:border-b-0">
                      <dt className="w-1/3 text-sm text-gray-500">{label}</dt>
                      <dd className="w-2/3 text-sm text-gray-200">{value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            )}

            {details?.description && (
              <div className="mt-8">
                <h2 className="text-xl font-semibold text-white">Description</h2>
                <p className="mt-2 text-sm leading-relaxed text-gray-300">{details.description}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
