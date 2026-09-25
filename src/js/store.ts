import { configureStore } from '@reduxjs/toolkit';

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

export const store = configureStore({
  reducer: {
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
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

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
  observedStore: typeof store,
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

// Persist UI settings on state changes
observeStore<UIState>(
  store,
  (state) => state.ui,
  (currentState) => {
    saveValue(LOCALSTORAGE_UI_SETTINGS_KEY, currentState.settings);
  }
);
