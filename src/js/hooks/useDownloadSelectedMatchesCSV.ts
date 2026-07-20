import { useCallback } from 'react';
import axios from 'axios';
import FileSaver from 'file-saver';
import { makeAuthorizationHeader } from 'bento-auth-js';

import { useAppSelector } from '@/hooks';
import {
  biosampleBatchUrl,
  experimentBatchUrl,
  experimentResultBatchUrl,
  individualBatchUrl,
} from '@/constants/configConstants';
import type { ResultsDataEntity } from '@/types/entities';

const BATCH_URL_BY_ENTITY: Record<ResultsDataEntity, string> = {
  phenopacket: individualBatchUrl,
  biosample: biosampleBatchUrl,
  experiment: experimentBatchUrl,
  experiment_result: experimentResultBatchUrl,
};

export const useDownloadSelectedMatchesCSV = () => {
  const auth = useAppSelector((state) => state.auth);

  return useCallback(
    async (entity: ResultsDataEntity, ids: string[], filename: string, fields?: string[]) => {
      const url = BATCH_URL_BY_ENTITY[entity];

      // batch/experimentresults IDs are integers, not strings - sending a stringified ID errors rather than being
      // silently dropped, unlike the other three batch endpoints.
      const id = entity === 'experiment_result' ? ids.map(Number) : ids;

      const res = await axios.post(
        url,
        { id, format: 'csv', ...(fields && fields.length > 0 ? { fields } : {}) },
        {
          headers: { ...makeAuthorizationHeader(auth.accessToken) },
          responseType: 'blob',
        }
      );

      FileSaver.saveAs(res.data, filename);
    },
    [auth]
  );
};
