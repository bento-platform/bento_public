import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Drawer, FloatButton } from 'antd';
import { BarsOutlined } from '@ant-design/icons';

import type { Phenopacket } from '@/types/clinPhen/phenopacket';
import type { ExperimentResult } from '@/types/clinPhen/experiments/experimentResult';

import { useTranslationFn } from '@/hooks';
import { Genome } from '@/features/reference/types';
import { useReference } from '@/features/reference/hooks';

import { useAccessToken } from 'bento-auth-js';

import igv from 'igv/dist/igv.esm';
import type { Browser, CreateOpt, GenomeOpt } from 'igv';
import type { IgvTrack, SupportedTrackType, ExperimentResultWithView } from '@/types/clinPhen/igv';

import { PUBLIC_URL } from '@/config';

import JsonView from '@Util/JsonView'; //temp
import { JSONType } from 'bento-file-display/dist'; //temp

import { caseInsensitiveIgvFileInfoLookup } from '@/utils/igv';
import { useBentoOrIgvReferencesById, useIgvFileAndIndexAccessUrls } from '@/hooks/igv';
import TrackControlTable from './TrackControlTable';
import { assemblyIdsForExperiments } from '@/utils/experiments';

const SQUISHED_CALL_HEIGHT = 10;
const EXPANDED_CALL_HEIGHT = 50;
const DISPLAY_MODE = 'expanded';
const VISIBILITY_WINDOW = 600000;

// reference issues
// - read assemblies from experiment results
// - always prefer bento references where they exist
// - provide igv-provided assemblies where missing (note aliases above)
// assemblies may be cased incorrectly, eg: "GRCH37"
// as a (temporary) courtesy we could ignore case when doing lookup
// this could be removed later when correct casing is enforced elsewhere

// is there a performance difference between {genome: "hg38"} and {reference: {.......}} for the same igv genome? 



