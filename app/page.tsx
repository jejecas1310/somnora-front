"use client";

import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, Wind, Volume2, Star, ArrowRight, Sun, Music,
  Menu, ShoppingCart, Circle, X, Trash2, Plus, Minus,
  ChevronLeft, ChevronRight, Wifi, WifiOff, AlertTriangle
} from 'lucide-react';

// --- DONNÉES DE SECOURS ---
const INITIAL_MOCK = {
  name: "Le Compagnon Respirant Somnora",
  shortDesc: "Un système intuitif conçu pour réguler votre respiration par mimétisme. Capteurs intégrés, cycles lumineux et ambiances sonores naturelles.",
  basePrice: 39.90,
  variations: [
    { id: "var-1", name: "Série Koala Gris", image: "https://images.unsplash.com/photo-1531885559864-42b7816bb315?auto=format&fit=crop&q=80&w=1000", value: "Koala Gris" },
    { id: "var-2", name: "Série Koala Marron", image: "https://images.unsplash.com/photo-1589656966895-2f33e7653819?auto=format&fit=crop&q=80&w=1000", value: "Koala Marron" },
    { id: "var-3", name: "Série Snoopy", image: "https://images.unsplash.com/photo-1583008985558-4da5ab2fb12d?auto=format&fit=crop&q=80&w=1000", value: "Snoopy" },
    { id: "var-4", name: "Série Éléphant", image: "https://images.unsplash.com/photo-1551043047-1d2adf00f3fe?auto=format&fit=crop&q=80&w=1000", value: "Éléphant" }
  ],
  bundles: [
    { id: "b1", label: "Unité", bundleQty: 1, price: 39.90, popular: false },
    { id: "b2", label: "Pack Duo", bundleQty: 2, price: 74.90, popular: true, note: "Offre la plus populaire" },
    { id: "b3", label: "Pack Famille", bundleQty: 3, price: 109.90, popular: false, note: "Économie maximale" }
  ]
};

// --- COMPOSANTS INTERNES ---

const Diaporama = ({ variations, activeVariationId, className, innerClassName }: any) => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (activeVariationId && variations) {
      const index = variations.findIndex((v: any) => v.id === activeVariationId);
      if (index !== -1) setCurrent(index);
    }
  }, [activeVariationId, variations]);

  if (!variations || variations.length === 0) return null;

  const prev = () => setCurrent(curr => (curr === 0 ? variations.length - 1 : curr - 1));
  const next = () => setCurrent(curr => (curr + 1) % variations.length);

  return (
    <div className={`relative group ${className}`}>
       <div className={`overflow-hidden w-full h-full relative ${innerClassName}`}>
         {variations.map((v: any, i: number) => (
            <img 
              key={v.id}
              src={v.image} 
              alt={v.name} 
              className={`absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-700 ease-in-out ${i === current ? 'opacity-100 z-10' : 'opacity-0 z-0'}`} 
            />
         ))}
         <div className="absolute top-6 left-6 z-20 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm">
            <span className="text-[10px] font-bold uppercase tracking-widest text-stone-800">{variations[current]?.name}</span>
         </div>
       </div>
       <button onClick={prev} className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center text-stone-800 opacity-0 group-hover:opacity-100 transition-all z-20 shadow-lg hover:bg-white"><ChevronLeft className="w-5 h-5" /></button>
       <button onClick={next} className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center text-stone-800 opacity-0 group-hover:opacity-100 transition-all z-20 shadow-lg hover:bg-white"><ChevronRight className="w-5 h-5" /></button>
    </div>
  );
};

// --- COMPOSANT PRINCIPAL ---

