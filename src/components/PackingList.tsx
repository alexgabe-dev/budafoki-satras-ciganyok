import React, { useState, useEffect } from 'react';
import { ClipboardList, Sparkles, Check, Plus, Trash2, RotateCcw } from 'lucide-react';

const defaultItems = [
  { id: 1, name: 'Sátor', desc: 'Hogy ne a csillagos ég legyen az egyetlen takaród (bár az is chilles).', checked: false, isCustom: false },
  { id: 2, name: 'Hálózsák & Polifoam', desc: 'A kavicsos Duna-part hangulatos, de alváshoz azért kell a kényelem.', checked: false, isCustom: false },
  { id: 3, name: 'Powerbank', desc: 'Hogy fel tudd tölteni a telefonod, lefotózni a naplementét, és megtalálni a haverokat.', checked: false, isCustom: false },
  { id: 4, name: 'Fürdőruha & Törölköző', desc: 'A Duna hűsítő vize délutánonként maga a megváltás.', checked: false, isCustom: false },
  { id: 5, name: 'Szúnyogriasztó', desc: 'Sajnos a vérszívó dögök is imádják a Duna-parti éjszakákat.', checked: false, isCustom: false },
  { id: 6, name: 'Józan ész (opcionális)', desc: 'Csak javaslat, de a sátor felállításánál és a bogrács meggyújtásánál jól jöhet.', checked: false, isCustom: false },
];

interface PackingListProps {
  isSubpage?: boolean;
}

