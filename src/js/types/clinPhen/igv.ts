import type { Tracks, TrackLoad, TrackType, CreateOpt, GenomeOpt,  } from 'igv';
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
export type IgvReference = Record<string, CreateOpt >

