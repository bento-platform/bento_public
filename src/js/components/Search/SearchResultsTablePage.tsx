import { type ReactNode, useCallback, useEffect, useMemo, useState } from 'react';

import { Button, Checkbox, Col, Flex, Modal, Space, type TablePaginationConfig, Tooltip, Typography } from 'antd';
import { ExportOutlined, LeftOutlined, TableOutlined } from '@ant-design/icons';

import { T_PLURAL_COUNT, T_SINGULAR_COUNT } from '@/constants/i18n';
import { MIN_PAGE_SIZE, PAGE_SIZE_OPTIONS } from '@/constants/pagination';
import { WAITING_STATES } from '@/constants/requests';

import { useAppDispatch, useTranslationFn } from '@/hooks';
import { useSmallScreen } from '@/hooks/useResponsiveContext';
import { useScopeDownloadData } from '@/hooks/censorship';
import { useDownloadAllMatchesCSV } from '@/hooks/useDownloadAllMatchesCSV';
import { useSearchQuery } from '@/features/search/hooks';

import type { BentoKatsuEntity } from '@/types/entities';
import type { Project, Dataset } from '@/types/metadata';
import { useMetadata, useSelectedScope } from '@/features/metadata/hooks';
import { fetchDiscoveryMatches } from '@/features/search/fetchDiscoveryMatches.thunk';
import {
  bentoKatsuEntityToResultsDataEntity,
  type QueryResultMatchData,
  setMatchesPage,
  setMatchesPageSize,
} from '@/features/search/query.store';
import type {
  DiscoveryMatchBiosample,
  DiscoveryMatchExperiment,
  DiscoveryMatchExperimentResult,
  DiscoveryMatchPhenopacket,
  ViewableDiscoveryMatchObject,
} from '@/features/search/types';

import { setEquals } from '@/utils/sets';

import DatasetProvenanceModal from '@/components/Provenance/DatasetProvenanceModal';
import ProjectTitle from '@Util/ProjectTitle';
import DatasetTitle from '@Util/DatasetTitle';
import CustomTable, { type CustomTableColumn, type CustomTableColumns } from '@Util/CustomTable';
import IndividualRowDetail from './IndividualRowDetail';
import BiosampleRowDetail from './BiosampleRowDetail';
import ExperimentRowDetail from './ExperimentRowDetail';
import ExperimentResultRowDetail from './ExperimentResultRowDetail';
import PhenopacketLink from '@/components/ClinPhen/PhenopacketLink';
import { ExperimentResultFileTypeCounts } from '@/components/ClinPhen/ExperimentDisplay/ExperimentView';
import {
  ExperimentResultActions,
  experimentResultViewable,
  type ExperimentResultActionsProps,
} from '@/components/ClinPhen/ExperimentDisplay/ExperimentResultView';

type SearchColRenderContext = {
  onProjectClick: (id: string) => void;
  onDatasetClick: (id: string) => void;
};

type ResultsTableColumn<T extends ViewableDiscoveryMatchObject> = Omit<
  CustomTableColumn<T>,
  'key' | 'title' | 'dataIndex' | 'render'
> & {
  title: string; // column title translation key
  dataIndex: keyof T;
  render?: (ctx: SearchColRenderContext) => (value: unknown, obj: T) => ReactNode;
};

type ResultsTableFixedColumn<T extends ViewableDiscoveryMatchObject> = CustomTableColumn<T> & { showLast?: boolean };

const fixedColumnToTableColumn = <T extends ViewableDiscoveryMatchObject>(
  c: ResultsTableFixedColumn<T>,
  t: (key: string) => string
): CustomTableColumn<T> => {
  const cNew = { ...c, title: t(c.title as string) };
  if ('showLast' in cNew) delete cNew['showLast'];
  return cNew as CustomTableColumn<T>;
};

type ResultsTableSpec<T extends ViewableDiscoveryMatchObject> = {
  fixedColumns?: ResultsTableFixedColumn<T>[];
  availableColumns: Record<string, ResultsTableColumn<T>>;
  defaultColumns: string[];
  expandedRowRender?: (record: T) => ReactNode;
};

