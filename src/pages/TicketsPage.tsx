import React, { useState, useEffect } from 'react';
import { 
  Ticket, 
  Sparkles, 
  Check, 
  CheckCircle2, 
  ShieldCheck, 
  Mail, 
  ArrowRight, 
  Printer, 
  AlertTriangle, 
  User, 
  Heart, 
  Info, 
  Share2, 
  Calendar, 
  MapPin, 
  DollarSign, 
  Award,
  ChevronRight
} from 'lucide-react';
import { useContent } from '../hooks/useContent';

interface Subscriber {
  name: string;
  email: string;
  type: string;
  serial: string;
  date: string;
  revolutUser?: string;
}

export default function TicketsPage() {
  const content = useContent({
    'tickets.header.title': '★ JEGYEK ★',
    'tickets.header.description': 'A fesztivál látogatása mindenki számára ingyenes, de a kempinghelyek korlátozott száma miatt regisztrációhoz kötött. Igényeld meg a saját névre szóló digitális belépődet egy perc alatt!',
  });
  const [email, setEmail] = useState('');
  const [userName, setUserName] = useState('');
  const [selectedTicketType, setSelectedTicketType] = useState('camping');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [generatedTicketNum, setGeneratedTicketNum] = useState('');
  const [activeTicket, setActiveTicket] = useState<Subscriber | null>(null);
  const [showSupporterModal, setShowSupporterModal] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [revolutUser, setRevolutUser] = useState('');
  const [revolutConfirmed, setRevolutConfirmed] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const ticketTypes = [
    {
      id: 'camping',
      title: 'SÁTOROZÓ BÉRLET',
      price: 'INGYENES',
      badge: 'NÉPSZERŰ',
      desc: 'Sátorhely a kavicsos Duna-parton, belépés az összes koncertre, közös tábortűz, bográcsozás és kempinghasználat.',
      features: [
        '3 napos teljes belépő kempingezéssel',
        'Sátorhely közvetlenül a Duna-parton',
        'Közös bográcsozás & sörözés',
        'Belépő minden esti koncertre & programra',
      ],
      icon: Ticket,
      color: 'bg-turquoise',
      accentColor: 'text-turquoise',
      badgeBg: 'bg-turquoise/10 text-turquoise border-turquoise/20',
      tagline: 'A teljes 3 napos tábori élmény',
    },
    {
      id: 'visitor',
      title: 'NAPI LÁTOGATÓ',
      price: 'INGYENES',
      badge: 'NAPKÖZBENI',
      desc: 'Ha nem kempingezel, csak leugranál egy-egy estére koccintani a haverokkal, koncerteket hallgatni és bográcsozni.',
      features: [
        '1 tetszőleges napos belépés',
        'Koncertek & strandröplabda',
        'Tábortűz melletti zenélés',
        'Bogrács hozzáférés (hozzájárulással)',
      ],
      icon: Calendar,
      color: 'bg-sand',
      accentColor: 'text-darkbrown',
      badgeBg: 'bg-sand/30 text-[#5C3A21] border-sand/40',
      tagline: 'Látogass ki egy felejthetetlen délutánra',
    },
    {
      id: 'supporter',
      title: 'TÁMOGATÓI JEGY',
      price: '5.000 Ft',
      badge: 'HŐS SZPONZOR',
      desc: 'Ha szereted ezt a kezdeményezést, és támogatnád a szervezést, a tűzifát, a sörpad bérlést vagy a bográcsba való húst.',
      features: [
        'Minden Sátorozó Bérlet szolgáltatás',
        'Különleges "Hős Szponzor" fém kitűző',
        'Személyes pacsi és örök hálánk',
        '1 hideg sör a szervezői pultnál',
      ],
      icon: Award,
      color: 'bg-orange',
      accentColor: 'text-orange',
      badgeBg: 'bg-orange/10 text-orange border-orange/20',
      tagline: 'Támogasd a közösségi fesztivált!',
    },
  ];

  useEffect(() => {
    let isMounted = true;

    const loadActiveTicket = async () => {
      try {
        const response = await fetch('/api/tickets/active', {
          credentials: 'same-origin',
        });

        if (response.status === 404) {
          return;
        }

        if (!response.ok) {
          throw new Error('Nem sikerült betölteni az aktív jegyet.');
        }

        const data = await response.json();
        const ticketData: Subscriber = data.ticket;

        if (isMounted) {
          setActiveTicket(ticketData);
          setUserName(ticketData.name);
          setEmail(ticketData.email);
          setSelectedTicketType(ticketData.type);
          setGeneratedTicketNum(ticketData.serial);
          setRevolutUser(ticketData.revolutUser || '');
          setRevolutConfirmed(Boolean(ticketData.revolutUser));
          setIsSubmitted(true);
        }
      } catch (err) {
        console.error('Error loading ticket from database:', err);
      }
    };

    loadActiveTicket();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSaving) return;

    if (!userName.trim()) {
      setError('Kérjük, add meg a neved a jegy kiállításához!');
      return;
    }
    if (userName.trim().length < 3) {
      setError('Kérjük, adj meg egy valódi nevet (legalább 3 karakter)!');
      return;
    }
    if (!email) {
      setError('Kérjük, add meg az e-mail címed!');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Kérjük, érvényes e-mail címet adj meg!');
      return;
    }

    if (selectedTicketType === 'supporter') {
      if (!revolutUser.trim()) {
        setError('Támogatói jegyhez kérjük add meg a küldő Revolut @nevét vagy a tranzakció azonosítót!');
        return;
      }
      if (!revolutConfirmed) {
        setError('Kérjük, jelöld be, hogy elutaltad az 5.000 Ft-ot Revoluton!');
        return;
      }
    }

    setError('');
    setIsSaving(true);

    try {
      const response = await fetch('/api/tickets', {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: userName,
          email,
          type: selectedTicketType,
          revolutUser,
          revolutConfirmed,
        }),
      });

      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        setError(data.error || 'Nem sikerült elmenteni a jegyet.');
        return;
      }

      const ticketData: Subscriber = data.ticket;
      setActiveTicket(ticketData);
      setUserName(ticketData.name);
      setEmail(ticketData.email);
      setSelectedTicketType(ticketData.type);
      setGeneratedTicketNum(ticketData.serial);
      setRevolutUser(ticketData.revolutUser || '');
      setIsSubmitted(true);

      if (selectedTicketType === 'supporter') {
        setShowSupporterModal(true);
      }
    } catch (err) {
      console.error('Error saving ticket:', err);
      setError('Nem sikerült kapcsolódni a jegyadatbázishoz. Kérjük próbáld újra.');
    } finally {
      setIsSaving(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleResetConfirm = async () => {
    try {
      await fetch('/api/tickets/active', {
        method: 'DELETE',
        credentials: 'same-origin',
      });
    } catch (e) {
      console.error(e);
    }
    setActiveTicket(null);
    setIsSubmitted(false);
    setEmail('');
    setUserName('');
    setRevolutUser('');
    setRevolutConfirmed(false);
    setSelectedTicketType('camping');
    setGeneratedTicketNum('');
    setShowResetConfirm(false);
  };

  // Get current ticket details
  const currentTypeDetails = ticketTypes.find(t => t.id === selectedTicketType) || ticketTypes[0];

  return (
    <div className="pt-36 lg:pt-40 pb-20 bg-cream paper-texture min-h-screen text-darkbrown relative overflow-hidden animate-fade-in">
      
      {/* Decorative Wood panel overlay background */}
      <div className="absolute inset-0 wood-texture opacity-10 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h1 className="font-retro text-3xl sm:text-5xl text-darkbrown tracking-tight uppercase text-stroke-retro">
            {content('tickets.header.title')}
          </h1>
          <div className="w-24 h-1.5 bg-orange mx-auto mt-4 rounded-full retro-border"></div>
          <p className="mt-6 font-sans font-extrabold text-sm sm:text-base text-darkbrown/85 leading-relaxed">
            {content('tickets.header.description')}
          </p>
          <div className="mt-4 p-4 bg-cream border-2 border-darkbrown/25 rounded-2xl max-w-2xl mx-auto flex items-center gap-3 justify-center">
            <span className="text-orange">★</span>
            <p className="font-sans text-xs font-bold text-darkbrown/80 leading-snug">
              Fő szervezőnk a <a href="https://bfzh.hu" target="_blank" rel="noreferrer" className="text-orange underline font-black">Budafoki Zarándokház</a>, akiknek ez a legnépszerűbb és leghíresebb fesztiváljuk az évben!
            </p>
            <span className="text-orange">★</span>
          </div>
        </div>

        {/* MAIN INTERACTIVE AREA */}
        {!isSubmitted ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            
            {/* LEFT COLUMN: Input Form & Selector (6 Cols) */}
            <div className="lg:col-span-6 space-y-8">
              
              {/* STEP 1: Choose Ticket Type */}
              <div className="bg-[#FFFDF6] rounded-2xl border-3 border-darkbrown p-6 sm:p-8 retro-shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                  <span className="w-8 h-8 rounded-full bg-orange text-cream flex items-center justify-center font-retro text-sm border-2 border-darkbrown shadow-sm shrink-0">
                    1
                  </span>
                  <div>
                    <h2 className="font-retro text-base sm:text-lg text-darkbrown uppercase tracking-wider leading-none">
                      Válaszd ki a belépődet
                    </h2>
                    <p className="font-sans font-bold text-[10px] text-darkbrown/50 mt-1 uppercase tracking-wider">
                      Válassz a kempingezős, a látogatói vagy a támogatói jegyek közül
                    </p>
                  </div>
                </div>

                {/* Compact, Highly Elegant Ticket Row Selector (PREVENTS SPREADING/WARPING BUGS) */}
                <div className="space-y-4">
                  {ticketTypes.map((type) => {
                    const TypeIcon = type.icon;
                    const isSelected = selectedTicketType === type.id;
                    return (
                      <div
                        key={type.id}
                        onClick={() => setSelectedTicketType(type.id)}
                        className={`group border-3 rounded-2xl p-4 sm:p-5 transition-all duration-200 cursor-pointer relative flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 ${
                          isSelected
                            ? 'border-orange bg-[#FFFDF6] ring-4 ring-orange/10 shadow-md translate-x-1'
                            : 'border-darkbrown/60 bg-[#FFFDF6]/45 hover:bg-[#FFFDF6] hover:border-darkbrown shadow-sm'
                        }`}
                      >
                        {/* Selector Indicator */}
                        <div className="shrink-0 flex items-center justify-center">
                          <div className={`w-6 h-6 rounded-full border-2 border-darkbrown flex items-center justify-center transition-all ${
                            isSelected ? 'bg-orange text-cream' : 'bg-cream'
                          }`}>
                            {isSelected && <Check className="w-3.5 h-3.5 stroke-[3.5px]" />}
                          </div>
                        </div>

                        {/* Middle Text: Title, Badge, Description */}
                        <div className="flex-1 space-y-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="font-retro text-base sm:text-lg text-darkbrown uppercase tracking-tight">
                              {type.title}
                            </h3>
                            <span className={`font-sans font-extrabold text-[8px] sm:text-[9px] uppercase tracking-widest px-2 py-0.5 rounded border ${type.badgeBg}`}>
                              {type.badge}
                            </span>
                          </div>
                          <p className="font-sans font-medium text-xs text-darkbrown/50 italic">
                            {type.tagline}
                          </p>
                          <p className="font-sans font-bold text-[11px] sm:text-xs text-darkbrown/70 leading-relaxed pt-1 pr-2">
                            {type.desc}
                          </p>
                        </div>

                        {/* Right Column: Price Tag with perforated style separator */}
                        <div className="sm:border-l-2 sm:border-dashed sm:border-darkbrown/20 sm:pl-6 shrink-0 flex sm:flex-col justify-between items-center sm:items-end gap-2 pt-3 sm:pt-0 border-t border-dashed border-darkbrown/15 sm:border-t-0">
                          <span className="font-sans font-bold text-[9px] text-darkbrown/40 uppercase tracking-widest sm:block hidden">ÁR</span>
                          <span className="font-retro text-lg sm:text-xl text-darkbrown tracking-tight">
                            {type.price}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Benefits List of the Selected Type */}
                <div className="mt-6 pt-5 border-t border-dashed border-darkbrown/20 bg-sand/10 rounded-xl p-4">
                  <p className="font-retro text-[10px] text-darkbrown/60 uppercase tracking-widest mb-3 flex items-center gap-1.5">
                    <Info className="w-3.5 h-3.5 text-turquoise" /> Amit a jegyed tartalmaz:
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {currentTypeDetails.features.map((feature, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-left">
                        <Check className="w-4 h-4 text-olive shrink-0 mt-0.5 stroke-[3px]" />
                        <span className="font-sans font-bold text-xs text-darkbrown/85 leading-tight">
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

            </div>

            {/* RIGHT COLUMN: Live Ticket Preview Workspace & Details Form (6 Cols) */}
            <div className="lg:col-span-6 space-y-8">
              
              {/* Dynamic Preview Card */}
              <div className="bg-[#FFFDF6] rounded-2xl border-3 border-darkbrown p-5 sm:p-6 retro-shadow-sm text-center">
                <span className="font-retro text-xs text-orange tracking-widest block uppercase mb-1">Dinamikus előnézet</span>
                <h3 className="font-retro text-lg text-darkbrown uppercase leading-none">★ ÉLŐ JEGY PREVIEW ★</h3>
                <p className="font-sans font-bold text-[10px] text-darkbrown/40 mt-1 uppercase">A jegyed valós időben frissül, ahogy gépelsz!</p>
                
                {/* Live visualizer widget */}
                <div className="mt-6 flex justify-center">
                  <div className="w-full max-w-sm transform hover:scale-[1.02] transition-transform duration-300">
                    
                    {/* The physical ticket card body */}
                    <div className="relative bg-[#FCF9F2] border-4 border-darkbrown rounded-xl overflow-hidden shadow-lg select-none text-left">
                      
                      {/* Left and Right punches */}
                      <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-cream border-2 border-darkbrown z-20"></div>
                      <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-cream border-2 border-darkbrown z-20"></div>

                      {/* Header ribbon */}
                      <div className="bg-darkbrown text-[#FFFDF6] px-4 py-2 flex justify-between items-center text-[8px] font-retro tracking-wider">
                        <span>★ II. BSC BELÉPŐKÁRTYA ★</span>
                        <span className={`px-2 py-0.5 rounded font-sans font-black tracking-widest ${
                          selectedTicketType === 'supporter' ? 'bg-orange text-cream animate-pulse' : 'bg-turquoise text-cream'
                        }`}>
                          {selectedTicketType === 'supporter' ? 'SZPONZOR' : 'ÁLTALÁNOS'}
                        </span>
                      </div>

                      {/* Ticket content */}
                      <div className="p-4 sm:p-5 space-y-4">
                        
                        {/* Title and Logo */}
                        <div className="text-center border-b border-dashed border-darkbrown/15 pb-3">
                          <p className="font-sans font-bold text-[8px] text-darkbrown/40 tracking-widest uppercase">BUDAFOKI SÁTRAS CIGÁNYOK</p>
                          <h4 className={`font-retro text-xl leading-none mt-1 ${currentTypeDetails.accentColor}`}>
                            Duna Party 2026
                          </h4>
                          <p className="font-sans font-bold text-[8px] text-olive tracking-widest uppercase mt-0.5">★ KEMP_KAVICS_STRAND ★</p>
                        </div>

                        {/* Interactive fields list */}
                        <div className="grid grid-cols-2 gap-y-3 gap-x-4 border-b border-dashed border-darkbrown/15 pb-3.5 text-xs">
                          <div>
                            <p className="font-retro text-[8px] text-darkbrown/40 uppercase">TULAJDONOS:</p>
                            <p className="font-sans font-black text-darkbrown truncate mt-0.5 uppercase tracking-wide">
                              {userName.trim() ? userName.toUpperCase() : 'ÍRD BE A NEVED...'}
                            </p>
                          </div>
                          <div>
                            <p className="font-retro text-[8px] text-darkbrown/40 uppercase">TÍPUS:</p>
                            <p className={`font-sans font-black truncate mt-0.5 uppercase tracking-wide ${currentTypeDetails.accentColor}`}>
                              {currentTypeDetails.title}
                            </p>
                          </div>
                          <div>
                            <p className="font-retro text-[8px] text-darkbrown/40 uppercase">IDŐPONT:</p>
                            <p className="font-sans font-black text-darkbrown mt-0.5">2026. JÚL 24-26.</p>
                          </div>
                          <div>
                            <p className="font-retro text-[8px] text-darkbrown/40 uppercase">BEUGRÓ:</p>
                            <p className="font-sans font-black text-darkbrown mt-0.5">{currentTypeDetails.price}</p>
                          </div>
                          {selectedTicketType === 'supporter' && (
                            <div className="col-span-2 border-t border-dashed border-darkbrown/10 pt-2 text-left">
                              <p className="font-retro text-[8px] text-blue-600 uppercase leading-none">REVOLUT VALIDÁLÁS:</p>
                              <p className="font-mono text-[10px] font-black text-darkbrown truncate mt-1 uppercase">
                                {revolutUser.trim() ? revolutUser : 'Nincs kitöltve!'}
                              </p>
                            </div>
                          )}
                        </div>

                        {/* Barcode representation */}
                        <div className="flex flex-col items-center justify-center gap-1">
                          <div className="flex items-end gap-[1.5px] h-6 px-4 select-none opacity-80">
                            {Array.from({ length: 24 }).map((_, i) => {
                              const heights = ['h-4', 'h-5', 'h-6', 'h-3'];
                              const randomHeight = heights[(i + (userName.length || 0)) % heights.length];
                              const widths = i % 4 === 0 ? 'w-[1px]' : i % 6 === 0 ? 'w-[3px]' : 'w-[2px]';
                              return (
                                <div key={i} className={`bg-darkbrown ${randomHeight} ${widths}`} />
                              );
                            })}
                          </div>
                          <span className="font-mono text-[8px] text-darkbrown/40 tracking-widest uppercase">
                            *BSC2026-{selectedTicketType.substring(0,3).toUpperCase()}*
                          </span>
                        </div>

                      </div>

                      {/* Supporter Badge Golden Foil floating effect */}
                      {selectedTicketType === 'supporter' && (
                        <div className="absolute top-10 right-4 transform rotate-12 z-30 pointer-events-none select-none">
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-300 via-yellow-500 to-amber-600 border-2 border-darkbrown shadow-md flex items-center justify-center animate-pulse">
                            <span className="font-retro text-[7px] text-[#3A2418] font-bold text-center leading-none">
                              GOLD<br/>HERO
                            </span>
                          </div>
                        </div>
                      )}

                    </div>

                  </div>
                </div>

              </div>

              {/* STEP 2: Fill in Details */}
              <div className="bg-[#FFFDF6] rounded-2xl border-3 border-darkbrown p-6 sm:p-8 retro-shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 left-0 h-1 bg-gradient-to-r from-orange via-turquoise to-olive"></div>
                
                <div className="flex items-center gap-3 mb-6">
                  <span className="w-8 h-8 rounded-full bg-orange text-cream flex items-center justify-center font-retro text-sm border-2 border-darkbrown shadow-sm shrink-0">
                    2
                  </span>
                  <div>
                    <h2 className="font-retro text-base sm:text-lg text-darkbrown uppercase tracking-wider leading-none">
                      Add meg a részleteidet
                    </h2>
                    <p className="font-sans font-bold text-[10px] text-darkbrown/50 mt-1 uppercase tracking-wider">
                      Ezek az adatok kerülnek rá a kinyomtatható belépődre
                    </p>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Name field */}
                    <div className="space-y-1.5">
                      <label className="block font-retro text-xs text-darkbrown/80 uppercase tracking-wider flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-orange" /> Teljes neved:
                      </label>
                      <input
                        type="text"
                        value={userName}
                        onChange={(e) => {
                          setUserName(e.target.value);
                          if (error) setError('');
                        }}
                        placeholder="Pl. Kis Gergely"
                        maxLength={30}
                        className="block w-full px-4 py-3 bg-[#FFFDF6] text-darkbrown placeholder:text-darkbrown/30 rounded-xl font-sans font-extrabold text-sm border-2 border-darkbrown focus:ring-2 focus:ring-orange focus:outline-none transition-all shadow-sm"
                      />
                    </div>

                    {/* Email field */}
                    <div className="space-y-1.5">
                      <label className="block font-retro text-xs text-darkbrown/80 uppercase tracking-wider flex items-center gap-1.5">
                        <Mail className="w-3.5 h-3.5 text-turquoise" /> E-mail címed:
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          if (error) setError('');
                        }}
                        placeholder="gergely@email.com"
                        className="block w-full px-4 py-3 bg-[#FFFDF6] text-darkbrown placeholder:text-darkbrown/30 rounded-xl font-sans font-extrabold text-sm border-2 border-darkbrown focus:ring-2 focus:ring-orange focus:outline-none transition-all shadow-sm"
                      />
                    </div>
                  </div>

                  {/* REVOLUT PAYMENT VALIDATION SECTION */}
                  {selectedTicketType === 'supporter' && (
                    <div className="p-5 bg-blue-50/50 border-2 border-blue-500/30 rounded-2xl space-y-4 animate-fade-in relative overflow-hidden">
                      <div className="absolute top-0 right-0 bg-blue-600 text-white text-[8px] font-sans font-black tracking-widest px-3 py-1 rounded-bl-xl uppercase">
                        Revolut Validáció
                      </div>
                      
                      <div className="flex items-start gap-2.5">
                        <div className="w-7 h-7 bg-blue-600 text-cream rounded-lg flex items-center justify-center font-retro text-xs font-black shrink-0 mt-0.5 border border-darkbrown shadow-sm">
                          R
                        </div>
                        <div>
                          <h4 className="font-retro text-xs text-darkbrown uppercase tracking-wider leading-none">
                            Revolut Támogatás Ellenőrzése
                          </h4>
                          <p className="font-sans font-bold text-[10px] text-darkbrown/70 leading-normal mt-1.5">
                            A Támogatói bérlet ára <strong className="text-blue-600 font-extrabold">5 000 Ft</strong>, amit közvetlenül a <a href="https://revolut.me/budafoki" target="_blank" rel="noreferrer" className="text-blue-600 underline font-black">revolut.me/budafoki</a> linken vagy a Budafoki Zarándokház számlájára utalva tudsz rendezni.
                          </p>
                        </div>
                      </div>

                      <div className="space-y-3 border-t border-dashed border-blue-600/20 pt-3">
                        {/* Sender Revolut username or payment reference */}
                        <div className="space-y-1.5">
                          <label className="block font-retro text-[10px] text-darkbrown/80 uppercase tracking-wider">
                            Küldő Revolut @neve vagy Tranzakció ID: <span className="text-red-500 font-black">*</span>
                          </label>
                          <input
                            type="text"
                            value={revolutUser}
                            onChange={(e) => {
                              setRevolutUser(e.target.value);
                              if (error) setError('');
                            }}
                            placeholder="Pl. @gergely_kis vagy Ref: 98765432"
                            className="block w-full px-4 py-2.5 bg-[#FFFDF6] text-darkbrown placeholder:text-darkbrown/30 rounded-xl font-sans font-extrabold text-xs border-2 border-blue-500/30 focus:ring-2 focus:ring-blue-600 focus:outline-none transition-all"
                          />
                        </div>

                        {/* Confirmation Checkbox */}
                        <label className="flex items-start gap-2.5 cursor-pointer select-none">
                          <input
                            type="checkbox"
                            checked={revolutConfirmed}
                            onChange={(e) => {
                              setRevolutConfirmed(e.target.checked);
                              if (error) setError('');
                            }}
                            className="w-4.5 h-4.5 rounded border-blue-500/30 text-blue-600 focus:ring-blue-600 bg-white mt-0.5 cursor-pointer shrink-0"
                          />
                          <span className="font-sans font-extrabold text-[10.5px] text-darkbrown/80 leading-snug">
                            Igazolom, hogy az 5 000 Ft támogatói hozzájárulást elutaltam. <span className="text-red-500 font-black">*</span>
                          </span>
                        </label>
                      </div>
                    </div>
                  )}

                  {/* Dynamic terms warning */}
                  <div className="bg-cream p-4 rounded-xl border border-darkbrown/20 text-xs font-sans font-bold text-darkbrown/70 leading-relaxed flex items-start gap-2.5">
                    <ShieldCheck className="w-5 h-5 text-olive shrink-0 mt-0.5" />
                    <span>
                      Gombnyomásra azonnal elkészül a névre szóló digitális jegyed, és biztonságosan bekerül a fesztivál jegyadatbázisába.
                    </span>
                  </div>

                  {/* Error display */}
                  {error && (
                    <div className="p-3 bg-red-50 border border-red-200 text-red-600 font-sans font-black text-xs rounded-xl flex items-center gap-2 animate-pulse">
                      <AlertTriangle className="w-4 h-4 shrink-0" />
                      <span>{error}</span>
                    </div>
                  )}

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="w-full font-retro text-sm text-cream bg-orange hover:bg-orange/95 disabled:bg-darkbrown/45 disabled:cursor-wait py-4 rounded-xl border-3 border-darkbrown shadow-md hover:shadow-sm active:translate-y-1 transition-all flex items-center justify-center gap-2 cursor-pointer uppercase"
                  >
                    {isSaving ? 'Mentés az adatbázisba...' : 'Névre szóló jegy generálása'} <ArrowRight className="w-4.5 h-4.5 stroke-[2.5px]" />
                  </button>
                </form>
              </div>

            </div>

          </div>
        ) : (
          /* SUCCESS VIEW - THE PRINTABLE/SAVABLE DIGITALLY PERSISTED TICKET */
          <div className="max-w-2xl mx-auto space-y-10 animate-fade-in print:p-0">
            
            {/* SUCCESS BANNER */}
            <div className="text-center p-6 sm:p-8 bg-olive/10 border-3 border-dashed border-olive rounded-2xl print:hidden">
              <div className="w-14 h-14 bg-olive text-cream rounded-full border-2 border-darkbrown shadow-md flex items-center justify-center mx-auto mb-4 animate-bounce">
                <CheckCircle2 className="w-8 h-8 stroke-[2.5px]" />
              </div>
              <h2 className="font-retro text-xl sm:text-2xl text-olive uppercase tracking-wider leading-none">
                Sikeres Fesztivál Regisztráció!
              </h2>
              <p className="mt-3 font-sans font-bold text-xs sm:text-sm text-darkbrown/85 leading-relaxed max-w-xl mx-auto">
                Kedves <span className="text-olive">{activeTicket?.name}</span>, a névre szóló jegyedet sikeresen legeneráltuk és elmentettük a fesztivál jegyadatbázisába. E-mailben is azonnal értesítünk az indulás előtti tudnivalókról.
              </p>
            </div>

            {/* HIGH-FIDELITY RETRO PHYSICAL TICKET CARD */}
            <div className="relative bg-[#FFFDF6] border-4 border-darkbrown rounded-2xl shadow-xl overflow-hidden select-none max-w-lg mx-auto transform rotate-0.5 print:border-3 print:shadow-none print:rotate-0">
              
              {/* Outer punched ticket notches (the classic vintage look!) */}
              <div className="absolute -left-3.5 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-cream border-2 border-darkbrown z-20 print:hidden"></div>
              <div className="absolute -right-3.5 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-cream border-2 border-darkbrown z-20 print:hidden"></div>

              {/* Ticket Top Header Ribbon */}
              <div className="bg-darkbrown text-[#FFFDF6] py-2.5 px-6 flex justify-between items-center border-b-2 border-darkbrown gap-4">
                <span className="font-retro text-[9px] tracking-widest text-[#FFF1D0] uppercase">
                  ★ BOARDING PASS / BELÉPŐKÁRTYA ★
                </span>
                <span className="font-sans font-black text-[10px] bg-orange px-2 py-0.5 rounded text-cream tracking-wider uppercase">
                  {selectedTicketType === 'supporter' ? 'SZPONZOR' : 'ÁLTALÁNOS'}
                </span>
              </div>

              {/* Ticket Body Content */}
              <div className="p-6 sm:p-8 flex flex-col justify-between gap-6 relative bg-[#FCF9F2]">
                
                {/* Background watermark badge */}
                <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none select-none">
                  <span className="font-retro text-[140px] text-darkbrown rotate-12">⛺</span>
                </div>

                {/* Main branding row */}
                <div className="flex flex-col items-center text-center border-b-2 border-dashed border-darkbrown/15 pb-5">
                  <p className="font-retro text-[8px] sm:text-[10px] text-darkbrown/50 tracking-widest uppercase">II. BUDAFOKI SÁTRAS CIGÁNYOK</p>
                  <h3 className="font-retro text-2xl sm:text-3xl text-orange tracking-tight uppercase leading-none mt-1">
                    Duna Party Fesztivál
                  </h3>
                  <p className="font-sans font-bold text-[9px] text-turquoise uppercase tracking-widest mt-1">
                    ★ KAVICSOS DUNA-PART, BUDAFOK ★
                  </p>
                </div>

                {/* Data fields Grid */}
                <div className="grid grid-cols-2 gap-y-4 gap-x-6 border-b-2 border-darkbrown/10 pb-5">
                  
                  <div>
                    <p className="font-retro text-[8px] text-darkbrown/50 uppercase tracking-wider leading-none">JEGY TULAJDONOS:</p>
                    <p className="font-sans font-black text-xs sm:text-sm text-darkbrown uppercase truncate mt-1">
                      {activeTicket?.name}
                    </p>
                  </div>

                  <div>
                    <p className="font-retro text-[8px] text-darkbrown/50 uppercase tracking-wider leading-none">JEGY TÍPUS:</p>
                    <p className="font-sans font-black text-xs sm:text-sm text-turquoise uppercase mt-1">
                      {currentTypeDetails.title}
                    </p>
                  </div>

                  <div>
                    <p className="font-retro text-[8px] text-darkbrown/50 uppercase tracking-wider leading-none">IDŐPONT / DÁTUM:</p>
                    <p className="font-sans font-black text-xs sm:text-sm text-darkbrown uppercase mt-1">
                      2026. JÚLIUS 24-26.
                    </p>
                  </div>

                  <div>
                    <p className="font-retro text-[8px] text-darkbrown/50 uppercase tracking-wider leading-none">SORSZÁM / SERIAL:</p>
                    <p className="font-mono text-xs font-black text-darkbrown uppercase mt-1">
                      {activeTicket?.serial}
                    </p>
                  </div>

                </div>

                {/* Punched ticket layout footer (Barcode simulation + info) */}
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-1">
                  <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
                    <span className="font-sans font-bold text-[9px] text-darkbrown/60 uppercase">SZÁLLÁS / SZÁLLÁSHELY</span>
                    <span className="font-sans font-black text-xs text-darkbrown uppercase mt-0.5">Saját sátorhely a parton</span>
                    {activeTicket?.revolutUser && (
                      <div className="mt-2 text-center sm:text-left">
                        <span className="font-sans font-extrabold text-[8px] text-blue-600 tracking-wider uppercase block leading-none">REVOLUT IGAZOLÁS:</span>
                        <span className="font-mono font-black text-[10px] text-darkbrown uppercase mt-0.5 block">{activeTicket.revolutUser}</span>
                      </div>
                    )}
                  </div>

                  {/* Simulated Barcode */}
                  <div className="flex flex-col items-center gap-1">
                    <div className="flex items-end gap-[1.5px] h-7 px-3 select-none">
                      {Array.from({ length: 32 }).map((_, i) => {
                        const heights = ['h-5', 'h-6', 'h-7', 'h-4'];
                        const randomHeight = heights[(i + (activeTicket?.name.length || 0)) % heights.length];
                        const widths = i % 3 === 0 ? 'w-[1px]' : i % 5 === 0 ? 'w-[3px]' : 'w-[2px]';
                        return (
                          <div 
                            key={i} 
                            className={`bg-darkbrown rounded-full ${randomHeight} ${widths}`}
                          />
                        );
                      })}
                    </div>
                    <span className="font-mono text-[9px] text-darkbrown/40 tracking-widest">
                      *{activeTicket?.serial.replace(/-/g, '')}*
                    </span>
                  </div>
                </div>

              </div>

              {/* Supporter Badge Golden Foil on the real ticket */}
              {selectedTicketType === 'supporter' && (
                <div className="absolute top-14 right-8 transform rotate-12 z-30 pointer-events-none select-none">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-300 via-yellow-500 to-amber-600 border-3 border-darkbrown shadow-lg flex flex-col items-center justify-center animate-pulse">
                    <span className="font-retro text-[9px] text-[#3A2418] font-black leading-none text-center">
                      GOLDEN
                    </span>
                    <span className="font-sans text-[7px] text-[#3A2418]/90 font-bold uppercase mt-0.5 leading-none tracking-widest">
                      SZPONZOR
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* SUPPORTER INSTRUCTIONS BANNER (ONLY SHOWS FOR SUPPORTER TICKETS) */}
            {selectedTicketType === 'supporter' && (
              <div className="bg-[#FFFDF6] border-3 border-orange rounded-2xl p-6 sm:p-8 shadow-md relative overflow-hidden max-w-lg mx-auto print:hidden">
                <div className="absolute top-0 right-0 left-0 h-1 bg-gradient-to-r from-cyan-400 via-pink-500 to-orange"></div>
                <div className="flex items-start gap-4">
                  <div className="bg-orange/10 p-3 rounded-xl border border-orange/30 text-orange shrink-0">
                    <Heart className="w-6 h-6 stroke-[2.5px] fill-orange" />
                  </div>
                  <div className="space-y-3 w-full">
                    <h4 className="font-retro text-base text-darkbrown uppercase leading-none">
                      KÖSZÖNJÜK A TÁMOGATÁSODAT! ❤️
                    </h4>
                    <p className="font-sans font-bold text-xs text-darkbrown/85 leading-relaxed">
                      Közösségi, nonprofit kezdeményezés vagyunk, minden támogatás a tábori infrastruktúra fejlesztését fedezi.
                    </p>
                    
                    {/* REVOLUT PAYMENT CARD */}
                    <div className="bg-white p-4 rounded-xl border-2 border-darkbrown/15 shadow-inner mt-2 space-y-3">
                      <div className="flex items-center justify-between border-b border-darkbrown/10 pb-2.5">
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded-lg bg-darkbrown text-cream flex items-center justify-center font-retro text-xs font-black tracking-tighter">
                            R
                          </span>
                          <span className="font-sans font-black text-xs text-darkbrown tracking-wider uppercase">
                            Revolut Fizetés / Utalás
                          </span>
                        </div>
                        <span className="text-[9px] bg-cyan-100 text-cyan-800 px-2 py-0.5 rounded-full font-sans font-extrabold uppercase tracking-wide">
                          Azonnali
                        </span>
                      </div>

                      <div className="text-xs font-sans font-bold text-darkbrown/80 space-y-2">
                        <div className="flex justify-between items-center py-0.5">
                          <span className="text-darkbrown/50 uppercase text-[9px] tracking-wide">Kedvezményezett:</span>
                          <span className="font-sans font-black text-darkbrown">Budafoki Zarándokház</span>
                        </div>
                        <div className="flex justify-between items-center py-0.5 border-t border-dashed border-darkbrown/10 pt-2">
                          <span className="text-darkbrown/50 uppercase text-[9px] tracking-wide">Revolut link / @név:</span>
                          <span className="font-mono font-black text-turquoise text-[11px]">revolut.me/budafoki</span>
                        </div>
                        <div className="flex justify-between items-center py-0.5 border-t border-dashed border-darkbrown/10 pt-2">
                          <span className="text-darkbrown/50 uppercase text-[9px] tracking-wide">Számlaszám (IBAN):</span>
                          <span className="font-mono font-black text-darkbrown text-[11px]">HU94 1177 3123 2342 5123 0000 0000</span>
                        </div>
                        <div className="flex justify-between items-center py-0.5 border-t border-dashed border-darkbrown/10 pt-2">
                          <span className="text-darkbrown/50 uppercase text-[9px] tracking-wide">Összeg:</span>
                          <span className="text-orange font-black text-sm">5.000 Ft</span>
                        </div>
                        <div className="flex justify-between items-center py-0.5 border-t border-dashed border-darkbrown/10 pt-2">
                          <span className="text-darkbrown/50 uppercase text-[9px] tracking-wide">Közlemény:</span>
                          <span className="font-mono font-black text-darkbrown bg-cream px-2 py-1 rounded border border-darkbrown/10">
                            {activeTicket?.serial}
                          </span>
                        </div>
                      </div>
                    </div>

                    <p className="font-sans font-medium text-[11px] text-darkbrown/55 leading-relaxed pt-1">
                      A támogatást az azonnali Revolut utalás mellett a helyszínen, a belépőpultnál is tudod rendezni készpénzben vagy QR-kódos azonnali fizetéssel. Köszönjük, hogy segíted a BSC-t!
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* ACTION BUTTONS */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center print:hidden">
              <button
                onClick={handlePrint}
                className="w-full sm:w-auto font-retro text-xs text-cream bg-turquoise hover:bg-turquoise/95 px-6 py-4 rounded-xl border-3 border-darkbrown retro-shadow-sm transition-all hover:translate-y-0.5 active:translate-y-1 flex items-center justify-center gap-2 cursor-pointer"
              >
                <Printer className="w-4.5 h-4.5 stroke-[2.5px]" /> JEGY LETÖLTÉSE / NYOMTATÁS (PDF)
              </button>
              
              <button
                onClick={() => setShowResetConfirm(true)}
                className="w-full sm:w-auto font-sans font-extrabold text-xs text-darkbrown/60 hover:text-red-600 px-6 py-4 flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              >
                Új jegy igénylése
              </button>
            </div>

          </div>
        )}

        {/* CAMPING GUIDELINES & INFORMATION FOR ALL */}
        <div className="mt-16 bg-[#FFFDF6] border-3 border-darkbrown rounded-2xl shadow-lg p-6 sm:p-10 max-w-4xl mx-auto print:hidden">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-turquoise p-2.5 rounded-xl border-2 border-darkbrown text-cream">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <p className="font-retro text-[9px] text-turquoise tracking-widest uppercase font-bold">Biztonság és házirend</p>
              <h2 className="font-retro text-xl sm:text-2xl text-darkbrown uppercase tracking-wider leading-none">
                HÁZIREND ÉS TUDNIVALÓK
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-5 bg-cream/35 rounded-xl border-2 border-darkbrown/10">
              <span className="text-2xl block mb-2">🪵</span>
              <h3 className="font-retro text-sm text-darkbrown mb-2">Tűzrakás és bogrács</h3>
              <p className="font-sans font-bold text-xs text-darkbrown/70 leading-relaxed">
                Tüzet gyújtani kizárólag a kijelölt táborhelyi tűzrakókon szabad, a szervezők koordinálásával. Mindig gondoskodj a tűz eloltásáról lefekvés előtt!
              </p>
            </div>

            <div className="p-5 bg-cream/35 rounded-xl border-2 border-darkbrown/10">
              <span className="text-2xl block mb-2">🌊</span>
              <h3 className="font-retro text-sm text-darkbrown mb-2">Duna és fürdőzés</h3>
              <p className="font-sans font-bold text-xs text-darkbrown/70 leading-relaxed">
                A Duna ezen szakasza csodálatos, de a sodrás erős lehet. Fürdeni csak saját felelősségre, napközben, józan állapotban szabad! Figyeljünk egymásra!
              </p>
            </div>

            <div className="p-5 bg-cream/35 rounded-xl border-2 border-darkbrown/10">
              <span className="text-2xl block mb-2">🚮</span>
              <h3 className="font-retro text-sm text-darkbrown mb-2">Szemétszállítás</h3>
              <p className="font-sans font-bold text-xs text-darkbrown/70 leading-relaxed">
                Tiszta környezet, boldog kempingezés! Mindenki felelős a saját szemetéért. Használd a kihelyezett szelektív gyűjtőket, óvjuk a Duna-partot!
              </p>
            </div>
          </div>
        </div>

      </div>

      {/* CUSTOM RESET CONFIRMATION DIALOG MODAL */}
      {showResetConfirm && (
        <div className="fixed inset-0 bg-black/65 backdrop-blur-sm flex items-center justify-center z-[9999] p-4 animate-fade-in print:hidden">
          <div className="bg-cream max-w-md w-full rounded-2xl border-4 border-darkbrown shadow-retro-lg p-6 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-2 bg-red-500"></div>
            
            <div className="flex items-start gap-4 mt-2">
              <div className="bg-red-100 p-3 rounded-xl border border-red-200 text-red-600 shrink-0">
                <AlertTriangle className="w-6 h-6 stroke-[2.5px]" />
              </div>
              <div className="space-y-3 w-full">
                <h3 className="font-retro text-lg sm:text-xl text-darkbrown uppercase tracking-tight leading-none">
                  Biztosan újat igényelsz?
                </h3>
                <p className="font-sans font-bold text-xs sm:text-sm text-darkbrown/85 leading-relaxed">
                  A jelenlegi generált jegyed véglegesen törlődik a böngésződből. Ha nem mentetted vagy töltötted le, nem tudod majd visszaszerezni!
                </p>
                
                <div className="flex flex-col sm:flex-row gap-3 pt-3">
                  <button
                    onClick={handleResetConfirm}
                    className="flex-1 font-retro text-xs text-cream bg-red-600 hover:bg-red-700 px-4 py-3 rounded-xl border-2 border-darkbrown retro-shadow-sm transition-all active:translate-y-0.5 cursor-pointer text-center"
                  >
                    IGEN, TÖRÖLHETŐ
                  </button>
                  <button
                    onClick={() => setShowResetConfirm(false)}
                    className="flex-1 font-retro text-xs text-darkbrown bg-sand hover:bg-sand/90 px-4 py-3 rounded-xl border-2 border-darkbrown retro-shadow-sm transition-all active:translate-y-0.5 cursor-pointer text-center"
                  >
                    NEM, MEGTARTOM
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* COMPANION STYLE FOR PRINT IN BROWSER */}
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .print\\:hidden {
            display: none !important;
          }
          body {
            background: white !important;
            color: black !important;
          }
          .max-w-lg {
            visibility: visible;
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%) rotate(0deg) !important;
            width: 100% !important;
            max-width: 100% !important;
            box-shadow: none !important;
            border: 3px solid #3A2418 !important;
          }
          .max-w-lg * {
            visibility: visible;
          }
        }
      `}</style>
    </div>
  );
}
