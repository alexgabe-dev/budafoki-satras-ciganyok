import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp, Search, Tent, Music, HelpCircle as HelpIcon, Flame, Heart } from 'lucide-react';

interface FaqItem {
  q: string;
  a: string;
  category: 'altalanos' | 'kemping' | 'programok' | 'jegyek';
}

export default function FaqPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState<'all' | 'altalanos' | 'kemping' | 'programok' | 'jegyek'>('all');
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const faqs: FaqItem[] = [
    {
      q: "Mit jelent pontosan a „Sátras Cigányok” elnevezés?",
      a: "Ez egy vidám, baráti és kulturális kezdeményezés. A fesztivál a hagyományos roma folklór, zene és vendégszeretet ünneplése, ahol mindenkit – származástól függetlenül – szeretettel várunk egy közös sátorozós, zenélős, lecsófőzős hétvégére a természet lágy ölén.",
      category: "altalanos"
    },
    {
      q: "Ingyenes a fesztivál, vagy kell jegyet vásárolni?",
      a: "A fesztiválon a látogatás ingyenes, de előzetes regisztrációhoz (jegyértesítőhöz) kötött, hogy fel tudjuk mérni a résztvevők várható számát a kemping és az infrastruktúra kapacitásai miatt. Támogatói jegyeket a helyszínen és online is lehet váltani, amellyel az egyesület kulturális munkáját segíted.",
      category: "jegyek"
    },
    {
      q: "Saját sátrat kell hoznom, vagy van bérlési lehetőség?",
      a: "Igen, a rendezvény klasszikus nomád kemping jellegű, így mindenkinek magának kell gondoskodnia a saját sátráról, hálózsákjáról és polifoamjáról. Sátorbérlésre a helyszínen korlátozott számban van lehetőség, erről érdemes előzetesen érdeklődni e-mailben.",
      category: "kemping"
    },
    {
      q: "Vannak zuhanyzók és rendes mosdók a kempingben?",
      a: "Igen! Bár közvetlenül a vadregényes folyóparton táborozunk, kiépített konténeres melegvizes zuhanyzók, tiszta angolvécék és ivóvízvételi pontok állnak a kempingezők rendelkezésére a nap 24 órájában.",
      category: "kemping"
    },
    {
      q: "Lehet-e kutyát vagy más háziállatot hozni?",
      a: "Igen, a fesztivál abszolút kutya- és állatbarát! Kérjük azonban, hogy csak jól szocializált, békés természetű kutyát hozz magaddal, és a tábor területén mindig gondoskodj a felügyeletéről, illetve takaríts fel utána.",
      category: "altalanos"
    },
    {
      q: "Milyen ételekre és italokra számíthatunk a helyszínen?",
      a: "A gasztro-ponton folyamatosan meleg étellel készülünk: autentikus bográcsos cigánylecsó, helyben sült hagyományos cigánykenyér (punya), fűszeres grillételek és lacipecsenye várja a vendégeket. Emellett a tábori büfében hideg sörök, fröccsök, üdítők és kávé is kaphatóak barátságos árakon.",
      category: "altalanos"
    },
    {
      q: "Saját ételt és italt be szabad vinni a táborba?",
      a: "Igen, saját ételt és italt is behozhatsz a kemping területére saját fogyasztásra, de kérjük, hogy a keletkező szemetet gyűjtsd szelektíven, és támogasd a helyi büfét is, hiszen ebből tudjuk finanszírozni a programokat és a infrastruktúrát.",
      category: "kemping"
    },
    {
      q: "Késő este is lehet zenélni vagy zajongani a sátraknál?",
      a: "A sátorhelyeknél éjfél után csendes pihenőt kérünk, hogy mindenki tudjon pihenni. Viszont a tábortűznél nincs megállás! Ott egészen virradatig lehet halkan énekelni, mesélni és zenélni – de kizárólag akusztikus hangszerekkel, erősítés nélkül.",
      category: "programok"
    },
    {
      q: "Hogyan lehet megközelíteni a helyszínt autóval és tömegközlekedéssel?",
      a: "Autóval a 11-es főútról kell kanyarodni Pilismarót falu központjánál a Duna-part irányába (Akácfa utca). Tömegközlekedéssel Budapestről az Esztergomba vagy Vácra tartó vonattal/busszal, onnan pedig helyközi autóbusszal Pilismarót központjáig lehet jönni, ahonnan kb. 15 perc séta a part.",
      category: "altalanos"
    },
    {
      q: "Vannak gyermekprogramok is, vagy ez inkább felnőtt fesztivál?",
      a: "Ez egy igazi családbarát rendezvény! Napközben kézműves foglalkozások, mesemondás, gyermek táncház és a Duna-parti homokos strand várja a legkisebbeket, így bátran jöhettek gyerekekkel is.",
      category: "programok"
    }
  ];

  const categories = [
    { id: 'all', name: 'Összes kérdés', icon: HelpIcon },
    { id: 'altalanos', name: 'Általános infók', icon: HelpCircle },
    { id: 'kemping', name: 'Kempingezés', icon: Tent },
    { id: 'programok', name: 'Programok', icon: Music },
    { id: 'jegyek', name: 'Jegyek & Regisztráció', icon: Flame },
  ];

  const filteredFaqs = faqs.filter(faq => {
    const matchesCategory = activeCategory === 'all' || faq.category === activeCategory;
    const matchesSearch = faq.q.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          faq.a.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const toggleExpand = (idx: number) => {
    if (expandedIndex === idx) {
      setExpandedIndex(null);
    } else {
      setExpandedIndex(idx);
    }
  };

  return (
    <div className="pt-36 lg:pt-40 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto animate-fade-in select-none">
      {/* Page Title Header */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <h1 className="font-retro text-4xl sm:text-5xl md:text-6xl text-darkbrown uppercase tracking-tight mt-4 text-stroke-retro [text-shadow:4px_4px_0px_#FFF] filter drop-shadow-sm leading-none">
          GYAKRAN ISMÉTELT KÉRDÉSEK (GYIK)
        </h1>
        <p className="font-sans text-sm sm:text-base text-darkbrown/80 font-medium mt-6 leading-relaxed">
          Minden fontos tudnivaló egy helyen a kempingről, a kajákról, a zenéről és a szabályokról. Használd a keresőt vagy szűrj kategóriák szerint!
        </p>
      </div>

      {/* Interactive Search Bar */}
      <div className="max-w-2xl mx-auto mb-10">
        <div className="relative">
          <input
            type="text"
            placeholder="Keress a kérdések vagy válaszok között..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-4 rounded-2xl border-3 border-darkbrown bg-white font-sans font-bold text-sm text-darkbrown placeholder-darkbrown/40 focus:outline-none focus:ring-3 focus:ring-orange/30 retro-shadow-sm transition-all"
          />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-darkbrown/50 stroke-[2.5]" />
        </div>
      </div>

      {/* Category Filter Tabs */}
      <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-12">
        {categories.map((cat) => {
          const Icon = cat.icon;
          const isActive = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => {
                setActiveCategory(cat.id as any);
                setExpandedIndex(null); // Close active accordion
              }}
              className={`
                flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 transition-all font-sans font-black text-xs uppercase tracking-wider cursor-pointer
                ${isActive 
                  ? 'bg-orange text-cream border-darkbrown retro-shadow-sm scale-102' 
                  : 'bg-white hover:bg-cream text-darkbrown border-darkbrown'
                }
              `}
            >
              <Icon className="w-4 h-4" />
              <span>{cat.name}</span>
            </button>
          );
        })}
      </div>

      {/* Accordion Questions List */}
      <div className="max-w-3xl mx-auto space-y-4 min-h-[250px]">
        {filteredFaqs.length > 0 ? (
          filteredFaqs.map((faq, idx) => {
            const isExpanded = expandedIndex === idx;
            return (
              <div 
                key={idx}
                className="bg-white rounded-2xl border-3 border-darkbrown retro-shadow-sm overflow-hidden transition-all duration-200"
              >
                <button
                  onClick={() => toggleExpand(idx)}
                  className="w-full px-5 py-4 sm:px-6 sm:py-5 flex items-center justify-between gap-4 text-left font-sans font-black text-xs sm:text-sm text-darkbrown hover:bg-cream/20 transition-colors select-none cursor-pointer"
                >
                  <span className="uppercase tracking-wide">{faq.q}</span>
                  <div className="bg-cream p-1.5 rounded-lg border border-darkbrown shrink-0">
                    {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  </div>
                </button>

                {/* Animated expandable body */}
                <div 
                  className={`
                    transition-all duration-300 ease-in-out border-darkbrown
                    ${isExpanded ? 'max-h-[500px] border-t-2 opacity-100 p-5 sm:p-6 bg-cream/15' : 'max-h-0 opacity-0 pointer-events-none'}
                  `}
                >
                  <p className="font-sans text-xs sm:text-sm text-darkbrown/90 leading-relaxed font-bold">
                    {faq.a}
                  </p>
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center py-16 bg-white rounded-3xl border-3 border-darkbrown p-8">
            <HelpIcon className="w-12 h-12 text-darkbrown/30 mx-auto mb-3" />
            <h4 className="font-retro text-lg text-darkbrown uppercase tracking-tight">Nem találtunk kérdést</h4>
            <p className="font-sans text-xs text-darkbrown/60 font-bold mt-1">
              Próbálkozz más keresőszóval, vagy válassz másik kategóriát!
            </p>
          </div>
        )}
      </div>

      {/* Help Banner at the bottom */}
      <div className="bg-[#FAF0ED] rounded-3xl border-3 border-darkbrown max-w-3xl mx-auto mt-16 p-6 sm:p-8 flex flex-col sm:flex-row items-center gap-6">
        <div className="bg-orange p-3.5 rounded-2xl border-2 border-darkbrown shrink-0 text-cream shadow-sm">
          <Heart className="w-6 h-6" />
        </div>
        <div className="text-center sm:text-left">
          <h4 className="font-retro text-md text-darkbrown uppercase tracking-tight">Nem találtad a választ?</h4>
          <p className="font-sans text-xs sm:text-sm text-darkbrown/85 font-bold mt-1 leading-normal">
            Ha olyan egyedi kérdésed van, amire itt nem tértünk ki, írj nekünk közvetlenül a Kapcsolati oldalon, vagy keress minket telefonon!
          </p>
        </div>
      </div>
    </div>
  );
}
