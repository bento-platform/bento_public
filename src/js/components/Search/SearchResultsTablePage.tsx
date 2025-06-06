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
} from 'antd';
import { ExportOutlined, LeftOutlined, TableOutlined } from '@ant-design/icons';

import { PORTAL_URL } from '@/config';
import { T_SINGULAR_COUNT } from '@/constants/i18n';
import { useTranslationFn } from '@/hooks';
import { useSmallScreen } from '@/hooks/useResponsiveContext';

import IndividualRowDetail from './IndividualRowDetail';
import type { DiscoveryResults } from '@/types/data';
import type { Project, Dataset } from '@/types/metadata';
import { useMetadata, useSelectedScope } from '@/features/metadata/hooks';
import type { KatsuIndividualMatch } from '@/features/search/types';
import DatasetProvenanceModal from '@/components/Provenance/DatasetProvenanceModal';
import ProjectTitle from '@/components/Util/ProjectTitle';
import DatasetTitle from '@/components/Util/DatasetTitle';
import { downloadIndividualCSV } from '@/utils/export';
import { setEquals } from '@/utils/sets';

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

const INDIVIDUAL_EXPANDABLE: TableProps<KatsuIndividualMatch>['expandable'] = {
  expandedRowRender: (rec) => <IndividualRowDetail id={rec.id} />,
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

const SearchResultsTablePage = ({
  results,
  entity,
  onBack,
}: {
  results: DiscoveryResults;
  entity: 'individual' | 'biosample' | 'experiment';
  onBack: () => void;
}) => {
  const t = useTranslationFn();
  const selectedScope = useSelectedScope();
  const isSmallScreen = useSmallScreen();
  const authHeader = useAuthorizationHeader();
  const { projectsByID, datasetsByID } = useMetadata();

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

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

  let { individualMatches } = results;
  individualMatches = individualMatches ?? [];

  const currentStart = individualMatches.length > 0 ? page * pageSize - pageSize + 1 : 0;
  const currentEnd = Math.min(page * pageSize, individualMatches.length);

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

  const columns = useMemo<TableColumnsType<KatsuIndividualMatch>>(
    () => [
      {
        dataIndex: 'id',
        title: 'ID',
        render: (id: string) => <IndividualPortalLink id={id}>{id}</IndividualPortalLink>,
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
      current: page,
      pageSize,
      position: (isSmallScreen ? ['bottomCenter'] : ['bottomRight']) as TablePaginationConfig['position'],
      size: (isSmallScreen ? 'small' : 'default') as TablePaginationConfig['size'],
      showSizeChanger: true,
      onChange(page, pageSize) {
        setPage(page);
        setPageSize(pageSize);
      },
    }),
    [page, pageSize, isSmallScreen]
  );

  const openColumnModal = useCallback(() => setColumnModalOpen(true), []);
  const onExport = useCallback(() => {
    setExporting(true);
    downloadIndividualCSV(
      authHeader,
      individualMatches.map(({ id }) => id)
    ).finally(() => setExporting(false));
  }, [authHeader, individualMatches]);

  return (
    <>
      <Col xs={24} lg={20}>
        <Flex justify="space-between" align="center" style={{ marginBottom: 8 }}>
          <Button
            icon={<LeftOutlined />}
            type={isSmallScreen ? 'default' : 'link'}
            onClick={onBack}
            style={{ paddingLeft: 0 }}
          >
            {isSmallScreen ? '' : t('Charts')}
          </Button>
          <span>
            {t('search.showing_entities' + (isSmallScreen ? '_short' : ''), {
              entity: `$t(entities.${entity}_other, lowercase)`,
              start: currentStart,
              end: currentEnd,
              total: individualMatches.length,
            })}
          </span>
          <Space>
            <Tooltip title={t('search.manage_columns')}>
              <Button icon={<TableOutlined />} onClick={openColumnModal} />
            </Tooltip>
            <Button icon={<ExportOutlined />} loading={exporting} onClick={onExport}>
              {isSmallScreen ? t('search.csv') : t('search.export_csv')}
            </Button>
          </Space>
        </Flex>
        <Table<KatsuIndividualMatch>
          columns={columns}
          dataSource={individualMatches}
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
