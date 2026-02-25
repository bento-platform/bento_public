import axios from 'axios';
import FileSaver from 'file-saver';
import { katsuDiscoveryMatchesUrl } from '@/constants/configConstants';
import { scopedAuthorizedRequestConfigFromParts } from '@/utils/requests';
import type { RootState } from '@/store';
import type { DiscoveryScopeSelection } from '@/features/metadata/metadata.store';
import type { FiltersState, QueryParamEntries } from '@/features/search/types';
import type { ResultsDataEntity } from '@/types/entities';
import { filtersStateToQueryParamEntries } from '@/features/search/utils';

type AuthState = RootState['auth'];

// Download all matches as CSV from the discovery_matches endpoint
export const downloadAllMatchesCSV = async (
  auth: AuthState,
  selectedScope: DiscoveryScopeSelection,
  filters: FiltersState,
  textQuery: string,
  entity: ResultsDataEntity,
  filename: string
): Promise<void> => {
  const config = scopedAuthorizedRequestConfigFromParts(auth, selectedScope, [
    ...filtersStateToQueryParamEntries(filters),
    ...(textQuery ? ([['_fts', textQuery]] as QueryParamEntries) : []),
    ['_entity', entity],
    ['_format', 'csv'],
    ['_page_size', '0'], // 0 means export all results
  ]);

  const res = await axios.get(katsuDiscoveryMatchesUrl, {
    ...config,
    responseType: 'blob',
  });

  FileSaver.saveAs(res.data, filename);
};
