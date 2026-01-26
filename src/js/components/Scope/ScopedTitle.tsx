import { useEffect, useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { Breadcrumb, type BreadcrumbProps, Button, Flex, Space, Tooltip } from 'antd';
import { ProfileOutlined, QuestionOutlined } from '@ant-design/icons';
import type { BreadcrumbItemType } from 'antd/es/breadcrumb/Breadcrumb';
import FiltersAppliedTag from '@/components/Search/FiltersAppliedTag';
import CurrentPageHelpModal from '@/components/Util/CurrentPageHelpModal';
import ScopePickerModal from './ScopePickerModal';

import { useSelectedScope, useSelectedScopeTitles } from '@/features/metadata/hooks';
import { useExtraBreadcrumb } from '@/features/ui/hooks';
import { useTranslationFn } from '@/hooks';
import { useGetRouteTitleAndIcon } from '@/hooks/navigation';
import { BentoRoute, TOP_LEVEL_ONLY_ROUTES } from '@/types/routes';
import { getCurrentPage } from '@/utils/router';

const breadcrumbRender: BreadcrumbProps['itemRender'] = (route, _params, routes, _paths) => {
  const isLast = route?.path === routes[routes.length - 1]?.path;
  return isLast || !route.path ? <span>{route.title}</span> : <Link to={{ pathname: route.path }}>{route.title}</Link>;
};

const ScopedTitle = () => {
  const location = useLocation();
  const { i18n } = useTranslation();
  const t = useTranslationFn();

  const { scope, fixedProject, fixedDataset } = useSelectedScope();
  const { projectTitle, datasetTitle } = useSelectedScopeTitles();

  // const navigateToSameScopeUrl = useNavigateToSameScopeUrl();  TODO: re-enable for sidebar
  const getRouteTitleAndIcon = useGetRouteTitleAndIcon();

  const currentPage = getCurrentPage();
  const scopeSelectionEnabled =
    !(fixedProject && fixedDataset) &&
    !TOP_LEVEL_ONLY_ROUTES.includes(currentPage) &&
    currentPage !== BentoRoute.Phenopackets;

  // const overviewQueryParams = useSearchQueryParams();  TODO: re-enable for sidebar

  const [scopeSelectModalOpen, setScopeSelectModalOpen] = useState(false);
  const [helpModalOpen, setHelpModalOpen] = useState(false);

  const currentPageHasHelp = useMemo(() => {
    const k = `page_help.${currentPage}`;
    return k !== t(k);
  }, [t, currentPage]);

  const extraBreadcrumb = useExtraBreadcrumb();

  useEffect(() => {
    // If the selected scope changes (likely from the scope select modal), auto-close the modal.
    setScopeSelectModalOpen(false);
  }, [location]);

  const breadcrumbItems: BreadcrumbItemType[] = useMemo(() => {
    const currentPageTitle = t(getRouteTitleAndIcon(currentPage)[0]);

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

    if (extraBreadcrumb) {
      items.push(extraBreadcrumb);
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
    extraBreadcrumb,
  ]);

  useEffect(() => {
    if (!breadcrumbItems.length) return;

    const observer = new IntersectionObserver(
      ([e]) => {
        return e.target.toggleAttribute('data-stuck', e.intersectionRatio < 1);
      },
      { threshold: [1], root: document.getElementById('content-layout') }
    );

    const st = document.querySelector('.scoped-title');

    if (st) {
      observer.observe(st);
    }
  }, [breadcrumbItems]);

  if (breadcrumbItems.length) {
    return (
      <>
        <ScopePickerModal isModalOpen={scopeSelectModalOpen} setIsModalOpen={setScopeSelectModalOpen} />
        <CurrentPageHelpModal open={helpModalOpen} onCancel={() => setHelpModalOpen(false)} />
        <Flex className="scoped-title" align="center">
          <Flex className="flex-1" align="center">
            {/* TODO: re-enable this code when we get rid of the sidebar! */}
            {/*{currentPage === BentoRoute.Phenopackets ? (*/}
            {/*  // For the Phenopackets route, put a back button in the header itself to go back*/}
            {/*  <Button*/}
            {/*    className="scoped-title__back"*/}
            {/*    icon={<ArrowLeftOutlined />}*/}
            {/*    type="text"*/}
            {/*    shape="circle"*/}
            {/*    size="large"*/}
            {/*    onClick={() => {*/}
            {/*      navigateToSameScopeUrl(buildQueryParamsUrl('overview', overviewQueryParams), false);*/}
            {/*    }}*/}
            {/*  />*/}
            {/*) : null}*/}
            <Breadcrumb className="scoped-title__breadcrumb" items={breadcrumbItems} itemRender={breadcrumbRender} />
            {currentPage === BentoRoute.Overview ? <FiltersAppliedTag /> : null}
          </Flex>
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
          </Space>
        </Flex>
      </>
    );
  }

  return null;
};

export default ScopedTitle;
