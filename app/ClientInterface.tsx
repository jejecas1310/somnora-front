"use client";

import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, Wind,
  Volume2, Star, ArrowRight, Sun, Music,
  Menu, ShoppingCart, Circle, X, Trash2, Plus, Minus,
  ChevronLeft, ChevronRight
} from 'lucide-react';

// --- TYPES ---
interface Variation {
  id: string;
  name: string;
  image: string;
  value: string;
}

interface Bundle {
  id: string;
  label: string;
  bundleQty: number;
  price: number;
  popular: boolean;
  note?: string;
}

interface CartItem {
  cartId: string;
  bundleId: string;
  name: string;
  variantName: string;
  image: string;
  bundleLabel: string;
  qty: number;
  price: number;
  originalPrice: number;
}

// --- COMPOSANT DIAPORAMA ---
const Diaporama = ({ variations, activeVariationId, className, innerClassName }: { 
  variations: Variation[], 
  activeVariationId: string, 
  className: string, 
  innerClassName: string 
}) => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (activeVariationId) {
      const index = variations.findIndex(v => v.id === activeVariationId);
      if (index !== -1) setCurrent(index);
    }
  }, [activeVariationId, variations]);

  const prev = () => setCurrent(curr => (curr === 0 ? variations.length - 1 : curr - 1));
  const next = () => setCurrent(curr => (curr + 1) % variations.length);

  return (
    <div className={`relative group ${className}`}>
       <div className={`overflow-hidden w-full h-full relative ${innerClassName}`}>
         {variations.map((v, i) => (
            <img 
              key={v.id}
              src={v.image} 
              alt={v.name} 
              className={`absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-700 ease-in-out ${i === current ? 'opacity-100 z-10' : 'opacity-0 z-0'}`} 
            />
         ))}
         <div className="absolute top-6 left-6 z-20 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm">
            <span className="text-[10px] font-bold uppercase tracking-widest text-stone-800">{variations[current].name}</span>
         </div>
       </div>
       <button onClick={prev} className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center text-stone-800 opacity-0 group-hover:opacity-100 transition-all z-20 shadow-lg hover:bg-white hover:scale-105 active:scale-95">
         <ChevronLeft className="w-5 h-5" />
       </button>
       <button onClick={next} className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center text-stone-800 opacity-0 group-hover:opacity-100 transition-all z-20 shadow-lg hover:bg-white hover:scale-105 active:scale-95">
         <ChevronRight className="w-5 h-5" />
       </button>
       <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-3 z-20">
         {variations.map((_, i) => (
            <button key={i} onClick={() => setCurrent(i)} className={`h-1.5 rounded-full transition-all duration-300 shadow-sm ${i === current ? 'bg-white w-6 opacity-100' : 'bg-white/60 w-1.5 hover:bg-white'}`} />
         ))}
       </div>
    </div>
  );
};

