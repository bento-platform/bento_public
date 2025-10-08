import { useCallback, useEffect, useMemo, useState } from 'react';
import { Flex, FloatButton, Tabs, type TabsProps } from 'antd';
import {
  AppstoreAddOutlined,
  FileTextOutlined,
  LoadingOutlined,
  SearchOutlined,
  SolutionOutlined,
} from '@ant-design/icons';

import { convertSequenceAndDisplayData, generateLSChartDataKey, saveValue } from '@/utils/localStorage';
import type { Sections } from '@/types/data';
import type { DiscoveryScope } from '@/features/metadata/metadata.store';

import { WAITING_STATES } from '@/constants/requests';
import { RequestStatus } from '@/types/requests';

import AboutBox from './AboutBox';
import OverviewSection from './OverviewSection';
import OverviewDatasets from './OverviewDatasets';
import ManageChartsDrawer from './Drawer/ManageChartsDrawer';
import CountsAndResults from './CountsAndResults';
import LastIngestionInfo from './LastIngestion';
import DatasetProvenance from '@/components/Provenance/DatasetProvenance';
import SearchForm from '@/components/Search/SearchForm';

import { useTranslationFn } from '@/hooks';
import { useSearchRouterAndHandler } from '@/hooks/useSearchRouterAndHandler';
import { useSelectedDataset, useSelectedProject, useSelectedScope } from '@/features/metadata/hooks';
import { useSearchQuery, useSearchableFields } from '@/features/search/hooks';
import FiltersAppliedTag from '@/components/Search/FiltersAppliedTag';

const saveScopeOverviewToLS = (scope: DiscoveryScope, sections: Sections) => {
  saveValue(generateLSChartDataKey(scope), convertSequenceAndDisplayData(sections));
};

const OverviewChartDashboard = () => {
  const t = useTranslationFn();

  const [drawerVisible, setDrawerVisible] = useState(false);

  const { scope } = useSelectedScope();
  const selectedProject = useSelectedProject();
  const selectedDataset = useSelectedDataset();

  // This is essentially a large effect hook with a few dependencies, which processes (and rewrites if needed) the query
  // URL and dispatches discovery actions for fetching overview/query response data.
  useSearchRouterAndHandler();

  const { discoveryStatus, sections, filterQueryParams, textQuery, uiHints } = useSearchQuery();

  // Lazy-loading hooks means this is loaded only if OverviewChartDashboard is rendered:
  const searchableFields = useSearchableFields();

  // If we have no entities with data confirmed, don't bother showing charts (or last ingested details)
  const waitingForHints = WAITING_STATES.includes(uiHints.status);
  const noDataInScope = uiHints.status === RequestStatus.Fulfilled && uiHints.data.entities_with_data.length === 0;

  const displayedSections = noDataInScope
    ? []
    : sections.filter(({ charts }) => charts.findIndex(({ isDisplayed }) => isDisplayed) !== -1);

  const onManageChartsOpen = useCallback(() => setDrawerVisible(true), []);
  const onManageChartsClose = useCallback(() => {
    setDrawerVisible(false);
    // When we close the drawer, save any changes to localStorage. This helps ensure width gets saved:
    saveScopeOverviewToLS(scope, sections);
  }, [scope, sections]);

  // ---

  const [hasChangedTabs, setHasChangedTabs] = useState(false);
  const [pageTab, setPageTab] = useState('about');

  const changePage = useCallback(
    (page: string) => {
      // Cannot go to search page if we don't know if search is available yet:
      if (waitingForHints && page === 'search') return;
      setPageTab(page);
      setHasChangedTabs(true);
    },
    [waitingForHints]
  );

  useEffect(() => {
    // If the user has not manually changed tabs / this effect has not already run, and we have at least one search
    // filter set, auto-switch to the search tab rather than the about tab to make the applied filter(s) more obvious.

    if (!hasChangedTabs && (Object.keys(filterQueryParams).length || textQuery.length)) {
      changePage('search');
    }
  }, [hasChangedTabs, filterQueryParams, textQuery, changePage]);

  const pageTabItems: TabsProps['items'] = useMemo(
    () => [
      { key: 'about', label: t('About'), icon: <FileTextOutlined /> },
      ...(scope.dataset ? [{ key: 'provenance', label: t('Provenance'), icon: <SolutionOutlined /> }] : []),
      ...(noDataInScope
        ? []
        : [
            {
              key: 'search',
              label: !waitingForHints && (
                <span>
                  {t('Search')}
                  <FiltersAppliedTag />
                </span>
              ),
              icon: waitingForHints ? <LoadingOutlined /> : <SearchOutlined />,
            },
          ]),
    ],
    [t, scope.dataset, waitingForHints, noDataInScope]
  );

  const loadingNewData = WAITING_STATES.includes(discoveryStatus);

  return (
    <>
      <Flex vertical={true} gap={24} className="container margin-auto">
        <div className="dashboard-tabs">
          <Tabs
            type="card"
            size="large"
            activeKey={pageTab}
            onChange={changePage}
            items={pageTabItems}
            id="dashboard-tabs"
            tabBarStyle={{ marginBottom: -1, zIndex: 1 }}
          />
          {pageTab === 'about' ? <AboutBox /> : null}
          {pageTab === 'provenance' && selectedDataset ? (
            <DatasetProvenance dataset={selectedDataset} showTitle={false} />
          ) : null}
          {pageTab === 'search' ? <SearchForm /> : null}
        </div>

        <CountsAndResults />

        {selectedProject && !scope.dataset && selectedProject.datasets.length ? (
          // If we have a project with at least one dataset, show a dataset mini-catalogue in the project overview
          <OverviewDatasets datasets={selectedProject.datasets} parentProjectID={selectedProject.identifier} />
        ) : null}

        {displayedSections.map(({ sectionTitle, charts }, i) => (
          <div key={i} className={'overview' + (loadingNewData ? ' loading' : '')}>
            <OverviewSection title={sectionTitle} chartData={charts} searchableFields={searchableFields} />
          </div>
        ))}

        {!noDataInScope && <LastIngestionInfo />}
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
