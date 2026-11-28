import { useMemo } from 'react';
import { downloadData, queryData } from 'bento-auth-js';
import { useConfig } from '@/features/config/hooks';
import { useHasScopePermission } from '@/hooks';
import type { DatasetWithProject } from '@/features/catalogue/constants';
import type { Dataset } from '@/types/dataset';
import type { DiscoveryConfig } from '@/types/discovery/config';
import type { KatsuEntityCountsOrBooleans } from '@/types/entities';
import type { Project } from '@/types/metadata';

export const useScopeQueryData = () => useHasScopePermission(queryData);
export const useScopeDownloadData = () => useHasScopePermission(downloadData);

export const useCanSeeUncensoredCounts = () => {
  const { hasPermission: queryDataPerm } = useScopeQueryData();
  const { countThreshold } = useConfig();

  // Used mostly for UI - showing dashes vs "0".
  // True when we have query:data permissions or the low cell count threshold is zero
  return queryDataPerm || countThreshold <= 0;
};

export const useCountsAreRounded = () => {
  const canSeeUncensoredCounts = useCanSeeUncensoredCounts();
  const { countRounding } = useConfig();

  // Katsu rounds counts to the nearest multiple of count_rounding for users without query:data.
  // A rounding of 0 or 1 does not change any count.
  return !canSeeUncensoredCounts && countRounding > 1;
};

/** The current scope's rounding if its counts are rounded, otherwise null. */
export const useScopeCountRounding = (): number | null => {
  const countsAreRounded = useCountsAreRounded();
  const { countRounding } = useConfig();
  return countsAreRounded ? countRounding : null;
};

/** count_rounding of a discovery config, or undefined if the config is not set (Katsu then uses the next level up). */
const discoveryCountRounding = (discovery: DiscoveryConfig | null | undefined): number | undefined =>
  discovery && Object.keys(discovery).length > 0 ? (discovery.rules?.count_rounding ?? 0) : undefined;

/** True if at least one count shows as a number. Zero shows as dashes and booleans show as ">threshold". */
const hasShownNumericCount = (counts: KatsuEntityCountsOrBooleans | undefined): boolean =>
  !!counts && Object.values(counts).some((c) => typeof c === 'number' && c > 0);

/**
 * The rounding Katsu uses for a dataset's counts: the dataset config, then the project config, then the current
 * scope's rules. If `project` is not given, the current scope must be the dataset's project (e.g. project Explore),
 * so its rules already include the project config.
 */
const datasetCountRounding = (dataset: Dataset, project: Project | undefined, scopeCountRounding: number): number =>
  discoveryCountRounding(dataset.discovery) ??
  (project ? discoveryCountRounding(project.discovery) : undefined) ??
  scopeCountRounding;

/*
 * Note: the hooks below check query:data in the current scope only, because per-dataset permissions are not fetched
 * yet. A user with query:data on one dataset but not on the current scope sees the info icon for that dataset.
 */

/** True if at least one dataset has rounded counts that show as numbers. Used for totals across datasets. */
export const useCatalogueCountsAreRounded = (datasets: DatasetWithProject[]): boolean => {
  const { hasPermission: queryDataPerm } = useScopeQueryData();
  const { countRounding } = useConfig();

  return useMemo(
    () =>
      !queryDataPerm &&
      datasets.some(
        ({ dataset, project }) =>
          hasShownNumericCount(dataset.counts_by_entity) && datasetCountRounding(dataset, project, countRounding) > 1
      ),
    [datasets, queryDataPerm, countRounding]
  );
};

/**
 * The dataset's rounding if its shown counts are rounded, otherwise null.
 * Checks the dataset's total counts: a card with filtered counts also shows the totals (e.g. "— / 100").
 */
export const useDatasetCountRounding = (dataset: Dataset, project?: Project): number | null => {
  const { hasPermission: queryDataPerm } = useScopeQueryData();
  const { countRounding } = useConfig();

  if (queryDataPerm || !hasShownNumericCount(dataset.counts_by_entity)) return null;
  const rounding = datasetCountRounding(dataset, project, countRounding);
  return rounding > 1 ? rounding : null;
};
