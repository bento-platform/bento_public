import clsx from 'clsx';
import { useAppDispatch } from '@/hooks';
import { useCatalogueState } from '@/features/catalogue/hooks';
import { toggleFacetCollapse, type FacetId } from '@/features/catalogue/catalogue.store';
import { useCatalogueUrlActions } from '@/features/catalogue/useCatalogueUrlSync';
import { useTranslationFn } from '@/hooks';
import { statusTranslationKey } from '@/features/catalogue/hooks';
import { CaretDownOutlined, CaretRightOutlined, CloseOutlined } from '@ant-design/icons';
import FilterChip from '@/components/Util/FilterChip';

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
    <div className={clsx('facet-section', !collapsed && 'facet-section--expanded')}>
      <button className="facet-head" onClick={onToggleCollapse}>
        <span className="facet-head__label">{t(`catalogue.facets.${facet.id}`)}</span>
        {collapsed ? (
          <CaretRightOutlined className="facet-head__icon" />
        ) : (
          <CaretDownOutlined className="facet-head__icon" />
        )}
      </button>
      {!collapsed && (
        <div className={clsx('facet-chips', facet.scroll && 'facet-chips--scroll')}>
          {options.map(({ value, count, selected }) => (
            <FilterChip
              key={value}
              label={facet.id === 'statuses' ? t(statusTranslationKey(value)) : value}
              count={count}
              selected={selected}
              onClick={() => onToggleValue(value)}
            />
          ))}
        </div>
      )}
    </div>
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
    <>
      {overlay && open && <div className="catalogue-rail-backdrop" onClick={onClose} aria-hidden />}
      <div className={clsx('catalogue-rail', overlay && 'catalogue-rail--overlay', open && 'catalogue-rail--open')}>
        <div className="catalogue-rail__header">
          <span className="catalogue-rail__title">{t('catalogue.rail.title')}</span>
          {overlay ? (
            <button className="catalogue-rail__close" onClick={onClose} aria-label={t('catalogue.rail.close')}>
              <CloseOutlined />
            </button>
          ) : (
            <span className="catalogue-rail__count">
              {totalCount} {t('entities.dataset', { count: totalCount }).toLowerCase()}
            </span>
          )}
        </div>
        <div>
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
        </div>
      </div>
    </>
  );
};

export default CatalogueRail;
