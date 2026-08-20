import clsx from 'clsx';
import type { FacetOption } from '@/features/catalogue/types';
import { useAppDispatch } from '@/hooks';
import { useCatalogueState } from '@/features/catalogue/hooks';
import { toggleFacetCollapse, type FacetId } from '@/features/catalogue/catalogue.store';
import { useCatalogueUrlActions } from '@/features/catalogue/useCatalogueUrlSync';
import { useTranslationFn } from '@/hooks';
import { facetTranslationKey } from '@/features/catalogue/utils';
import { CloseOutlined } from '@ant-design/icons';
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

  if (options.length === 0) return null;

  return (
    <SidebarFacet
      headerId={facet.id}
      label={t(facetTranslationKey(facet.id), T_PLURAL_COUNT)}
      collapsed={collapsed}
      onToggleCollapse={onToggleCollapse}
    >
      <div
        tabIndex={facet.scroll ? 0 : undefined}
        role={facet.scroll ? 'group' : undefined}
        aria-labelledby={facet.scroll ? `catalogue-facet-${facet.id}` : undefined}
        className={clsx('facet-chips', facet.scroll && 'facet-chips--scroll focus-ring')}
      >
        {options.map(({ value, label, count, selected }) => (
          <FilterChip
            key={value}
            label={label}
            count={count}
            selected={selected}
            onChange={() => onToggleValue(value)}
          />
        ))}
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