const commonSearchTableColumns = <T extends ViewableDiscoveryMatchObject>() =>
  ({
    project: {
      title: 'entities.project_one',
      dataIndex: 'project',
      render: (ctx: SearchColRenderContext) => (id: string) => (
        <ProjectTitle projectID={id} onClick={() => ctx.onProjectClick(id)} />
      ),
    } as ResultsTableColumn<ViewableDiscoveryMatchObject>,
    dataset: {
      title: 'entities.dataset_one',
      dataIndex: 'dataset',
      render: (ctx: SearchColRenderContext) => (id: string) => (
        <DatasetTitle datasetID={id} onClick={() => ctx.onDatasetClick(id)} />
      ),
    } as ResultsTableColumn<ViewableDiscoveryMatchObject>,
  }) as Record<string, ResultsTableColumn<T>>;

const PHENOPACKET_SEARCH_TABLE_COLUMNS = {
  biosamples: {
    title: 'entities.biosample_other',
    dataIndex: 'biosamples',
    render: (_ctx: SearchColRenderContext) => (b: DiscoveryMatchBiosample[], p: DiscoveryMatchPhenopacket) => (
      <PhenopacketLink.Biosamples packetId={p.id} biosamples={b.map((bb) => bb.id)} />
    ),
  },
  ...commonSearchTableColumns<DiscoveryMatchPhenopacket>(),
} as Record<string, ResultsTableColumn<DiscoveryMatchPhenopacket>>;

const BIOSAMPLE_SEARCH_TABLE_COLUMNS = {
  individual: {
    title: 'biosample.individual_id',
    dataIndex: 'individual_id',
    render: (_ctx) => (individualId: string, b) => (
      <PhenopacketLink.Subject packetId={b.phenopacket}>{individualId}</PhenopacketLink.Subject>
    ),
  } as ResultsTableColumn<DiscoveryMatchBiosample>,
  experiments: {
    title: 'entities.experiment_other',
    dataIndex: 'experiments',
    render: (_ctx) => (experiments: DiscoveryMatchExperiment[] | undefined, b) => (
      <PhenopacketLink.Experiments packetId={b.phenopacket} experiments={experiments?.map((e) => e.id) ?? []} />
    ),
  } as ResultsTableColumn<DiscoveryMatchBiosample>,
  ...commonSearchTableColumns<DiscoveryMatchBiosample>(),
};

const EXPERIMENT_SEARCH_TABLE_COLUMNS = {
  study_type: {
    title: 'experiment.study_type',
    dataIndex: 'study_type',
  } as ResultsTableColumn<DiscoveryMatchExperiment>,
  biosample: {
    title: 'entities.biosample_one',
    dataIndex: 'biosample',
    render: (_ctx) => (biosampleId: string, e) => (
      <PhenopacketLink.Biosample packetId={e?.phenopacket} sampleId={biosampleId} />
    ),
  } as ResultsTableColumn<DiscoveryMatchExperiment>,
  experiment_results: {
    title: 'entities.experiment_result_other',
    dataIndex: 'results',
    render: (_ctx) => (results: DiscoveryMatchExperimentResult[] | undefined) => (
      <ExperimentResultFileTypeCounts results={results} />
    ),
  } as ResultsTableColumn<DiscoveryMatchExperiment>,
  ...commonSearchTableColumns<DiscoveryMatchExperiment>(),
};

const EXPERIMENT_RESULT_SEARCH_TABLE_COLUMNS = {
  description: {
    title: 'experiment_result.description',
    dataIndex: 'description',
  } as ResultsTableColumn<DiscoveryMatchExperimentResult>,
  genome_assembly_id: {
    title: 'experiment_result.genome_assembly_id',
    dataIndex: 'genome_assembly_id',
  } as ResultsTableColumn<DiscoveryMatchExperimentResult>,
  file_format: {
    title: 'experiment_result.file_format',
    dataIndex: 'file_format',
  } as ResultsTableColumn<DiscoveryMatchExperimentResult>,
  experiments: {
    title: 'experiment_result.experiments',
    dataIndex: 'experiments',
    render: (_ctx) => (experiments: string[], er) => (
      <PhenopacketLink.Experiments packetId={er?.phenopacket} experiments={experiments} />
    ),
  } as ResultsTableColumn<DiscoveryMatchExperimentResult>,
  ...commonSearchTableColumns<DiscoveryMatchExperimentResult>(),
};

