import { useEffect, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '@/hooks';

import type { DrsRecordState } from './drs.store';
import { RequestStatus } from '@/types/requests';

import { getDrsRecord } from '@/features/drs/getDrsRecord.thunk';

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

export const useDrsHttpsAccessOrPassThrough = (url: string): string | null => {
  const drsRec = useDrsObjectOrPassThrough(url);
  if (drsRec) {
    return drsRec.status !== RequestStatus.Fulfilled
      ? null
      : ((drsRec.record?.access_methods ?? []).find((am) => am.type === 'https')?.access_url?.url ?? url);
  } else {
    return url;
  }
};
