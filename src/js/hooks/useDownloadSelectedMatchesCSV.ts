import { useCallback } from 'react';
import axios from 'axios';
import FileSaver from 'file-saver';
import { makeAuthorizationHeader } from 'bento-auth-js';

import { useAppSelector } from '@/hooks';
import { biosampleBatchUrl, experimentBatchUrl, individualBatchUrl } from '@/constants/configConstants';
import type { ResultsDataEntity } from '@/types/entities';

// experiment_result has no batch endpoint, so it's intentionally excluded here - selection export isn't supported
// for that table.
const BATCH_URL_BY_ENTITY: Partial<Record<ResultsDataEntity, string>> = {
  phenopacket: individualBatchUrl,
  biosample: biosampleBatchUrl,
  experiment: experimentBatchUrl,
};

export const useDownloadSelectedMatchesCSV = () => {
  const auth = useAppSelector((state) => state.auth);

  return useCallback(
    async (entity: ResultsDataEntity, ids: string[], filename: string, fields?: string[]) => {
      const url = BATCH_URL_BY_ENTITY[entity];
      if (!url) return;

      const res = await axios.post(
        url,
        { id: ids, format: 'csv', ...(fields && fields.length > 0 ? { fields } : {}) },
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
