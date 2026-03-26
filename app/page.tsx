"use client";
import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, Wind,
  Volume2, Star, ArrowRight, Sun, Music,
  Menu, ShoppingCart, Circle, X, Trash2, Plus, Minus,
  ChevronLeft, ChevronRight
} from 'lucide-react';

/* NOTE TECHNIQUE : 
  Les métadonnées SEO ont été retirées du rendu car elles doivent être 
  placées dans le fichier layout.tsx pour Next.js (App Router).
*/

const mockProduct = {
  name: "Le Compagnon Respirant Somnora",
  tagline: "Synchronisation haptique et sensorielle.",
  shortDesc: "Un système intuitif conçu pour réguler votre respiration par mimétisme. Capteurs intégrés, cycles lumineux et ambiances sonores naturelles.",
  basePrice: 39.90,
  priceStr: "39,90 €",
  dimensions: "30 x 20 x 15 cm",
  material: "Coton PP",
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

// Composant Diaporama Indépendant
const Diaporama = ({ variations, activeVariationId, className, innerClassName }) => {
  const [current, setCurrent] = useState(0);

  // Synchronise le diaporama avec le choix du client (Compagnon 1)
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
         {/* Label du modèle affiché */}
         <div className="absolute top-6 left-6 z-20 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm">
            <span className="text-[10px] font-bold uppercase tracking-widest text-stone-800">{variations[current].name}</span>
         </div>
       </div>
       
       {/* Flèches de navigation */}
       <button onClick={prev} className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center text-stone-800 opacity-0 group-hover:opacity-100 transition-all z-20 shadow-lg hover:bg-white hover:scale-105 active:scale-95">
         <ChevronLeft className="w-5 h-5" />
       </button>
       <button onClick={next} className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center text-stone-800 opacity-0 group-hover:opacity-100 transition-all z-20 shadow-lg hover:bg-white hover:scale-105 active:scale-95">
         <ChevronRight className="w-5 h-5" />
       </button>

       {/* Indicateurs (Dots) */}
       <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-3 z-20">
         {variations.map((_, i) => (
            <button 
              key={i} 
              onClick={() => setCurrent(i)}
              className={`h-1.5 rounded-full transition-all duration-300 shadow-sm ${i === current ? 'bg-white w-6 opacity-100' : 'bg-white/60 w-1.5 hover:bg-white'}`}
            />
         ))}
       </div>
    </div>
  );
};

