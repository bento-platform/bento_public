import { Collapse, Typography } from 'antd';
import { Phenopacket } from '@/types/clinPhen/phenopacket';
import { sectionSpecs, SectionKey } from './compactView.registry';

const { Title } = Typography;

interface CompactViewProps {
  phenopacket: Phenopacket;
}

const CompactView = ({ phenopacket }: CompactViewProps) => {
  const sections = Object.entries(sectionSpecs).sort((a, b) => (a[1].order ?? 0) - (b[1].order ?? 0)) as [
    SectionKey,
    (typeof sectionSpecs)[SectionKey],
  ][];

  const renderItem = ([key, spec]: [SectionKey, (typeof sectionSpecs)[SectionKey]]) => {
    const enabled = typeof spec.enabled === 'function' ? spec.enabled(phenopacket) : spec.enabled;
    if (!enabled) return null;
    return {
      key,
      label: <b>{spec.title}</b>,
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
