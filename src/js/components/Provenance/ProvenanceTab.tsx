import { useMemo } from 'react';
import { Flex } from 'antd';

import { useMetadata } from '@/features/metadata/hooks';
import type { Dataset } from '@/types/metadata';
import { RequestStatus } from '@/types/requests';

import DatasetProvenance from './DatasetProvenance';

const ProvenanceTab = () => {
  const {
    projects,
    projectsStatus,
    selectedScope: { scope },
  } = useMetadata();

  const datasets = useMemo<Dataset[]>(() => {
    let filteredProjects = projects;
    if (scope.project) filteredProjects = filteredProjects.filter((p) => scope.project === p.identifier);
    let filteredDatasets = filteredProjects.flatMap((p) => p.datasets);
    if (scope.dataset) filteredDatasets = filteredDatasets.filter((d) => scope.dataset === d.identifier);
    return filteredDatasets;
  }, [projects, scope]);

  return (
    <Flex vertical={true} gap={32} justify="center">
      {datasets.map((dataset, i) => (
        <DatasetProvenance key={i} dataset={dataset} loading={projectsStatus === RequestStatus.Pending} />
      ))}
    </Flex>
  );
};

export default ProvenanceTab;
