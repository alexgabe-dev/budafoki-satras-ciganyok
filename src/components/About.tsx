import React from 'react';
import { Tent, Music, Beer, Sparkles } from 'lucide-react';

export default function About() {
  const features = [
    {
      title: 'SÁTOROZZ A DUNÁNÁL',
      description: 'Hozd a sátrad, a matracodat meg a barátaidat, és élvezd a Duna-parti életérzést egy teljes hétvégén át! Nincs recepció, csak a természet.',
      icon: Tent,
      iconBg: 'bg-turquoise',
      iconColor: 'text-cream',
      decoration: '⛺',
    },
    {
      title: 'ZENE & PARTY',
      description: 'Esti koncertek, tábortűz melletti gitározás, meleg fényfüzérek, sörök és hajnalig tartó sztorizások a csillagos égbolt alatt.',
      icon: Music,
      iconBg: 'bg-orange',
      iconColor: 'text-cream',
      decoration: '🎵',
    },
    {
      title: 'BARÁTOK & VIBE',
      description: 'Közös bográcsozás, hideg italok, strandröplabda, nagy nevetések és új barátságok. Itt mindenki haver, mire lemegy a nap.',
      icon: Beer,
      iconBg: 'bg-sand',
      iconColor: 'text-darkbrown',
      decoration: '🍻',
    },
  ];

  return (
    <section id="about" className="py-20 bg-cream paper-texture relative overflow-hidden">
      {/* Sun Ray decorative shapes */}
      <div className="absolute top-0 right-[-10%] w-[400px] h-[400px] bg-sand/10 rounded-full blur-[40px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[300px] h-[300px] bg-orange/10 rounded-full blur-[40px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-olive/10 border-2 border-olive rounded-full text-olive font-bold text-xs uppercase tracking-wider mb-4">
            <Sparkles className="w-4 h-4" /> KEMPING ÉLETÉRZÉS
          </div>
          <h2 className="font-retro text-3xl sm:text-5xl text-darkbrown tracking-tight uppercase">
            ★ MI EZ AZ EGÉSZ? ★
          </h2>
          <div className="w-24 h-1.5 bg-orange mx-auto mt-4 rounded-full retro-border"></div>
          <p className="mt-6 font-sans font-bold text-lg text-darkbrown/85 leading-relaxed">
            Egy laza, nyári hétvége a Duna mellett, ahol a sátor a szálloda, a kavicsos part a VIP lounge, és a naplemente adja a főfényt. Semmi feszülés, csak te meg a haverok.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="bg-[#FFFDF6] p-8 rounded-2xl retro-border-thick retro-shadow-lg transition-transform hover:-translate-y-2 hover:translate-x-0.5 duration-200 relative group"
              >
                {/* Decoration Sticker style */}
                <div className="absolute top-4 right-4 text-2xl select-none opacity-40 group-hover:opacity-100 transition-opacity">
                  {item.decoration}
                </div>

                {/* Circular Icon Container */}
                <div className={`w-16 h-16 ${item.iconBg} rounded-2xl retro-border retro-shadow-sm flex items-center justify-center mb-6`}>
                  <Icon className={`w-8 h-8 ${item.iconColor}`} strokeWidth={2} />
                </div>

                {/* Card Title */}
                <h3 className="font-retro text-xl text-darkbrown tracking-tight mb-4 select-none">
                  {item.title}
                </h3>

                {/* Card Description */}
                <p className="font-sans text-sm font-medium text-darkbrown/80 leading-relaxed">
                  {item.description}
                </p>

                {/* Stamp Circle Background Accent */}
                <div className="absolute bottom-4 right-4 w-12 h-12 rounded-full border border-darkbrown/5 flex items-center justify-center pointer-events-none">
                  <div className="w-10 h-10 rounded-full border border-dashed border-darkbrown/10"></div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Cute quotation section on bottom */}
        <div className="mt-16 text-center max-w-2xl mx-auto bg-sand/30 p-6 rounded-2xl border-2 border-dashed border-darkbrown/30">
          <p className="font-sans italic font-bold text-darkbrown/80">
            "A sátorozás lényege nem a luxus, hanem az az érzés, amikor reggel kicipzározod a sátrad, és a Duna illata csap meg először."
          </p>
          <p className="font-retro text-[11px] text-orange mt-2 tracking-widest uppercase">— A BFZH vezetősége</p>
        </div>

      </div>
    </section>
  );
}
