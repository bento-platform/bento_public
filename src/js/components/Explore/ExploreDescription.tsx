import { Card, Flex, Typography } from 'antd';

import { useTranslationFn } from '@/hooks';
import { useSelectedDataset, useSelectedProject } from '@/features/metadata/hooks';

import { PCGL_MODE } from '@/config';
import { useScopeQueryData } from '@/hooks/censorship';
import DatasetDescription from '@/components/Provenance/DatasetProvenance/DatasetDescription';
import AboutContent from '@/components/AboutContent';
import { LinkTile } from '@/components/Provenance/DatasetProvenance/bits';

const ExploreDescription = () => {
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
    <Card className="explore-description shadow rounded-xl distinguished">
      {selectedDataset ? (
        <Flex vertical gap={16}>
          <DatasetDescription dataset={selectedDataset} />
          {PCGL_MODE && !fetchingPermission && !queryDataPerm && (
            <div className="inline-flex">
              {/* TODO: link out to DACO */}
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

export default ExploreDescription;
