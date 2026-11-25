import { type Key, type ReactNode, useCallback, useMemo, useState } from 'react';

import {
  Button,
  Checkbox,
  Col,
  Dropdown,
  Flex,
  message,
  Modal,
  Space,
  type TablePaginationConfig,
  Tooltip,
  Typography,
} from 'antd';
import { DownloadOutlined, DownOutlined, LeftOutlined, TableOutlined } from '@ant-design/icons';

import { PCGL_MODE } from '@/config';
import { T_PLURAL_COUNT, T_SINGULAR_COUNT } from '@/constants/i18n';
import { MIN_PAGE_SIZE, PAGE_SIZE_OPTIONS } from '@/constants/pagination';
import { WAITING_STATES } from '@/constants/requests';
import { TABLE_PAGE_QUERY_PARAM, TABLE_PAGE_SIZE_QUERY_PARAM } from '@/features/search/constants';

import { useAppDispatch, useAppSelector, useTranslationFn } from '@/hooks';
import { useResponsiveMobileContext, useSmallScreen } from '@/hooks/useResponsiveContext';
import { useScopeDownloadData } from '@/hooks/censorship';
import { useDownloadAllMatches } from '@/hooks/useDownloadAllMatches';
import { downloadSelectedMatches } from '@/utils/downloadSelectedMatches';
import { useExportFileManifest } from '@/hooks/useExportFileManifest';
import { useSearchQuery, useSearchQueryParams } from '@/features/search/hooks';
import { useNavigateToSameScopeUrl } from '@/hooks/navigation';
import { useMetadata, useSelectedScope } from '@/features/metadata/hooks';

import type { ExternalLink } from '@/types/clinPhen/shared';
import LinksList from '@/components/Util/LinksList';
import type { ResultsDataEntity } from '@/types/entities';
import type { Project } from '@/types/metadata';
import type { Dataset } from '@/types/dataset';
import type { DiscoveryScopeSelection } from '@/features/metadata/metadata.store';
import { setSelectedRows, type QueryResultMatchData, type SelectedRowMap } from '@/features/search/query.store';
import type {
  DiscoveryMatchBiosample,
  DiscoveryMatchExperiment,
  DiscoveryMatchExperimentResult,
  DiscoveryMatchIndividual,
  ViewableDiscoveryMatchObject,
} from '@/features/search/types';
import type { ExportFormat } from '@/types/entities';
import { BentoRoute } from '@/types/routes';

import { scopeSelectionEqual } from '@/features/metadata/utils';
import { buildQueryParamsUrl, queryParamsWithoutKey } from '@/features/search/utils';
import { setEquals } from '@/utils/sets';

import DatasetProvenanceModal from '@/components/Provenance/DatasetProvenance/DatasetProvenanceModal';
import ProjectTitle from '@Util/ProjectTitle';
import DatasetTitle from '@Util/DatasetTitle';
import ExperimentReferences from '@Util/ClinPhen/ExperimentReferences';
import CustomTable, { type CustomTableColumn, type CustomTableColumns } from '@Util/CustomTable';
import ExportFieldsModal from './ExportFieldsModal';
import IndividualRowDetail from './IndividualRowDetail';
import BiosampleDetailView from './BiosampleDetailView';
import ExperimentRowDetail from './ExperimentRowDetail';
import ExperimentResultRowDetail from './ExperimentResultRowDetail';
import PhenopacketLink from '@/components/ClinPhen/PhenopacketLink';
import { ExperimentResultFileTypeCounts } from '@/components/ClinPhen/ExperimentDisplay/ExperimentView';
import {
  ExperimentResultActions,
  type ExperimentResultActionsProps,
  experimentResultViewable,
} from '@/components/ClinPhen/ExperimentDisplay/ExperimentResultView';
import ReferenceGenomePopoverField from '../Util/ClinPhen/ReferenceGenomePopoverField';
import FreeTextAndOrOntologyClass from '../Util/ClinPhen/FreeTextAndOrOntologyClass';
import { RequestStatus } from '@/types/requests';

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

// An individual can have several phenopackets; links into the phenopacket view use the first one.
const firstPhenopacketId = (ind: DiscoveryMatchIndividual): string | undefined => ind.phenopackets[0]?.id;

