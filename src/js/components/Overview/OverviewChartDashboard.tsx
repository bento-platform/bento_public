import { useCallback, useEffect, useState } from 'react';
import { Flex, FloatButton, Tabs, type TabsProps, Tag } from 'antd';
import { AppstoreAddOutlined, FileTextOutlined, SearchOutlined, SolutionOutlined } from '@ant-design/icons';

import { convertSequenceAndDisplayData, saveValue } from '@/utils/localStorage';
import type { Sections } from '@/types/data';
import { RequestStatus } from '@/types/requests';

import { LOCALSTORAGE_CHARTS_KEY } from '@/constants/overviewConstants';
import { WAITING_STATES } from '@/constants/requests';

import AboutBox from './AboutBox';
import OverviewSection from './OverviewSection';
import OverviewDatasets from './OverviewDatasets';
import ManageChartsDrawer from './Drawer/ManageChartsDrawer';
import Counts from './Counts';
import LastIngestionInfo from './LastIngestion';
import DatasetProvenance from '@/components/Provenance/DatasetProvenance';
import { SearchForm, useSearchRouterAndHandler } from '@/components/Search/Search';

import { useTranslationFn } from '@/hooks';
import { useData, useSearchableFields } from '@/features/data/hooks';
import { useSelectedDataset, useSelectedProject, useSelectedScope } from '@/features/metadata/hooks';
import { useSearchQuery } from '@/features/search/hooks';

const saveToLocalStorage = (sections: Sections) => {
  saveValue(LOCALSTORAGE_CHARTS_KEY, convertSequenceAndDisplayData(sections));
};

const OverviewChartDashboard = () => {
  const t = useTranslationFn();

  const [drawerVisible, setDrawerVisible] = useState(false);

  const { scope } = useSelectedScope();
  const selectedProject = useSelectedProject();
  const selectedDataset = useSelectedDataset();

  // TODO
  useSearchRouterAndHandler();

  // Lazy-loading hooks means these are called only if OverviewChartDashboard is rendered ---
  const { status: overviewDataStatus, sections } = useData();
  const { filterQueryParams } = useSearchQuery();
  const searchableFields = useSearchableFields();
  // ---

  useEffect(() => {
    // Save sections to localStorage when they change
    if (overviewDataStatus != RequestStatus.Fulfilled) return;
    saveToLocalStorage(sections);
  }, [overviewDataStatus, sections]);

  const displayedSections = sections.filter(({ charts }) => charts.findIndex(({ isDisplayed }) => isDisplayed) !== -1);

  const onManageChartsOpen = useCallback(() => setDrawerVisible(true), []);
  const onManageChartsClose = useCallback(() => {
    setDrawerVisible(false);
    // When we close the drawer, save any changes to localStorage. This helps ensure width gets saved:
    saveToLocalStorage(sections);
  }, [sections]);

  // ---

  const [pageTab, setPageTab] = useState('about');

  const nFilters = Object.keys(filterQueryParams).length;
  // todo: translate filters applied with pluralization
  const nFiltersAppliedTag = (
    <Tag
      color="green"
      style={{
        transition: 'max-width 0.2s, padding 0.2s, border-width 0.2s, opacity 0.2s, margin-left 0.2s',
        maxWidth: nFilters ? 150 : 0,
        // width: nFilters ? 150 : 0,
        padding: nFilters ? '0 7px' : 0,
        borderWidth: nFilters ? '1px' : 0,
        marginLeft: nFilters ? '1em' : '1px',
        verticalAlign: 'top',
        marginTop: 2,
        textWrap: 'nowrap',
        overflow: 'hidden',
        boxSizing: 'border-box',
      }}
    >
      {nFilters} filter(s) applied
    </Tag>
  );

  const pageTabItems: TabsProps['items'] = [
    { key: 'about', label: t('About'), icon: <FileTextOutlined /> },
    ...(scope.dataset ? [{ key: 'provenance', label: t('Provenance'), icon: <SolutionOutlined /> }] : []),
    {
      key: 'search',
      label: (
        <span>
          {t('Search')}
          {nFiltersAppliedTag}
        </span>
      ),
      icon: <SearchOutlined />,
    },
  ];

  const loadingNewData = WAITING_STATES.includes(overviewDataStatus);

  return (
    <>
      <Flex vertical={true} gap={24} className="container margin-auto">
        <div className="dashboard-tabs">
          <Tabs
            type="card"
            size="large"
            activeKey={pageTab}
            onChange={(k) => setPageTab(k)}
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

        <Counts />

        {selectedProject && !scope.dataset && selectedProject.datasets.length ? (
          // If we have a project with at least one dataset, show a dataset mini-catalogue in the project overview
          <OverviewDatasets datasets={selectedProject.datasets} parentProjectID={selectedProject.identifier} />
        ) : null}

        {displayedSections.map(({ sectionTitle, charts }, i) => (
          <div key={i} className={'overview' + (loadingNewData ? ' loading' : '')}>
            <OverviewSection title={sectionTitle} chartData={charts} searchableFields={searchableFields} />
          </div>
        ))}

        <LastIngestionInfo />
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
