import { Card, Tabs } from 'antd';
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import { useAppDispatch, useAppSelector } from '@/hooks';
import { usePhenopacketTabs } from '@/hooks/usePhenopacketTabs';

import Loader from '@/components/Loader';

import { defaultTab } from '@/constants/phenopacketConstants';
import { makeGetPhenopacketData } from '@/features/clinPhen/makeGetPhenopacket.thunk';

import { TabKeys } from '../../types/PhenopacketView.types';
import { RequestStatus } from '@/types/requests';

export interface RouteParams {
  packetId: string;
  tab: string;
  [key: string]: string | undefined;
}

const PhenopacketView = () => {
  const { packetId, tab } = useParams<RouteParams>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const phenopacket = useAppSelector((state) => state.clinPhen.phenopacketDataCache[packetId ?? '']);
  const status = useAppSelector((state) => state.clinPhen.phenopacketDataStatus[packetId ?? '']);
  const { handleTabChange, items } = usePhenopacketTabs(phenopacket);

  const [activeKey, setActiveKey] = useState<string>('biosamples');

  useEffect(() => {
    if (tab && Object.values(TabKeys).includes(tab as TabKeys)) {
      setActiveKey(tab);
    } else {
      if (tab) {
        navigate(`../${defaultTab}`, { relative: 'path' });
      } else {
        navigate(`./${defaultTab}`, { relative: 'path' });
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

  return (
    <Card title={packetId}>
      <Tabs activeKey={activeKey} items={items} onChange={handleTabChange} />
    </Card>
  );
};

export default PhenopacketView;
