import React from 'react';
import { Empty } from 'antd';
import { useTranslation } from 'react-i18next';

const CustomEmpty = ({ text }) => {
  const { t } = useTranslation();

  return <Empty description={t(text)} />;
};

export default CustomEmpty;
