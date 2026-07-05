import React from 'react';
import { Sun, Moon, Sparkles, Clock } from 'lucide-react';

interface ProgramProps {
  isSubpage?: boolean;
}

export default function Program({ isSubpage = false }: ProgramProps) {
  const schedule = [
    {
      day: 'PÉNTEK',
      date: 'Július 24.',
      icon: Moon,
      iconColor: 'text-amber-300',
      events: [
        { time: '16:00', title: 'Kapunyitás, érkezés', desc: 'Sátorhelyek elfoglalása, kemping berendezése' },
        { time: '18:00', title: 'Sátorállítás & chill', desc: 'Első sörök kibontása, ismerkedés a parttal' },
        { time: '20:30', title: 'Akusztikus este', desc: 'Gitárszó, tábortűz és közös éneklés' },
        { time: '23:00', title: 'DJ szett', desc: 'Laza nyári ütemek a tábortűz mellé' },
      ],
    },
    {
      day: 'SZOMBAT',
      date: 'Július 25.',
      icon: Sun,
      iconColor: 'text-orange',
      events: [
        { time: '11:00', title: 'Reggeli chill', desc: 'Kávé, frissítő és lassú ébredezés' },
        { time: '14:00', title: 'Strand party', desc: 'Fröccsözés, fürdés, strandröplabda a Dunában' },
        { time: '18:00', title: 'Bogrács / közös vacsora', desc: 'Hagyományos bográcsgulyás főzés közösen' },
        { time: '22:00', title: 'Duna Party főest', desc: 'A fesztivál legnagyobb bulija fényfüzérek alatt' },
        { time: '02:00', title: 'After party', desc: 'Chilles hajnali beszélgetések a parton' },
      ],
    },
    {
      day: 'VASÁRNAP',
      date: 'Július 26.',
      icon: Sun,
      iconColor: 'text-yellow-500',
      events: [
        { time: '11:00', title: 'Közös reggeli', desc: 'A tegnapi bogrács maradékainak melegítése' },
        { time: '13:00', title: 'Duna chill', desc: 'Utolsó fürdőzés, pihenés az árnyékban' },
        { time: '16:00', title: 'Pakolás', desc: 'Sátorbontás, rendrakás, tiszta part hátrahagyása' },
        { time: '18:00', title: 'Hazafelé', desc: 'Könnyes búcsú a Dunától, indulás haza' },
      ],
    },
  ];

  const content = (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start relative">
      {schedule.map((dayData, idx) => {
        const DayIcon = dayData.icon;
        return (
          <div
            key={idx}
            className="bg-cream text-darkbrown rounded-2xl retro-border-thick retro-shadow-lg p-6 md:p-8 relative overflow-hidden"
          >
            {/* Vintage Card Top Section */}
            <div className="flex justify-between items-center border-b-2 border-dashed border-darkbrown/30 pb-4 mb-6">
              <div>
                <h3 className="font-retro text-2xl tracking-tight leading-none text-darkbrown">
                  {dayData.day}
                </h3>
                <p className="font-sans font-bold text-xs text-orange uppercase tracking-wider mt-1">
                  {dayData.date}
                </p>
              </div>
              <div className="p-2.5 bg-darkbrown/5 rounded-xl border border-darkbrown/10">
                <DayIcon className={`w-6 h-6 ${dayData.iconColor}`} strokeWidth={2.5} />
              </div>
            </div>

            {/* Event list */}
            <div className="space-y-6">
              {dayData.events.map((event, eIdx) => (
                <div key={eIdx} className="flex gap-4 group">
                  {/* Time sticker */}
                  <div className="flex flex-col items-center">
                    <div className="font-retro text-xs text-cream bg-orange px-2 py-1 rounded border-2 border-darkbrown shadow-sm flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {event.time}
                    </div>
                    {eIdx < dayData.events.length - 1 && (
                      <div className="w-0.5 flex-1 bg-darkbrown/20 border-dashed border-l mt-2"></div>
                    )}
                  </div>

                  {/* Event Details */}
                  <div className="flex-1 pb-1">
                    <h4 className="font-sans font-extrabold text-sm sm:text-base text-darkbrown group-hover:text-orange transition-colors">
                      {event.title}
                    </h4>
                    <p className="font-sans font-semibold text-xs text-darkbrown/90 mt-1 leading-relaxed">
                      {event.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}

      {/* Large Retro "HAMAROSAN" Stamp Floating next to the cards (Hidden on mobile/tablet to avoid overlap bugs) */}
      <div className="hidden xl:flex absolute right-[-20px] bottom-[-40px] transform rotate-[-15deg] select-none pointer-events-none opacity-90 z-20">
        <div className="w-44 h-44 rounded-full border-4 border-double border-orange/40 flex flex-col items-center justify-center p-2 bg-[#FFF1D0]/90 backdrop-blur-sm shadow-xl retro-border-thick">
          <div className="w-36 h-36 rounded-full border border-dashed border-orange/30 flex flex-col items-center justify-center">
            <span className="font-retro text-2xl text-orange tracking-widest leading-none">HAMAROSAN</span>
            <span className="font-sans text-[9px] font-extrabold text-darkbrown uppercase tracking-widest mt-1">★ BSC 2026 ★</span>
          </div>
        </div>
      </div>
    </div>
  );

  if (isSubpage) {
    return content;
  }

  return (
    <section id="program" className="py-20 bg-turquoise relative overflow-hidden text-cream border-t-4 border-b-4 border-darkbrown">
      {/* Wooden texture lines overlay */}
      <div className="absolute inset-0 wood-texture opacity-15 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Title */}
        <div className="text-center max-w-2xl mx-auto mb-16 relative">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-cream text-darkbrown border-2 border-darkbrown rounded-full font-black text-xs uppercase tracking-wider mb-4 shadow-sm">
            <Sparkles className="w-4 h-4 text-orange" /> NAPI BONTÁS
          </div>
          <h2 className="font-retro text-3xl sm:text-5xl text-cream tracking-tight uppercase text-stroke-retro-thick [text-shadow:4px_4px_0px_#3A2418]">
            ★ PROGRAMTERV ★
          </h2>
          <div className="w-24 h-1.5 bg-orange mx-auto mt-4 rounded-full retro-border"></div>
        </div>

        {content}

      </div>
    </section>
  );
}
