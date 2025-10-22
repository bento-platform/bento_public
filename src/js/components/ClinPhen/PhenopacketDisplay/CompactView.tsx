import { Collapse } from 'antd';
import { Phenopacket } from '@/types/clinPhen/phenopacket';
import { sectionSpecs, SectionKey } from './compactView.registry';
import { useSearchParams } from 'react-router-dom';
import { useTranslationFn } from '@/hooks';

const qk = 'collapse';

const seriazlizeKeys = (keys: SectionKey[], prev: URLSearchParams | null = null): URLSearchParams => {
  const keyString = keys.join(',');
  const previous = prev ? prev.toString() : '';
  const returnVal = new URLSearchParams(previous);
  returnVal.set(qk, keyString);
  return returnVal;
};

const deseriazlizeKeys = (params: URLSearchParams): SectionKey[] => {
  const queryVals = params.get(qk);
  const keyArray = queryVals?.split(',') as SectionKey[];
  return keyArray;
};

interface CompactViewProps {
  phenopacket: Phenopacket;
}

const CompactView = ({ phenopacket }: CompactViewProps) => {
  const [open, setOpen] = useSearchParams(seriazlizeKeys(['subject']));
  const t = useTranslationFn();

  const handleCollapseChange = (e: string[]) => {
    setOpen(seriazlizeKeys(e as SectionKey[], open));
  };

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
    <div id="compact-view">
      <Collapse items={items} activeKey={deseriazlizeKeys(open)} onChange={handleCollapseChange} />
    </div>
  );
};

export default CompactView;
