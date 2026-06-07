import { useAppDispatch } from '@/hooks';
import { Flex, Tag, Typography } from 'antd';
import { useCatalogueState } from '@/features/catalogue/hooks';
import { toggleFacetValue, toggleFacetCollapse, type FacetId } from '@/features/catalogue/catalogue.store';
import { useTranslationFn } from '@/hooks';
import { CaretDownOutlined, CaretRightOutlined } from '@ant-design/icons';
import { COLOR_TEXT_SECONDARY, COLOR_TEXT_MUTED, COLOR_BORDER, COLOR_WHITE } from './constants';

const { Text } = Typography;

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
    <div style={{ borderBottom: `1px solid ${COLOR_BORDER}`, paddingBottom: collapsed ? 0 : 8 }}>
      <button
        onClick={onToggleCollapse}
        style={{
          width: '100%',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          padding: '6px 0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Text
          style={{
            fontSize: 11.5,
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
            color: COLOR_TEXT_SECONDARY,
          }}
        >
          {t(facet.title)}
        </Text>
        {collapsed ? (
          <CaretRightOutlined style={{ fontSize: 10, color: COLOR_TEXT_MUTED }} />
        ) : (
          <CaretDownOutlined style={{ fontSize: 10, color: COLOR_TEXT_MUTED }} />
        )}
      </button>
      {!collapsed && (
        <div
          style={
            facet.scroll
              ? { maxHeight: 128, overflowY: 'auto', display: 'flex', flexWrap: 'wrap', gap: 4, paddingBottom: 4 }
              : { display: 'flex', flexWrap: 'wrap', gap: 4, paddingBottom: 4 }
          }
        >
          {options.map(({ value, count, selected }) => (
            <Tag.CheckableTag
              key={value}
              checked={selected}
              onChange={() => onToggleValue(value)}
              style={{
                borderRadius: 20,
                fontSize: 12.5,
                padding: '1px 8px',
                cursor: count === 0 && !selected ? 'not-allowed' : 'pointer',
                opacity: count === 0 && !selected ? 0.4 : 1,
                pointerEvents: count === 0 && !selected ? 'none' : 'auto',
                margin: 0,
                maxWidth: '100%',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {value}
              <span style={{ marginLeft: 4, fontSize: 11, opacity: 0.7, flexShrink: 0 }}>{count}</span>
            </Tag.CheckableTag>
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
    <div
      style={{
        width: 236,
        flexShrink: 0,
        position: 'sticky',
        top: 80,
        alignSelf: 'flex-start',
        background: COLOR_WHITE,
        borderRadius: 10,
        border: `1px solid ${COLOR_BORDER}`,
        padding: '12px 14px',
        maxHeight: 'calc(100vh - 100px)',
        overflowY: 'auto',
        overflowX: 'hidden',
      }}
    >
      <Flex justify="space-between" align="center" style={{ marginBottom: 10 }}>
        <Text style={{ fontSize: 13, fontWeight: 600 }}>{t('Filters')}</Text>
        <Text style={{ fontSize: 12, color: COLOR_TEXT_MUTED }}>
          {totalCount} {t(totalCount === 1 ? 'dataset' : 'datasets')}
        </Text>
      </Flex>
      <Flex vertical gap={0}>
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
      </Flex>
    </div>
  );
};

export default CatalogueRail;
