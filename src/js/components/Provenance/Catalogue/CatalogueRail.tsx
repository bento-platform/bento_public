import clsx from 'clsx';
import { useAppDispatch } from '@/hooks';
import { useCatalogueState } from '@/features/catalogue/hooks';
import { toggleFacetValue, toggleFacetCollapse, type FacetId } from '@/features/catalogue/catalogue.store';
import { useTranslationFn } from '@/hooks';
import { CaretDownOutlined, CaretRightOutlined } from '@ant-design/icons';

interface FacetConfig {
  id: FacetId;
  title: string;
  scroll?: boolean;
}

const FACETS: FacetConfig[] = [
  { id: 'projects', title: 'Project' },
  { id: 'dataTypes', title: 'Data type' },
  { id: 'taxa', title: 'Taxa' },
  { id: 'access', title: 'Access' },
  { id: 'licenses', title: 'Data use' },
  { id: 'statuses', title: 'Status' },
  { id: 'keywords', title: 'Keywords', scroll: true },
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
        <span className="facet-head__label">{t(facet.title)}</span>
        {collapsed ? (
          <CaretRightOutlined className="facet-head__icon" />
        ) : (
          <CaretDownOutlined className="facet-head__icon" />
        )}
      </button>
      {!collapsed && (
        <div className={clsx('facet-chips', facet.scroll && 'facet-chips--scroll')}>
          {options.map(({ value, count, selected }) => (
            <button
              key={value}
              type="button"
              aria-pressed={selected}
              disabled={count === 0 && !selected}
              onClick={() => onToggleValue(value)}
              className={clsx('fchip', selected && 'fchip--on')}
            >
              <span className="fchip__label">{value}</span>
              <span className="fchip__count">{count}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

interface CatalogueRailProps {
  totalCount: number;
  facetOptions: (facetId: FacetId) => { value: string; count: number; selected: boolean }[];
}

const CatalogueRail = ({ totalCount, facetOptions }: CatalogueRailProps) => {
  const t = useTranslationFn();
  const dispatch = useAppDispatch();
  const { collapsedFacets } = useCatalogueState();

  return (
    <div className="catalogue-rail">
      <div className="catalogue-rail__header">
        <span className="catalogue-rail__title">{t('Filters')}</span>
        <span className="catalogue-rail__count">
          {totalCount} {t(totalCount === 1 ? 'dataset' : 'datasets')}
        </span>
      </div>
      <div>
        {FACETS.map((facet) => (
          <FacetSection
            key={facet.id}
            facet={facet}
            options={facetOptions(facet.id)}
            collapsed={collapsedFacets.includes(facet.id)}
            onToggleCollapse={() => dispatch(toggleFacetCollapse(facet.id))}
            onToggleValue={(value) => dispatch(toggleFacetValue({ facet: facet.id, value }))}
          />
        ))}
      </div>
    </div>
  );
};

export default CatalogueRail;
