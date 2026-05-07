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




// ------------------------------- async versions, not hooks

export const getDrsAccessMethods = async(url: string | undefined): Promise<string | null> => {
  return getDrsObjectOrPassThrough(url).then((record) => (record?.access_methods ?? []).find((am) => am.type === 'https')?.access_url?.url ?? null);
};

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

  // add try/catch
  // direct call to store.dispatch instead of useAppDispatch hook
  const record = store.dispatch(getDrsRecord(uri)).unwrap()
  return record;
};
