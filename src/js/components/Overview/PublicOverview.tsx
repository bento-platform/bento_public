import { useCallback, useEffect, useState } from 'react';
import { Card, Col, FloatButton, Row, Skeleton, Typography } from 'antd';
import { AppstoreAddOutlined } from '@ant-design/icons';

import { convertSequenceAndDisplayData, saveValue } from '@/utils/localStorage';
import type { Sections } from '@/types/data';

import { BOX_SHADOW, LOCALSTORAGE_CHARTS_KEY } from '@/constants/overviewConstants';
import { WAITING_STATES } from '@/constants/requests';

import OverviewSection from './OverviewSection';
import ManageChartsDrawer from './Drawer/ManageChartsDrawer';
import Counts from './Counts';
import LastIngestionInfo from './LastIngestion';
import Loader from '@/components/Loader';
import Dataset from '@/components/Provenance/Dataset';

import { useAppSelector } from '@/hooks';
import { useSearchableFields } from '@/features/data/hooks';
import { useSelectedProject, useSelectedScope } from '@/features/metadata/hooks';
import { useTranslation } from 'react-i18next';
import { RequestStatus } from '@/types/requests';

const ABOUT_CARD_STYLE = { width: '100%', maxWidth: '1390px', borderRadius: '11pX', ...BOX_SHADOW };
const MANAGE_CHARTS_BUTTON_STYLE = { right: '5em', bottom: '1.5em', transform: 'scale(125%)' };

const PublicOverview = () => {
  const { i18n, t } = useTranslation();

  const [drawerVisible, setDrawerVisible] = useState(false);
  const [aboutContent, setAboutContent] = useState('');

  const { status: overviewDataStatus, sections } = useAppSelector((state) => state.data);
  const { status: aboutStatus, about } = useAppSelector((state) => state.content);

  const selectedProject = useSelectedProject();
  const { scope } = useSelectedScope();

  useEffect(() => {
    // Save sections to localStorage when they change
    if (overviewDataStatus != RequestStatus.Fulfilled) return;
    saveToLocalStorage(sections);
  }, [overviewDataStatus, sections]);

  useEffect(() => {
    const activeLanguage = i18n.language;
    const activeAbout = about[activeLanguage];
    setAboutContent(activeAbout);
  }, [i18n.language, about]);

  const displayedSections = sections.filter(({ charts }) => charts.findIndex(({ isDisplayed }) => isDisplayed) !== -1);

  const onManageChartsOpen = useCallback(() => setDrawerVisible(true), []);
  const onManageChartsClose = useCallback(() => {
    setDrawerVisible(false);
    // When we close the drawer, save any changes to localStorage. This helps ensure width gets saved:
    saveToLocalStorage(sections);
  }, [sections]);

  const searchableFields = useSearchableFields();

  return WAITING_STATES.includes(overviewDataStatus) ? (
    <Loader />
  ) : (
    <>
      <Card style={ABOUT_CARD_STYLE}>
        {aboutStatus === RequestStatus.Idle || aboutStatus === RequestStatus.Pending ? (
          <Skeleton title={false} paragraph={{ rows: 2 }} />
        ) : (
          <div className="about-content" dangerouslySetInnerHTML={{ __html: aboutContent }} />
        )}
      </Card>
      <Row>
        <Col flex={1}>
          <Counts />
        </Col>
      </Row>
      {selectedProject && !scope.dataset && (
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
      )}
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
        style={MANAGE_CHARTS_BUTTON_STYLE}
        onClick={onManageChartsOpen}
      />
    </>
  );
};

const saveToLocalStorage = (sections: Sections) => {
  saveValue(LOCALSTORAGE_CHARTS_KEY, convertSequenceAndDisplayData(sections));
};

export default PublicOverview;
