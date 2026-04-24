import type { TabsProps } from 'antd';
import { type ReactNode, useCallback, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router';
import type { JSONType } from 'bento-file-display';

import OntologiesView from '@/components/ClinPhen/PhenopacketDisplay/OntologiesView';
import Overview, { type CollapseHandle } from '@/components/ClinPhen/PhenopacketDisplay/PhenopacketOverview';
import PhenopacketMetaData from '@/components/ClinPhen/PhenopacketDisplay/PhenopacketMetaData';
import JsonView from '@Util/JsonView';
import TracksView from '@/components/ClinPhen/TracksDisplay/TracksView';
// import TracksViewFake from '@/components/ClinPhen/TracksDisplay/TracksViewFake';

import { TabKeys } from '@/types/PhenopacketView.types';
import type { Phenopacket } from '@/types/clinPhen/phenopacket';
import { useTranslationFn } from '@/hooks';
import { useReference } from '@/features/reference/hooks';
import { useScopeDownloadData } from '@/hooks/censorship';
import {
  phenopacketExperimentResults,
} from '@/utils/experiments';
import { useGetTracksAndReferencesForIgv } from './igv';

export const usePhenopacketTabs = (phenopacket: Phenopacket | undefined) => {
  const t = useTranslationFn();
  const navigate = useNavigate();
  const { genomesByID } = useReference();
  const collapseRef = useRef<CollapseHandle>(null);

  const handleTabChange = useCallback(
    (key: string) => {
      navigate(`../${key}`, { relative: 'path', replace: true });
    },
    [navigate]
  );





  const experimentResults = phenopacket ? phenopacketExperimentResults(phenopacket) : [];
  const { tracks, referencesById } = useGetTracksAndReferencesForIgv(experimentResults)
  
  // const assembliesRequested =  assemblyIdsForExperiments(tracks)
  // const referencesForIgv = useBentoOrIgvReferencesById(assembliesRequested) 
  // // const viewableTracks = phenopacketViewableExperimentResults(phenopacket, genomesByID);
  // this works, but now behaves slow again
  // const viewableIngestedTracks = viewableIngestedFiles(experimentResults)
  // console.log({viewableIngestedTracks})


  const {
    hasAttempted: attemptedCanDownload,
    // fetchingPermission: fetchingCanDownload,  // what's happening here
    hasPermission: canDownload,
  } = useScopeDownloadData();

  // TODO: Add Experiments
  const items: TabsProps['items'] = useMemo(() => {
    if (!phenopacket) return [];
    const allItems = [
      {
        key: TabKeys.OVERVIEW,
        label: t('Overview'),
        children: <Overview ref={collapseRef} phenopacket={phenopacket} />,
        disabled: false,
      },
      {
        key: TabKeys.TRACKS,
        label: t('Tracks'),
        children: <TracksView phenopacket={phenopacket} tracks={tracks}  genomesByID={genomesByID}/>,
        // children: <TracksViewFake />,
        disabled: !(attemptedCanDownload && canDownload && tracks.length > 0 && Object.keys(genomesByID).length > 0),
      },
      {
        key: TabKeys.ONTOLOGIES,
        label: t('tab_keys.ontologies'),
        children: <OntologiesView resources={phenopacket.meta_data?.resources} />,
        disabled: !phenopacket.meta_data?.resources?.length,
      },
      {
        // Rest of phenopacket metadata (split out ontologies to separate tab, above)
        key: TabKeys.METADATA,
        label: t('tab_keys.metadata'),
        children: <PhenopacketMetaData phenopacket={phenopacket} />,
      },
      {
        key: TabKeys.PHENOPACKET_JSON,
        label: t('tab_keys.phenopacket_json'),
        children: <JsonView src={phenopacket as unknown as JSONType} />,
      },
    ];
    return allItems.filter((item) => !item.disabled);
  }, [phenopacket, t]);

  const activeTabs = useMemo(() => {
    return items.map((item) => item.key as TabKeys);
  }, [items]);

  const tabs = useMemo(() => items.map(({ key, label }) => ({ key, label })), [items]);

  const tabContent = useMemo(() => {
    return items.reduce<Record<string, ReactNode>>((acc, { key, children }) => {
      acc[key] = children;
      return acc;
    }, {});
  }, [items]);

  console.log(`usePhenopacketTabs(), tabs: ${tabs}`)

  return {
    handleTabChange,
    tabs,
    tabContent,
    activeTabs,
    collapseRef,
  };
};




// how much checking to do before rendering ? (drs, genomes, etc)
// what's sufficient to bother rendering? criteria are: 
// 1. is viewable file type
// 2. file exists
// 3. reference genome exists

// (1) is fast to check, the others may need calls
// options are generally: 
// - check 1 before rendering, check 2, 3 in component
// - check 1, 2 before rendering, check 3 in component 
// - check 1, 2, 3 before rendering
// we can generally expect a correct genome to be present, so we could get away with not checking before rendering
// .... so would need a fall-back "no genome present" display 