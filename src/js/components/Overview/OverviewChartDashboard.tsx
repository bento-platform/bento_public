import { lazy, Suspense, useCallback, useState } from 'react';
import { Flex, FloatButton, Grid } from 'antd';
import { AppstoreAddOutlined } from '@ant-design/icons';

import clsx from 'clsx';
import { convertSequenceAndDisplayData, generateLSChartDataKey, saveValue } from '@/utils/localStorage';

import type { Sections } from '@/types/data';
import type { DiscoveryScope } from '@/features/metadata/metadata.store';

import { WAITING_STATES } from '@/constants/requests';
import { BentoRoute } from '@/types/routes';

import OverviewDescription from './OverviewDescription';
import OverviewSection from './OverviewSection';
import OverviewDatasets from './OverviewDatasets';
import CountsAndResults from './CountsAndResults';
import LastIngestionInfo from './LastIngestion';
import ActiveFilterTags from '@/components/Util/ActiveFilterTags';

import { setManageChartsVisible } from '@/features/ui/ui.store';

import { useAppDispatch, useTranslationFn } from '@/hooks';
import { useSearchRouterAndHandler } from '@/hooks/useSearchRouterAndHandler';
import { useSelectedProject, useSelectedScope, useScopeHasData } from '@/features/metadata/hooks';
import {
  useActiveFilterPills,
  useSearchQuery,
  useSearchableFields,
  useAvailableChartSections,
} from '@/features/search/hooks';
import { useUiSettings, useUiState } from '@/features/ui/hooks';
import { useIsInCatalogueMode, useNavigateToSameScopeUrl } from '@/hooks/navigation';
import { useNotify } from '@/hooks/notifications';

const { useBreakpoint } = Grid;

const OVERVIEW_GAP = 24;

const saveScopeOverviewToLS = (scope: DiscoveryScope, sections: Sections) => {
  saveValue(generateLSChartDataKey(scope), convertSequenceAndDisplayData(sections));
};

// Lazy-loaded: the "manage charts" drawer is opened rarely (via a FloatButton), so it shouldn't be part of the
// bundle every overview-page visitor downloads up front.
const ManageChartsDrawer = lazy(() => import('./Drawer/ManageChartsDrawer'));

const OverviewChartSections = () => {
  const { discoveryStatus } = useSearchQuery();
  const { overviewChartMode } = useUiSettings();
  const loadingNewData = WAITING_STATES.includes(discoveryStatus);

  const availableChartSections = useAvailableChartSections();
  const displayedSections = availableChartSections.filter(
    ({ charts }) => charts.findIndex(({ isDisplayed }) => isDisplayed) !== -1
  );

  // Lazy-loading hooks means this is loaded only if OverviewChartDashboard is rendered:
  const searchableFields = useSearchableFields();

  if (!displayedSections.length) return null;

  return (
    <Flex
      vertical
      className={clsx('overview-charts', overviewChartMode, loadingNewData && 'loading')}
      gap={OVERVIEW_GAP}
    >
      {displayedSections.map((section) => (
        <OverviewSection
          key={section.sectionId}
          section={section}
          searchableFields={searchableFields}
          chartMode={overviewChartMode}
        />
      ))}
    </Flex>
  );
};

