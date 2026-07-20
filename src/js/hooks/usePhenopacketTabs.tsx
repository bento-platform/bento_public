import type { TabsProps } from 'antd';
import { type ReactNode, useCallback, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router';
import type { JSONType } from 'bento-file-display';

import OntologiesView from '@/components/ClinPhen/PhenopacketDisplay/OntologiesView';
import Overview, { type CollapseHandle } from '@/components/ClinPhen/PhenopacketDisplay/PhenopacketOverview';
import PhenopacketMetaData from '@/components/ClinPhen/PhenopacketDisplay/PhenopacketMetaData';
import JsonView from '@Util/JsonView';
import TracksView from '@/components/ClinPhen/TracksDisplay/TracksView';

import { TabKeys } from '@/types/PhenopacketView.types';
import type { Phenopacket } from '@/types/clinPhen/phenopacket';
import { useTranslationFn } from '@/hooks';
import { useScopeDownloadData } from '@/hooks/censorship';
import { assemblyIdsForExperiments, phenopacketExperimentResults } from '@/utils/experiments';
import { useBentoOrIgvReferencesById, viewableTracks } from './igv';

export const usePhenopacketTabs = (phenopacket: Phenopacket | undefined) => {
  const t = useTranslationFn();
  const navigate = useNavigate();
  const collapseRef = useRef<CollapseHandle>(null);

  const handleTabChange = useCallback(
    (key: string) => {
      navigate(`../${key}`, { relative: 'path', replace: true });
    },
    [navigate]
  );

  const experimentResults = phenopacket ? phenopacketExperimentResults(phenopacket) : [];
  const tracks = viewableTracks(experimentResults)
  const requestedAssemblies = assemblyIdsForExperiments(tracks);
  const referencesById = useBentoOrIgvReferencesById(requestedAssemblies);

  const { hasAttempted: attemptedCanDownload, hasPermission: canDownload } = useScopeDownloadData();

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
        children: <TracksView tracks={tracks} references={referencesById} />,
        disabled: !(attemptedCanDownload && canDownload && tracks.length > 0 && Object.keys(referencesById).length > 0),
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
  }, [phenopacket, t, tracks, referencesById]);

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

  return {
    handleTabChange,
    tabs,
    tabContent,
    activeTabs,
    collapseRef,
  };
};