const TABLE_SPEC_PHENOPACKET: ResultsTableSpec<DiscoveryMatchPhenopacket> = {
  fixedColumns: [
    {
      dataIndex: 'subject',
      title: 'subject.subject_id',
      render: (s: string | undefined, rec) =>
        s ? <PhenopacketLink.Subject packetId={rec.id}>{s}</PhenopacketLink.Subject> : null,
    } as ResultsTableFixedColumn<DiscoveryMatchPhenopacket>,
  ],
  availableColumns: PHENOPACKET_SEARCH_TABLE_COLUMNS,
  defaultColumns: ['biosamples', 'project', 'dataset'],
  expandedRowRender: (rec) => (rec.subject ? <IndividualRowDetail id={rec.subject} /> : null),
};

const TABLE_SPEC_BIOSAMPLE: ResultsTableSpec<DiscoveryMatchBiosample> = {
  fixedColumns: [
    {
      dataIndex: 'id',
      title: 'biosample.biosample_id',
      render: (id: string, rec) =>
        rec.phenopacket ? <PhenopacketLink.Biosample packetId={rec.phenopacket} sampleId={id} /> : id,
    } as ResultsTableFixedColumn<DiscoveryMatchBiosample>,
  ],
  availableColumns: BIOSAMPLE_SEARCH_TABLE_COLUMNS,
  defaultColumns: ['individual', 'experiments', 'project', 'dataset'],
  expandedRowRender: (rec) => <BiosampleRowDetail id={rec.id} />,
};

const TABLE_SPEC_EXPERIMENT: ResultsTableSpec<DiscoveryMatchExperiment> = {
  fixedColumns: [
    {
      dataIndex: 'id',
      title: 'experiment.experiment_id',
      render: (id: string, exp) => <PhenopacketLink.Experiment packetId={exp.phenopacket} experimentId={id} />,
    } as ResultsTableFixedColumn<DiscoveryMatchExperiment>,
    {
      dataIndex: 'experiment_type',
      title: 'experiment.experiment_type',
    } as ResultsTableFixedColumn<DiscoveryMatchExperiment>,
  ],
  availableColumns: EXPERIMENT_SEARCH_TABLE_COLUMNS,
  defaultColumns: ['biosample', 'project', 'dataset'],
  expandedRowRender: (rec) => <ExperimentRowDetail id={rec.id} />,
};

const _erActionProps = ({
  url,
  filename,
  file_format: fileFormat,
}: DiscoveryMatchExperimentResult): ExperimentResultActionsProps => ({ url, filename, fileFormat });

const TABLE_SPEC_EXPERIMENT_RESULT: ResultsTableSpec<DiscoveryMatchExperimentResult> = {
  fixedColumns: [
    {
      dataIndex: 'filename',
      title: 'file.filename',
      render: (f: string | undefined, er) => (
        <PhenopacketLink.ExperimentResult packetId={er.phenopacket} experimentResultId={er.id}>
          {f}
        </PhenopacketLink.ExperimentResult>
      ),
    } as ResultsTableFixedColumn<DiscoveryMatchExperimentResult>,
    {
      key: 'actions',
      title: 'general.actions',
      render: (_, er) => <ExperimentResultActions {..._erActionProps(er)} />,
      isEmpty: (_, er) => {
        if (er === undefined) return true;
        return !er.url && !experimentResultViewable(_erActionProps(er));
      },
      showLast: true,
    } as ResultsTableFixedColumn<DiscoveryMatchExperimentResult>,
  ],
  availableColumns: EXPERIMENT_RESULT_SEARCH_TABLE_COLUMNS,
  defaultColumns: ['genome_assembly_id', 'file_format', 'experiments', 'project', 'dataset'],
  expandedRowRender: (rec) => <ExperimentResultRowDetail id={rec.id} />,
};

