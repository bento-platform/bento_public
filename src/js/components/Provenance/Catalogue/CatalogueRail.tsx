import { useRef, useState } from 'react';
import clsx from 'clsx';
import { Input } from 'antd';
import type { FacetOption } from '@/features/catalogue/types';
import { useAppDispatch } from '@/hooks';
import { useCatalogueState } from '@/features/catalogue/hooks';
import { toggleFacetCollapse, type FacetId } from '@/features/catalogue/catalogue.store';
import { useCatalogueUrlActions } from '@/features/catalogue/useCatalogueUrlSync';
import { useTranslationFn } from '@/hooks';
import { facetTranslationKey } from '@/features/catalogue/utils';
import { CloseOutlined, SearchOutlined } from '@ant-design/icons';
import FilterChip from '@/components/Util/FilterChip';
import Sidebar, { SidebarFacet, SidebarSection } from '@/components/Sidebar/Sidebar';
import { T_PLURAL_COUNT } from '@/constants/i18n';
import { FACETS } from '@/features/catalogue/facetRegistry';

interface FacetConfig {
  id: FacetId;
  scroll?: boolean;
}

interface FacetSectionProps {
  facet: FacetConfig;
  options: FacetOption[];
  collapsed: boolean;
  onToggleCollapse: () => void;
  onToggleValue: (value: string) => void;
}

const FacetSection = ({ facet, options, collapsed, onToggleCollapse, onToggleValue }: FacetSectionProps) => {
  const t = useTranslationFn();
  const label = t(facetTranslationKey(facet.id), T_PLURAL_COUNT);

  const [query, setQuery] = useState('');
  const chipsRef = useRef<HTMLDivElement>(null);

  if (options.length === 0) return null;

  const searchable = !!facet.scroll;
  const trimmedQuery = query.trim().toLowerCase();
  const filteredOptions =
    searchable && trimmedQuery ? options.filter((o) => o.label.toLowerCase().includes(trimmedQuery)) : options;

  return (
    <SidebarFacet headerId={facet.id} label={label} collapsed={collapsed} onToggleCollapse={onToggleCollapse}>
      {searchable && (
        <div className="facet-search">
          <Input
            size="small"
            allowClear
            prefix={<SearchOutlined aria-hidden="true" />}
            placeholder={t('catalogue.rail.search_placeholder')}
            aria-label={t('catalogue.rail.search_label', { facet: label })}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              if (chipsRef.current) chipsRef.current.scrollTop = 0;
            }}
          />
          {trimmedQuery && (
            <span className="facet-search__count" aria-live="polite">
              {t('catalogue.rail.search_matches', { count: filteredOptions.length })}
            </span>
          )}
        </div>
      )}
      <div
        ref={chipsRef}
        tabIndex={facet.scroll ? 0 : undefined}
        role={facet.scroll ? 'group' : undefined}
        aria-labelledby={facet.scroll ? `catalogue-facet-${facet.id}` : undefined}
        className={clsx('facet-chips', facet.scroll && 'facet-chips--scroll focus-ring')}
      >
        {searchable && trimmedQuery && filteredOptions.length === 0 ? (
          <span className="facet-chips__empty">{t('catalogue.rail.search_no_matches')}</span>
        ) : (
          filteredOptions.map(({ value, label: chipLabel, count, selected }) => (
            <FilterChip
              key={value}
              label={chipLabel}
              count={count}
              selected={selected}
              onChange={() => onToggleValue(value)}
            />
          ))
        )}
      </div>
    </SidebarFacet>
  );
};

interface CatalogueRailProps {
  totalCount: number;
  facetOptions: (facetId: FacetId) => { value: string; label: string; count: number; selected: boolean }[];
  /** Below the `lg` breakpoint, the rail renders as a slide-over drawer instead of an inline sticky column. */
  overlay: boolean;
  /** Ignored when `overlay` is false (the rail is always visible inline on desktop). */
  open: boolean;
  onClose: () => void;
}

const CatalogueRail = ({ totalCount, facetOptions, overlay, open, onClose }: CatalogueRailProps) => {
  const t = useTranslationFn();
  const dispatch = useAppDispatch();
  const { collapsedFacets } = useCatalogueState();
  const { toggleFacetValue } = useCatalogueUrlActions();

  return (
    <Sidebar style={{ width: 236 }} overlay={overlay} open={open} onClose={onClose}>
      <SidebarSection
        sectionTitle={t('catalogue.rail.title')}
        extra={
          overlay ? (
            <button className="sidebar__close" onClick={onClose} aria-label={t('catalogue.rail.close')}>
              <CloseOutlined />
            </button>
          ) : (
            <span>
              {totalCount} {t('entities.dataset', { count: totalCount }).toLowerCase()}
            </span>
          )
        }
      >
        {FACETS.map((facet) => (
          <FacetSection
            key={facet.id}
            facet={facet}
            options={facetOptions(facet.id)}
            collapsed={collapsedFacets.includes(facet.id)}
            onToggleCollapse={() => dispatch(toggleFacetCollapse(facet.id))}
            onToggleValue={(value) => toggleFacetValue(facet.id, value)}
          />
        ))}
      </SidebarSection>
    </Sidebar>
  );
};

export default CatalogueRail;
