import type { ReactNode } from 'react';
import { DownOutlined } from '@ant-design/icons';
import type { SectionId } from '@/components/Provenance/Modal/types';
import { useTranslationFn } from '@/hooks';

export type SectionHeadProps = {
  title: string;
  count?: number;
  collapsed: boolean;
  onToggle: () => void;
};

export const SectionHead = ({ title, count, collapsed, onToggle }: SectionHeadProps) => (
  <button type="button" className="pm-sec-head" onClick={onToggle}>
    <DownOutlined className="pm-sec-chevron" style={collapsed ? { transform: 'rotate(-90deg)' } : undefined} />
    <h2>{title}</h2>
    {count !== undefined && <span className="pm-sec-cnt">{count}</span>}
  </button>
);

export type ProvenanceSectionProps = Omit<SectionHeadProps, 'title'> & { sectionId: SectionId; children: ReactNode };

const ProvenanceSection = ({ count, collapsed, onToggle, sectionId, children }: ProvenanceSectionProps) => {
  const t = useTranslationFn();
  const title = t(`provenance.sections.${sectionId}`);
  return (
    <section id={sectionId} className={`pm-sec${collapsed ? ' collapsed' : ''}`}>
      <SectionHead title={title} count={count} collapsed={collapsed} onToggle={onToggle} />
      <div className="pm-sec-body">{children}</div>
    </section>
  );
};

export default ProvenanceSection;
