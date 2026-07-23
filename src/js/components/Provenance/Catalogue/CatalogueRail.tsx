import clsx from 'clsx';

import { useAppDispatch } from '@/hooks';
import { useCatalogueState } from '@/features/catalogue/hooks';
import { useTranslationFn } from '@/hooks';

import { toggleFacetValue, toggleFacetCollapse, type FacetId } from '@/features/catalogue/catalogue.store';
import { statusTranslationKey } from '@/features/catalogue/hooks';

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
    <SidebarFacet label={t(`catalogue.facets.${facet.id}`)} collapsed={collapsed} onToggleCollapse={onToggleCollapse}>
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
}

const CatalogueRail = ({ totalCount, facetOptions }: CatalogueRailProps) => {
  const t = useTranslationFn();
  const dispatch = useAppDispatch();
  const { collapsedFacets } = useCatalogueState();

  return (
    <Sidebar style={{ width: 236 }}>
      <SidebarSection
        sectionTitle={t('catalogue.rail.title')}
        extra={
          <span>
            {totalCount} {t('entities.dataset', { count: totalCount }).toLowerCase()}
          </span>
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
      </SidebarSection>
    </Sidebar>
  );
};

export default CatalogueRail;
