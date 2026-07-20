import { Card, Typography } from 'antd';

import { useTranslationFn } from '@/hooks';
import { useSelectedDataset, useSelectedProject } from '@/features/metadata/hooks';

import DatasetDescription from '@/components/Provenance/Modal/DatasetDescription';
import AboutContent from '@/components/AboutContent';

const OverviewDescription = () => {
  const t = useTranslationFn();

  const selectedProject = useSelectedProject();
  const selectedDataset = useSelectedDataset();

  return (
    <Card className="overview-description shadow rounded-xl">
      {selectedDataset ? (
        <DatasetDescription dataset={selectedDataset} />
      ) : selectedProject ? (
        <Typography.Paragraph className="mb-0">{t(selectedProject!.description)}</Typography.Paragraph>
      ) : (
        <AboutContent />
      )}
    </Card>
  );
};

export default OverviewDescription;
