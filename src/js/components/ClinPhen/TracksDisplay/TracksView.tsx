import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/hooks';
import { useAccessToken } from 'bento-auth-js';
import igv from 'igv/dist/igv.esm';
import type { Browser, CreateOpt } from 'igv';
import { saveIgvPosition } from '@/features/igv/igv.store';
import type { ExperimentResult } from '@/types/clinPhen/experiments/experimentResult';
import type { IgvTrack, ExperimentResultWithView, IgvPosition, IgvReferenceById } from '@/types/clinPhen/igv';
import { PUBLIC_URL } from '@/config';
import { caseInsensitiveIgvFileInfoLookup, getIgvFileAndIndexAccessUrls } from '@/utils/igv';
import TrackControlTable from './TrackControlTable';
import { useDebounce } from '@/hooks/debounce';

const SQUISHED_CALL_HEIGHT = 10;
const EXPANDED_CALL_HEIGHT = 100;
const DISPLAY_MODE = 'expanded';
const VISIBILITY_WINDOW = 600000;
const DEBOUNCE_WAIT_MS = 1000;

type IgvBrowserState = {
  browser?: Browser;
  status: 'creating' | 'ready' | 'failed';
};

const TracksView = ({
  tracks,
  references,
}: {
  tracks: ExperimentResult[];
  references: IgvReferenceById; //references in IGV format
}) => {
  const igvContainerRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const igvBrowserStateByAssemblyRef = useRef<Record<string, IgvBrowserState | undefined>>({});
  const dispatch = useAppDispatch();

  const [tracksWithView, setTracksWithView] = useState<ExperimentResultWithView[]>(
    tracks.map((t) => ({ ...t, viewInIgv: true }))
  );

  const accessUrlsPromises = useMemo(() => getIgvFileAndIndexAccessUrls(tracks), [tracks]);

  const availableAssemblies = useMemo(() => Object.keys(references), [references]);
  const hasMultipleAssemblies = availableAssemblies.length > 1;

  const accessToken: string | undefined = useAccessToken();
  const igvPosition = useAppSelector(
    (state) => state.igv.igvPosition,
    () => true // don't re-render when position changes
  );

  // update access token whenever necessary
  // can change to per-track tokens in the future,
  // but note that per-track tokens don't refresh, even if the tokens are provided by a function
  useEffect(() => {
    if (!accessToken) {
      return;
    }
    igv.setOauthToken(accessToken, new URL(PUBLIC_URL).host);
  }, [accessToken]);

  const buildIgvTrack = useCallback(
    (track: ExperimentResult): IgvTrack | null => {
      if (!(track.url && track.file_format)) return null;

      const igvFileDetails = caseInsensitiveIgvFileInfoLookup(track.file_format);
      if (!igvFileDetails) return null;

      if (!accessUrlsPromises) {
        console.error('no access urls');
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
      if (!track) return;

      const assemblyId = track.genome_assembly_id;
      if (!assemblyId) return;

      const browserState = igvBrowserStateByAssemblyRef.current[assemblyId];
      if (!browserState?.browser || browserState.status !== 'ready') return;
      const browser = browserState.browser;

      const wasViewing = track.viewInIgv;
      setTracksWithView((ts) => ts.map((t) => (t.filename === track.filename ? { ...t, viewInIgv: !wasViewing } : t)));

      if (wasViewing) {
        browser.removeTrackByName(track.filename);
      } else {
        browser.loadTrack(buildIgvTrack(track) as IgvTrack).catch(console.error);
      }
    },
    [buildIgvTrack]
  );

  const storeIgvPosition = useCallback(
    (referenceFrame: IgvPosition[]) => {
      // typically a singleton array, but "multi-locus" view has multiple positions
      const positions = referenceFrame.map((r) => r.getLocusString());
      dispatch(saveIgvPosition(positions));
    },
    [dispatch]
  );

  const debouncedStoreIgvPosition = useDebounce(
    (referenceFrame: IgvPosition[]) => storeIgvPosition(referenceFrame),
    DEBOUNCE_WAIT_MS
  );

  // -------------------------- igv init --------------------------

  const cleanupAllBrowsers = useCallback(() => {
    Object.entries(igvBrowserStateByAssemblyRef.current).forEach(([assemblyId, state]) => {
      if (state?.browser) {
        console.debug(`removing igv.js browser instance for assembly ${assemblyId}`);
        igv.removeBrowser(state.browser);
      }
    });
  }, []);

  useEffect(() => {
    return () => {
      cleanupAllBrowsers();
    };
  }, [cleanupAllBrowsers]);

  useEffect(() => {
    // don't launch igv if no tracks
    if (Object.keys(accessUrlsPromises).length === 0) {
      return;
    }

    // remove any stale browsers
    Object.entries(igvBrowserStateByAssemblyRef.current).forEach(([assemblyId, state]) => {
      if (!availableAssemblies.includes(assemblyId)) {
        if (state?.browser) {
          igv.removeBrowser(state.browser);
        }
        delete igvBrowserStateByAssemblyRef.current[assemblyId];
      }
    });

    // create an igv instance for each reference in the tracks (typically only one)
    availableAssemblies.forEach((assemblyId) => {
      if (igvBrowserStateByAssemblyRef.current[assemblyId]) {
        return;
      }

      const igvContainer = igvContainerRefs.current[assemblyId];
      if (!igvContainer) {
        return;
      }

      const initialIgvTracks: IgvTrack[] = tracksWithView
        .filter((t) => t.genome_assembly_id === assemblyId)
        .map((t) => buildIgvTrack(t) as IgvTrack)
        .filter((t) => t !== null);

      const referenceForAssembly = references[assemblyId];
      if (!referenceForAssembly) {
        return;
      }

      const igvOptions = {
        ...(referenceForAssembly as CreateOpt),
        ...(igvPosition.length > 0 && { locus: igvPosition }),
        tracks: initialIgvTracks,
      };

      console.debug('creating igv.js browser with options:', igvOptions, '; tracks:', initialIgvTracks);

      const state: IgvBrowserState = { status: 'creating' };
      igvBrowserStateByAssemblyRef.current[assemblyId] = state;

      igv
        .createBrowser(igvContainer, igvOptions as CreateOpt)
        .then((browser: Browser) => {
          if (igvBrowserStateByAssemblyRef.current[assemblyId] !== state) {
            console.debug('ignoring stale igv.js browser creation result');
            igv.removeBrowser(browser);
            return;
          }
          state.browser = browser;
          state.status = 'ready';
          browser.on('locuschange', (referenceFrame: IgvPosition[]) => {
            debouncedStoreIgvPosition(referenceFrame);
          });
          console.debug('created igv.js browser instance:', browser);
        })
        .catch((err) => {
          console.error(err);
          state.status = 'failed';
        });
    });
  }, [
    accessUrlsPromises,
    availableAssemblies,
    buildIgvTrack,
    debouncedStoreIgvPosition,
    igvPosition,
    references,
    tracksWithView,
  ]);

  // -------------------------- end igv init --------------------------

  return (
    <>
      {(tracks.length > 0 || availableAssemblies.length > 0) && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {availableAssemblies.map((assemblyId) => (
            <div key={assemblyId} style={{ minHeight: 400 }}>
              <div
                ref={(node) => {
                  igvContainerRefs.current[assemblyId] = node;
                }}
              />
            </div>
          ))}
        </div>
      )}
      {availableAssemblies.map((assemblyId) => (
        <div key={assemblyId} style={{ marginTop: 10 }}>
          {hasMultipleAssemblies && <div style={{ fontWeight: 600, marginBottom: 5, marginTop: 15 }}>{assemblyId}</div>}
          <TrackControlTable
            toggleView={toggleView}
            tracks={tracksWithView.filter((t) => t.genome_assembly_id == assemblyId)}
          />
        </div>
      ))}
    </>
  );
};

export default TracksView;
