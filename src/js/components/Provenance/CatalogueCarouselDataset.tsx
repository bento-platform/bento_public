import React from 'react';
import { Card, Typography } from 'antd';
import type { Dataset } from './Catalogue';

const CatalogueCarouselDataset = ({ dataset }: { dataset: Dataset }) => {
  return (
    <Card style={{ height: '180px' }}>
      <Typography.Title level={5} style={{ marginTop: 0 }}>
        {dataset.name}
      </Typography.Title>
      <Typography.Paragraph ellipsis={{ rows: 4 }}>{dataset.description}</Typography.Paragraph>
    </Card>
  );
};

export default CatalogueCarouselDataset;
