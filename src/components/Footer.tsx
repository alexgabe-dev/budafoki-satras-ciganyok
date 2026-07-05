import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Tent, ArrowUp } from 'lucide-react';

const Tiktok = ({ className = "w-4 h-4" }: { className?: string }) => (
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

export default function Footer() {
  const handleScrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const footerLinks = [
    { name: 'Kezdőlap', path: '/' },
    { name: 'Programterv', path: '/program' },
    { name: 'Jegyértesítő', path: '/jegyek' },
    { name: 'Helyszín', path: '/helyszin' },
    { name: 'Galéria', path: '/galeria' },
    { name: 'Pakolólista', path: '/pakolo-lista' },
  ];

  return (
    <footer className="bg-darkbrown wood-horizontal text-cream py-16 relative overflow-hidden border-t-5 border-darkbrown select-none">
      {/* Wave divider at top of footer */}
      <div className="absolute top-0 left-0 w-full h-4 overflow-hidden select-none pointer-events-none opacity-5">
        <svg className="w-full h-full fill-cream" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path d="M0,0 C150,90 350,20 500,70 C650,120 850,40 1000,90 C1150,140 1300,10 1400,30 L1400,120 L0,120 Z"></path>
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-start">
          
          {/* Col 1: Brand details - 5 cols */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="bg-orange p-2 rounded-lg border border-darkbrown">
                <Tent className="w-6 h-6 text-cream" />
              </div>
              <div className="flex flex-col">
                <span className="font-retro text-lg text-cream tracking-tight leading-none">
                  II. Budafoki
                </span>
                <span className="font-retro text-md text-orange tracking-wider leading-none mt-1">
                  SÁTRAS CIGÁNYOK
                </span>
                <span className="font-sans text-[9px] font-extrabold text-turquoise uppercase tracking-widest mt-0.5">
                  Duna Party Fesztivál
                </span>
              </div>
            </div>

            <p className="font-sans text-xs text-cream/70 leading-relaxed max-w-sm">
              Budapest leglazább, legbarátságosabb nyári sátortábora közvetlenül a Duna-parton. Sátorozás, zene, hideg sörök és jó társaság. A fesztivál fő szervezője a <a href="https://bfzh.hu" target="_blank" rel="noreferrer" className="text-orange hover:underline font-bold">Budafoki Zarándokház</a>, aminek ez az év leghíresebb és legfontosabb eseménye!
            </p>

            {/* Social media links */}
            <div className="flex items-center gap-3 pt-2">
              <a 
                href="https://facebook.com" 
                target="_blank" 
                rel="noreferrer"
                className="p-2 bg-cream/10 hover:bg-orange hover:text-cream text-cream rounded-full border border-cream/20 transition-all duration-200"
                aria-label="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noreferrer"
                className="p-2 bg-cream/10 hover:bg-orange hover:text-cream text-cream rounded-full border border-cream/20 transition-all duration-200"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a 
                href="https://tiktok.com" 
                target="_blank" 
                rel="noreferrer"
                className="p-2 bg-cream/10 hover:bg-orange hover:text-cream text-cream rounded-full border border-cream/20 transition-all duration-200"
                aria-label="TikTok"
              >
                <Tiktok className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Col 2: Navigation - 3 cols */}
          <div className="md:col-span-3">
            <h4 className="font-retro text-xs text-orange tracking-widest uppercase mb-4 font-black">Navigáció</h4>
            <ul className="space-y-2 font-sans font-bold text-xs text-cream/80">
              {footerLinks.map((link) => (
                <li key={link.path}>
                  <Link 
                    to={link.path} 
                    className="hover:text-orange transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Useful Info / Contact - 2 cols */}
          <div className="md:col-span-2">
            <h4 className="font-retro text-xs text-orange tracking-widest uppercase mb-4 font-black">Információ</h4>
            <ul className="space-y-2 font-sans font-bold text-xs text-cream/80">
              <li>
                <Link to="/hazirend" className="hover:text-orange transition-colors">
                  Házirend
                </Link>
              </li>
              <li>
                <Link to="/kapcsolat" className="hover:text-orange transition-colors">
                  Kapcsolat
                </Link>
              </li>
              <li>
                <Link to="/gyik" className="hover:text-orange transition-colors">
                  GYIK
                </Link>
              </li>
              <li>
                <Link to="/adatvedelem" className="hover:text-orange transition-colors">
                  Adatvédelem
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Stamp and Back to top - 2 cols */}
          <div className="md:col-span-2 flex flex-col items-center md:items-end justify-between h-full min-h-[100px]">
            
            {/* Custom Footer stamp "DUNA PARTY" */}
            <div className="transform rotate-12 select-none pointer-events-none scale-100 mb-4 md:mb-0 transition-transform hover:rotate-6">
              <div className="w-24 h-24 rounded-full border-4 border-double border-turquoise/85 flex flex-col items-center justify-center p-1 shadow-[0_0_15px_rgba(47,158,170,0.25)]">
                <div className="w-20 h-20 rounded-full border-2 border-dashed border-turquoise/70 flex flex-col items-center justify-center text-center">
                  <span className="font-retro text-xs text-turquoise tracking-widest leading-none font-black text-stroke-retro-thin">DUNA</span>
                  <span className="font-retro text-xs text-turquoise tracking-widest leading-none mt-0.5 font-black text-stroke-retro-thin">PARTY</span>
                  {/* Danube wave SVG illustration inside stamp */}
                  <svg className="w-8 h-2.5 fill-none stroke-turquoise/80 stroke-2 mt-1" viewBox="0 0 24 8">
                    <path d="M0,4 Q6,1 12,4 T24,4" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Back to top button */}
            <button
              onClick={handleScrollToTop}
              className="p-3 bg-cream/10 hover:bg-orange hover:text-cream text-cream rounded-xl border-2 border-cream/20 transition-all flex items-center justify-center cursor-pointer hover:scale-105 active:scale-95 shadow-sm"
              aria-label="Vissza a lap tetejére"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>

        </div>

        {/* Bottom copyright line */}
        <div className="border-t border-cream/10 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="font-sans text-[10px] sm:text-xs text-cream/50 text-center sm:text-left">
            © 2026 Budafoki Zarándokház (bfzh.hu) – Duna Party Fesztivál (budafokidunaparty.hu). Minden jog fenntartva.
          </p>
          <p className="font-sans text-[9px] text-cream/30 uppercase tracking-widest">
            Made with 🧡 on the Danube Beach
          </p>
        </div>

      </div>
    </footer>
  );
}
