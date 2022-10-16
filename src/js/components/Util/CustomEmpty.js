import React from 'react';
import { Empty } from 'antd';
import { useTranslation } from 'react-i18next';

const CustomEmpty = () => {
  const { t } = useTranslation();

  return <Empty description={t('No Results')} />;
};

export default CustomEmpty;
