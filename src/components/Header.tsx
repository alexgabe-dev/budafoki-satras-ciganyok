import React, { useState, useEffect } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { Menu, X, Facebook, Instagram, ChevronRight, Sparkles, Tent } from 'lucide-react';

const Tiktok = ({ className = "w-4.5 h-4.5" }: { className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2.5" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
  </svg>
);

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  // Handle scrolling background transition
  const [showLights, setShowLights] = useState(false);
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 15) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }

      if (window.scrollY > 60) {
        setShowLights(true);
      } else {
        setShowLights(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile drawer when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  // Prevent scroll when mobile menu is open (Premium UX detail!)
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const navItems = [
    { name: 'Kezdőlap', path: '/' },
    { name: 'Program', path: '/program' },
    { name: 'Jegyek', path: '/jegyek' },
    { name: 'Helyszín', path: '/helyszin' },
    { name: 'Galéria', path: '/galeria' },
    { name: 'Pakolólista', path: '/pakolo-lista' },
  ];

  return (
    <>
      <header 
        className={`fixed top-0 left-0 w-full z-40 transition-all duration-300 select-none bg-darkbrown wood-horizontal border-b-4 border-darkbrown shadow-lg ${
          scrolled ? 'py-1 sm:py-2 shadow-xl' : 'py-3 sm:py-4'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4 h-16 relative">
          
          {/* 1. Vintage Tilted Emblem (Top Left) - Styled as a physical sign badge */}
          <Link 
            to="/" 
            className="flex items-center group transform hover:scale-[1.05] hover:rotate-1 transition-all duration-200 shrink-0"
          >
            <div className="bg-cream px-3 sm:px-5 py-1.5 sm:py-2.5 rounded-2xl border-3 border-darkbrown flex flex-col items-center justify-center shadow-lg relative overflow-hidden -rotate-2 select-none">
              {/* Double decorative inner border */}
              <div className="absolute inset-0.5 rounded-2xl border border-dashed border-darkbrown/30 pointer-events-none"></div>
              
              <span className="font-retro text-[8px] sm:text-[9px] text-darkbrown tracking-widest leading-none font-extrabold">
                ★ II. BUDAFOKI ★
              </span>
              <span className="font-retro text-[13px] sm:text-[17px] text-orange tracking-tight leading-none mt-1 font-black [text-shadow:0.5px_0.5px_0px_#FFF]">
                SÁTRAS CIGÁNYOK
              </span>
              <span className="font-sans text-[6px] sm:text-[8px] font-black text-turquoise uppercase tracking-wider leading-none mt-0.5">
                ★ DUNA PARTY FESZTIVÁL ★
              </span>
            </div>
          </Link>

          {/* 2. Floating Centered Navigation Bar (Pill Container as wood planks) */}
          <nav className="hidden md:flex items-center gap-1.5 lg:gap-2 bg-darkbrown/40 border-2 border-darkbrown/60 px-3 lg:px-4 py-1.5 rounded-2xl">
            {navItems.map((item, idx) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) => `
                  font-sans font-black text-[9px] lg:text-[11px] px-2.5 lg:px-3.5 py-2 rounded-xl uppercase tracking-wider transition-all duration-150 border-2 border-darkbrown
                  ${isActive 
                    ? `bg-orange text-cream shadow-sm scale-105 ${idx % 2 === 0 ? 'rotate-1' : '-rotate-1'}` 
                    : 'bg-cream text-darkbrown hover:bg-sand hover:text-darkbrown hover:scale-102'
                  }
                `}
              >
                {item.name}
              </NavLink>
            ))}
          </nav>

          {/* 3. Social Media Icons on Right */}
          <div className="hidden md:flex items-center gap-2">
            <a 
              href="https://facebook.com" 
              target="_blank" 
              rel="noreferrer"
              className="w-9 h-9 rounded-full bg-olive hover:bg-orange text-cream flex items-center justify-center transition-all border-2 border-darkbrown hover:scale-105 shadow-sm"
              aria-label="Facebook"
            >
              <Facebook className="w-4.5 h-4.5 fill-current stroke-none" />
            </a>
            <a 
              href="https://instagram.com" 
              target="_blank" 
              rel="noreferrer"
              className="w-9 h-9 rounded-full bg-olive hover:bg-orange text-cream flex items-center justify-center transition-all border-2 border-darkbrown hover:scale-105 shadow-sm"
              aria-label="Instagram"
            >
              <Instagram className="w-4.5 h-4.5" />
            </a>
            <a 
              href="https://tiktok.com" 
              target="_blank" 
              rel="noreferrer"
              className="w-9 h-9 rounded-full bg-olive hover:bg-orange text-cream flex items-center justify-center transition-all border-2 border-darkbrown hover:scale-105 shadow-sm"
              aria-label="TikTok"
            >
              <Tiktok className="w-4.5 h-4.5" />
            </a>
          </div>

          {/* Mobile menu toggle button (Styled like a retro brass compass/stamp button) */}
          <div className="flex md:hidden shrink-0">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-orange text-cream border-2 border-darkbrown hover:bg-sand hover:text-darkbrown transition-all hover:scale-105 shadow-md active:scale-95"
              aria-label="Menü"
            >
              {isOpen ? <X className="w-5 h-5 stroke-[2.5px]" /> : <Menu className="w-5 h-5 stroke-[2.5px]" />}
            </button>
          </div>
        </div>

        {/* 4. COZY FESTIVAL FESTOON LIGHTS (Hanging lightbulbs) */}
        <div className={`absolute top-full left-0 w-full flex justify-between pointer-events-none select-none z-50 overflow-visible px-4 sm:px-10 transition-all duration-700 ease-out ${
          showLights ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 -translate-y-4 scale-95'
        }`}>
          {Array.from({ length: 16 }).map((_, i) => (
            <div key={i} className="flex flex-col items-center shrink-0">
              {/* Little wire hanging from wooden beam */}
              <div className="w-[2px] h-2 bg-[#3A2418]"></div>
              {/* Little socket */}
              <div className="w-1.5 h-1 bg-[#2C1A11] rounded-t-xs"></div>
              {/* Pulsing colored bulb */}
              <div 
                className={`w-3 h-3.5 rounded-full bulb transition-all ${
                  i % 3 === 0 
                    ? 'bg-sand [box-shadow:0_0_10px_2px_#F2C98B]' 
                    : i % 3 === 1 
                      ? 'bg-orange [box-shadow:0_0_10px_2px_#D9793D]' 
                      : 'bg-turquoise [box-shadow:0_0_10px_2px_#2F9EAA]'
                }`}
              ></div>
            </div>
          ))}
        </div>
      </header>

      {/* 5. PREMIUM Full-Screen Mobile Drawer & Dim Overlay */}
      <div 
        className={`md:hidden fixed inset-0 z-50 transition-opacity duration-300 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        {/* Dim Blurred Overlay Background */}
        <div 
          className="absolute inset-0 bg-[#3A2418]/70 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        />

        {/* Sliding Sidebar Container (styled like a rustic bulletin board) */}
        <div 
          className={`absolute right-0 top-0 bottom-0 w-4/5 max-w-[320px] bg-cream paper-texture border-l-4 border-darkbrown p-6 shadow-2xl flex flex-col justify-between transition-transform duration-300 ease-out ${
            isOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          {/* Top Panel Brand & Close */}
          <div>
            <div className="flex items-center justify-between gap-4 border-b-2 border-dashed border-darkbrown/20 pb-4 mb-6">
              <div className="flex items-center gap-1.5">
                <Tent className="w-4 h-4 text-orange" />
                <span className="font-retro text-xs text-darkbrown font-black tracking-wider">ÚTIKERESŐ</span>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-full border-2 border-darkbrown bg-cream hover:bg-orange hover:text-cream flex items-center justify-center transition-colors shadow-sm"
              >
                <X className="w-4 h-4 stroke-[2.5px]" />
              </button>
            </div>

            {/* Menu Links List */}
            <div className="space-y-2.5 flex flex-col">
              {navItems.map((item, idx) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  className={({ isActive }) => `
                    flex items-center justify-between px-4 py-3 rounded-xl border-2 transition-all font-sans font-black text-xs uppercase tracking-wider
                    ${isActive 
                      ? 'bg-orange text-cream border-darkbrown translate-x-1 shadow-sm' 
                      : 'bg-cream/50 text-darkbrown border-darkbrown/10 hover:border-darkbrown hover:translate-x-1'
                    }
                  `}
                >
                  <span className="flex items-center gap-2">
                    <span className="text-orange text-[9px]">★</span>
                    {item.name}
                  </span>
                  <ChevronRight className="w-4 h-4 opacity-70" />
                </NavLink>
              ))}
            </div>
          </div>

          {/* Social Icons & Signature footer */}
          <div className="border-t-2 border-dashed border-darkbrown/20 pt-6 mt-6">
            <p className="font-sans font-extrabold text-[8px] text-darkbrown/50 tracking-wider text-center uppercase mb-3">
              ★ II. Budafoki Sátras Cigányok ★
            </p>
            <div className="flex items-center gap-3">
              <a 
                href="https://facebook.com" 
                target="_blank" 
                rel="noreferrer"
                className="w-10 h-10 bg-olive text-cream rounded-xl border-2 border-darkbrown flex items-center justify-center flex-1 shadow-sm hover:scale-[1.03] transition-transform"
              >
                <Facebook className="w-5 h-5 fill-current stroke-none" />
              </a>
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noreferrer"
                className="w-10 h-10 bg-olive text-cream rounded-xl border-2 border-darkbrown flex items-center justify-center flex-1 shadow-sm hover:scale-[1.03] transition-transform"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a 
                href="https://tiktok.com" 
                target="_blank" 
                rel="noreferrer"
                className="w-10 h-10 bg-olive text-cream rounded-xl border-2 border-darkbrown flex items-center justify-center flex-1 shadow-sm hover:scale-[1.03] transition-transform"
              >
                <Tiktok className="w-5 h-5" />
              </a>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}
