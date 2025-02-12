import { type CSSProperties, useCallback, useEffect, useState } from 'react';
import { Col, FloatButton, Row, Typography } from 'antd';
import { AppstoreAddOutlined } from '@ant-design/icons';

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

import { useTranslationFn } from '@/hooks';
import { useData, useSearchableFields } from '@/features/data/hooks';
import { useSelectedProject, useSelectedScope } from '@/features/metadata/hooks';
import { useSmallScreen } from '@/hooks/useResponsiveContext';

// The 'right' position will be set based on small screen status dynamically
const MANAGE_CHARTS_BUTTON_STYLE: CSSProperties = { bottom: '1.5em', transform: 'scale(125%)' };

const saveToLocalStorage = (sections: Sections) => {
  saveValue(LOCALSTORAGE_CHARTS_KEY, convertSequenceAndDisplayData(sections));
};

const OverviewChartDashboard = () => {
  const t = useTranslationFn();

  const [drawerVisible, setDrawerVisible] = useState(false);

  const { scope } = useSelectedScope();
  const selectedProject = useSelectedProject();

  const isSmallScreen = useSmallScreen();

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

  return WAITING_STATES.includes(overviewDataStatus) ? (
    <Loader />
  ) : (
    <div className="container margin-auto">
      <AboutBox />

      <Row>
        <Col flex={1}>
          <Counts />
        </Col>
      </Row>

      {selectedProject && !scope.dataset && selectedProject.datasets.length ? (
        // If we have a project with more than one dataset, show a dataset selector in the project overview
        <Row>
          <Col flex={1}>
            <Typography.Title level={3}>Datasets</Typography.Title>
            <div className="dataset-provenance-card-grid">
              {selectedProject.datasets.map((d) => (
                <div key={d.identifier}>
                  <Dataset parentProjectID={selectedProject.identifier} dataset={d} format="card" />
                </div>
              ))}
            </div>
          </Col>
        </Row>
      ) : null}

      <Row>
        <Col flex={1}>
          {displayedSections.map(({ sectionTitle, charts }, i) => (
            <div key={i} className="overview">
              <OverviewSection title={sectionTitle} chartData={charts} searchableFields={searchableFields} />
            </div>
          ))}
          <LastIngestionInfo />
        </Col>
      </Row>

      <ManageChartsDrawer onManageDrawerClose={onManageChartsClose} manageDrawerVisible={drawerVisible} />
      <FloatButton
        type="primary"
        icon={<AppstoreAddOutlined rotate={270} />}
        tooltip={t('Manage Charts')}
        style={{ ...MANAGE_CHARTS_BUTTON_STYLE, right: isSmallScreen ? '1em' : '5em' }}
        onClick={onManageChartsOpen}
      />
    </div>
  );
};

export default OverviewChartDashboard;
