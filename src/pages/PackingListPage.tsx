import React from 'react';
import PackingList from '../components/PackingList';
import { Sparkles, AlertCircle } from 'lucide-react';

export default function PackingListPage() {
  return (
    <div className="pt-36 lg:pt-40 pb-20 bg-cream paper-texture min-h-screen animate-fade-in">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Intro */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <h1 className="font-retro text-3xl sm:text-5xl text-[#3A2418] uppercase tracking-tight">
            ★ INTERAKTÍV BEPAKOLÓLISTA ★
          </h1>
          <div className="w-24 h-1.5 bg-turquoise mx-auto mt-4 rounded-full retro-border"></div>
          <p className="mt-6 font-sans font-extrabold text-sm sm:text-base text-[#3A2418]/80 leading-relaxed">
            Hogy semmi ne maradjon otthon a tökéletes kempingezéshez! Jelöld be az alapvető felszereléseket, és adj hozzá saját egyedi tételeket. A beállításaidat a böngésződ automatikusan megjegyzi!
          </p>
        </div>

        {/* The actual packing checklist */}
        <PackingList isSubpage={true} />

        {/* Packing Pro-tips */}
        <div className="mt-16 bg-[#FFFDF6] border-3 border-[#3A2418] rounded-2xl shadow-lg p-6 sm:p-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-turquoise p-2.5 rounded-xl border-2 border-[#3A2418] text-cream">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div>
              <p className="font-retro text-[9px] text-turquoise tracking-widest uppercase font-bold">KEMPING TIPPEK</p>
              <h2 className="font-retro text-xl sm:text-2xl text-[#3A2418] uppercase tracking-wider leading-none">
                PROFI SÁTOROZÓ TANÁCSOK
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-5 bg-cream/40 rounded-xl border-2 border-[#3A2418]/10">
              <span className="text-2xl block mb-2">🌧️</span>
              <h3 className="font-retro text-sm text-[#3A2418] mb-2">Vízálló sátorállítás</h3>
              <p className="font-sans font-bold text-xs text-[#3A2418]/70 leading-relaxed">
                Mindig húsz ki a sátor esővédőjét rendesen, hogy ne érjen hozzá a belső sátorhoz, így nem ázol be akkor sem, ha elered a nyári zápor.
              </p>
            </div>

            <div className="p-5 bg-cream/40 rounded-xl border-2 border-[#3A2418]/10">
              <span className="text-2xl block mb-2">🦟</span>
              <h3 className="font-retro text-sm text-[#3A2418] mb-2">Zárd a szúnyoghálót!</h3>
              <p className="font-sans font-bold text-xs text-[#3A2418]/70 leading-relaxed">
                Aranyszabály: a sátor cipzárja soha ne maradjon nyitva! A Duna közelsége miatt a szúnyogok másodpercek alatt megszállják a hálóhelyet.
              </p>
            </div>

            <div className="p-5 bg-cream/40 rounded-xl border-2 border-[#3A2418]/10">
              <span className="text-2xl block mb-2">🔋</span>
              <h3 className="font-retro text-sm text-[#3A2418] mb-2">Powerbank megőrzése</h3>
              <p className="font-sans font-bold text-xs text-[#3A2418]/70 leading-relaxed">
                Tarts az akkumulátorokat és a telefont a sátrad közepén, mert a közvetlen reggeli napfényben túlmelegedhetnek a sátor falai mellett.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
