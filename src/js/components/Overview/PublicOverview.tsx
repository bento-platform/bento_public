import React, { useState, useEffect } from 'react';
import { Divider, Row, Col, FloatButton, Card, Skeleton } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

import { convertSequenceAndDisplayData, saveValue } from '@/utils/localStorage';
import { LOCALSTORAGE_CHARTS_KEY } from '@/constants/overviewConstants';

import OverviewSection from './OverviewSection';
import ManageChartsDrawer from './Drawer/ManageChartsDrawer';
import Counts from './Counts';
import i18n from '@/i18n';
import { useAppSelector } from '@/hooks';

const PublicOverview = () => {
  const { sections } = useAppSelector((state) => state.data);

  saveValue(LOCALSTORAGE_CHARTS_KEY, convertSequenceAndDisplayData(sections));

  const [drawerVisible, setDrawerVisible] = useState(false);

  const { isFetchingAbout, en_aboutHTML, fr_aboutHTML } = useAppSelector((state) => state.content);

  const [aboutContent, setAboutContent] = useState('');

  useEffect(() => {
    const activeLanguage = i18n.language;
    if (activeLanguage === 'en') {
      setAboutContent(en_aboutHTML);
    } else if (activeLanguage === 'fr') {
      setAboutContent(fr_aboutHTML);
    }
  }, [i18n.language, en_aboutHTML, fr_aboutHTML]);

  return (
    <>
      <div className="container">
        <Row justify="center">
          <Col>
            <Card style={{ borderRadius: '11px', maxWidth: '1323px' }}>
              {isFetchingAbout ? (
                <Skeleton title={false} paragraph={{ rows: 2 }} />
              ) : (
                <div dangerouslySetInnerHTML={{ __html: aboutContent }} />
              )}
            </Card>
            <Counts />
            {sections.map(({ sectionTitle, charts }, i) => (
              <div key={i} className="overview">
                <OverviewSection title={sectionTitle} chartData={charts} />
                <Divider />
              </div>
            ))}
          </Col>
        </Row>
      </div>

      {/* Drawer & Button */}
      <ManageChartsDrawer onManageDrawerClose={() => setDrawerVisible(false)} manageDrawerVisible={drawerVisible} />
      <FloatButton
        type="primary"
        icon={<PlusOutlined />}
        tooltip="Manage Charts"
        style={{ right: '5em', bottom: '1.5em', transform: 'scale(125%)' }}
        onClick={() => setDrawerVisible(true)}
      />
    </>
  );
};

export default PublicOverview;
