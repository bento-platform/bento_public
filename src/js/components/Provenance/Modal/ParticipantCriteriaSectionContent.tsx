import { ExportOutlined } from '@ant-design/icons';

import type { ParticipantCriteria, ParticipantCriterionType } from '@/types/dataset';
import { useTranslationFn } from '@/hooks';

const CRIT_CLASS: Record<ParticipantCriterionType, string> = {
  Inclusion: 'pm-crit-inc',
  Exclusion: 'pm-crit-exc',
  Other: 'pm-crit-oth',
};

type ParticipantCriteriaSectionContentProps = { criteria: ParticipantCriteria[] };

const ParticipantCriteriaSectionContent = ({ criteria }: ParticipantCriteriaSectionContentProps) => {
  const t = useTranslationFn();
  return (
    <table className="pm-ptable">
      <thead>
        <tr>
          <th style={{ width: 120 }}>{t('general.type')}</th>
          <th>{t('general.description')}</th>
          <th style={{ width: 90 }}>{t('general.source')}</th>
        </tr>
      </thead>
      <tbody>
        {criteria.map((c, i) => (
          <tr key={i}>
            <td>
              <span className={`pm-crit-type ${CRIT_CLASS[c.type]}`}>{c.type}</span>
            </td>
            <td>{c.description}</td>
            <td>
              {c.link ? (
                <a href={c.link} target="_blank" rel="noreferrer">
                  {t('provenance.protocol')} <ExportOutlined style={{ fontSize: 11 }} />
                </a>
              ) : (
                '—'
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default ParticipantCriteriaSectionContent;
