import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Loader from '@/components/Loader';
import { useAppDispatch, useAppSelector } from '@/hooks';
import { makeGetPhenopacketData } from '@/features/clinPhen/makeGetPhenopacket.thunk';
import { Card, Tabs, Descriptions } from 'antd';
import type { TabsProps } from 'antd';
import { RequestStatus } from '@/types/requests';
import BiosampleView from './BiosampleView';

const getTabContent = (title: string, data: any) => (
  <Descriptions title={title}>
    <Descriptions.Item label="Data">{JSON.stringify(data, null, 2)}</Descriptions.Item>
  </Descriptions>
);

interface RouteParams {
  packetId: string;
  [key: string]: string | undefined;
}

const PhenopacketView = () => {
  const { packetId } = useParams<RouteParams>();
  const dispatch = useAppDispatch();
  const phenopacket = useAppSelector((state) => state.clinPhen.phenopacketDataCache[packetId ?? '']);
  const status = useAppSelector((state) => state.clinPhen.phenopacketDataStatus[packetId ?? '']);

  useEffect(() => {
    if (packetId && !phenopacket && status !== RequestStatus.Pending) {
      dispatch(makeGetPhenopacketData(packetId));
    }
  }, [packetId, phenopacket, status, dispatch]);

  if (status === RequestStatus.Pending || !phenopacket) {
    return <Loader fullHeight={true} />;
  }

  const items: TabsProps['items'] = [
    {
      key: 'biosamples',
      label: 'Biosamples',
      children: <BiosampleView biosamples={phenopacket.biosamples!} />,
      disabled: !phenopacket.biosamples,
    },
    {
      key: 'measurements',
      label: 'Measurements',
      children: getTabContent('Measurements', phenopacket.measurements),
      disabled: !phenopacket.measurements,
    },
    {
      key: 'phenotypic_features',
      label: 'Phenotypic Features',
      children: getTabContent('Phenotypic Features', phenopacket.phenotypic_features),
      disabled: !phenopacket.phenotypic_features,
    },
    {
      key: 'diseases',
      label: 'Diseases',
      children: getTabContent('Diseases', phenopacket.diseases),
      disabled: !phenopacket.diseases,
    },
    {
      key: 'interpretations',
      label: 'Interpretations',
      children: getTabContent('Interpretations', phenopacket.interpretations),
      disabled: !phenopacket.interpretations,
    },
    {
      key: 'medical_actions',
      label: 'Medical Actions',
      children: getTabContent('Medical Actions', phenopacket.medical_actions),
      disabled: !phenopacket.medical_actions,
    },
    // Uncomment if ontologies are needed
    // {
    //   key: 'ontologies',
    //   label: 'Ontologies',
    //   children: getTabContent('Ontologies', phenopacket.ontologies),
    //   disabled: !phenopacket.ontologies,
    // },
  ];

  return (
    <Card title={packetId}>
      <Tabs defaultActiveKey="biosamples" items={items} />
    </Card>
  );
};

export default PhenopacketView;
