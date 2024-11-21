import React from 'react';
import { Card, Typography } from 'antd';
import type { Dataset } from './Catalogue';

const CatalogueCarouselDataset = ({ dataset }: { dataset: Dataset }) => {
  return (
    <Card style={{ height: '180px' }}>
      <Typography.Title level={5} style={{ marginTop: 0 }}>
        {dataset.name}
      </Typography.Title>
      <Typography.Text>{dataset.description}</Typography.Text>
    </Card>
  );
};

export default CatalogueCarouselDataset;
