import { type ReactNode, useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
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
import { useAppDispatch, useTranslationFn } from '@/hooks';
import { useSmallScreen } from '@/hooks/useResponsiveContext';

import type { BentoEntity } from '@/types/entities';
import type { Project, Dataset } from '@/types/metadata';
import { useMetadata, useSelectedScope } from '@/features/metadata/hooks';
import { fetchDiscoveryMatches } from '@/features/search/fetchDiscoveryMatches.thunk';
import {
  bentoEntityToResultsDataEntity,
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
import { downloadBiosampleCSV, downloadExperimentCSV, downloadIndividualCSV } from '@/utils/export';
import { setEquals } from '@/utils/sets';
import { useScopeDownloadData } from '@/hooks/censorship';
import { useSearchQuery } from '@/features/search/hooks';

import DatasetProvenanceModal from '@/components/Provenance/DatasetProvenanceModal';
import ProjectTitle from '@/components/Util/ProjectTitle';
import DatasetTitle from '@/components/Util/DatasetTitle';
import IndividualRowDetail from './IndividualRowDetail';
import BiosampleRowDetail from './BiosampleRowDetail';

type SearchColRenderContext = {
  onProjectClick: (id: string) => void;
  onDatasetClick: (id: string) => void;
};

type ResultsTableColumn<T extends ViewableDiscoveryMatchObject> = {
  tKey: string; // column title translation key
  dataIndex: keyof T;
  render: (ctx: SearchColRenderContext) => (value: unknown) => ReactNode;
};

type ResultsTableSpec<T extends ViewableDiscoveryMatchObject> = {
  fixedColumns?: TableColumnType<T>[];
  availableColumns: Record<string, ResultsTableColumn<T>>;
  defaultColumns: string[];
  expandable?: TableProps<T>['expandable'];
  download?: (headers: Record<string, string>, matches: T[]) => Promise<void>;
};

const COMMON_SEARCH_TABLE_COLUMNS = {
  project: {
    tKey: 'entities.project',
    dataIndex: 'pr',
    render: (ctx: SearchColRenderContext) => (id: string) => (
      <ProjectTitle projectID={id} onClick={() => ctx.onProjectClick(id)} />
    ),
  } as ResultsTableColumn<ViewableDiscoveryMatchObject>,
  dataset: {
    tKey: 'entities.dataset',
    dataIndex: 'ds',
    render: (ctx: SearchColRenderContext) => (id: string) => (
      <DatasetTitle datasetID={id} onClick={() => ctx.onDatasetClick(id)} />
    ),
  } as ResultsTableColumn<ViewableDiscoveryMatchObject>,
} as const;

const SEARCH_TABLE_COLUMNS = {
  biosamples: {
    tKey: 'entities.biosample_other',
    dataIndex: 'b',
    // TODO: links
    render: (_ctx: SearchColRenderContext) => (b: DiscoveryMatchBiosample[]) => b.map((bb) => bb.id).join(', '),
  } as ResultsTableColumn<DiscoveryMatchPhenopacket>,
  ...COMMON_SEARCH_TABLE_COLUMNS,
} as const;
type SearchTableColumnType = keyof typeof SEARCH_TABLE_COLUMNS;

const PhenopacketSubjectLink = ({ children, packetId }: { children: ReactNode; packetId: string }) => {
  const {
    i18n: { language },
  } = useTranslation();
  return <Link to={`/${language}/phenopackets/${packetId}/subject`}>{children}</Link>;
};

const PhenopacketBiosampleLink = ({ packetId, sampleId }: { packetId: string; sampleId: string }) => {
  const {
    i18n: { language },
  } = useTranslation();
  return <Link to={`/${language}/phenopackets/${packetId}/biosamples?expanded=${sampleId}`}>{sampleId}</Link>;
};

const TABLE_SPEC_PHENOPACKET: ResultsTableSpec<DiscoveryMatchPhenopacket> = {
  fixedColumns: [
    {
      dataIndex: 's',
      title: 'Subject ID',
      render: (s: string | undefined, rec) =>
        s ? <PhenopacketSubjectLink packetId={rec.id}>{s}</PhenopacketSubjectLink> : null,
    } as TableColumnType<DiscoveryMatchPhenopacket>,
  ],
  availableColumns: SEARCH_TABLE_COLUMNS,
  defaultColumns: ['biosamples', 'project', 'dataset'],
  expandable: {
    expandedRowRender: (rec) => (rec.s ? <IndividualRowDetail id={rec.s} /> : null),
  },
  download: (headers, matches) =>
    downloadIndividualCSV(
      headers,
      matches.filter(({ s }) => s !== undefined).map(({ s }) => s as string)
    ),
};

const TABLE_SPEC_BIOSAMPLE: ResultsTableSpec<DiscoveryMatchBiosample> = {
  fixedColumns: [
    {
      dataIndex: 'id',
      title: 'Biosample ID',
      render: (id: string, rec) => (rec.p ? <PhenopacketBiosampleLink packetId={rec.p} sampleId={id} /> : id),
    } as TableColumnType<DiscoveryMatchBiosample>,
  ],
  availableColumns: COMMON_SEARCH_TABLE_COLUMNS,
  defaultColumns: ['project', 'dataset'],
  expandable: {
    expandedRowRender: (rec) => <BiosampleRowDetail id={rec.id} />,
  },
  download: (headers, matches) =>
    downloadBiosampleCSV(
      headers,
      matches.map((b) => b.id)
    ),
};

const TABLE_SPEC_EXPERIMENT: ResultsTableSpec<DiscoveryMatchExperiment> = {
  fixedColumns: [
    {
      dataIndex: 'id',
      title: 'Experiment ID',
      render: (id: string) => <div>{id}</div>, // TODO: link
    } as TableColumnType<DiscoveryMatchExperiment>,
  ],
  availableColumns: COMMON_SEARCH_TABLE_COLUMNS,
  defaultColumns: ['project', 'dataset'],
  // expandable: {
  //   expandedRowRender: (rec) => <div>TODO: {rec.id}</div>,
  // },
  download: (headers, matches) =>
    downloadExperimentCSV(
      headers,
      matches.map((e) => e.id)
    ),
};

const TABLE_SPEC_EXPERIMENT_RESULT: ResultsTableSpec<DiscoveryMatchExperimentResult> = {
  fixedColumns: [
    {
      dataIndex: 'f',
      title: 'File Name',
      render: (f: string | undefined) => <span>{f}</span>,
    } as TableColumnType<DiscoveryMatchExperimentResult>,
  ],
  availableColumns: COMMON_SEARCH_TABLE_COLUMNS,
  defaultColumns: ['project', 'dataset'],
  // expandable: {
  //   expandedRowRender: (rec) => <div>TODO: {rec.id}</div>,
  // },
};

const ManageColumnCheckbox = ({
  c,
  shownColumns,
  setShownColumns,
}: {
  c: SearchTableColumnType;
  shownColumns: Set<string>;
  setShownColumns: (fn: (sc: Set<string>) => Set<string>) => void;
}) => {
  const t = useTranslationFn();
  return (
    <Checkbox
      checked={shownColumns.has(c)}
      onChange={(e) =>
        setShownColumns((sc) => new Set<string>(e.target.checked ? [...sc, c] : [...sc].filter((v) => v !== c)))
      }
    >
      {t(SEARCH_TABLE_COLUMNS[c].tKey, T_SINGULAR_COUNT)}
    </Checkbox>
  );
};

const SearchResultsTable = <T extends ViewableDiscoveryMatchObject>({
  entity,
  spec,
  searchContext,
  onBack,
}: {
  entity: BentoEntity;
  spec: ResultsTableSpec<T>;
  searchContext: SearchColRenderContext;
  onBack?: () => void;
}) => {
  const t = useTranslationFn();

  const dispatch = useAppDispatch();
  const { pageSize, matchData } = useSearchQuery();
  const { fetchingPermission: fetchingCanDownload, hasPermission: canDownload } = useScopeDownloadData();
  const authHeader = useAuthorizationHeader();
  const selectedScope = useSelectedScope();
  const isSmallScreen = useSmallScreen();

  const [exporting, setExporting] = useState<boolean>(false);
  const [columnModalOpen, setColumnModalOpen] = useState<boolean>(false);

  // TODO: maybe we can make Katsu good enough that we can just simply return individuals rather than phenopackets
  const rdEntity = bentoEntityToResultsDataEntity(entity);

  const { matches, status, page, totalMatches } = matchData[rdEntity] as QueryResultMatchData<T>;

  const currentStart = totalMatches > 0 ? page * pageSize + 1 : 0;
  const currentEnd = Math.min((page + 1) * pageSize, totalMatches);

  useEffect(() => {
    dispatch(fetchDiscoveryMatches(rdEntity));
  }, [dispatch, page, pageSize, rdEntity]);

  // -------------------------------------------------------------------------------------------------------------------

  const allowedColumns = useMemo<Set<string>>(() => {
    const allowed = new Set<string>();
    if (!selectedScope.scope.project) allowed.add('project');
    if (!selectedScope.scope.dataset) allowed.add('dataset');
    // TODO: replace with adding all allowed columns that aren't project/dataset
    if (rdEntity === 'phenopacket') allowed.add('biosamples');
    return allowed;
  }, [rdEntity, selectedScope.scope]);

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
      ...(spec.fixedColumns ?? []),
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
    if (!spec.download) return;
    setExporting(true);
    spec.download(authHeader, matches ?? []).finally(() => setExporting(false));
  }, [spec, authHeader, matches]);

  const openColumnModal = useCallback(() => setColumnModalOpen(true), []);

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
              total: totalMatches,
            })}
          </span>
          <Space>
            <Tooltip title={t('search.manage_columns')}>
              <Button icon={<TableOutlined />} onClick={openColumnModal} />
            </Tooltip>
            {!!spec.download && (fetchingCanDownload || canDownload) ? (
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
          {allowedColumns.has('project') && (
            <ManageColumnCheckbox c="project" shownColumns={shownColumns} setShownColumns={setShownColumns} />
          )}
          {allowedColumns.has('dataset') && (
            <ManageColumnCheckbox c="dataset" shownColumns={shownColumns} setShownColumns={setShownColumns} />
          )}
          {allowedColumns.has('biosamples') && (
            <ManageColumnCheckbox c="biosamples" shownColumns={shownColumns} setShownColumns={setShownColumns} />
          )}
        </Space>
      </Modal>
    </>
  );
};

const SearchResultsTablePage = ({ entity, onBack }: { entity: BentoEntity; onBack?: () => void }) => {
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

  return (
    <>
      {(() => {
        const common = { entity, searchContext, onBack };
        if (entity === 'phenopacket' || entity === 'individual') {
          return <SearchResultsTable<DiscoveryMatchPhenopacket> spec={TABLE_SPEC_PHENOPACKET} {...common} />;
        } else if (entity === 'biosample') {
          return <SearchResultsTable<DiscoveryMatchBiosample> spec={TABLE_SPEC_BIOSAMPLE} {...common} />;
        } else if (entity === 'experiment') {
          return <SearchResultsTable<DiscoveryMatchExperiment> spec={TABLE_SPEC_EXPERIMENT} {...common} />;
        } else if (entity === 'experiment_result') {
          return <SearchResultsTable<DiscoveryMatchExperimentResult> spec={TABLE_SPEC_EXPERIMENT_RESULT} {...common} />;
        } else {
          return <span className="error-text">Unhandled entity: {entity}</span>;
        }
      })()}
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
