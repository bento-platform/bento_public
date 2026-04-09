import { useDrsAccessMethods } from '@/features/drs/hooks';
import { ExperimentResult } from '@/types/clinPhen/experiments/experimentResult';
import { caseInsensitiveIgvFileFormatLookup } from '@/utils/igv';

// more null checks?
const useGetIndexAccessUrl = (track: ExperimentResult): string | null => {
  const igVTrackTypeInfo = caseInsensitiveIgvFileFormatLookup(track.file_format);
  const acceptedIndicesThisType = igVTrackTypeInfo?.indexFormats;
  const index = track.indices.find((i) => acceptedIndicesThisType?.includes(i.format));
  const toReturn = useDrsAccessMethods(index?.url);

  // remove debug return 
  console.log(`useGetIndexAccessUrl returning url ${toReturn}`);
  return toReturn;

  // return useDrsAccessMethods(index?.url);
};

const hasIndex = (track: ExperimentResult) => {
  return track.indices.length > 0;
};

export const useIgvFileAndIndexAccessUrls = (tracks: ExperimentResult[]) => {
  const drsUrls: Record<string, { fileAccessUrl: string; indexAccessUrl: string | null }> = {};
  tracks.forEach((t) => {
    if (!t.url) return;
    const fileUrl = useDrsAccessMethods(t.url);

    const trackHasIndex = hasIndex(t);
    const indexUrl = trackHasIndex ? useGetIndexAccessUrl(t) : null;

    // for some renders returns {fileUrl: <fileUrl>, indexUrl: null} even when a correct index exists
    // since these are two different calls
    // ideally we don't want to return null for an index when an index is expected to exist 

    const gotFileAndIndexUrls = trackHasIndex && fileUrl !== null && indexUrl !== null;
    const gotUrlForFileWithNoIndex = !trackHasIndex && fileUrl !== null;

    // remove debug logs
    if (fileUrl && !indexUrl) {
      console.log('---------------- indexUrl null when fileUrl exists ---------------');
      console.log(`offending track: ${JSON.stringify(t)}`);
    }
    console.log(`useIgvFileAndIndexAccessUrls(): fileUrl: ${fileUrl}, indexUrl: ${indexUrl}`);

    // don't return null for an index when expected to exist
    // could probably improve this by following drs request status better 
    // either that or we return Promise<url> to IGV instead of a bare url
    if (gotFileAndIndexUrls || gotUrlForFileWithNoIndex) {
      drsUrls[t.url] = { fileAccessUrl: fileUrl, indexAccessUrl: indexUrl };
    }
  });

  //remove debug return
  const toReturn = Object.keys(drsUrls).length > 0 ? drsUrls : null;

  console.log(`returning from DRS: ${JSON.stringify(toReturn)}`);

  return Object.keys(drsUrls).length > 0 ? drsUrls : null;
};
