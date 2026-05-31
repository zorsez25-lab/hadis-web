import RaviListesi from './RaviListesi';
import { TabakaFiltre } from '@/lib/ravi-utils';

export default async function RaviListesiWrapper({ sorgu, filtre }: { sorgu: string; filtre: TabakaFiltre }) {
  return <RaviListesi sorgu={sorgu} filtre={filtre} />;
}