const ManageColumnCheckbox = <T extends ViewableDiscoveryMatchObject>({
  columnKey,
  columnSpec,
  shownColumns,
  setShownColumns,
}: {
  columnKey: string;
  columnSpec: ResultsTableColumn<T>;
  shownColumns: Set<string>;
  setShownColumns: (fn: (sc: Set<string>) => Set<string>) => void;
}) => {
  const t = useTranslationFn();
  return (
    <Checkbox
      checked={shownColumns.has(columnKey)}
      onChange={(e) =>
        setShownColumns(
          (sc) => new Set<string>(e.target.checked ? [...sc, columnKey] : [...sc].filter((v) => v !== columnKey))
        )
      }
    >
      {t(columnSpec.title, T_SINGULAR_COUNT)}
    </Checkbox>
  );
};

const SearchResultsTable = <T extends ViewableDiscoveryMatchObject>({
  entity,
  spec,
  searchContext,
  onBack,
  shown,
}: {
  entity: BentoKatsuEntity;
  spec: ResultsTableSpec<T>;
  searchContext: SearchColRenderContext;
  onBack?: () => void;
  shown: boolean;
}) => {
  const t = useTranslationFn();

  const dispatch = useAppDispatch();
  const { filterQueryParams, textQuery, resultCountsOrBools, pageSize, matchData } = useSearchQuery();
  const { fetchingPermission: fetchingCanDownload, hasPermission: canDownload } = useScopeDownloadData();
  const downloadAllMatchesCSV = useDownloadAllMatchesCSV();
  const selectedScope = useSelectedScope();
  const isSmallScreen = useSmallScreen();

  const [exporting, setExporting] = useState<boolean>(false);
  const [columnModalOpen, setColumnModalOpen] = useState<boolean>(false);

  // We translate an "individual" entity to "phenopacket" because TODO.
  // TODO: maybe we can make Katsu good enough that we can just simply return individuals rather than phenopackets
  const rdEntity = bentoKatsuEntityToResultsDataEntity(entity);

  const entityMatchData = matchData[rdEntity] as QueryResultMatchData<T>;
  const { status, page, totalMatches } = entityMatchData;
  let { matches } = entityMatchData;
  matches = matches ?? [];

  const currentStart = totalMatches > 0 ? page * pageSize + 1 : 0;
  const currentEnd = Math.min((page + 1) * pageSize, totalMatches);

  // -------------------------------------------------------------------------------------------------------------------

  const [shouldRefetch, setShouldRefetch] = useState<boolean>(true);

  // Order of the below two effects is important - we want to first flag whether we should refetch based on a set of
  // dependencies, and then (if we've flagged, or on initial load) run the refetch.
  // Note: These two are decoupled to reduce needless re-fetches based on `shown` changing.

  useEffect(() => {
    console.debug('flagging should-refetch for entity:', rdEntity, {
      page,
      pageSize,
      rdEntity,
      filterQueryParams,
      textQuery,
    });
    setShouldRefetch(true);
    // Dependencies on page/page size, filterQueryParams, and textQuery to trigger re-fetch when these change.
  }, [selectedScope, page, pageSize, rdEntity, filterQueryParams, textQuery]);

  useEffect(() => {
    if (!shown || !shouldRefetch) return;
    // TODO: in the future, move this to the useSearchRouterAndHandler query if we have which page is being shown in the
    //  URL or in Redux. Then, we can clean up the dispatch logic to have everything dispatched at once.
    console.debug('fetching discovery match page for entity:', rdEntity);
    dispatch(fetchDiscoveryMatches(rdEntity));
    setShouldRefetch(false);
  }, [dispatch, rdEntity, shown, shouldRefetch]);

  // -------------------------------------------------------------------------------------------------------------------

  const allowedColumns = useMemo<Set<string>>(() => {
    const allowed = new Set<string>();
    if (!selectedScope.scope.project) allowed.add('project');
    if (!selectedScope.scope.dataset) allowed.add('dataset');
    Object.keys(spec.availableColumns)
      .filter((c) => !['project', 'dataset'].includes(c))
      .forEach((c) => {
        allowed.add(c);
      });
    return allowed;
  }, [selectedScope.scope, spec.availableColumns]);

  const [shownColumns, setShownColumns] = useState<Set<string>>(
    () => new Set<string>(spec.defaultColumns.filter((c) => allowedColumns.has(c)))
  );

  useEffect(() => {
    // If the selected scope changes, some of the currently-shown columns may no longer be valid:
    setShownColumns((oldSet) => {
      const newSet = new Set<string>([...oldSet].filter((v) => allowedColumns.has(v)));

      // Don't change object if our newly-computed object is equivalent:
      return setEquals(oldSet, newSet) ? oldSet : newSet;
    });
  }, [selectedScope, allowedColumns, shownColumns]);

  const columns = useMemo<CustomTableColumns<T>>(
    () => [
      ...(spec.fixedColumns ?? [])
        .filter((c) => !c.showLast)
        .map((c: ResultsTableFixedColumn<T>) => fixedColumnToTableColumn(c, t)),
      ...Object.entries(spec.availableColumns)
        .filter(([k, _]) => shownColumns.has(k))
        .map(
          ([_, { title, dataIndex, render, ...cProps }]) =>
            ({
              title: t(title, T_SINGULAR_COUNT),
              dataIndex,
              render: render ? render(searchContext) : render,
              ...cProps,
            }) as CustomTableColumn<T>
        ),
      ...(spec.fixedColumns ?? [])
        .filter((c) => c.showLast)
        .map((c: ResultsTableFixedColumn<T>) => fixedColumnToTableColumn(c, t)),
    ],
    [t, spec, shownColumns, searchContext]
  );

  // -------------------------------------------------------------------------------------------------------------------

  // noinspection JSUnusedGlobalSymbols
  const pagination = useMemo<TablePaginationConfig | undefined>(
    () =>
      MIN_PAGE_SIZE < totalMatches
        ? {
            current: page + 1, // AntD page is 1-indexed, discovery match page is 0-indexed
            pageSize,
            pageSizeOptions: PAGE_SIZE_OPTIONS, // increased a bit from default for better data density
            total: totalMatches,
            position: (isSmallScreen ? ['bottomCenter'] : ['bottomRight']) as TablePaginationConfig['position'],
            size: (isSmallScreen ? 'small' : 'default') as TablePaginationConfig['size'],
            showSizeChanger: true,
            onChange(page, pageSize) {
              dispatch(setMatchesPage([rdEntity, page - 1])); // AntD page is 1-indexed, discovery match page is 0-indexed
              dispatch(setMatchesPageSize(pageSize));
            },
          }
        : undefined,
    [dispatch, rdEntity, page, pageSize, totalMatches, isSmallScreen]
  );

  const onExport = useCallback(() => {
    setExporting(true);
    const filename = `${t(`entities.${entity}_other`)}.csv`;
    downloadAllMatchesCSV(filterQueryParams, textQuery, rdEntity, filename).finally(() => setExporting(false));
  }, [t, entity, downloadAllMatchesCSV, filterQueryParams, textQuery, rdEntity]);

  const openColumnModal = useCallback(() => setColumnModalOpen(true), []);

  if (!shown) return null;

  return (
    <>
      <Col flex={1}>
        <Flex justify="space-between" align="center" style={{ marginBottom: 8 }}>
          {onBack ? (
            <Button
              icon={<LeftOutlined />}
              type={isSmallScreen ? 'default' : 'link'}
              onClick={onBack}
              style={{ paddingLeft: 0 }}
            >
              {isSmallScreen ? '' : t('Charts')}
            </Button>
          ) : (
            <Typography.Title level={4} className="mb-0">
              {t(`entities.${entity}`, T_PLURAL_COUNT)}
            </Typography.Title>
          )}
          <span className="antd-gray-7">
            {t('search.showing_entities' + (isSmallScreen ? '_short' : ''), {
              entity: `$t(entities.${entity}_other, lowercase)`,
              start: currentStart,
              end: currentEnd,
              total: totalMatches || resultCountsOrBools[entity],
            })}
          </span>
          <Space>
            <Tooltip title={t('search.manage_columns')}>
              <Button icon={<TableOutlined />} onClick={openColumnModal} />
            </Tooltip>
            {fetchingCanDownload || canDownload ? (
              <Button
                icon={<ExportOutlined />}
                loading={fetchingCanDownload || exporting}
                onClick={onExport}
                disabled={fetchingCanDownload || !totalMatches}
              >
                {isSmallScreen ? t('search.csv') : t('search.export_csv')}
              </Button>
            ) : null}
          </Space>
        </Flex>
        <CustomTable<T>
          columns={columns}
          dataSource={matches}
          loading={WAITING_STATES.includes(status)}
          rowKey="id"
          pagination={pagination}
          expandedRowRender={spec.expandedRowRender}
          isRowExpandable={(_) => true} // TODO
          urlAware={false}
        />
      </Col>
      <Modal
        open={columnModalOpen}
        onCancel={() => setColumnModalOpen(false)}
        title={t('search.manage_columns')}
        footer={null}
      >
        <Space direction="vertical">
          {/*
            TODO: filter by empty on entire result set somehow... i.e., filter out individual_id or something.
              Maybe we can just have a function based on available entities, although this doesn't cover other cases.
          */}
          {Object.entries(spec.availableColumns)
            .filter(([key, _]) => allowedColumns.has(key))
            .map(([key, columnSpec]) => (
              <ManageColumnCheckbox<T>
                key={key}
                columnKey={key}
                columnSpec={columnSpec}
                shownColumns={shownColumns}
                setShownColumns={setShownColumns}
              />
            ))}
        </Space>
      </Modal>
    </>
  );
};

