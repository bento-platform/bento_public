import { Flex, Typography } from 'antd';
import type { FundingSource, Link } from '@/types/dataset';
import { useTranslationFn } from '@/hooks';
import EntityCard from './EntityCard';
import PersonOrOrganizationDisplay from './PersonOrOrganizationDisplay';

const GrantNumbers = ({ grantNumbers }: { grantNumbers: string[] }) => {
  const t = useTranslationFn();
  return (
    <span>
      <strong>{t('dataset.grant_numbers')}:</strong> {grantNumbers.join(', ')}
    </span>
  );
};

const FundingDisplay = ({ funding }: { funding: (FundingSource | Link)[] | string }) => {
  if (typeof funding === 'string') return <Typography.Paragraph>{funding}</Typography.Paragraph>;
  return (
    <Flex gap={16}>
      {funding.map((f, fi) => {
        if ('url' in f) {
          return <EntityCard key={fi} title={<a href={f.url}>{f.label}</a>} />;
        } else if (!f.funder) {
          if (!f.grant_numbers?.length) {
            // Typing bug/oddity: both funder/grant numbers can be null
            return null;
          } else {
            return <EntityCard key={fi} title={<GrantNumbers grantNumbers={f.grant_numbers} />} />;
          }
        } else if (typeof f.funder === 'string') {
          return (
            <EntityCard
              key={fi}
              title={f.funder}
              extra={f.grant_numbers?.length ? <GrantNumbers grantNumbers={f.grant_numbers} /> : undefined}
            />
          );
        } else {
          return (
            <PersonOrOrganizationDisplay
              key={fi}
              entity={f.funder}
              extra={f.grant_numbers?.length ? <GrantNumbers grantNumbers={f.grant_numbers} /> : undefined}
            />
          );
        }
      })}
    </Flex>
  );
};

export default FundingDisplay;
