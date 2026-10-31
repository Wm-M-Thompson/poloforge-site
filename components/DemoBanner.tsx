// Shown at the top of every /shop page while the store is a demonstration.
export default function DemoBanner() {
  return (
    <div role="note" className="sticky top-0 z-50 bg-amber-400 text-gray-900 text-center text-sm font-semibold px-4 py-2 border-b-2 border-amber-600">
      DEMO MODE &mdash; PoloForge is a test storefront for demonstration only. Nothing here can be bought and no payment is taken.
    </div>
  );
}
