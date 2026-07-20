import { useTranslationFn } from '@/hooks';
import type { Dataset } from '@/types/dataset';
import { OntologyChip } from './bits';
import DatasetDescription from './DatasetDescription';
import { statusTranslationKey, studyContextTranslationKey } from '@/features/catalogue/hooks';

type SummarySectionProps = { dataset: Dataset };

const SummarySectionContent = ({ dataset }: SummarySectionProps) => {
  const t = useTranslationFn();

  const keywords = dataset.keywords ?? [];
  const taxa = dataset.taxa ?? [];

  return (
    <>
      <DatasetDescription dataset={dataset} />
      {(keywords.length > 0 ||
        taxa.length > 0 ||
        dataset.domain?.length ||
        dataset.program_name ||
        dataset.study_status ||
        dataset.study_context) && (
        <div className="pm-meta-grid">
          {keywords.length > 0 && (
            <div className="pm-field">
              <span className="pm-field-k">{t('provenance.keywords')}</span>
              <div className="pm-chips">
                {keywords.map((k, i) => (
                  <OntologyChip key={i} item={k} variant="kw" />
                ))}
              </div>
            </div>
          )}
          {taxa.length > 0 && (
            <div className="pm-field">
              <span className="pm-field-k">{t('provenance.taxa')}</span>
              <div className="pm-chips">
                {taxa.map((k, i) => (
                  <OntologyChip key={i} item={k} variant="taxa" />
                ))}
              </div>
            </div>
          )}
          {dataset.domain && dataset.domain.length > 0 && (
            <div className="pm-field">
              <span className="pm-field-k">{t('provenance.domain')}</span>
              <div className="pm-chips">
                {dataset.domain.map((d, i) => (
                  <span key={i} className="pm-chip pm-chip-dom">
                    {d}
                  </span>
                ))}
              </div>
            </div>
          )}
          {dataset.program_name && (
            <div className="pm-field">
              <span className="pm-field-k">{t('provenance.program_name')}</span>
              <span className="pm-field-v">{dataset.program_name}</span>
            </div>
          )}
          {dataset.study_status && (
            <div className="pm-field">
              <span className="pm-field-k">{t('provenance.study_status')}</span>
              <span className="pm-field-v">{t(statusTranslationKey(dataset.study_status))}</span>
            </div>
          )}
          {dataset.study_context && (
            <div className="pm-field">
              <span className="pm-field-k">{t('provenance.study_context')}</span>
              <span className="pm-field-v">{t(studyContextTranslationKey(dataset.study_context))}</span>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default SummarySectionContent;
