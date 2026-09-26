import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-900 text-gray-100 flex flex-col items-center justify-center p-6">
      <div className="max-w-md w-full bg-gray-800 border border-gray-700 rounded-2xl p-8 shadow-xl text-center space-y-6">
        
        {/* Status Tag */}
        <span className="inline-block text-xs font-semibold tracking-widest uppercase px-3 py-1 bg-gray-700 text-gray-300 rounded-full">
          Under Development
        </span>

        {/* Logo */}
        <div className="flex justify-center my-4">
          <div className="w-32 h-32 relative flex items-center justify-center bg-gray-900 rounded-xl border border-gray-700">
            <Image 
              src="https://images.poloforge.com/logo_one.png" 
              alt="PoloForge Logo" 
              width={120} 
              height={120} 
              className="object-contain"
            /> 
          </div>
        </div>

        {/* Headings */}
        <div className="space-y-2">
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white">
            PoloForge is Launching Soon
          </h1>
          <p className="text-sm text-gray-400 leading-relaxed">
            We are currently building our online store to bring you quality polos and apparel. Check back soon for our official opening.
          </p>
        </div>

        {/* Buttons */}
        <div className="pt-2 space-y-3">
          <Link
            href="/notify"
            style={{
              display: 'inline-block',
              width: '100%',
              padding: '14px 20px',
              borderRadius: '4px',
              border: '2px solid #7a1518',
              background: 'linear-gradient(180deg, #8c1d21 0%, #5c1013 100%)',
              color: 'white',
              fontWeight: 800,
              fontSize: '15px',
              letterSpacing: '0.05em',
              textAlign: 'center',
              textTransform: 'uppercase',
              textDecoration: 'none',
              boxShadow: '0 2px 6px rgba(0,0,0,0.4)',
            }}
          >
            Notify Me When Launched
          </Link>

          <Link
            href="/shop"
            className="inline-block w-full px-5 py-3.5 rounded border-2 border-gray-600 bg-gray-800 text-gray-200 font-semibold text-sm tracking-wide text-center uppercase hover:bg-gray-700 hover:border-gray-500 transition-colors"
          >
            View current storefront with eBay payments still connected →
          </Link>
        </div>

      </div>
      
      {/* Footer with brand logo */}
      {/* Footer with brand logo */}
<footer className="mt-10 flex flex-col items-center gap-2">
  <Link
    href="https://thompsonsoftware.tech"
    target="_blank"
    rel="noopener noreferrer"
    className="flex flex-col items-center gap-2 hover:opacity-80 transition-opacity"
  >
    <Image
      src="https://images.thompsonsoftware.tech/logo.png"
      alt="Thompson Software"
      width={80}
      height={40}
      className="object-contain opacity-70"
    />
    <p className="text-xs text-gray-500 italic">
      product of thompsonsoftware.tech
    </p>
  </Link>
  <p className="text-xs text-gray-600 mt-1">
    &copy; {new Date().getFullYear()} PoloForge.com. All rights reserved.
  </p>
</footer>
    </main>
  );
}