import { FORCE_CATALOGUE } from '@/config';

import AboutBox from './AboutBox';
import OverviewChartDashboard from './OverviewChartDashboard';
import Catalogue from '@/components/Provenance/Catalogue/Catalogue';

import { useMetadata, useSelectedProject, useSelectedScope } from '@/features/metadata/hooks';

const PublicOverview = () => {
  const selectedProject = useSelectedProject();
  const { scopeSet } = useSelectedScope();
  const { projects } = useMetadata();

  const showCatalogue = scopeSet && !selectedProject && (projects.length > 1 || FORCE_CATALOGUE);

  // TODO: in the future, maybe a chart overview should still be viewable for a whole node?
  //  In which case this can be reverted.
  return showCatalogue ? (
    <>
      <AboutBox style={{ maxWidth: 1325, margin: 'auto' }} bottomDivider={true} />
      <Catalogue />
    </>
  ) : (
    <OverviewChartDashboard />
  );
};

export default PublicOverview;
