import { useEffect, useMemo, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/hooks';
import { store } from '@/store';
import type { DrsRecordState } from './drs.store';
import { RequestStatus } from '@/types/requests';

import { getDrsRecord } from '@/features/drs/getDrsRecord.thunk';
import { DrsAccessMethod, DrsRecord } from './types';

export const useDrsObjectOrPassThrough = (uri: string | undefined): DrsRecordState | null => {
  /**
   * If an object is returned, the URI is a DRS URI to be fetched/being fetched.
   * If null is returned, the URI is not recognized as a DRS URI at all. This is handled here to ensure we can build
   * components which conditionally fetch DRS records.
   */

  const dispatch = useAppDispatch();

  const isDrs = useMemo(() => {
    if (uri) {
      const parts = new URL(uri);
      return parts.protocol === 'drs:';
    } else {
      return false;
    }
  }, [uri]);

  useEffect(() => {
    if (uri && isDrs) {
      dispatch(getDrsRecord(uri));
    }
  }, [dispatch, uri, isDrs]);

  const { byUri } = useAppSelector((state) => state.drs);
  return uri && isDrs ? byUri[uri] : null;
};

export const useDrsHttpsAccessOrPassThrough = (url: string | undefined): string | null => {
  const drsRec = useDrsObjectOrPassThrough(url);
  if (drsRec) {
    return drsRec.status !== RequestStatus.Fulfilled
      ? null
      : ((drsRec.record?.access_methods ?? []).find((am) => am.type === 'https')?.access_url?.url ?? url ?? null);
  } else {
    return url ?? null;
  }
};

// as above, but only returns access methods or null
// but does this distinguish between "not found" and "not found yet"?
export const useDrsAccessMethods = (url: string | undefined): string | null => {
  const drsRec = useDrsObjectOrPassThrough(url);
  if (drsRec) {
    return drsRec.status !== RequestStatus.Fulfilled
      ? null
      : ((drsRec.record?.access_methods ?? []).find((am) => am.type === 'https')?.access_url?.url ?? url ?? null);
  } else {
    return null;
  }
};



``




// ------------------------------- async versions, not hooks. to move

export const getDrsAccessMethods = async(url: string | undefined): Promise<string | null> => {
  return getDrsObjectOrPassThrough(url).then((record) => (record?.access_methods ?? []).find((am) => am.type === 'https')?.access_url?.url ?? null);
};

// export const getDrsObjectOrPassThrough = async (uri: string | undefined): Promise<DrsRecord | null> => {
//   /**
//    * If a record is returned, the URI is a DRS URI that has been fetched.
//    * If null is returned, the URI is not recognized as a DRS URI.
//    */


//   if (!uri) return null;

//   // deduplicate
//   const isDrs = (() => {
//     try {
//       const parts = new URL(uri);
//       return parts.protocol === 'drs:';
//     } catch {
//       return false;
//     }
//   })();

//   if (!isDrs) return null;

//   const currentState = store.getState();
//   const recordState = currentState.drs.byUri[uri];

//   if (recordState?.status === RequestStatus.Fulfilled) {
//     return recordState.record ?? null;
//   }

//   if (recordState?.status === RequestStatus.Pending) {
//     // if request is pending, don't launch a second dispatch, which will get aborted
//     // instead subscribe to store updates and resolve when the request finishes
//     return new Promise((resolve) => {
//       const unsubscribe = store.subscribe(() => {
//         const nextState = store.getState();
//         const nextRecordState = nextState.drs.byUri[uri];

//         if (!nextRecordState) return;
//         if (
//           nextRecordState.status === RequestStatus.Fulfilled ||
//           nextRecordState.status === RequestStatus.Rejected
//         ) {
//           unsubscribe();
//           resolve(nextRecordState.status === RequestStatus.Fulfilled ? nextRecordState.record : null);
//         }
//       });
//     });
//   }

//   try {
//     const record = await store.dispatch(getDrsRecord(uri)).unwrap();
//     return record;
//   } catch (err) {
//     const finalState = store.getState().drs.byUri[uri];
//     if (finalState?.status === RequestStatus.Fulfilled) {
//       return finalState.record ?? null;
//     }
//     return null;
//   }
// };



export const getDrsObjectOrPassThrough = async (uri: string | undefined): Promise<DrsRecord | null> => {
  /**
   * If a record is returned, the URI is a DRS URI that has been fetched.
   * If null is returned, the URI is not recognized as a DRS URI.
   */


  if (!uri) return null;

  // deduplicate
  const isDrs = (() => {
    try {
      const parts = new URL(uri);
      return parts.protocol === 'drs:';
    } catch {
      return false;
    }
  })();

  if (!isDrs) return null;

  const currentState = store.getState();
  const recordState = currentState.drs.byUri[uri];

  if (recordState?.status === RequestStatus.Fulfilled) {
    return recordState.record ?? null;
  }

  if (recordState?.status === RequestStatus.Pending) {
    // if request is pending, don't launch a second dispatch, which will get aborted
    // instead subscribe to store updates and resolve when the request finishes
    return new Promise((resolve) => {
      const unsubscribe = store.subscribe(() => {
        const nextState = store.getState();
        const nextRecordState = nextState.drs.byUri[uri];

        if (!nextRecordState) return;
        if (
          nextRecordState.status === RequestStatus.Fulfilled ||
          nextRecordState.status === RequestStatus.Rejected
        ) {
          resolve(nextRecordState.status === RequestStatus.Fulfilled ? nextRecordState.record : null);
        }
      });
      unsubscribe()
    });
  }

  try {
    const record = await store.dispatch(getDrsRecord(uri)).unwrap();
    return record;
  } catch (err) {
    const finalState = store.getState().drs.byUri[uri];
    if (finalState?.status === RequestStatus.Fulfilled) {
      return finalState.record ?? null;
    }
    return null;
  }
};
