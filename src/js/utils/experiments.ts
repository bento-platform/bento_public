import type { Biosample } from '@/types/clinPhen/biosample';
import type { Phenopacket } from '@/types/clinPhen/phenopacket';
import type { Experiment } from '@/types/clinPhen/experiments/experiment';
import type { ExperimentResult } from '@/types/clinPhen/experiments/experimentResult';
import { IGV_JS_ANNOTATION_ALIASES } from './igv';

// ignore case when mapping to IGV assemblies
export const caseInsensitiveIgvAssemblyMapping = (key: string): string | undefined => {
  return Object.fromEntries(Object.entries(IGV_JS_ANNOTATION_ALIASES).map(([k, v]) => [k.toLowerCase(), v]))[
    key.toLowerCase()
  ];
};

export const phenopacketExperiments = (p: Phenopacket): Experiment[] =>
  (p.biosamples ?? []).flatMap((b: Biosample) => b?.experiments ?? []);

export const phenopacketExperimentResults = (p: Phenopacket): ExperimentResult[] => {
  const experimentResults: Record<number, ExperimentResult> = {};

  phenopacketExperiments(p).forEach((e: Experiment) => {
    (e.experiment_results ?? []).forEach((er: ExperimentResult) => {
      if (!(er.id in experimentResults)) {
        experimentResults[er.id] = { ...er, experiments: [] };
      }
      experimentResults[er.id].experiments?.push(e.id);
    });
  });

  return Object.values(experimentResults);
};

export const assemblyIdsForExperiments = (experiments: ExperimentResult[]): string[] => [
  ...new Set(experiments.map((e) => e.genome_assembly_id as string)),
];
