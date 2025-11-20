import { type ReactNode, Fragment, useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuthorizationHeader } from 'bento-auth-js';

import {
  Button,
  Checkbox,
  Col,
  Flex,
  Modal,
  Space,
  Table,
  type TableColumnsType,
  type TableColumnType,
  type TablePaginationConfig,
  type TableProps,
  Tooltip,
  Typography,
} from 'antd';
import { ExportOutlined, LeftOutlined, TableOutlined } from '@ant-design/icons';

import { T_PLURAL_COUNT, T_SINGULAR_COUNT } from '@/constants/i18n';
import { WAITING_STATES } from '@/constants/requests';
import { useAppDispatch, useLanguage, useTranslationFn } from '@/hooks';
import { useSmallScreen } from '@/hooks/useResponsiveContext';

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
import { downloadAllMatchesCSV } from '@/utils/export';
import { setEquals } from '@/utils/sets';
import { useScopeDownloadData } from '@/hooks/censorship';
import { useSearchQuery } from '@/features/search/hooks';

import DatasetProvenanceModal from '@/components/Provenance/DatasetProvenanceModal';
import ProjectTitle from '@/components/Util/ProjectTitle';
import DatasetTitle from '@/components/Util/DatasetTitle';
import IndividualRowDetail from './IndividualRowDetail';
import BiosampleRowDetail from './BiosampleRowDetail';
import { PHENOPACKET_COLLAPSE_URL_QUERY_KEY } from '../ClinPhen/PhenopacketDisplay/PhenopacketOverview';

type SearchColRenderContext = {
  onProjectClick: (id: string) => void;
  onDatasetClick: (id: string) => void;
};

type ResultsTableColumn<T extends ViewableDiscoveryMatchObject> = {
  tKey: string; // column title translation key
  dataIndex: keyof T;
  render: (ctx: SearchColRenderContext) => (value: unknown, obj: T) => ReactNode;
};

type ResultsTableSpec<T extends ViewableDiscoveryMatchObject> = {
  fixedColumns?: TableColumnType<T>[];
  availableColumns: Record<string, ResultsTableColumn<T>>;
  defaultColumns: string[];
  expandable?: TableProps<T>['expandable'];
  canExport?: boolean;
};

const COMMON_SEARCH_TABLE_COLUMNS = {
  project: {
    tKey: 'entities.project_one',
    dataIndex: 'project',
    render: (ctx: SearchColRenderContext) => (id: string) => (
      <ProjectTitle projectID={id} onClick={() => ctx.onProjectClick(id)} />
    ),
  } as ResultsTableColumn<ViewableDiscoveryMatchObject>,
  dataset: {
    tKey: 'entities.dataset_one',
    dataIndex: 'dataset',
    render: (ctx: SearchColRenderContext) => (id: string) => (
      <DatasetTitle datasetID={id} onClick={() => ctx.onDatasetClick(id)} />
    ),
  } as ResultsTableColumn<ViewableDiscoveryMatchObject>,
} as const;

const PHENOPACKET_SEARCH_TABLE_COLUMNS = {
  biosamples: {
    tKey: 'entities.biosample_other',
    dataIndex: 'biosamples',
    render: (_ctx: SearchColRenderContext) => (b: DiscoveryMatchBiosample[], p: DiscoveryMatchPhenopacket) =>
      b.map((bb, bbi) => (
        <Fragment key={bb.id}>
          <PhenopacketBiosampleLink packetId={p.id} sampleId={bb.id} />
          {bbi < b.length - 1 ? ', ' : ''}
        </Fragment>
      )),
  } as ResultsTableColumn<DiscoveryMatchPhenopacket>,
  ...COMMON_SEARCH_TABLE_COLUMNS,
};

const PhenopacketSubjectLink = ({ children, packetId }: { children: ReactNode; packetId: string }) => {
  const language = useLanguage();
  return (
    <Link to={`/${language}/phenopackets/${packetId}/overview?${PHENOPACKET_COLLAPSE_URL_QUERY_KEY}=subject`}>
      {children}
    </Link>
  );
};

const PhenopacketBiosampleLink = ({ packetId, sampleId }: { packetId: string; sampleId: string }) => {
  const language = useLanguage();
  return (
    <Link
      to={`/${language}/phenopackets/${packetId}/overview?${PHENOPACKET_COLLAPSE_URL_QUERY_KEY}=biosamples&biosample=${sampleId}`}
    >
      {sampleId}
    </Link>
  );
};

const TABLE_SPEC_PHENOPACKET: ResultsTableSpec<DiscoveryMatchPhenopacket> = {
  fixedColumns: [
    {
      dataIndex: 'subject',
      title: 'subject.subject_id',
      render: (s: string | undefined, rec) =>
        s ? <PhenopacketSubjectLink packetId={rec.id}>{s}</PhenopacketSubjectLink> : null,
    } as TableColumnType<DiscoveryMatchPhenopacket>,
  ],
  availableColumns: PHENOPACKET_SEARCH_TABLE_COLUMNS,
  defaultColumns: ['biosamples', 'project', 'dataset'],
  expandable: {
    expandedRowRender: (rec) => (rec.subject ? <IndividualRowDetail id={rec.subject} /> : null),
  },
  canExport: true,
};

