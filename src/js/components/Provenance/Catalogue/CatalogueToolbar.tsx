import { useAppDispatch } from '@/hooks';
import { Button, Flex, Input, Select, Segmented, Tag, Typography } from 'antd';
import { AppstoreOutlined, BarsOutlined, BarChartOutlined, SearchOutlined } from '@ant-design/icons';
import { useCatalogueState } from '@/features/catalogue/hooks';
import {
  setSearch,
  setSort,
  setView,
  toggleInsights,
  toggleFacetValue,
  clearAll,
  type SortKey,
  type FacetId,
} from '@/features/catalogue/catalogue.store';
import { useTranslationFn } from '@/hooks';

const { Text } = Typography;

const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: 'updated_desc', label: 'Recently updated' },
  { value: 'created_desc', label: 'Newest created' },
  { value: 'title_az', label: 'Title A–Z' },
  { value: 'individuals_desc', label: 'Most individuals' },
  { value: 'biosamples_desc', label: 'Most biosamples' },
];

const FACET_LABELS: Record<FacetId, string> = {
  projects: 'Project',
  dataTypes: 'Data type',
  taxa: 'Taxa',
  access: 'Access',
  licenses: 'Data use',
  statuses: 'Status',
  keywords: 'Keyword',
};

interface CatalogueToolbarProps {
  filteredCount: number;
}

const CatalogueToolbar = ({ filteredCount }: CatalogueToolbarProps) => {
  const t = useTranslationFn();
  const dispatch = useAppDispatch();
  const { q, sets, sort, view, insightsOpen } = useCatalogueState();

  const activePills: { facet: FacetId; value: string; label: string }[] = [];
  (Object.entries(sets) as [FacetId, string[]][]).forEach(([facet, values]) => {
    values.forEach((v) => activePills.push({ facet, value: v, label: v }));
  });
  if (q) activePills.push({ facet: 'keywords' as FacetId, value: '__q__', label: `"${q}"` });

  const hasActive = activePills.length > 0;

  return (
    <Flex vertical gap={8}>
      {/* Row 1: search + sort + view */}
      <Flex gap={8} align="center">
        <Input
          prefix={<SearchOutlined />}
          placeholder={t('Search datasets, keywords, assays…')}
          value={q}
          onChange={(e) => dispatch(setSearch(e.target.value))}
          className="catalogue-search-input"
          allowClear
        />
        <Select<SortKey>
          value={sort}
          onChange={(v) => dispatch(setSort(v))}
          className="catalogue-sort-select"
          options={SORT_OPTIONS.map((o) => ({ value: o.value, label: t(o.label) }))}
        />
        <Segmented
          value={view}
          onChange={(v) => dispatch(setView(v as 'grid' | 'list'))}
          options={[
            { value: 'grid', icon: <AppstoreOutlined /> },
            { value: 'list', icon: <BarsOutlined /> },
          ]}
        />
      </Flex>

      {/* Row 2: result count + insights toggle */}
      <Flex justify="space-between" align="center">
        <Text>
          <span className="catalogue-count-highlight">{filteredCount}</span>{' '}
          {t(filteredCount === 1 ? 'dataset found' : 'datasets found')}
        </Text>
        <Button
          size="small"
          icon={<BarChartOutlined />}
          onClick={() => dispatch(toggleInsights())}
          type={insightsOpen ? 'primary' : 'default'}
          ghost={insightsOpen}
        >
          {insightsOpen ? t('Hide insights') : t('Show insights')}
        </Button>
      </Flex>

      {/* Row 3: active filter pills */}
      {hasActive && (
        <Flex wrap gap={4} align="center">
          {activePills.map(({ facet, value, label }) => (
            <Tag
              key={`${facet}-${value}`}
              closable
              onClose={() => {
                if (value === '__q__') {
                  dispatch(setSearch(''));
                } else {
                  dispatch(toggleFacetValue({ facet, value }));
                }
              }}
              className="catalogue-filter-tag"
            >
              <span className="catalogue-filter-tag__facet-label">{t(FACET_LABELS[facet])}:</span>
              {label}
            </Tag>
          ))}
          <Tag className="catalogue-clear-tag" onClick={() => dispatch(clearAll())}>
            {t('Clear all')}
          </Tag>
        </Flex>
      )}
    </Flex>
  );
};

export default CatalogueToolbar;
