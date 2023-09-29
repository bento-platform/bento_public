import React, { useState, useEffect, useCallback } from 'react';
import { Row, Col, FloatButton, Card, Skeleton } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

import { convertSequenceAndDisplayData, saveValue } from '@/utils/localStorage';
import { LOCALSTORAGE_CHARTS_KEY } from '@/constants/overviewConstants';

import OverviewSection from './OverviewSection';
import ManageChartsDrawer from './Drawer/ManageChartsDrawer';
import Counts from './Counts';
import { useAppSelector } from '@/hooks';
import { useTranslation } from 'react-i18next';
import LastIngestionInfo from './LastIngestion';

const ABOUT_CARD_STYLE = { borderRadius: '11px' };
const MANAGE_CHARTS_BUTTON_STYLE = { right: '5em', bottom: '1.5em', transform: 'scale(125%)' };

const PublicOverview = () => {
  const { sections } = useAppSelector((state) => state.data);

  const [drawerVisible, setDrawerVisible] = useState(false);

  const { isFetchingAbout, about } = useAppSelector((state) => state.content);

  const [aboutContent, setAboutContent] = useState('');

  const { i18n } = useTranslation();

  useEffect(() => {
    // Save sections to localStorage when they change
    saveValue(LOCALSTORAGE_CHARTS_KEY, convertSequenceAndDisplayData(sections));
  }, [sections]);

  useEffect(() => {
    const activeLanguage = i18n.language;
    const activeAbout = about[activeLanguage];
    setAboutContent(activeAbout);
  }, [i18n.language, about]);

  const displayedSections = sections.filter(({ charts }) => charts.findIndex(({ isDisplayed }) => isDisplayed) !== -1);

  const onManageChartsOpen = useCallback(() => setDrawerVisible(true), []);
  const onManageChartsClose = useCallback(() => setDrawerVisible(false), []);

  return (
    <>
      <div className="container">
        <Row>
          <Col flex={1}>
            <Card style={ABOUT_CARD_STYLE}>
              {isFetchingAbout ? (
                <Skeleton title={false} paragraph={{ rows: 2 }} />
              ) : (
                <div dangerouslySetInnerHTML={{ __html: aboutContent }} />
              )}
            </Card>
          </Col>
        </Row>
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
      </div>

      {/* Drawer & Button */}
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

export default PublicOverview;