const TABLE_SPEC_BIOSAMPLE: ResultsTableSpec<DiscoveryMatchBiosample> = {
  fixedColumns: [
    {
      dataIndex: 'id',
      title: 'biosample_table.biosample_id',
      render: (id: string, rec) =>
        rec.phenopacket ? <PhenopacketBiosampleLink packetId={rec.phenopacket} sampleId={id} /> : id,
    } as TableColumnType<DiscoveryMatchBiosample>,
  ],
  availableColumns: COMMON_SEARCH_TABLE_COLUMNS,
  defaultColumns: ['project', 'dataset'],
  expandable: {
    expandedRowRender: (rec) => <BiosampleRowDetail id={rec.id} />,
  },
  canExport: true,
};

const TABLE_SPEC_EXPERIMENT: ResultsTableSpec<DiscoveryMatchExperiment> = {
  fixedColumns: [
    {
      dataIndex: 'id',
      title: 'experiment_table.experiment_id',
      render: (id: string) => <div>{id}</div>, // TODO: link
    } as TableColumnType<DiscoveryMatchExperiment>,
  ],
  availableColumns: COMMON_SEARCH_TABLE_COLUMNS,
  defaultColumns: ['project', 'dataset'],
  // expandable: {
  //   expandedRowRender: (rec) => <div>TODO: {rec.id}</div>,
  // },
  canExport: true,
};

const TABLE_SPEC_EXPERIMENT_RESULT: ResultsTableSpec<DiscoveryMatchExperimentResult> = {
  fixedColumns: [
    {
      dataIndex: 'filename',
      title: 'file.filename',
      render: (f: string | undefined) => <span>{f}</span>,
    } as TableColumnType<DiscoveryMatchExperimentResult>,
  ],
  availableColumns: COMMON_SEARCH_TABLE_COLUMNS,
  defaultColumns: ['project', 'dataset'],
  // expandable: {
  //   expandedRowRender: (rec) => <div>TODO: {rec.id}</div>,
  // },
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
      {t(columnSpec.tKey, T_SINGULAR_COUNT)}
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
  const authHeader = useAuthorizationHeader();
  const selectedScope = useSelectedScope();
  const isSmallScreen = useSmallScreen();

  const [exporting, setExporting] = useState<boolean>(false);
  const [columnModalOpen, setColumnModalOpen] = useState<boolean>(false);

  // We translate an "individual" entity to "phenopacket" because TODO.
  // TODO: maybe we can make Katsu good enough that we can just simply return individuals rather than phenopackets
  const rdEntity = bentoKatsuEntityToResultsDataEntity(entity);

  const { matches, status, page, totalMatches } = matchData[rdEntity] as QueryResultMatchData<T>;

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

  const columns = useMemo<TableColumnsType<T>>(
    () => [
      ...(spec.fixedColumns ?? []).map(
        (c: TableColumnType<T>) => ({ ...c, title: t(c.title as string) }) as TableColumnType<T>
      ),
      ...Object.entries(spec.availableColumns)
        .filter(([k, _]) => shownColumns.has(k))
        .map(
          ([_, { tKey, dataIndex, render }]) =>
            ({
              title: t(tKey, T_SINGULAR_COUNT),
              dataIndex,
              render: render(searchContext),
            }) as TableColumnType<T>
        ),
    ],
    [t, spec, shownColumns, searchContext]
  );

  // -------------------------------------------------------------------------------------------------------------------

  // noinspection JSUnusedGlobalSymbols
  const pagination = useMemo<TablePaginationConfig>(
    () => ({
      current: page + 1, // AntD page is 1-indexed, discovery match page is 0-indexed
      pageSize,
      total: totalMatches,
      position: (isSmallScreen ? ['bottomCenter'] : ['bottomRight']) as TablePaginationConfig['position'],
      size: (isSmallScreen ? 'small' : 'default') as TablePaginationConfig['size'],
      showSizeChanger: true,
      onChange(page, pageSize) {
        dispatch(setMatchesPage([rdEntity, page - 1])); // AntD page is 1-indexed, discovery match page is 0-indexed
        dispatch(setMatchesPageSize(pageSize));
      },
    }),
    [dispatch, rdEntity, page, pageSize, totalMatches, isSmallScreen]
  );

  const onExport = useCallback(() => {
    if (!spec.canExport) return;
    setExporting(true);
    const filename = `${t(`entities.${entity}_other`)}.csv`;
    downloadAllMatchesCSV(authHeader, selectedScope, filterQueryParams, textQuery, rdEntity, filename).finally(() =>
      setExporting(false)
    );
  }, [spec.canExport, t, entity, authHeader, selectedScope, filterQueryParams, textQuery, rdEntity]);

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
            {!!spec.canExport && (fetchingCanDownload || canDownload) ? (
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
        <Table<T>
          columns={columns}
          dataSource={matches}
          loading={WAITING_STATES.includes(status)}
          rowKey="id"
          bordered={true}
          size="small"
          pagination={pagination}
          expandable={spec.expandable}
        />
      </Col>
      <Modal
        open={columnModalOpen}
        onCancel={() => setColumnModalOpen(false)}
        title={t('search.manage_columns')}
        footer={null}
      >
        <Space direction="vertical">
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
