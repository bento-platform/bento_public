import { useCallback, useState } from 'react';
import { Flex, FloatButton } from 'antd';
import { AppstoreAddOutlined } from '@ant-design/icons';

import clsx from 'clsx';
import { convertSequenceAndDisplayData, generateLSChartDataKey, saveValue } from '@/utils/localStorage';

import type { Sections } from '@/types/data';
import type { DiscoveryScope } from '@/features/metadata/metadata.store';

import { WAITING_STATES } from '@/constants/requests';

import ProvenancePage from '@/components/Provenance/ProvenancePage';
import OverviewSection from './OverviewSection';
import OverviewDatasets from './OverviewDatasets';
import ManageChartsDrawer from './Drawer/ManageChartsDrawer';
import CountsAndResults from './CountsAndResults';
import LastIngestionInfo from './LastIngestion';

import { useTranslationFn } from '@/hooks';
import { useSearchRouterAndHandler } from '@/hooks/useSearchRouterAndHandler';
import { useSelectedProject, useSelectedScope, useScopeHasData } from '@/features/metadata/hooks';
import { useSearchQuery, useSearchableFields } from '@/features/search/hooks';
import { useIsInCatalogueMode } from '@/hooks/navigation';

const saveScopeOverviewToLS = (scope: DiscoveryScope, sections: Sections) => {
  saveValue(generateLSChartDataKey(scope), convertSequenceAndDisplayData(sections));
};

const OverviewChartDashboard = () => {
  const t = useTranslationFn();

  const [drawerVisible, setDrawerVisible] = useState(false);

  const { scope } = useSelectedScope();
  const selectedProject = useSelectedProject();
  const catalogueMode = useIsInCatalogueMode();

  // This is essentially a large effect hook with a few dependencies, which processes (and rewrites if needed) the query
  // URL and dispatches discovery actions for fetching overview/query response data.
  useSearchRouterAndHandler();

  const { discoveryStatus, sections, resultCountsByDataset } = useSearchQuery();

  // Lazy-loading hooks means this is loaded only if OverviewChartDashboard is rendered:
  const searchableFields = useSearchableFields();

  const onManageChartsOpen = useCallback(() => setDrawerVisible(true), []);
  const onManageChartsClose = useCallback(() => {
    setDrawerVisible(false);
    // When we close the drawer, save any changes to localStorage. This helps ensure width gets saved:
    saveScopeOverviewToLS(scope, sections);
  }, [scope, sections]);

  const scopeHasData = useScopeHasData();

  // ---

  // If we don't have any data to display, render the provenance page as the entire overview for the scope rather than
  // bothering to show a chart dashboard.
  if (!scopeHasData) return <ProvenancePage />;

  const loadingNewData = WAITING_STATES.includes(discoveryStatus);
  const displayedSections = sections.filter(({ charts }) => charts.findIndex(({ isDisplayed }) => isDisplayed) !== -1);

  return (
    <>
      <Flex vertical={true} gap={24} className={clsx('container', { 'margin-auto': !scopeHasData })}>
        {/*
            If we're in a scope with no data at all, don't bother rendering the
            "NOT ENOUGH DATA" message / "NO DATA" empty component. This way, we get a sort of "catalogue detail" view,
            allowing provenance-only datasets to be rendered nicely.
        */}
        {scopeHasData && <CountsAndResults />}

        {selectedProject && !scope.dataset && selectedProject.datasets.length ? (
          // If we have a project with at least one dataset, show a dataset mini-catalogue in the project overview
          <OverviewDatasets
            datasets={selectedProject.datasets}
            parentProjectID={selectedProject.identifier}
            countsByDataset={resultCountsByDataset}
          />
        ) : null}

        {displayedSections.map(({ sectionTitle, charts }, i) => (
          <div key={i} className={clsx('overview', loadingNewData && 'loading')}>
            <OverviewSection title={sectionTitle} chartData={charts} searchableFields={searchableFields} />
          </div>
        ))}

        {!catalogueMode && <LastIngestionInfo />}
      </Flex>

      <ManageChartsDrawer onManageDrawerClose={onManageChartsClose} manageDrawerVisible={drawerVisible} />

      <FloatButton.Group className="float-btn-pos">
        <FloatButton.BackTop target={() => document.getElementById('content-layout')!} />
        <FloatButton
          type="primary"
          icon={<AppstoreAddOutlined rotate={270} />}
          tooltip={t('Manage Charts')}
          onClick={onManageChartsOpen}
        />
      </FloatButton.Group>
    </>
  );
};

export default OverviewChartDashboard;
