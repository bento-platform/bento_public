import React from 'react';
import { Card, Space } from 'antd';
import demoData from '../../../public/data/dataset_catalogue_demo.json';

const { projects } = demoData;

const Catalogue = () => {
  return (
    <Space direction="vertical">
      {projects.map((project) => (
        <Card title={project.name} key={project.name}>
          {project.datasets.map((dataset) => (
            <Card title={dataset.name} key={dataset.name}>
              {dataset.description}
            </Card>
          ))}
        </Card>
      ))}
    </Space>
  );
};

export default Catalogue;
