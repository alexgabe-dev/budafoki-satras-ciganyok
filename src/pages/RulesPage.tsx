import React from 'react';
import { Shield, Flame, Trash2, Heart, VolumeX, AlertTriangle, Check, Compass } from 'lucide-react';

export default function RulesPage() {
  const categories = [
    {
      title: "Biztonság & Egészség",
      icon: Shield,
      color: "bg-orange",
      rules: [
        "A tábor területén 0-24 órás elsősegélynyújtás és biztonsági szolgálat üzemel. Bármi gond adódik, keresd a szervezőket a sárga pólóban!",
        "Fürdés a Dunában kizárólag kijelölt strand területén, napközben, és kizárólag saját felelősségre megengedett.",
        "A kempingbe üvegpalackot, pirotechnikai eszközt, szúró-vágó eszközt vagy bármilyen veszélyes tárgyat behozni szigorúan TILOS."
      ]
    },
    {
      title: "Tűzrakás & Tábortűz",
      icon: Flame,
      color: "bg-olive",
      rules: [
        "Saját, nyílt lángú tüzet rakni közvetlenül a sátrak mellett szigorúan TILOS és életveszélyes!",
        "Tüzet kizárólag a kijelölt központi tábortűznél és a kiépített főzőhelyeknél szabad gyújtani, a szervezők felügyelete mellett.",
        "Mindig gondoskodj arról, hogy legyen a közelben oltóvíz, és soha ne hagyd őrizetlenül a parazsat!"
      ]
    },
    {
      title: "Környezetvédelem",
      icon: Trash2,
      color: "bg-turquoise",
      rules: [
        "Védd a Duna-part és a Pilismaróti-öböl csodálatos élővilágát! Szemetelni a legkisebb mértékben is tilos.",
        "Használd a tábor területén elhelyezett szelektív hulladékgyűjtőket!",
        "A természetes vizekben környezetszennyező tusfürdők és samponok használata tilos, kérjük használj biológiailag lebomló tisztálkodószereket a zuhanyzókban!"
      ]
    },
    {
      title: "Csendrend & Együttélés",
      icon: VolumeX,
      color: "bg-darkbrown",
      rules: [
        "A sátorhelyeknél 24:00 és 08:00 óra között csendes pihenő van érvényben. Kérjük, ilyenkor ne hangoskodjatok a sátrak közvetlen közelében.",
        "A tábortűznél az éjszakai órákban is szabad énekelni és zenélni, de kizárólag akusztikus hangszerekkel (gitár, hegedű, kanna, cajon)!",
        "Légy tekintettel a kempingező társaidra. A békés együttélés alapja a kölcsönös tisztelet."
      ]
    }
  ];

  const quickDosAndDonts = {
    dos: [
      "Hozz magaddal elegendő szúnyogriasztót és naptejet!",
      "Mosolyogj, ismerkedj és kóstold meg a cigány konyhát!",
      "Tartsd tisztán a sátrad környékét!",
      "Hozd el a saját akusztikus hangszeredet a tábortűzhöz!"
    ],
    donts: [
      "Ne vigyél üvegpoharat a kavicsos partra vagy a folyóba!",
      "Ne hagyd a sátrad nyitva, ha elmész otthonról!",
      "Ne használj hangszórót maximális hangerőn a kempingben!",
      "Ne rongáld a fákat és a természetes növényzetet!"
    ]
  };

  return (
    <div className="pt-36 lg:pt-40 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto animate-fade-in">
      {/* Page Title Header */}
      <div className="text-center max-w-3xl mx-auto mb-16 select-none">
        <h1 className="font-retro text-4xl sm:text-5xl md:text-6xl text-darkbrown uppercase tracking-tight mt-4 text-stroke-retro [text-shadow:4px_4px_0px_#FFF] filter drop-shadow-sm leading-none">
          TÁBORI HÁZIREND
        </h1>
        <p className="font-sans text-sm sm:text-base text-darkbrown/80 font-medium mt-6 leading-relaxed">
          Annak érdekében, hogy a <a href="https://bfzh.hu" target="_blank" rel="noreferrer" className="text-orange underline font-black">Budafoki Zarándokház</a> által szervezett II. Budafoki Sátras Cigányok tábor mindannyiunk számára felejthetetlen, biztonságos és békés élmény legyen, kérjük, olvasd el és tartsd be a kemping szabályait.
        </p>
      </div>

      {/* Main Rules Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
        {categories.map((category, index) => {
          const Icon = category.icon;
          return (
            <div 
              key={index}
              className="bg-white rounded-3xl border-3 border-darkbrown retro-shadow p-6 sm:p-8 hover:-translate-y-1 transition-all duration-300"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className={`${category.color} p-3.5 rounded-2xl border-2 border-darkbrown shadow-sm`}>
                  <Icon className="w-6 h-6 text-cream" />
                </div>
                <h3 className="font-retro text-lg sm:text-xl text-darkbrown uppercase tracking-tight">
                  {category.title}
                </h3>
              </div>

              <ul className="space-y-4">
                {category.rules.map((rule, ruleIdx) => (
                  <li key={ruleIdx} className="flex gap-3 items-start">
                    <span className="w-2.5 h-2.5 rounded-full bg-orange mt-1.5 shrink-0 border border-darkbrown"></span>
                    <p className="font-sans text-xs sm:text-sm text-darkbrown/90 leading-relaxed font-bold">
                      {rule}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>

      {/* Quick Summary Grid (DOs & DONTs) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
        {/* DOs */}
        <div className="bg-[#E9F4F2] rounded-3xl border-3 border-darkbrown retro-shadow p-6 sm:p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-turquoise p-2 rounded-xl border-2 border-darkbrown">
              <Check className="w-5 h-5 text-cream" />
            </div>
            <h3 className="font-retro text-md sm:text-lg text-darkbrown uppercase tracking-tight">
              AMIT AJÁNLUNK (IGEN!)
            </h3>
          </div>
          <ul className="space-y-3.5">
            {quickDosAndDonts.dos.map((item, idx) => (
              <li key={idx} className="flex gap-3 items-center">
                <div className="w-5 h-5 rounded-md bg-white border-2 border-turquoise flex items-center justify-center shrink-0">
                  <Check className="w-3.5 h-3.5 text-turquoise stroke-[3]" />
                </div>
                <span className="font-sans text-xs sm:text-sm text-darkbrown font-bold">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* DONTs */}
        <div className="bg-[#FAF0ED] rounded-3xl border-3 border-darkbrown retro-shadow p-6 sm:p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-orange p-2 rounded-xl border-2 border-darkbrown">
              <AlertTriangle className="w-5 h-5 text-cream" />
            </div>
            <h3 className="font-retro text-md sm:text-lg text-darkbrown uppercase tracking-tight">
              AMIT KERÜLJÜNK (NEM!)
            </h3>
          </div>
          <ul className="space-y-3.5">
            {quickDosAndDonts.donts.map((item, idx) => (
              <li key={idx} className="flex gap-3 items-center">
                <div className="w-5 h-5 rounded-md bg-white border-2 border-orange flex items-center justify-center shrink-0">
                  <span className="w-2.5 h-2.5 rounded-full bg-orange"></span>
                </div>
                <span className="font-sans text-xs sm:text-sm text-darkbrown font-bold">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Call to action card */}
      <div className="bg-orange text-cream rounded-3xl border-3 border-darkbrown retro-shadow p-8 text-center relative overflow-hidden select-none">
        <div className="absolute -top-12 -right-12 w-32 h-32 rounded-full border-4 border-dashed border-cream/20 opacity-30"></div>
        <div className="absolute -bottom-12 -left-12 w-32 h-32 rounded-full border-4 border-dashed border-cream/20 opacity-30"></div>
        
        <Compass className="w-12 h-12 mx-auto mb-4 animate-spin-slow text-cream/90" />
        <h3 className="font-retro text-lg sm:text-2xl uppercase tracking-tight mb-2 [text-shadow:2px_2px_0px_#3A2418]">
          EGYÜTT, FIGYELMESEN
        </h3>
        <p className="font-sans text-xs sm:text-sm max-w-xl mx-auto opacity-90 font-bold leading-relaxed">
          Kérjük, hogy a tábor ideje alatt vigyázzunk egymásra, a környezetre és a helyi lakosok nyugalmára is. Köszönjük a megértést és a szabályok betartását! Találkozunk a Duna-parton!
        </p>
      </div>
    </div>
  );
}
