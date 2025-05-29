import type { KatsuIndividualMatch } from '@/features/search/types';
import type { ChartConfig } from '@/types/discovery/chartConfig';
import type { Field } from '@/types/discovery/fieldDefinition';

export type Sections = Section[];

export type Section = {
  sectionTitle: string;
  charts: ChartDataField[];
};

/*
ChartDataField represents a compound object which holds information about a chart's configuration, the relevant data
(mapped to a chart-compatible format), and the field descriptor - the field from which this data was selected.

This represents a chart's "state", since it also has the isDisplayed property - whether the chart is shown.
 */
export interface ChartDataField {
  id: string; // taken from field definition
  data: ChartData[];
  field: Field;
  chartConfig: ChartConfig;
  // display options:
  isDisplayed: boolean; // whether the chart is currently displayed (state data)
  width: number; // current width (state data); initial data taken from chart config
}

export interface ChartData {
  x: string;
  y: number;
}

export type LocalStorageData = {
  [key in string]: { id: string; isDisplayed: boolean; width: number }[];
};

export type OptionalDiscoveryResults = {
  // individuals
  individualCount?: number;
  individualMatches?: KatsuIndividualMatch[];
  // biosamples
  biosampleCount?: number;
  biosampleChartData?: ChartData[];
  // experiments
  experimentCount?: number;
  experimentChartData?: ChartData[];
};

export type DiscoveryResults = OptionalDiscoveryResults & {
  individualCount: number;
  // individualMatches: kept optional from OptionalDiscoveryResults; undefined if no permissions.
  biosampleCount: number;
  experimentCount: number;
  biosampleChartData: ChartData[];
  experimentChartData: ChartData[];
};
