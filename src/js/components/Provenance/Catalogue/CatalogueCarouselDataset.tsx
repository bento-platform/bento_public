import { Card, Typography } from 'antd';
import type { Dataset } from '@/types/metadata';

const CatalogueCarouselDataset = ({ dataset }: { dataset: Dataset }) => {
  return (
    <Card style={{ height: '180px' }}>
      <Typography.Title level={5} style={{ marginTop: 0 }}>
        {dataset.title}
      </Typography.Title>
      <Typography.Paragraph ellipsis={{ rows: 4, tooltip: { title: dataset.description } }}>
        {dataset.description}
      </Typography.Paragraph>
    </Card>
  );
};

export default CatalogueCarouselDataset;
