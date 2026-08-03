import { useCatalogueState } from '@/features/catalogue/hooks';
import { COLOR_CHART_FALLBACK } from './constants';
import { useCatalogueUrlActions } from '@/features/catalogue/useCatalogueUrlSync';

const ProgramPill = ({ program }: { program: string }) => {
  const { projectColors } = useCatalogueState();
  const { setFacetValue } = useCatalogueUrlActions();

  if (!program) return null;

  return (
    <div className="mt-2 self-start max-w-full">
      <button
        type="button"
        className="project-pill"
        title={program}
        onClick={(e) => {
          e.stopPropagation();
          setFacetValue('program', program);
        }}
      >
        <span className="project-pill__dot" style={{ background: projectColors[program] ?? COLOR_CHART_FALLBACK }} />
        <span className="project-pill__label">{program}</span>
      </button>
    </div>
  );
};

export default ProgramPill;
