import { useEffect, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '@/hooks';
import type { DrsRecordState } from './drs.store';
import { RequestStatus } from '@/types/requests';
import { getDrsRecord } from '@/features/drs/getDrsRecord.thunk';
import { isDrs } from './utils';
import { toBffUrl } from '@/constants/bff';
import { PUBLIC_URL_NO_TRAILING_SLASH } from '@/config';

export const useDrsObjectOrPassThrough = (uri: string | undefined): DrsRecordState | null => {
  /**
   * If an object is returned, the URI is a DRS URI to be fetched/being fetched.
   * If null is returned, the URI is not recognized as a DRS URI at all. This is handled here to ensure we can build
   * components which conditionally fetch DRS records.
   */
  const dispatch = useAppDispatch();

  const isDrsUri = useMemo(() => isDrs(uri), [uri]);

  useEffect(() => {
    if (uri && isDrsUri) {
      dispatch(getDrsRecord(uri));
    }
  }, [dispatch, uri, isDrsUri]);

  const { byUri } = useAppSelector((state) => state.drs);
  return uri && isDrsUri ? byUri[uri] : null;
};

export const useDrsHttpsAccessOrPassThrough = (url: string | undefined): string | null => {
  const drsRec = useDrsObjectOrPassThrough(url);
  if (drsRec) {
    if (drsRec.status !== RequestStatus.Fulfilled) return null;
    const accessUrl = (drsRec.record?.access_methods ?? []).find((am) => am.type === 'https')?.access_url?.url;
    return accessUrl ? toBffUrl(accessUrl, PUBLIC_URL_NO_TRAILING_SLASH) : (url ?? null);
  } else {
    return url ?? null;
  }
};
