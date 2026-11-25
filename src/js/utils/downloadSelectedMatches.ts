import axios from 'axios';
import FileSaver from 'file-saver';

import {
  biosampleBatchUrl,
  experimentBatchUrl,
  experimentResultBatchUrl,
  individualBatchUrl,
} from '@/constants/configConstants';
import type { ExportDataEntity, ExportFormat } from '@/types/entities';

const BATCH_URL_BY_ENTITY: Record<ExportDataEntity, string> = {
  individual: individualBatchUrl,
  biosample: biosampleBatchUrl,
  experiment: experimentBatchUrl,
  experiment_result: experimentResultBatchUrl,
};

export const downloadSelectedMatches = async (
  entity: ExportDataEntity,
  ids: string[],
  format: ExportFormat,
  filename: string,
  fields?: string[]
) => {
  const url = BATCH_URL_BY_ENTITY[entity];

  // batch/experimentresults IDs are integers, not strings - sending a stringified ID errors rather than being
  // silently dropped, unlike the other three batch endpoints.
  const id = entity === 'experiment_result' ? ids.map(Number) : ids;

  const res = await axios.post(
    url,
    { id, format, ...(fields && fields.length > 0 ? { fields } : {}) },
    { responseType: 'blob' }
  );

  FileSaver.saveAs(res.data, filename);
};
