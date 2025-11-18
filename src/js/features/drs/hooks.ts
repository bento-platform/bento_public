import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/hooks';

import type { DrsRecordState } from './drs.store';
import { RequestStatus } from '@/types/requests';

import { getDrsRecord } from '@/features/drs/getDrsRecord.thunk';

export const useDrsObject = (drsUri: string): DrsRecordState => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (drsUri) {
      dispatch(getDrsRecord(drsUri));
    }
  }, [dispatch, drsUri]);

  const { byUri } = useAppSelector((state) => state.drs);
  return byUri[drsUri];
};

export const useDrsHttpsAccessOrPassThrough = (url: string): string | null => {
  const dispatch = useAppDispatch();

  const parts = new URL(url);
  const isDrs = parts.protocol === 'drs:';

  useEffect(() => {
    if (isDrs) {
      dispatch(getDrsRecord(url));
    }
  }, [dispatch, url, isDrs]);

  const { byUri } = useAppSelector((state) => state.drs);

  if (isDrs) {
    return byUri[url]?.status !== RequestStatus.Fulfilled
      ? null
      : ((byUri[url].record?.access_methods ?? []).find((am) => am.type === 'https')?.access_url?.url ?? url);
  } else {
    return url;
  }
};
