import { configureStore } from '@reduxjs/toolkit';
import { ToolkitStore } from '@reduxjs/toolkit/dist/configureStore';

import {
  LS_OPENID_CONFIG_KEY,
  OIDCSliceState,
  AuthReducer as auth,
  OIDCReducer as openIdConfiguration,
} from 'bento-auth-js';

import configReducer from '@/features/config/config.store';
import contentReducer from '@/features/content/content.store';
import dataReducer from '@/features/data/data.store';
import queryReducer from '@/features/search/query.store';
import lastIngestionDataReducer from '@/features/ingestion/lastIngestion.store';
import provenanceReducer from '@/features/provenance/provenance.store';
import beaconConfigReducer from '@/features/beacon/beaconConfig.store';
import beaconQueryReducer from '@/features/beacon/beaconQuery.store';
import metadataReducer from '@/features/metadata/metadata.store';
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
    config: configReducer,
    content: contentReducer,
    data: dataReducer,
    query: queryReducer,
    provenance: provenanceReducer,
    lastIngestionData: lastIngestionDataReducer,
    beaconConfig: beaconConfigReducer,
    beaconQuery: beaconQueryReducer,
    metadata: metadataReducer,
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
