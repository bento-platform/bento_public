import { notFound } from 'next/navigation';
import BeaconQueryUi from '@/components/Beacon/BeaconQueryUi';
import { BEACON_UI_ENABLED } from '@/config';

export default function Page() {
  if (!BEACON_UI_ENABLED) notFound();
  return <BeaconQueryUi />;
}
