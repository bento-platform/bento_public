import { useEffect, useRef, useState } from 'react';
import { useAppDispatch } from '@/hooks';
import { Badge, Button, Dropdown, Flex, Input, Select, Segmented, Typography } from 'antd';
import {
  AppstoreOutlined,
  BarsOutlined,
  FilterOutlined,
  SearchOutlined,
  SwapOutlined,
  PieChartOutlined,
} from '@ant-design/icons';
import { useCatalogueState } from '@/features/catalogue/hooks';
import { toggleInsights, type SortKey, type FacetId } from '@/features/catalogue/catalogue.store';
import { useCatalogueUrlActions } from '@/features/catalogue/useCatalogueUrlSync';
import { useTranslationFn } from '@/hooks';
import ActiveFilterTags from '@/components/Util/ActiveFilterTags';
import { FACET_CONFIG_BY_ID } from '@/features/catalogue/facetRegistry';
import { facetTranslationKey, facetValueTranslationKey } from '@/features/catalogue/utils';

const { Text } = Typography;

const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: 'updated_desc', label: 'catalogue.toolbar.sort.recently_updated' },
  { value: 'created_desc', label: 'catalogue.toolbar.sort.newest_created' },
  { value: 'title_az', label: 'catalogue.toolbar.sort.title_az' },
  { value: 'individuals_desc', label: 'catalogue.toolbar.sort.most_individuals' },
  { value: 'biosamples_desc', label: 'catalogue.toolbar.sort.most_biosamples' },
];

interface CatalogueToolbarProps {
  filteredCount: number;
  /** Below the `lg` breakpoint: the rail is a slide-over drawer, sort collapses to an icon button, and the grid/list switch is hidden. */
  isMobile: boolean;
  onOpenFilters: () => void;
}

const CatalogueToolbar = ({ filteredCount, isMobile, onOpenFilters }: CatalogueToolbarProps) => {
  const t = useTranslationFn();
  const dispatch = useAppDispatch();
  const { q, sets, sort, view, insightsOpen } = useCatalogueState();
  const { setSearch, setSort, setView, toggleFacetValue, clearAll } = useCatalogueUrlActions();

  // The Input needs its own local state so typing updates the DOM synchronously (preserving
  // cursor position); `q` itself only catches up later via a URL round trip (setSearch navigates,
  // and useCatalogueUrlSync reflects the URL back into Redux on a subsequent render), which is too
  // late for the browser to keep the caret in place. `lastSentQ` distinguishes our own round-tripped
  // updates from external ones (browser back/forward, clearing a filter pill, `clearAll`), so only
  // the latter re-sync `searchInput` from `q`.
  const [searchInput, setSearchInput] = useState(q);
  const lastSentQ = useRef(q);

  useEffect(() => {
    if (q !== lastSentQ.current) {
      lastSentQ.current = q;
      setSearchInput(q);
    }
  }, [q]);

  const handleSearchChange = (value: string) => {
    setSearchInput(value);
    lastSentQ.current = value;
    setSearch(value);
  };

  const pills: { key: string; facetLabel: string; label: string; onClose: () => void }[] = [];
  (Object.entries(sets) as [FacetId, string[]][]).forEach(([facet, values]) => {
    values.forEach((v) =>
      pills.push({
        key: `${facet}-${v}`,
        facetLabel: facetTranslationKey(facet),
        label: t(facetValueTranslationKey(FACET_CONFIG_BY_ID[facet].i18nKeyPrefix, v)),
        onClose: () => toggleFacetValue(facet, v),
      })
    );
  });

  if (q) {
    pills.push({
      key: 'keywords-__q__',
      facetLabel: facetTranslationKey('keyword'),
      label: `"${q}"`,
      onClose: () => setSearch(''),
    });
  }

  return (
    <Flex vertical gap={8}>
      {/* Row 1: search + sort + view */}
      <Flex gap={8} align="center">
        {isMobile && (
          <Badge count={pills.length} size="small" offset={[-4, 4]} className="catalogue-toolbar-fixed">
            <Button icon={<FilterOutlined />} onClick={onOpenFilters}>
              {t('catalogue.rail.title')}
            </Button>
          </Badge>
        )}
        <Input
          prefix={<SearchOutlined />}
          placeholder={t('catalogue.toolbar.search_placeholder')}
          value={searchInput}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="catalogue-search-input"
          allowClear
        />
        {isMobile ? (
          <Dropdown
            trigger={['click']}
            menu={{
              selectedKeys: [sort],
              items: SORT_OPTIONS.map((o) => ({ key: o.value, label: t(o.label) })),
              onClick: ({ key }) => setSort(key as SortKey),
            }}
          >
            <Button
              className="catalogue-toolbar-fixed"
              icon={<SwapOutlined rotate={90} />}
              aria-label={t('catalogue.toolbar.sort_label')}
            />
          </Dropdown>
        ) : (
          <Select<SortKey>
            value={sort}
            onChange={(v) => setSort(v)}
            className="catalogue-sort-select"
            options={SORT_OPTIONS.map((o) => ({ value: o.value, label: t(o.label) }))}
          />
        )}
        {!isMobile && (
          <Segmented
            className="catalogue-toolbar-fixed"
            value={view}
            onChange={(v) => setView(v as 'grid' | 'list')}
            options={[
              { value: 'grid', icon: <AppstoreOutlined /> },
              { value: 'list', icon: <BarsOutlined /> },
            ]}
          />
        )}
      </Flex>

      {/* Row 2: result count + insights toggle */}
      <Flex justify="space-between" align="center">
        <Text>
          <span className="catalogue-count-highlight">{filteredCount}</span>{' '}
          {t('catalogue.toolbar.dataset_found', { count: filteredCount })}
        </Text>
        <Button
          className="insights-toggle"
          htmlType="button"
          aria-pressed={insightsOpen}
          icon={<PieChartOutlined aria-hidden="true" />}
          onClick={() => dispatch(toggleInsights())}
        >
          {insightsOpen ? t('catalogue.toolbar.hide_insights') : t('catalogue.toolbar.show_insights')}
        </Button>
      </Flex>
      {/* Row 3: active filter pills */}
      <ActiveFilterTags pills={pills} onClearAll={clearAll} />
    </Flex>
  );
};

export default CatalogueToolbar;