export default function App() {
  const [productData, setProductData] = useState(INITIAL_MOCK);
  const [connectionStatus, setConnectionStatus] = useState<'pending' | 'success' | 'failed'>('pending');
  const [selectedBundle, setSelectedBundle] = useState(INITIAL_MOCK.bundles[1]);
  const [selections, setSelections] = useState<any[]>([]);
  const [scrolled, setScrolled] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cart, setCart] = useState<any[]>([]);

  // Initialisation des sélections
  useEffect(() => {
    setSelections(Array(INITIAL_MOCK.bundles[1].bundleQty).fill(INITIAL_MOCK.variations[0]));
  }, []);

  // Fetch WordPress Data
  useEffect(() => {
    const fetchWPData = async () => {
      try {
        const apiUrl = 'http://somnora.diwo9363.odns.fr/graphql';
        const res = await fetch(apiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            query: `query { products(first: 1) { nodes { name ... on VariableProduct { variations { nodes { id name price image { node { sourceUrl } } } } } } } }`
          })
        });

        if (!res.ok) throw new Error();
        const json = await res.json();
        const wpProduct = json.data?.products?.nodes[0];

        if (wpProduct && wpProduct.variations) {
          const newVariations = wpProduct.variations.nodes.map((v: any) => ({
            id: v.id,
            name: v.name.split(' - ')[1] || v.name,
            image: v.image?.node?.sourceUrl || INITIAL_MOCK.variations[0].image,
            value: v.name.split(' - ')[1] || v.name,
          }));

          setProductData(prev => ({ ...prev, name: wpProduct.name, variations: newVariations }));
          setSelections(Array(selectedBundle.bundleQty).fill(newVariations[0]));
          setConnectionStatus('success');
        } else {
          setConnectionStatus('failed');
        }
      } catch (error) {
        setConnectionStatus('failed');
      }
    };

    fetchWPData();
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleBundleChange = (bundle: any) => {
    setSelectedBundle(bundle);
    setSelections(Array(bundle.bundleQty).fill(productData.variations[0]));
  };

  const handleAddToCart = () => {
    const variantDesc = selections.map((s: any) => s?.name || "Modèle").join(' + ');
    setCart([...cart, {
      cartId: Date.now().toString(),
      name: productData.name,
      variantName: variantDesc,
      price: selectedBundle.price,
      image: selections[0]?.image || "",
      qty: 1
    }]);
    setIsCartOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#FDFCFB] text-stone-900 font-light overflow-x-hidden">
      <style>{`
        @keyframes float { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-15px); } }
        .animate-luxury-float { animation: float 6s ease-in-out infinite; }
        .font-luxury-serif { font-family: ui-serif, Georgia, Cambria, "Times New Roman", serif; }
      `}</style>

      {/* HEADER */}
      <header className={`fixed top-0 w-full z-50 transition-all duration-700 ${scrolled ? 'bg-stone-100/95 backdrop-blur-xl py-4 border-b border-stone-200' : 'bg-transparent py-8'}`}>
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-4 cursor-pointer" onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>
            <Circle className="w-6 h-6 text-emerald-900 opacity-60" />
            <span className="text-xl font-semibold tracking-[0.3em] uppercase hidden sm:block">Somnora</span>
          </div>

          <div className="flex items-center gap-4">
            <div className={`hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full text-[9px] font-bold uppercase tracking-widest border transition-colors ${
              connectionStatus === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 
              connectionStatus === 'failed' ? 'bg-orange-50 border-orange-200 text-orange-700' : 
              'bg-stone-50 border-stone-200 text-stone-400'
            }`}>
              {connectionStatus === 'success' ? <><Wifi className="w-3 h-3" /> Live o2switch</> : 
               connectionStatus === 'failed' ? <><AlertTriangle className="w-3 h-3" /> Mode Secours (SSL)</> : 
               'Connexion...'}
            </div>
            
            <button onClick={() => setIsCartOpen(true)} className="relative p-2">
              <ShoppingCart className="w-6 h-6 text-stone-800" strokeWidth={1.2} />
              {cart.length > 0 && <span className="absolute top-1 right-0 bg-stone-950 text-white text-[9px] w-4 h-4 flex items-center justify-center rounded-full font-bold shadow-lg">{cart.length}</span>}
            </button>
          </div>
        </div>
      </header>

      <main>
        {/* HERO */}
        <section className="relative min-h-screen flex items-center px-6 max-w-7xl mx-auto pt-24 text-center lg:text-left">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 w-full items-center">
            <div className="lg:col-span-6 z-10">
              <h1 className="text-6xl md:text-8xl font-luxury-serif italic mb-10 leading-[0.95] tracking-tighter animate-luxury-float text-stone-950">
                La science <span className="not-italic block lg:inline">Du Calme.</span>
              </h1>
              <p className="text-lg text-stone-700 mb-12 italic max-w-md mx-auto lg:mx-0">{productData.shortDesc}</p>
              <button onClick={() => document.getElementById('achat')?.scrollIntoView({behavior: 'smooth'})} className="bg-stone-950 text-white px-14 py-6 rounded-full text-xs font-bold uppercase tracking-[0.2em] shadow-xl hover:bg-emerald-950 transition-colors">Découvrir l'offre</button>
            </div>
            <div className="lg:col-span-6">
              <div className="rounded-[60px] overflow-hidden aspect-[4/5] shadow-2xl border border-stone-100">
                <img src="https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?auto=format&fit=crop&q=80&w=1200" alt="Somnora Atmosphere" className="w-full h-full object-cover" />
              </div>
            </div>
          </div>
        </section>

        {/* ACHAT */}
        <section id="achat" className="py-24 md:py-40 px-6 max-w-7xl mx-auto scroll-mt-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
            <div className="lg:col-span-6 hidden lg:block">
              <div className="sticky top-40 bg-white p-8 rounded-[60px] shadow-xl border border-stone-200 aspect-square flex items-center justify-center">
                <Diaporama variations={productData.variations} activeVariationId={selections[0]?.id} className="w-full h-full" innerClassName="rounded-[40px]" />
              </div>
            </div>
            <div className="lg:col-span-6">
              <h2 className="text-4xl md:text-5xl font-luxury-serif italic mb-12 text-stone-950">Adopter Somnora.</h2>
              <div className="space-y-12">
                <div className="space-y-4">
                  {productData.bundles.map((b: any) => (
                    <button key={b.id} onClick={() => handleBundleChange(b)} className={`w-full p-6 rounded-3xl border-2 transition-all flex justify-between items-center ${selectedBundle.id === b.id ? 'border-emerald-800 bg-emerald-50/20' : 'border-stone-100 bg-white hover:border-stone-200 shadow-sm'}`}>
                      <div className="text-left"><p className="font-bold uppercase tracking-widest text-sm">{b.label}</p><p className="text-xs text-stone-400 italic">{b.bundleQty} unité(s)</p></div>
                      <p className="text-lg font-bold">{b.price.toFixed(2)} €</p>
                    </button>
                  ))}
                </div>

                <div className="space-y-6">
                  {selections.length > 0 && selections.map((_, idx) => (
                    <div key={idx} className="bg-stone-50 p-6 rounded-3xl border border-stone-100 text-center md:text-left">
                      <p className="text-[10px] font-bold uppercase mb-4 opacity-40 tracking-widest italic">Modèle n°{idx+1}</p>
                      <div className="flex gap-4 justify-center md:justify-start">
                        {productData.variations.map((v: any) => (
                          <button key={v.id} onClick={() => { const s = [...selections]; s[idx] = v; setSelections(s); }} className={`w-14 h-14 rounded-full border-2 p-1 transition-all ${selections[idx]?.id === v.id ? 'border-emerald-800 scale-110 shadow-md bg-white' : 'border-transparent opacity-40 hover:opacity-100'}`}>
                            <img src={v.image} className="w-full h-full rounded-full object-cover" alt={v.name} />
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                <button onClick={handleAddToCart} className="w-full bg-stone-950 text-white py-8 rounded-full font-bold uppercase tracking-[0.3em] hover:bg-emerald-950 shadow-2xl active:scale-95 transition-all">
                  Ajouter au panier
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-stone-950 text-white py-24 px-10 text-center border-t border-white/5">
        <span className="text-3xl font-medium tracking-[0.5em] uppercase block mb-8">Somnora</span>
        <p className="text-[9px] text-stone-600 uppercase tracking-[0.4em]">© {new Date().getFullYear()} — Maison de Repos Somnora — L'Art du Sommeil</p>
      </footer>

      {/* PANIER */}
      {isCartOpen && (
        <>
          <div className="fixed inset-0 bg-stone-950/20 backdrop-blur-sm z-[60]" onClick={() => setIsCartOpen(false)}></div>
          <div className="fixed top-0 right-0 h-full w-full sm:w-[400px] bg-white z-[70] p-8 shadow-2xl flex flex-col animate-in slide-in-from-right duration-500">
            <div className="flex justify-between items-center mb-8"><h2 className="font-bold uppercase text-xs tracking-widest text-stone-950">Votre Panier</h2><button onClick={() => setIsCartOpen(false)}><X className="w-6 h-6 text-stone-400" /></button></div>
            <div className="flex-1 overflow-y-auto space-y-6">
              {cart.map((item, i) => (
                <div key={i} className="flex gap-4 items-center animate-in fade-in slide-in-from-bottom-2">
                  <img src={item.image} className="w-16 h-16 rounded-xl object-cover border border-stone-100" alt="" />
                  <div className="flex-1"><p className="text-[10px] font-bold uppercase">{item.name}</p><p className="text-[9px] text-stone-400 uppercase">{item.variantName}</p><p className="font-bold text-sm mt-1">{item.price.toFixed(2)} €</p></div>
                </div>
              ))}
              {cart.length === 0 && <p className="text-center italic text-stone-400 py-10 font-luxury-serif">Le panier est vide</p>}
            </div>
            {cart.length > 0 && (
              <div className="pt-8 border-t border-stone-100">
                <div className="flex justify-between mb-8 text-xl font-light"><span>Total</span><span>{cart.reduce((t, i) => t + i.price, 0).toFixed(2)} €</span></div>
                <button className="w-full bg-stone-950 text-white py-6 rounded-full font-bold uppercase text-[10px] tracking-widest shadow-lg">Passer la commande</button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
