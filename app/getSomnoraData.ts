export default async function getSomnoraData() {
  // On ne fait plus d'appel réseau qui plante, on donne les infos en dur
  return {
    name: "Le Compagnon Respirant Somnora",
    shortDesc: "Un système intuitif conçu pour réguler votre respiration par mimétisme. Capteurs intégrés, cycles lumineux et ambiances sonores naturelles.",
    variations: [
      { id: "var-1", name: "Koala Gris", image: "https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?q=80&w=1000", price: "39,90 €" },
      { id: "var-2", name: "Koala Marron", image: "https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?q=80&w=1000", price: "39,90 €" },
      { id: "var-3", name: "Snoopy", image: "https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?q=80&w=1000", price: "39,90 €" },
      { id: "var-4", name: "Éléphant", image: "https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?q=80&w=1000", price: "39,90 €" }
    ],
    bundles: [
      { id: "b1", label: "Unité", bundleQty: 1, price: 39.90 },
      { id: "b2", label: "Pack Duo", bundleQty: 2, price: 74.90 },
      { id: "b3", label: "Pack Famille", bundleQty: 3, price: 109.90 }
    ]
  };
}