export default function PackingList({ isSubpage = false }: PackingListProps) {
  const [items, setItems] = useState(() => {
    try {
      const saved = localStorage.getItem('BSC_packing_list');
      return saved ? JSON.parse(saved) : defaultItems;
    } catch {
      return defaultItems;
    }
  });

  const [newItemName, setNewItemName] = useState('');

  useEffect(() => {
    try {
      localStorage.setItem('BSC_packing_list', JSON.stringify(items));
    } catch (e) {
      console.error(e);
    }
  }, [items]);

  const toggleItem = (id: number) => {
    setItems(
      items.map((item: any) => 
        item.id === id ? { ...item, checked: !item.checked } : item
      )
    );
  };

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName.trim()) return;
    const newItem = {
      id: Date.now(),
      name: newItemName.trim(),
      desc: 'Saját bepakolandó tétel',
      checked: false,
      isCustom: true
    };
    setItems([...items, newItem]);
    setNewItemName('');
  };

  const handleDeleteItem = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    setItems(items.filter((item: any) => item.id !== id));
  };

  const handleReset = () => {
    if (window.confirm('Biztosan szeretnéd visszaállítani az alapértelmezett listát?')) {
      setItems(defaultItems);
    }
  };

  const completedCount = items.filter((i: any) => i.checked).length;

  const clipboardContent = (
    <div className="bg-[#FFFDF6] rounded-2xl retro-border-thick retro-shadow-lg p-6 sm:p-10 md:p-12 relative">
      
      {/* Clipboard Metal Clip decoration */}
      <div className="absolute top-[-25px] left-1/2 -translate-x-1/2 bg-[#B0B5B3] border-4 border-darkbrown px-10 py-3 rounded-b-xl shadow-md z-20 flex flex-col items-center">
        <div className="w-8 h-2 bg-darkbrown/30 rounded-full mb-1"></div>
        <div className="w-16 h-1 bg-darkbrown/20 rounded-full"></div>
      </div>

      <div className="pt-8">
        
        {/* Header statistics */}
        <div className="flex justify-between items-center border-b-2 border-darkbrown/10 pb-4 mb-6">
          <span className="font-retro text-xs md:text-sm text-darkbrown/60 uppercase">
            Túlélőkészlet ellenőrzése:
          </span>
          <span className="font-retro text-xs md:text-sm text-cream bg-orange px-3 py-1 rounded-full retro-border">
            {completedCount} / {items.length} BEPAKOLVA
          </span>
        </div>

        {/* Interactive Checkbox List */}
        <div className="space-y-4">
          {items.map((item: any) => (
            <div
              key={item.id}
              onClick={() => toggleItem(item.id)}
              className={`w-full text-left p-4 rounded-xl border-2 transition-all flex items-start justify-between gap-4 cursor-pointer select-none ${
                item.checked 
                  ? 'bg-olive/10 border-olive/30 translate-x-0.5 opacity-70' 
                  : 'bg-[#FFFDF6] border-darkbrown hover:bg-sand/10 hover:translate-x-0.5 shadow-sm'
              }`}
            >
              <div className="flex items-start gap-4 flex-1">
                {/* Styled Checkbox */}
                <div className="mt-1 shrink-0">
                  {item.checked ? (
                    <div className="w-6 h-6 bg-olive text-cream rounded-md border-2 border-darkbrown flex items-center justify-center animate-scale-up">
                      <Check className="w-4 h-4 stroke-[3px]" />
                    </div>
                  ) : (
                    <div className="w-6 h-6 bg-cream rounded-md border-2 border-darkbrown"></div>
                  )}
                </div>

                {/* Text Details */}
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className={`font-retro text-sm sm:text-base md:text-lg text-darkbrown leading-tight ${item.checked ? 'line-through text-darkbrown/40' : ''}`}>
                      {item.name}
                    </h3>
                    {item.isCustom && (
                      <span className="font-sans font-extrabold text-[8px] bg-turquoise/20 text-turquoise border border-turquoise/30 px-1.5 py-0.5 rounded uppercase tracking-wider">
                        saját
                      </span>
                    )}
                  </div>
                  <p className={`font-sans font-medium text-xs text-darkbrown/70 mt-1 leading-relaxed ${item.checked ? 'text-darkbrown/30' : ''}`}>
                    {item.desc}
                  </p>
                </div>
              </div>

              {/* Delete button (only for custom user items) */}
              {item.isCustom && (
                <button
                  onClick={(e) => handleDeleteItem(e, item.id)}
                  className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 transition-colors shrink-0"
                  aria-label="Törlés"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Custom Item Addition and Action Buttons */}
        <div className="mt-8 pt-6 border-t-2 border-dashed border-darkbrown/10 flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center">
          
          {/* Add Custom Item Form */}
          <form onSubmit={handleAddItem} className="flex-1 flex gap-2">
            <input
              type="text"
              value={newItemName}
              onChange={(e) => setNewItemName(e.target.value)}
              placeholder="Hozzáadnál valamit a listához?"
              className="flex-1 px-4 py-2.5 bg-[#FFFDF6] text-darkbrown placeholder:text-darkbrown/40 rounded-xl font-sans font-bold text-xs sm:text-sm retro-border focus:ring-2 focus:ring-orange focus:outline-none transition-all"
              maxLength={40}
            />
            <button
              type="submit"
              className="font-retro text-xs text-cream bg-turquoise hover:bg-turquoise/90 px-4 py-2.5 rounded-xl border-2 border-darkbrown shadow-sm transition-all hover:translate-y-0.5 active:translate-y-1 flex items-center gap-1 shrink-0"
            >
              <Plus className="w-4 h-4" /> HOZZÁAD
            </button>
          </form>

          {/* Reset list button */}
          <button
            onClick={handleReset}
            className="font-sans font-extrabold text-[10px] sm:text-xs text-darkbrown/60 hover:text-red-600 px-4 py-2.5 rounded-xl border-2 border-dashed border-darkbrown/20 hover:border-red-600/30 flex items-center justify-center gap-1.5 transition-all"
          >
            <RotateCcw className="w-3.5 h-3.5" /> ALAPHELYZET
          </button>

        </div>

        {/* Checklist success state banner */}
        {completedCount === items.length && items.length > 0 && (
          <div className="mt-8 p-4 bg-olive text-cream rounded-xl retro-border-thick retro-shadow-sm text-center font-retro text-xs sm:text-sm uppercase tracking-wider animate-bounce">
            🎉 Minden bepakolva! Indulhat a II. Budafoki Sátras Cigányok! ⛺🍻
          </div>
        )}

      </div>

    </div>
  );

  if (isSubpage) {
    return clipboardContent;
  }

  return (
    <section id="packing-list" className="py-20 bg-cream paper-texture relative overflow-hidden">
      {/* Light decorative shapes */}
      <div className="absolute top-1/2 left-[-10%] w-[300px] h-[300px] bg-turquoise/5 rounded-full blur-[40px] pointer-events-none"></div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Title */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-olive/10 border-2 border-olive rounded-full text-olive font-bold text-xs uppercase tracking-wider mb-4">
            <ClipboardList className="w-4 h-4 text-orange" /> KELENGYELISTA
          </div>
          <h2 className="font-retro text-3xl sm:text-5xl text-darkbrown tracking-tight uppercase">
            ★ MIT HOZZ MAGADDAL? ★
          </h2>
          <div className="w-24 h-1.5 bg-orange mx-auto mt-4 rounded-full retro-border"></div>
        </div>

        {clipboardContent}

      </div>
    </section>
  );
}
