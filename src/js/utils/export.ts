import FileSaver from 'file-saver';
import { biosampleBatchUrl, experimentBatchUrl, individualBatchUrl } from '@/constants/configConstants';

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
