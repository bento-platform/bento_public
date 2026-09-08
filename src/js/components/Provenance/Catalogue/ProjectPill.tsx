import type { Project } from '@/types/metadata';
import { BentoRoute } from '@/types/routes';
import { COLOR_CHART_FALLBACK } from './constants';
import { useNavigateToScope } from '@/hooks/navigation';
import { useCatalogueState } from '@/features/catalogue/hooks';
import ClickablePill from '@Util/ClickablePill';

const ProjectPill = ({ project }: { project: Project }) => {
  const navigateToScope = useNavigateToScope();
  const { projectColors } = useCatalogueState();
  const { title, identifier } = project;

  if (!title) return null;

  return (
    <ClickablePill
      pillColor={projectColors[title] ?? COLOR_CHART_FALLBACK}
      label={title}
      onClick={(e) => {
        e.stopPropagation();
        navigateToScope({ project: identifier }, BentoRoute.Explore);
      }}
    />
  );
};

export default ProjectPill;
