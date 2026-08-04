import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Drawer, FloatButton } from 'antd';
import { BarsOutlined } from '@ant-design/icons';
import { useTranslationFn } from '@/hooks';
import { useSmallScreen } from '@/hooks/useResponsiveContext';
import { useAccessToken } from 'bento-auth-js';
import igv from 'igv/dist/igv.esm';
import type { Browser, CreateOpt } from 'igv';
import type { ExperimentResult } from '@/types/clinPhen/experiments/experimentResult';
import type {
  IgvTrack,
  ExperimentResultWithView,
  IgvReferenceById,
  IgvAccessUrlPromisesById,
} from '@/types/clinPhen/igv';
import { PUBLIC_URL } from '@/config';
import { caseInsensitiveIgvFileInfoLookup, getIgvFileAndIndexAccessUrls } from '@/utils/igv';
import TrackControlTable from './TrackControlTable';

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
  const igvContainerRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const igvBrowserRefs = useRef<Record<string, Browser | null>>({});
  const igvCreatingByAssemblyRef = useRef<Record<string, boolean>>({});
  const activeCreateRequestByAssemblyRef = useRef<Record<string, number>>({});
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [accessUrlsPromises, setAccessUrlsPromises] = useState<IgvAccessUrlPromisesById>({});
  const [tracksWithView, setTracksWithView] = useState<ExperimentResultWithView[]>(
    tracks.map((t) => ({ ...t, viewInIgv: true }))
  );

  const t = useTranslationFn();
  const isSmallScreen = useSmallScreen();

  useEffect(() => {
    setAccessUrlsPromises(getIgvFileAndIndexAccessUrls(tracks));
  }, [tracks]);

  const availableAssemblies = useMemo(() => Object.keys(references), [references]);
  const hasMultipleAssemblies = availableAssemblies.length > 1;

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
      if (!track) return;

      const assemblyId = track.genome_assembly_id;
      if (!assemblyId) return;

      const browser = igvBrowserRefs.current[assemblyId];
      if (!browser) return;

      const wasViewing = track.viewInIgv;
      setTracksWithView((ts) => ts.map((t) => (t.filename === track.filename ? { ...t, viewInIgv: !wasViewing } : t)));

      if (wasViewing) {
        browser.removeTrackByName(track.filename);
      } else {
        browser.loadTrack(buildIgvTrack(track) as IgvTrack).catch(console.error);
      }
    },
    [accessUrlsPromises, buildIgvTrack]
  );

  // -------------------------- igv init --------------------------

  const cleanupAllBrowsers = useCallback(() => {
    Object.values(igvBrowserRefs.current).forEach((browser) => {
      if (browser) {
        console.debug('removing igv.js browser instance');
        igv.removeBrowser(browser);
      }
    });
    igvBrowserRefs.current = {};
    igvCreatingByAssemblyRef.current = {};
    activeCreateRequestByAssemblyRef.current = {};
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
    Object.entries(igvBrowserRefs.current).forEach(([assemblyId, browser]) => {
      if (!availableAssemblies.includes(assemblyId)) {
        if (browser) {
          igv.removeBrowser(browser);
        }
        delete igvBrowserRefs.current[assemblyId];
      }
    });

    // create an igv instance for each reference in the tracks (typically only one)
    availableAssemblies.forEach((assemblyId) => {
      if (igvBrowserRefs.current[assemblyId] || igvCreatingByAssemblyRef.current[assemblyId]) {
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
        tracks: initialIgvTracks,
      };

      console.debug('creating igv.js browser with options:', igvOptions, '; tracks:', initialIgvTracks);

      igvCreatingByAssemblyRef.current[assemblyId] = true;
      const createRequestId = (activeCreateRequestByAssemblyRef.current[assemblyId] ?? 0) + 1;
      activeCreateRequestByAssemblyRef.current[assemblyId] = createRequestId;

      igv
        .createBrowser(igvContainer, igvOptions as CreateOpt)
        .then((browser: Browser) => {
          if ((activeCreateRequestByAssemblyRef.current[assemblyId] ?? 0) !== createRequestId) {
            console.debug('ignoring stale igv.js browser creation result');
            igv.removeBrowser(browser);
            return;
          }

          igvBrowserRefs.current[assemblyId] = browser;
          igvCreatingByAssemblyRef.current[assemblyId] = false;
          console.debug('created igv.js browser instance:', browser);
        })
        .catch((err) => {
          console.error(err);
          igvBrowserRefs.current[assemblyId] = null;
          igvCreatingByAssemblyRef.current[assemblyId] = false;
        });
    });
  }, [accessUrlsPromises, availableAssemblies, buildIgvTrack, references, tracksWithView]);

  // -------------------------- end igv init --------------------------

  return (
    <>
      {(tracks.length > 0 || availableAssemblies.length > 0) && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
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
      <FloatButton type="primary" icon={<BarsOutlined />} tooltip={t('Manage Tracks')} onClick={showDrawer} />
      <Drawer
        title={t('Manage Tracks')}
        placement="right"
        onClose={closeDrawer}
        open={drawerOpen}
        width={isSmallScreen ? '100vw' : 500}
      >
        {availableAssemblies.map((assemblyId) => (
          <div key={assemblyId} style={{ marginTop: '1rem' }}>
            {hasMultipleAssemblies && <div style={{ fontWeight: 600, marginBottom: '0.5rem' }}>{assemblyId}</div>}
            <TrackControlTable
              toggleView={toggleView}
              tracks={tracksWithView.filter((t) => t.genome_assembly_id == assemblyId)}
            />
          </div>
        ))}
      </Drawer>
    </>
  );
};

export default TracksView;

// Notes:
// - permissions checks done elsewhere (component is not rendered if permissions missing)

// short-term todos
// - store igv position
// - testing with crams, bigwigs, multiple vcfs...
// - put back "selected assembly" pulldown... this is easy once the reference stuff is written
// - translations
// - what if no reference for track
