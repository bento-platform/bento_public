import { useState } from 'react';
import { DownOutlined } from '@ant-design/icons';

import { useTranslationFn } from '@/hooks';
import type { Dataset } from '@/types/dataset';
import { OntologyChip, SectionHead } from './cards';

type SummarySectionProps = {
  dataset: Dataset;
  collapsed: boolean;
  onToggle: () => void;
};

const SummarySection = ({ dataset, collapsed, onToggle }: SummarySectionProps) => {
  const t = useTranslationFn();
  const [longDescExpanded, setLongDescExpanded] = useState(false);

  const keywords = dataset.keywords ?? [];
  const taxa = dataset.taxa ?? [];

  return (
    <section id="summary" className={`pm-sec${collapsed ? ' collapsed' : ''}`}>
      <SectionHead title="Summary" collapsed={collapsed} onToggle={onToggle} />
      <div className="pm-sec-body">
        <p className="pm-lede">{t(dataset.description)}</p>
        {dataset.long_description && (
          <>
            <div className={`pm-longdesc${longDescExpanded ? '' : ' clipped'}`}>
              {dataset.long_description.content_type === 'text/html' ? (
                <div dangerouslySetInnerHTML={{ __html: dataset.long_description.content }} />
              ) : (
                <p>{dataset.long_description.content}</p>
              )}
            </div>
            <button
              type="button"
              className={`pm-expand-btn${longDescExpanded ? ' open' : ''}`}
              onClick={() => setLongDescExpanded((v) => !v)}
            >
              {longDescExpanded ? 'Show less' : 'Show full description'}
              <DownOutlined />
            </button>
          </>
        )}
        {(keywords.length > 0 || taxa.length > 0 || dataset.domain?.length || dataset.program_name || dataset.study_status || dataset.study_context) && (
          <div className="pm-meta-grid">
            {keywords.length > 0 && (
              <div className="pm-field">
                <span className="pm-field-k">Keywords</span>
                <div className="pm-chips">
                  {keywords.map((k, i) => <OntologyChip key={i} item={k} variant="kw" />)}
                </div>
              </div>
            )}
            {taxa.length > 0 && (
              <div className="pm-field">
                <span className="pm-field-k">Taxa</span>
                <div className="pm-chips">
                  {taxa.map((k, i) => <OntologyChip key={i} item={k} variant="taxa" />)}
                </div>
              </div>
            )}
            {dataset.domain && dataset.domain.length > 0 && (
              <div className="pm-field">
                <span className="pm-field-k">Domain</span>
                <div className="pm-chips">
                  {dataset.domain.map((d, i) => (
                    <span key={i} className="pm-chip pm-chip-dom">{d}</span>
                  ))}
                </div>
              </div>
            )}
            {dataset.program_name && (
              <div className="pm-field">
                <span className="pm-field-k">Program</span>
                <span className="pm-field-v">{dataset.program_name}</span>
              </div>
            )}
            {dataset.study_status && (
              <div className="pm-field">
                <span className="pm-field-k">Study status</span>
                <span className="pm-field-v">{dataset.study_status === 'ONGOING' ? 'Ongoing' : 'Completed'}</span>
              </div>
            )}
            {dataset.study_context && (
              <div className="pm-field">
                <span className="pm-field-k">Study context</span>
                <span className="pm-field-v">{dataset.study_context === 'CLINICAL' ? 'Clinical' : 'Research'}</span>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default SummarySection;