const TracksView = ({
  phenopacket,
  tracks,
  // references,
  genomesByID
}: {
  phenopacket: Phenopacket;
  tracks: ExperimentResult[];
  // references: Record<string, CreateOpt>;  //references in IGV format
  genomesByID: Record<string, Genome>;
}) => {

  console.log("TracksView()")
  console.log({tracks})
  console.log({genomesByID})





  const igvDivRef = useRef<HTMLDivElement>(null);
  const igvBrowserRef = useRef<Browser | null>(null);
  const [selectedAssemblyID, setSelectedAssemblyID] = useState<string | null>(null);
  const [hasCreatedBrowser, setHasCreatedBrowser] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const t = useTranslationFn();

  // we could pull these in parent component instead for faster UX when clicking through
  const accessUrls = useIgvFileAndIndexAccessUrls(tracks);
  console.log({ accessUrls });

  const [tracksWithView, setTracksWithView] = useState<ExperimentResultWithView[]>(
    tracks.map((t) => ({ ...t, viewInIgv: true }))
  );

  const assembliesRequested = assemblyIdsForExperiments(tracks);
  const availableAssemblies = Object.keys(genomesByID)

  const myReferences = useBentoOrIgvReferencesById(assembliesRequested)


  useEffect(() => {
    if (availableAssemblies.length) {
      setSelectedAssemblyID(availableAssemblies[0]);
      console.debug('auto-selected assembly ID:', availableAssemblies[0])
    }
  }, [availableAssemblies])


  // find something better than picking first one



  console.log({ assembliesRequested }); //correctly cased
  // console.log({ references }); // correctly cased

  const accessToken: string | undefined = useAccessToken();

  // update access token whenever necessary
  // can change to per-track tokens in the future,
  // but note that per-track tokens don't refresh, even if the tokens are provided by a function
  useEffect(() => {
    if (!accessToken) {
      return;
    }
    igv.setOauthToken(accessToken, new URL(PUBLIC_URL).host);
  }, [accessToken]);

  const showDrawer = useCallback(() => {
    setDrawerOpen(true)
  }, [])

  const closeDrawer = useCallback(() => {
    setDrawerOpen(false);
  }, [])

  const buildIgvTrack = useCallback(
    (track: ExperimentResult): IgvTrack | null => {
      if (!(track.url && track.file_format)) return null;

      const igvFileDetails = caseInsensitiveIgvFileInfoLookup(track.file_format);
      if (!igvFileDetails) return null;

      const { trackType, fileFormat } = igvFileDetails;

      if (!accessUrls) {
        console.error('no access urls ');
        return null;
      }

      const { fileAccessUrl, indexAccessUrl } = accessUrls[track.url];
      if (!fileAccessUrl) {
        console.error(`no access url for file`);
        return null;
      }

      const t = {
        type: trackType as SupportedTrackType,
        format: fileFormat,
        url: fileAccessUrl,
        indexURL: indexAccessUrl ?? undefined,
        name: track.filename,
        // minHeight: xxx,                          // default 50, same as default height
        // maxHeight: yyy,                          // default 500
        displayMode: DISPLAY_MODE,
        visibilityWindow: VISIBILITY_WINDOW,
        // viewInIgv: true, //can turn off crams here if we still need to
        // oauthToken: token or a function that returns a token, although this doesn't work as well as it should
      };

      if (trackType === 'variant') {
        Object.assign(t, { squishedCallHeight: SQUISHED_CALL_HEIGHT, expandedCallHeight: EXPANDED_CALL_HEIGHT });
      }

      return t as IgvTrack;
    },
    [accessUrls]
  );

  const toggleView = useCallback(
    (track: ExperimentResultWithView) => {
      if (!igvBrowserRef.current) return;
      if (!track) return;

      const wasViewing = track.viewInIgv;
      setTracksWithView((ts) => ts.map((t) => (t.filename === track.filename ? { ...t, viewInIgv: !wasViewing } : t)));

      if (wasViewing) {
        igvBrowserRef.current.removeTrackByName(track.filename);
      } else {
        igvBrowserRef.current.loadTrack(buildIgvTrack(track) as IgvTrack).catch(console.error);
      }
    },
    [tracks, accessUrls]
  );

  // const referenceForSelectedAssembly = useMemo(() => 
  //   referencesForIgv && selectedAssemblyID ? referencesForIgv[selectedAssemblyID] : null, [referencesForIgv, selectedAssemblyID])
  // console.log({ referenceForSelectedAssembly });

  useEffect(() => {
    console.log('igv useEffect()');


    if (!accessUrls) return;
    if (hasCreatedBrowser) return;
    // if (references) return;  //remove
    if (!selectedAssemblyID) return 
    if (!igvDivRef.current) return

    console.log('igv useEffect() continuing');


    console.log({tracksWithView})
    const tracksWithViewNonNullViewable = tracksWithView.filter((t) => t !== null && t.viewInIgv)  
    const igvTracks = tracksWithViewNonNullViewable.map((t) => buildIgvTrack(t) as IgvTrack)


    console.log({tracksWithViewNonNullViewable})
    console.log({igvTracks})


    const initialIgvTracks: IgvTrack[] = tracksWithView
      .filter((t) => t !== null && t.viewInIgv)   //missing: filter by file actually present 
      .map((t) => buildIgvTrack(t) as IgvTrack);

      
    // add reference
    // add search object in tracks
    // referencesForIgv is an object, you need to pull the record out of the object
    // using selected assembly? is selected assembly correct?
    // "requested assembly" is from experiment data, so should be correct
    // perhaps only return one reference at time
    // can autoselect if only one reference in data
    // otherwise arbitrarily choose (the first one )  

    const referenceForSelectedAssembly = myReferences[selectedAssemblyID]

    const igvOptions = {
      ...(referenceForSelectedAssembly as GenomeOpt),
      tracks: initialIgvTracks,
    };

    // const igvOptions = {
    //   genome: "hg38",
    //   tracks: initialIgvTracks,
    // };


    console.debug('creating igv.js browser with options:', igvOptions, '; tracks:', initialIgvTracks);
    igv
      .createBrowser(igvDivRef.current as HTMLElement, igvOptions)
      .then((browser) => {
        // browser.on(
        //   "locuschange",
        //   debounce((referenceFrame) => {
        //     storeIgvPosition(referenceFrame);
        //   }, DEBOUNCE_WAIT),
        // );
        igvBrowserRef.current = browser;
        setHasCreatedBrowser(true);
        console.debug('created igv.js browser instance:', browser);
      })
      .catch((err) => {
        console.error(err);
      });
  }, [accessUrls, buildIgvTrack, tracks, genomesByID]);

  return (
    <>
      {tracks.length > 0 && <div ref={igvDivRef} />}
      <FloatButton type="primary" icon={<BarsOutlined />} tooltip={t('Manage Tracks')} onClick={showDrawer} />
      <Drawer title={t('Manage Tracks')} placement="right" onClose={closeDrawer} open={drawerOpen}>
        {/* <>
          Assembly:{' '}
          <Select
            value={selectedAssemblyID}
            onChange={(v) => setSelectedAssemblyID(v)}
            options={trackAssemblyIDsMemoized.map((a) => ({ value: a, label: a }))}
          />
        </> */}

        <TrackControlTable toggleView={toggleView} experimentResults={tracksWithView} />
      </Drawer>
      <JsonView collapsed={2} src={tracks as unknown as JSONType} />
      <JsonView collapsed={2} src={accessUrls as unknown as JSONType} />

    </>
  );
};

export default TracksView;

// Notes:
// - permissions checks done elsewhere (component is not rendered if permissions missing)

// short-term todos
// - reference, bento + igv
// - store igv position
// - testing with crams, bigwigs, multiple vcfs...
// - put back "selected assembly" pulldown... this is easy once the reference stuff is written
// - translations

// longer-term
// - promises instead of strings for file urls?
// - full look-up of igv genomes

// const igvOptions = {
//   reference: availableBrowserGenomes[selectedAssemblyID],
//   locus: igvPosition,
//   tracks: initialIgvTracks,
//   ...(referenceService && selectedBentoReference?.gff3_gz
//     ? {
//         search: {
//           url: `${referenceService.url}/genomes/$GENOME$/igv-js-features?q=$FEATURE$`,
//           coords: 1,
//         },
//       }
//     : {}),
// };