export default function App() {
  // États de sélection
  const [selectedBundle, setSelectedBundle] = useState(mockProduct.bundles[1]); // Pack Duo par défaut
  const [selections, setSelections] = useState([mockProduct.variations[0], mockProduct.variations[0]]); // 2 Koalas Gris par défaut pour le Duo
  
  // États d'interface
  const [scrolled, setScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cart, setCart] = useState([]);
  const [activePage, setActivePage] = useState('home');

  // Gestion du scroll pour le header
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Blocage du défilement quand un menu est ouvert
  useEffect(() => {
    if (isMenuOpen || isCartOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'unset';
  }, [isMenuOpen, isCartOpen]);

  const scrollToSection = (id) => {
    setIsMenuOpen(false);
    if (activePage !== 'home') {
      setActivePage('home');
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) {
          const headerOffset = 100;
          const elementPosition = element.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
          window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
        }
      }, 100);
      return;
    }
    const element = document.getElementById(id);
    if (element) {
      const headerOffset = 100;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  // Met à jour le nombre de peluches à choisir en fonction du pack sélectionné
  const handleBundleChange = (bundle) => {
    setSelectedBundle(bundle);
    setSelections(prev => {
      const newSelections = [...prev];
      if (bundle.bundleQty > prev.length) {
        // Ajouter des choix par défaut si on passe à un plus grand pack
        for(let i = prev.length; i < bundle.bundleQty; i++) {
          newSelections.push(mockProduct.variations[0]);
        }
      } else if (bundle.bundleQty < prev.length) {
        // Réduire le tableau si on passe à un plus petit pack
        newSelections.length = bundle.bundleQty;
      }
      return newSelections;
    });
  };

  // Met à jour le modèle pour un emplacement (Compagnon 1, Compagnon 2...)
  const handleSelectionChange = (index, variation) => {
    setSelections(prev => {
      const newSelections = [...prev];
      newSelections[index] = variation;
      return newSelections;
    });
  };

  // Logique d'ajout au panier robuste
  const handleAddToCart = () => {
    const variantDesc = selections.map(s => s.value).join(' + '); // Ex: "Koala Gris + Snoopy"
    const existingItemIndex = cart.findIndex(item => item.bundleId === selectedBundle.id && item.variantName === variantDesc);

    if (existingItemIndex >= 0) {
      // Si ce pack exact (même modèles) existe, on augmente la quantité du pack
      const newCart = [...cart];
      newCart[existingItemIndex].qty += 1;
      setCart(newCart);
    } else {
      // Sinon, on ajoute une nouvelle ligne
      const newItem = {
        cartId: `${selectedBundle.id}-${Date.now()}`,
        bundleId: selectedBundle.id,
        name: mockProduct.name,
        variantName: variantDesc,
        image: selections[0].image, // On affiche la première image sélectionnée dans le panier
        bundleLabel: selectedBundle.label,
        qty: 1, // Quantité de PACKS ajoutés
        price: selectedBundle.price,
        originalPrice: mockProduct.basePrice * selectedBundle.bundleQty
      };
      setCart([...cart, newItem]);
    }
    setIsCartOpen(true);
  };

  const updateQuantity = (cartId, delta) => {
    setCart(cart.map(item => {
      if (item.cartId === cartId) {
        const newQuantity = Math.max(1, item.qty + delta);
        return { ...item, qty: newQuantity };
      }
      return item;
    }));
  };

  const removeFromCart = (cartId) => {
    setCart(cart.filter(item => item.cartId !== cartId));
  };

  // Calcul des totaux
  const cartTotal = cart.reduce((total, item) => total + (item.price * item.qty), 0);
  const cartSavings = cart.reduce((total, item) => total + ((item.originalPrice - item.price) * item.qty), 0);

  // Composant pour les pages légales
  const renderLegalContent = () => {
    if (activePage === 'privacy') {
      return (
        <div className="max-w-3xl mx-auto space-y-8 text-stone-700 animate-in fade-in duration-700">
          <h1 className="text-4xl md:text-5xl font-luxury-serif italic text-stone-950 mb-12">Politique de Confidentialité (RGPD)</h1>
          <section className="space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-widest text-stone-900">1. Collecte des données</h2>
            <p className="leading-relaxed">Dans le cadre de votre visite et de vos achats sur Somnora, nous collectons les données strictement nécessaires au traitement de vos commandes (nom, adresse de livraison, adresse email, informations de paiement).</p>
          </section>
          <section className="space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-widest text-stone-900">2. Utilisation et Partage</h2>
            <p className="leading-relaxed">Vos données sont utilisées exclusivement par notre atelier pour l'expédition et le service client. Elles ne sont en aucun cas revendues à des tiers. Les paiements sont sécurisés par nos prestataires bancaires qui assurent le chiffrement de bout en bout.</p>
          </section>
          <section className="space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-widest text-stone-900">3. Vos Droits</h2>
            <p className="leading-relaxed">Conformément au Règlement Général sur la Protection des Données (RGPD), vous disposez d'un droit d'accès, de rectification et d'effacement de vos données personnelles. Vous pouvez exercer ce droit en contactant notre service client.</p>
          </section>
        </div>
      );
    }
    if (activePage === 'cgv') {
      return (
        <div className="max-w-3xl mx-auto space-y-8 text-stone-700 animate-in fade-in duration-700">
          <h1 className="text-4xl md:text-5xl font-luxury-serif italic text-stone-950 mb-12">Conditions Générales de Vente & Retours</h1>
          <section className="space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-widest text-stone-900">1. Objet et Prix</h2>
            <p className="leading-relaxed">Les présentes CGV régissent les ventes de la marque Somnora. Tous nos prix sont indiqués en Euros, toutes taxes comprises (TTC), hors frais de livraison éventuels.</p>
          </section>
          <section className="space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-widest text-stone-900">2. Expédition et Livraison</h2>
            <p className="leading-relaxed">La livraison est offerte. Les commandes sont traitées et expédiées sous 48h ouvrées. Les délais de livraison varient selon votre localisation et le transporteur sélectionné au moment de la commande.</p>
          </section>
          <section className="space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-widest text-stone-900">3. Garantie de Sérénité 30 Nuits</h2>
            <p className="leading-relaxed">Nous vous offrons 30 nuits pour tester votre Somnora. Si vous n'êtes pas pleinement satisfait de l'expérience, vous pouvez nous retourner l'article dans son état d'origine pour un remboursement complet. Les frais de retour peuvent s'appliquer.</p>
          </section>
        </div>
      );
    }
    if (activePage === 'legal') {
      return (
        <div className="max-w-3xl mx-auto space-y-8 text-stone-700 animate-in fade-in duration-700">
          <h1 className="text-4xl md:text-5xl font-luxury-serif italic text-stone-950 mb-12">Mentions Légales</h1>
          <section className="space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-widest text-stone-900">1. Éditeur du site</h2>
            <p className="leading-relaxed">Le site Somnora est édité par Somnora.<br/>Contact électronique : contact@somnora.fr</p>
          </section>
          <section className="space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-widest text-stone-900">2. Hébergement</h2>
            <p className="leading-relaxed">Ce site est hébergé par la société o2switch.<br/>Adresse : 222-224 Boulevard Gustave Flaubert, 63000 Clermont-Ferrand, France.</p>
          </section>
          <section className="space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-widest text-stone-900">3. Propriété Intellectuelle</h2>
            <p className="leading-relaxed">L'ensemble des éléments figurant sur ce site (textes, photographies, illustrations, logos, architecture) est protégé par les dispositions du Code de la Propriété Intellectuelle. Toute reproduction est strictement interdite sans notre accord.</p>
          </section>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-[#FDFCFB] text-stone-900 font-light selection:bg-emerald-100 selection:text-emerald-900 overflow-x-hidden">
      
      <style>{`
        @keyframes float { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-15px); } }
        .animate-luxury-float { animation: float 6s ease-in-out infinite; }
        .font-luxury-serif { font-family: ui-serif, Georgia, Cambria, "Times New Roman", Times, serif; }
      `}</style>

      {/* MENU MOBILE */}
      <div className={`fixed inset-0 bg-[#FDFCFB] z-[80] transition-all duration-700 flex flex-col ${isMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <div className="p-8 flex justify-end">
          <button onClick={() => setIsMenuOpen(false)}><X className="w-8 h-8 text-stone-400" /></button>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center gap-10 text-2xl font-luxury-serif italic text-center">
          <button onClick={() => scrollToSection('science')} className="hover:text-emerald-800 transition-colors">La Technologie</button>
          <button onClick={() => scrollToSection('details')} className="hover:text-emerald-800 transition-colors">Fiche Technique</button>
          <button onClick={() => scrollToSection('achat')} className="hover:text-emerald-800 transition-colors">Commander</button>
        </div>
      </div>

      {/* PANIER DRAWER */}
      <div className={`fixed inset-0 bg-stone-950/20 backdrop-blur-sm z-[60] transition-all duration-500 ${isCartOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={() => setIsCartOpen(false)}></div>
      <div className={`fixed top-0 right-0 h-full w-full sm:w-[480px] bg-[#FDFCFB] shadow-2xl z-[70] transform transition-transform duration-500 flex flex-col ${isCartOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="p-8 border-b border-stone-100 flex justify-between items-center">
          <h2 className="text-sm font-bold uppercase tracking-[0.3em]">Votre Panier</h2>
          <button onClick={() => setIsCartOpen(false)}><X className="w-6 h-6" /></button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-8 space-y-8">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center opacity-40">
              <ShoppingCart className="w-12 h-12 mb-4" strokeWidth={1} />
              <p className="font-luxury-serif italic text-xl">Le panier est vide</p>
            </div>
          ) : (
            cart.map((item) => (
              <div key={item.cartId} className="flex gap-6 items-center">
                <div className="w-20 h-20 rounded-2xl overflow-hidden border border-stone-100 shrink-0">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between">
                    <h4 className="text-xs font-bold uppercase">{item.bundleLabel}</h4>
                    <button onClick={() => removeFromCart(item.cartId)}><Trash2 className="w-4 h-4 text-stone-300 hover:text-rose-500 transition-colors" /></button>
                  </div>
                  <p className="text-[10px] text-stone-500 mt-1 uppercase tracking-widest">{item.variantName}</p>
                  <div className="flex justify-between items-end mt-4">
                    <div className="flex items-center gap-4 border border-stone-200 rounded-full px-3 py-1">
                      <button onClick={() => updateQuantity(item.cartId, -1)}><Minus className="w-3 h-3 text-stone-400 hover:text-stone-900" /></button>
                      <span className="text-xs font-bold w-4 text-center">{item.qty}</span>
                      <button onClick={() => updateQuantity(item.cartId, 1)}><Plus className="w-3 h-3 text-stone-400 hover:text-stone-900" /></button>
                    </div>
                    <div className="text-sm font-semibold">{(item.price * item.qty).toFixed(2).replace('.', ',')} €</div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
        
        {cart.length > 0 && (
          <div className="p-8 border-t border-stone-100 bg-white">
            {cartSavings > 0 && (
              <div className="mb-4 flex justify-between text-emerald-700 text-xs font-bold uppercase tracking-widest">
                <span>Économie réalisée</span>
                <span>-{cartSavings.toFixed(2).replace('.', ',')} €</span>
              </div>
            )}
            <div className="flex justify-between mb-8 text-2xl font-light">
              <span>Total</span>
              <span>{cartTotal.toFixed(2).replace('.', ',')} €</span>
            </div>
            <button className="w-full bg-stone-950 text-white py-6 rounded-full text-xs font-bold uppercase tracking-[0.3em] hover:bg-emerald-950 transition-all shadow-xl active:scale-95">Finaliser la commande</button>
          </div>
        )}
      </div>

      {/* HEADER PRINCIPAL */}
      <header className={`fixed top-0 w-full z-50 transition-all duration-700 ${scrolled ? 'bg-stone-100/95 backdrop-blur-xl py-4 border-b border-stone-200 shadow-sm' : 'bg-transparent py-8'}`}>
        <div className="max-w-7xl mx-auto px-6 md:px-10 flex items-center justify-between">
          <div className="flex items-center gap-4 cursor-pointer" onClick={() => { setActivePage('home'); window.scrollTo({top: 0, behavior: 'smooth'}); }}>
            <Circle className="w-6 h-6 text-emerald-900 opacity-60" strokeWidth={1.5} />
            <span className="text-xl font-semibold tracking-[0.3em] uppercase hidden sm:block">Somnora</span>
          </div>
          <nav className="hidden lg:flex items-center gap-12 text-sm font-bold uppercase tracking-[0.2em] text-stone-600">
            <button onClick={() => scrollToSection('science')} className="hover:text-stone-900 transition-colors">La Technologie</button>
            <button onClick={() => scrollToSection('details')} className="hover:text-stone-900 transition-colors">Fiche Technique</button>
            <button onClick={() => scrollToSection('achat')} className="hover:text-stone-900 transition-colors">Commander</button>
          </nav>
          <div className="flex items-center gap-6">
            <button onClick={() => setIsCartOpen(true)} className="relative p-2">
              <ShoppingCart className="w-6 h-6 text-stone-800" strokeWidth={1.2} />
              {cart.length > 0 && <span className="absolute top-1 right-0 bg-stone-950 text-white text-[9px] w-4 h-4 flex items-center justify-center rounded-full font-bold shadow-sm">{cart.reduce((total, item) => total + item.qty, 0)}</span>}
            </button>
            <button onClick={() => setIsMenuOpen(true)} className="lg:hidden p-2"><Menu className="w-7 h-7" /></button>
          </div>
        </div>
      </header>

      <main>
        {activePage === 'home' ? (
          <>
        {/* HERO SECTION */}
        <section className="relative min-h-screen flex items-center px-6 md:px-10 max-w-7xl mx-auto pt-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 w-full items-center">
            <div className="lg:col-span-6 z-10 text-center lg:text-left">
              <div className="mb-8 inline-flex items-center gap-4 text-xs font-bold tracking-[0.3em] uppercase text-emerald-900">
                <span className="w-12 h-[2px] bg-emerald-900 opacity-30"></span> L'Art de mieux dormir
              </div>
              <h1 className="text-6xl md:text-8xl font-luxury-serif italic mb-10 leading-[0.95] tracking-tighter text-stone-950 animate-luxury-float">
                La science<br/> <span className="not-italic lg:ml-16">Du Calme.</span>
              </h1>
              <p className="text-lg md:text-xl text-stone-700 mb-12 leading-relaxed max-w-md font-medium italic mx-auto lg:mx-0">
                {mockProduct.shortDesc}
              </p>
              <button onClick={() => scrollToSection('achat')} className="bg-stone-950 text-white px-14 py-6 rounded-full text-xs font-bold uppercase tracking-[0.2em] hover:bg-emerald-950 transition-all shadow-2xl active:scale-95">Découvrir l'offre</button>
            </div>
            <div className="lg:col-span-6 relative">
              <div className="relative rounded-[60px] overflow-hidden aspect-[4/5] shadow-2xl border border-stone-200">
                <img src="https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?auto=format&fit=crop&q=80&w=1200" alt="Somnora Atmosphere" className="w-full h-full object-cover grayscale-[0.2]" />
              </div>
            </div>
          </div>
        </section>

        {/* SECTION TECHNOLOGIE */}
        <section id="science" className="bg-stone-50 py-24 md:py-40 scroll-mt-20">
          <div className="max-w-7xl mx-auto px-6 md:px-10">
            <div className="text-center max-w-3xl mx-auto mb-20 md:mb-32">
              <h2 className="text-4xl md:text-6xl font-luxury-serif italic mb-8 md:mb-10 tracking-tight">Une technologie de pointe.</h2>
              <p className="text-sm md:text-lg text-stone-700 font-bold uppercase tracking-[0.2em]">
                Au-delà de la peluche, un outil de régulation sensorielle.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-16">
              {[
                { title: "Rythme Sensoriel", icon: Wind, desc: "Des capteurs intégrés détectent vos schémas et vous guident vers une respiration lente et profonde." },
                { title: "Acoustique Naturelle", icon: Music, desc: "Sons apaisants et bruits blancs pour masquer les nuisances sonores et faciliter l'endormissement." },
                { title: "Cycle Lumineux", icon: Sun, desc: "Éclairage LED doux synchronisé pour simuler visuellement l'inspiration et l'expiration." }
              ].map((item, i) => (
                <div key={i} className="bg-white p-8 md:p-12 rounded-[30px] md:rounded-[40px] shadow-sm border border-stone-200 text-center">
                  <item.icon className="w-8 h-8 md:w-10 md:h-10 text-emerald-800 mx-auto mb-6 md:mb-8" strokeWidth={1.2} />
                  <h3 className="text-base md:text-lg font-bold uppercase tracking-[0.2em] mb-4 md:mb-6">{item.title}</h3>
                  <p className="text-sm md:text-base text-stone-600 font-medium leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION ACHAT (OFFRES + PERSONNALISATION) */}
        <section id="achat" className="py-24 md:py-40 px-6 md:px-10 max-w-7xl mx-auto scroll-mt-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 md:gap-24">
            
            {/* Diaporama Desktop (basé sur le premier choix) */}
            <div className="lg:col-span-6 hidden lg:block">
              <div className="lg:sticky lg:top-40 bg-white rounded-[60px] shadow-xl border border-stone-200 p-8 aspect-square">
                <Diaporama 
                   variations={mockProduct.variations} 
                   activeVariationId={selections[0]?.id} 
                   className="w-full h-full" 
                   innerClassName="rounded-[40px]" 
                />
              </div>
            </div>

            <div className="lg:col-span-6 flex flex-col justify-center">
              <h2 className="text-4xl md:text-5xl font-luxury-serif italic mb-8">{mockProduct.name}</h2>
              
              {/* Diaporama Mobile */}
              <div className="lg:hidden w-full aspect-square rounded-[40px] bg-white shadow-xl border border-stone-200 p-4 mb-12">
                 <Diaporama 
                   variations={mockProduct.variations} 
                   activeVariationId={selections[0]?.id} 
                   className="w-full h-full" 
                   innerClassName="rounded-[30px]" 
                 />
              </div>

              <div className="space-y-16">
                
                {/* 1. Choix de l'Offre */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-[0.3em] text-stone-500 mb-8 border-b border-stone-100 pb-2">1. Sélectionnez votre offre</h4>
                  <div className="space-y-4">
                    {mockProduct.bundles.map((bundle) => {
                      const price = bundle.price;
                      const originalPrice = mockProduct.basePrice * bundle.bundleQty;
                      const savings = originalPrice - price;
                      const discountPercent = savings > 0 ? Math.round((savings / originalPrice) * 100) : 0;
                      
                      return (
                        <button 
                          key={bundle.id} 
                          onClick={() => handleBundleChange(bundle)}
                          className={`w-full flex items-center justify-between p-6 rounded-3xl border-2 transition-all text-left relative ${selectedBundle.id === bundle.id ? 'border-emerald-800 bg-emerald-50/30 shadow-sm' : 'border-stone-100 hover:border-stone-200 bg-white'}`}
                        >
                          {bundle.popular && <span className="absolute -top-3 left-6 bg-emerald-800 text-white text-[9px] font-bold uppercase px-3 py-1 rounded-full shadow-sm">Populaire</span>}
                          <div>
                            <p className="text-sm font-bold uppercase tracking-widest">{bundle.label}</p>
                            <p className="text-xs text-stone-500 mt-1">{bundle.bundleQty} unité{bundle.bundleQty > 1 ? 's' : ''} Somnora</p>
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-bold">{price.toFixed(2).replace('.', ',')} €</p>
                            {savings > 0 && <p className="text-[10px] text-emerald-700 font-bold uppercase">Économisez {discountPercent}%</p>}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 2. Choix des Modèles (Dynamique) */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-[0.3em] text-stone-500 mb-8 border-b border-stone-100 pb-2">2. Personnalisez vos modèles</h4>
                  <div className="space-y-6">
                    {Array.from({ length: selectedBundle.bundleQty }).map((_, index) => (
                      <div key={index} className="bg-stone-50 p-6 rounded-[24px] border border-stone-100">
                        <span className="block text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-6">Compagnon n°{index + 1}</span>
                        <div className="flex justify-center md:justify-start gap-4 md:gap-8">
                          {mockProduct.variations.map((v) => {
                            const isSelected = selections[index]?.id === v.id;
                            return (
                              <button 
                                key={v.id} 
                                onClick={() => handleSelectionChange(index, v)} 
                                className="flex flex-col items-center gap-3 group"
                              >
                                <div className={`w-14 h-14 md:w-16 md:h-16 rounded-full border-2 transition-all p-1 ${isSelected ? 'border-emerald-800 scale-110 shadow-md bg-white' : 'border-transparent opacity-50 hover:opacity-100'}`}>
                                  <img src={v.image} alt={v.name} className="w-full h-full object-cover rounded-full" />
                                </div>
                                <span className={`text-[9px] md:text-[10px] font-bold uppercase tracking-widest ${isSelected ? 'text-stone-950' : 'text-stone-400'}`}>{v.value}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* CTA Final */}
                <div className="pt-12 border-t border-stone-200 text-center lg:text-left">
                  <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-12">
                    <span className="text-4xl md:text-5xl font-light text-stone-950">{selectedBundle.price.toFixed(2).replace('.', ',')} €</span>
                    <div className="text-xs font-bold text-emerald-800 bg-emerald-50 px-6 py-2 rounded-full uppercase tracking-widest">Livraison Gratuite</div>
                  </div>
                  <button onClick={handleAddToCart} className="w-full bg-stone-950 text-white py-6 md:py-8 rounded-full text-xs font-bold uppercase tracking-[0.3em] hover:bg-emerald-950 transition-all shadow-xl active:scale-95 mb-8">
                    Ajouter au panier
                  </button>
                  <div className="flex items-center justify-center gap-3 text-xs text-stone-600 font-bold uppercase tracking-widest opacity-80">
                    <ShieldCheck className="w-5 h-5 text-emerald-800" /> Garantie Satisfait 30 Jours
                  </div>
                </div>
                
              </div>
            </div>
          </div>
        </section>

        {/* FICHE TECHNIQUE */}
        <section id="details" className="py-24 md:py-40 bg-stone-50 border-t border-stone-100 scroll-mt-20">
          <div className="max-w-7xl mx-auto px-6 md:px-10">
            <h2 className="text-3xl md:text-4xl font-luxury-serif mb-20 italic text-center md:text-left">Fiche Technique.</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 text-center md:text-left">
              <div className="space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-widest text-stone-400">Dimensions</h4>
                <div className="flex flex-col gap-1">
                  <p className="text-lg font-semibold">{mockProduct.dimensions}</p>
                  <p className="text-[10px] text-stone-400 uppercase tracking-tighter">(Variable selon le modèle)</p>
                </div>
              </div>
              <div className="space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-widest text-stone-400">Matériaux</h4>
                <p className="text-lg font-semibold">{mockProduct.material}</p>
              </div>
              <div className="space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-widest text-stone-400">Alimentation</h4>
                <div className="flex flex-col gap-1">
                  <p className="text-lg font-semibold">À piles</p>
                  <p className="text-[10px] text-stone-400 uppercase tracking-tighter">(Piles non incluses)</p>
                </div>
              </div>
              <div className="space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-widest text-stone-400">Entretien</h4>
                <p className="text-lg font-semibold">Housse Lavable</p>
              </div>
            </div>
          </div>
        </section>
          </>
        ) : (
          <section className="min-h-screen pt-40 pb-24 px-6 md:px-10 max-w-7xl mx-auto">
            {renderLegalContent()}
          </section>
        )}
      </main>

      {/* FOOTER LUXE */}
      <footer className="bg-stone-950 text-white pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-10 flex flex-col items-center">
          <div className="flex items-center gap-6 mb-20 cursor-pointer" onClick={() => { setActivePage('home'); window.scrollTo({top: 0, behavior: 'smooth'}); }}>
            <div className="relative">
               <Circle className="w-10 h-10 text-emerald-500 opacity-30" strokeWidth={0.5} />
               <div className="absolute inset-0 flex items-center justify-center">
                 <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
               </div>
            </div>
            <span className="text-3xl font-medium tracking-[0.5em] uppercase">Somnora</span>
          </div>
          <div className="flex flex-col md:flex-row gap-12 text-xs font-bold tracking-[0.3em] uppercase text-stone-500 mb-20 text-center">
            <button onClick={() => { setActivePage('legal'); window.scrollTo({top: 0, behavior: 'smooth'}); }} className="hover:text-white transition-colors">Mentions Légales</button>
            <button onClick={() => { setActivePage('cgv'); window.scrollTo({top: 0, behavior: 'smooth'}); }} className="hover:text-white transition-colors">CGV & Retours</button>
            <button onClick={() => { setActivePage('privacy'); window.scrollTo({top: 0, behavior: 'smooth'}); }} className="hover:text-white transition-colors">Politique de Confidentialité (RGPD)</button>
          </div>
          <div className="text-[10px] text-stone-600 uppercase tracking-[0.4em] text-center border-t border-white/5 pt-16 w-full max-w-4xl opacity-60">
            Somnora Maison de Repos — Édition {new Date().getFullYear()} — L'Art du Sommeil
          </div>
        </div>
      </footer>

    </div>
  );
}