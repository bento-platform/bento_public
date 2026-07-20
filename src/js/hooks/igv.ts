import { useMemo } from 'react';
import { useReference } from '@/features/reference/hooks';
import { useAppSelector } from '@/hooks';
import { assemblyIdsForExperiments } from '@/utils/experiments';
import { viewableFormatsLower } from '@/utils/igv';
import { caseInsensitiveObjectAccess } from '@/utils/objects';
import type { CreateOpt } from 'igv';
import type { ExperimentResult } from '@/types/clinPhen/experiments/experimentResult';
import type { IgvReferenceById } from '@/types/clinPhen/igv';
import { referenceGenomesUrl } from '@/constants/configConstants';
import { RequestStatus } from '@/types/requests';

export const useIgvReference = () => {
  return useAppSelector((state) => state.igv);
};

// igv-provided assemblies, there are lots more but these are the only ones that support feature lookup
const IGV_JS_ANNOTATION_ALIASES = {
  GRCh37: 'hg19',
  GRCh38: 'hg38',
  GRCm38: 'mm10',
};

// get references in IGV format, preferring ones from bento when present
export const useBentoOrIgvReferencesById = (requestedReferenceIds: string[]): IgvReferenceById => {
  const { genomesStatus: bentoGenomeStatus, genomesByID: bentoReferenceGenomes } = useReference();
  const { igvGenomesStatus, igvGenomesByID } = useIgvReference();

  return useMemo(() => {
    if (bentoGenomeStatus !== RequestStatus.Fulfilled) return {};

    const availableReferences: Record<string, CreateOpt> = {};

    requestedReferenceIds.forEach((r) => {
      const bentoRef = caseInsensitiveObjectAccess(r, bentoReferenceGenomes);

      const igvRefAlias = caseInsensitiveObjectAccess(r, IGV_JS_ANNOTATION_ALIASES);
      const igvRef = igvRefAlias ? igvGenomesByID[igvRefAlias] : null;

      if (bentoRef) {
        const ref = {
          reference: {
            id: bentoRef.id,
            fastaURL: bentoRef.fasta,
            indexURL: bentoRef.fai,
            cytobandURL: igvRef?.cytobandURL,
            tracks: bentoRef.gff3_gz
              ? [
                  {
                    name: 'Features',
                    type: 'annotation',
                    format: 'gff3',
                    filterTypes: ['chromosome', 'region', 'gene', '3_utr', '5_utr', 'CDS'],
                    url: bentoRef.gff3_gz,
                    indexURL: bentoRef.gff3_gz_tbi,
                    nameField: 'transcript_name',
                    order: 1000000,
                    visibilityWindow: 5000000,
                    height: 200,
                  },
                ]
              : [],
          },
          ...(bentoRef?.gff3_gz
            ? {
                search: {
                  url: `${referenceGenomesUrl}/$GENOME$/igv-js-features?q=$FEATURE$`,

                  // erroneous required fields, igv typescript is incorrect
                  chromosomeField: 'chromosome', // already the default for this value
                  displayName: '', // this value isn't even read anywhere
                },
              }
            : {}),
        };

        // assigning directly without naming variable gives ts errors, groan
        availableReferences[r] = ref;
      } else {
        // else no bento reference genome for this assembly, fall back to IGV reference if any
        if (igvRef) {
          availableReferences[r] = { genome: igvRef.id as string }; // ... for string-only reference
          // availableReferences[r] = { reference: igvRef }; // this throws errors, but igv doesn't like its own refseq reference
        }
      }
    });

    return availableReferences;
  }, [requestedReferenceIds, bentoGenomeStatus, bentoReferenceGenomes, igvGenomesStatus, igvGenomesByID]);
};

// file is viewable if it's ingested and a viewable track type
export const viewableTracks = (experimentResults: ExperimentResult[]) => {
  const tracksWithViewableFileType = experimentResults.filter((e) =>
    viewableFormatsLower.includes((e.file_format ?? '').toLowerCase())
  );
  const viewableTracksIngested = tracksWithViewableFileType.filter((e) => e.url);
  return viewableTracksIngested;
};
