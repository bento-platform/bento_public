import { BEACON_UI_ENABLED } from '@/config';
import { BEACON_NETWORK_ENABLED } from '@/config';

export interface BentoRoutes {
  Overview: string;
  Search: string;
  Beacon?: string;
  BeaconNetwork?: string;
  Provenance: string;
}

const BentoRoute: BentoRoutes = {
  Overview: 'overview',
  Search: 'search',
  Provenance: 'provenance',
};

const TOP_LEVEL_ONLY_ROUTES: string[] = [];

if (BEACON_UI_ENABLED) {
  BentoRoute.Beacon = 'beacon';
}

if (BEACON_NETWORK_ENABLED) {
  BentoRoute.BeaconNetwork = 'network';
  TOP_LEVEL_ONLY_ROUTES.push(BentoRoute.BeaconNetwork);
}

export { BentoRoute, TOP_LEVEL_ONLY_ROUTES };
