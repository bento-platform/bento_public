import type { Count } from '@/types/dataset';
import { useTranslationFn } from '@/hooks';
import BaseProvenanceTable from './Tables/BaseProvenanceTable';

const CountsDisplay = ({ counts }: { counts: Count[] }) => {
  const t = useTranslationFn();
  return (
    <BaseProvenanceTable
      dataSource={counts}
      rowKey="count_entity"
      columns={[
        { title: t('Entity'), dataIndex: 'count_entity', key: 'count_entity' },
        { title: t('Value'), dataIndex: 'value', key: 'value' },
        { title: t('Description'), dataIndex: 'description', key: 'description' },
      ]}
    />
  );
};

export default CountsDisplay;
