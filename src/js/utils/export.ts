import FileSaver from 'file-saver';
import { individualBatchUrl } from '@/constants/configConstants';

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

export const downloadIndividualCSV = async (headers: Record<string, string>, ids: string[]) =>
  await downloadCSVHelper(individualBatchUrl, headers, ids, 'individuals.csv');
