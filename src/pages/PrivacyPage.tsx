import React from 'react';
import { ShieldCheck, Lock, Eye, FileText, CheckCircle2 } from 'lucide-react';

export default function PrivacyPage() {
  const sections = [
    {
      title: "1. Milyen adatokat gyűjtünk?",
      desc: "A Budafoki Zarándokház által szervezett II. Budafoki Sátras Cigányok – Duna Party Fesztivál weboldala kizárólag a fesztiválra történő regisztrációhoz és jegyértesítőhöz szükséges alapvető személyes adatokat kéri be és tárolja:",
      bullets: [
        "A regisztráló teljes neve",
        "E-mail címe (kapcsolattartáshoz és a visszaigazolások kiküldéséhez)",
        "A regisztráció időpontja és a választott jegy/sátorhely típusa",
        "Kapcsolatfelvételi űrlap kitöltése esetén a küldött üzenet tartalma"
      ]
    },
    {
      title: "2. Miért gyűjtjük ezeket az adatokat?",
      desc: "Az adatkezelés célja kizárólag a rendezvény bökkenőmentes lebonyolítása, a résztvevők létszámának pontos tervezése, a biztonság fenntartása és a fontos információk eljuttatása a látogatókhoz.",
      bullets: [
        "Jegy- és sátorhely-regisztrációk igazolása",
        "Helyszíni kapacitások (melegvíz, vécék, ételadagok) tervezése",
        "Közvetlen tájékoztatás vis maior (pl. rossz időjárási körülmények a Dunán) vagy programváltozás esetén",
        "Közösségi hírlevelek és jövőbeli események hírlevelének küldése (kizárólag hozzájárulás esetén)"
      ]
    },
    {
      title: "3. Hogyan tároljuk és védjük az adatokat?",
      desc: "Az adatokat biztonságos felhő alapú szervereken tároljuk, amelyekhez kizárólag a fesztivál főszervezői férnek hozzá egyedi azonosítással. Harmadik félnek (pl. marketing cégeknek) soha, semmilyen körülmények között nem adjuk ki vagy értékesítjük az adataidat.",
      bullets: [
        "Szigorú hozzáférési korlátozások",
        "HTTPS titkosított csatornák a weboldalon való beküldések során",
        "Nemzetközi adatvédelmi elveknek (GDPR) megfelelő tárolási eljárások"
      ]
    },
    {
      title: "4. Milyen jogaid vannak?",
      desc: "A GDPR szabályozás értelmében bármikor kérheted a rólad tárolt adatok módosítását, megtekintését vagy azonnali, teljes körű törlését rendszerünkből.",
      bullets: [
        "Kérheted a nálunk tárolt adataid teljes másolatát",
        "Bármikor kérheted adataid azonnali helyesbítését vagy javítását",
        "Kérheted a nálunk tárolt adataid azonnali törlését az info@budafokidunaparty.hu e-mail címen – ebben az esetben a rendezvényre szóló regisztrációd automatikusan érvényét veszti."
      ]
    }
  ];

  return (
    <div className="pt-36 lg:pt-40 pb-24 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto animate-fade-in select-none">
      {/* Page Title Header */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <h1 className="font-retro text-4xl sm:text-5xl md:text-6xl text-darkbrown uppercase tracking-tight mt-4 text-stroke-retro [text-shadow:4px_4px_0px_#FFF] filter drop-shadow-sm leading-none">
          ADATVÉDELEM
        </h1>
        <p className="font-sans text-sm sm:text-base text-darkbrown/80 font-medium mt-6 leading-relaxed">
          Nálunk a személyes adataid ugyanolyan biztonságban vannak, mint a legértékesebb sátorozós felszerelésed. Olvasd el egyszerű és tiszta tájékoztatónkat a GDPR szabályzatnak megfelelően.
        </p>
      </div>

      {/* Main Legal Content Sections */}
      <div className="space-y-8 mb-16">
        {sections.map((section, idx) => (
          <div 
            key={idx}
            className="bg-white rounded-3xl border-3 border-darkbrown p-6 sm:p-8 retro-shadow-sm"
          >
            <h3 className="font-retro text-md sm:text-lg text-darkbrown uppercase tracking-tight mb-4 flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-orange border border-darkbrown"></span>
              {section.title}
            </h3>
            
            <p className="font-sans text-xs sm:text-sm text-darkbrown/85 font-semibold leading-relaxed mb-5">
              {section.desc}
            </p>

            <ul className="space-y-3 pl-4">
              {section.bullets.map((bullet, bulletIdx) => (
                <li key={bulletIdx} className="flex gap-2.5 items-start">
                  <CheckCircle2 className="w-4 h-4 text-turquoise stroke-[2.5] shrink-0 mt-0.5" />
                  <span className="font-sans text-xs sm:text-sm text-darkbrown/80 font-medium">{bullet}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Legal Footer Info Stamp */}
      <div className="border-t-2 border-darkbrown/20 pt-8 text-center space-y-2 text-darkbrown/60 font-sans text-xs font-bold leading-relaxed max-w-2xl mx-auto">
        <p>
          Adatkezelő: Budafoki Zarándokház
        </p>
        <p>
          Ha bármilyen panaszod vagy kérdésed lenne, fordulj bizalommal adatvédelmi felelősünkhöz az <strong>info@budafokidunaparty.hu</strong> címen, vagy keresd a Nemzeti Adatvédelmi és Információszabadság Hatóságot (NAIH, www.naih.hu).
        </p>
        <p className="text-[10px] text-darkbrown/40 mt-4 uppercase tracking-widest">
          Hatályos: 2026. április 1-től visszavonásig.
        </p>
      </div>
    </div>
  );
}
