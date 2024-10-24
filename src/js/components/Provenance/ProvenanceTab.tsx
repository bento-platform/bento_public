import { useMemo } from 'react';
import { Row } from 'antd';

import { useMetadata } from '@/features/metadata/hooks';
import type { Dataset } from '@/types/metadata';

import DatasetProvenance from './DatasetProvenance';

const ProvenanceTab = () => {
  const {
    projects,
    isFetching: loading,
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
    <Row justify="center">
      {datasets.map((dataset, i) => (
        <DatasetProvenance key={i} dataset={dataset} loading={loading} />
      ))}
    </Row>
  );
};

export default ProvenanceTab;
