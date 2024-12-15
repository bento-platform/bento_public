import { Typography, Space } from 'antd';

import OverviewDisplayData from './OverviewDisplayData';
import { useTranslationFn } from '@/hooks';
import type { Section } from '@/types/data';

const OverviewSection = ({ section, searchableFields }: { section: Section; searchableFields: Set<string> }) => {
  const t = useTranslationFn();
  const { sectionTitle: title } = section;

  return (
    <Space direction="vertical" size={0} style={{ width: '100%' }}>
      <Typography.Title level={3}>{t(title)}</Typography.Title>
      <OverviewDisplayData section={section} searchableFields={searchableFields} />
    </Space>
  );
};

export default OverviewSection;
