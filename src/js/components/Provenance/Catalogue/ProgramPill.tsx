import { COLOR_CHART_FALLBACK } from './constants';
import { useCatalogueState } from '@/features/catalogue/hooks';
import { useCatalogueUrlActions } from '@/features/catalogue/useCatalogueUrlSync';
import ClickablePill from '@Util/ClickablePill';

const ProgramPill = ({ program }: { program: string }) => {
  const { projectColors } = useCatalogueState();
  const { setFacetValue } = useCatalogueUrlActions();

  if (!program) return null;

  return (
    <ClickablePill
      pillColor={projectColors[program] ?? COLOR_CHART_FALLBACK}
      label={program}
      onClick={(e) => {
        e.stopPropagation();
        setFacetValue('program', program);
      }}
    />
  );
};

export default ProgramPill;
