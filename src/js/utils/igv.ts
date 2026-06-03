import type { ExperimentResult, ExperimentResultIndex } from '@/types/clinPhen/experiments/experimentResult';
import type { TrackType } from 'igv';
import type { IgvAccessUrlPromisesById, TrackFormats } from '@/types/clinPhen/igv';
import { getDrsAccessMethods } from '@/features/drs/hooks';


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
export const viewableFormatsLower = viewableFormats.map((f) => f.toLowerCase());

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

export const hasIndex = (track: ExperimentResult) => {
  // index currently optional, ExperimentResult type needs fixing
  return (track.indices ?? '').length > 0;
};






//  ---------------------------------------------
// async equivalents of igv hooks


const getIndexAccessUrl = async (track: ExperimentResult): Promise<string | null> => {
  const igVTrackTypeInfo = caseInsensitiveIgvFileInfoLookup(track.file_format);
  const acceptedIndicesThisType = igVTrackTypeInfo?.indexFormats;
  const index = track.indices.find((i) => acceptedIndicesThisType?.includes(i.format));
  const toReturn = getDrsAccessMethods(index?.url || "");

  // remove debug return
  console.log(`getIndexAccessUrl returning url ${JSON.stringify(toReturn)}`);
  return toReturn;

  // return getIndexAccessUrl(index?.url);
};

export const getIgvFileAndIndexAccessUrls = (tracks: ExperimentResult[]): IgvAccessUrlPromisesById  => {
  const drsUrls: Record<string, { fileAccessUrl: Promise<string | null>; indexAccessUrl?: Promise<string | null> }> = {};

  tracks.forEach((t) => {
    if (!t.url) return;
    const fileUrl = getDrsAccessMethods(t.url);
    // if (!fileUrl) return;
    const trackHasIndex = hasIndex(t);
    const indexUrl = trackHasIndex ? getIndexAccessUrl(t) : null;
    const gotFileAndIndexUrls = trackHasIndex && indexUrl !== null;
    const gotUrlForFileWithNoIndex = !trackHasIndex;

    // all this bool fiddling probably no longer needed 
    if (gotFileAndIndexUrls || gotUrlForFileWithNoIndex) {
      drsUrls[t.url] = { fileAccessUrl: fileUrl};
      if (indexUrl) {
        drsUrls[t.url].indexAccessUrl = indexUrl;
      }
    }
  });

  return Object.keys(drsUrls).length > 0 ? drsUrls : {};
};
