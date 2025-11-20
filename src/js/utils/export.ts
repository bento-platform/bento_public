import axios from 'axios';
import FileSaver from 'file-saver';
import { katsuDiscoveryMatchesUrl } from '@/constants/configConstants';
import type { RootState } from '@/store';
import { scopedAuthorizedRequestConfig } from '@/utils/requests';
import type { ResultsDataEntity } from '@/types/entities';

// Download all matches as CSV from the discovery_matches endpoint
export const downloadAllMatchesCSV = async (
  state: RootState,
  filterQueryParams: Record<string, string>,
  textQuery: string,
  entity: ResultsDataEntity,
  filename: string
): Promise<void> => {
  const config = scopedAuthorizedRequestConfig(state, {
    ...filterQueryParams,
    ...(textQuery ? { _fts: textQuery } : {}),
    _entity: entity,
    _format: 'csv',
  });

  const res = await axios.get(katsuDiscoveryMatchesUrl, {
    ...config,
    responseType: 'blob',
  });

  FileSaver.saveAs(res.data, filename);
};
