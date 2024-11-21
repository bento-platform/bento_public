import { Card, Typography } from 'antd';
import type { Dataset } from '@/types/metadata';
import { useTranslationFn } from '@/hooks';

const CatalogueCarouselDataset = ({ dataset }: { dataset: Dataset }) => {
  const t = useTranslationFn();
  return (
    <Card style={{ height: '180px' }}>
      <Typography.Title level={5} style={{ marginTop: 0 }}>
        {t(dataset.title)}
      </Typography.Title>
      <Typography.Paragraph ellipsis={{ rows: 4, tooltip: { title: dataset.description } }}>
        {t(dataset.description)}
      </Typography.Paragraph>
    </Card>
  );
};

export default CatalogueCarouselDataset;
