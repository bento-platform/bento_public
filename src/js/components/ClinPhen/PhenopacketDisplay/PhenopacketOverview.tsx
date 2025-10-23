import { useCallback } from 'react';
import { Collapse } from 'antd';
import type { Phenopacket } from '@/types/clinPhen/phenopacket';
import type { SectionKey } from './phenopacketOverview.registry';
import { sectionSpecs } from './phenopacketOverview.registry';
import { useSearchParams } from 'react-router-dom';
import { useTranslationFn } from '@/hooks';

export const qk = 'collapse';

const serializeKeys = (keys: SectionKey[], prev: URLSearchParams | null = null): URLSearchParams => {
  const keyString = keys.join(',');
  const previous = prev ? prev.toString() : '';
  const returnVal = new URLSearchParams(previous);
  returnVal.set(qk, keyString);
  return returnVal;
};

const deserializeKeys = (params: URLSearchParams): SectionKey[] => {
  const queryVals = params.get(qk);
  const keyArray = queryVals?.split(',') as SectionKey[];
  return keyArray;
};

interface CompactViewProps {
  phenopacket: Phenopacket;
}

const PhenopacketOverview = ({ phenopacket }: CompactViewProps) => {
  const [open, setOpen] = useSearchParams(serializeKeys(['subject']));
  const t = useTranslationFn();

  const handleCollapseChange = useCallback(
    (e: string[]) => {
      setOpen(serializeKeys(e as SectionKey[], open), { replace: true });
    },
    [open, setOpen]
  );

  const sections = Object.entries(sectionSpecs).sort((a, b) => (a[1].order ?? 0) - (b[1].order ?? 0)) as [
    SectionKey,
    (typeof sectionSpecs)[SectionKey],
  ][];

  const renderItem = ([key, spec]: [SectionKey, (typeof sectionSpecs)[SectionKey]]) => {
    const enabled = typeof spec.enabled === 'function' ? spec.enabled(phenopacket) : spec.enabled;
    if (!enabled) return null;
    return {
      key,
      label: <b>{t(spec.titleTranslationKey)}</b>,
      children: spec.render(phenopacket),
    };
  };

  const items = sections.map(renderItem).filter((block) => !!block);

  return (
    <Collapse className="compact" items={items} activeKey={deserializeKeys(open)} onChange={handleCollapseChange} />
  );
};

export default PhenopacketOverview;
