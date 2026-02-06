import { Space } from 'antd';
import type { Project, Dataset as DatasetType } from '@/types/metadata';
import { useLanguage, useTranslationFn } from '@/hooks';
import { useNavigateToScope } from '@/hooks/navigation';
import { useSmallScreen } from '@/hooks/useResponsiveContext';
import Dataset from '@/components/Provenance/Dataset';

const MAX_KEYWORD_CHARACTERS = 50;

interface DatasetWithProjectId extends DatasetType {
  projectId: string;
  projectName: string;
}

const DatasetGrid = ({ projects }: { projects: Project[] }) => {
  const language = useLanguage();
  const navigateToScope = useNavigateToScope();

  const isSmallScreen = useSmallScreen();
  const t = useTranslationFn();

  const datasets = projects.reduce<DatasetWithProjectId[]>((acc, project) => {
    const datasetsWithProjectId = project.datasets.map((dataset) => ({
      ...dataset,
      projectId: project.identifier,
      projectName: project.title,
    }));

    acc.push(...datasetsWithProjectId);
    return acc;
  }, []);

  return (
    <Space>
      {datasets.map(({ projectId, projectName, ...d }, idx) => (
        <Dataset parentProjectID={projectId} projectName={projectName} key={`${d.identifier}-${idx}`} dataset={d} format="card-v2" />
      ))}
    </Space>
  );
};

export default DatasetGrid;
