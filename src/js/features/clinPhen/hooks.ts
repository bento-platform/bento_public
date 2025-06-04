import { useEffect } from 'react';
import { useIsAuthenticated } from 'bento-auth-js';

import { makeGetIndividualData } from '@/features/clinPhen/makeGetIndividualData.thunk';
import { makeGetPhenopacketData } from './makeGetPhenopacket.thunk';

import { useAppDispatch, useAppSelector } from '@/hooks';

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
  if (!phenopacketId) {
    return [];
  }

  const data =
    useAppSelector((state) => state.clinPhen.phenopacketDataCache[phenopacketId]?.meta_data?.resources) ?? [];
  return data;
};

export const usePhenopacketData = (phenopacketId: string) => {
  const dispatch = useAppDispatch();

  const authenticated = useIsAuthenticated(); // Temporary: removed once phenopacket view is integrated with search
  const phenopacket = useAppSelector((state) => state.clinPhen.phenopacketDataCache[phenopacketId]);
  const status = useAppSelector((state) => state.clinPhen.phenopacketDataStatus[phenopacketId]);

  useEffect(() => {
    dispatch(makeGetPhenopacketData(phenopacketId));
  }, [dispatch, phenopacketId]);

  return { phenopacket, status, authenticated };
};
