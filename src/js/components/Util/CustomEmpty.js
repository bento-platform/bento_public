import React from 'react';
import { Empty } from 'antd';
import { useTranslation } from 'react-i18next';
import { DEFAULT_TRANSLATION } from '../../constants/configConstants';

const CustomEmpty = ({ text }) => {
  const { t } = useTranslation(DEFAULT_TRANSLATION);

  return <Empty description={t(text)} />;
};

export default CustomEmpty;
