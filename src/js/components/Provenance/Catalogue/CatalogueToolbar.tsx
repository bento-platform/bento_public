import { useAppDispatch } from '@/hooks';
import { Button, Flex, Input, Select, Segmented, Typography } from 'antd';
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
import ActiveFilterTags from '@/components/Util/ActiveFilterTags';

const { Text } = Typography;

const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: 'updated_desc', label: 'catalogue.toolbar.sort.recently_updated' },
  { value: 'created_desc', label: 'catalogue.toolbar.sort.newest_created' },
  { value: 'title_az', label: 'catalogue.toolbar.sort.title_az' },
  { value: 'individuals_desc', label: 'catalogue.toolbar.sort.most_individuals' },
  { value: 'biosamples_desc', label: 'catalogue.toolbar.sort.most_biosamples' },
];

const FACET_LABELS: Record<FacetId, string> = {
  projects: 'catalogue.facets.projects',
  dataTypes: 'catalogue.facets.dataTypes',
  taxa: 'catalogue.facets.taxa',
  access: 'catalogue.facets.access',
  licenses: 'catalogue.facets.licenses',
  statuses: 'catalogue.facets.statuses',
  keywords: 'catalogue.facets.keywords',
};

interface CatalogueToolbarProps {
  filteredCount: number;
}

const CatalogueToolbar = ({ filteredCount }: CatalogueToolbarProps) => {
  const t = useTranslationFn();
  const dispatch = useAppDispatch();
  const { q, sets, sort, view, insightsOpen } = useCatalogueState();

  const pills: { key: string; facetLabel: string; label: string; onClose: () => void }[] = [];
  (Object.entries(sets) as [FacetId, string[]][]).forEach(([facet, values]) => {
    values.forEach((v) =>
      pills.push({
        key: `${facet}-${v}`,
        facetLabel: FACET_LABELS[facet],
        label: v,
        onClose: () => dispatch(toggleFacetValue({ facet, value: v })),
      })
    );
  });
  if (q)
    pills.push({
      key: 'keywords-__q__',
      facetLabel: FACET_LABELS['keywords'],
      label: `"${q}"`,
      onClose: () => dispatch(setSearch('')),
    });

  return (
    <Flex vertical gap={8}>
      {/* Row 1: search + sort + view */}
      <Flex gap={8} align="center">
        <Input
          prefix={<SearchOutlined />}
          placeholder={t('catalogue.toolbar.search_placeholder')}
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
          {t('catalogue.toolbar.dataset_found', { count: filteredCount })}
        </Text>
        <Button
          size="small"
          icon={<BarChartOutlined />}
          onClick={() => dispatch(toggleInsights())}
          type={insightsOpen ? 'primary' : 'default'}
          ghost={insightsOpen}
        >
          {insightsOpen ? t('catalogue.toolbar.hide_insights') : t('catalogue.toolbar.show_insights')}
        </Button>
      </Flex>

      {/* Row 3: active filter pills */}
      <ActiveFilterTags pills={pills} onClearAll={() => dispatch(clearAll())} />
    </Flex>
  );
};

export default CatalogueToolbar;
