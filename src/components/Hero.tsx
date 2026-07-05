import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import StringLights from './StringLights';
import FlagGarland from './FlagGarland';
import { Calendar, Ticket, Music, Waves, Users, Flame, Tent } from 'lucide-react';
import { useContent } from '../hooks/useContent';

export default function Hero() {
  const navigate = useNavigate();
  const [showLightsOnMobile, setShowLightsOnMobile] = useState(false);
  const content = useContent({
    'home.hero.title_1': 'BUDAFOKI',
    'home.hero.title_2': 'SÁTRAS CIGÁNYOK',
    'home.hero.subtitle': 'Duna Party Fesztivál',
  });

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 60) {
        setShowLightsOnMobile(true);
      } else {
        setShowLightsOnMobile(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const woodPlanks = [
    { label: 'ZENE', icon: <Music className="w-3.5 h-3.5 text-orange shrink-0" />, rotation: 'rotate-2 translate-x-1' },
    { label: 'DUNA', icon: <Waves className="w-3.5 h-3.5 text-turquoise shrink-0" />, rotation: '-rotate-3 translate-x-0' },
    { label: 'BARÁTOK', icon: <Users className="w-3.5 h-3.5 text-sand shrink-0" />, rotation: 'rotate-1 translate-x-2' },
    { label: 'KALAND', icon: <Flame className="w-3.5 h-3.5 text-orange shrink-0" />, rotation: '-rotate-2 -translate-x-1' },
    { label: 'SÁTOR', icon: <Tent className="w-3.5 h-3.5 text-turquoise shrink-0" />, rotation: 'rotate-3 translate-x-1' },
  ];

  return (
    <section 
      id="home" 
      className="relative min-h-screen pt-28 pb-0 flex flex-col justify-between overflow-hidden bg-[#3A2418]"
    >
      {/* Background Image of Danube camping beach at twilight */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{ 
          backgroundImage: `url('https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&fm=webp&w=1920&q=72')`,
        }}
      />
      {/* Warm Golden Hour & River Mist Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#2F9EAA]/40 via-[#D9793D]/30 to-[#3A2418]/80 mix-blend-multiply z-0" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#FFF1D0]/20 via-transparent to-black/30 z-0" />

      {/* Fairy Lights Hanging from the very top */}
      <div className={`absolute top-0 left-0 w-full z-20 transition-all duration-700 ease-out ${
        showLightsOnMobile ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 -translate-y-4 scale-95'
      }`}>
        <StringLights />
      </div>

      {/* Flag Garland draping slightly lower */}
      <div className="w-full mt-2 z-10">
        <FlagGarland />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex-1 flex flex-col justify-center items-center relative z-30 mt-6 text-center pb-20 sm:pb-24">
        
        {/* Badge: "II." */}
        <div className="relative mb-2 select-none">
          <div className="bg-orange text-cream font-retro text-sm sm:text-base px-6 py-1.5 rounded-md retro-border-thick retro-shadow-sm transform -rotate-2 inline-block">
            ★ II. ★
          </div>
        </div>

        {/* Main Header Container with the exact mockup typography style */}
        <div className="max-w-4xl space-y-1">
          <h1 className="font-retro text-5xl sm:text-7xl md:text-[95px] text-turquoise tracking-normal uppercase leading-none select-none text-stroke-retro-thick [text-shadow:6px_6px_0px_#3A2418] filter drop-shadow-lg">
            {content('home.hero.title_1')}
          </h1>
          <h1 className="font-retro text-4xl sm:text-6xl md:text-[80px] text-cream tracking-tight uppercase leading-none select-none text-stroke-retro-thick [text-shadow:6px_6px_0px_#3A2418] filter drop-shadow-md">
            {content('home.hero.title_2')}
          </h1>
          <div className="mt-6 inline-block select-none transform rotate-1">
            <p className="font-retro text-sm sm:text-base md:text-lg text-darkbrown bg-cream px-5 py-2.5 rounded-lg retro-border-thick retro-shadow-sm tracking-wide uppercase flex items-center justify-center gap-2">
              <span className="text-orange">★</span> {content('home.hero.subtitle')} <span className="text-orange">★</span>
            </p>
          </div>
        </div>

        {/* Action Buttons styled like the gold-bordered retro boxes on the image */}
        <div className="mt-8 flex flex-col sm:flex-row gap-4 items-center justify-center w-full max-w-lg z-30">
          <button
            onClick={() => navigate('/jegyek')}
            className="w-full sm:w-auto font-retro text-sm sm:text-base text-cream bg-turquoise hover:bg-turquoise/90 px-8 py-3.5 rounded-xl retro-border-thick retro-shadow transition-all hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-retro-sm active:translate-x-1 active:translate-y-1 cursor-pointer flex items-center justify-center gap-2"
          >
            <Ticket className="w-5 h-5 text-cream" /> JEGYEK
          </button>
          
          <button
            onClick={() => navigate('/program')}
            className="w-full sm:w-auto font-retro text-sm sm:text-base text-cream bg-darkbrown/90 hover:bg-darkbrown px-8 py-3.5 rounded-xl border-3 border-sand retro-shadow transition-all hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-retro-sm active:translate-x-1 active:translate-y-1 cursor-pointer flex items-center justify-center gap-2"
          >
            <Calendar className="w-5 h-5 text-sand" /> PROGRAMTERV
          </button>
        </div>
      </div>

      {/* Bottom decorations of Hero: Wood signs on Left, stylized river wave design at the transition */}
      <div className="w-full relative z-10">
        
        {/* Hanging wood planks on the left (Matches the vertical wood signposts on the left of the image) */}
        <div className="hidden lg:flex flex-col gap-1.5 absolute bottom-12 left-10 select-none z-10">
          {woodPlanks.map((plank, idx) => (
            <div 
              key={idx}
              className={`bg-[#4E311B] text-cream border-2 border-darkbrown px-4 py-2 font-retro text-xs tracking-wider shadow-md transform ${plank.rotation} w-32 hover:scale-105 transition-transform flex items-center justify-center gap-2`}
              style={{
                backgroundImage: 'repeating-linear-gradient(90deg, rgba(255,255,255,0.03) 0px, rgba(255,255,255,0.03) 2px, transparent 2px, transparent 15px)'
              }}
            >
              <div className="absolute top-[-6px] left-[20%] w-1 h-2 bg-darkbrown/50"></div>
              <div className="absolute top-[-6px] right-[20%] w-1 h-2 bg-darkbrown/50"></div>
              {plank.icon}
              <span>{plank.label}</span>
            </div>
          ))}
        </div>

        {/* Campfire / Info Sticker on Bottom Right */}
        <div className="absolute bottom-6 right-8 bg-[#FFF1D0] px-4 py-2 rounded-xl border-2 border-darkbrown shadow-md select-none z-10 rotate-1">
          <p className="font-retro text-[9px] text-orange tracking-widest uppercase leading-none">IDŐPONT</p>
          <p className="font-sans font-black text-xs text-darkbrown mt-0.5 leading-none">2026. Július 24-26.</p>
        </div>

        {/* Danube Waves divider (transition intoAbout section) */}
        <div className="absolute bottom-0 left-0 w-full h-8 overflow-hidden select-none translate-y-px pointer-events-none z-10">
          <svg className="w-full h-full fill-cream" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M0,0 C150,90 350,20 500,70 C650,120 850,40 1000,90 C1150,140 1300,10 1400,30 L1400,120 L0,120 Z"></path>
          </svg>
        </div>
      </div>
    </section>
  );
}
