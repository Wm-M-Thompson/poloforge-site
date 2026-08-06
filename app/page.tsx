import Image from "next/image";

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-900 text-gray-100 flex flex-col items-center justify-center p-6">
      <div className="max-w-md w-full bg-gray-800 border border-gray-700 rounded-2xl p-8 shadow-xl text-center space-y-6">
        
        {/* Status Tag */}
        <span className="inline-block text-xs font-semibold tracking-widest uppercase px-3 py-1 bg-gray-700 text-gray-300 rounded-full">
          Under Development
        </span>

        {/* Logo Placeholder / Image Space */}
        <div className="flex justify-center my-4">
          <div className="w-32 h-32 relative flex items-center justify-center bg-gray-900 rounded-xl border border-gray-700">
            {/* Replace the src with your logo link or import */}
            <span className="text-xs text-gray-500">LOGO HERE</span>
            {/* 
            <Image 
              src="/your-logo-path.png" 
              alt="PoloForge Logo" 
              width={120} 
              height={120} 
              className="object-contain"
            /> 
            */}
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

        {/* Notification Form / Button Slot */}
        <div className="pt-2">
          {/* ========================================== */}
          {/* INSERT YOUR NOTIFY BUTTON / CODE HERE      */}
          {/* ========================================== */}
          <div className="p-3 bg-gray-900 border border-dashed border-gray-700 rounded-lg text-xs text-gray-500">
            [ Paste your notification button code here ]
          </div>
        </div>

      </div>
      
      {/* Footer minimal text */}
      <footer className="mt-8 text-xs text-gray-500">
        &copy; {new Date().getFullYear()} PoloForge.com. All rights reserved.
      </footer>
    </main>
  );
}