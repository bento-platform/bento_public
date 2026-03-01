import { useEffect, useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { Breadcrumb, type BreadcrumbProps, Button, Flex, Space, Tooltip } from 'antd';
import { HomeOutlined, ProfileOutlined, QuestionOutlined } from '@ant-design/icons';
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
      // If we have more than one project (or we're in catalogue mode), fixedProject will be false, meaning we should
      // show project context in the navigation:
      items.push({
        title: projectTitle,
        path: `/${i18n.language}/p/${scope.project}`,
      });
    }

    if (scope.dataset && !fixedDataset) {
      // If we have a dataset selected, and we don't have just a single project+dataset, we should show the dataset
      // context in the navigation.
      if (scope.project && fixedProject) {
        // If we additionally have a fixed project, we can "anchor" the dataset visually vs. the root page (which isn't
        // the catalogue, but rather the project) using a home icon:
        items.push({
          title: <HomeOutlined />,
          path: `/${i18n.language}/`,
        });
      }
      items.push({
        title: datasetTitle,
        path: `/${i18n.language}/d/${scope.dataset}`,
      });
    }

    // We treat the overview as the "default" page, meaning we won't show the page name in the breadcrumb bar.
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
            {/*      navigateToSameScopeUrl(buildQueryParamsUrl(BentoRoute.Overview, overviewQueryParams), false);*/}
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
