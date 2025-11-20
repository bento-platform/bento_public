import FileSaver from 'file-saver';
import {
  biosampleBatchUrl,
  experimentBatchUrl,
  individualBatchUrl,
  katsuDiscoveryMatchesUrl,
} from '@/constants/configConstants';
import type { DiscoveryScopeSelection } from '@/features/metadata/metadata.store';
import type { ResultsDataEntity } from '@/types/entities';

// Katsu currently has the same CSV download request format for individuals, biosamples, and experiments
const downloadCSVHelper = async (url: string, headers: Record<string, string>, ids: string[], filename: string) => {
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      ...headers,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      id: ids,
      format: 'csv',
    }),
  });

  const blob = await res.blob();

  FileSaver.saveAs(blob, filename);
};

type DownloadFunction = (headers: Record<string, string>, ids: string[]) => Promise<void>;

export const downloadIndividualCSV: DownloadFunction = (headers, ids) =>
  downloadCSVHelper(individualBatchUrl, headers, ids, 'individuals.csv');

export const downloadBiosampleCSV: DownloadFunction = (headers, ids) =>
  downloadCSVHelper(biosampleBatchUrl, headers, ids, 'biosamples.csv');

export const downloadExperimentCSV: DownloadFunction = (headers, ids) =>
  downloadCSVHelper(experimentBatchUrl, headers, ids, 'experiments.csv');

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
