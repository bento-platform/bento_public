import React, { useState } from 'react';
import { Row, Container } from 'react-bootstrap';
import { Button, Divider, Typography } from 'antd';

import { useSelector } from 'react-redux';
import OverviewSection from './OverviewSection';
import { convertSequenceAndDisplayData, saveValue } from '../../utils/localStorage';
import { LOCALSTORAGE_CHARTS_KEY } from '../../constants/overviewConstants';
import ManageChartsDrawer from './Drawer/ManageChartsDrawer';
import { PlusOutlined } from '@ant-design/icons';

const PublicOverview = () => {
  const { sections, individuals } = useSelector((state) => state.data);

  saveValue(LOCALSTORAGE_CHARTS_KEY, convertSequenceAndDisplayData(sections));

  const [visible, setVisible] = useState(false);

  const showDrawer = () => {
    setVisible(true);
  };

  const onClose = () => {
    setVisible(false);
  };

  return (
    <Container>
      <Row>
        <div
          style={{
            pointerEvents: 'none',
            textAlign: 'right',
            transform: 'translateY(-80px)',
            color: '#AAA',
          }}
        >
          <Typography.Title level={5}>Individuals: {individuals}</Typography.Title>
        </div>
        {sections.map(({ sectionTitle, charts }, i) => (
          <OverviewSection key={i} index={i} title={sectionTitle} chartData={charts} />
        ))}
      </Row>
      <ManageChartsDrawer onManageDrawerClose={onClose} manageDrawerVisible={visible} />
      <Button
        type="primary"
        shape="circle"
        icon={<PlusOutlined />}
        size="large"
        className="floating-button"
        onClick={showDrawer}
      />
      <Divider />
    </Container>
  );
};

export default PublicOverview;
