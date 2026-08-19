import { useEffect } from 'react';

import { makeGetBiosampleData } from './makeGetBiosampleData.thunk';
import { makeGetIndividualData } from './makeGetIndividualData.thunk';
import { makeGetPhenopacketData } from './makeGetPhenopacket.thunk';
import { makeGetExperimentData } from './makeGetExperimentData.thunk';
import { makeGetExperimentResultData } from './makeGetExperimentResultData.thunk';

import { useAppDispatch, useAppSelector } from '@/hooks';
import { useScopeQueryData } from '@/hooks/censorship';
import type { Biosample } from '@/types/clinPhen/biosample';
import type { Individual } from '@/types/clinPhen/individual';
import type { Phenopacket } from '@/types/clinPhen/phenopacket';
import type { Experiment } from '@/types/clinPhen/experiments/experiment';
import type { ExperimentResult } from '@/types/clinPhen/experiments/experimentResult';
import { RequestStatus } from '@/types/requests';

// TODO: also experiment
type EntityDataResult<T = Individual | Phenopacket | Biosample> = {
  data: T | undefined;
  status: RequestStatus;
  // TODO: name for this type in bento_auth_js
  isAuthorized: {
    fetchingPermission: boolean;
    hasAttempted: boolean;
    hasPermission: boolean;
  };
};

export const useIndividualData = (id: string): EntityDataResult<Individual> => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(makeGetIndividualData(id));
  }, [dispatch, id]);

  const data = useAppSelector((state) => state.clinPhen.individualDataCache[id]);
  const status = useAppSelector((state) => state.clinPhen.individualDataStatus[id]) ?? RequestStatus.Idle;
  const isAuthorized = useScopeQueryData();

  return { data, status, isAuthorized };
};

export const usePhenopacketResources = (phenopacketId: string | undefined) =>
  useAppSelector((state) => state.clinPhen.phenopacketDataCache[phenopacketId || '']?.meta_data?.resources) ?? [];

export const usePhenopacketData = (phenopacketId: string): EntityDataResult<Phenopacket> => {
  const dispatch = useAppDispatch();

  const data = useAppSelector((state) => state.clinPhen.phenopacketDataCache[phenopacketId]);
  const status = useAppSelector((state) => state.clinPhen.phenopacketDataStatus[phenopacketId]);
  const isAuthorized = useScopeQueryData();

  useEffect(() => {
    if (isAuthorized.hasPermission) {
      dispatch(makeGetPhenopacketData(phenopacketId));
    }
  }, [dispatch, phenopacketId, isAuthorized]);

  return { data, status, isAuthorized };
};

export const useBiosampleData = (biosampleId: string): EntityDataResult<Biosample> => {
  const dispatch = useAppDispatch();

  const data = useAppSelector((state) => state.clinPhen.biosampleDataCache[biosampleId]);
  const status = useAppSelector((state) => state.clinPhen.biosampleDataStatus[biosampleId]);
  const isAuthorized = useScopeQueryData();

  useEffect(() => {
    if (isAuthorized.hasPermission) {
      dispatch(makeGetBiosampleData(biosampleId));
    }
  }, [dispatch, biosampleId, isAuthorized]);

  return { data, status, isAuthorized };
};

export const useExperimentData = (experimentId: string): EntityDataResult<Experiment> => {
  const dispatch = useAppDispatch();

  const data = useAppSelector((state) => state.clinPhen.experimentDataCache[experimentId]);
  const status = useAppSelector((state) => state.clinPhen.experimentDataStatus[experimentId]);
  const isAuthorized = useScopeQueryData();

  useEffect(() => {
    if (isAuthorized.hasPermission) {
      dispatch(makeGetExperimentData(experimentId));
    }
  }, [dispatch, experimentId, isAuthorized]);

  return { data, status, isAuthorized };
};

export const useExperimentResultData = (experimentResultId: number): EntityDataResult<ExperimentResult> => {
  const dispatch = useAppDispatch();

  const data = useAppSelector((state) => state.clinPhen.experimentResultDataCache[experimentResultId]);
  const status = useAppSelector((state) => state.clinPhen.experimentResultDataStatus[experimentResultId]);
  const isAuthorized = useScopeQueryData();

  useEffect(() => {
    if (isAuthorized.hasPermission) {
      dispatch(makeGetExperimentResultData(experimentResultId));
    }
  }, [dispatch, experimentResultId, isAuthorized]);

  return { data, status, isAuthorized };
};
