import { notFound } from 'next/navigation';
import Link from 'next/link';
import ItemGallery from '../../../../components/ItemGallery';
import { itemImageUrl } from '../../../../lib/images';
import { getItemById, getItemDetails, getCategoryById } from '../../../../lib/data';

// The eBay copy of these texts is run together ("...See detailsfor shippingLocated in: Kingston..."), so split it back apart.
function splitShipping(text: string | null | undefined): { cost: string; location: string } | null {
  if (!text) return null;
  const m = text.replace(/ /g, ' ').match(/^(.*?)\s*See details\s*for shipping\s*Located in:\s*(.*)$/i);
  return m ? { cost: m[1].trim(), location: m[2].trim() } : { cost: text.replace(/ /g, ' ').trim(), location: '' };
}
function splitCondition(text: string | null | undefined): { label: string; note: string } | null {
  if (!text) return null;
  const i = text.indexOf(':');
  return i > 0 ? { label: text.slice(0, i).trim(), note: text.slice(i + 1).trim() } : { label: text.trim(), note: '' };
}
// These keys are shown in their own boxes, so they are left out of the Item specifics table.
const OWN_BOX = new Set(['Shipping', 'Delivery', 'Returns', 'Payments', 'Condition']);

export default async function ItemPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const item = getItemById(id);
  if (!item) notFound();

  const details = getItemDetails(item.ListingId);
  const category = getCategoryById(item.CategoryId);

  const hasList = !!(details?.imageUrls && details.imageUrls.length > 1);
  const originals = details?.imageUrls && details.imageUrls.length > 0 ? details.imageUrls : [item.FullImageUrl || item.ThumbnailUrl];
  const images = hasList ? originals.map((u, i) => itemImageUrl(item.ListingId, i, u)) : originals;
  
  const condition = splitCondition(details?.condition);
  const shipping = splitShipping(details?.shippingText);
  const returns = details?.specifics?.Returns?.replace(/ /g, ' ').replace(/\s*See details.*$/i, '').trim();
  const specifics = Object.entries(details?.specifics ?? {}).filter(([k, v]) => !OWN_BOX.has(k) && v);

  return (
    <main className="min-h-screen bg-gray-900 text-gray-100 px-4 md:px-6 py-8">
      <div className="max-w-6xl mx-auto">
        <p className="text-sm text-gray-500">
          <Link href="/shop" className="hover:text-white">Shop</Link>
          {category && (
            <>
              {' / '}
              <Link href={`/shop/${category.slug}`} className="hover:text-white">{category.label}</Link>
            </>
          )}
        </p>

        <div className="mt-5 grid grid-cols-1 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] gap-8">
          <ItemGallery images={images} title={item.Title} />

          <div>
            <h1 className="text-xl md:text-2xl font-bold text-white leading-snug">{item.Title}</h1>

            {condition && (
              <p className="mt-3 text-sm text-gray-300">
                <span className="font-semibold text-gray-100">Condition: </span>{condition.label}
              </p>
            )}

            <div className="mt-4 border-t border-gray-700 pt-4">
              <p className="text-3xl font-extrabold text-white">{item.PriceText}</p>
              {details?.quantitySoldText && <p className="mt-1 text-sm text-gray-400">{details.quantitySoldText}</p>}
            </div>

            <div className="mt-5 flex flex-col gap-3 max-w-sm">
              <button type="button" disabled title="Demo mode: checkout is not enabled" className="rounded-full bg-[#7a1518] text-white font-bold py-3 opacity-60 cursor-not-allowed">Buy It Now</button>
              <button type="button" disabled title="Demo mode: checkout is not enabled" className="rounded-full border-2 border-[#c73a3f] text-[#e0686c] font-bold py-3 opacity-60 cursor-not-allowed">Add to cart</button>
              <p className="text-xs text-amber-300">Demo mode: checkout is switched off.</p>
            </div>

            <div className="mt-6 rounded-xl border border-gray-700 bg-gray-800 divide-y divide-gray-700 text-sm">
              {shipping && (
                <div className="flex gap-4 px-4 py-3"><span className="w-24 shrink-0 text-gray-500">Shipping</span><span className="text-gray-200">{shipping.cost}</span></div>
              )}
              {shipping?.location && (
                <div className="flex gap-4 px-4 py-3"><span className="w-24 shrink-0 text-gray-500">Located in</span><span className="text-gray-200">{shipping.location}</span></div>
              )}
              {returns && (
                <div className="flex gap-4 px-4 py-3"><span className="w-24 shrink-0 text-gray-500">Returns</span><span className="text-gray-200">{returns}</span></div>
              )}
              {condition?.note && (
                <div className="flex gap-4 px-4 py-3"><span className="w-24 shrink-0 text-gray-500">Condition</span><span className="text-gray-200">{condition.note}</span></div>
              )}
            </div>
          </div>
        </div>

        {specifics.length > 0 && (
          <section className="mt-10">
            <h2 className="text-lg font-semibold text-white">Item specifics</h2>
            <dl className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-x-8 rounded-xl border border-gray-700 bg-gray-800 px-4 py-2">
              {specifics.map(([label, value]) => (
                <div key={label} className="flex gap-4 py-2 border-b border-gray-700">
                  <dt className="w-1/3 shrink-0 text-sm text-gray-500">{label}</dt>
                  <dd className="text-sm text-gray-200">{value}</dd>
                </div>
              ))}
            </dl>
          </section>
        )}

      <a href={item.ItemUrl} target="_blank" rel="noopener noreferrer" className="mt-10 flex items-center justify-center gap-3 rounded-xl bg-amber-400 px-4 py-4 text-center text-lg md:text-xl font-extrabold text-gray-900 hover:bg-amber-300">
        <span aria-hidden="true">&rarr;</span>
        Original eBay listing (for comparison while this demo is being built)
        <span aria-hidden="true">&larr;</span>
      </a>
      </div>
    </main>
  );
}
