import React from 'react';
import { Tooltip } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';

const OptionDescription = ({ description }) => {
  return (
    <Tooltip placement="top" title={description}>
      <QuestionCircleOutlined />
    </Tooltip>
  );
};

export default OptionDescription;
