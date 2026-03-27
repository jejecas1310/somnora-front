export default async function getSomnoraData() {
  // Cette ligne permet de dire à Vercel : "C'est bon, j'ai confiance en ce serveur o2switch même si le certificat est temporaire"
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

  const res = await fetch(process.env.NEXT_PUBLIC_WORDPRESS_API_URL as string, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query: `query { products(first: 1) { nodes { name ... on VariableProduct { variations { nodes { id name price image { node { sourceUrl } } } } } } } }`
    }),
    next: { revalidate: 60 }
  });
  
  const json = await res.json();
  
  if (!json.data || !json.data.products.nodes[0]) {
    throw new Error("Aucun produit trouvé sur WordPress");
  }

  const raw = json.data.products.nodes[0];
  
  return {
    name: raw.name,
    shortDesc: "Le compagnon respirant pour vos nuits.",
    variations: raw.variations.nodes.map((v: any) => ({
      id: v.id,
      name: v.name.split(' - ')[1] || v.name,
      image: v.image?.node?.sourceUrl || "https://images.unsplash.com/photo-1541781774459-bb2af2f05b55",
    })),
    bundles: [
      { id: "b1", label: "Unité", bundleQty: 1, price: 39.90 },
      { id: "b2", label: "Pack Duo", bundleQty: 2, price: 74.90 }
    ]
  };
}
