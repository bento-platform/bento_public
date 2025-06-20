import { Card, Empty, Flex, Tabs } from 'antd';
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import { usePhenopacketTabs } from '@/hooks/usePhenopacketTabs';

import Loader from '@/components/Loader';

import { PHENOPACKETS_DEFAULT_TAB } from '@/constants/phenopacketConstants';

import { TabKeys } from '@/types/PhenopacketView.types';
import { RequestStatus } from '@/types/requests';

import { usePhenopacketData } from '@/features/clinPhen/hooks';
import { useTranslationFn } from '@/hooks';

export interface RouteParams {
  packetId: string;
  tab: string;
  [key: string]: string | undefined;
}

const PhenopacketView = () => {
  const { packetId, tab } = useParams<RouteParams>();
  const navigate = useNavigate();
  const t = useTranslationFn();
  const { phenopacket, status, isAuthorized } = usePhenopacketData(packetId ?? '');

  const { handleTabChange, items } = usePhenopacketTabs(phenopacket);

  const [activeKey, setActiveKey] = useState<TabKeys>(TabKeys.BIOSAMPLES);

  useEffect(() => {
    if (tab && Object.values(TabKeys).includes(tab as TabKeys)) {
      setActiveKey(tab as TabKeys);
    } else {
      navigate(`${tab ? '..' : '.'}/${PHENOPACKETS_DEFAULT_TAB}`, { relative: 'path', replace: true });
    }
  }, [navigate, tab]);

  if (isAuthorized.hasAttempted && !isAuthorized.hasPermission) {
    return <Empty description={t('auth.unauthorized_message')} />; // Temporary: removed once phenopacket view is integrated with search
  }

  if (status === RequestStatus.Pending || !phenopacket || !isAuthorized.hasAttempted) {
    return <Loader fullHeight={false} />;
  }

  return (
    <Flex justify="center">
      <Card title={packetId} className="container">
        <Tabs activeKey={activeKey} items={items} onChange={handleTabChange} />
      </Card>
    </Flex>
  );
};

export default PhenopacketView;
