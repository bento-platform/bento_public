import React from 'react';
import { Col } from 'react-bootstrap';
import { Card } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

const NewChartCard = ({ onClick }) => {
  return (
    <Col
      sm={12}
      md={6}
      lg={4}
      xl={4}
      style={{ height: '100%' }}
      onClick={onClick}
    >
      <Card
        style={{
          height: '415px',
        }}
        hoverable
      >
        <PlusOutlined
          style={{
            fontSize: '50px',
            fontWeight: '1em',
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            color: '#AAA',
            opacity: '50%',
          }}
        />
      </Card>
    </Col>
  );
};

export default NewChartCard;
