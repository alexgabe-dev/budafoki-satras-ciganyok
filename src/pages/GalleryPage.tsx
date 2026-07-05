import React from 'react';
import Gallery from '../components/Gallery';
import { useContent } from '../hooks/useContent';

export default function GalleryPage() {
  const content = useContent({
    'gallery.header.title': '★ FOTÓALBUM & HANGULAT ★',
    'gallery.header.description': 'Lapozd át a tavalyi kempingezés és az előkészületek legmelegebb, analóg hangulatú polaroid képeit! Itt nincsenek mesterséges effektek, csak tiszta nevetés és a természet közelsége.',
  });

  return (
    <div className="pt-36 lg:pt-40 pb-20 bg-cream paper-texture min-h-screen text-darkbrown relative overflow-hidden animate-fade-in">
      {/* Wooden texture lines overlay */}
      <div className="absolute inset-0 wood-texture opacity-5 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Intro */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h1 className="font-retro text-3xl sm:text-5xl text-darkbrown tracking-tight uppercase text-stroke-retro">
            {content('gallery.header.title')}
          </h1>
          <div className="w-24 h-1.5 bg-orange mx-auto mt-4 rounded-full retro-border"></div>
          <p className="mt-6 font-sans font-extrabold text-sm sm:text-base text-darkbrown/85 leading-relaxed">
            {content('gallery.header.description')}
          </p>
        </div>

        {/* The actual Gallery rendered modularly */}
        <Gallery isSubpage={true} />

      </div>
    </div>
  );
}
