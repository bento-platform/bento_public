import { Card, Empty, Flex, Tabs } from 'antd';
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import { usePhenopacketTabs } from '@/hooks/usePhenopacketTabs';

import Loader from '@/components/Loader';

import type { TabKeys } from '@/types/PhenopacketView.types';
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

  const { handleTabChange, items, activeTabs, defaultTab } = usePhenopacketTabs(phenopacket);

  const [activeKey, setActiveKey] = useState<TabKeys>(defaultTab);

  useEffect(() => {
    if (status === RequestStatus.Fulfilled && phenopacket) {
      if (tab && activeTabs.includes(tab as TabKeys)) {
        setActiveKey(tab as TabKeys);
      } else {
        navigate(`${tab ? '..' : '.'}/${defaultTab}`, { relative: 'path', replace: true });
      }
    }
  }, [navigate, tab, status, phenopacket, activeTabs, defaultTab]);

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
