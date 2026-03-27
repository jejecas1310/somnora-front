export default async function getSomnoraData() {
  const res = await fetch(process.env.NEXT_PUBLIC_WORDPRESS_API_URL as string, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query: `query { products(first: 1) { nodes { name ... on VariableProduct { variations { nodes { id name price image { node { sourceUrl } } } } } } } }`
    }),
    next: { revalidate: 60 }
  });
  const json = await res.json();
  const raw = json.data.products.nodes[0];
  return {
    name: raw.name,
    shortDesc: "Le compagnon respirant pour vos nuits.",
    variations: raw.variations.nodes.map((v: any) => ({
      id: v.id,
      name: v.name.split(' - ')[1] || v.name,
      image: v.image?.node?.sourceUrl,
    })),
    bundles: [
      { id: "b1", label: "Unité", bundleQty: 1, price: 39.90 },
      { id: "b2", label: "Pack Duo", bundleQty: 2, price: 74.90 }
    ]
  };
}
