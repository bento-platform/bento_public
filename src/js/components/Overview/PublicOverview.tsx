import React, { useState, useEffect, useCallback } from 'react';
import { Row, Col, FloatButton, Card, Skeleton } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

import { convertSequenceAndDisplayData, saveValue } from '@/utils/localStorage';
import type { Sections } from '@/types/data';

import { BOX_SHADOW, LOCALSTORAGE_CHARTS_KEY } from '@/constants/overviewConstants';

import OverviewSection from './OverviewSection';
import ManageChartsDrawer from './Drawer/ManageChartsDrawer';
import Counts from './Counts';
import { useAppSelector } from '@/hooks';
import { useTranslation } from 'react-i18next';
import LastIngestionInfo from './LastIngestion';
import Loader from '@/components/Loader';

const ABOUT_CARD_STYLE = { width: '100%', maxWidth: '1390px', borderRadius: '11pX', ...BOX_SHADOW };
const MANAGE_CHARTS_BUTTON_STYLE = { right: '5em', bottom: '1.5em', transform: 'scale(125%)' };

const PublicOverview = () => {
  const { i18n } = useTranslation();

  const [drawerVisible, setDrawerVisible] = useState(false);
  const [aboutContent, setAboutContent] = useState('');

  const { isFetchingData: isFetchingOverviewData, sections } = useAppSelector((state) => state.data);
  const { isFetchingAbout, about } = useAppSelector((state) => state.content);

  useEffect(() => {
    // Save sections to localStorage when they change
    saveToLocalStorage(sections);
  }, [sections]);

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

  return isFetchingOverviewData ? (
    <Loader />
  ) : (
    <>
      <Card style={ABOUT_CARD_STYLE}>
        {isFetchingAbout ? (
          <Skeleton title={false} paragraph={{ rows: 2 }} />
        ) : (
          <div dangerouslySetInnerHTML={{ __html: aboutContent }} />
        )}
      </Card>
      <Row>
        <Col flex={1}>
          <Counts />
        </Col>
      </Row>
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
