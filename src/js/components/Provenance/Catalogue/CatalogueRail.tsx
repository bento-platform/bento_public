import { useCallback, useEffect, useRef, useState } from 'react';
import clsx from 'clsx';

import { Input } from 'antd';
import { CloseOutlined, SearchOutlined } from '@ant-design/icons';

import type { FacetOption } from '@/features/catalogue/types';
import { toggleFacetCollapse, type FacetId } from '@/features/catalogue/catalogue.store';

import { useAppDispatch } from '@/hooks';
import { useCatalogueState } from '@/features/catalogue/hooks';
import { useCatalogueUrlActions } from '@/features/catalogue/useCatalogueUrlSync';
import { useTranslationFn } from '@/hooks';

import { facetTranslationKey } from '@/features/catalogue/utils';
import { stripDiacritics } from '@/utils/strings';

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

const SCROLL_SHADOW_TOP_CLASS = 'scroll-shadow-top';
const SCROLL_SHADOW_BOTTOM_CLASS = 'scroll-shadow-bottom';

const updateScrollShadow = (container: HTMLDivElement, scrollOverlay: HTMLDivElement) => {
  const { scrollTop, clientHeight, scrollHeight } = container;
  scrollOverlay.classList.toggle(SCROLL_SHADOW_TOP_CLASS, scrollTop > 0);
  scrollOverlay.classList.toggle(SCROLL_SHADOW_BOTTOM_CLASS, scrollTop + clientHeight < scrollHeight);
};

const FacetSection = ({ facet, options, collapsed, onToggleCollapse, onToggleValue }: FacetSectionProps) => {
  const t = useTranslationFn();
  const label = t(facetTranslationKey(facet.id), T_PLURAL_COUNT);

  const [query, setQuery] = useState('');
  const chipsRef = useRef<HTMLDivElement>(null);
  const chipsScrollOverlayRef = useRef<HTMLDivElement>(null);

  const shadowFrame = useRef<number | null>(null);

  const onFacetChipsScroll = useCallback(() => {
    if (shadowFrame.current !== null) return; // an update is already queued for this frame
    shadowFrame.current = requestAnimationFrame(() => {
      shadowFrame.current = null;
      // Use JS for this rather than the CSS hack to make the shadow actually appear on top of container contents,
      // rather than underneath it.
      if (chipsRef.current && chipsScrollOverlayRef.current) {
        updateScrollShadow(chipsRef.current, chipsScrollOverlayRef.current);
      }
    });
  }, []);

  useEffect(() => {
    // Cancel any queued update on unmount
    return () => {
      if (shadowFrame.current !== null) cancelAnimationFrame(shadowFrame.current);
      shadowFrame.current = null;
    };
  }, []);

  useEffect(() => {
    // Recompute when the chip list changes without a scroll event (first render, late options, search narrowing)
    if (facet.scroll) onFacetChipsScroll();
  }, [facet.scroll, options.length, query, onFacetChipsScroll]);

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
        <div className="facet-search">
          <Input
            type="search"
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
      {facet.scroll && <div className="facet-chips-scroll-overlay" aria-hidden ref={chipsScrollOverlayRef} />}
      <div
        ref={chipsRef}
        /* TODO: tabindex is less-than-ideal for a11y on something that's just scrollable - we may need additional a11y
         *   handling or a message to screen-reader users that this only gets focused for the purpose of screen-users to
         *   scroll up/down.
         * TODO: investigate alternate a11y patterns rather than just a group, since we have a search box too */
        /* eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex */
        tabIndex={facet.scroll ? 0 : undefined}
        role={facet.scroll ? 'group' : undefined}
        aria-labelledby={facet.scroll ? `catalogue-facet-${facet.id}` : undefined}
        className={clsx('facet-chips', facet.scroll && 'facet-chips--scroll focus-ring')}
        onScroll={facet.scroll ? onFacetChipsScroll : undefined}
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
  facetOptions: (facetId: FacetId) => { value: string; label: string; count: number; selected: boolean }[];
  /** Below the `lg` breakpoint, the rail renders as a slide-over drawer instead of an inline sticky column. */
  overlay: boolean;
  /** Ignored when `overlay` is false (the rail is always visible inline on desktop). */
  open: boolean;
  onClose: () => void;
}

const CatalogueRail = ({ facetOptions, overlay, open, onClose }: CatalogueRailProps) => {
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
              <CloseOutlined aria-hidden />
            </button>
          ) : undefined
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
