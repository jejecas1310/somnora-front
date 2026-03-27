import getSomnoraData from './getSomnoraData'; // On va créer ce petit fichier après
import ClientInterface from './ClientInterface';

export default async function Page() {
  const productData = await getSomnoraData();

  return (
    <ClientInterface initialData={productData} />
  );
}
