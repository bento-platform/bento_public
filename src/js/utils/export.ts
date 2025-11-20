import FileSaver from 'file-saver';
import { katsuDiscoveryMatchesUrl } from '@/constants/configConstants';
import type { DiscoveryScopeSelection } from '@/features/metadata/metadata.store';
import type { ResultsDataEntity } from '@/types/entities';

// Download all matches as CSV from the discovery_matches endpoint
export const downloadAllMatchesCSV = async (
  headers: Record<string, string>,
  selectedScope: DiscoveryScopeSelection,
  filterQueryParams: Record<string, string>,
  textQuery: string,
  entity: ResultsDataEntity,
  filename: string
): Promise<void> => {
  const params = new URLSearchParams({
    ...selectedScope.scope,
    ...filterQueryParams,
    ...(textQuery ? { _fts: textQuery } : {}),
    _entity: entity,
    _format: 'csv',
  });

  const res = await fetch(`${katsuDiscoveryMatchesUrl}?${params.toString()}`, {
    method: 'GET',
    headers,
  });

  const blob = await res.blob();
  FileSaver.saveAs(blob, filename);
};
