import React from 'react';
import { Row, Col, Divider, Typography } from 'antd';
import { Phenopacket } from '@/types/clinPhen/phenopacket';
import { sectionSpecs, SectionKey } from './compactView.registry';

interface CompactViewProps {
  phenopacket: Phenopacket;
}

const CompactView = ({ phenopacket }: CompactViewProps) => {
  // split by column and sort by order
  const left = Object.entries(sectionSpecs)
    .filter(([, spec]) => spec.column === 0)
    .sort((a, b) => (a[1].order ?? 0) - (b[1].order ?? 0)) as [SectionKey, (typeof sectionSpecs)[SectionKey]][];

  const right = Object.entries(sectionSpecs)
    .filter(([, spec]) => spec.column === 1)
    .sort((a, b) => (a[1].order ?? 0) - (b[1].order ?? 0)) as [SectionKey, (typeof sectionSpecs)[SectionKey]][];

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

  return (
    <Row gutter={28} style={{ fontSize: '12px' }}>
      <Col>{left.map(renderBlock)}</Col>
      <Col>{right.map(renderBlock)}</Col>
    </Row>
  );
};

export default CompactView;
