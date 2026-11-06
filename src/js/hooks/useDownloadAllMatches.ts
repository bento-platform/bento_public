import { useCallback } from 'react';
import { useSelectedScope } from '@/features/metadata/hooks';
import { useSearchQuery } from '@/features/search/hooks';
import type { ExportDataEntity, ExportFormat } from '@/types/entities';
import { scopedAuthorizedRequestConfigFromParts } from '@/utils/requests';
import { searchQueryParamsFromState } from '@/features/search/utils';
import axios from 'axios';
import { katsuDiscoveryMatchesUrl } from '@/constants/configConstants';
import FileSaver from 'file-saver';

export const useDownloadAllMatches = () => {
  const query = useSearchQuery();
  const selectedScope = useSelectedScope();

  return useCallback(
    async (entity: ExportDataEntity, format: ExportFormat, filename: string, fields?: string[]) => {
      const config = scopedAuthorizedRequestConfigFromParts(selectedScope, [
        ...searchQueryParamsFromState(query),
        ['_entity', entity],
        ['_format', format],
        ['_page_size', '0'], // 0 means export all results
        ...(fields && fields.length > 0 ? [['_fields', fields.join(',')] as [string, string]] : []),
      ]);

      const res = await axios.get(katsuDiscoveryMatchesUrl, {
        ...config,
        responseType: 'blob',
      });

      FileSaver.saveAs(res.data, filename);
    },
    [query, selectedScope]
  );
};
