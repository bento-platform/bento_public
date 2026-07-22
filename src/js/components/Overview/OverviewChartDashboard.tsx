import { useCallback, useState } from 'react';
import { Card, Flex, FloatButton, Typography } from 'antd';
import { AppstoreAddOutlined } from '@ant-design/icons';

import clsx from 'clsx';
import { convertSequenceAndDisplayData, generateLSChartDataKey, saveValue } from '@/utils/localStorage';

import type { Sections } from '@/types/data';
import type { DiscoveryScope } from '@/features/metadata/metadata.store';

import { WAITING_STATES } from '@/constants/requests';

const { Paragraph } = Typography;

import AboutBox from './AboutBox';
import OverviewSection from './OverviewSection';
import OverviewDatasets from './OverviewDatasets';
import ManageChartsDrawer from './Drawer/ManageChartsDrawer';
import CountsAndResults from './CountsAndResults';
import LastIngestionInfo from './LastIngestion';
import DatasetProvenance from '@/components/Provenance/DatasetProvenance';

import { useTranslationFn } from '@/hooks';
import { useSearchRouterAndHandler } from '@/hooks/useSearchRouterAndHandler';
import { useSelectedDataset, useSelectedProject, useSelectedScope, useScopeHasData } from '@/features/metadata/hooks';
import { useSearchQuery, useSearchableFields } from '@/features/search/hooks';
import { useIsInCatalogueMode } from '@/hooks/navigation';

const saveScopeOverviewToLS = (scope: DiscoveryScope, sections: Sections) => {
  saveValue(generateLSChartDataKey(scope), convertSequenceAndDisplayData(sections));
};

const OverviewChartDashboard = () => {
  const t = useTranslationFn();

  const [drawerVisible, setDrawerVisible] = useState(false);

  const { scope } = useSelectedScope();
  const selectedProject = useSelectedProject();
  const selectedDataset = useSelectedDataset();
  const catalogueMode = useIsInCatalogueMode();

  // This is essentially a large effect hook with a few dependencies, which processes (and rewrites if needed) the query
  // URL and dispatches discovery actions for fetching overview/query response data.
  useSearchRouterAndHandler();

  const { discoveryStatus, sections, resultCountsByDataset } = useSearchQuery();

  // Lazy-loading hooks means this is loaded only if OverviewChartDashboard is rendered:
  const searchableFields = useSearchableFields();

  const scopeHasData = useScopeHasData();

  // If we have no entities with data confirmed, don't bother showing charts (or last ingested details)
  const displayedSections = scopeHasData
    ? sections.filter(({ charts }) => charts.findIndex(({ isDisplayed }) => isDisplayed) !== -1)
    : [];

  const onManageChartsOpen = useCallback(() => setDrawerVisible(true), []);
  const onManageChartsClose = useCallback(() => {
    setDrawerVisible(false);
    // When we close the drawer, save any changes to localStorage. This helps ensure width gets saved:
    saveScopeOverviewToLS(scope, sections);
  }, [scope, sections]);

  // ---

  const [provenanceCollapsed, setProvenanceCollapsed] = useState(true);

  const loadingNewData = WAITING_STATES.includes(discoveryStatus);

  return (
    <>
      <Flex vertical={true} gap={24} className={clsx('container', { 'margin-auto': !scopeHasData })}>
        {selectedDataset ? (
          <DatasetProvenance
            dataset={selectedDataset}
            collapsed={scopeHasData ? provenanceCollapsed : false}
            // If we don't have any data, render the full provenance by default without collapse-ability
            onToggleCollapse={scopeHasData ? () => setProvenanceCollapsed(!provenanceCollapsed) : undefined}
          />
        ) : selectedProject ? (
          selectedProject.description ? (
            <Card className="container shadow rounded-xl">
              <Paragraph className="mb-0">{t(selectedProject.description)}</Paragraph>
            </Card>
          ) : null
        ) : (
          <AboutBox />
        )}

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

        {displayedSections.map(({ sectionTitle, charts }, i) => (
          <div key={i} className={clsx('overview', loadingNewData && 'loading')}>
            <OverviewSection title={sectionTitle} chartData={charts} searchableFields={searchableFields} />
          </div>
        ))}

        {scopeHasData && !catalogueMode && <LastIngestionInfo />}
      </Flex>

      <ManageChartsDrawer onManageDrawerClose={onManageChartsClose} manageDrawerVisible={drawerVisible} />

      <FloatButton.Group className="float-btn-pos">
        <FloatButton.BackTop target={() => document.getElementById('content-layout')!} />
        {scopeHasData && (
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
