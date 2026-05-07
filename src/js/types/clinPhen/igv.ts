import type { Tracks, TrackLoad, TrackType, CreateOpt, GenomeDef, GenomeOpt, ReferenceGenome } from 'igv';
import { ExperimentResult } from '@/types/clinPhen/experiments/experimentResult';
import { Genome } from '@/features/reference/types';

export type TrackFormats =
  | Tracks.AlignmentFormat
  | Tracks.AnnotationFormat
  | Tracks.MutationFormat
  | Tracks.VariantFormat
  | Tracks.WigFormat;

// expand as needed
export type SupportedTrackType = 'alignment' | 'annotation' | 'wig' | 'variant' | 'mut';

export type IgvTrack = TrackLoad<SupportedTrackType>;

export type ExperimentResultWithView = ExperimentResult & { viewInIgv: boolean };

// export type IgvReference = Record<string, CreateOptExtras & GenomeOpt >

export type IgvReferenceById = Record<string, CreateOpt>;

export type IgvReferenceDetails = ReferenceGenome;

export type IgvAccessUrlPromisesById = Record<
  string,
  {
    fileAccessUrl: Promise<string | null>;
    indexAccessUrl?: Promise<string | null>;
  }
>;
