import type { TabsProps } from 'antd';
import { useCallback, useMemo, useRef, type ReactNode } from 'react';
import { useNavigate } from 'react-router';

import OntologiesView from '@/components/ClinPhen/PhenopacketDisplay/OntologiesView';
import Overview, { type CollapseHandle } from '@/components/ClinPhen/PhenopacketDisplay/PhenopacketOverview';

import { TabKeys } from '@/types/PhenopacketView.types';
import type { Phenopacket } from '@/types/clinPhen/phenopacket';
import { useTranslationFn } from '@/hooks';

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
        key: TabKeys.ONTOLOGIES,
        label: t('tab_keys.ontologies'),
        children: <OntologiesView resources={phenopacket.meta_data?.resources} />,
        disabled: !phenopacket.meta_data?.resources?.length,
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

  return {
    handleTabChange,
    tabs,
    tabContent,
    activeTabs,
    collapseRef,
  };
};
