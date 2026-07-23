import clsx from 'clsx';
import { useAppDispatch } from '@/hooks';
import { useCatalogueState } from '@/features/catalogue/hooks';
import { toggleFacetCollapse, type FacetId } from '@/features/catalogue/catalogue.store';
import { useCatalogueUrlActions } from '@/features/catalogue/useCatalogueUrlSync';
import { useTranslationFn } from '@/hooks';
import { statusTranslationKey, facetTranslationKey } from '@/features/catalogue/hooks';
import { CloseOutlined } from '@ant-design/icons';
import FilterChip from '@/components/Util/FilterChip';
import Sidebar, { SidebarFacet, SidebarSection } from '@/components/Sidebar/Sidebar';

interface FacetConfig {
  id: FacetId;
  scroll?: boolean;
}

const FACETS: FacetConfig[] = [
  { id: 'projects' },
  { id: 'dataTypes', scroll: true },
  { id: 'taxa' },
  { id: 'access' },
  { id: 'licenses' },
  { id: 'statuses' },
  { id: 'keywords', scroll: true },
];

interface FacetSectionProps {
  facet: FacetConfig;
  options: { value: string; count: number; selected: boolean }[];
  collapsed: boolean;
  onToggleCollapse: () => void;
  onToggleValue: (value: string) => void;
}

const FacetSection = ({ facet, options, collapsed, onToggleCollapse, onToggleValue }: FacetSectionProps) => {
  const t = useTranslationFn();
  if (options.length === 0) return null;

  return (
    <SidebarFacet label={t(facetTranslationKey(facet.id))} collapsed={collapsed} onToggleCollapse={onToggleCollapse}>
      <div className={clsx('facet-chips', facet.scroll && 'facet-chips--scroll')}>
        {options.map(({ value, count, selected }) => (
          <FilterChip
            key={value}
            label={facet.id === 'statuses' ? t(statusTranslationKey(value)) : value}
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
  facetOptions: (facetId: FacetId) => { value: string; count: number; selected: boolean }[];
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
