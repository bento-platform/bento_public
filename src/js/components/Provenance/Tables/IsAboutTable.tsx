import { Tag } from 'antd';

import BaseProvenanceTable from './BaseProvenanceTable';
import LinkIfUrl from '@/components/Util/LinkIfUrl';
import { useTranslationFn } from '@/hooks';
import type { DatsFile } from '@/types/dats';

const IsAboutTable = ({ isAbout }: IsAboutTableProps) => {
  const t = useTranslationFn();

  return (
    <BaseProvenanceTable
      dataSource={isAbout}
      columns={[
        {
          title: t('Name'),
          dataIndex: 'name',
          render: (text, { identifier }) => {
            return (identifier.identifierSource ?? '').toLocaleLowerCase().includes('taxonomy') ? (
              <em>{t(text)}</em>
            ) : (
              t(text)
            );
          },
        },
        {
          title: t('Identifier'),
          dataIndex: 'identifier.identifier',
          render: (_, { identifier }) => <LinkIfUrl text={identifier.identifier} />,
        },
        {
          title: t('Identifier Source'),
          dataIndex: 'identifier.identifierSource',
          render: (_, { identifier }) => <Tag color="cyan">{t(identifier.identifierSource)}</Tag>,
        },
      ]}
      rowKey="name"
    />
  );
};

export interface IsAboutTableProps {
  isAbout: DatsFile['isAbout'];
}

export default IsAboutTable;
