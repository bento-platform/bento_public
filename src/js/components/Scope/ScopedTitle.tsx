import { useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

import { Breadcrumb, type BreadcrumbProps, Button, Flex, Space, Tooltip } from 'antd';
import { ArrowLeftOutlined, ProfileOutlined, QuestionOutlined } from '@ant-design/icons';
import type { BreadcrumbItemType } from 'antd/es/breadcrumb/Breadcrumb';
import CurrentPageHelpModal from '@/components/Util/CurrentPageHelpModal';
import ScopePickerModal from './ScopePickerModal';

import { useSelectedScope } from '@/features/metadata/hooks';
import { useSearchQueryParams } from '@/features/search/hooks';
import { useTranslationFn } from '@/hooks';
import { useNavigateToRoot, useNavigateToSameScopeUrl, useNavigateToScope } from '@/hooks/navigation';
import { BentoRoute, TOP_LEVEL_ONLY_ROUTES } from '@/types/routes';
import { getCurrentPage } from '@/utils/router';
import { buildQueryParamsUrl } from '@/features/search/utils';

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
    // Cases where we DO show a back button, given the scope is set:
    //  - We're in a project and in catalog mode
    //  - We're in a dataset and don't have a fixed dataset (a fixed dataset implies a fixed project as well)
    //  - Any time we're on the phenopackets page
    if (currentPage === BentoRoute.Phenopackets) {
      // When going "back" here, we are staying in the same scope, so the logic looks a bit different:
      return [
        scope.dataset ? 'Back to dataset' : 'Back to project',
        () => navigateToSameScopeUrl(buildQueryParamsUrl(BentoRoute.Overview, overviewQueryParams), false),
      ];
    } else {
      if (scope.dataset) {
        return fixedDataset
          ? NO_BACK_BUTTON
          : ['Back to project', () => navigateToScope({ project: scope.project }, BentoRoute.Overview)];
      } else if (scope.project) {
        return fixedProject ? NO_BACK_BUTTON : ['Back to catalogue', navigateToRoot];
      } else {
        // No project selected, nothing to go "back" to
        return NO_BACK_BUTTON;
      }
    }
  }, [
    currentPage,
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

const ScopedTitle = ({ breadcrumbItems }: { breadcrumbItems: BreadcrumbItemType[] }) => {
  const location = useLocation();
  const t = useTranslationFn();

  const { fixedProject, fixedDataset } = useSelectedScope();

  const currentPage = getCurrentPage();
  const scopeSelectionEnabled =
    !(fixedProject && fixedDataset) &&
    !TOP_LEVEL_ONLY_ROUTES.includes(currentPage) &&
    currentPage !== BentoRoute.Phenopackets;

  const [scopeSelectModalOpen, setScopeSelectModalOpen] = useState(false);
  const [helpModalOpen, setHelpModalOpen] = useState(false);
  const [prevLocation, setPrevLocation] = useState(location);

  if (location !== prevLocation) {
    setPrevLocation(location);
    // If the selected scope changes (likely from the scope select modal), auto-close the modal.
    setScopeSelectModalOpen(false);
  }

  const currentPageHasHelp = useMemo(() => {
    const k = `page_help.${currentPage}`;
    return k !== t(k);
  }, [t, currentPage]);

  const [backClickText, onBackClick] = useBackButtonInfo();

  if (breadcrumbItems.length) {
    return (
      <>
        <ScopePickerModal isModalOpen={scopeSelectModalOpen} setIsModalOpen={setScopeSelectModalOpen} />
        <CurrentPageHelpModal open={helpModalOpen} onCancel={() => setHelpModalOpen(false)} />
        <Flex className="scoped-title flex-1" align="center">
          <Flex className="flex-1" align="center">
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
