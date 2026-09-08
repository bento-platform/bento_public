import ExploreChartDashboard from './ExploreChartDashboard';
import Catalogue from '@/components/Provenance/Catalogue/Catalogue';

import { useSelectedProject, useSelectedScope } from '@/features/metadata/hooks';
import { useIsInCatalogueMode } from '@/hooks/navigation';

const PublicExplore = () => {
  const selectedProject = useSelectedProject();
  const { scopeSet } = useSelectedScope();

  const catalogueMode = useIsInCatalogueMode();
  const showCatalogue = scopeSet && !selectedProject && catalogueMode;

  // TODO: in the future, maybe a chart explore view should still be viewable for a whole node?
  //  In which case this can be reverted.
  return showCatalogue ? <Catalogue /> : <ExploreChartDashboard />;
};

export default PublicExplore;
