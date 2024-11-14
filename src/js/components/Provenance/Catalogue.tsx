import React from 'react';
import { Space } from 'antd';
import demoData from '../../../public/data/dataset_catalogue_demo.json';

const Catalogue = () => {
  return <Space>{JSON.stringify(demoData)}</Space>;
};

export default Catalogue;
