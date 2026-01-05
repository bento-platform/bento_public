import { useCallback, useEffect, useMemo, useState } from 'react';
import { Button, Card, Empty, Flex, Space } from 'antd';
import { CompressOutlined, DownloadOutlined, ExpandOutlined } from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';

import { saveAs } from 'file-saver';

import Loader from '@/components/Loader';

import { TabKeys } from '@/types/PhenopacketView.types';
import { RequestStatus } from '@/types/requests';

import { usePhenopacketData } from '@/features/clinPhen/hooks';
import { useSetExtraBreadcrumb } from '@/features/ui/hooks';
import { useTranslationFn } from '@/hooks';
import { useNotify } from '@/hooks/notifications';
import { usePhenopacketTabs } from '@/hooks/usePhenopacketTabs';

export interface RouteParams {
  packetId: string;
  tab: string;
  [key: string]: string | undefined;
}

const PhenopacketView = () => {
  const { packetId, tab } = useParams<RouteParams>();
  const navigate = useNavigate();
  const t = useTranslationFn();

  const api = useNotify();

  const { data: phenopacket, status, isAuthorized } = usePhenopacketData(packetId ?? '');

  const { handleTabChange, activeTabs, tabs, tabContent, collapseRef } = usePhenopacketTabs(phenopacket);

  const defaultTab = useMemo(() => ({ key: activeTabs[0], label: tabs[0]?.label }), [activeTabs, tabs]);

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
        if (tab && Object.values(TabKeys).includes(tab as TabKeys)) {
          notAvailableRedirectNotification();
        } else if (tab && !['', '/'].includes(tab)) {
          // Don't show a notification if we have some variation of an empty current tab; just redirect to the default.
          // Otherwise, show an invalid tab notification:
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

  const biosamples = phenopacket?.biosamples ?? [];

  const title = phenopacket
    ? phenopacket.subject
      ? t('subject.subject') + ': ' + phenopacket.subject.id
      : t('entities.biosample', { count: biosamples.length }) + ': ' + biosamples.map((b) => b.id).join(', ')
    : packetId;

  useSetExtraBreadcrumb(phenopacket ? title : undefined);

  const savePhenopacket = useCallback(() => {
    if (!phenopacket) return;
    const jsonString = JSON.stringify(phenopacket, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    saveAs(blob, `phenopacket_${phenopacket.id}.json`);
  }, [phenopacket]);

  // Extra action buttons for the current tab key context:
  const tabBarExtra = useMemo(() => {
    if (activeKey === TabKeys.OVERVIEW) {
      return (
        <Space>
          {/* Arrow function ensures ref is evaluated at click-time, not render-time */}
          <Button
            onClick={() => {
              collapseRef.current?.expandAll();
            }}
            size="small"
            icon={<ExpandOutlined />}
          >
            {t('general.expand_all')}
          </Button>
          <Button
            onClick={() => {
              collapseRef.current?.collapseAll();
            }}
            size="small"
            icon={<CompressOutlined />}
          >
            {t('general.collapse_all')}
          </Button>
        </Space>
      );
    } else if (activeKey === TabKeys.PHENOPACKET_JSON) {
      return (
        <Button size="small" icon={<DownloadOutlined />} onClick={savePhenopacket}>
          {t('file.download')}
        </Button>
      );
    }
  }, [t, collapseRef, activeKey, savePhenopacket]);

  if (isAuthorized.hasAttempted && !isAuthorized.hasPermission) {
    return <Empty description={t('auth.unauthorized_message')} />; // Temporary: removed once phenopacket view is integrated with search
  }

  if (status === RequestStatus.Pending || !phenopacket || !isAuthorized.hasAttempted) {
    return <Loader fullHeight={false} />;
  }

  return (
    <Flex justify="center">
      <Card
        className="container"
        activeTabKey={activeKey}
        tabList={tabs}
        tabProps={{ destroyOnHidden: true, size: 'middle' }}
        onTabChange={handleTabChange}
        tabBarExtraContent={tabBarExtra}
      >
        {tabContent[activeKey]}
      </Card>
    </Flex>
  );
};

export default PhenopacketView;
