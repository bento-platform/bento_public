import { BEACON_URL, BEACON_NETWORK_URL } from '@/config';
import { BEACON_INDIVIDUALS_PATH, BEACON_FILTERING_TERMS_PATH, BEACON_OVERVIEW_PATH } from './constants';
import type {
  BeaconAssemblyIds,
  BeaconFilteringTermFromEndpoint,
  BeaconFilterUiOptions,
  BeaconNetworkResponses,
  BeaconQueryResponse,
  BeaconFilterSection,
} from '@/types/beacon';
import type { Field, Section } from '@/types/search';
import type { ChartData, DiscoveryResults, OptionalDiscoveryResults } from '@/types/data';
import type { NetworkBeacon } from '@/types/beaconNetwork';
import type { Dataset, Project } from '@/types/metadata';
import { serializeChartData } from '@/utils/chart';

type TempChartObject = Record<string, number>;

const chartArrayToChartObj = (cArr: ChartData[]): TempChartObject => {
  const obj: TempChartObject = {};
  cArr.forEach((c) => {
    obj[c.x] = c.y;
  });
  return obj;
};

const chartObjToChartArr = (cObj: TempChartObject): ChartData[] => {
  const arr = [];
  for (const key in cObj) {
    arr.push({ x: key, y: cObj[key] });
  }
  return arr;
};

const mergeCharts = (c1: ChartData[], c2: ChartData[]): ChartData[] => {
  const merged = chartArrayToChartObj(c1);
  c2.forEach((c) => {
    merged[c.x] = (merged[c.x] ?? 0) + c.y;
  });
  return chartObjToChartArr(merged);
};

export const computeNetworkResults = (responses: BeaconNetworkResponses) => {
  const overview: DiscoveryResults = {
    individualCount: 0,
    biosampleCount: 0,
    experimentCount: 0,
    biosampleChartData: [],
    experimentChartData: [],
  };

  Object.values(responses).forEach(({ results }) => {
    overview.individualCount += results.individualCount ?? 0;
    overview.biosampleCount += results.experimentCount ?? 0;
    overview.experimentCount += results.experimentCount ?? 0;
    overview.biosampleChartData = mergeCharts(overview.biosampleChartData, results.biosampleChartData ?? []);
    overview.experimentChartData = mergeCharts(overview.experimentChartData, results.experimentChartData ?? []);
  });
  return overview;
};

export const networkAssemblyIds = (beacons: NetworkBeacon[]) => {
  // reduce to list of assemblies
  // could probably do this in backend instead
  const assemblyIds = beacons.reduce(
    (assemblies: BeaconAssemblyIds, b: NetworkBeacon) => [...assemblies, ...Object.keys(b.overview?.variants ?? {})],
    []
  );
  // return unique values only
  return [...new Set(assemblyIds)];
};

export const networkQueryUrl = (beaconId: string, endpoint: string): string =>
  `${BEACON_NETWORK_URL}/beacons/${beaconId}${endpoint}`;

export const extractBeaconDiscoveryOverview = (response: BeaconQueryResponse): OptionalDiscoveryResults => ({
  // Bento-specific counts/chart data
  ...(response.info?.bento
    ? {
        biosampleCount: response.info.bento.biosamples?.count,
        biosampleChartData: serializeChartData(response.info.bento.biosamples?.sampled_tissue),
        experimentCount: response.info.bento.experiments?.count,
        experimentChartData: serializeChartData(response.info.bento.experiments?.experiment_type),
      }
    : {}),

  // Beacon-standard individuals count
  ...(response.responseSummary
    ? {
        individualCount: response.responseSummary.numTotalResults,
      }
    : {}),
});

export const atLeastOneNetworkResponseIsPending = (responses: BeaconNetworkResponses) =>
  Object.values(responses).some((r) => r.isFetchingQueryResponse);

const scopedBeaconBaseUrl = (projectId: Project['identifier'] | undefined): string => {
  const projectPath = projectId ? '/' + projectId : '';
  return BEACON_URL + projectPath;
};

export const scopedBeaconFilteringTermsUrl = (
  projectId: Project['identifier'] | undefined,
  datasetId: Dataset['identifier'] | undefined
): string => {
  const datasetIdParam = datasetId ? '?' + 'datasetIds=' + datasetId : '';
  return scopedBeaconBaseUrl(projectId) + BEACON_FILTERING_TERMS_PATH + datasetIdParam;
};

export const scopedBeaconIndividualsUrl = (projectId: Project['identifier'] | undefined): string => {
  return scopedBeaconBaseUrl(projectId) + BEACON_INDIVIDUALS_PATH;
};

export const scopedBeaconOverviewUrl = (projectId: Project['identifier'] | undefined): string => {
  return scopedBeaconBaseUrl(projectId) + BEACON_OVERVIEW_PATH;
};

// package flat beacon filtering terms array into an array of categories (similar to katsu query params)
export const packageBeaconFilteringTerms = (filters: BeaconFilteringTermFromEndpoint[]): BeaconFilterSection[] => {
  // temp object to simplify merging fields by category
  const tempFiltersObj: Record<string, BeaconFilterUiOptions[]> = {};
  filters.forEach((f) => {
    const { bento, ...filter_details } = f;
    tempFiltersObj[bento.section] = (tempFiltersObj[bento.section] ?? []).concat(filter_details);
  });
  // then return as an array of categories
  return Object.keys(tempFiltersObj).map((key) => ({ section_title: key, fields: tempFiltersObj[key] }));
};

// temp repackaging of network filters from katsu format to beacon filters format
// can be removed once network stops calling katsu
export const packageBeaconNetworkQuerySections = (qs: Section[]) => {
  return qs.map((q) => ({
    ...q,
    fields: q.fields.map((f: Field) => {
      const filter: BeaconFilterUiOptions = {
        type: 'alphanumeric',
        id: f.id,
        label: f.title,
        description: f.description,
        values: f.options,
      };
      const units = f.config?.units;
      if (units) {
        filter.units = units;
      }
      return filter;
    }),
  }));
};
