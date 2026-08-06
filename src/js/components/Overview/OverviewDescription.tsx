import { Card, Flex, Typography } from 'antd';

import { useTranslationFn } from '@/hooks';
import { useSelectedDataset, useSelectedProject } from '@/features/metadata/hooks';

import { PCGL_MODE } from '@/config';
import { useScopeQueryData } from '@/hooks/censorship';
import DatasetDescription from '@/components/Provenance/DatasetProvenance/DatasetDescription';
import AboutContent from '@/components/AboutContent';
import { LinkTile } from '@/components/Provenance/DatasetProvenance/bits';

const OverviewDescription = () => {
  const t = useTranslationFn();

  const selectedProject = useSelectedProject();
  const selectedDataset = useSelectedDataset();

  const { hasPermission: queryDataPerm, fetchingPermission } = useScopeQueryData();

  if (
    (selectedDataset && !selectedDataset.description && !selectedDataset.long_description) ||
    (selectedProject && !selectedDataset && !selectedProject.description)
  ) {
    return null;
  }

  return (
    <Card className="overview-description shadow rounded-xl distinguished">
      {selectedDataset ? (
        <Flex vertical gap={16}>
          <DatasetDescription dataset={selectedDataset} />
          {PCGL_MODE && !fetchingPermission && !queryDataPerm && (
            <div className="inline-flex">
              <LinkTile link={{ url: '#', label: t('dataset.apply_for_access') }} />
            </div>
          )}
        </Flex>
      ) : selectedProject ? (
        <Typography.Paragraph className="mb-0">{t(selectedProject!.description)}</Typography.Paragraph>
      ) : (
        <AboutContent />
      )}
    </Card>
  );
};

export default OverviewDescription;
