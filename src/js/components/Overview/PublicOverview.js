import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Button, Divider, Row, Col } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

import { convertSequenceAndDisplayData, saveValue } from '../../utils/localStorage';
import { LOCALSTORAGE_CHARTS_KEY } from '../../constants/overviewConstants';

import OverviewSection from './OverviewSection';
import ManageChartsDrawer from './Drawer/ManageChartsDrawer';

const PublicOverview = () => {
  const { sections } = useSelector((state) => state.data);

  saveValue(LOCALSTORAGE_CHARTS_KEY, convertSequenceAndDisplayData(sections));

  const [drawerVisible, setDrawerVisible] = useState(false);

  return (
    <>
      <div className="container">
        <Row justify="center">
          <Col>
            {sections.map(({ sectionTitle, charts }, i) => (
              <div key={i} className="overview">
                <OverviewSection index={i} title={sectionTitle} chartData={charts} />
                <Divider />
              </div>
            ))}
          </Col>
        </Row>
      </div>

      {/* Drawer & Button */}
      <ManageChartsDrawer onManageDrawerClose={() => setDrawerVisible(false)} manageDrawerVisible={drawerVisible} />
      <Button
        type="primary"
        shape="circle"
        icon={<PlusOutlined />}
        size="large"
        className="floating-button"
        onClick={() => setDrawerVisible(true)}
      />
    </>
  );
};

export default PublicOverview;
