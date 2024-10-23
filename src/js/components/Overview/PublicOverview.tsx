import { useState, useEffect, useCallback } from 'react';
import { Row, Col, FloatButton, Card, Skeleton, Typography } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

import { convertSequenceAndDisplayData, saveValue } from '@/utils/localStorage';
import type { Sections } from '@/types/data';

import { BOX_SHADOW, LOCALSTORAGE_CHARTS_KEY } from '@/constants/overviewConstants';

import OverviewSection from './OverviewSection';
import ManageChartsDrawer from './Drawer/ManageChartsDrawer';
import Counts from './Counts';
import LastIngestionInfo from './LastIngestion';
import Loader from '@/components/Loader';

import { useAppSelector } from '@/hooks';
import { useSelectedProject, useSelectedScope } from '@/features/metadata/hooks';
import { useTranslation } from 'react-i18next';
import Dataset from '@/components/Provenance/Dataset';

const ABOUT_CARD_STYLE = { width: '100%', maxWidth: '1390px', borderRadius: '11pX', ...BOX_SHADOW };
const MANAGE_CHARTS_BUTTON_STYLE = { right: '5em', bottom: '1.5em', transform: 'scale(125%)' };

const PublicOverview = () => {
  const { i18n } = useTranslation();

  const [drawerVisible, setDrawerVisible] = useState(false);
  const [aboutContent, setAboutContent] = useState('');

  const {
    isFetchingData: isFetchingOverviewData,
    isContentPopulated,
    sections,
  } = useAppSelector((state) => state.data);
  const { isFetchingAbout, about } = useAppSelector((state) => state.content);

  const selectedProject = useSelectedProject();
  const { scope } = useSelectedScope();

  useEffect(() => {
    // Save sections to localStorage when they change
    if (isFetchingOverviewData) return;
    saveToLocalStorage(sections);
  }, [isFetchingOverviewData, sections]);

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

  return !isContentPopulated || isFetchingOverviewData ? (
    <Loader />
  ) : (
    <>
      <Card style={ABOUT_CARD_STYLE}>
        {isFetchingAbout ? (
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
            <Row gutter={[12, 12]}>
              {selectedProject.datasets.map((d) => (
                <Col key={d.identifier} style={{ width: '100%', maxWidth: 360 }}>
                  <Dataset parentProjectID={selectedProject.identifier} dataset={d} format="small-card" />
                </Col>
              ))}
            </Row>
          </Col>
        </Row>
      )}
      <Row>
        <Col flex={1}>
          {displayedSections.map(({ sectionTitle, charts }, i) => (
            <div key={i} className="overview">
              <OverviewSection title={sectionTitle} chartData={charts} />
            </div>
          ))}
          <LastIngestionInfo />
        </Col>
      </Row>

      <ManageChartsDrawer onManageDrawerClose={onManageChartsClose} manageDrawerVisible={drawerVisible} />
      <FloatButton
        type="primary"
        icon={<PlusOutlined />}
        tooltip="Manage Charts"
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
