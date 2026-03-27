"use client";

import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, Wind, Volume2, Star, ArrowRight, Sun, Music,
  Menu, ShoppingCart, Circle, X, Trash2, Plus, Minus,
  ChevronLeft, ChevronRight, Wifi, WifiOff, AlertTriangle, Check
} from 'lucide-react';

// --- CONFIGURATION DE L'IMAGE D'ACCUEIL (HERO) ---
// Si votre image est dans le dossier 'public', mettez juste "/nom-de-votre-image.jpg"
const HERO_IMAGE = "/reunis.jpg";

// --- DONNÉES DE SECOURS ---
const INITIAL_MOCK = {
  name: "Le Compagnon Respirant Somnora",
  tagline: "Synchronisation haptique et sensorielle.",
  shortDesc: "Un système intuitif conçu pour réguler votre respiration par mimétisme. Capteurs intégrés, cycles lumineux et ambiances sonores naturelles.",
  basePrice: 39.90,
  dimensions: "30 x 20 x 15 cm",
  material: "Coton PP Haute Qualité & Soft Plush",
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

// --- COMPOSANT DIAPORAMA ---
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
              className={`absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out ${i === current ? 'opacity-100 z-10 scale-100' : 'opacity-0 z-0 scale-110'}`} 
            />
         ))}
         <div className="absolute top-4 left-4 md:top-6 md:left-6 z-20 bg-white/90 backdrop-blur-md px-3 py-1.5 md:px-4 md:py-2 rounded-full shadow-sm border border-white/20">
            <span className="text-[9px] md:text-[10px] font-bold uppercase tracking-widest text-stone-800">{variations[current]?.name}</span>
         </div>
       </div>
       <button onClick={prev} className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center text-stone-800 opacity-0 group-hover:opacity-100 transition-all z-20 shadow-xl hover:bg-white active:scale-90"><ChevronLeft className="w-5 h-5 md:w-6 md:h-6" /></button>
       <button onClick={next} className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center text-stone-800 opacity-0 group-hover:opacity-100 transition-all z-20 shadow-xl hover:bg-white active:scale-90"><ChevronRight className="w-5 h-5 md:w-6 md:h-6" /></button>
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
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cart, setCart] = useState<any[]>([]);
  const [activePage, setActivePage] = useState('home');

  useEffect(() => {
    setSelections(Array(INITIAL_MOCK.bundles[1].bundleQty).fill(INITIAL_MOCK.variations[0]));
  }, []);

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
        } else { setConnectionStatus('failed'); }
      } catch (error) { setConnectionStatus('failed'); }
    };
    fetchWPData();
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    setIsMenuOpen(false);
    setActivePage('home');
    setTimeout(() => {
      const element = document.getElementById(id);
      if (element) window.scrollTo({ top: element.getBoundingClientRect().top + window.pageYOffset - 100, behavior: 'smooth' });
    }, 100);
  };

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
      originalPrice: productData.basePrice * selectedBundle.bundleQty,
      image: selections[0]?.image || "",
      qty: 1
    }]);
    setIsCartOpen(true);
  };

  const cartTotal = cart.reduce((total, item) => total + (item.price * item.qty), 0);
  const cartSavings = cart.reduce((total, item) => total + ((item.originalPrice - item.price) * item.qty), 0);

  const renderLegalContent = () => {
    const content: any = {
      privacy: {
        title: "Politique de Confidentialité (RGPD)",
        sections: [
          { t: "1. Collecte des données", c: "Nous collectons les données strictement nécessaires au traitement de vos commandes (nom, adresse, email, paiement). Vos données sont cryptées lors de la transmission." },
          { t: "2. Utilisation et Partage", c: "Vos données sont utilisées exclusivement pour l'expédition. Elles ne sont jamais revendues ou partagées avec des tiers publicitaires." },
          { t: "3. Vos Droits", c: "Vous disposez d'un droit d'accès, de rectification et de suppression de vos données en contactant : contact@somnora.fr" }
        ]
      },
      cgv: {
        title: "Conditions Générales de Vente",
        sections: [
          { t: "1. Prix et Paiement", c: "Les prix sont affichés en Euros TTC. La livraison est offerte. Les paiements sont sécurisés par Stripe ou PayPal." },
          { t: "2. Livraison", c: "Les commandes sont expédiées sous 48h. Les délais de livraison varient de 5 à 10 jours ouvrés selon la destination." },
          { t: "3. Garantie 30 Nuits", c: "Essayez Somnora pendant 30 nuits. Si vous n'êtes pas satisfait, nous vous remboursons intégralement l'article retourné." }
        ]
      },
      legal: {
        title: "Mentions Légales",
        sections: [
          { t: "1. Éditeur", c: "Le site Somnora est édité par Somnora France. SIRET en cours d'attribution." },
          { t: "2. Hébergement", c: "Hébergé par o2switch, 222-224 Boulevard Gustave Flaubert, 63000 Clermont-Ferrand." },
          { t: "3. Propriété", c: "Toute reproduction du design ou du contenu du site est interdite sans accord préalable." }
        ]
      }
    };
    const p = content[activePage];
    return p ? (
      <div className="max-w-3xl mx-auto py-12 md:py-20 px-6 animate-in fade-in duration-1000 text-stone-700">
        <button onClick={() => setActivePage('home')} className="mb-12 flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-stone-400 hover:text-stone-900 transition-colors"><ChevronLeft className="w-4 h-4" /> Retour boutique</button>
        <h1 className="text-4xl md:text-6xl font-luxury-serif italic mb-12 text-stone-950 leading-tight">{p.title}</h1>
        {p.sections.map((s: any, i: number) => (
          <div key={i} className="mb-10 group">
            <h2 className="font-bold uppercase text-[10px] md:text-xs mb-3 md:mb-4 tracking-[0.2em] text-stone-900 border-l-2 border-emerald-800 pl-4">{s.t}</h2>
            <p className="leading-relaxed text-base md:text-lg font-medium opacity-80">{s.c}</p>
          </div>
        ))}
      </div>
    ) : null;
  };

  return (
    <div className="min-h-screen bg-[#FDFCFB] text-stone-900 font-light overflow-x-hidden">
      <style>{`
        @keyframes float { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-15px); } }
        .animate-luxury-float { animation: float 8s ease-in-out infinite; }
        .font-luxury-serif { font-family: ui-serif, Georgia, Cambria, "Times New Roman", serif; }
      `}</style>

      {/* MENU MOBILE */}
      <div className={`fixed inset-0 bg-[#FDFCFB] z-[100] transition-all duration-1000 flex flex-col ${isMenuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-full pointer-events-none'}`}>
        <div className="p-8 flex justify-end"><button onClick={() => setIsMenuOpen(false)}><X className="w-8 h-8 text-stone-400 hover:text-stone-950 transition-colors" /></button></div>
        <div className="flex-1 flex flex-col items-center justify-center gap-8 md:gap-10 text-2xl md:text-3xl font-luxury-serif italic text-center">
          <button onClick={() => scrollToSection('science')} className="hover:text-emerald-800 transition-colors">La Technologie</button>
          <button onClick={() => scrollToSection('details')} className="hover:text-emerald-800 transition-colors">Fiche Technique</button>
          <button onClick={() => scrollToSection('achat')} className="hover:text-emerald-800 transition-colors">Commander</button>
        </div>
      </div>

      {/* HEADER */}
      <header className={`fixed top-0 w-full z-50 transition-all duration-700 ${scrolled ? 'bg-stone-100/90 backdrop-blur-xl py-3 md:py-4 border-b border-stone-200 shadow-sm' : 'bg-transparent py-6 md:py-10'}`}>
        <div className="max-w-6xl mx-auto px-6 md:px-10 flex items-center justify-between">
          <div className="flex items-center gap-3 md:gap-4 cursor-pointer group" onClick={() => {setActivePage('home'); window.scrollTo({top: 0, behavior: 'smooth'});}}>
            <Circle className="w-5 h-5 md:w-6 md:h-6 text-emerald-900 opacity-60 group-hover:rotate-90 transition-transform duration-1000" />
            <span className="text-lg md:text-xl font-semibold tracking-[0.3em] md:tracking-[0.4em] uppercase hidden sm:block">Somnora</span>
          </div>

          <nav className="hidden lg:flex items-center gap-8 xl:gap-12 text-[10px] font-bold uppercase tracking-[0.3em] text-stone-500">
            <button onClick={() => scrollToSection('science')} className="hover:text-stone-950 transition-colors">La Technologie</button>
            <button onClick={() => scrollToSection('details')} className="hover:text-stone-950 transition-colors">Fiche Technique</button>
            <button onClick={() => scrollToSection('achat')} className="hover:text-stone-950 transition-colors">Commander</button>
          </nav>

          <div className="flex items-center gap-4 md:gap-6">
            <div className={`hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full text-[8px] font-bold uppercase tracking-widest border transition-all ${
              connectionStatus === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 
              connectionStatus === 'failed' ? 'bg-orange-50 border-orange-200 text-orange-700' : 'bg-stone-100 border-stone-200 text-stone-400'
            }`}>
              {connectionStatus === 'success' ? <><Wifi className="w-2.5 h-2.5" /> Live o2switch</> : 
               connectionStatus === 'failed' ? <><AlertTriangle className="w-2.5 h-2.5" /> Mode Secours (SSL)</> : 'Connexion...'}
            </div>
            <button onClick={() => setIsCartOpen(true)} className="relative p-2 group">
              <ShoppingCart className="w-5 h-5 md:w-6 md:h-6 text-stone-800 group-hover:scale-110 transition-transform" strokeWidth={1.2} />
              {cart.length > 0 && <span className="absolute top-1 right-0 bg-stone-950 text-white text-[9px] w-4 h-4 flex items-center justify-center rounded-full font-bold shadow-xl">{cart.reduce((t, i) => t + i.qty, 0)}</span>}
            </button>
            <button onClick={() => setIsMenuOpen(true)} className="lg:hidden p-2"><Menu className="w-6 h-6 md:w-7 md:h-7 text-stone-800" /></button>
          </div>
        </div>
      </header>

      <main>
        {activePage === 'home' ? (
          <>
            {/* HERO SECTION */}
            <section className="relative min-h-screen flex items-center px-6 md:px-10 max-w-6xl mx-auto pt-24 md:pt-32 text-center lg:text-left">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 xl:gap-16 w-full items-center">
                <div className="lg:col-span-7 xl:col-span-6 z-10">
                  <div className="mb-6 md:mb-8 inline-flex items-center gap-4 text-[9px] md:text-[10px] font-bold tracking-[0.4em] uppercase text-emerald-900 opacity-60">
                    <span className="w-8 md:w-12 h-[1px] bg-emerald-900"></span> L'Expérience Sensorielle
                  </div>
                  <h1 className="text-5xl sm:text-6xl md:text-7xl xl:text-8xl font-luxury-serif italic mb-8 md:mb-12 leading-[1] tracking-tight animate-luxury-float text-stone-950">
                    La science <br/><span className="not-italic lg:ml-12 xl:ml-20">Du Calme.</span>
                  </h1>
                  <p className="text-lg md:text-xl text-stone-700 mb-10 md:mb-16 leading-relaxed max-w-md italic mx-auto lg:mx-0 font-medium">
                    {productData.shortDesc}
                  </p>
                  <div className="flex flex-col sm:flex-row items-center gap-6 md:gap-8 justify-center lg:justify-start">
                    <button onClick={() => scrollToSection('achat')} className="bg-stone-950 text-white px-12 md:px-16 py-5 md:py-7 rounded-full text-[10px] font-bold uppercase tracking-[0.3em] shadow-2xl hover:bg-emerald-950 transition-all active:scale-95">Découvrir l'offre</button>
                    <div className="flex items-center gap-3 text-[9px] md:text-[10px] font-bold uppercase tracking-widest opacity-40 italic"><Star className="w-3 h-3 md:w-4 md:h-4 fill-emerald-800 text-emerald-800" /> Noté 4.9/5 par nos clients</div>
                  </div>
                </div>
                <div className="lg:col-span-5 xl:col-span-6 relative group px-4 lg:px-0">
                  <div className="rounded-[40px] md:rounded-[80px] overflow-hidden aspect-[4/5] shadow-2xl border border-stone-100 relative">
                    <img src={HERO_IMAGE} alt="Somnora Atmosphere" className="w-full h-full object-cover grayscale-[0.1] group-hover:scale-105 transition-transform duration-[3s]" />
                    <div className="absolute inset-0 bg-gradient-to-t from-stone-950/20 to-transparent"></div>
                  </div>
                </div>
              </div>
            </section>

            {/* SECTION TECHNOLOGIE */}
            <section id="science" className="bg-stone-50 py-24 md:py-40 scroll-mt-20 border-y border-stone-100">
              <div className="max-w-6xl mx-auto px-6 md:px-10">
                <div className="text-center max-w-3xl mx-auto mb-20 md:mb-32">
                  <h2 className="text-4xl md:text-6xl font-luxury-serif italic mb-8 tracking-tight leading-tight">Une technologie <br/>de pointe.</h2>
                  <p className="text-[10px] md:text-[11px] text-stone-700 font-bold uppercase tracking-[0.3em] md:tracking-[0.4em] opacity-50">Au-delà de la peluche, un outil de régulation.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-16">
                  {[
                    { title: "Rythme Sensoriel", icon: Wind, desc: "Des capteurs de précision imitent un cycle respiratoire apaisant, guidant votre propre rythme vers la détente absolue." },
                    { title: "Acoustique Naturelle", icon: Music, desc: "Intègre des fréquences de bruits roses et des ambiances sonores certifiées pour réduire le cortisol nocturne." },
                    { title: "Cycle Lumineux", icon: Sun, desc: "Une luminescence LED douce à 2700K qui simule le crépuscule pour stimuler naturellement la mélatonine." }
                  ].map((item, i) => (
                    <div key={i} className="group text-center">
                      <div className="w-16 h-16 md:w-20 md:h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-8 md:mb-10 shadow-xl border border-stone-100 group-hover:scale-110 transition-transform duration-700">
                        <item.icon className="w-7 h-7 md:w-8 md:h-8 text-emerald-900" strokeWidth={1} />
                      </div>
                      <h3 className="text-base md:text-lg font-bold uppercase tracking-[0.2em] mb-4 md:mb-6">{item.title}</h3>
                      <p className="text-stone-500 text-sm leading-relaxed font-medium px-4">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* SECTION ACHAT */}
            <section id="achat" className="py-24 md:py-40 px-6 max-w-6xl mx-auto scroll-mt-20">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 xl:gap-24">
                <div className="lg:col-span-5 xl:col-span-6 hidden lg:block">
                  <div className="sticky top-32 bg-white p-6 md:p-8 rounded-[40px] md:rounded-[60px] shadow-2xl border border-stone-100 aspect-square overflow-hidden">
                    <Diaporama variations={productData.variations} activeVariationId={selections[0]?.id} className="w-full h-full" innerClassName="rounded-[30px] md:rounded-[40px]" />
                  </div>
                </div>
                <div className="lg:col-span-7 xl:col-span-6">
                  <h2 className="text-4xl md:text-5xl font-luxury-serif italic mb-12 text-stone-950 leading-tight">Adopter Somnora.</h2>
                  <div className="space-y-16">
                    <div>
                      <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-stone-400 mb-8 border-b border-stone-100 pb-3 italic">1. Sélectionnez votre offre</h4>
                      <div className="space-y-4">
                        {productData.bundles.map((b: any) => {
                          const originalPrice = INITIAL_MOCK.basePrice * b.bundleQty;
                          const discountPercent = b.bundleQty > 1 ? Math.round(((originalPrice - b.price) / originalPrice) * 100) : 0;
                          
                          return (
                            <button key={b.id} onClick={() => handleBundleChange(b)} className={`w-full p-6 md:p-8 rounded-[24px] md:rounded-[32px] border-2 transition-all flex justify-between items-center group relative ${selectedBundle.id === b.id ? 'border-emerald-800 bg-emerald-50/20 shadow-lg' : 'border-stone-100 bg-white hover:border-stone-200'}`}>
                              {b.popular && <span className="absolute -top-3 left-6 bg-emerald-800 text-white text-[8px] font-bold uppercase px-3 py-1 rounded-full tracking-widest shadow-lg">Populaire</span>}
                              <div className="text-left">
                                <p className="font-bold uppercase tracking-widest text-xs md:text-sm mb-1">{b.label}</p>
                                <p className="text-[9px] md:text-[10px] text-stone-400 italic">{b.bundleQty} Compagnon{b.bundleQty > 1 ? 's' : ''}</p>
                              </div>
                              <div className="text-right">
                                <p className="text-lg md:text-xl font-bold">{b.price.toFixed(2)} €</p>
                                {discountPercent > 0 && (
                                  <div className="mt-1 flex items-center justify-end gap-2">
                                     <span className="text-[8px] md:text-[9px] text-emerald-700 font-bold uppercase bg-emerald-100 px-2 py-0.5 rounded-full">-{discountPercent}%</span>
                                     <span className="text-[8px] text-stone-400 line-through">{originalPrice.toFixed(0)}€</span>
                                  </div>
                                )}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div>
                      <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-stone-400 mb-8 border-b border-stone-100 pb-3 italic">2. Personnalisez vos modèles</h4>
                      <div className="space-y-6 md:space-y-8">
                        {selections.length > 0 && selections.map((_, idx) => (
                          <div key={idx} className="bg-stone-50 p-6 md:p-8 rounded-[30px] md:rounded-[40px] border border-stone-100 relative">
                            <p className="text-[9px] md:text-[10px] font-bold uppercase mb-6 opacity-40 tracking-[0.2em] italic text-center md:text-left">Compagnon n°{idx+1}</p>
                            <div className="flex gap-4 md:gap-6 justify-center md:justify-start flex-wrap">
                              {productData.variations.map((v: any) => (
                                <button key={v.id} onClick={() => { const s = [...selections]; s[idx] = v; setSelections(s); }} className="group relative">
                                  <div className={`w-14 h-14 md:w-16 md:h-16 rounded-full border-2 p-1.5 transition-all duration-700 ${selections[idx]?.id === v.id ? 'border-emerald-800 scale-110 shadow-xl bg-white' : 'border-transparent opacity-30 hover:opacity-100 hover:scale-105'}`}>
                                    <img src={v.image} className="w-full h-full rounded-full object-cover" alt="" />
                                  </div>
                                  <span className={`block text-[8px] font-bold uppercase tracking-tighter mt-2 text-center transition-opacity duration-700 ${selections[idx]?.id === v.id ? 'opacity-100 text-stone-900' : 'opacity-0'}`}>{v.name.split(' ')[1] || v.name}</span>
                                </button>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="pt-12 border-t border-stone-200">
                      <div className="flex flex-col sm:flex-row justify-between items-center gap-6 mb-10">
                        <span className="text-4xl md:text-5xl font-light text-stone-950">{selectedBundle.price.toFixed(2)} €</span>
                        <div className="text-[9px] md:text-[10px] font-bold text-emerald-800 bg-emerald-50 px-5 py-2.5 rounded-full uppercase tracking-[0.2em] shadow-sm">Livraison Gratuite Incluse</div>
                      </div>
                      <button onClick={handleAddToCart} className="w-full bg-stone-950 text-white py-6 md:py-8 rounded-full font-bold uppercase tracking-[0.3em] text-xs hover:bg-emerald-950 shadow-2xl active:scale-95 transition-all mb-10 flex items-center justify-center gap-4">
                        Ajouter au panier <ArrowRight className="w-4 h-4" />
                      </button>
                      <div className="flex items-center justify-center gap-6 md:gap-8 opacity-60">
                        <div className="flex items-center gap-2 text-[9px] font-bold uppercase tracking-widest"><ShieldCheck className="w-4 h-4 text-emerald-800" /> Garantie 30 Nuits</div>
                        <div className="flex items-center gap-2 text-[9px] font-bold uppercase tracking-widest"><Check className="w-4 h-4 text-emerald-800" /> Paiement Sécurisé</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* FICHE TECHNIQUE */}
            <section id="details" className="py-24 md:py-40 bg-stone-50 border-t border-stone-100 scroll-mt-20">
              <div className="max-w-6xl mx-auto px-6 md:px-10 text-center md:text-left">
                <h2 className="text-3xl md:text-4xl font-luxury-serif mb-16 md:mb-24 italic text-stone-950">Détails de confection.</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 md:gap-8 xl:gap-12">
                  {[
                    { label: "Dimensions", value: productData.dimensions, sub: "Taille ergonomique" },
                    { label: "Matériaux", value: "Coton PP Hypoallergénique", sub: "Toucher ultra-soft" },
                    { label: "Alimentation", value: "3 piles AAA", sub: "Sûreté certifiée" },
                    { label: "Entretien", value: "Machine à 30°C", sub: "Déhoussable" }
                  ].map((d, i) => (
                    <div key={i} className="space-y-4 md:border-l border-stone-200 md:pl-8">
                      <h4 className="text-[9px] md:text-[10px] font-bold uppercase tracking-[0.3em] text-stone-400">{d.label}</h4>
                      <p className="text-lg md:text-xl font-semibold text-stone-900">{d.value}</p>
                      <p className="text-[8px] md:text-[9px] font-bold uppercase tracking-widest text-emerald-800 opacity-60 italic">{d.sub}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </>
        ) : (
          <section className="min-h-screen pt-40 pb-24 px-6 md:px-10 max-w-5xl mx-auto">
            {renderLegalContent()}
          </section>
        )}
      </main>

      {/* FOOTER */}
      <footer className="bg-stone-950 text-white pt-32 md:pt-40 pb-16 md:pb-20 px-10 text-center border-t border-white/5 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] md:w-[800px] h-[200px] md:h-[300px] bg-emerald-900/10 blur-[120px] rounded-full"></div>
        <div className="max-w-6xl mx-auto flex flex-col items-center gap-16 md:gap-24 relative z-10">
          <div className="flex items-center gap-4 md:gap-6 cursor-pointer" onClick={() => { setActivePage('home'); window.scrollTo({top: 0, behavior: 'smooth'}); }}>
             <Circle className="w-10 h-10 md:w-12 md:h-12 text-emerald-500 opacity-40 animate-pulse" strokeWidth={0.5} />
             <span className="text-2xl md:text-4xl font-medium tracking-[0.4em] md:tracking-[0.6em] uppercase">Somnora</span>
          </div>
          <div className="flex flex-col md:flex-row gap-10 md:gap-16 text-[9px] md:text-[10px] font-bold uppercase tracking-[0.3em] md:tracking-[0.4em] text-stone-500">
            <button onClick={() => {setActivePage('legal'); window.scrollTo(0,0);}} className="hover:text-white transition-colors">Mentions Légales</button>
            <button onClick={() => {setActivePage('cgv'); window.scrollTo(0,0);}} className="hover:text-white transition-colors">CGV & Retours</button>
            <button onClick={() => {setActivePage('privacy'); window.scrollTo(0,0);}} className="hover:text-white transition-colors">Confidentialité</button>
          </div>
          <div className="w-full max-w-3xl border-t border-white/5 pt-16 md:pt-20">
            <p className="text-[9px] text-stone-600 uppercase tracking-[0.5em] mb-4 italic px-4">Somnora Maison de Repos — L'Art du Sommeil Sensoriel</p>
            <p className="text-[8px] text-stone-700 uppercase tracking-[0.3em]">© {new Date().getFullYear()} Somnora France — Tous droits réservés</p>
          </div>
        </div>
      </footer>

      {/* PANIER */}
      {isCartOpen && (
        <>
          <div className="fixed inset-0 bg-stone-950/40 backdrop-blur-md z-[110] transition-all" onClick={() => setIsCartOpen(false)}></div>
          <div className="fixed top-0 right-0 h-full w-full sm:w-[460px] md:w-[500px] bg-[#FDFCFB] z-[120] p-8 md:p-10 shadow-[0_0_100px_rgba(0,0,0,0.5)] flex flex-col animate-in slide-in-from-right duration-700">
            <div className="flex justify-between items-center mb-12 md:mb-16">
              <h2 className="text-[10px] md:text-xs font-bold uppercase tracking-[0.5em] text-stone-400">Votre Sélection</h2>
              <button onClick={() => setIsCartOpen(false)} className="p-2 hover:rotate-90 transition-transform duration-500"><X className="w-5 h-5 md:w-6 md:h-6 text-stone-400" /></button>
            </div>
            <div className="flex-1 overflow-y-auto space-y-10 md:space-y-12 pr-2 custom-scrollbar">
              {cart.map((item, i) => (
                <div key={i} className="flex gap-6 md:gap-8 items-center group animate-in fade-in slide-in-from-bottom-4 duration-700">
                  <div className="w-20 h-20 md:w-24 md:h-24 rounded-[20px] md:rounded-[24px] overflow-hidden border border-stone-100 shrink-0 shadow-lg group-hover:scale-105 transition-transform duration-700">
                    <img src={item.image} className="w-full h-full object-cover" alt="" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between mb-2">
                       <p className="text-[9px] md:text-[10px] font-bold uppercase tracking-widest text-stone-900 truncate pr-4">{item.name}</p>
                       <button onClick={() => setCart(cart.filter((_, idx) => idx !== i))} className="opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 className="w-4 h-4 text-stone-300 hover:text-rose-500" /></button>
                    </div>
                    <p className="text-[8px] md:text-[9px] text-stone-400 uppercase tracking-widest mb-4 italic truncate">{item.variantName}</p>
                    <div className="flex justify-between items-center">
                       <p className="font-bold text-sm">{item.price.toFixed(2)} €</p>
                    </div>
                  </div>
                </div>
              ))}
              {cart.length === 0 && <div className="h-full flex flex-col items-center justify-center text-center opacity-30"><ShoppingCart className="w-12 h-12 md:w-16 md:h-16 mb-6" strokeWidth={0.5} /><p className="font-luxury-serif italic text-xl md:text-2xl">Le panier est vide.</p></div>}
            </div>
            {cart.length > 0 && (
              <div className="pt-10 md:pt-12 border-t border-stone-100">
                {cartSavings > 0 && <div className="flex justify-between mb-4 text-[9px] md:text-[10px] font-bold uppercase text-emerald-800 tracking-widest italic"><span>Économie réalisée</span><span>-{cartSavings.toFixed(2)} €</span></div>}
                <div className="flex justify-between mb-10 md:mb-12 items-baseline">
                   <span className="text-xs md:text-sm font-bold uppercase tracking-[0.3em] text-stone-400">Total</span>
                   <span className="text-3xl md:text-4xl font-light text-stone-950">{cartTotal.toFixed(2)} €</span>
                </div>
                <button className="w-full bg-stone-950 text-white py-6 md:py-8 rounded-full font-bold uppercase text-[10px] tracking-[0.4em] shadow-2xl hover:bg-emerald-950 active:scale-95 transition-all">Poursuivre le règlement</button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
