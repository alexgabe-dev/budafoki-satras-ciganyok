import React from 'react';
import Location from '../components/Location';
import { Compass, Sparkles, Check, AlertCircle } from 'lucide-react';
import { useContent } from '../hooks/useContent';

export default function LocationPage() {
  const content = useContent({
    'location.header.title': '★ UTICÉL & HELYSZÍN ★',
    'location.header.description': 'A II. Budafoki Sátras Cigányok Fesztivál közvetlenül a vadregényes kavicsos Duna-parton kerül megrendezésre. Nézd meg az interaktív térképet és a megközelítési módokat!',
  });
  const safetyRules = [
    {
      title: 'KÖRNYEZETVÉDELEM & SZEMÉT',
      desc: 'A Duna-part csodálatos természet, vigyázzunk rá! Hozz magaddal szemeteszsákot, és ne hagyj hátra semmit.'
    },
    {
      title: 'TŰZRAKÁS & BOGRÁC',
      desc: 'Tüzet csak a kijelölt táborhelyeken és bográcsozó helyeken szabad gyújtani, állandó felügyelet mellett.'
    },
    {
      title: 'FÜRDÉS A DUNÁBAN',
      desc: 'A folyó sodrása erős lehet! Fürdés csak saját felelősségre, józan állapotban, kizárólag a biztonságos sávban.'
    },
    {
      title: 'EGYMÁS TISZTELETBEN TARTÁSA',
      desc: 'A rendezvény a békés kempingezésről szól. Kerüljük a hangoskodást a csendespihenő időkben (02:00 - 08:00).'
    }
  ];

  return (
    <div className="pt-36 lg:pt-40 pb-20 bg-cream paper-texture min-h-screen animate-fade-in">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Intro */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <h1 className="font-retro text-3xl sm:text-5xl text-[#3A2418] uppercase tracking-tight">
            {content('location.header.title')}
          </h1>
          <div className="w-24 h-1.5 bg-turquoise mx-auto mt-4 rounded-full retro-border"></div>
          <p className="mt-6 font-sans font-extrabold text-sm sm:text-base text-[#3A2418]/80 leading-relaxed">
            {content('location.header.description')}
          </p>
        </div>

        {/* Core Location Element */}
        <Location isSubpage={true} />

        {/* Camping Rules & Guidelines (UX Value!) */}
        <div className="mt-16 bg-[#FFFDF6] border-3 border-[#3A2418] rounded-2xl shadow-lg p-6 sm:p-10">
          <div className="flex items-center gap-3 mb-8">
            <div className="bg-orange p-2.5 rounded-xl border-2 border-[#3A2418] text-cream">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div>
              <p className="font-retro text-[9px] text-orange tracking-widest uppercase">KEMPING KÓDEX</p>
              <h2 className="font-retro text-xl sm:text-2xl text-[#3A2418] uppercase tracking-wider">
                HÁZIREND ÉS BIZTONSÁG
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            {safetyRules.map((rule, idx) => (
              <div 
                key={idx}
                className="bg-cream/40 p-5 rounded-xl border-2 border-[#3A2418]/10 hover:border-orange/20 transition-all flex gap-4 items-start"
              >
                <span className="font-retro text-xl text-orange mt-0.5">★</span>
                <div>
                  <h3 className="font-retro text-sm sm:text-base text-[#3A2418] tracking-tight leading-tight mb-2">
                    {rule.title}
                  </h3>
                  <p className="font-sans font-bold text-xs text-[#3A2418]/70 leading-relaxed">
                    {rule.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
