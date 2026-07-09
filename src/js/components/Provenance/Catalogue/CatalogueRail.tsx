import clsx from 'clsx';
import { useAppDispatch } from '@/hooks';
import { useCatalogueState } from '@/features/catalogue/hooks';
import { toggleFacetCollapse, type FacetId } from '@/features/catalogue/catalogue.store';
import { useCatalogueUrlActions } from '@/features/catalogue/useCatalogueUrlSync';
import { useTranslationFn } from '@/hooks';
import { statusTranslationKey } from '@/features/catalogue/hooks';
import FilterChip from '@/components/Util/FilterChip';
import FacetSider, { type FacetSiderSection } from '@/components/Util/FacetSider';

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

  const sections: FacetSiderSection[] = FACETS.map((facet) => ({ facet, options: facetOptions(facet.id) }))
    .filter(({ options }) => options.length > 0)
    .map(({ facet, options }) => ({
      id: facet.id,
      label: t(`catalogue.facets.${facet.id}`),
      collapsed: collapsedFacets.includes(facet.id),
      onToggleCollapse: () => dispatch(toggleFacetCollapse(facet.id)),
      render: () => (
        <div className={clsx('facet-chips', facet.scroll && 'facet-chips--scroll')}>
          {options.map(({ value, count, selected }) => (
            <FilterChip
              key={value}
              label={facet.id === 'statuses' ? t(statusTranslationKey(value)) : value}
              count={count}
              selected={selected}
              onClick={() => toggleFacetValue(facet.id, value)}
            />
          ))}
        </div>
      ),
    }));

  return (
    <FacetSider
      title={t('catalogue.rail.title')}
      countLabel={`${totalCount} ${t('entities.dataset', { count: totalCount }).toLowerCase()}`}
      closeLabel={t('catalogue.rail.close')}
      overlay={overlay}
      open={open}
      onClose={onClose}
      sections={sections}
      classPrefix="catalogue-rail"
    />
  );
};

export default CatalogueRail;
