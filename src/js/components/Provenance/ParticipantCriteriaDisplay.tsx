import type { ParticipantCriteria } from '@/types/dataset';
import { useTranslationFn } from '@/hooks';
import BaseProvenanceTable from '@/components/Provenance/Tables/BaseProvenanceTable';

const ParticipantCriteriaDisplay = ({ criteria }: { criteria: ParticipantCriteria[] }) => {
  const t = useTranslationFn();
  return (
    <BaseProvenanceTable
      dataSource={criteria}
      rowKey="description"
      columns={[
        {
          title: t('Type'),
          dataIndex: 'type',
          key: 'type',
          width: 120,
          render: (type) => t(type),
        },
        {
          title: t('Description'),
          dataIndex: 'description',
          key: 'description',
        },
        {
          title: t('Link'),
          dataIndex: 'link',
          key: 'link',
          render: (link) =>
            link ? (
              <a href={link} target="_blank" rel="noreferrer">
                {link}
              </a>
            ) : null,
        },
      ]}
    />
  );
};

export default ParticipantCriteriaDisplay;
