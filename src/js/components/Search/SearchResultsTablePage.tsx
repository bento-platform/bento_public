import { type ReactNode, useEffect, useMemo, useState } from 'react';
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
import { useSelectedScope } from '@/features/metadata/hooks';
import type { KatsuIndividualMatch } from '@/features/search/types';
import ProjectTitle from '@/components/Util/ProjectTitle';
import DatasetTitle from '@/components/Util/DatasetTitle';

const SEARCH_TABLE_COLUMNS = {
  project: {
    tKey: 'entities.project',
    dataIndex: 'project_id',
    render: (id: string) => <ProjectTitle projectID={id} onClick={() => alert('TODO')} />,
  },
  dataset: {
    tKey: 'entities.dataset',
    dataIndex: 'dataset_id',
    render: (id: string) => <DatasetTitle datasetID={id} onClick={() => alert('TODO')} />,
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

  useEffect(() => {
    // TODO: update shownColumns if allowed changes
  }, [selectedScope]);

  let { individualMatches } = results;
  individualMatches = individualMatches ?? [];

  const currentStart = individualMatches.length > 0 ? page * pageSize - pageSize : 0;
  const currentEnd = Math.min(page * pageSize, individualMatches.length) - 1;

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
          render,
        })),
    ],
    [t, shownColumns]
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
              start: currentStart + 1,
              end: currentEnd + 1,
              total: individualMatches.length,
            })}
          </span>
          {/* TODO: only if in Bento search not beacon */}
          <Space>
            <Tooltip title={t('search.manage_columns')}>
              <Button icon={<TableOutlined />} onClick={() => setColumnModalOpen(true)} />
            </Tooltip>
            <Button icon={<ExportOutlined />} onChange={() => alert('TODO')}>
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
    </>
  );
};

export default SearchResultsTablePage;
