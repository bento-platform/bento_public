import type { TabsProps } from 'antd';
import { useCallback, useMemo, type ReactNode } from 'react';
import { useNavigate } from 'react-router';

import BiosampleView from '@/components/ClinPhen/PhenopacketDisplay/BiosampleView';
import DiseasesView from '@/components/ClinPhen/PhenopacketDisplay/DiseasesView';
import InterpretationsView from '@/components/ClinPhen/PhenopacketDisplay/InterpretationsView';
import MeasurementsView from '@/components/ClinPhen/PhenopacketDisplay/MeasurementsView';
import MedicalActionsView from '@/components/ClinPhen/PhenopacketDisplay/MedicalActionsView';
import OntologiesView from '@/components/ClinPhen/PhenopacketDisplay/OntologiesView';
import PhenotypicFeaturesView from '@/components/ClinPhen/PhenopacketDisplay/PhenotypicFeaturesView';
import SubjectView from '@/components/ClinPhen/PhenopacketDisplay/SubjectView';

import { TabKeys } from '@/types/PhenopacketView.types';
import type { Phenopacket } from '@/types/clinPhen/phenopacket';
import { useTranslationFn } from '@/hooks';

export const usePhenopacketTabs = (phenopacket: Phenopacket | undefined) => {
  const t = useTranslationFn();
  const navigate = useNavigate();
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
        key: TabKeys.SUBJECT,
        label: t('subject.subject'),
        children: phenopacket.subject ? <SubjectView subject={phenopacket.subject} /> : null,
        disabled: !phenopacket.subject,
      },
      {
        key: TabKeys.BIOSAMPLES,
        label: t('entities.biosample_other'),
        children: phenopacket.biosamples ? <BiosampleView biosamples={phenopacket.biosamples} /> : null,
        disabled: !phenopacket.biosamples?.length,
      },
      {
        key: TabKeys.MEASUREMENTS,
        label: t('tab_keys.measurements'),
        children: phenopacket.measurements ? <MeasurementsView measurements={phenopacket.measurements} /> : null,
        disabled: !phenopacket.measurements?.length,
      },
      {
        key: TabKeys.PHENOTYPIC_FEATURES,
        label: t('tab_keys.phenotypic_features'),
        children: phenopacket.phenotypic_features ? (
          <PhenotypicFeaturesView features={phenopacket.phenotypic_features} />
        ) : null,
        disabled: !phenopacket.phenotypic_features?.length,
      },
      {
        key: TabKeys.DISEASES,
        label: t('tab_keys.diseases'),
        children: phenopacket.diseases ? <DiseasesView diseases={phenopacket.diseases} /> : null,
        disabled: !phenopacket.diseases?.length,
      },
      {
        key: TabKeys.INTERPRETATIONS,
        label: t('tab_keys.interpretations'),
        children: phenopacket.interpretations ? (
          <InterpretationsView interpretations={phenopacket.interpretations} />
        ) : null,
        disabled: !phenopacket.interpretations?.length,
      },
      {
        key: TabKeys.MEDICAL_ACTIONS,
        label: t('tab_keys.medical_actions'),
        children: phenopacket.medical_actions ? (
          <MedicalActionsView medicalActions={phenopacket.medical_actions} />
        ) : null,
        disabled: !phenopacket.medical_actions?.length,
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
  };
};
