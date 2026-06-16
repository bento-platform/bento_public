import { Tag, type TagProps } from 'antd';
import type { ParticipantCriteria, ParticipantCriterionType } from '@/types/dataset';
import { useTranslationFn } from '@/hooks';
import BaseProvenanceTable from '@/components/Provenance/Tables/BaseProvenanceTable';

const ParticipantCriterionTypeTag = ({ type }: { type: ParticipantCriterionType }) => {
  const t = useTranslationFn();
  let color: TagProps['color'] = undefined;
  if (type === 'Inclusion') color = 'green';
  else if (type === 'Exclusion') color = 'red';
  return <Tag color={color}>{t(type)}</Tag>;
};

const ParticipantCriteriaDisplay = ({ criteria }: { criteria: ParticipantCriteria[] }) => {
  const t = useTranslationFn();
  return (
    <BaseProvenanceTable<ParticipantCriteria>
      dataSource={criteria}
      rowKey="description"
      columns={[
        {
          title: t('Type'),
          dataIndex: 'type',
          key: 'type',
          width: 120,
          render: (type: ParticipantCriterionType) => <ParticipantCriterionTypeTag type={type} />,
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
          isEmpty: (link) => !!link,
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
