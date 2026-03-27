"use client";

import React, { useState, useEffect } from 'react';
import { 
  Menu, ShoppingCart, Circle, X, ChevronLeft, ChevronRight
} from 'lucide-react';

// --- TES COMPOSANTS (DIAPORAMA, ETC.) ---
const Diaporama = ({ variations, activeVariationId }: any) => {
  const [current, setCurrent] = useState(0);
  useEffect(() => {
    if (activeVariationId) {
      const index = variations.findIndex((v: any) => v.id === activeVariationId);
      if (index !== -1) setCurrent(index);
    }
  }, [activeVariationId, variations]);

  const prev = () => setCurrent(curr => (curr === 0 ? variations.length - 1 : curr - 1));
  const next = () => setCurrent(curr => (curr + 1) % variations.length);

  if (!variations.length) return null;

  return (
    <div className="relative group aspect-square">
       <div className="overflow-hidden w-full h-full relative rounded-[40px] shadow-xl">
         {variations.map((v: any, i: number) => (
            <img 
              key={v.id}
              src={v.image} 
              alt={v.name} 
              className={`absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-700 ${i === current ? 'opacity-100 z-10' : 'opacity-0'}`} 
            />
         ))}
         <div className="absolute top-6 left-6 z-20 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm">
            <span className="text-[10px] font-bold uppercase tracking-widest">{variations[current].name}</span>
         </div>
       </div>
       <button onClick={prev} className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all z-20 shadow-lg"><ChevronLeft /></button>
       <button onClick={next} className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all z-20 shadow-lg"><ChevronRight /></button>
    </div>
  );
};

// --- TON INTERFACE PRINCIPALE ---
export default function ClientInterface({ initialData }: { initialData: any }) {
  const [selectedBundle, setSelectedBundle] = useState(initialData.bundles[1]);
  const [selections, setSelections] = useState([initialData.variations[0], initialData.variations[0]]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cart, setCart] = useState<any[]>([]);

  const handleBundleChange = (bundle: any) => {
    setSelectedBundle(bundle);
    const newSels = Array(bundle.bundleQty).fill(initialData.variations[0]);
    setSelections(newSels);
  };

  return (
    <div className="min-h-screen bg-[#FDFCFB] text-stone-900 font-light">
      <header className="fixed top-0 w-full z-50 bg-stone-100/90 backdrop-blur-xl py-4 border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Circle className="w-6 h-6 text-emerald-900" />
            <span className="text-xl font-semibold tracking-[0.3em] uppercase">Somnora</span>
          </div>
          <button onClick={() => setIsCartOpen(true)} className="relative">
            <ShoppingCart className="w-6 h-6" />
            {cart.length > 0 && <span className="absolute -top-2 -right-2 bg-black text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">{cart.length}</span>}
          </button>
        </div>
      </header>

      <main className="pt-32">
        <section className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-16">
          <div className="lg:col-span-6">
            <Diaporama variations={initialData.variations} activeVariationId={selections[0]?.id} />
          </div>
          <div className="lg:col-span-6">
            <h1 className="text-5xl font-serif italic mb-6">{initialData.name}</h1>
            <p className="text-stone-600 mb-12 italic">{initialData.shortDesc}</p>
            
            <div className="space-y-6">
              {initialData.bundles.map((b: any) => (
                <button key={b.id} onClick={() => handleBundleChange(b)} className={`w-full p-6 rounded-3xl border-2 flex justify-between items-center ${selectedBundle.id === b.id ? 'border-emerald-800 bg-emerald-50' : 'border-stone-100'}`}>
                  <span className="font-bold uppercase tracking-widest text-sm">{b.label}</span>
                  <span className="font-bold">{b.price.toFixed(2)} €</span>
                </button>
              ))}
            </div>

            <div className="mt-12 space-y-4">
              {selections.map((sel: any, idx: number) => (
                <div key={idx} className="bg-stone-50 p-4 rounded-2xl flex gap-4">
                  {initialData.variations.map((v: any) => (
                    <button key={v.id} onClick={() => {
                      const newS = [...selections];
                      newS[idx] = v;
                      setSelections(newS);
                    }} className={`w-10 h-10 rounded-full border-2 ${selections[idx]?.id === v.id ? 'border-emerald-800' : 'border-transparent opacity-40'}`}>
                      <img src={v.image} className="w-full h-full rounded-full object-cover" alt="" />
                    </button>
                  ))}
                </div>
              ))}
            </div>
            
            <button className="w-full bg-stone-950 text-white py-6 rounded-full mt-10 font-bold uppercase tracking-widest">
              Ajouter au panier
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}
