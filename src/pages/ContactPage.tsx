import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2, MessageSquare, Landmark, Info } from 'lucide-react';
import { useContent } from '../hooks/useContent';

export default function ContactPage() {
  const content = useContent({
    'contact.header.title': 'KAPCSOLAT & INFÓ',
    'contact.header.description': 'Kérdésed van a jegyekkel kapcsolatban? Szeretnél fellépni, főzni vagy önkéntesként segíteni a tábor építésében? Írj nekünk bátran, és válaszolunk amilyen gyorsan csak tudunk!',
  });
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'Altalános kérdés',
    message: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      // Reset form
      setFormData({ name: '', email: '', subject: 'Altalános kérdés', message: '' });
    }, 1200);
  };

  const contactInfos = [
    {
      icon: MapPin,
      title: "Helyszín",
      desc: "Pilismarót, Duna-part & Kavicsos szabadstrand (Pilismaróti-öböl mellett)",
      sub: "2028 Pilismarót, Akácfa u. vége"
    },
    {
      icon: Mail,
      title: "E-mail címek",
      desc: "info@budafokidunaparty.hu",
      sub: "Sajtó & fellépők: program@budafokidunaparty.hu"
    },
    {
      icon: Phone,
      title: "Telefonszám",
      desc: "+36 (30) 123-4567",
      sub: "Hétköznap: 09:00 - 17:00, tábor alatt: 0-24 órában"
    }
  ];

  return (
    <div className="pt-36 lg:pt-40 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto animate-fade-in">
      {/* Page Title Header */}
      <div className="text-center max-w-3xl mx-auto mb-16 select-none">
        <h1 className="font-retro text-4xl sm:text-5xl md:text-6xl text-darkbrown uppercase tracking-tight mt-4 text-stroke-retro [text-shadow:4px_4px_0px_#FFF] filter drop-shadow-sm leading-none">
          {content('contact.header.title')}
        </h1>
        <p className="font-sans text-sm sm:text-base text-darkbrown/80 font-medium mt-6 leading-relaxed">
          {content('contact.header.description')}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Left Side: Contact Information & Cards */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-3xl border-3 border-darkbrown retro-shadow p-6 sm:p-8 space-y-8">
            <h3 className="font-retro text-lg text-darkbrown uppercase tracking-tight mb-2 flex items-center gap-2">
              <Info className="w-5 h-5 text-orange" />
              ELÉRHETŐSÉGEK
            </h3>

            {contactInfos.map((info, idx) => {
              const Icon = info.icon;
              return (
                <div key={idx} className="flex gap-4 items-start border-b border-darkbrown/10 last:border-0 pb-6 last:pb-0">
                  <div className="bg-cream p-3 rounded-2xl border-2 border-darkbrown shrink-0 shadow-sm text-darkbrown">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-sans font-black text-xs text-darkbrown uppercase tracking-wider">{info.title}</h4>
                    <p className="font-sans font-bold text-sm text-darkbrown/90 mt-1 leading-snug">{info.desc}</p>
                    <p className="font-sans text-xs text-darkbrown/60 mt-0.5">{info.sub}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Organizer Card info */}
          <div className="bg-olive/10 border-3 border-darkbrown rounded-3xl p-6 sm:p-8 space-y-4">
            <div className="flex items-center gap-3">
              <div className="bg-olive p-2 rounded-xl border-2 border-darkbrown">
                <Landmark className="w-5 h-5 text-cream" />
              </div>
              <h3 className="font-retro text-md text-darkbrown uppercase tracking-tight">Fő szervezőnk</h3>
            </div>
            <p className="font-sans text-xs text-darkbrown/80 leading-relaxed font-bold">
              A fesztivál fő szervezője a <a href="https://bfzh.hu" target="_blank" rel="noreferrer" className="text-orange underline font-black">Budafoki Zarándokház</a>. A Duna Party Fesztivál a Zarándokház évben megrendezett legjelentősebb és leghíresebb eseménye!
            </p>
            <p className="font-sans text-xs text-darkbrown/80 leading-relaxed font-bold border-t border-darkbrown/10 pt-3">
              <strong>Bankszámlaszám (Támogatások és jegyek):</strong><br />
              <span className="font-mono text-xs block bg-white/80 border border-darkbrown/10 p-2 rounded mt-1 text-center select-all font-bold text-darkbrown">
                11711041-21443212-00000000
              </span>
            </p>
          </div>
        </div>

        {/* Right Side: Message form */}
        <div className="lg:col-span-7">
          <div className="bg-white rounded-3xl border-3 border-darkbrown retro-shadow p-6 sm:p-8 relative">
            
            {/* Header Form */}
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-orange p-2 rounded-xl border-2 border-darkbrown">
                <MessageSquare className="w-5 h-5 text-cream" />
              </div>
              <h3 className="font-retro text-lg text-darkbrown uppercase tracking-tight">
                KÜLDJ NEKÜNK ÜZENETET!
              </h3>
            </div>

            {isSubmitted ? (
              <div className="py-12 px-4 text-center space-y-4 animate-scale-up">
                <div className="inline-block bg-cream p-4 rounded-full border-3 border-darkbrown text-turquoise shadow-md mb-2">
                  <CheckCircle2 className="w-12 h-12 stroke-[2.5]" />
                </div>
                <h4 className="font-retro text-xl text-darkbrown uppercase tracking-tight">ÜZENET SIKERESEN ELKÜLDVE!</h4>
                <p className="font-sans text-sm text-darkbrown/80 font-semibold max-w-md mx-auto leading-relaxed">
                  Köszönjük a megkeresést! Az üzenetedet rögzítettük. Hamarosan válaszolunk a megadott e-mail címedre (általában 24 órán belül).
                </p>
                <button
                  onClick={() => setIsSubmitted(false)}
                  className="mt-4 px-6 py-2.5 bg-cream hover:bg-orange hover:text-cream text-darkbrown font-retro text-xs uppercase tracking-wider rounded-xl border-2 border-darkbrown retro-shadow-sm transition-all active:scale-95"
                >
                  Új üzenet írása
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5 font-sans">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <label className="block text-xs font-black text-darkbrown uppercase tracking-wider">
                      Teljes neved
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Pl. Kovács Gábor"
                      className="w-full px-4 py-3 rounded-xl border-2 border-darkbrown bg-cream/30 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange/30 font-bold text-sm text-darkbrown transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-xs font-black text-darkbrown uppercase tracking-wider">
                      E-mail címed
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="Pl. gabor@email.com"
                      className="w-full px-4 py-3 rounded-xl border-2 border-darkbrown bg-cream/30 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange/30 font-bold text-sm text-darkbrown transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-black text-darkbrown uppercase tracking-wider">
                    Tárgy
                  </label>
                  <select
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border-2 border-darkbrown bg-cream/30 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange/30 font-bold text-sm text-darkbrown transition-all"
                  >
                    <option value="Altalános kérdés">Általános érdeklődés</option>
                    <option value="Jegyek és regisztráció">Jegyvásárlás / Regisztráció</option>
                    <option value="Fellépési lehetőség">Zenekarok / Fellépők</option>
                    <option value="Catering és gasztronómia">Árusítás / Konyhai segítség</option>
                    <option value="Önkéntesség">Önkéntes munka a táborban</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-black text-darkbrown uppercase tracking-wider">
                    Üzeneted szövege
                  </label>
                  <textarea
                    required
                    rows={5}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Írd le ide részletesen a kérdésedet vagy javaslatodat..."
                    className="w-full px-4 py-3 rounded-xl border-2 border-darkbrown bg-cream/30 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange/30 font-bold text-sm text-darkbrown transition-all resize-none"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 bg-orange hover:bg-turquoise text-cream font-retro text-sm uppercase tracking-widest rounded-2xl border-3 border-darkbrown retro-shadow flex items-center justify-center gap-3 transition-all active:scale-[0.98] disabled:opacity-50 cursor-pointer"
                >
                  {isSubmitting ? (
                    <span>Küldés folyamatban...</span>
                  ) : (
                    <>
                      <span>Üzenet elküldése</span>
                      <Send className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
