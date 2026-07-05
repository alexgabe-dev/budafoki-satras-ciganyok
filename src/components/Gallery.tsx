import React, { useEffect, useState } from 'react';
import { Image as ImageIcon, Sparkles, X } from 'lucide-react';

interface GalleryProps {
  isSubpage?: boolean;
}

export default function Gallery({ isSubpage = false }: GalleryProps) {
  const [selectedImage, setSelectedImage] = useState<any>(null);

  const fallbackImages = [
    {
      imageUrl: 'https://images.unsplash.com/photo-1501555088652-021faa106b9b?auto=format&fit=crop&fm=webp&w=600&q=72',
      title: 'Dunaparti Chill 🌊',
      tilt: '-rotate-2 translate-y-1',
    },
    {
      imageUrl: 'https://images.unsplash.com/photo-1510312305653-8ed496efae75?auto=format&fit=crop&fm=webp&w=600&q=72',
      title: 'Fesztivál Sátortábor ⛺',
      tilt: 'rotate-3 -translate-y-1',
    },
    {
      imageUrl: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&fm=webp&w=600&q=72',
      title: 'Meleg Fényfüzérek 💡',
      tilt: '-rotate-1 translate-y-2',
    },
    {
      imageUrl: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&fm=webp&w=600&q=72',
      title: 'Duna-parti Naplemente 🌅',
      tilt: 'rotate-2 translate-y-0',
    },
    {
      imageUrl: 'https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?auto=format&fit=crop&fm=webp&w=600&q=72',
      title: 'Bogrács Vacsora 🔥',
      tilt: '-rotate-3 -translate-y-2',
    },
    {
      imageUrl: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&fm=webp&w=600&q=72',
      title: 'Haverok & Buli 🍻',
      tilt: 'rotate-1 translate-y-1',
    },
  ];

  const [images, setImages] = useState(fallbackImages);

  useEffect(() => {
    let isMounted = true;

    fetch('/api/gallery')
      .then((response) => {
        if (!response.ok) throw new Error('Gallery request failed');
        return response.json();
      })
      .then((data) => {
        if (isMounted && Array.isArray(data.items) && data.items.length) {
          setImages(data.items);
        }
      })
      .catch(() => {
        if (isMounted) {
          setImages(fallbackImages);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const imageUrl = (url: string, width: number, quality = 72) => {
    if (!url.includes('images.unsplash.com')) return url;

    try {
      const parsedUrl = new URL(url);
      parsedUrl.searchParams.set('auto', 'format');
      parsedUrl.searchParams.set('fit', 'crop');
      parsedUrl.searchParams.set('fm', 'webp');
      parsedUrl.searchParams.set('w', String(width));
      parsedUrl.searchParams.set('q', String(quality));
      return parsedUrl.toString();
    } catch {
      return url;
    }
  };

  const gridContent = (
    <>
      {/* Polaroid Gallery Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10 md:gap-12 px-4 sm:px-0">
        {images.map((img, idx) => (
          <div
            key={idx}
            onClick={() => setSelectedImage(img)}
            className={`bg-white p-4 pb-6 rounded-sm retro-border-thick retro-shadow-lg transform transition-all duration-300 hover:scale-105 hover:-rotate-1 hover:z-20 group cursor-pointer ${img.tilt}`}
          >
            {/* Image Frame with simulated vintage matte overlay */}
            <div className="relative aspect-square overflow-hidden border-2 border-darkbrown rounded-sm bg-neutral-100">
              <img
                src={imageUrl(img.imageUrl, 420)}
                srcSet={`${imageUrl(img.imageUrl, 320)} 320w, ${imageUrl(img.imageUrl, 420)} 420w, ${imageUrl(img.imageUrl, 600)} 600w`}
                sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 90vw"
                alt={img.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover grayscale-[15%] sepia-[10%] group-hover:grayscale-0 group-hover:sepia-0 transition-all duration-300"
                loading="lazy"
                decoding="async"
              />
              {/* Vignette vignette effect */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none"></div>
            </div>

            {/* Polaroid Signature/Captions */}
            <div className="mt-4 text-center">
              <p className="font-rye text-base md:text-lg text-[#3A2418] tracking-wider leading-none select-none">
                {img.title}
              </p>
              <p className="font-sans font-extrabold text-[9px] text-[#3A2418]/80 uppercase tracking-widest mt-1.5">
                ★ II. BSC 2026 ★
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom invitation text */}
      <div className="mt-16 text-center">
        <div className="inline-block bg-cream text-darkbrown font-retro text-xs px-6 py-3 rounded-full retro-border retro-shadow-sm select-none">
          ⛺ HOZD MAGADDAL A FÉNYKÉPEZŐDET IS, MERT LESZ MIT MEGÖRÖKÍTENI!
        </div>
      </div>

      {/* Retro Polaroid Lightbox Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 bg-[#3A2418]/90 z-50 flex items-center justify-center p-4 backdrop-blur-md animate-fade-in"
          onClick={() => setSelectedImage(null)}
        >
          <div 
            className="relative bg-white p-5 pb-8 rounded-sm retro-border-thick shadow-2xl max-w-md w-full transform rotate-1 animate-scale-up"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button 
              onClick={() => setSelectedImage(null)}
              className="absolute top-2 right-2 w-8 h-8 rounded-full bg-[#FFF1D0] hover:bg-orange text-[#3A2418] hover:text-cream flex items-center justify-center border-2 border-[#3A2418] transition-all hover:scale-105 shadow-md z-10 cursor-pointer"
              aria-label="Bezárás"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Giant polaroid photo */}
            <div className="aspect-square overflow-hidden border-2 border-[#3A2418] rounded-sm bg-neutral-100 relative">
              <img 
                src={imageUrl(selectedImage.imageUrl, 720, 76)}
                srcSet={`${imageUrl(selectedImage.imageUrl, 420, 76)} 420w, ${imageUrl(selectedImage.imageUrl, 720, 76)} 720w`}
                sizes="(min-width: 640px) 448px, 90vw"
                alt={selectedImage.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover grayscale-[10%] sepia-[5%]"
                decoding="async"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent pointer-events-none"></div>
            </div>

            {/* Title */}
            <div className="mt-6 text-center">
              <p className="font-rye text-xl sm:text-2xl text-[#3A2418] tracking-wider">
                {selectedImage.title}
              </p>
              <p className="font-sans font-extrabold text-[10px] text-[#3A2418]/60 uppercase tracking-widest mt-2">
                ★ II. Budafoki Sátras Cigányok ★
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );

  if (isSubpage) {
    return gridContent;
  }

  return (
    <section id="gallery" className="py-20 bg-turquoise/90 relative overflow-hidden border-t-4 border-b-4 border-darkbrown">
      {/* Wooden panel backdrop lines overlay */}
      <div className="absolute inset-0 wood-texture opacity-15 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Title */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-cream text-darkbrown border-2 border-darkbrown rounded-full font-black text-xs uppercase tracking-wider mb-4 shadow-sm">
            <ImageIcon className="w-4 h-4 text-orange" /> KÉPESLAPOK
          </div>
          <h2 className="font-retro text-3xl sm:text-5xl text-cream tracking-tight uppercase text-stroke-retro-thick [text-shadow:4px_4px_0px_#3A2418]">
            ★ ILYEN LESZ A VIBE ★
          </h2>
          <div className="w-24 h-1.5 bg-orange mx-auto mt-4 rounded-full retro-border"></div>
        </div>

        {gridContent}

      </div>
    </section>
  );
}
