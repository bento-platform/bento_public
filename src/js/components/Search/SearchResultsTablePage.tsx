import { type ReactNode, useCallback, useEffect, useMemo, useState } from 'react';
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
  type TablePaginationConfig,
  type TableProps,
  Tooltip,
  Typography,
} from 'antd';
import { ExportOutlined, LeftOutlined, TableOutlined } from '@ant-design/icons';

import { PORTAL_URL } from '@/config';
import { T_PLURAL_COUNT, T_SINGULAR_COUNT } from '@/constants/i18n';
import { WAITING_STATES } from '@/constants/requests';
import { useAppDispatch, useTranslationFn } from '@/hooks';
import { useSmallScreen } from '@/hooks/useResponsiveContext';

import IndividualRowDetail from './IndividualRowDetail';
import type { BentoEntity } from '@/types/entities';
import type { Project, Dataset } from '@/types/metadata';
import { useMetadata, useSelectedScope } from '@/features/metadata/hooks';
import { fetchDiscoveryMatches } from '@/features/search/fetchDiscoveryMatches.thunk';
import { setMatchesPage, setMatchesPageSize } from '@/features/search/query.store';
import type { DiscoveryMatchBiosample, DiscoveryMatchPhenopacket } from '@/features/search/types';
import DatasetProvenanceModal from '@/components/Provenance/DatasetProvenanceModal';
import ProjectTitle from '@/components/Util/ProjectTitle';
import DatasetTitle from '@/components/Util/DatasetTitle';
import { downloadIndividualCSV } from '@/utils/export';
import { setEquals } from '@/utils/sets';
import { useScopeDownloadData } from '@/hooks/censorship';
import { useSearchQuery } from '@/features/search/hooks';

type SearchColRenderContext = {
  onProjectClick: (id: string) => void;
  onDatasetClick: (id: string) => void;
};

const SEARCH_TABLE_COLUMNS = {
  project: {
    tKey: 'entities.project',
    dataIndex: 'project_id',
    render: (ctx: SearchColRenderContext) => (id: string) => (
      <ProjectTitle projectID={id} onClick={() => ctx.onProjectClick(id)} />
    ),
  },
  dataset: {
    tKey: 'entities.dataset',
    dataIndex: 'dataset_id',
    render: (ctx: SearchColRenderContext) => (id: string) => (
      <DatasetTitle datasetID={id} onClick={() => ctx.onDatasetClick(id)} />
    ),
  },
} as const;
type SearchTableColumnType = keyof typeof SEARCH_TABLE_COLUMNS;

const IndividualPortalLink = ({ children, id }: { children: ReactNode; id: string }) => (
  <a href={`${PORTAL_URL}/data/explorer/individuals/${id}`} target="_blank" rel="noreferrer">
    {children} <ExportOutlined />
  </a>
);

const INDIVIDUAL_EXPANDABLE: TableProps<DiscoveryMatchPhenopacket>['expandable'] = {
  expandedRowRender: (rec) => (rec.s ? <IndividualRowDetail id={rec.s} /> : null),
};

const ManageColumnCheckbox = ({
  c,
  shownColumns,
  setShownColumns,
}: {
  c: SearchTableColumnType;
  shownColumns: Set<SearchTableColumnType>;
  setShownColumns: (fn: (sc: Set<SearchTableColumnType>) => Set<SearchTableColumnType>) => void;
}) => {
  const t = useTranslationFn();
  return (
    <Checkbox
      checked={shownColumns.has(c)}
      onChange={(e) =>
        setShownColumns(
          (sc) => new Set<SearchTableColumnType>(e.target.checked ? [...sc, c] : [...sc].filter((v) => v !== c))
        )
      }
    >
      {t(SEARCH_TABLE_COLUMNS[c].tKey, T_SINGULAR_COUNT)}
    </Checkbox>
  );
};

