import { useCallback, useMemo } from 'react';
import { Card, Empty, Flex, Tabs, notification } from 'antd';
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import { usePhenopacketTabs } from '@/hooks/usePhenopacketTabs';

import Loader from '@/components/Loader';

import { TabKeys } from '@/types/PhenopacketView.types';
import { RequestStatus } from '@/types/requests';

import { usePhenopacketData } from '@/features/clinPhen/hooks';
import { useTranslationFn } from '@/hooks';
import { NAVBAR_HEIGHT } from '@/constants/common';

const NOTIFICATION_DISPLACEMENT = NAVBAR_HEIGHT + 24;

export interface RouteParams {
  packetId: string;
  tab: string;
  [key: string]: string | undefined;
}

const PhenopacketView = () => {
  const { packetId, tab } = useParams<RouteParams>();
  const navigate = useNavigate();
  const t = useTranslationFn();
  const [api, contextHolder] = notification.useNotification({
    duration: 5,
    showProgress: true,
    pauseOnHover: true,
    top: NOTIFICATION_DISPLACEMENT,
  });

  const { phenopacket, status, isAuthorized } = usePhenopacketData(packetId ?? '');

  const { handleTabChange, items, activeTabs, defaultTab } = usePhenopacketTabs(phenopacket);

  const [activeKey, setActiveKey] = useState<TabKeys>(defaultTab.key);

  const notificationFillIns = useMemo(() => ({ endpoint: tab, target: defaultTab.label }), [tab, defaultTab.label]);

  const invalidEndpointRedirectNotification = useCallback(() => {
    api.error({
      message: t('phenopacket_view.invalid_endpoint_title', notificationFillIns),
      description: t('phenopacket_view.invalid_endpoint_description', notificationFillIns),
    });
  }, [api, t, notificationFillIns]);

  const notAvailableRedirectNotification = useCallback(() => {
    api.warning({
      message: t('phenopacket_view.not_available_title', notificationFillIns),
      description: t('phenopacket_view.not_available_description', notificationFillIns),
    });
  }, [api, t, notificationFillIns]);

  useEffect(() => {
    if (status === RequestStatus.Fulfilled && phenopacket) {
      if (tab && activeTabs.includes(tab as TabKeys)) {
        setActiveKey(tab as TabKeys);
      } else {
        if (tab && tab in TabKeys) {
          notAvailableRedirectNotification();
        } else {
          invalidEndpointRedirectNotification();
        }
        navigate(`${tab ? '..' : '.'}/${defaultTab.key}`, { relative: 'path', replace: true });
      }
    }
  }, [
    navigate,
    tab,
    status,
    phenopacket,
    activeTabs,
    defaultTab,
    invalidEndpointRedirectNotification,
    notAvailableRedirectNotification,
    api,
  ]);

  if (isAuthorized.hasAttempted && !isAuthorized.hasPermission) {
    return <Empty description={t('auth.unauthorized_message')} />; // Temporary: removed once phenopacket view is integrated with search
  }

  if (status === RequestStatus.Pending || !phenopacket || !isAuthorized.hasAttempted) {
    return (
      <>
        {contextHolder}
        <Loader fullHeight={false} />
      </>
    );
  }

  return (
    <>
      {contextHolder}
      <Flex justify="center">
        <Card title={packetId} className="container">
          <Tabs activeKey={activeKey} items={items} onChange={handleTabChange} />
        </Card>
      </Flex>
    </>
  );
};

export default PhenopacketView;
