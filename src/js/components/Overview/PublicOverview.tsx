import AboutBox from './AboutBox';
import OverviewChartDashboard from './OverviewChartDashboard';
import Catalogue from '@/components/Provenance/Catalogue/Catalogue';

import { useSelectedProject, useSelectedScope } from '@/features/metadata/hooks';
import { useIsInCatalogueMode } from '@/hooks/navigation';

const PublicOverview = () => {
  const selectedProject = useSelectedProject();
  const { scopeSet } = useSelectedScope();

  const catalogueMode = useIsInCatalogueMode();
  const showCatalogue = scopeSet && !selectedProject && catalogueMode;

  // TODO: in the future, maybe a chart overview should still be viewable for a whole node?
  //  In which case this can be reverted.
  return showCatalogue ? (
    <>
      <AboutBox style={{ margin: 'auto' }} bottomDivider={true} />
      <Catalogue />
    </>
  ) : (
    <OverviewChartDashboard />
  );
};

export default PublicOverview;
