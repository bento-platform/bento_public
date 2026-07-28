import type { Project } from '@/types/metadata';
import { BentoRoute } from '@/types/routes';
import { useNavigateToScope } from '@/hooks/navigation';
import { useCatalogueState } from '@/features/catalogue/hooks';
import { COLOR_CHART_FALLBACK } from './constants';

const ProjectPill = ({ project }: { project: Project }) => {
  const navigateToScope = useNavigateToScope();
  const { projectColors } = useCatalogueState();
  const { title, identifier } = project;

  if (!title) return null;

  return (
    <div className="mt-2 self-start">
      <button
        type="button"
        className="project-pill"
        onClick={(e) => {
          e.stopPropagation();
          navigateToScope({ project: identifier }, BentoRoute.Overview);
        }}
      >
        <span className="project-pill__dot" style={{ background: projectColors[title] ?? COLOR_CHART_FALLBACK }} />
        {title}
      </button>
    </div>
  );
};

export default ProjectPill;
