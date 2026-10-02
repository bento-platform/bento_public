import { store } from '@/store';
import { RequestStatus } from '@/types/requests';

import { getDrsRecord } from '@/features/drs/getDrsRecord.thunk';
import type { DrsRecord } from './types';

// async equivalent of DRS hook useDrsHttpsAccessOrPassThrough()
export const getDrsHttpsAccessOrPassThrough = async (url: string | undefined): Promise<string | null> => {
  if (!url || !isDrs(url)) return url ?? null;

  return getDrsObject(url).then(
    (record) => (record?.access_methods ?? []).find((am) => am.type === 'https')?.access_url?.url ?? null
  );
};

export const isDrs = (uri: string | undefined) => {
  if (!uri) return false;
  try {
    const parts = new URL(uri);
    return parts.protocol === 'drs:';
  } catch {
    return false;
  }
};

const getDrsObject = async (uri: string): Promise<DrsRecord | null> => {
  const currentState = store.getState();
  const recordState = currentState.drs.byUri[uri];

  if (recordState?.status === RequestStatus.Fulfilled) {
    return recordState.record ?? null;
  }

  if (recordState?.status === RequestStatus.Pending) {
    // if request is pending, don't launch a second dispatch, which will get aborted
    // instead subscribe to store updates and resolve when the request finishes
    return new Promise((resolve) => {
      store.subscribe(() => {
        const nextState = store.getState();
        const nextRecordState = nextState.drs.byUri[uri];

        if (!nextRecordState) return;
        if (nextRecordState.status === RequestStatus.Fulfilled || nextRecordState.status === RequestStatus.Rejected) {
          resolve(nextRecordState.status === RequestStatus.Fulfilled ? nextRecordState.record : null);
        }
      });
    });
  }

  try {
    const record = await store.dispatch(getDrsRecord(uri)).unwrap();
    return record;
  } catch {
    const finalState = store.getState().drs.byUri[uri];
    if (finalState?.status === RequestStatus.Fulfilled) {
      return finalState.record ?? null;
    }
    return null;
  }
};
