import { configureStore } from '@reduxjs/toolkit';
import type { ToolkitStore } from '@reduxjs/toolkit/dist/configureStore';

import type { OIDCSliceState } from 'bento-auth-js';
import { LS_OPENID_CONFIG_KEY, AuthReducer as auth, OIDCReducer as openIdConfiguration } from 'bento-auth-js';

import clinPhenReducer from '@/features/clinPhen/clinPhen.store';
import configReducer from '@/features/config/config.store';
import contentReducer from '@/features/content/content.store';
import dataReducer from '@/features/data/data.store';
import dataTypesReducer from '@/features/dataTypes/dataTypes.store';
import queryReducer from '@/features/search/query.store';
import beaconReducer from './features/beacon/beacon.store';
import beaconNetworkReducer from './features/beacon/network.store';
import metadataReducer from '@/features/metadata/metadata.store';
import reference from '@/features/reference/reference.store';
import ui from '@/features/ui/ui.store';
import { getValue, saveValue } from './utils/localStorage';

interface PersistedState {
  openIdConfiguration?: OIDCSliceState;
}

const persistedState: PersistedState = {};
const persistedOpenIDConfig = getValue(LS_OPENID_CONFIG_KEY, undefined, (value) => typeof value === 'object');
if (persistedOpenIDConfig) {
  console.debug('attempting to load OpenID configuration from localStorage');
  persistedState.openIdConfiguration = persistedOpenIDConfig;
}

export const store = configureStore({
  reducer: {
    auth,
    openIdConfiguration,
    clinPhen: clinPhenReducer,
    config: configReducer,
    content: contentReducer,
    data: dataReducer,
    dataTypes: dataTypesReducer,
    query: queryReducer,
    beacon: beaconReducer,
    beaconNetwork: beaconNetworkReducer,
    metadata: metadataReducer,
    reference,
    ui,
  },
  preloadedState: persistedState,
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
const observeStore = <T>(store: ToolkitStore, select: (state: RootState) => T, onChange: (state: T) => void) => {
  let currentState: T;

  const handleChange = () => {
    const nextState = select(store.getState());
    if (nextState !== currentState) {
      currentState = nextState;
      onChange(currentState);
    }
  };

  const unsubscribe = store.subscribe(handleChange);
  handleChange();
  return unsubscribe;
};

// Persist OIDC config on state changes
observeStore<OIDCSliceState>(
  store,
  (state) => state.openIdConfiguration,
  (currentState) => {
    const { data, expiry, isFetching } = currentState;
    if (data && expiry && !isFetching) {
      saveValue(LS_OPENID_CONFIG_KEY, { data, expiry, isFetching });
    }
  }
);
