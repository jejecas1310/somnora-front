"use client";

import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, Wind, Volume2, Star, ArrowRight, Sun, Music,
  Menu, ShoppingCart, Circle, X, Trash2, Plus, Minus,
  ChevronLeft, ChevronRight
} from 'lucide-react';

// Composant Diaporama (ton original)
const Diaporama = ({ variations, activeVariationId, className, innerClassName }: any) => {
  const [current, setCurrent] = useState(0);
  useEffect(() => {
    if (activeVariationId) {
      const index = variations.findIndex((v: any) => v.id === activeVariationId);
      if (index !== -1) setCurrent(index);
    }
  }, [activeVariationId, variations]);

  const prev = () => setCurrent(curr => (curr === 0 ? variations.length - 1 : curr - 1));
  const next = () => setCurrent(curr => (curr + 1) % variations.length);

  return (
    <div className={`relative group ${className}`}>
       <div className={`overflow-hidden w-full h-full relative ${innerClassName}`}>
         {variations.map((v: any, i: number) => (
            <img key={v.id} src={v.image} alt={v.name} className={`absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-700 ${i === current ? 'opacity-100 z-10' : 'opacity-0 z-0'}`} />
         ))}
         <div className="absolute top-6 left-6 z-20 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm">
            <span className="text-[10px] font-bold uppercase tracking-widest text-stone-800">{variations[current].name}</span>
         </div>
       </div>
       <button onClick={prev} className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center text-stone-800 opacity-0 group-hover:opacity-100 transition-all z-20 shadow-lg"><ChevronLeft className="w-5 h-5" /></button>
       <button onClick={next} className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center text-stone-800 opacity-0 group-hover:opacity-100 transition-all z-20 shadow-lg"><ChevronRight className="w-5 h-5" /></button>
    </div>
  );
};

export default function ClientInterface({ initialData }: { initialData: any }) {
  const [selectedBundle, setSelectedBundle] = useState(initialData.bundles[1]);
  const [selections, setSelections] = useState(Array(initialData.bundles[1].bundleQty).fill(initialData.variations[0]));
  const [scrolled, setScrolled] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cart, setCart] = useState<any[]>([]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) window.scrollTo({ top: element.getBoundingClientRect().top + window.pageYOffset - 100, behavior: 'smooth' });
  };

  const handleBundleChange = (bundle: any) => {
    setSelectedBundle(bundle);
    setSelections(Array(bundle.bundleQty).fill(initialData.variations[0]));
  };

  return (
    <div className="min-h-screen bg-[#FDFCFB] text-stone-900 font-light selection:bg-emerald-100 overflow-x-hidden">
      <style>{`
        @keyframes float { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-15px); } }
        .animate-luxury-float { animation: float 6s ease-in-out infinite; }
        .font-luxury-serif { font-family: ui-serif, Georgia, Cambria, "Times New Roman", Times, serif; }
      `}</style>

      {/* HEADER COMPLET */}
      <header className={`fixed top-0 w-full z-50 transition-all duration-700 ${scrolled ? 'bg-stone-100/95 backdrop-blur-xl py-4 border-b border-stone-200 shadow-sm' : 'bg-transparent py-8'}`}>
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-4 cursor-pointer" onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>
            <Circle className="w-6 h-6 text-emerald-900 opacity-60" strokeWidth={1.5} />
            <span className="text-xl font-semibold tracking-[0.3em] uppercase">Somnora</span>
          </div>
          <nav className="hidden lg:flex items-center gap-12 text-sm font-bold uppercase tracking-[0.2em] text-stone-600">
            <button onClick={() => scrollToSection('science')}>La Technologie</button>
            <button onClick={() => scrollToSection('achat')}>Commander</button>
          </nav>
          <button onClick={() => setIsCartOpen(true)} className="p-2 relative">
            <ShoppingCart className="w-6 h-6" strokeWidth={1.2} />
            {cart.length > 0 && <span className="absolute top-1 right-0 bg-stone-950 text-white text-[9px] w-4 h-4 flex items-center justify-center rounded-full font-bold">{cart.length}</span>}
          </button>
        </div>
      </header>

      <main>
        {/* HERO SECTION */}
        <section className="relative min-h-screen flex items-center px-6 max-w-7xl mx-auto pt-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 w-full items-center">
            <div className="lg:col-span-6 text-center lg:text-left">
              <h1 className="text-6xl md:text-8xl font-luxury-serif italic mb-10 leading-[0.95] tracking-tighter animate-luxury-float">La science <span className="not-italic block lg:inline">Du Calme.</span></h1>
              <p className="text-lg text-stone-700 mb-12 italic max-w-md mx-auto lg:mx-0">{initialData.shortDesc}</p>
              <button onClick={() => scrollToSection('achat')} className="bg-stone-950 text-white px-14 py-6 rounded-full text-xs font-bold uppercase tracking-[0.2em]">Découvrir l'offre</button>
            </div>
            <div className="lg:col-span-6"><img src="https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?auto=format&fit=crop&q=80&w=1200" className="rounded-[60px] shadow-2xl" alt="" /></div>
          </div>
        </section>

        {/* SCIENCE SECTION */}
        <section id="science" className="bg-stone-50 py-24 md:py-40">
          <div className="max-w-7xl mx-auto px-6 text-center">
            <h2 className="text-4xl md:text-6xl font-luxury-serif italic mb-20">Une technologie de pointe.</h2>
          </div>
        </section>

        {/* ACHAT SECTION (DYNAMIQUE) */}
        <section id="achat" className="py-24 md:py-40 px-6 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
            <div className="lg:col-span-6 hidden lg:block">
              <Diaporama variations={initialData.variations} activeVariationId={selections[0]?.id} className="aspect-square" innerClassName="rounded-[40px] shadow-xl" />
            </div>
            <div className="lg:col-span-6">
              <h2 className="text-4xl font-luxury-serif italic mb-12">Adopter Somnora</h2>
              <div className="space-y-12">
                {initialData.bundles.map((b: any) => (
                  <button key={b.id} onClick={() => handleBundleChange(b)} className={`w-full p-6 rounded-3xl border-2 transition-all flex justify-between items-center ${selectedBundle.id === b.id ? 'border-emerald-800 bg-emerald-50/20' : 'border-stone-100 bg-white'}`}>
                    <div className="text-left"><p className="font-bold uppercase tracking-widest text-sm">{b.label}</p></div>
                    <p className="text-lg font-bold">{b.price.toFixed(2)} €</p>
                  </button>
                ))}
                <div className="space-y-6">
                  {selections.map((_, idx) => (
                    <div key={idx} className="bg-stone-50 p-6 rounded-3xl border border-stone-100">
                      <p className="text-[10px] font-bold uppercase mb-4 opacity-40">Compagnon n°{idx+1}</p>
                      <div className="flex gap-4">
                        {initialData.variations.map((v: any) => (
                          <button key={v.id} onClick={() => {
                            const newS = [...selections];
                            newS[idx] = v;
                            setSelections(newS);
                          }} className={`w-12 h-12 rounded-full border-2 p-1 ${selections[idx]?.id === v.id ? 'border-emerald-800' : 'border-transparent opacity-40'}`}>
                            <img src={v.image} className="w-full h-full rounded-full object-cover" alt="" />
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
                <button className="w-full bg-stone-950 text-white py-8 rounded-full font-bold uppercase tracking-widest hover:bg-emerald-950 transition-all">Ajouter au panier</button>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
