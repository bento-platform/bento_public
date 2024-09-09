import { BEACON_UI_ENABLED } from '@/config';

export interface BentoRoutes {
  Overview: string;
  Search: string;
  Beacon?: string;
  Provenance: string;
}

const BentoRoute: BentoRoutes = {
  Overview: 'overview',
  Search: 'search',
  Provenance: 'provenance',
};

if (BEACON_UI_ENABLED) {
  BentoRoute.Beacon = 'beacon';
}

export { BentoRoute };
