import { useCallback, useImperativeHandle, forwardRef } from 'react';
import { Collapse } from 'antd';
import type { Phenopacket } from '@/types/clinPhen/phenopacket';
import type { SectionKey, SectionSpec } from './phenopacketOverview.registry';
import { SECTION_SPECS } from './phenopacketOverview.registry';
import { useSearchParams } from 'react-router-dom';
import { useTranslationFn } from '@/hooks';

export const PHENOPACKET_EXPANDED_URL_QUERY_KEY = 'expanded';

const serializeKeys = (keys: SectionKey[], prev: URLSearchParams | null = null): URLSearchParams => {
  const keyString = keys.join(',');
  const previous = prev ? prev.toString() : '';
  const returnVal = new URLSearchParams(previous);
  returnVal.set(PHENOPACKET_EXPANDED_URL_QUERY_KEY, keyString);
  return returnVal;
};

const deserializeKeys = (params: URLSearchParams): SectionKey[] => {
  const queryVals = params.get(PHENOPACKET_EXPANDED_URL_QUERY_KEY);
  return queryVals?.split(',') as SectionKey[];
};

export type CollapseHandle = {
  expandAll: () => void;
  collapseAll: () => void;
};

interface PhenopacketOverviewProps {
  phenopacket: Phenopacket;
}

const PhenopacketOverview = forwardRef<CollapseHandle, PhenopacketOverviewProps>(({ phenopacket }, ref) => {
  const [open, setOpen] = useSearchParams(serializeKeys(['subject']));
  const t = useTranslationFn();

  const handleCollapseChange = useCallback(
    (e: string[]) => {
      setOpen(serializeKeys(e as SectionKey[], open), { replace: true });
    },
    [open, setOpen]
  );

  const sections = Object.entries(SECTION_SPECS).sort((a, b) => (a[1].order ?? 0) - (b[1].order ?? 0)) as [
    SectionKey,
    SectionSpec,
  ][];

  const renderItem = ([key, spec]: [SectionKey, SectionSpec]) => {
    const enabled = typeof spec.enabled === 'function' ? spec.enabled(phenopacket) : spec.enabled;
    if (!enabled) return null;
    const itemCount = spec.itemCount?.(phenopacket);
    return {
      key,
      label: (
        <strong style={{ fontSize: '16px', borderTop: '10px' }}>
          {t(spec.titleTranslationKey)}
          {itemCount ? ` (${itemCount})` : null}
        </strong>
      ),
      children: spec.render(phenopacket),
    };
  };

  const items = sections.map(renderItem).filter((block) => !!block);

  const expandAll = useCallback(() => {
    setOpen(
      serializeKeys(
        items.map((i) => i.key),
        open
      ),
      { replace: true }
    );
  }, [items, open, setOpen]);

  const collapseAll = useCallback(() => {
    setOpen(serializeKeys([], open), { replace: true });
  }, [open, setOpen]);

  useImperativeHandle(ref, () => ({ expandAll, collapseAll }), [expandAll, collapseAll]);

  return (
    <Collapse
      className="compact"
      items={items}
      activeKey={deserializeKeys(open)}
      onChange={handleCollapseChange}
      ghost
    />
  );
});

PhenopacketOverview.displayName = 'PhenopacketOverview';

export default PhenopacketOverview;
