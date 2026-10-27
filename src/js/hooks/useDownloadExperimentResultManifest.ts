import { useCallback } from 'react';
import axios from 'axios';
import FileSaver from 'file-saver';
import { makeAuthorizationHeader } from 'bento-auth-js';

import type { DiscoveryScope } from '@/features/metadata/metadata.store';
import { useAppSelector } from '@/hooks';
import { experimentResultBatchUrl } from '@/constants/configConstants';
import { scopedAuthorizedRequestConfigFromParts } from '@/utils/requests';

// PCGL-only download-manifest (TSV) export for experiment results. Unlike the CSV/XLSX exports, both "all search
// results" and "selected rows" go through the same batch/experimentresults endpoint - GET (no id) for all results in
// the current scope, POST with an id list for a selection - since katsu only exposes the manifest renderer there.
export const useDownloadExperimentResultPcglManifest = (scope: DiscoveryScope) => {
  const auth = useAppSelector((state) => state.auth);

  return useCallback(
    async (ids: string[], filename: string) => {
      const res = ids.length
        ? await axios.post(
            experimentResultBatchUrl,
            { id: ids.map(Number), format: 'pcgl_manifest' },
            { headers: { ...makeAuthorizationHeader(auth.accessToken) }, responseType: 'blob' }
          )
        : await axios.get(experimentResultBatchUrl, {
            ...scopedAuthorizedRequestConfigFromParts(auth, scope, [['format', 'pcgl_manifest']]),
            responseType: 'blob',
          });

      FileSaver.saveAs(res.data, filename);
    },
    [auth, scope]
  );
};
