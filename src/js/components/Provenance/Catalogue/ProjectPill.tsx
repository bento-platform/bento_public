import type { ProjectDetail } from '@/types/dataset';
import { BentoRoute } from '@/types/routes';
import { COLOR_CHART_FALLBACK } from './constants';
import { useNavigateToScope } from '@/hooks/navigation';
import { useCatalogueState } from '@/features/catalogue/hooks';
import ClickablePill from '@Util/ClickablePill';

const ProjectPill = ({ project }: { project: ProjectDetail }) => {
  const navigateToScope = useNavigateToScope();
  const { projectColors } = useCatalogueState();
  const { title, identifier } = project;

  if (!title) return null;

  return (
    <ClickablePill
      pillColor={projectColors[identifier] ?? COLOR_CHART_FALLBACK}
      label={title}
      onClick={(e) => {
        e.stopPropagation();
        navigateToScope({ project: identifier }, BentoRoute.Explore);
      }}
    />
  );
};

export default ProjectPill;
