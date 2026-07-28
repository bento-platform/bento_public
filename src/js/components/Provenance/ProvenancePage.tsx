import { Card, Typography } from 'antd';

import { useTranslationFn } from '@/hooks';
import { useSelectedDataset, useSelectedProject } from '@/features/metadata/hooks';

import AboutBox from '@/components/Overview/AboutBox';
import DatasetProvenanceCard from './DatasetProvenance/DatasetProvenanceCard';

const ProvenancePage = () => {
  const t = useTranslationFn();

  const selectedProject = useSelectedProject();
  const selectedDataset = useSelectedDataset();

  if (selectedDataset) {
    return <DatasetProvenanceCard dataset={selectedDataset} />;
  }

  if (selectedProject) {
    return (
      <Card className="container margin-auto shadow rounded-xl">
        <Typography.Paragraph className="mb-0">{t(selectedProject.description)}</Typography.Paragraph>
      </Card>
    );
  }

  return <AboutBox />;
};

export default ProvenancePage;
