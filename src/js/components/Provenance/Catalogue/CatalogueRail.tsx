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
import { stripDiacritics } from '@/utils/strings';

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

  const isSearchable = !!facet.scroll;
  const trimmedQuery = stripDiacritics(query.trim().toLowerCase());
  const filteredOptions =
    isSearchable && trimmedQuery
      ? options.filter((o) => stripDiacritics(o.label.toLowerCase()).includes(trimmedQuery))
      : options;

  return (
    <SidebarFacet headerId={facet.id} label={label} collapsed={collapsed} onToggleCollapse={onToggleCollapse}>
      {isSearchable && (
        <label className="facet-search">
          <span className="visually-hidden">{t('catalogue.rail.search_label', { facet: label })}</span>
          <Input
            classNames={{
              input: 'focus-ring',
              root: 'focus-ring',
            }}
            name={`facet-search-${label}`}
            type="search"
            size="small"
            allowClear
            prefix={<SearchOutlined aria-hidden />}
            placeholder={t('catalogue.rail.search_placeholder')}
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
        </label>
      )}
      <div
        ref={chipsRef}
        /* TODO: tabindex is less-than-ideal for a11y on something that's just scrollable - we may need additional a11y
         *   handling or a message to screen-reader users that this only gets focused for the purpose of screen-users to
         *   scroll up/down.
         * TODO: investigate alternate a11y patterns rather than just a group, since we have a search box too https://react-aria.adobe.com/GridList */
        /* eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex */
        tabIndex={facet.scroll ? 0 : undefined}
        role={facet.scroll ? 'group' : undefined}
        aria-labelledby={facet.scroll ? `catalogue-facet-${facet.id}` : undefined}
        className={clsx('facet-chips', facet.scroll && 'facet-chips--scroll focus-ring')}
      >
        {isSearchable && trimmedQuery && filteredOptions.length === 0 ? (
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
            <button className="sidebar__close focus-ring" onClick={onClose} aria-label={t('catalogue.rail.close')}>
              <CloseOutlined aria-hidden />
            </button>
          ) : (
            <span>
              {totalCount} {t('entities.dataset', { count: totalCount }).toLowerCase()}
            </span>
          )
        }
      >
        {overlay && (
          <span>
            <b>{totalCount}</b> {t('catalogue.toolbar.dataset_found', { count: totalCount })}
          </span>
        )}

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
