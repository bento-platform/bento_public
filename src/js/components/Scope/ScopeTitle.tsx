import { type CSSProperties, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Breadcrumb, type BreadcrumbProps } from 'antd';
import type { BreadcrumbItemType } from 'antd/es/breadcrumb/Breadcrumb';

import { useSelectedScope, useSelectedScopeTitles } from '@/features/metadata/hooks';

const BREADCRUMB_STYLE: CSSProperties = {
  // fontSize: '2rem',
  // marginBottom: 24,
  // position: 'sticky',
  // top: -3,
  // paddingTop: 3,
  // zIndex: 20,
  // backgroundColor: '#f5f5f5',
};

const breadcrumbRender: BreadcrumbProps['itemRender'] = (route, _params, routes, _paths) => {
  const isLast = route?.path === routes[routes.length - 1]?.path;
  return isLast || !route.path ? (
    <span>{route.title}</span>
  ) : (
    <Link to={{ pathname: route.path }} style={{ height: '3.3rem' }}>
      {route.title}
    </Link>
  );
};

const ScopeTitle = () => {
  const { i18n } = useTranslation();
  const { scope, fixedProject, fixedDataset } = useSelectedScope();
  const { projectTitle, datasetTitle } = useSelectedScopeTitles();

  const breadcrumbItems: BreadcrumbItemType[] = useMemo(() => {
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

    return items;
  }, [i18n.language, projectTitle, datasetTitle, scope, fixedProject, fixedDataset]);

  useEffect(() => {
    if (!breadcrumbItems.length) return;

    const observer = new IntersectionObserver(
      ([e]) => {
        console.log(e);
        return e.target.toggleAttribute('data-stuck', e.intersectionRatio < 1);
      },
      { threshold: [1], root: document.getElementById('content-layout') }
    );

    const sb = document.querySelector('.scope-breadcrumb');

    if (sb) {
      observer.observe(sb);
    }
  }, [breadcrumbItems]);

  if (breadcrumbItems.length) {
    return (
      <Breadcrumb
        className="scope-breadcrumb"
        style={BREADCRUMB_STYLE}
        items={breadcrumbItems}
        itemRender={breadcrumbRender}
      />
    );
  }

  return null;
};

export default ScopeTitle;
