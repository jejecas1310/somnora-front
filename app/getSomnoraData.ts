export default async function getSomnoraData() {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

  const res = await fetch(process.env.NEXT_PUBLIC_WORDPRESS_API_URL as string, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query: `
        query {
          products(first: 10) {
            nodes {
              id
              name
              image { node { sourceUrl } }
              ... on VariableProduct {
                variations {
                  nodes {
                    id
                    name
                    price
                    image { node { sourceUrl } }
                  }
                }
              }
            }
          }
        }
      `
    }),
    next: { revalidate: 1 } // On force la mise à jour immédiate
  });
  
  const json = await res.json();
  
  // LOG DE SÉCURITÉ : Si WordPress renvoie du vide, on prend des données de secours pour que le site s'affiche quand même
  if (!json.data?.products?.nodes?.length) {
    console.warn("WordPress ne renvoie rien, utilisation du mode dégradé");
    return {
      name: "Somnora (Mode Aperçu)",
      shortDesc: "Connexion en cours avec le catalogue o2switch...",
      variations: [
        { id: "1", name: "Chargement...", image: "https://images.unsplash.com/photo-1541781774459-bb2af2f05b55" }
      ],
      bundles: [{ id: "b1", label: "Unité", bundleQty: 1, price: 39.90 }]
    };
  }

  const raw = json.data.products.nodes[0];
  
  return {
    name: raw.name,
    shortDesc: "Le compagnon respirant pour vos nuits.",
    variations: raw.variations?.nodes?.map((v: any) => ({
      id: v.id,
      name: v.name.includes(' - ') ? v.name.split(' - ')[1] : v.name,
      image: v.image?.node?.sourceUrl || raw.image?.node?.sourceUrl || "https://images.unsplash.com/photo-1541781774459-bb2af2f05b55",
    })) || [],
    bundles: [
      { id: "b1", label: "Unité", bundleQty: 1, price: 39.90 },
      { id: "b2", label: "Pack Duo", bundleQty: 2, price: 74.90 }
    ]
  };
}