const SearchResultsTablePage = ({ entity, onBack }: { entity: BentoKatsuEntity; onBack?: () => void }) => {
  const t = useTranslationFn();

  const { projectsByID, datasetsByID } = useMetadata();

  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [projectModalOpen, setProjectModalOpen] = useState<boolean>(false);
  const [selectedDataset, setSelectedDataset] = useState<Dataset | null>(null);
  const [datasetModalOpen, setDatasetModalOpen] = useState<boolean>(false);

  const searchContext = useMemo<SearchColRenderContext>(
    () => ({
      onProjectClick: (id: string) => {
        setSelectedProject(projectsByID[id] ?? null);
        setProjectModalOpen(true);
      },
      onDatasetClick: (id: string) => {
        setSelectedDataset(datasetsByID[id] ?? null);
        setDatasetModalOpen(true);
      },
    }),
    [projectsByID, datasetsByID]
  );

  const common = { searchContext, onBack };

  return (
    // We have all tables here to avoid re-rendering, but we only show them if the selected entity matches their entity.
    <>
      <SearchResultsTable<DiscoveryMatchPhenopacket>
        spec={TABLE_SPEC_PHENOPACKET}
        shown={entity === 'phenopacket' || entity === 'individual'}
        entity="phenopacket"
        {...common}
      />
      <SearchResultsTable<DiscoveryMatchBiosample>
        spec={TABLE_SPEC_BIOSAMPLE}
        shown={entity === 'biosample'}
        entity="biosample"
        {...common}
      />
      <SearchResultsTable<DiscoveryMatchExperiment>
        spec={TABLE_SPEC_EXPERIMENT}
        shown={entity === 'experiment'}
        entity="experiment"
        {...common}
      />
      <SearchResultsTable<DiscoveryMatchExperimentResult>
        spec={TABLE_SPEC_EXPERIMENT_RESULT}
        shown={entity === 'experiment_result'}
        entity="experiment_result"
        {...common}
      />
      <Modal
        title={selectedProject ? `${t('entities.project', T_SINGULAR_COUNT)}: ${t(selectedProject.title)}` : ''}
        open={projectModalOpen}
        onCancel={() => setProjectModalOpen(false)}
        width={800}
        footer={null}
      >
        {selectedProject && t(selectedProject.description)}
      </Modal>
      <DatasetProvenanceModal
        dataset={selectedDataset}
        open={datasetModalOpen}
        onCancel={() => setDatasetModalOpen(false)}
      />
    </>
  );
};

export default SearchResultsTablePage;
