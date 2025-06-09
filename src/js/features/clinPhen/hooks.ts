import { useEffect } from 'react';
import { queryData } from 'bento-auth-js';

import { makeGetIndividualData } from '@/features/clinPhen/makeGetIndividualData.thunk';
import { makeGetPhenopacketData } from './makeGetPhenopacket.thunk';

import { useAppDispatch, useAppSelector, useHasScopePermission } from '@/hooks';

export const useIndividualData = (id: string) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(makeGetIndividualData(id));
  }, [dispatch, id]);

  const data = useAppSelector((state) => state.clinPhen.individualDataCache[id]);
  const status = useAppSelector((state) => state.clinPhen.individualDataStatus[id]);

  return { data, status };
};

export const usePhenopacketResources = (phenopacketId: string | undefined) => {
  const data =
    useAppSelector((state) => state.clinPhen.phenopacketDataCache[phenopacketId || '']?.meta_data?.resources) ?? [];
  return data;
};

export const usePhenopacketData = (phenopacketId: string) => {
  const dispatch = useAppDispatch();

  const phenopacket = useAppSelector((state) => state.clinPhen.phenopacketDataCache[phenopacketId]);
  const status = useAppSelector((state) => state.clinPhen.phenopacketDataStatus[phenopacketId]);
  const isAuthorized = useHasScopePermission(queryData);

  useEffect(() => {
    if (isAuthorized) {
      dispatch(makeGetPhenopacketData(phenopacketId));
    }
  }, [dispatch, phenopacketId, isAuthorized]);

  return { phenopacket, status, isAuthorized };
};
