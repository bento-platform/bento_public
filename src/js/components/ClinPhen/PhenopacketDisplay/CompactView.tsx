import React from 'react';
import { Row, Col, Divider, Typography } from 'antd';
import { Phenopacket } from '@/types/clinPhen/phenopacket';
import { sectionSpecs, SectionKey } from './compactView.registry';

interface CompactViewProps {
  phenopacket: Phenopacket;
}

const CompactView = ({ phenopacket }: CompactViewProps) => {
  // split by column and sort by order
  const sections = Object.entries(sectionSpecs).sort((a, b) => (a[1].order ?? 0) - (b[1].order ?? 0)) as [
    SectionKey,
    (typeof sectionSpecs)[SectionKey],
  ][];

  const renderBlock = ([key, spec]: [SectionKey, (typeof sectionSpecs)[SectionKey]]) => {
    const enabled = typeof spec.enabled === 'function' ? spec.enabled(phenopacket) : spec.enabled;
    if (!enabled) return null;
    return (
      <React.Fragment key={key}>
        <Divider orientation="left" plain={false}>
          {spec.title}
        </Divider>
        {spec.render(phenopacket)}
      </React.Fragment>
    );
  };

  return <div>{sections.map(renderBlock)}</div>;
};

export default CompactView;
