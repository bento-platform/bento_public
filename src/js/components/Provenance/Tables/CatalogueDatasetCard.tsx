import React from 'react';
import { Card, Typography } from 'antd';
import type { Dataset } from '../Catalogue';

const CatalogueDatasetCard = ({ dataset }: { dataset: Dataset }) => {
  return (
    <Card style={{ width: '250px', height: '175px', borderRadius: '11px' }}>
      <Typography.Title level={5} style={{ marginTop: 0 }}>
        {dataset.name}
      </Typography.Title>
      <Typography.Text>{dataset.description}</Typography.Text>
    </Card>
  );
};

export default CatalogueDatasetCard;
