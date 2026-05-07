import { useCallback, useEffect, useRef, useState } from 'react';
import { Drawer, FloatButton } from 'antd';
import { BarsOutlined } from '@ant-design/icons';

import type { Phenopacket } from '@/types/clinPhen/phenopacket';
import type { ExperimentResult } from '@/types/clinPhen/experiments/experimentResult';

import { useTranslationFn } from '@/hooks';

import { useAccessToken } from 'bento-auth-js';

import igv from 'igv/dist/igv.esm';
import type { Browser, CreateOpt } from 'igv';
import type {
  IgvTrack,
  ExperimentResultWithView,
  IgvReferenceById,
  IgvAccessUrlPromisesById,
} from '@/types/clinPhen/igv';

import { PUBLIC_URL } from '@/config';

import JsonView from '@Util/JsonView'; //temp
import { JSONType } from 'bento-file-display/dist'; //temp

import { caseInsensitiveIgvFileInfoLookup, getIgvFileAndIndexAccessUrls } from '@/utils/igv';
import TrackControlTable from './TrackControlTable';
import { assemblyIdsForExperiments } from '@/utils/experiments';

const SQUISHED_CALL_HEIGHT = 10;
const EXPANDED_CALL_HEIGHT = 100;
const DISPLAY_MODE = 'expanded';
const VISIBILITY_WINDOW = 600000;

const TracksView = ({
  tracks,
  references,
}: {
  tracks: ExperimentResult[];
  references: IgvReferenceById; //references in IGV format
}) => {
  const igvDivRef = useRef<HTMLDivElement>(null);
  const igvBrowserRef = useRef<Browser | null>(null);
  const [selectedAssemblyID, setSelectedAssemblyID] = useState<string | null>(null);
  const [hasCreatedBrowser, setHasCreatedBrowser] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [accessUrlsPromises, setAccessUrlsPromises] = useState<IgvAccessUrlPromisesById>({});
  const [tracksWithView, setTracksWithView] = useState<ExperimentResultWithView[]>(
    tracks.map((t) => ({ ...t, viewInIgv: true }))
  );

  const t = useTranslationFn();

  useEffect(() => {
    setAccessUrlsPromises(getIgvFileAndIndexAccessUrls(tracks));
  }, [tracks]);

  const assembliesRequested = assemblyIdsForExperiments(tracks);
  const availableAssemblies = Object.keys(references);

  useEffect(() => {
    if (availableAssemblies.length) {
      // can we do better than auto-selecting the first one?
      setSelectedAssemblyID(availableAssemblies[0]);
      console.debug('auto-selected assembly ID:', availableAssemblies[0]);
    }
  }, [availableAssemblies]);

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
    setDrawerOpen(true);
  }, []);

  const closeDrawer = useCallback(() => {
    setDrawerOpen(false);
  }, []);

  // why doesn't this take accessUrlsPromises as a param?
  // TODO: try this
  const buildIgvTrack = useCallback(
    (track: ExperimentResult): IgvTrack | null => {
      if (!(track.url && track.file_format)) return null;

      const igvFileDetails = caseInsensitiveIgvFileInfoLookup(track.file_format);
      if (!igvFileDetails) return null;

      if (!accessUrlsPromises) {
        console.error('no access urls ');
        return null;
      }

      const fileUrls = accessUrlsPromises[track.url];
      if (!fileUrls) {
        console.error(`no access url for file`);
        return null;
      }

      const { trackType, fileFormat } = igvFileDetails;

      const t = {
        type: trackType,
        format: fileFormat,
        url: fileUrls.fileAccessUrl,
        indexURL: fileUrls.indexAccessUrl, // okay if undefined
        name: track.filename,
        displayMode: DISPLAY_MODE,
        visibilityWindow: VISIBILITY_WINDOW,
        ...(trackType === 'variant'
          ? { squishedCallHeight: SQUISHED_CALL_HEIGHT, expandedCallHeight: EXPANDED_CALL_HEIGHT }
          : {}),
      } as IgvTrack;

      return t;
    },
    [accessUrlsPromises]
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
    [tracks, accessUrlsPromises]
  );

  // -------------------------- igv init --------------------------

  useEffect(() => {
    const cleanup = () => {
      if (igvBrowserRef.current) {
        console.debug('removing igv.js browser instance');
        igv.removeBrowser(igvBrowserRef.current);
        igvBrowserRef.current = null;
      }
    };

    if (!igvDivRef.current) return;
    if (!selectedAssemblyID) return;
    if (Object.keys(accessUrlsPromises).length === 0) return;
    if (hasCreatedBrowser) {
      console.log('browser created already');
      return;
    }

    const initialIgvTracks: IgvTrack[] = tracksWithView
      .map((t) => buildIgvTrack(t) as IgvTrack)
      .filter((t) => t !== null);

    const referenceForSelectedAssembly = references[selectedAssemblyID];

    const igvOptions = {
      ...(referenceForSelectedAssembly as CreateOpt),
      tracks: initialIgvTracks,
    };

    console.debug('creating igv.js browser with options:', igvOptions, '; tracks:', initialIgvTracks);

    igv
      .createBrowser(igvDivRef.current as HTMLElement, igvOptions as CreateOpt)
      .then((browser: Browser) => {
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
        // setHasCreatedBrowser(true);

        console.error(err);
        setHasCreatedBrowser(true);
        cleanup();
      });
  }, [accessUrlsPromises, buildIgvTrack, tracks, references]);

  // -------------------------- end igv init --------------------------

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
      <JsonView collapsed={3} src={accessUrlsPromises as unknown as JSONType} />
    </>
  );
};

export default TracksView;

// Notes:
// - permissions checks done elsewhere (component is not rendered if permissions missing)
// - can move some hooks out of parent component if parent is rendering too slow (could retrieve references her instead of parent)

// currently does global bento auth only
// per-track auth is possible, but igv implementation is lacking:
// - it's possible to provide a function returning a token instead of a bare token, but the token is resolved only when
//   the track is loaded, so can go stale on a short-lived token

// short-term todos
// - store igv position
// - testing with crams, bigwigs, multiple vcfs...
// - put back "selected assembly" pulldown... this is easy once the reference stuff is written
// - translations
