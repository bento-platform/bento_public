import type { FundingSource, Link } from '@/types/dataset';
import { Flex } from 'antd';
import { useTranslationFn } from '@/hooks';
import EntityCard from './EntityCard';
import PersonOrOrganizationDisplay from './PersonOrOrganizationDisplay';

const FundingDisplay = ({ funding }: { funding: (FundingSource | Link)[] | string }) => {
  const t = useTranslationFn();
  if (typeof funding === 'string') return <span>{funding}</span>;
  return (
    <Flex gap={16}>
      {funding.map((f, fi) => {
        if ('url' in f) {
          return <EntityCard key={fi} title={<a href={f.url}>{f.label}</a>} />;
        } else if (!f.funder) {
          return null;
        } else if (typeof f.funder === 'string') {
          return <EntityCard key={fi} title={f.funder} />;
        } else {
          const grantNumbers = f.grant_numbers ?? [];
          return (
            <PersonOrOrganizationDisplay
              key={fi}
              entity={f.funder}
              extra={
                grantNumbers.length ? (
                  <>
                    <strong>{t('dataset.grant_numbers')}:</strong> {grantNumbers.join(', ')}
                  </>
                ) : undefined
              }
            />
          );
        }
      })}
    </Flex>
  );
};

export default FundingDisplay;
