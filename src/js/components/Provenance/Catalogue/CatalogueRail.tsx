import clsx from 'clsx';
import { useAppDispatch } from '@/hooks';
import { useCatalogueState } from '@/features/catalogue/hooks';
import { toggleFacetValue, toggleFacetCollapse, type FacetId } from '@/features/catalogue/catalogue.store';
import { useTranslationFn } from '@/hooks';
import { statusTranslationKey } from '@/features/catalogue/hooks';
import { CaretDownOutlined, CaretRightOutlined } from '@ant-design/icons';
import FilterChip from '@/components/Util/FilterChip';
import Sidebar from '@/components/Sidebar/Sidebar';

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
}

const CatalogueRail = ({ totalCount, facetOptions }: CatalogueRailProps) => {
  const t = useTranslationFn();
  const dispatch = useAppDispatch();
  const { collapsedFacets } = useCatalogueState();

  return (
    <Sidebar
      title={t('catalogue.rail.title')}
      statusText={
        <>
          {totalCount} {t('entities.dataset', { count: totalCount }).toLowerCase()}
        </>
      }
    >
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
    </Sidebar>
  );
};

export default CatalogueRail;
