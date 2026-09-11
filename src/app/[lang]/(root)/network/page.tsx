import { notFound } from 'next/navigation';
import NetworkUi from '@/components/Beacon/BeaconNetwork/NetworkUi';
import { BEACON_NETWORK_ENABLED } from '@/config';

// Beacon network is only available at the top scope level - scoping does not make sense for it, so this page
// only exists under (root), not under p/[projectId] or d/[datasetId].
export default function Page() {
  if (!BEACON_NETWORK_ENABLED) notFound();
  return <NetworkUi />;
}
