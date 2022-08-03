import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Button, Divider, Typography, Row, Col } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

import { convertSequenceAndDisplayData, saveValue } from '../../utils/localStorage';
import { LOCALSTORAGE_CHARTS_KEY } from '../../constants/overviewConstants';

import OverviewSection from './OverviewSection';
import ManageChartsDrawer from './Drawer/ManageChartsDrawer';

const PublicOverview = () => {
  const { sections, individuals } = useSelector((state) => state.data);

  saveValue(LOCALSTORAGE_CHARTS_KEY, convertSequenceAndDisplayData(sections));

  const [drawerVisible, setDrawerVisible] = useState(false);

  return (
    <div className="container">
      <div style={{ pointerEvents: 'none', color: '#AAA', position: 'absolute', top: '-5.5em', right: '3em' }}>
        <Typography.Title level={5}>Individuals: {individuals}</Typography.Title>
      </div>
      <Row justify="center">
        <Col>
          {sections.map(({ sectionTitle, charts }, i) => (
            <div key={i} className="overview">
              <OverviewSection index={i} title={sectionTitle} chartData={charts} />
              <Divider />
            </div>
          ))}
          <ManageChartsDrawer onManageDrawerClose={() => setDrawerVisible(false)} manageDrawerVisible={drawerVisible} />
          <Button
            type="primary"
            shape="circle"
            icon={<PlusOutlined />}
            size="large"
            className="floating-button"
            onClick={() => setDrawerVisible(true)}
          />
        </Col>
      </Row>
    </div>
  );
};

export default PublicOverview;
