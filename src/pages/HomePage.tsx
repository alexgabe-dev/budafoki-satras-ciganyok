import React from 'react';
import { Link } from 'react-router-dom';
import Hero from '../components/Hero';
import About from '../components/About';
import { Calendar, Ticket, MapPin, Image as ImageIcon, ClipboardList, Sparkles, Compass } from 'lucide-react';

export default function HomePage() {
  const bentoItems = [
    {
      title: 'PROGRAM & FELLÉPŐK',
      desc: '3 nap folyamatos akusztikus koncertek, tábortűz melletti zenélések és gasztro élmények.',
      link: '/program',
      btnText: 'Program megtekintése 🎵',
      color: 'bg-turquoise',
      textColor: 'text-cream',
      icon: Calendar,
      badge: 'ZENE & VIBE',
    },
    {
      title: 'JEGYEK',
      desc: 'Iratkozz fel az előregisztrációs listánkra, hogy megszerezd az exkluzív sátras bérleted!',
      link: '/jegyek',
      btnText: 'Előregisztráció 🚀',
      color: 'bg-orange',
      textColor: 'text-cream',
      icon: Ticket,
      badge: 'LIMITED',
    },
    {
      title: 'HELYSZÍN & UTAZÁS',
      desc: 'Hogyan találsz oda? Kemping szabályzat, megközelítés gyalog, kocsival vagy akár kenuval!',
      link: '/helyszin',
      btnText: 'Útmutató & Térkép 🗺️',
      color: 'bg-sand',
      textColor: 'text-darkbrown',
      icon: MapPin,
      badge: 'DUNA-PART',
    },
    {
      title: 'GALÉRIA',
      desc: 'Nézd meg a korábbi évek legemlékezetesebb pillanatait, és hangolódj a Duna-parti életérzésre!',
      link: '/galeria',
      btnText: 'Képek megnyitása 📸',
      color: 'bg-[#4F5B34]',
      textColor: 'text-cream',
      icon: ImageIcon,
      badge: 'RETRO VIBES',
    },
    {
      title: 'MIT HOZZ MAGADDAL?',
      desc: 'Készülj fel okosan! Interaktív ellenőrző lista, hogy semmi ne maradjon otthon a sátorozáshoz.',
      link: '/pakolo-lista',
      btnText: 'Pakolólista megnyitása 🎒',
      color: 'bg-cream',
      textColor: 'text-darkbrown',
      icon: ClipboardList,
      badge: 'HASZNOS',
    },
  ];

  return (
    <div className="animate-fade-in">
      {/* 1. Main Hero Stage */}
      <Hero />

      {/* 2. Intro About Segment */}
      <About />

      {/* 3. Subpage Bento Grid Dashboard */}
      <section className="py-20 bg-[#FFF1D0] paper-texture border-t-4 border-[#3A2418]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-orange/10 border-2 border-orange/40 rounded-full text-orange font-bold text-xs uppercase tracking-wider mb-4">
              <Sparkles className="w-4 h-4" /> FEDEZD FEL AZ ALOLDALAKAT
            </div>
            <h2 className="font-retro text-3xl sm:text-5xl text-[#3A2418] uppercase tracking-tight">
              ★ FESZTIVÁL KALAUZ ★
            </h2>
            <div className="w-24 h-1.5 bg-turquoise mx-auto mt-4 rounded-full retro-border"></div>
            <p className="mt-6 font-sans font-extrabold text-sm sm:text-base text-[#3A2418]/80 leading-relaxed">
              Ne csak görgess, navigálj! A II. Budafoki Sátras Cigányok Fesztivál minden részletét külön aloldalakon, egyedi témákon találsz meg. Válassz egy úti célt alább!
            </p>
          </div>

          {/* Bento-style Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {bentoItems.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div 
                  key={idx}
                  className={`flex flex-col justify-between p-6 sm:p-8 rounded-2xl border-3 border-[#3A2418] retro-shadow-lg transition-all duration-300 hover:-translate-y-1.5 hover:translate-x-0.5 ${
                    item.color === 'bg-cream' ? 'bg-[#FFFDF6]' : item.color
                  } ${item.textColor}`}
                >
                  <div>
                    {/* Header with badge */}
                    <div className="flex items-center justify-between gap-4 mb-6">
                      <span className={`font-sans font-black text-[9px] tracking-widest px-2.5 py-1 rounded-full border border-[#3A2418] ${
                        item.textColor === 'text-cream' ? 'bg-black/15 text-cream' : 'bg-black/5 text-darkbrown/80'
                      }`}>
                        ★ {item.badge}
                      </span>
                      <Icon className="w-6 h-6 stroke-[2.5px] opacity-80" />
                    </div>

                    {/* Content */}
                    <h3 className="font-retro text-xl sm:text-2xl leading-none tracking-tight mb-3">
                      {item.title}
                    </h3>
                    <p className="font-sans font-bold text-xs sm:text-sm opacity-90 leading-relaxed mb-8">
                      {item.desc}
                    </p>
                  </div>

                  {/* Action Link Button */}
                  <Link
                    to={item.link}
                    className={`block text-center font-retro text-xs sm:text-sm py-3 px-4 rounded-xl border-2 border-[#3A2418] transition-all hover:translate-y-0.5 active:translate-y-1 ${
                      item.textColor === 'text-cream' 
                        ? 'bg-[#FFFDF6] text-[#3A2418] hover:bg-cream' 
                        : 'bg-[#3A2418] text-cream hover:bg-[#3A2418]/90'
                    }`}
                  >
                    {item.btnText}
                  </Link>
                </div>
              );
            })}

            {/* Extra Fun Interactive Compass Bento Card */}
            <div className="flex flex-col justify-between p-6 sm:p-8 rounded-2xl border-3 border-[#3A2418] bg-[#D9793D] text-cream retro-shadow-lg md:col-span-2 lg:col-span-1">
              <div>
                <div className="flex items-center justify-between gap-4 mb-6">
                  <span className="font-sans font-black text-[9px] tracking-widest px-2.5 py-1 rounded-full border border-[#3A2418] bg-black/15 text-cream">
                    ★ KALANDRA FEL
                  </span>
                  <Compass className="w-6 h-6 stroke-[2.5px] animate-spin" style={{ animationDuration: '12s' }} />
                </div>
                <h3 className="font-retro text-xl sm:text-2xl leading-none tracking-tight mb-3">
                  CSATLAKOZZ HOZZÁNK!
                </h3>
                <p className="font-sans font-bold text-xs sm:text-sm opacity-90 leading-relaxed mb-6">
                  Készen állsz a nyár legkülönlegesebb és leglazább Duna-parti kemping hétvégéjére? Ne hagyd, hogy csak meséljék!
                </p>
              </div>

              <div className="flex items-center gap-3 bg-black/10 border border-[#3A2418]/20 p-3 rounded-xl">
                <span className="text-xl">⛺</span>
                <span className="font-sans font-extrabold text-[11px] sm:text-xs leading-tight">
                  2026. Július 24-26. <br />
                  Pilismarót, Kavicsos Duna-part
                </span>
              </div>
            </div>

          </div>

        </div>
      </section>
    </div>
  );
}
