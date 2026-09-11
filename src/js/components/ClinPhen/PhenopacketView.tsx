'use client';

import { useCallback, useMemo, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Button, Empty, Space, Tabs } from 'antd';
import { CompressOutlined, DownloadOutlined, ExpandOutlined } from '@ant-design/icons';

import { saveAs } from 'file-saver';

import Loader from '@/components/Loader';

import { BentoRoute } from '@/types/routes';
import { TabKeys } from '@/types/PhenopacketView.types';
import { RequestStatus } from '@/types/requests';

import { usePhenopacketData } from '@/features/clinPhen/hooks';
import { useSetExtraBreadcrumb } from '@/features/ui/hooks';
import { useTranslationFn } from '@/hooks';
import { useCurrentScopePrefixedUrl } from '@/hooks/navigation';
import { useNotify } from '@/hooks/notifications';
import { usePhenopacketTabs } from '@/hooks/usePhenopacketTabs';
import { useSmallScreen } from '@/hooks/useResponsiveContext';

export interface RouteParams {
  packetId: string;
  // The [[...tab]] optional catch-all segment yields an array (0 or more path segments), unlike react-router's
  // old single optional :tab? param - only the first segment is treated as the tab; PhenopacketView below
  // resolves this down to a single `tab: string | undefined` before using it.
  tab?: string[];
  [key: string]: string | string[] | undefined;
}

const PhenopacketView = () => {
  const { packetId, tab: tabSegments } = useParams<RouteParams>();
  const tab = tabSegments?.[0];
  const router = useRouter();
  const t = useTranslationFn();
  const isSmallScreen = useSmallScreen();

  const api = useNotify();

  const { data: phenopacket, status, isAuthorized } = usePhenopacketData(packetId ?? '');

  const { handleTabChange, activeTabs, tabs, tabContent, collapseRef } = usePhenopacketTabs(phenopacket, packetId);

  const defaultTab = useMemo(() => ({ key: activeTabs[0], label: tabs[0]?.label }), [activeTabs, tabs]);
  const defaultTabUrl = useCurrentScopePrefixedUrl(`${BentoRoute.Phenopackets}/${packetId}/${defaultTab.key}`);

  const [activeKey, setActiveKey] = useState<TabKeys>(defaultTab.key);

  const notificationFillIns = useMemo(() => ({ endpoint: tab, target: defaultTab.label }), [tab, defaultTab.label]);

  const invalidEndpointRedirectNotification = useCallback(() => {
    api.error({
      message: t('navigation.invalid_endpoint_title', notificationFillIns),
      description: t('navigation.invalid_endpoint_description', notificationFillIns),
    });
  }, [api, t, notificationFillIns]);

  const notAvailableRedirectNotification = useCallback(() => {
    api.warning({
      message: t('navigation.not_available_title', notificationFillIns),
      description: t('navigation.not_available_description', notificationFillIns),
    });
  }, [api, t, notificationFillIns]);

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

  // -------------------------------------------------------------------------------------------------------------------
  // Early returns for handling loading/errors

  // tab param --> active key handling
  if (status === RequestStatus.Fulfilled && phenopacket && activeKey !== tab) {
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
      router.replace(defaultTabUrl);
      // Temporary loading render while navigation occurs. This navigation is to a valid key (the default), so we won't
      // get any more error notifications after this navigation occurs.
      return <Loader fullHeight={false} />;
    }
  }

  if (isAuthorized.hasAttempted && !isAuthorized.hasPermission) {
    return <Empty description={t('auth.unauthorized_message')} />;
  }

  if (status === RequestStatus.Pending || !phenopacket || !isAuthorized.hasAttempted) {
    return <Loader fullHeight={false} />;
  }

  // -------------------------------------------------------------------------------------------------------------------

  // Extra action buttons for the current tab key context.
  // Must come after tab param --> active key handling
  const tabBarExtra = (() => {
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
            {!isSmallScreen && t('general.expand_all')}
          </Button>
          <Button
            onClick={() => {
              collapseRef.current?.collapseAll();
            }}
            size="small"
            icon={<CompressOutlined />}
          >
            {!isSmallScreen && t('general.collapse_all')}
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
  })();

  return (
    <div className="container margin-auto">
      <Tabs
        activeKey={activeKey}
        items={tabs}
        destroyOnHidden={true}
        size="middle"
        onChange={handleTabChange}
        tabBarExtraContent={tabBarExtra}
      />
      {tabContent[activeKey]}
    </div>
  );
};

export default PhenopacketView;
