import { BEACON_NETWORK_URL } from '@/config';
import type { BeaconAssemblyIds, BeaconNetworkResponses, BeaconQueryResponse } from '@/types/beacon';
import type { ChartData, DiscoveryResults, OptionalDiscoveryResults } from '@/types/data';
import type { NetworkBeacon } from '@/types/beaconNetwork';
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
