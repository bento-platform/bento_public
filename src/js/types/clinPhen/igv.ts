import type { Tracks, TrackLoad, TrackType } from 'igv';
import { ExperimentResult } from '@/types/clinPhen/experiments/experimentResult';

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
