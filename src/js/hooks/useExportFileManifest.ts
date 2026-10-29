import { useCallback, useMemo, useState } from 'react';
import axios from 'axios';
import FileSaver from 'file-saver';
import { message } from 'antd';
import { makeAuthorizationHeader } from 'bento-auth-js';

import { useAppSelector, useTranslationFn } from '@/hooks';
import { useSelectedScope } from '@/features/metadata/hooks';
import { useSearchQuery } from '@/features/search/hooks';
import { searchQueryParamsFromState } from '@/features/search/utils';
import { experimentResultBatchUrl, katsuDiscoveryMatchesUrl } from '@/constants/configConstants';
import { scopedAuthorizedRequestConfigFromParts } from '@/utils/requests';

/**
 * Manifest (TSV) export - PCGL-only, experiment results only. Unlike CSV/XLSX, it has a fixed set of columns (no
 * field-selection modal). What gets exported depends on the arguments and the row selection in Redux:
 *  - exportWholeScope: every result in the current scope, ignoring the search (GET batch/experimentresults)
 *  - rows selected in the experiment results table: just those (POST batch/experimentresults)
 *  - otherwise: all matches of the current search (GET discovery/matches with _format=pcgl_manifest)
 * @param exportWholeScope - Export every result in the scope, ignoring any search and row selection
 * @returns The export callback, and whether an export is in progress
 */
export const useExportFileManifest = (exportWholeScope: boolean) => {
  const [isExportingFileManifest, setIsExportingFileManifest] = useState(false);
  const t = useTranslationFn();
  const auth = useAppSelector((state) => state.auth);
  const { scope } = useSelectedScope();
  const query = useSearchQuery();
  const selectedRowMap = useAppSelector((state) => state.query.selectedRows.experiment_result);
  const selectedIds = useMemo(
    () => Object.values(selectedRowMap).filter((v): v is string => Boolean(v)),
    [selectedRowMap]
  );

  const exportFileManifest = useCallback(async () => {
    setIsExportingFileManifest(true);
    const filename = `${t('entities.experiment_result_other')}.manifest.tsv`;
    try {
      let res;
      if (exportWholeScope) {
        res = await axios.get(experimentResultBatchUrl, {
          ...scopedAuthorizedRequestConfigFromParts(auth, scope, [['format', 'pcgl_manifest']]),
          responseType: 'blob',
        });
      } else if (selectedIds.length) {
        res = await axios.post(
          experimentResultBatchUrl,
          { id: selectedIds.map(Number), format: 'pcgl_manifest' },
          { headers: { ...makeAuthorizationHeader(auth.accessToken) }, responseType: 'blob' }
        );
      } else {
        res = await axios.get(katsuDiscoveryMatchesUrl, {
          ...scopedAuthorizedRequestConfigFromParts(auth, scope, [
            ...searchQueryParamsFromState(query),
            ['_entity', 'experiment_result'],
            ['_format', 'pcgl_manifest'],
            ['_page_size', '0'], // 0 means export all results
          ]),
          responseType: 'blob',
        });
      }
      FileSaver.saveAs(res.data, filename);
    } catch {
      message.error(t('search.export_error'));
    } finally {
      setIsExportingFileManifest(false);
    }
  }, [t, auth, scope, query, exportWholeScope, selectedIds]);

  return { exportFileManifest, isExportingFileManifest };
};