const SearchResultsTablePage = ({ entity, onBack }: { entity: BentoEntity; onBack?: () => void }) => {
  const t = useTranslationFn();

  const dispatch = useAppDispatch();

  const selectedScope = useSelectedScope();
  const isSmallScreen = useSmallScreen();
  const authHeader = useAuthorizationHeader();
  const { projectsByID, datasetsByID } = useMetadata();

  const { page, pageSize, matches, totalMatches, matchesStatus } = useSearchQuery();
  const { fetchingPermission: fetchingCanDownload, hasPermission: canDownload } = useScopeDownloadData();

  const projectColumnAllowed = !selectedScope.scope.project;
  const datasetColumnAllowed = !selectedScope.scope.dataset;

  const [columnModalOpen, setColumnModalOpen] = useState<boolean>(false);
  const [shownColumns, setShownColumns] = useState<Set<SearchTableColumnType>>(() => {
    const initial = new Set<SearchTableColumnType>();
    if (projectColumnAllowed) initial.add('project');
    if (datasetColumnAllowed) initial.add('dataset');
    return initial;
  });

  const [exporting, setExporting] = useState<boolean>(false);

  useEffect(() => {
    // TODO
    dispatch(fetchDiscoveryMatches());
  }, [dispatch, page, pageSize, entity]);

  useEffect(() => {
    // If the selected scope changes, some of the currently-shown columns may no longer be valid:
    setShownColumns((oldSet) => {
      const newSet = new Set<SearchTableColumnType>(
        [...oldSet].filter(
          (v) => !(v === 'project' && !projectColumnAllowed) && !(v === 'dataset' && !datasetColumnAllowed)
        )
      );

      // Don't change object if our newly-computed object is equivalent:
      return setEquals(oldSet, newSet) ? oldSet : newSet;
    });
  }, [selectedScope, projectColumnAllowed, datasetColumnAllowed, shownColumns]);

  const currentStart = totalMatches > 0 ? page * pageSize + 1 : 0;
  const currentEnd = Math.min((page + 1) * pageSize, totalMatches);

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

  const columns = useMemo<TableColumnsType<DiscoveryMatchPhenopacket>>(
    () => [
      {
        dataIndex: 's',
        title: 'Subject ID',
        render: (id: string | undefined) => (id ? <IndividualPortalLink id={id}>{id}</IndividualPortalLink> : null),
      },
      {
        dataIndex: 'b',
        title: 'Biosamples',
        // TODO
        render: (b: DiscoveryMatchBiosample[]) => b.map((bb) => bb.id).join(', '),
      },
      ...Object.entries(SEARCH_TABLE_COLUMNS)
        .filter(([k, _]) => shownColumns.has(k as SearchTableColumnType))
        .map(([_, { tKey, dataIndex, render }]) => ({
          title: t(tKey, T_SINGULAR_COUNT),
          dataIndex,
          render: render(searchContext),
        })),
    ],
    [t, shownColumns, searchContext]
  );

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
        dispatch(setMatchesPage(page - 1)); // AntD page is 1-indexed, discovery match page is 0-indexed
        dispatch(setMatchesPageSize(pageSize));
      },
    }),
    [dispatch, page, pageSize, totalMatches, isSmallScreen]
  );

  const openColumnModal = useCallback(() => setColumnModalOpen(true), []);
  const onExport = useCallback(() => {
    setExporting(true);
    downloadIndividualCSV(
      authHeader,
      (matches ?? []).filter(({ s }) => s !== undefined).map(({ s }) => s as string)
    ).finally(() => setExporting(false));
  }, [authHeader, matches]);

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
        <Table<DiscoveryMatchPhenopacket>
          columns={columns}
          dataSource={matches}
          loading={WAITING_STATES.includes(matchesStatus)}
          rowKey="id"
          bordered={true}
          size="small"
          pagination={pagination}
          expandable={INDIVIDUAL_EXPANDABLE}
        />
      </Col>
      <Modal
        open={columnModalOpen}
        onCancel={() => setColumnModalOpen(false)}
        title={t('search.manage_columns')}
        footer={null}
      >
        <Space direction="vertical">
          {projectColumnAllowed && (
            <ManageColumnCheckbox c="project" shownColumns={shownColumns} setShownColumns={setShownColumns} />
          )}
          {datasetColumnAllowed && (
            <ManageColumnCheckbox c="dataset" shownColumns={shownColumns} setShownColumns={setShownColumns} />
          )}
        </Space>
      </Modal>
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
