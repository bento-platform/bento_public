import OverviewChartDashboard from './OverviewChartDashboard';
import Catalogue from '@/components/Provenance/Catalogue/Catalogue';

import { useMetadata, useSelectedProject, useSelectedScope } from '@/features/metadata/hooks';
import { useIsInCatalogueMode } from '@/hooks/navigation';
import { RequestStatus } from '@/types/requests';

const PublicOverview = () => {
  const selectedProject = useSelectedProject();
  const { scopeSet } = useSelectedScope();
  const { projectsStatus } = useMetadata();

  const catalogueMode = useIsInCatalogueMode();
  const showCatalogue = scopeSet && !selectedProject && catalogueMode && projectsStatus !== RequestStatus.Rejected;

  // TODO: in the future, maybe a chart overview should still be viewable for a whole node?
  //  In which case this can be reverted.
  return showCatalogue ? <Catalogue /> : <OverviewChartDashboard />;
};

export default PublicOverview;
