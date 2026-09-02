import { lazy, Suspense } from 'react';

import Loader from '@/components/Loader';
import OverviewChartDashboard from './OverviewChartDashboard';

import { useSelectedProject, useSelectedScope } from '@/features/metadata/hooks';
import { useIsInCatalogueMode } from '@/hooks/navigation';

// Lazy-loaded: the catalogue view (dataset cards, provenance, spatial coverage maps) is only ever rendered for
// node-level catalogue instances, so project/dataset-scoped deployments should never have to download it.
const Catalogue = lazy(() => import('@/components/Provenance/Catalogue/Catalogue'));

const PublicOverview = () => {
  const selectedProject = useSelectedProject();
  const { scopeSet } = useSelectedScope();

  const catalogueMode = useIsInCatalogueMode();
  const showCatalogue = scopeSet && !selectedProject && catalogueMode;

  // TODO: in the future, maybe a chart overview should still be viewable for a whole node?
  //  In which case this can be reverted.
  return showCatalogue ? (
    <Suspense fallback={<Loader fullHeight={true} />}>
      <Catalogue />
    </Suspense>
  ) : (
    <OverviewChartDashboard />
  );
};

export default PublicOverview;
