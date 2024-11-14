import React from 'react';
import { Card, Space } from 'antd';
import demoData from '../../../public/data/dataset_catalogue_demo.json';
import CatalogueCard from '@/components/Provenance/CatalogueCard';

type Dataset = {
  name: string;
  description: string;
  samples: string;
  dataType: string;
};

export type Project = {
  name: string;
  description: string;
  keywords: string[];
  location: string;
  privacy: 'Open' | 'Controlled' | 'Registered Access';
  license: 'CC BY 4.0' | 'CC0 1.0 Universal' | 'CC BY-NC-SA 4.0';
  lastUpdated: string; // e.g., "June 2024"
  version: string;
  datasets: Dataset[];
};

type ProjectsData = {
  projects: Project[];
};

const { projects } = demoData as ProjectsData;

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
