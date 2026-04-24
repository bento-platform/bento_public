import { ExperimentResult, ExperimentResultIndex } from '@/types/clinPhen/experiments/experimentResult';
import type { TrackType } from 'igv';
import type { TrackFormats } from '@/types/clinPhen/igv';

// can add gff3, gtf, etc
export const IGV_FILE_TYPE_INFO: Partial<
  Record<TrackFormats, { trackType: TrackType; indexFormats?: ExperimentResultIndex['format'][] }>
> = {
  bam: { trackType: 'alignment', indexFormats: ['BAI', 'CSI'] },
  bed: { trackType: 'annotation', indexFormats: ['TABIX'] },
  bigBed: { trackType: 'annotation' },
  bigWig: { trackType: 'wig' },
  cram: { trackType: 'alignment', indexFormats: ['CRAI'] },
  maf: { trackType: 'mut' },
  mut: { trackType: 'mut' },
  vcf: { trackType: 'variant', indexFormats: ['TABIX', 'TRIBBLE'] },
  wig: { trackType: 'wig' },
};

const viewableFormats: TrackFormats[] = Object.keys(IGV_FILE_TYPE_INFO) as TrackFormats[];

// temp?
// may not need case insensitive stuff below if we use this
export const viewableFormatsLower = viewableFormats.map((f) => f.toLocaleLowerCase());

const getFormattedName = (input: ExperimentResult['file_format']): TrackFormats | null => {
  if (!input) return null; //courtesy typescript guard
  return viewableFormats.find((format) => format.toLowerCase() === input.toLowerCase()) || null;
};

export const caseInsensitiveIgvFileInfoLookup = (filetype: ExperimentResult['file_format']) => {
  const casedFileFormat = getFormattedName(filetype);
  if (!casedFileFormat) {
    return null;
  }
  return { ...IGV_FILE_TYPE_INFO[casedFileFormat], fileFormat: casedFileFormat };
};