const INDIVIDUAL_SEARCH_TABLE_COLUMNS = {
  biosamples: {
    title: 'entities.biosample_other',
    dataIndex: 'biosamples',
    render: (_ctx: SearchColRenderContext) => (b: DiscoveryMatchBiosample[], ind: DiscoveryMatchIndividual) => (
      <PhenopacketLink.Biosamples packetId={firstPhenopacketId(ind)} biosamples={b.map((bb) => bb.id)} enablePopover />
    ),
  },
  links: {
    title: 'general.links',
    dataIndex: 'links',
    render: (_ctx: SearchColRenderContext) => (links: ExternalLink[]) => <LinksList links={links} />,
  },
  ...commonSearchTableColumns<DiscoveryMatchIndividual>(),
} as Record<string, ResultsTableColumn<DiscoveryMatchIndividual>>;

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
    render: (_ctx) => (experiments: DiscoveryMatchExperiment[], b) => (
      <ExperimentReferences packetId={b.phenopacket} experiments={experiments} />
    ),
  } as ResultsTableColumn<DiscoveryMatchBiosample>,
  links: {
    title: 'general.links',
    dataIndex: 'links',
    render: (_ctx) => (links: ExternalLink[]) => <LinksList links={links} />,
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
      <PhenopacketLink.Biosample packetId={e?.phenopacket} sampleId={biosampleId} enablePopover />
    ),
  } as ResultsTableColumn<DiscoveryMatchExperiment>,
  experiment_results: {
    title: 'entities.experiment_result_other',
    dataIndex: 'results',
    render: (_ctx) => (results: DiscoveryMatchExperimentResult[] | undefined) => (
      <ExperimentResultFileTypeCounts results={results} />
    ),
  } as ResultsTableColumn<DiscoveryMatchExperiment>,
  links: {
    title: 'general.links',
    dataIndex: 'links',
    render: (_ctx) => (links: ExternalLink[]) => <LinksList links={links} />,
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
    render: (_ctx) => (gaId: string) => <ReferenceGenomePopoverField referenceGenomeId={gaId} />,
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
  links: {
    title: 'general.links',
    dataIndex: 'links',
    render: (_ctx) => (links: ExternalLink[]) => <LinksList links={links} />,
  } as ResultsTableColumn<DiscoveryMatchExperimentResult>,
  ...commonSearchTableColumns<DiscoveryMatchExperimentResult>(),
};

