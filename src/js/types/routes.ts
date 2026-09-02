import { BEACON_UI_ENABLED } from '@/config';
import { BEACON_NETWORK_ENABLED } from '@/config';

export interface BentoRoutes {
  Explore: string;
  Search: string;
  Beacon?: string;
  BeaconNetwork?: string;
  About: string;
  Phenopackets: string;
  NotFound: string;
}

const BentoRoute: BentoRoutes = {
  Explore: 'explore',
  Search: 'search',
  About: 'about',
  Phenopackets: 'phenopackets',
  NotFound: 'not_found',
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
