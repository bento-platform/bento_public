import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Loader from '@/components/Loader';
import { useAppDispatch, useAppSelector } from '@/hooks';
import { makeGetPhenopacketData } from '@/features/clinPhen/makeGetPhenopacket.thunk';
import { Card, Tabs, Descriptions } from 'antd';
import type { TabsProps } from 'antd';
import { RequestStatus } from '@/types/requests';
import BiosampleView from './BiosampleView';
import Ontologies from './Ontologies';
import MeasurementsView from './Measurements';
import PhenotypicFeaturesView from './PhenotypicFeatures';
import DiseasesView from './DiseasesView';
import MedicalActionsView from './MedicalActionsView';
import InterpretationsView from './Interpretations';

const getTabContent = (title: string, data: any) => (
  <Descriptions title={title}>
    <Descriptions.Item label="Data">{JSON.stringify(data, null, 2)}</Descriptions.Item>
  </Descriptions>
);

export interface RouteParams {
  packetId: string;
  tab: string;
  [key: string]: string | undefined;
}

enum TabKeys {
  BIOSAMPLES = 'biosamples',
  MEASUREMENTS = 'measurements',
  PHENOTYPIC_FEATURES = 'phenotypic_features',
  DISEASES = 'diseases',
  INTERPRETATIONS = 'interpretations',
  MEDICAL_ACTIONS = 'medical_actions',
  ONTOLOGIES = 'ontologies',
}

const PhenopacketView = () => {
  const { packetId, tab } = useParams<RouteParams>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const phenopacket = useAppSelector((state) => state.clinPhen.phenopacketDataCache[packetId ?? '']);
  const status = useAppSelector((state) => state.clinPhen.phenopacketDataStatus[packetId ?? '']);

  const [activeKey, setActiveKey] = useState<string>('biosamples');

  useEffect(() => {
    if (tab && Object.values(TabKeys).includes(tab as TabKeys)) {
      setActiveKey(tab);
    } else {
      if (tab) {
        navigate(`../${TabKeys.BIOSAMPLES}`, { relative: 'path' });
      } else {
        navigate(`./${TabKeys.BIOSAMPLES}`, { relative: 'path' });
      }
    }
  }, [tab]);

  useEffect(() => {
    if (packetId && !phenopacket && status !== RequestStatus.Pending) {
      dispatch(makeGetPhenopacketData(packetId));
    }
  }, [packetId, phenopacket, status, dispatch]);

  if (status === RequestStatus.Pending || !phenopacket) {
    return <Loader fullHeight={true} />;
  }

  const handleTabChange = (key: string) => {
    navigate(`../${key}`, { relative: 'path', replace: true });
  };

  const items: TabsProps['items'] = [
    {
      key: TabKeys.BIOSAMPLES,
      label: 'Biosamples',
      children: phenopacket?.biosamples ? <BiosampleView biosamples={phenopacket?.biosamples!} /> : null,
      disabled: !phenopacket?.biosamples,
    },
    {
      key: TabKeys.MEASUREMENTS,
      label: 'Measurements',
      children: phenopacket?.measurements ? <MeasurementsView measurements={phenopacket.measurements} /> : null,
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
      children: <Ontologies resources={phenopacket?.meta_data?.resources!} />,
      disabled: !phenopacket?.meta_data?.resources,
    },
  ];

  return (
    <Card title={packetId}>
      <Tabs activeKey={activeKey} items={items} onChange={handleTabChange} />
    </Card>
  );
};

export default PhenopacketView;
