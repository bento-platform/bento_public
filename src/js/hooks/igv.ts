import { useDrsAccessMethods } from '@/features/drs/hooks';
import { useReference } from '@/features/reference/hooks';
import { caseInsensitiveIgvFileInfoLookup } from '@/utils/igv';
import { assemblyIdsForExperiments } from '@/utils/experiments';
import type { ExperimentResult } from '@/types/clinPhen/experiments/experimentResult';
import { RequestStatus } from '@/types/requests';

import type { CreateOpt } from 'igv';

import type { IgvReference } from '@/types/clinPhen/igv';
import { caseInsensitiveObjectAccess } from '@/utils/objects';
import { Genome } from '@/features/reference/types';

// more null checks?
const useGetIndexAccessUrl = (track: ExperimentResult): string | null => {
  const igVTrackTypeInfo = caseInsensitiveIgvFileInfoLookup(track.file_format);
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

  console.log('useIgvFileAndIndexAccessUrls');

  tracks.forEach((t) => {
    if (!t.url) return;
    const fileUrl = useDrsAccessMethods(t.url);
    const trackHasIndex = hasIndex(t);
    const indexUrl = trackHasIndex ? useGetIndexAccessUrl(t) : null;
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

  console.log(`returning from useIgvFileAndIndexAccessUrls: ${JSON.stringify(toReturn)}`);

  return Object.keys(drsUrls).length > 0 ? drsUrls : null;
};

// igv-provided assemblies, there are lots more but these are the only ones that support feature lookup
const IGV_JS_ANNOTATION_ALIASES = {
  GRCh37: 'hg19',
  GRCh38: 'hg38',
  GRCm38: 'mm10',
};

// type SupportedIgvGenomes = 'hg19' | 'hg38' | 'mm10'

// get references in IGV format, preferring ones from bento when present
export const useBentoOrIgvReferencesById = (requestedReferenceIds: string[]) => {
  const { genomesStatus: bentoGenomeStatus, genomesByID: bentoReferenceGenomes } = useReference();

  if (bentoGenomeStatus !== RequestStatus.Fulfilled) return {};

  const availableReferences: Record<string, CreateOpt> = {};
  requestedReferenceIds.forEach((r) => {
    const bentoRef = caseInsensitiveObjectAccess(r, bentoReferenceGenomes);
    if (bentoRef) {
      const ref = {
        reference: {
          id: bentoRef.id,
          fastaURL: bentoRef.fasta,
          indexURL: bentoRef.fai,
          // can pull cytoband url from igv even when using bento reference
          tracks: bentoRef.gff3_gz
            ? [
                {
                  name: 'Features',
                  type: 'annotation',
                  format: 'gff3',
                  filterTypes: ['chromosome', 'region', 'gene', '3_utr', '5_utr', 'CDS'],
                  url: bentoRef.gff3_gz,
                  indexURL: bentoRef.gff3_gz_tbi,
                  order: 1000000,
                  visibilityWindow: 5000000,
                  height: 200,
                },
              ]
            : [],
        },
      };

      // assigning directly without naming variable gives ts errors, groan
      availableReferences[r] = ref;
    } else {
      // else no bento reference genome for this assembly, fall back to IGV reference or null if none
      const igvRef = caseInsensitiveObjectAccess(r, IGV_JS_ANNOTATION_ALIASES);
      if (igvRef) {
        availableReferences[r] = { genome: igvRef };
      }
    }
  });

  console.log({ requestedReferenceIds });
  console.log({ bentoReferenceGenomes });

  return availableReferences;
};

// file is viewable if it's a viewable track type and a reference exists for it
// return references here so we don't have to look them up again later
export const useGetTracksAndReferencesForIgv = (experimentResults: ExperimentResult[]) => {
  const { genomesStatus: bentoGenomeStatus, genomesByID: bentoReferenceGenomes } = useReference();
  const emptyResponse = { tracks: [] as ExperimentResult[], referencesById: {} as Record<string, Genome> }; // avoids multiple null checks elsewhere
  if (bentoGenomeStatus !== RequestStatus.Fulfilled) return emptyResponse;

  // or check against viewableFormatsLower
  const tracksWithViewableFileType = experimentResults.filter((e) => caseInsensitiveIgvFileInfoLookup(e.file_format));
  const viewableTracksIngested = tracksWithViewableFileType.filter((e) => e.url);

  console.log({ viewableTracksIngested });

  const requestedAssemblies = assemblyIdsForExperiments(viewableTracksIngested);
  const referencesById = useBentoOrIgvReferencesById(requestedAssemblies);
  return { tracks: viewableTracksIngested, referencesById };
};

// ..... for misspelled references, misspelling is currently only possible from the reference service and from gohan
// the experiment metadata can't be misspelled, since it's validated against the schema during ingestion
