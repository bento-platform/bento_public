import { useCallback, useEffect, useState } from 'react';
import { Flex, FloatButton, Tabs, Typography } from 'antd';
import { AppstoreAddOutlined, FileTextOutlined, SearchOutlined, SolutionOutlined } from '@ant-design/icons';

import { convertSequenceAndDisplayData, saveValue } from '@/utils/localStorage';
import type { Sections } from '@/types/data';
import { RequestStatus } from '@/types/requests';

import { LOCALSTORAGE_CHARTS_KEY } from '@/constants/overviewConstants';
import { WAITING_STATES } from '@/constants/requests';

import AboutBox from './AboutBox';
import OverviewSection from './OverviewSection';
import ManageChartsDrawer from './Drawer/ManageChartsDrawer';
import Counts from './Counts';
import LastIngestionInfo from './LastIngestion';
import Loader from '@/components/Loader';
import Dataset from '@/components/Provenance/Dataset';
import { SearchForm } from '@/components/Search/Search';

import { useTranslationFn } from '@/hooks';
import { useData, useSearchableFields } from '@/features/data/hooks';
import { useSelectedProject, useSelectedScope } from '@/features/metadata/hooks';

const saveToLocalStorage = (sections: Sections) => {
  saveValue(LOCALSTORAGE_CHARTS_KEY, convertSequenceAndDisplayData(sections));
};

const OverviewChartDashboard = () => {
  const t = useTranslationFn();

  const [drawerVisible, setDrawerVisible] = useState(false);

  const { scope } = useSelectedScope();
  const selectedProject = useSelectedProject();

  // Lazy-loading hooks means these are called only if OverviewChartDashboard is rendered ---
  const { status: overviewDataStatus, sections } = useData();
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

  const pageTabItems = [
    { key: 'about', label: t('About'), icon: <FileTextOutlined /> },
    { key: 'provenance', label: t('Provenance'), icon: <SolutionOutlined /> },
    { key: 'search', label: t('Search'), icon: <SearchOutlined /> },
  ];

  return WAITING_STATES.includes(overviewDataStatus) ? (
    <Loader />
  ) : (
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
          {pageTab === 'provenance' ? <AboutBox /> : null}
          {pageTab === 'search' ? <SearchForm /> : null}
        </div>

        <Counts />

        {selectedProject && !scope.dataset && selectedProject.datasets.length ? (
          // If we have a project with more than one dataset, show a dataset selector in the project overview
          <div>
            <Typography.Title level={3}>Datasets</Typography.Title>
            <div className="dataset-provenance-card-grid">
              {selectedProject.datasets.map((d) => (
                <div key={d.identifier}>
                  <Dataset parentProjectID={selectedProject.identifier} dataset={d} format="card" />
                </div>
              ))}
            </div>
          </div>
        ) : null}

        {displayedSections.map(({ sectionTitle, charts }, i) => (
          <div key={i} className="overview">
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
