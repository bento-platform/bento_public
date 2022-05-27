import { configureStore } from '@reduxjs/toolkit';
import configReducer from './features/config';
import dataReducer from './features/data';
import queryReducer from './features/query';

export const store = configureStore({
  reducer: {
    config: configReducer,
    data: dataReducer,
    query: queryReducer,
  },
});
