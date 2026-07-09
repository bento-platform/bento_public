import { useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { HomeOutlined } from '@ant-design/icons';
import type { BreadcrumbItemType } from 'antd/es/breadcrumb/Breadcrumb';

import { BentoRoute } from '@/types/routes';
import { useLanguage, useTranslationFn } from '@/hooks';
import { useSelectedScope, useSelectedScopeTitles } from '@/features/metadata/hooks';
import { useSmallScreen } from '@/hooks/useResponsiveContext';
import { useGetRouteTitleAndIcon } from '@/hooks/navigation';
import { useExtraBreadcrumb } from '@/features/ui/hooks';
import { getCurrentPage } from '@/utils/router';
import { PCGL_MODE } from '@/config';

export const useTitleBreadcrumbItems = (): BreadcrumbItemType[] => {
  const t = useTranslationFn();
  const language = useLanguage();
  const isSmallScreen = useSmallScreen();

  const { scope, fixedProject, fixedDataset } = useSelectedScope();
  const { projectTitle, datasetTitle } = useSelectedScopeTitles();
  const location = useLocation();
  const cameFromProject = (location.state as { fromProjectScope?: boolean } | null)?.fromProjectScope;

  const getRouteTitleAndIcon = useGetRouteTitleAndIcon();

  const currentPage = getCurrentPage();

  const extraBreadcrumb = useExtraBreadcrumb();

  return useMemo(() => {
    const currentPageTitle = t(getRouteTitleAndIcon(currentPage)[0]);

    const items: BreadcrumbItemType[] = [];

    if (scope.project && !fixedProject && !(PCGL_MODE && scope.dataset && !cameFromProject)) {
      // If we have more than one project (or we're in catalogue mode), fixedProject will be false, meaning we should
      // show project context in the navigation:
      items.push({
        title: projectTitle,
        path: `/${language}/p/${scope.project}`,
      });
    }

    if (scope.dataset && !fixedDataset) {
      // If we have a dataset selected, and we don't have just a single project+dataset, we should show the dataset
      // context in the navigation.
      if (PCGL_MODE || (scope.project && fixedProject)) {
        // If we additionally have a fixed project (or aren't showing projects in the breadcrumb [PCGL_MODE]), we can
        // "anchor" the dataset visually vs. the root page using a home icon:
        items.push({
          title: <HomeOutlined />,
          path: `/${language}/`,
        });
      }
      items.push({
        title: datasetTitle,
        path: `/${language}/d/${scope.dataset}`,
      });
    }

    // We treat the overview as the "default" page, meaning we won't show the page name in the breadcrumb bar.
    if (currentPage !== BentoRoute.Overview) {
      items.push({ title: currentPageTitle });
    }

    if (extraBreadcrumb) {
      items.push(extraBreadcrumb);
    }

    return isSmallScreen && items.length ? [items.at(-1)!] : items;
  }, [
    language,
    t,
    projectTitle,
    datasetTitle,
    cameFromProject,
    scope,
    fixedProject,
    fixedDataset,
    currentPage,
    getRouteTitleAndIcon,
    extraBreadcrumb,
    isSmallScreen,
  ]);
};