const OverviewChartDashboard = () => {
  const t = useTranslationFn();
  const dispatch = useAppDispatch();

  const breakpoints = useBreakpoint();

  const { manageChartsVisible } = useUiState();
  // Latch whether the drawer has ever been opened so its (lazy-loaded) code is only fetched once actually
  // needed, rather than on every overview page load. manageChartsVisible can flip to true from this component's
  // own trigger *or* from the sidebar's "Manage Charts" button (SiteSider.tsx), so this derives from that single
  // shared piece of state (rather than duplicating "opened" tracking per trigger) using React's supported
  // "adjusting state during render" pattern: https://react.dev/learn/you-might-not-need-an-effect
  const [prevManageChartsVisible, setPrevManageChartsVisible] = useState(manageChartsVisible);
  const [hasOpenedManageCharts, setHasOpenedManageCharts] = useState(manageChartsVisible);
  if (manageChartsVisible !== prevManageChartsVisible) {
    setPrevManageChartsVisible(manageChartsVisible);
    if (manageChartsVisible) setHasOpenedManageCharts(true);
  }

  const { scope, scopeSet } = useSelectedScope();
  const selectedProject = useSelectedProject();
  const catalogueMode = useIsInCatalogueMode();
  const navigateToSameScopeUrl = useNavigateToSameScopeUrl();

  const notify = useNotify();
  const [hasNotified, setHasNotified] = useState(false);

  // This is essentially a large effect hook with a few dependencies, which processes (and rewrites if needed) the query
  // URL and dispatches discovery actions for fetching overview/query response data.
  useSearchRouterAndHandler();

  const { sections, resultCountsByDataset } = useSearchQuery();
  const availableChartSections = useAvailableChartSections();

  const { pills, clearAll } = useActiveFilterPills();

  const onManageChartsOpen = useCallback(() => dispatch(setManageChartsVisible(true)), [dispatch]);
  const onManageChartsClose = useCallback(() => {
    dispatch(setManageChartsVisible(false));
    // When we close the drawer, save any changes to localStorage. This helps ensure width gets saved:
    saveScopeOverviewToLS(scope, sections);
  }, [dispatch, scope, sections]);

  const scopeHasData = useScopeHasData();

  // ---

  // If we don't have any data to display, redirect to the provenance page - behaving as basically a 'metadata-only'
  // display. This is primarily for some kind of possible 'metadata-only' mode where we don't ingest any data.
  if (scopeSet && !scopeHasData && scope.dataset) {
    if (!hasNotified) {
      notify.error({
        message: t('navigation.not_available_title', { endpoint: BentoRoute.Overview }),
        description: t('navigation.not_available_description', { target: BentoRoute.About }),
      });
      setHasNotified(true);
    }
    navigateToSameScopeUrl(BentoRoute.About, true);
    return null;
  }

  return (
    <>
      <Flex vertical={true} gap={OVERVIEW_GAP} className={clsx('container', { 'margin-auto': !scopeHasData })}>
        {/*
            Show a general description of the current scope, pulled from the about content (instance-level), the project
            description, or the dataset long description (falling back to the short description.)
        */}
        <OverviewDescription />

        <ActiveFilterTags pills={pills} onClearAll={clearAll} tagClassName="overview-filter-tag" />

        {/*
            If we're in a scope with no data at all, don't bother rendering the
            "NOT ENOUGH DATA" message / "NO DATA" empty component. This way, we get a sort of "catalogue detail" view,
            allowing provenance-only datasets to be rendered nicely.
        */}
        {scopeHasData && <CountsAndResults />}

        {selectedProject && !scope.dataset && selectedProject.datasets.length ? (
          // If we have a project with at least one dataset, show a dataset mini-catalogue in the project overview
          <OverviewDatasets
            datasets={selectedProject.datasets}
            parentProjectID={selectedProject.identifier}
            countsByDataset={resultCountsByDataset}
          />
        ) : null}

        <OverviewChartSections />

        {!catalogueMode && <LastIngestionInfo />}
      </Flex>

      {hasOpenedManageCharts && (
        <Suspense fallback={null}>
          <ManageChartsDrawer onManageDrawerClose={onManageChartsClose} manageDrawerVisible={manageChartsVisible} />
        </Suspense>
      )}

      <FloatButton.Group className="float-btn-pos">
        <FloatButton.BackTop target={() => document.getElementById('content-layout')!} />
        {!breakpoints.lg && availableChartSections.length > 0 && (
          /* >= breakpoints.lg, we can use the fixed search sidebar to open the manage charts drawer.
              < breakpoints.lg, (mobile-ish), we use a Material-esque floating button. */
          <FloatButton
            type="primary"
            icon={<AppstoreAddOutlined rotate={270} />}
            tooltip={t('Manage Charts')}
            onClick={onManageChartsOpen}
          />
        )}
      </FloatButton.Group>
    </>
  );
};

export default OverviewChartDashboard;
