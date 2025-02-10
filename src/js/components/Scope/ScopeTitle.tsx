import { useEffect, useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { Breadcrumb, type BreadcrumbProps, Button, Flex, Space, Tooltip } from 'antd';
import { ProfileOutlined, QuestionOutlined } from '@ant-design/icons';
import type { BreadcrumbItemType } from 'antd/es/breadcrumb/Breadcrumb';
import ScopePickerModal from './ScopePickerModal';

import { useSelectedScope, useSelectedScopeTitles } from '@/features/metadata/hooks';
import { useTranslationFn } from '@/hooks';
import { useGetRouteTitleAndIcon } from '@/hooks/navigation';
import { useSmallScreen } from '@/hooks/useResponsiveContext';
import { BentoRoute, TOP_LEVEL_ONLY_ROUTES } from '@/types/routes';
import { getCurrentPage } from '@/utils/router';
import CurrentPageHelpModal from '@/components/Util/CurrentPageHelpModal';

const breadcrumbRender: BreadcrumbProps['itemRender'] = (route, _params, routes, _paths) => {
  const isLast = route?.path === routes[routes.length - 1]?.path;
  return isLast || !route.path ? <span>{route.title}</span> : <Link to={{ pathname: route.path }}>{route.title}</Link>;
};

const ScopeTitle = () => {
  const location = useLocation();
  const { i18n } = useTranslation();
  const t = useTranslationFn();

  const { scope, fixedProject, fixedDataset } = useSelectedScope();
  const { projectTitle, datasetTitle } = useSelectedScopeTitles();

  const isSmallScreen = useSmallScreen();

  const getRouteTitleAndIcon = useGetRouteTitleAndIcon();
  const currentPage = getCurrentPage();
  const scopeSelectionEnabled = !(fixedProject && fixedDataset) && !TOP_LEVEL_ONLY_ROUTES.includes(currentPage);
  const [scopeSelectModalOpen, setScopeSelectModalOpen] = useState(false);
  const [helpModalOpen, setHelpModalOpen] = useState(false);

  const currentPageHasHelp = useMemo(() => {
    const k = `page_help.${currentPage}`;
    return k !== t(k);
  }, [t, currentPage]);

  useEffect(() => {
    // If the selected scope changes (likely from the scope select modal), auto-close the modal.
    setScopeSelectModalOpen(false);
  }, [location]);

  const breadcrumbItems: BreadcrumbItemType[] = useMemo(() => {
    const currentTitleAndIcon = getRouteTitleAndIcon(currentPage);
    const currentPageTitle = (
      <>
        {currentTitleAndIcon[1]} {t(currentTitleAndIcon[0])}
      </>
    );

    const items: BreadcrumbItemType[] = [];

    if (scope.project && !fixedProject) {
      items.push({
        title: projectTitle,
        path: `/${i18n.language}/p/${scope.project}`,
      });

      if (scope.dataset && !fixedDataset) {
        items.push({
          title: datasetTitle,
          path: `/${i18n.language}/p/${scope.project}/d/${scope.dataset}`,
        });
      }
    }

    if (currentPage !== BentoRoute.Overview) {
      items.push({ title: currentPageTitle });
    }

    return items;
  }, [
    i18n.language,
    t,
    projectTitle,
    datasetTitle,
    scope,
    fixedProject,
    fixedDataset,
    currentPage,
    getRouteTitleAndIcon,
  ]);

  useEffect(() => {
    if (!breadcrumbItems.length) return;

    const observer = new IntersectionObserver(
      ([e]) => {
        return e.target.toggleAttribute('data-stuck', e.intersectionRatio < 1);
      },
      { threshold: [1], root: document.getElementById('content-layout') }
    );

    const st = document.querySelector('.scope-title');

    if (st) {
      observer.observe(st);
    }
  }, [breadcrumbItems]);

  if (breadcrumbItems.length) {
    return (
      <>
        <ScopePickerModal isModalOpen={scopeSelectModalOpen} setIsModalOpen={setScopeSelectModalOpen} />
        <CurrentPageHelpModal open={helpModalOpen} onCancel={() => setHelpModalOpen(false)} />
        <Flex className="scope-title" align="center">
          <Breadcrumb className="scope-title__breadcrumb" items={breadcrumbItems} itemRender={breadcrumbRender} />
          <Space>
            {scopeSelectionEnabled && (
              <Tooltip title={t('Change Scope')} placement="bottom">
                <Button
                  color="default"
                  variant="filled"
                  icon={<ProfileOutlined />}
                  shape="circle"
                  onClick={() => setScopeSelectModalOpen(true)}
                />
              </Tooltip>
            )}
            {currentPageHasHelp && (
              <Tooltip title={t('Help')} placement="bottom" open={isSmallScreen ? undefined : false}>
                <Button
                  color="default"
                  variant="filled"
                  icon={<QuestionOutlined />}
                  shape={isSmallScreen ? 'circle' : 'round'}
                  onClick={() => setHelpModalOpen(true)}
                >
                  {isSmallScreen ? undefined : t('Help')}
                </Button>
              </Tooltip>
            )}
          </Space>
        </Flex>
      </>
    );
  }

  return null;
};

export default ScopeTitle;
