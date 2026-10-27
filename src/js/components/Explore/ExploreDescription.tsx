import { Card, Typography } from 'antd';

import { useTranslationFn } from '@/hooks';
import { useSelectedDataset, useSelectedProject } from '@/features/metadata/hooks';

import ExploreDatasetHero from './ExploreDatasetHero';
import AboutContent from '@/components/AboutContent';

const ExploreDescription = () => {
  const t = useTranslationFn();

  const selectedProject = useSelectedProject();
  const selectedDataset = useSelectedDataset();

  if (
    (selectedDataset && !selectedDataset.description && !selectedDataset.long_description) ||
    (selectedProject && !selectedDataset && !selectedProject.description)
  ) {
    return null;
  }

  if (selectedDataset) {
    return <ExploreDatasetHero dataset={selectedDataset} />;
  }

  return (
    <Card className="explore-description shadow rounded-xl distinguished">
      {selectedProject ? (
        <Typography.Paragraph className="mb-0">{t(selectedProject!.description)}</Typography.Paragraph>
      ) : (
        <AboutContent />
      )}
    </Card>
  );
};

export default ExploreDescription;
