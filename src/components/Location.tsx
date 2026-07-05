import React, { useState } from 'react';
import { 
  MapPin, 
  Navigation, 
  Compass, 
  Car, 
  Train, 
  Bike, 
  Tent, 
  Music, 
  Flame, 
  Anchor, 
  Waves, 
  Info, 
  Sparkles,
  Clock,
  Map
} from 'lucide-react';

interface LocationProps {
  isSubpage?: boolean;
}

export default function Location({ isSubpage = false }: LocationProps) {
  const directionsUrl = "https://www.google.com/maps/dir/?api=1&destination=47.809819,18.867262";

  // Points of Interest for the interactive Pilismarót map
  const pois = [
    {
      id: 'stage',
      title: 'FŐSZÍNPAD & TÁBORTŰZ',
      desc: 'Az élőzene, az autentikus roma folklór és az éjszakai nagy mulatságok központja. Esténként hatalmas tábortűz mellett énekelünk és mesélünk történeteket.',
      badge: 'FŐHELYSZÍN',
      x: 240,
      y: 202,
      icon: Music,
      color: '#D9793D',
      time: 'Programok szerint'
    },
    {
      id: 'camping',
      title: 'SÁTRAS KEMPING HELYEK',
      desc: 'Árnyas, füves sátorhelyek közvetlenül a Dunakanyar panorámájával a folyóparton. Zuhanyzók, mosdók és ivóvízpontok közvetlen közelében.',
      badge: 'SZÁLLÁS',
      x: 280,
      y: 115,
      icon: Tent,
      color: '#8FA460',
      time: '0-24 órában nyitva'
    },
    {
      id: 'beach',
      title: 'KAVICSOS SZABADSTRAND',
      desc: 'Csodálatos, természetes homokos-kavicsos partszakasz. Napközbeni hűsölésre, úszásra és strandröplabdázásra kiválóan alkalmas szakasz.',
      badge: 'REKREÁCIÓ',
      x: 420,
      y: 125,
      icon: Waves,
      color: '#54B4C3',
      time: 'Napközben (saját felelősségre)'
    },
    {
      id: 'gastronomy',
      title: 'CIGÁNY KONYHA & GASZTRO',
      desc: 'A hagyományos roma ételek főzőhelye. Kóstold meg a helyben sült cigánykenyeret (punya), az autentikus lecsót és a gazdagon fűszerezett tábori ételeket!',
      badge: 'GASZTRO',
      x: 180,
      y: 270,
      icon: Flame,
      color: '#E05A47',
      time: 'Meleg ételek: 12:00 - 23:00'
    },
    {
      id: 'parking',
      title: 'INGYENES TÁBORI PARKOLÓ',
      desc: 'Kizárólag a kempingezők és látogatók részére fenntartott, tágas füves parkoló. Közvetlen, gyors bejárattal a kemping és rendezvény területére.',
      badge: 'PARKOLÁS',
      x: 80,
      y: 330,
      icon: Car,
      color: '#6B594D',
      time: 'Folyamatosan elérhető'
    },
    {
      id: 'boatgraveyard',
      title: 'PILISMARÓTI HAJÓTEMETŐ',
      desc: 'Egy misztikus helyi nevezetesség a védett öböl csendes vizében. Elhagyatott uszályok és régi hajók izgalmas roncsai, különleges fotós helyszín a part mellett.',
      badge: 'LÁTNIVALÓ',
      x: 460,
      y: 200,
      icon: Anchor,
      color: '#2F9EAA',
      time: 'Sétaútvonalon elérhető'
    }
  ];

  const [activePoiId, setActivePoiId] = useState<string>('stage');

  const activePoi = pois.find(p => p.id === activePoiId) || pois[0];
  const ActivePoiIcon = activePoi.icon;

  const accessOptions = [
    {
      title: 'AUTÓVAL',
      desc: 'Budapest felől az 11-es úton Szentendre-Visegrád irányába Pilismarótig, onnan a Duna-partra vezető betonozott úton (kb. 1 óra). Ingyenes, tágas parkoló biztosított.',
      icon: Car,
    },
    {
      title: 'BUSZ / TÖMEGKÖZLEKEDÉS',
      desc: 'Budapest Újpest-Városkapu felől a 880-as távolsági busszal Pilismarót községházáig, onnan kényelmes sétatáv lefelé, vagy vedd igénybe ingyenes tábori tuk-tuk transzferünket!',
      icon: Train,
    },
    {
      title: 'KERÉKPÁRRAL',
      desc: 'Az EuroVelo 6 nemzetközi Duna-menti kerékpárút közvetlenül érinti Pilismarótot. Csodás panorámájú, sík kerékpárút vezet a főváros és Esztergom felől is.',
      icon: Bike,
    },
  ];

  const gridContent = (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
      
      {/* Details Column - 5 cols */}
      <div className="lg:col-span-5 flex flex-col justify-between gap-6">
        
        {/* Main Location & General Info Card */}
        <div className="bg-[#FFFDF6] p-6 sm:p-8 rounded-2xl retro-border-thick retro-shadow-lg space-y-6">
          <div className="flex items-start gap-4">
            <div className="bg-orange p-3 rounded-xl retro-border text-cream mt-1 shrink-0">
              <MapPin className="w-6 h-6" />
            </div>
            <div>
              <span className="font-retro text-[9px] text-orange tracking-widest block uppercase">ÚJ HELYSZÍNÜNK</span>
              <h3 className="font-retro text-xl sm:text-2xl text-darkbrown leading-tight uppercase">
                PILISMARÓTI-ÖBÖL
              </h3>
              <p className="font-sans font-extrabold text-xs text-orange mt-1">
                2028 Pilismarót, Duna-part (Öböl strand)
              </p>
            </div>
          </div>

          <p className="font-sans font-bold text-xs sm:text-sm text-darkbrown/85 leading-relaxed">
            "A Dunakanyar egyik legszebb, vadregényes szeglete. A pilismaróti Duna-öböl füves-homokos partja, a háttérben magasodó Visegrádi-hegység és a békés víztükör tökéletes, biztonságos menedéket ad az idei fesztiválunknak."
          </p>

          {/* Transport options */}
          <div className="space-y-4 border-t border-dashed border-darkbrown/15 pt-5">
            <h4 className="font-retro text-xs text-darkbrown uppercase tracking-wider flex items-center gap-2">
              <Compass className="w-4 h-4 text-turquoise" /> Hogyan jutsz el ide?
            </h4>
            {accessOptions.map((opt, i) => {
              const Icon = opt.icon;
              return (
                <div key={i} className="flex gap-3 group">
                  <div className="bg-sand/30 p-2 rounded-lg border border-darkbrown/10 h-9 w-9 flex items-center justify-center shrink-0">
                    <Icon className="w-4.5 h-4.5 text-[#5C3A21]" />
                  </div>
                  <div>
                    <h5 className="font-retro text-[10px] text-darkbrown leading-none">{opt.title}</h5>
                    <p className="font-sans font-bold text-[11px] text-darkbrown/70 leading-snug mt-1">{opt.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected POI Details Box - Highly interactive dynamic feedback */}
        <div className="bg-cream rounded-2xl border-3 border-darkbrown p-6 relative overflow-hidden retro-shadow-sm flex-1 flex flex-col justify-between">
          <div className="absolute top-0 right-0 bg-darkbrown text-cream text-[8px] font-sans font-black tracking-widest px-3 py-1 rounded-bl-xl uppercase flex items-center gap-1">
            <Sparkles className="w-2.5 h-2.5 text-orange animate-spin" /> INTERAKTÍV PONT
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 bg-orange/10 border border-orange rounded-full font-retro text-[9px] text-orange uppercase tracking-wider">
                {activePoi.badge}
              </span>
              <span className="font-sans font-black text-[10px] text-darkbrown/60 uppercase flex items-center gap-1">
                <Clock className="w-3 h-3 text-turquoise" /> {activePoi.time}
              </span>
            </div>

            <div className="flex items-center gap-2.5 pt-1">
              <div 
                className="w-8 h-8 rounded-xl border-2 border-darkbrown flex items-center justify-center text-cream shadow-sm shrink-0"
                style={{ backgroundColor: activePoi.color }}
              >
                <ActivePoiIcon className="w-4.5 h-4.5" />
              </div>
              <h4 className="font-retro text-base text-darkbrown uppercase leading-none tracking-tight">
                {activePoi.title}
              </h4>
            </div>

            <p className="font-sans font-bold text-xs text-darkbrown/80 leading-relaxed pt-1.5">
              {activePoi.desc}
            </p>
          </div>

          <div className="pt-5 border-t border-dashed border-darkbrown/10 mt-4 flex items-center justify-between text-[10px] font-sans font-black text-darkbrown/50 uppercase">
            <span>Koppints a térkép ikonjaira további részletekért!</span>
            <span className="text-orange animate-pulse">● Aktív</span>
          </div>
        </div>

        <div className="mt-2">
          <a
            href={directionsUrl}
            target="_blank"
            rel="noreferrer"
            className="w-full font-retro text-xs text-center text-cream bg-turquoise hover:bg-turquoise/95 py-4 rounded-xl retro-border retro-shadow transition-all hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-retro-sm active:translate-x-1 active:translate-y-1 inline-flex items-center justify-center gap-2"
          >
            <Navigation className="w-4 h-4" /> ÚTVONALTERV PILISMARÓTRA GOOGLE MAPS-EN
          </a>
        </div>
      </div>

      {/* Map Illustration Column - 7 cols */}
      <div className="lg:col-span-7 flex flex-col gap-4">
        
        {/* The Stylized Map Canvas Container */}
        <div className="bg-[#E8F5F8] rounded-2xl retro-border-thick retro-shadow-lg relative overflow-hidden min-h-[380px] lg:min-h-[460px] flex items-center justify-center p-4 shadow-inner">
          
          {/* Custom Interactive Stylized SVG Map */}
          <svg 
            className="absolute inset-0 w-full h-full object-cover select-none" 
            viewBox="0 0 600 400" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="xMidYMid slice"
          >
            {/* Water Background Layer (Vibrant, clear Google Maps style blue) */}
            <rect width="600" height="400" fill="#78D4E7" />

            {/* Far-Right Shore (Zebegény side) */}
            <path d="M 400,-10 L 610,-10 L 610,40 C 540,25 470,10 400,-10 Z" fill="#D5F2D9" stroke="#C1E7C6" strokeWidth="1" />

            {/* Outer Sandy Beach Layer for Mainland Shoreline to give a beautiful high-fidelity sand effect */}
            <path 
              d="M -10,125 C 120,145 180,160 240,165 C 285,170 320,180 320,205 C 320,230 285,235 240,240 C 180,245 150,250 125,270 C 105,295 115,315 135,330 C 200,340 290,325 380,310 C 440,295 485,275 495,265 C 525,255 545,235 545,210 C 545,225 575,245 610,265 L 610,410 L -10,410 Z" 
              fill="#FFF5C6" 
            />

            {/* Main Land Background (Soft sage/mint green on top of sand) */}
            <path 
              d="M -10,130 C 115,150 175,165 235,170 C 275,175 310,185 310,205 C 310,225 275,230 235,235 C 175,240 145,245 125,265 C 105,290 115,310 135,325 C 195,335 285,320 375,305 C 435,290 480,270 490,260 C 520,250 540,230 540,205 C 540,220 570,240 610,260 L 610,410 L -10,410 Z" 
              fill="#D5F2D9" 
              stroke="#C1E7C6" 
              strokeWidth="1" 
            />

            {/* Sandy Spit (Sand base layer) */}
            <path 
              d="M -10,75 C 150,70 300,85 500,110 C 525,115 525,135 500,140 C 300,115 150,100 -10,100 Z" 
              fill="#FFF5C6" 
            />

            {/* Sandy Spit (Green grass center) */}
            <path 
              d="M -10,80 C 150,76 300,90 490,115 C 510,118 510,130 490,133 C 300,111 150,97 -10,95 Z" 
              fill="#D5F2D9" 
              stroke="#C1E7C6" 
              strokeWidth="1" 
            />
            <text x="320" y="112" fill="#B19A73" fontFamily="sans-serif" fontWeight="bold" fontSize="7" opacity="0.8" letterSpacing="1">HOMOKSZIRT (FÉLSZIGET)</text>

            {/* Water detailing / ripple lines inside the Bay */}
            <path d="M 180,140 Q 220,145 260,140" stroke="#FFF" strokeWidth="1.5" strokeLinecap="round" opacity="0.4" />
            <path d="M 220,285 Q 250,290 280,285" stroke="#FFF" strokeWidth="1.5" strokeLinecap="round" opacity="0.4" />
            <path d="M 400,220 Q 430,230 460,220" stroke="#FFF" strokeWidth="1.5" strokeLinecap="round" opacity="0.4" />

            {/* Water Labels */}
            <text x="240" y="35" fill="#FFF1D0" fontFamily="sans-serif" fontWeight="black" fontSize="11" opacity="0.8" letterSpacing="2" transform="rotate(2, 240, 35)">DUNA FOLYÓ (FŐÁG)</text>
            <text x="360" y="250" fill="#FFF" fontFamily="sans-serif" fontWeight="black" fontSize="10" opacity="0.7" letterSpacing="1.5" transform="rotate(-5, 360, 250)">PILISMARÓTI-ÖBÖL</text>

            {/* Compass symbol */}
            <g transform="translate(540, 330)">
              <circle r="20" fill="#FFF1D0" stroke="#3A2418" strokeWidth="2" />
              {/* Secondary directions */}
              <line x1="-12" y1="-12" x2="12" y2="12" stroke="#3A2418" strokeWidth="1" strokeDasharray="2,2" opacity="0.6" />
              <line x1="-12" y1="12" x2="12" y2="-12" stroke="#3A2418" strokeWidth="1" strokeDasharray="2,2" opacity="0.6" />
              
              {/* Cross lines */}
              <line x1="0" y1="-16" x2="0" y2="16" stroke="#3A2418" strokeWidth="1" opacity="0.5" />
              <line x1="-16" y1="0" x2="16" y2="0" stroke="#3A2418" strokeWidth="1" opacity="0.5" />
              
              {/* North Pointer (Up) */}
              <polygon points="0,-17 -4,-3 0,0" fill="#E05A47" />
              <polygon points="0,-17 4,-3 0,0" fill="#FF7D66" />
              
              {/* South Pointer (Down) */}
              <polygon points="0,17 -4,3 0,0" fill="#6B594D" />
              <polygon points="0,17 4,3 0,0" fill="#8C7667" />

              {/* East Pointer (Right) */}
              <polygon points="17,0 3,-4 0,0" fill="#3A2418" />
              <polygon points="17,0 3,4 0,0" fill="#523B2D" />

              {/* West Pointer (Left) */}
              <polygon points="-17,0 -3,-4 0,0" fill="#3A2418" />
              <polygon points="-17,0 -3,4 0,0" fill="#523B2D" />
              
              <circle r="2.5" fill="#FFF1D0" stroke="#3A2418" strokeWidth="1.5" />
              
              {/* Labels */}
              <text x="0" y="-23" fill="#3A2418" fontFamily="sans-serif" fontWeight="black" fontSize="9" textAnchor="middle">N</text>
              <text x="24" y="3" fill="#3A2418" fontFamily="sans-serif" fontWeight="bold" fontSize="7" textAnchor="start">E</text>
              <text x="0" y="27" fill="#3A2418" fontFamily="sans-serif" fontWeight="bold" fontSize="7" textAnchor="middle">S</text>
              <text x="-24" y="3" fill="#3A2418" fontFamily="sans-serif" fontWeight="bold" fontSize="7" textAnchor="end">W</text>
            </g>

            {/* Ship Graveyard Details (Roncsok / sunken ships in the quiet waters of the bay!) */}
            <g transform="translate(450, 185) rotate(45)" fill="#555" opacity="0.45" stroke="#3A2418" strokeWidth="1">
              <path d="M -12,-3 L 6,-3 L 12,0 L 6,3 L -12,3 Z" />
              <line x1="-2" y1="-3" x2="-2" y2="-10" stroke="#3A2418" strokeWidth="1" />
            </g>
            <g transform="translate(470, 195) rotate(20) scale(0.8)" fill="#555" opacity="0.35" stroke="#3A2418" strokeWidth="1">
              <path d="M -12,-3 L 6,-3 L 12,0 L 6,3 L -12,3 Z" />
              <line x1="0" y1="-3" x2="0" y2="-8" stroke="#3A2418" strokeWidth="1" />
            </g>

            {/* Interactive Pins on SVG (rendered dynamically to maintain standard structure but make it responsive) */}
            {pois.map((poi) => {
              const isActive = poi.id === activePoiId;
              return (
                <g 
                  key={poi.id}
                  transform={`translate(${poi.x}, ${poi.y})`}
                  className="cursor-pointer select-none group"
                  onClick={() => setActivePoiId(poi.id)}
                >
                  {/* Outer glowing pulsing ring for the selected one */}
                  {isActive && (
                    <circle cx="0" cy="0" r="16" fill={poi.color} fillOpacity="0.35" className="animate-pulse">
                      <animate attributeName="r" values="12;22;12" dur="2s" repeatCount="indefinite" />
                    </circle>
                  )}
                  
                  {/* Subtle hover feedback ring */}
                  <circle cx="0" cy="0" r="14" fill={poi.color} fillOpacity="0" className="group-hover:fill-opacity-15 transition-all" />

                  {/* Standard marker pin */}
                  <path 
                    d="M 0,0 C -5,-5 -8,-13 0,-19 C 8,-13 5,-5 0,0 Z" 
                    fill={poi.color} 
                    stroke="#3A2418" 
                    strokeWidth={isActive ? "2" : "1.5"} 
                    className="transition-transform group-hover:scale-110"
                  />
                  {/* White inner dot */}
                  <circle cx="0" cy="-12" r="3.5" fill="#FFF" />
                </g>
              );
            })}

          </svg>

          {/* Floating label overlay */}
          <div className="absolute top-4 left-4 bg-cream/95 backdrop-blur-sm px-4 py-2 rounded-xl retro-border shadow-md pointer-events-none border-2 border-darkbrown">
            <span className="font-retro text-[9px] text-orange tracking-widest block uppercase">TÁBORHELYSZÍN</span>
            <span className="font-sans font-black text-xs text-darkbrown flex items-center gap-1">
              ★ Pilismaróti Duna-part Fesztivál térkép
            </span>
          </div>

          {/* Floating Instruction */}
          <div className="absolute top-4 right-4 bg-[#FFFDF6] px-2.5 py-1.5 rounded-lg border border-darkbrown text-[9px] font-sans font-black text-darkbrown/60 uppercase shadow-sm pointer-events-none">
            Ikonok: Kattints a pontokra!
          </div>

          {/* Dynamic map legend */}
          <div className="absolute bottom-4 left-4 bg-cream/95 backdrop-blur-sm px-3.5 py-2.5 rounded-xl retro-border text-[9px] font-sans font-black text-darkbrown/85 space-y-1.5 pointer-events-none shadow border-2 border-darkbrown">
            <div className="flex items-center gap-2">
              <div className="w-3.5 h-3.5 bg-[#54B4C3] rounded border border-darkbrown"></div>
              <span>Duna folyó / Strand</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3.5 h-3.5 bg-[#8FA460] rounded border border-darkbrown"></div>
              <span>Füves part / Sátorhelyek</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3.5 h-3.5 bg-orange rounded-full border border-darkbrown"></div>
              <span>Aktív pontok (kattinthatóak)</span>
            </div>
          </div>
        </div>

        {/* POI Selector Quick Tabs underneath map - incredible for usability on mobile! */}
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
          {pois.map((poi) => {
            const IconComponent = poi.icon;
            const isActive = poi.id === activePoiId;
            return (
              <button
                key={poi.id}
                onClick={() => setActivePoiId(poi.id)}
                className={`p-2 rounded-xl border-2 font-retro text-[9px] sm:text-[10px] tracking-tight uppercase flex flex-col items-center justify-center gap-1 transition-all hover:scale-[1.03] cursor-pointer ${
                  isActive 
                    ? 'bg-orange text-cream border-darkbrown shadow-sm scale-105' 
                    : 'bg-[#FFFDF6] text-darkbrown border-darkbrown/20 hover:border-darkbrown/50'
                }`}
              >
                <IconComponent className={`w-4 h-4 ${isActive ? 'text-cream' : 'text-darkbrown/60'}`} />
                <span className="truncate max-w-full leading-none text-center">{poi.title.split(' ')[0]}</span>
              </button>
            );
          })}
        </div>

      </div>

    </div>
  );

  if (isSubpage) {
    return gridContent;
  }

  return (
    <section id="location" className="py-20 bg-cream paper-texture relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Title */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-olive/10 border-2 border-olive rounded-full text-olive font-bold text-xs uppercase tracking-wider mb-4">
            <MapPin className="w-4 h-4 text-orange" /> ÚTI CÉL
          </div>
          <h2 className="font-retro text-3xl sm:text-5xl text-darkbrown tracking-tight uppercase">
            ★ HELYSZÍN & TÉRKÉP ★
          </h2>
          <div className="w-24 h-1.5 bg-orange mx-auto mt-4 rounded-full retro-border"></div>
        </div>

        {gridContent}

      </div>
    </section>
  );
}