// --- INTERFACE PRINCIPALE ---
export default function ClientInterface({ initialData }: { initialData: any }) {
  const mockProduct = initialData;
  const [selectedBundle, setSelectedBundle] = useState<Bundle>(mockProduct.bundles[1]);
  const [selections, setSelections] = useState<Variation[]>(Array(mockProduct.bundles[1].bundleQty).fill(mockProduct.variations[0]));
  const [scrolled, setScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [activePage, setActivePage] = useState('home');

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = (isMenuOpen || isCartOpen) ? 'hidden' : 'unset';
  }, [isMenuOpen, isCartOpen]);

  const scrollToSection = (id: string) => {
    setIsMenuOpen(false);
    if (activePage !== 'home') {
      setActivePage('home');
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) {
          window.scrollTo({ top: element.getBoundingClientRect().top + window.pageYOffset - 100, behavior: 'smooth' });
        }
      }, 100);
      return;
    }
    const element = document.getElementById(id);
    if (element) {
      window.scrollTo({ top: element.getBoundingClientRect().top + window.pageYOffset - 100, behavior: 'smooth' });
    }
  };

  const handleBundleChange = (bundle: Bundle) => {
    setSelectedBundle(bundle);
    const newSels = Array(bundle.bundleQty).fill(mockProduct.variations[0]);
    setSelections(newSels);
  };

  const handleSelectionChange = (index: number, variation: Variation) => {
    setSelections(prev => {
      const newSelections = [...prev];
      newSelections[index] = variation;
      return newSelections;
    });
  };

  const handleAddToCart = () => {
    const variantDesc = selections.map(s => s.value).join(' + ');
    const existingIndex = cart.findIndex(item => item.bundleId === selectedBundle.id && item.variantName === variantDesc);

    if (existingIndex >= 0) {
      const newCart = [...cart];
      newCart[existingIndex].qty += 1;
      setCart(newCart);
    } else {
      setCart([...cart, {
        cartId: `${selectedBundle.id}-${Date.now()}`,
        bundleId: selectedBundle.id,
        name: mockProduct.name,
        variantName: variantDesc,
        image: selections[0].image,
        bundleLabel: selectedBundle.label,
        qty: 1,
        price: selectedBundle.price,
        originalPrice: 39.90 * selectedBundle.bundleQty
      }]);
    }
    setIsCartOpen(true);
  };

  const cartTotal = cart.reduce((total, item) => total + (item.price * item.qty), 0);

  const renderLegalContent = () => {
    const content: Record<string, { title: string, sections: { t: string, c: string }[] }> = {
      privacy: {
        title: "Politique de Confidentialité (RGPD)",
        sections: [
          { t: "1. Collecte des données", c: "Nous collectons les données strictement nécessaires au traitement de vos commandes." },
          { t: "2. Utilisation et Partage", c: "Vos données sont utilisées exclusivement pour l'expédition et ne sont jamais revendues." }
        ]
      },
      cgv: {
        title: "Conditions Générales de Vente",
        sections: [
          { t: "1. Objet et Prix", c: "Les prix sont indiqués en Euros TTC. La livraison est offerte." },
          { t: "2. Garantie 30 Nuits", c: "Si vous n'êtes pas satisfait, nous vous remboursons intégralement." }
        ]
      },
      legal: {
        title: "Mentions Légales",
        sections: [
          { t: "1. Éditeur du site", c: "Le site Somnora est édité par Somnora. Email : contact@somnora.fr" },
          { t: "2. Hébergement", c: "Ce site est hébergé par o2switch à Clermont-Ferrand." }
        ]
      }
    };
    const p = content[activePage];
    if (!p) return null;
    return (
      <div className="max-w-3xl mx-auto space-y-8 text-stone-700 animate-in fade-in duration-700">
        <h1 className="text-4xl md:text-5xl font-luxury-serif italic text-stone-950 mb-12">{p.title}</h1>
        {p.sections.map((s, i) => (
          <section key={i} className="space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-widest text-stone-900">{s.t}</h2>
            <p className="leading-relaxed">{s.c}</p>
          </section>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#FDFCFB] text-stone-900 font-light selection:bg-emerald-100 overflow-x-hidden">
      <style>{`
        @keyframes float { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-15px); } }
        .animate-luxury-float { animation: float 6s ease-in-out infinite; }
        .font-luxury-serif { font-family: ui-serif, Georgia, Cambria, "Times New Roman", Times, serif; }
      `}</style>

      {/* HEADER */}
      <header className={`fixed top-0 w-full z-50 transition-all duration-700 ${scrolled ? 'bg-stone-100/95 backdrop-blur-xl py-4 border-b border-stone-200 shadow-sm' : 'bg-transparent py-8'}`}>
        <div className="max-w-7xl mx-auto px-6 md:px-10 flex items-center justify-between">
          <div className="flex items-center gap-4 cursor-pointer" onClick={() => { setActivePage('home'); window.scrollTo({top: 0, behavior: 'smooth'}); }}>
            <Circle className="w-6 h-6 text-emerald-900 opacity-60" strokeWidth={1.5} />
            <span className="text-xl font-semibold tracking-[0.3em] uppercase hidden sm:block">Somnora</span>
          </div>
          <nav className="hidden lg:flex items-center gap-12 text-sm font-bold uppercase tracking-[0.2em] text-stone-600">
            <button onClick={() => scrollToSection('science')}>La Technologie</button>
            <button onClick={() => scrollToSection('details')}>Fiche Technique</button>
            <button onClick={() => scrollToSection('achat')}>Commander</button>
          </nav>
          <div className="flex items-center gap-6">
            <button onClick={() => setIsCartOpen(true)} className="relative p-2">
              <ShoppingCart className="w-6 h-6 text-stone-800" strokeWidth={1.2} />
              {cart.length > 0 && <span className="absolute top-1 right-0 bg-stone-950 text-white text-[9px] w-4 h-4 flex items-center justify-center rounded-full font-bold shadow-sm">{cart.reduce((t, i) => t + i.qty, 0)}</span>}
            </button>
            <button onClick={() => setIsMenuOpen(true)} className="lg:hidden p-2"><Menu className="w-7 h-7" /></button>
          </div>
        </div>
      </header>

      {/* PANIER */}
      <div className={`fixed inset-0 bg-stone-950/20 backdrop-blur-sm z-[60] transition-all duration-500 ${isCartOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={() => setIsCartOpen(false)}></div>
      <div className={`fixed top-0 right-0 h-full w-full sm:w-[480px] bg-[#FDFCFB] shadow-2xl z-[70] transform transition-transform duration-500 flex flex-col ${isCartOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="p-8 border-b border-stone-100 flex justify-between items-center">
          <h2 className="text-sm font-bold uppercase tracking-[0.3em]">Votre Panier</h2>
          <button onClick={() => setIsCartOpen(false)}><X className="w-6 h-6" /></button>
        </div>
        <div className="flex-1 overflow-y-auto p-8 space-y-8">
          {cart.length === 0 ? <p className="text-center italic opacity-40 py-20 font-luxury-serif">Le panier est vide</p> : cart.map((item) => (
            <div key={item.cartId} className="flex gap-4">
              <img src={item.image} className="w-16 h-16 rounded-xl object-cover" alt="" />
              <div className="flex-1">
                <p className="text-xs font-bold uppercase">{item.bundleLabel}</p>
                <p className="text-[10px] text-stone-400">{item.variantName}</p>
                <p className="text-sm font-bold mt-2">{(item.price * item.qty).toFixed(2)} €</p>
              </div>
            </div>
          ))}
        </div>
        {cart.length > 0 && (
          <div className="p-8 border-t border-stone-100 bg-white">
            <div className="flex justify-between mb-8 text-2xl font-light"><span>Total</span><span>{cartTotal.toFixed(2)} €</span></div>
            <button className="w-full bg-stone-950 text-white py-6 rounded-full text-xs font-bold uppercase tracking-[0.3em]">Finaliser</button>
          </div>
        )}
      </div>

      <main>
        {activePage === 'home' ? (
          <>
            <section className="relative min-h-screen flex items-center px-6 md:px-10 max-w-7xl mx-auto pt-24">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 w-full items-center">
                <div className="lg:col-span-6 z-10 text-center lg:text-left">
                  <h1 className="text-6xl md:text-8xl font-luxury-serif italic mb-10 leading-[0.95] tracking-tighter animate-luxury-float">La science <span className="not-italic block lg:inline">Du Calme.</span></h1>
                  <p className="text-lg text-stone-700 mb-12 leading-relaxed max-w-md italic mx-auto lg:mx-0">{mockProduct.shortDesc}</p>
                  <button onClick={() => scrollToSection('achat')} className="bg-stone-950 text-white px-14 py-6 rounded-full text-xs font-bold uppercase tracking-[0.2em]">Découvrir l'offre</button>
                </div>
                <div className="lg:col-span-6"><img src="https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?auto=format&fit=crop&q=80&w=1200" className="rounded-[60px] shadow-2xl" alt="" /></div>
              </div>
            </section>

            <section id="science" className="bg-stone-50 py-24 md:py-40"><div className="max-w-7xl mx-auto px-6 text-center"><h2 className="text-4xl md:text-6xl font-luxury-serif italic mb-20">Une technologie de pointe.</h2></div></section>

            <section id="achat" className="py-24 md:py-40 px-6 max-w-7xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
                <div className="lg:col-span-6 hidden lg:block"><Diaporama variations={mockProduct.variations} activeVariationId={selections[0]?.id} className="aspect-square" innerClassName="rounded-[40px] shadow-xl" /></div>
                <div className="lg:col-span-6">
                  <h2 className="text-4xl font-luxury-serif italic mb-12">Adopter Somnora</h2>
                  <div className="space-y-12">
                    {mockProduct.bundles.map((b: any) => (
                      <button key={b.id} onClick={() => handleBundleChange(b)} className={`w-full p-6 rounded-3xl border-2 transition-all flex justify-between items-center ${selectedBundle.id === b.id ? 'border-emerald-800 bg-emerald-50/20' : 'border-stone-100 bg-white'}`}>
                        <div className="text-left"><p className="font-bold uppercase tracking-widest text-sm">{b.label}</p><p className="text-xs text-stone-400">{b.bundleQty} unité(s)</p></div>
                        <p className="text-lg font-bold">{b.price.toFixed(2)} €</p>
                      </button>
                    ))}
                    <div className="space-y-6">
                      {selections.map((_, idx) => (
                        <div key={idx} className="bg-stone-50 p-6 rounded-3xl border border-stone-100">
                          <p className="text-[10px] font-bold uppercase mb-4 opacity-40">Compagnon n°{idx+1}</p>
                          <div className="flex gap-4">
                            {mockProduct.variations.map((v: any) => (
                              <button key={v.id} onClick={() => handleSelectionChange(idx, v)} className={`w-12 h-12 rounded-full border-2 p-1 ${selections[idx]?.id === v.id ? 'border-emerald-800' : 'border-transparent opacity-40'}`}><img src={v.image} className="w-full h-full rounded-full object-cover" alt="" /></button>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                    <button onClick={handleAddToCart} className="w-full bg-stone-950 text-white py-8 rounded-full font-bold uppercase tracking-widest hover:bg-emerald-950 transition-all">Ajouter au panier</button>
                  </div>
                </div>
              </div>
            </section>
          </>
        ) : (
          <section className="min-h-screen pt-40 pb-24 px-6 md:px-10 max-w-7xl mx-auto">{renderLegalContent()}</section>
        )}
      </main>

      <footer className="bg-stone-950 text-white py-24 px-10">
        <div className="max-w-7xl mx-auto flex flex-col items-center gap-12">
          <span className="text-3xl font-medium tracking-[0.5em] uppercase">Somnora</span>
          <div className="flex flex-col md:flex-row gap-8 text-[10px] font-bold uppercase tracking-[0.3em] text-stone-500">
            <button onClick={() => setActivePage('legal')}>Mentions Légales</button>
            <button onClick={() => setActivePage('cgv')}>CGV & Retours</button>
            <button onClick={() => setActivePage('privacy')}>Confidentialité</button>
          </div>
        </div>
      </footer>
    </div>
  );
}
