import { configureStore } from '@reduxjs/toolkit';
import configReducer from './features/config/config';
import dataReducer from './features/data/data';
import queryReducer from './features/search/query';
import provenanceReducer from './features/provenance/provenance';

export const store = configureStore({
  reducer: {
    config: configReducer,
    data: dataReducer,
    query: queryReducer,
    provenance: provenanceReducer,
  },
});
