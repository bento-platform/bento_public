import { configureStore } from '@reduxjs/toolkit';
import type { Store } from 'redux';

import auth from '@/features/auth/authSlice';

import { LOCALSTORAGE_UI_SETTINGS_KEY } from '@/constants/ui';
import catalogueReducer from '@/features/catalogue/catalogue.store';
import clinPhenReducer from '@/features/clinPhen/clinPhen.store';
import configReducer from '@/features/config/config.store';
import contentReducer from '@/features/content/content.store';
import dataTypesReducer from '@/features/dataTypes/dataTypes.store';
import drs from '@/features/drs/drs.store';
import queryReducer from '@/features/search/query.store';
import beaconReducer from './features/beacon/beacon.store';
import beaconNetworkReducer from './features/beacon/network.store';
import metadataReducer from '@/features/metadata/metadata.store';
import reference from '@/features/reference/reference.store';
import ui, { type UIState } from '@/features/ui/ui.store';
import { saveValue } from './utils/localStorage';

const rootReducer = {
  auth,
  catalogue: catalogueReducer,
  clinPhen: clinPhenReducer,
  config: configReducer,
  content: contentReducer,
  drs,
  dataTypes: dataTypesReducer,
  query: queryReducer,
  beacon: beaconReducer,
  beaconNetwork: beaconNetworkReducer,
  metadata: metadataReducer,
  reference,
  ui,
};

export type RootState = { [K in keyof typeof rootReducer]: ReturnType<(typeof rootReducer)[K]> };

/**
 * Custom observeStore utility for enhanced 'store.subscribe' behaviour.
 *
 * The 'store.subscribe' method has no notion of previous/next state, so it is triggered on
 * every action, which leads to unnecessary subscriber executions.
 *
 * The onChange callback is only invoked if a change is detected on the selected state.
 *
 * See Redux store.subscribe doc: https://redux.js.org/api/store#subscribelistener

 */
const observeStore = <T>(
  observedStore: Store<RootState>,
  select: (state: RootState) => T,
  onChange: (state: T) => void
) => {
  let currentState: T;

  const handleChange = () => {
    const nextState = select(observedStore.getState());
    if (nextState !== currentState) {
      currentState = nextState;
      onChange(currentState);
    }
  };

  const unsubscribe = observedStore.subscribe(handleChange);
  handleChange();
  return unsubscribe;
};

/**
 * Builds the app's store, optionally seeded with a partial state (e.g. slices fetched during server rendering via
 * store.server.ts, so the first client render already has that data instead of fetching it after mount).
 */
export const makeStore = (preloadedState?: Partial<RootState>) => {
  const store = configureStore({
    reducer: rootReducer,
    // configureStore's inferred type for `rootReducer` only accepts a full RootState here, but a partial one (with
    // some top-level slices missing) is fine at runtime - combineReducers falls back to each slice's own initial
    // state for any key that isn't present.
    preloadedState: preloadedState as RootState | undefined,
  });

  // Persist UI settings on state changes. Safe to set up even for a server-side/disposable store: saveValue()
  // no-ops (via try/catch) when localStorage isn't available.
  observeStore<UIState>(
    store,
    (state) => state.ui,
    (currentState) => {
      saveValue(LOCALSTORAGE_UI_SETTINGS_KEY, currentState.settings);
    }
  );

  return store;
};

export type AppStore = ReturnType<typeof makeStore>;
export type AppDispatch = AppStore['dispatch'];
