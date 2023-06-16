import { configureStore } from '@reduxjs/toolkit';

import configReducer from '@/features/config/config.store';
import contentReducer from '@/features/content/content.store';
import dataReducer from '@/features/data/data.store';
import queryReducer from '@/features/search/query.store';
import provenanceReducer from '@/features/provenance/provenance.store';
import beaconConfigReducer from './features/beacon/beaconConfig.store';
import beaconQueryReducer from './features/beacon/beaconQuery.store';

export const store = configureStore({
  reducer: {
    config: configReducer,
    content: contentReducer,
    data: dataReducer,
    query: queryReducer,
    provenance: provenanceReducer,
    beaconConfig: beaconConfigReducer,
    beaconQuery: beaconQueryReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
