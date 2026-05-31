import RaviListesi from './RaviListesi';

export default async function RaviListesiWrapper({ sorgu }: { sorgu: string }) {
  return <RaviListesi sorgu={sorgu} />;
}
