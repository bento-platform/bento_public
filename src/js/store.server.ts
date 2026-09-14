import { configureStore } from '@reduxjs/toolkit';

import { BEACON_NETWORK_ENABLED } from '@/config';
import beaconNetworkReducer, { getBeaconNetworkConfig } from '@/features/beacon/network.store';
import contentReducer, { makeGetAboutRequest } from '@/features/content/content.store';
import referenceReducer, { getGenomes } from '@/features/reference/reference.store';
import { RequestStatus } from '@/types/requests';
import type { RootState } from './store';

// Upper bound on how long the server will wait on these fetches before giving up on preloading and falling back to
// the normal client-side fetch (see AppEffects.tsx) - so a slow/unreachable backend delays first paint by at most
// this much, rather than blocking it indefinitely.
const BOOTSTRAP_TIMEOUT_MS = 3000;

const TIMED_OUT = Symbol('timed out');
const withTimeout = <T>(promise: Promise<T>): Promise<T | typeof TIMED_OUT> =>
  Promise.race([
    promise,
    new Promise<typeof TIMED_OUT>((resolve) => setTimeout(() => resolve(TIMED_OUT), BOOTSTRAP_TIMEOUT_MS)),
  ]);

/**
 * Runs a handful of app-wide, scope/auth-independent bootstrap fetches (reference genomes, about content, beacon
 * network config) on the server, so the client's initial render already has this data instead of fetching it after
 * mount (see AppEffects.tsx, which still dispatches these same thunks client-side as a fallback - their
 * `condition()` checks skip the redundant work once this preloaded state is already fulfilled).
 *
 * Deliberately builds a standalone store scoped to just these 3 slices, rather than reusing the app's full
 * makeStore(): several other slices can't be pulled into a Server Component's module graph, either because they
 * transitively import client-only Next.js router hooks (metadata, via @/utils/router) or because they import
 * bento-auth-js, whose single package entry point eagerly evaluates a `React.createContext()` call that the
 * restricted React build used for Server Components doesn't support (config's makeGetServiceInfoRequest and
 * beacon's getBeaconConfig are otherwise unscoped/auth-free and would otherwise belong here too - see
 * @/utils/requests.ts's import of bento-auth-js). None of the thunks dispatched below read state outside their own
 * slice (verified against their `condition()` checks), so running them against this narrower store is safe despite
 * the wider `RootState` type they're declared against.
 */
export const getBootstrapPreloadedState = async (): Promise<
  Pick<RootState, 'reference' | 'content' | 'beaconNetwork'>
> => {
  const store = configureStore({
    reducer: {
      reference: referenceReducer,
      content: contentReducer,
      beaconNetwork: beaconNetworkReducer,
    },
  });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- see comment above: safe despite the type mismatch
  const dispatch = store.dispatch as any;

  const [genomes, about, beaconNetwork] = await Promise.all([
    withTimeout(dispatch(getGenomes())),
    withTimeout(dispatch(makeGetAboutRequest())),
    BEACON_NETWORK_ENABLED ? withTimeout(dispatch(getBeaconNetworkConfig())) : Promise.resolve(TIMED_OUT),
  ]);

  const state = store.getState();
  // A thunk that hit the timeout is still running in the background against this (otherwise-unreferenced) store, so
  // its slice may be stuck at Pending here - reset it to Idle so the client-side fallback thunk doesn't see
  // "already in flight" and skip itself too (its own `condition()` checks only allow a fetch from Idle).
  if (genomes === TIMED_OUT) state.reference = { ...state.reference, genomesStatus: RequestStatus.Idle };
  if (about === TIMED_OUT) state.content = { ...state.content, status: RequestStatus.Idle };
  if (beaconNetwork === TIMED_OUT) {
    state.beaconNetwork = { ...state.beaconNetwork, networkConfigStatus: RequestStatus.Idle };
  }

  return state;
};
