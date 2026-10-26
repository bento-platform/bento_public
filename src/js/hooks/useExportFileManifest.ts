import { useCallback } from 'react';
import { message } from 'antd';
import { useTranslationFn } from '@/hooks';
import { useDownloadExperimentResultPcglManifest } from '@/hooks/useDownloadExperimentResultManifest';

export const useExportFileManifest = (
  hasSelection: boolean,
  selectedIds: string[],
  setExporting: (exporting: boolean) => void
) => {
  const t = useTranslationFn();
  const downloadExperimentResultManifest = useDownloadExperimentResultPcglManifest();

  // Manifest (TSV) export - PCGL-only, experiment results only. Unlike CSV/XLSX, it has a fixed set of columns (no
  // field-selection modal) and always goes through the batch/experimentresults endpoint, for both "all" and
  // "selected" - see useDownloadExperimentResultManifest.
  return useCallback(() => {
    setExporting(true);
    const filename = `${t('entities.experiment_result_other')}.manifest.tsv`;
    downloadExperimentResultManifest(hasSelection ? selectedIds : [], filename)
      .catch(() => message.error(t('search.export_error')))
      .finally(() => setExporting(false));
  }, [t, hasSelection, selectedIds, downloadExperimentResultManifest, setExporting]);
};