const TABLE_SPEC_INDIVIDUAL: ResultsTableSpec<DiscoveryMatchIndividual> = {
  fixedColumns: [
    {
      dataIndex: 'id',
      title: 'subject.subject_id',
      render: (id: string, rec) => (
        <PhenopacketLink.Subject packetId={firstPhenopacketId(rec)}>{id}</PhenopacketLink.Subject>
      ),
    } as ResultsTableFixedColumn<DiscoveryMatchIndividual>,
  ],
  availableColumns: INDIVIDUAL_SEARCH_TABLE_COLUMNS,
  defaultColumns: ['biosamples', 'links', 'project', 'dataset'],
  expandedRowRender: (rec) => <IndividualRowDetail id={rec.id} />,
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
  defaultColumns: ['individual', 'experiments', 'links', 'project', 'dataset'],
  expandedRowRender: (rec) => <BiosampleDetailView id={rec.id} mode="search-row" />,
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
      render: (_: string, e: DiscoveryMatchExperiment) => (
        <FreeTextAndOrOntologyClass text={e.experiment_type} ontologyClass={e.experiment_ontology} mode="experiment" />
      ),
    } as ResultsTableFixedColumn<DiscoveryMatchExperiment>,
  ],
  availableColumns: EXPERIMENT_SEARCH_TABLE_COLUMNS,
  defaultColumns: ['biosample', 'links', 'project', 'dataset'],
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
  defaultColumns: ['genome_assembly_id', 'file_format', 'experiments', 'links', 'project', 'dataset'],
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
  entity: ResultsDataEntity;
  spec: ResultsTableSpec<T>;
  searchContext: SearchColRenderContext;
  onBack?: () => void;
  shown: boolean;
}) => {
  const t = useTranslationFn();
  const dispatch = useAppDispatch();

  const { resultCountsOrBools, pageSize, matchData } = useSearchQuery();
  const { fetchingPermission: fetchingCanDownload, hasPermission: canDownload } = useScopeDownloadData();
  const downloadAllMatches = useDownloadAllMatches();
  const isSmallScreen = useSmallScreen();
  const isMobile = useResponsiveMobileContext();

  const allQueryParams = useSearchQueryParams();
  const navigateToSameScopeUrl = useNavigateToSameScopeUrl();

  const selectedScope = useSelectedScope();
  const [oldSelectedScope, setOldSelectedScope] = useState<DiscoveryScopeSelection>(selectedScope);

  const [exporting, setExporting] = useState<boolean>(false);
  const [columnModalOpen, setColumnModalOpen] = useState<boolean>(false);
  const [exportModalOpen, setExportModalOpen] = useState<boolean>(false);
  const [exportFormat, setExportFormat] = useState<ExportFormat>('csv');

  const entityMatchData = matchData[entity] as QueryResultMatchData<T>;
  const { status, page, totalMatches } = entityMatchData;
  let { matches } = entityMatchData;
  matches = matches ?? [];

  const currentStart = totalMatches > 0 ? page * pageSize + 1 : 0;
  const currentEnd = Math.min((page + 1) * pageSize, totalMatches);

  // -------------------------------------------------------------------------------------------------------------------
  // Row selection, for exporting a subset of results. Selection is keyed by entity in Redux so that it persists
  // across pagination (only the current page's matches are loaded into memory at any given time).

  const selectedRowMap = useAppSelector((state) => state.query.selectedRows[entity]);
  const selectedRowKeys = useMemo<Key[]>(() => Object.keys(selectedRowMap), [selectedRowMap]);

  const selectedExportIds = useMemo<string[]>(
    () => Object.values(selectedRowMap).filter((v): v is string => Boolean(v)),
    [selectedRowMap]
  );
  const hasSelection = selectedRowKeys.length > 0;

  const clearSelection = useCallback(() => dispatch(setSelectedRows([entity, {}])), [dispatch, entity]);

  const onSelectionChange = useCallback(
    (keys: Key[], rows: (T | undefined)[]) => {
      const newMap: SelectedRowMap = {};
      keys.forEach((k, i) => {
        const key = String(k);
        const row = rows[i];
        const exportId = row ? String(row.id) : selectedRowMap[key]; // fall back to the previously-known mapping if row data isn't available
        newMap[key] = exportId;
      });
      dispatch(setSelectedRows([entity, newMap]));
    },
    [dispatch, entity, selectedRowMap]
  );

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

  if (!scopeSelectionEqual(selectedScope, oldSelectedScope)) {
    // If the selected scope changes, some of the currently-shown columns may no longer be valid, so we eliminate any
    // currently-shown columns that are no longer allowed:
    setShownColumns((oldSet) => {
      const newSet = new Set<string>([...oldSet].filter((v) => allowedColumns.has(v)));

      // Don't change object identity if our newly-computed object is equivalent:
      return setEquals(oldSet, newSet) ? oldSet : newSet;
    });
    setOldSelectedScope(selectedScope);
  }

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
            placement: (isSmallScreen ? ['bottomCenter'] : ['bottomRight']) as TablePaginationConfig['placement'],
            size: (isSmallScreen ? 'small' : 'medium') as TablePaginationConfig['size'],
            showSizeChanger: true,
            onChange(newPage, newPageSize) {
              // Update page/pageSize using navigation, since we sync Redux from the URL uni-directionally most times.
              if (newPageSize !== pageSize) {
                newPage = 1; // Reset page if we change the page size
              }
              navigateToSameScopeUrl(
                buildQueryParamsUrl(BentoRoute.Explore, [
                  ...queryParamsWithoutKey(allQueryParams, [TABLE_PAGE_QUERY_PARAM, TABLE_PAGE_SIZE_QUERY_PARAM]),

                  // AntD page is 1-indexed, discovery match page is 0-indexed:
                  [TABLE_PAGE_QUERY_PARAM, (newPage - 1).toString()],
                  [TABLE_PAGE_SIZE_QUERY_PARAM, newPageSize.toString()],
                ])
              );
            },
            style: { marginTop: 12, marginBottom: 0 }, // Already have bottom padding in search results card
          }
        : undefined,
    [page, pageSize, totalMatches, isSmallScreen, navigateToSameScopeUrl, allQueryParams]
  );

  const onExport = useCallback(
    (fields: string[] | undefined) => {
      setExporting(true);
      const filename = `${t(`entities.${entity}_other`)}.${exportFormat}`;
      const download = hasSelection
        ? downloadSelectedMatches(entity, selectedExportIds, exportFormat, filename, fields)
        : downloadAllMatches(entity, exportFormat, filename, fields);
      download
        .then(() => setExportModalOpen(false))
        .catch(() => message.error(t('search.export_error')))
        .finally(() => setExporting(false));
    },
    [t, entity, hasSelection, selectedExportIds, downloadAllMatches, exportFormat]
  );

  const { exportFileManifest: onExportManifest, isExportingFileManifest } = useExportFileManifest(false);

  const openColumnModal = useCallback(() => setColumnModalOpen(true), []);
  const openExportModal = useCallback((format: ExportFormat) => {
    setExportFormat(format);
    setExportModalOpen(true);
  }, []);

  const anyExporting = exporting || isExportingFileManifest;

  const exportMenuItems = useMemo(() => {
    const items: { key: string; label: string; onClick: () => void }[] = (['csv', 'xlsx'] as ExportFormat[]).map(
      (format) => ({
        key: format,
        label: t(`search.${format}`),
        onClick: () => openExportModal(format),
      })
    );
    if (entity === 'experiment_result' && PCGL_MODE) {
      items.push({ key: 'manifest', label: t('search.manifest'), onClick: onExportManifest });
    }
    return items;
  }, [t, entity, openExportModal, onExportManifest]);

  if (!shown) return null;

  return (
    <>
      <Col flex={1}>
        <Flex justify={isMobile ? 'center' : 'space-between'} align="center" gap="small" className="mb-3" wrap>
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
            <Typography.Title level={2} className="h-as-4 mb-0">
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
            {selectedRowKeys.length > 0 && (
              <Space size="small">
                <Typography.Text className="antd-gray-7">
                  {t('search.selected_count', { count: selectedRowKeys.length })}
                </Typography.Text>
                <Button type="link" size="small" className="p-0" onClick={clearSelection}>
                  {t('search.clear_selection')}
                </Button>
              </Space>
            )}
            <Tooltip title={t('search.manage_columns')}>
              <Button icon={<TableOutlined />} onClick={openColumnModal} />
            </Tooltip>
            {fetchingCanDownload || canDownload ? (
              <Dropdown
                menu={{ items: exportMenuItems }}
                disabled={fetchingCanDownload || anyExporting || !totalMatches}
              >
                <Button
                  icon={<DownloadOutlined />}
                  loading={fetchingCanDownload || anyExporting}
                  disabled={fetchingCanDownload || anyExporting || !totalMatches}
                >
                  {t('search.export')} <DownOutlined />
                </Button>
              </Dropdown>
            ) : null}
          </Space>
        </Flex>
        <CustomTable<T>
          columns={columns}
          dataSource={matches}
          showHeader={!(status === RequestStatus.Fulfilled && matches.length === 0)}
          loading={WAITING_STATES.includes(status)}
          rowKey="id"
          pagination={pagination}
          expandedRowRender={spec.expandedRowRender}
          isRowExpandable={(_) => true} // TODO
          urlAware={false}
          rowSelection={{
            selectedRowKeys,
            onChange: onSelectionChange,
            preserveSelectedRowKeys: true,
          }}
        />
      </Col>
      <Modal
        open={columnModalOpen}
        onCancel={() => setColumnModalOpen(false)}
        title={t('search.manage_columns')}
        footer={null}
      >
        <Space orientation="vertical">
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
      <ExportFieldsModal
        open={exportModalOpen}
        entity={entity}
        format={exportFormat}
        exporting={exporting}
        onCancel={() => setExportModalOpen(false)}
        onExport={onExport}
      />
    </>
  );
};

const SearchResultsTablePage = ({ entity, onBack }: { entity: ResultsDataEntity; onBack?: () => void }) => {
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
      <SearchResultsTable<DiscoveryMatchIndividual>
        spec={TABLE_SPEC_INDIVIDUAL}
        shown={entity === 'individual'}
        entity="individual"
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
