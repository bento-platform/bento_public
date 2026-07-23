import { Card, Typography } from 'antd';

import { useTranslationFn } from '@/hooks';
import { useSelectedDataset, useSelectedProject } from '@/features/metadata/hooks';

import DatasetDescription from '@/components/Provenance/DatasetProvenance/DatasetDescription';
import AboutContent from '@/components/AboutContent';

const OverviewDescription = () => {
  const t = useTranslationFn();

  const selectedProject = useSelectedProject();
  const selectedDataset = useSelectedDataset();

  if (
    (selectedDataset && !selectedDataset.description && !selectedDataset.long_description) ||
    (selectedProject && !selectedDataset && !selectedProject.description)
  ) {
    return null;
  }

  return (
    <Card className="overview-description shadow rounded-xl distinguished">
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
