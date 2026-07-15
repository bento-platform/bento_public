import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Breadcrumb, type BreadcrumbProps, Button, Flex, Menu, Tooltip } from 'antd';
import { ArrowLeftOutlined, FilterOutlined, QuestionOutlined } from '@ant-design/icons';
import type { BreadcrumbItemType } from 'antd/es/breadcrumb/Breadcrumb';
import type { MenuItem } from '@/types/navigation';

import CurrentPageHelpModal from '@/components/Util/CurrentPageHelpModal';
import { useSelectedScope } from '@/features/metadata/hooks';
import { useSearchQueryParams } from '@/features/search/hooks';
import { useTranslationFn } from '@/hooks';
import { useSmallScreen } from '@/hooks/useResponsiveContext';
import { useNavigateToRoot, useNavigateToSameScopeUrl, useNavigateToScope } from '@/hooks/navigation';
import { BentoRoute } from '@/types/routes';
import { getCurrentPage } from '@/utils/router';
import { buildQueryParamsUrl } from '@/features/search/utils';
import { PCGL_MODE } from '@/config';

const NO_BACK_BUTTON = [undefined, undefined] as const;

const useBackButtonInfo = () => {
  const location = useLocation();
  const overviewQueryParams = useSearchQueryParams();
  const currentPage = getCurrentPage(location);

  const navigateToRoot = useNavigateToRoot();
  const navigateToScope = useNavigateToScope();
  const navigateToSameScopeUrl = useNavigateToSameScopeUrl();
  const { scope, scopeSet, fixedProject, fixedDataset } = useSelectedScope();

  return useMemo<readonly [undefined, undefined] | [string, () => void]>(() => {
    if (!scopeSet) return NO_BACK_BUTTON;
    if (currentPage === BentoRoute.Phenopackets) {
      return [
        scope.dataset ? 'Back to dataset' : 'Back to project',
        () => navigateToSameScopeUrl(buildQueryParamsUrl(BentoRoute.Overview, overviewQueryParams), false),
      ];
    } else {
      if (scope.dataset) {
        if (fixedDataset) return NO_BACK_BUTTON;
        const cameFromProject = (location.state as { fromProjectScope?: boolean } | null)?.fromProjectScope;
        return PCGL_MODE && !cameFromProject
          ? ['Back to catalogue', navigateToRoot]
          : ['Back to project', () => navigateToScope({ project: scope.project }, BentoRoute.Overview)];
      } else if (scope.project) {
        return fixedProject ? NO_BACK_BUTTON : ['Back to catalogue', navigateToRoot];
      } else {
        return NO_BACK_BUTTON;
      }
    }
  }, [
    currentPage,
    location.state,
    navigateToRoot,
    navigateToScope,
    navigateToSameScopeUrl,
    overviewQueryParams,
    scope,
    fixedProject,
    fixedDataset,
    scopeSet,
  ]);
};

const breadcrumbRender: BreadcrumbProps['itemRender'] = (route, _params, routes, _paths) => {
  const isLast = route?.path === routes[routes.length - 1]?.path;
  return isLast || !route.path ? <span>{route.title}</span> : <Link to={{ pathname: route.path }}>{route.title}</Link>;
};

type ScopeHeaderProps = {
  showSidebarToggle: boolean;
  sidebarOverlayShown: boolean;
  onToggleSidebar: () => void;
  breadcrumbItems: BreadcrumbItemType[];
  menuItems?: MenuItem[];
};

const ScopeHeader = ({
  showSidebarToggle,
  sidebarOverlayShown,
  onToggleSidebar,
  breadcrumbItems,
  menuItems,
}: ScopeHeaderProps) => {
  const t = useTranslationFn();
  const isSmallScreen = useSmallScreen();
  const currentPage = getCurrentPage();
  const navigateToSameScopeUrl = useNavigateToSameScopeUrl();
  const [helpModalOpen, setHelpModalOpen] = useState(false);
  const [backClickText, onBackClick] = useBackButtonInfo();

  const currentPageHasHelp = useMemo(() => {
    const k = `page_help.${currentPage}`;
    return k !== t(k);
  }, [t, currentPage]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([e]) => e.target.toggleAttribute('data-stuck', e.intersectionRatio < 1),
      { threshold: [1], root: document.getElementById('content-layout') }
    );
    const el = document.getElementById('scope-header');
    if (el) observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const onMenuClick = useCallback(
    (item: { key: string }) => navigateToSameScopeUrl(item.key),
    [navigateToSameScopeUrl]
  );

  if (!breadcrumbItems.length && !showSidebarToggle) return null;

  return (
    <header id="scope-header" style={{ paddingLeft: showSidebarToggle ? undefined : 'var(--content-padding-h)' }}>
      <CurrentPageHelpModal open={helpModalOpen} onCancel={() => setHelpModalOpen(false)} />
      <Flex>
        {showSidebarToggle && (
          <Button
            id="scope-header__sidebar-toggle"
            className={sidebarOverlayShown ? 'active' : ''}
            icon={<FilterOutlined />}
            color="default"
            variant="filled"
            size="large"
            onMouseDown={onToggleSidebar}
          />
        )}
        {breadcrumbItems.length > 0 && (
          <Flex className="scoped-title flex-1" align="center">
            <Flex className="flex-1 overflow-hidden" align="center">
              {backClickText !== undefined && onBackClick !== undefined ? (
                <Tooltip title={backClickText}>
                  <Button
                    className="scoped-title__back"
                    icon={<ArrowLeftOutlined />}
                    type="text"
                    shape="circle"
                    size="large"
                    onClick={onBackClick}
                  />
                </Tooltip>
              ) : null}
              <Breadcrumb className="scoped-title__breadcrumb" items={breadcrumbItems} itemRender={breadcrumbRender} />
              {!!menuItems && menuItems.length > 1 && (
                <Menu
                  id="scope-header__menu"
                  mode="horizontal"
                  items={menuItems}
                  selectedKeys={[currentPage]}
                  onClick={onMenuClick}
                  style={{ width: isSmallScreen ? 52 : undefined }}
                />
              )}
            </Flex>
            {currentPageHasHelp && (
              <Tooltip title={t('Help')} placement="bottom">
                <Button
                  color="default"
                  variant="filled"
                  icon={<QuestionOutlined />}
                  shape="circle"
                  onClick={() => setHelpModalOpen(true)}
                />
              </Tooltip>
            )}
          </Flex>
        )}
      </Flex>
    </header>
  );
};

export default ScopeHeader;
