import type { Biosample } from '@/types/clinPhen/biosample';
import type { Phenopacket } from '@/types/clinPhen/phenopacket';
import type { Experiment } from '@/types/clinPhen/experiments/experiment';
import type { ExperimentResult } from '@/types/clinPhen/experiments/experimentResult';
import type { Genome } from '@/features/reference/types';
import { viewableFormatsLower } from './igv';
// import { useReference } from '@/features/reference/hooks';
// import { Genome } from '@/features/reference/types';

// --- CONSTANTS ---
const ALIGNMENT_FORMATS_LOWER = ['bam', 'cram'];
const ANNOTATION_FORMATS_LOWER = ['bigbed'];
const MUTATION_FORMATS_LOWER = ['maf'];
const WIG_FORMATS_LOWER = ['bigwig'];
const VARIANT_FORMATS_LOWER = ['vcf', 'gvcf'];

const IGV_VIEWABLE_FORMATS_LOWER = [
  ...ALIGNMENT_FORMATS_LOWER,
  ...ANNOTATION_FORMATS_LOWER,
  ...MUTATION_FORMATS_LOWER,
  ...WIG_FORMATS_LOWER,
  ...VARIANT_FORMATS_LOWER,
];
// more options at https://igv.org/doc/igvjs/#Reference-Genome/
const IGV_JS_ANNOTATION_ALIASES = {
  GRCh37: 'hg19',
  GRCh38: 'hg38',
  GRCm38: 'mm10',
};

// temp?, ignore case when mapping to IGV assemblies
export const caseInsensitiveIgvAssemblyMapping = (key: string): string | undefined => {
  return Object.fromEntries(Object.entries(IGV_JS_ANNOTATION_ALIASES).map(([k, v]) => [k.toLowerCase(), v]))[
    key.toLowerCase()
  ];
};

// viewable assemblies?
// genome_assembly_id
// genomes in redux (twice)

// reference.genomesStatus
// reference.genomes
// reference.genomesByID

// should be able to use IGV default references if we don't have a local reference
// list of available igv references at https://igv.org/doc/igvjs/#Reference-Genome/
// longer list of UCSC GenArk references that can be used with iGV here: https://hgdownload.soe.ucsc.edu/hubs/UCSC_GI.assemblyHubList.txt
// ichange uses GRCm38 = mm10 for mouse reference

export const isViewableInIgv = (r: ExperimentResult, genomesByID: Record<string, Genome>): boolean => {
  // change to something from igv utils
  const viewableFileType = IGV_VIEWABLE_FORMATS_LOWER.includes((r.file_format ?? '').toLowerCase());

  // ******** needs to be less brittle, can also use igv defaults instead of local ********
  //  either:
  // handle the assembly lookup / mapping to IGV aliases here OR
  // ignore this issue here, handle assembly lookup in Tracks component
  // either way will will need a helper function which we can write whenever

  const assemblyId = r.genome_assembly_id ?? '';

  // remove
  const igvLookup = caseInsensitiveIgvAssemblyMapping(assemblyId);
  console.log(`assemblyId: ${assemblyId}, igvLookup: ${igvLookup}`);

  const hasAssembly = Object.keys(genomesByID).includes(assemblyId) || !!caseInsensitiveIgvAssemblyMapping(assemblyId);

  const hasDrsUrl = Boolean(r.url); // or just hasOwnKey?
  return viewableFileType && hasAssembly && hasDrsUrl;
};

export const phenopacketViewableExperimentResults = (
  p: Phenopacket | undefined,
  genomesByID: Record<string, Genome>
): ExperimentResult[] => {
  if (!p) {
    return [];
  }

  return phenopacketExperimentResults(p).filter((file) => isViewableInIgv(file, genomesByID));
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

export const experimentResults = (experiments: Experiment[]) => {};

export const assemblyIdsForExperiments = (experiments: ExperimentResult[]): string[] => [
  ...new Set(experiments.map((e) => e.genome_assembly_id as string)),
];
