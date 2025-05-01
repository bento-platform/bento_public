import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Loader from '@/components/Loader';
import { useAppDispatch, useAppSelector } from '@/hooks';
import { makeGetPhenopacketData } from '@/features/clinPhen/makeGetPhenopacket.thunk';
import { Card, Tabs, Descriptions } from 'antd';
import { RequestStatus } from '@/types/requests';
import BiosampleView from './BiosampleView';

const { TabPane } = Tabs;

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

  return (
    <Card title={packetId}>
      <Tabs defaultActiveKey="biosamples">
        <TabPane key="biosamples" tab="Biosamples" disabled={!phenopacket.biosamples}>
          <BiosampleView biosamples={phenopacket.biosamples!} />
        </TabPane>
        <TabPane key="measurements" tab="Measurements" disabled={!phenopacket.measurements}>
          {getTabContent('Measurements', phenopacket.measurements)}
        </TabPane>
        <TabPane key="phenotypic_features" tab="Phenotypic Features" disabled={!phenopacket.phenotypic_features}>
          {getTabContent('Phenotypic Features', phenopacket.phenotypic_features)}
        </TabPane>
        <TabPane key="diseases" tab="Diseases" disabled={!phenopacket.diseases}>
          {getTabContent('Diseases', phenopacket.diseases)}
        </TabPane>
        <TabPane key="interpretations" tab="Interpretations" disabled={!phenopacket.interpretations}>
          {getTabContent('Interpretations', phenopacket.interpretations)}
        </TabPane>
        <TabPane key="medical_actions" tab="Medical Actions" disabled={!phenopacket.medical_actions}>
          {getTabContent('Medical Actions', phenopacket.medical_actions)}
        </TabPane>
        {/* <TabPane key="ontologies" tab="Ontologies" disabled={!phenopacket.ontologies}>
          {getTabContent('Ontologies', phenopacket.ontologies)}
        </TabPane> */}
      </Tabs>
    </Card>
  );
};

export default PhenopacketView;
