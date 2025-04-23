import { useMemo, useState } from 'react';
import { Button, Col, Flex, Table, type TableColumnsType, type TablePaginationConfig, type TableProps } from 'antd';
import { ExportOutlined, LeftOutlined } from '@ant-design/icons';

import { PORTAL_URL } from '@/config';
import { T_SINGULAR_COUNT } from '@/constants/i18n';
import { useTranslationFn } from '@/hooks';
import { useSmallScreen } from '@/hooks/useResponsiveContext';

import IndividualRowDetail from './IndividualRowDetail';
import type { DiscoveryResults } from '@/types/data';
import { useSelectedScope } from '@/features/metadata/hooks';

type IndividualResultRow = { id: string };

const IndividualPortalLink = ({ id }: IndividualResultRow) => (
  <a href={`${PORTAL_URL}/data/explorer/individuals/${id}`} target="_blank" rel="noreferrer">
    <ExportOutlined />
  </a>
);

const INDIVIDUAL_EXPANDABLE: TableProps<IndividualResultRow>['expandable'] = {
  expandedRowRender: (rec) => <IndividualRowDetail id={rec.id} />,
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

  const columns = useMemo<TableColumnsType<IndividualResultRow>>(
    () => [
      { dataIndex: 'id', title: 'ID' },
      // TODO: implement these when we have this information in search results:
      ...(!selectedScope.scope.project ? [{ title: t('entities.project', T_SINGULAR_COUNT), key: 'project' }] : []),
      ...(!selectedScope.scope.dataset ? [{ title: t('entities.dataset', T_SINGULAR_COUNT), key: 'dataset' }] : []),
      {
        title: '',
        key: 'actions',
        width: 32,
        render: ({ id }) => <IndividualPortalLink id={id} />,
      },
    ],
    [t, selectedScope]
  );

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // noinspection JSUnusedGlobalSymbols
  const pagination = useMemo<TablePaginationConfig>(
    () => ({
      current: page,
      pageSize,
      align: 'end',
      size: 'default',
      showSizeChanger: true,
      onChange(page, pageSize) {
        setPage(page);
        setPageSize(pageSize);
      },
    }),
    [page, pageSize]
  );

  const { individualMatches } = results;
  const individualTableData = useMemo<IndividualResultRow[]>(
    () => (individualMatches ?? []).map((id) => ({ id })),
    [individualMatches]
  );

  const currentStart = individualTableData.length > 0 ? page * pageSize - pageSize + 1 : 0;
  const currentEnd = Math.min(page * pageSize, individualTableData.length);

  return (
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
          {t('search.showing_entities', {
            entity: `$t(entities.${entity}_other, lowercase)`,
            start: currentStart,
            end: currentEnd,
            total: individualTableData.length,
          })}
        </span>
        {/* TODO: only if in Bento search not beacon */}
        <Button icon={<ExportOutlined />} onChange={() => alert('TODO')}>
          {isSmallScreen ? t('search.csv') : t('search.export_csv')}
        </Button>
      </Flex>
      <Table<IndividualResultRow>
        columns={columns}
        dataSource={individualTableData}
        rowKey="id"
        bordered={true}
        size="small"
        pagination={pagination}
        expandable={INDIVIDUAL_EXPANDABLE}
      />
    </Col>
  );
};

export default SearchResultsTablePage;
