'use client';

import { useState } from 'react';

// Big picture with a column of small pictures beside it (a row under it on narrow screens).
export default function ItemGallery({ images, title }: { images: string[]; title: string }) {
  const [current, setCurrent] = useState(0);
  if (images.length === 0) return null;
  const go = (d: number) => setCurrent((c) => (c + d + images.length) % images.length);

  return (
    <div className="flex flex-col-reverse md:flex-row gap-3">
      {images.length > 1 && (
        <div className="flex md:flex-col gap-2 md:max-h-[520px] overflow-auto md:w-20 shrink-0">
          {images.map((src, i) => (
            <button
              key={src + i}
              type="button"
              onClick={() => setCurrent(i)}
              aria-label={`Show picture ${i + 1} of ${images.length}`}
              className={`w-16 h-16 md:w-20 md:h-20 shrink-0 rounded border-2 bg-white overflow-hidden ${i === current ? 'border-[#c73a3f]' : 'border-gray-700'}`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt="" loading="lazy" className="w-full h-full object-contain" />
            </button>
          ))}
        </div>
      )}
      <div className="relative flex-1 bg-white rounded-xl border border-gray-700 flex items-center justify-center min-h-[300px] md:min-h-[520px]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={images[current]} alt={`${title} (picture ${current + 1} of ${images.length})`} className="max-h-[500px] max-w-full object-contain" />
        {images.length > 1 && (
          <>
            <button type="button" onClick={() => go(-1)} aria-label="Previous picture" className="absolute left-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-gray-900/70 text-white text-xl leading-none">&lsaquo;</button>
            <button type="button" onClick={() => go(1)} aria-label="Next picture" className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-gray-900/70 text-white text-xl leading-none">&rsaquo;</button>
            <span className="absolute bottom-2 right-3 text-xs bg-gray-900/70 text-white rounded px-2 py-0.5">{current + 1} / {images.length}</span>
          </>
        )}
      </div>
    </div>
  );
}
