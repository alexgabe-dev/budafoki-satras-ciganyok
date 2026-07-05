import React, { useState } from 'react';
import { Mail, Sparkles, CheckCircle, ShieldCheck } from 'lucide-react';

export default function Tickets() {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSaving) return;

    if (!email) {
      setError('Kérjük, add meg az e-mail címed!');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Kérjük, érvényes e-mail címet adj meg!');
      return;
    }

    setError('');
    setIsSaving(true);

    try {
      const response = await fetch('/api/waitlist', {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        setError(data.error || 'Nem sikerült elmenteni a feliratkozást.');
        return;
      }

      setIsSubmitted(true);
    } catch (e) {
      console.error(e);
      setError('Nem sikerült kapcsolódni az adatbázishoz. Kérjük próbáld újra.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <section id="tickets" className="py-20 wood-horizontal relative overflow-hidden text-cream border-b-4 border-darkbrown">
      <div className="absolute inset-0 bg-black/20 pointer-events-none"></div>
      
      {/* Glow effect */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] sm:w-[600px] aspect-square bg-orange/10 rounded-full blur-[80px] pointer-events-none"></div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Card wrapper */}
        <div className="bg-cream text-darkbrown rounded-2xl retro-border-thick retro-shadow-lg p-8 sm:p-12 relative overflow-hidden">
          
          {/* Decorative flag ribbon */}
          <div className="absolute top-0 right-0 left-0 h-2 bg-gradient-to-r from-orange via-turquoise to-sand"></div>

          <div className="text-center max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-orange/10 border-2 border-orange/40 rounded-full text-orange font-bold text-xs uppercase tracking-wider mb-4">
              <Sparkles className="w-4 h-4" /> NE MARADJ LE!
            </div>
            
            <h2 className="font-retro text-3xl sm:text-5xl text-darkbrown uppercase tracking-tight">
              JEGYEK HAMAROSAN
            </h2>
            
            <p className="mt-4 font-sans font-extrabold text-sm sm:text-base text-darkbrown/80 leading-relaxed">
              Iratkozz fel az előregisztrációs listánkra, és mi küldjük a legelső értesítést, amint elindul a jegyértékesítés és bejelentjük a fellépőket!
            </p>
          </div>

          <div className="mt-10 max-w-xl mx-auto">
            {!isSubmitted ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-3">
                  
                  {/* Email Input */}
                  <div className="relative flex-1">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-darkbrown/50" />
                    </div>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (error) setError('');
                      }}
                      placeholder="Add meg az e-mail címed"
                      className="block w-full pl-11 pr-4 py-4 bg-[#FFFDF6] text-darkbrown placeholder:text-darkbrown/40 rounded-xl font-sans font-bold text-sm sm:text-base retro-border focus:ring-2 focus:ring-orange focus:outline-none transition-all"
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="w-full sm:w-auto font-retro text-sm text-cream bg-orange hover:bg-orange/90 disabled:bg-darkbrown/45 disabled:cursor-wait px-6 py-4 rounded-xl retro-border retro-shadow transition-all hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-retro-sm active:translate-x-1 active:translate-y-1 cursor-pointer flex items-center justify-center gap-2"
                  >
                    {isSaving ? 'MENTÉS...' : 'ÉRTESÍTS, HA JÖHET! 🚀'}
                  </button>

                </div>

                {/* Error message */}
                {error && (
                  <p className="text-red-600 font-sans font-bold text-xs text-center">
                    ⚠️ {error}
                  </p>
                )}

                {/* Info and GDPR */}
                <div className="pt-2 flex items-center justify-center gap-2 text-[11px] font-sans font-bold text-darkbrown/60">
                  <ShieldCheck className="w-4 h-4 text-olive" />
                  <span>Az adataid nálunk biztonságban vannak. Nem küldünk spameket!</span>
                </div>

              </form>
            ) : (
              /* Success Message */
              <div className="text-center p-6 bg-olive/10 border-3 border-dashed border-olive rounded-xl animate-fade-in">
                <div className="w-16 h-16 bg-olive text-cream rounded-full retro-border retro-shadow-sm flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8" />
                </div>
                <h3 className="font-retro text-xl text-olive uppercase tracking-tight">
                  KÖSZI, REGISZTRÁLTÁL!
                </h3>
                <p className="mt-2 font-sans font-bold text-sm sm:text-base text-darkbrown/80 leading-relaxed">
                  Sikeres feliratkozás! E-mailben azonnal értesítünk, amint elstartol a jegyvásárlás. Szólunk, ha indul a buli! ⛺🍻
                </p>
                <button
                  onClick={() => {
                    setIsSubmitted(false);
                    setEmail('');
                  }}
                  className="mt-4 font-sans font-bold text-xs text-orange hover:underline focus:outline-none"
                >
                  Másik e-mail regisztrálása
                </button>
              </div>
            )}
          </div>

        </div>

      </div>
    </section>
  );
}
