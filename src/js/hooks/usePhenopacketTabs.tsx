import { TabsProps } from 'antd';
import { useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router';

import BiosampleView from '@/components/ClinPhen/PhenopacketDisplay/BiosampleView';
import DiseasesView from '@/components/ClinPhen/PhenopacketDisplay/DiseasesView';
import InterpretationsView from '@/components/ClinPhen/PhenopacketDisplay/Interpretations';
import MeasurementsView from '@/components/ClinPhen/PhenopacketDisplay/MeasurementsView';
import MedicalActionsView from '@/components/ClinPhen/PhenopacketDisplay/MedicalActionsView';
import OntologiesView from '@/components/ClinPhen/PhenopacketDisplay/OntologiesView';
import PhenotypicFeaturesView from '@/components/ClinPhen/PhenopacketDisplay/PhenotypicFeaturesView';
import SubjectView from '@/components/ClinPhen/PhenopacketDisplay/SubjectView';

import { TabKeys } from '@/types/PhenopacketView.types';
import { Phenopacket } from '@/types/clinPhen/phenopacket';

export const usePhenopacketTabs = (phenopacket: Phenopacket) => {
  const navigate = useNavigate();
  const handleTabChange = useCallback(
    (key: string) => {
      navigate(`../${key}`, { relative: 'path', replace: true });
    },
    [navigate]
  );

  // TODO: Add Experiments
  const items: TabsProps['items'] = useMemo(
    () => [
      {
        key: TabKeys.SUBJECT,
        label: 'Subject',
        children: <SubjectView subject={phenopacket?.subject} />,
        disabled: !phenopacket?.subject,
      },
      {
        key: TabKeys.BIOSAMPLES,
        label: 'Biosamples',
        children: phenopacket?.biosamples ? <BiosampleView biosamples={phenopacket?.biosamples!} /> : null,
        disabled: !phenopacket?.biosamples,
      },
      {
        key: TabKeys.MEASUREMENTS,
        label: 'Measurements',
        children: phenopacket?.measurements ? <MeasurementsView measurements={phenopacket?.measurements} /> : null,
        disabled: !phenopacket?.measurements,
      },
      {
        key: TabKeys.PHENOTYPIC_FEATURES,
        label: 'Phenotypic Features',
        children: phenopacket?.phenotypic_features ? (
          <PhenotypicFeaturesView features={phenopacket.phenotypic_features} />
        ) : null,
        disabled: !phenopacket?.phenotypic_features,
      },
      {
        key: TabKeys.DISEASES,
        label: 'Diseases',
        children: phenopacket?.diseases ? <DiseasesView diseases={phenopacket.diseases} /> : null,
        disabled: !phenopacket?.diseases,
      },
      {
        key: TabKeys.INTERPRETATIONS,
        label: 'Interpretations',
        children: phenopacket?.interpretations ? (
          <InterpretationsView interpretations={phenopacket.interpretations} />
        ) : null,
        disabled: !phenopacket?.interpretations,
      },
      {
        key: TabKeys.MEDICAL_ACTIONS,
        label: 'Medical Actions',
        children: phenopacket?.medical_actions ? (
          <MedicalActionsView medicalActions={phenopacket.medical_actions} />
        ) : null,
        disabled: !phenopacket?.medical_actions,
      },
      {
        key: TabKeys.ONTOLOGIES,
        label: 'Ontologies',
        children: <OntologiesView resources={phenopacket?.meta_data?.resources!} />,
        disabled: !phenopacket?.meta_data?.resources,
      },
    ],
    [phenopacket]
  );

  return {
    handleTabChange,
    items,
  };
};
