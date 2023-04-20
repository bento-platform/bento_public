import React from 'react';
import { Table, Tag, Typography } from 'antd';
import LinkIfUrl from '../../Util/LinkIfUrl';
import { useTranslationCustom, useTranslationDefault } from '@/hooks';
import { ProvenanceStoreDataset } from '@/types/provenance';

const PublicationsTable = ({ publications }: PublicationsTableProps) => {
  const t = useTranslationCustom();
  const td = useTranslationDefault();

  return (
    <Table
      dataSource={publications}
      columns={[
        {
          title: td('Title'),
          dataIndex: 'title',
          key: 'title',
          render: (_, { title, identifier }) =>
            identifier.identifier === '' ? (
              t(title)
            ) : (
              <Typography.Link href={`https://dx.doi.org/${identifier.identifier}`} target="_blank">
                {t(title)}
              </Typography.Link>
            ),
        },
        {
          title: td('Publication Venue'),
          dataIndex: 'publicationVenue',
          key: 'publicationVenue',
          render: (text) => t(text),
        },
        {
          title: td('Authors'),
          dataIndex: 'authors',
          key: 'authors',
          render: (_, { authors }) =>
            authors.map((author, i) => (
              <Tag key={i} color="cyan">
                {author}
              </Tag>
            )),
        },
        {
          title: td('Dates'),
          dataIndex: 'dates',
          key: 'dates',
          render: (_, { dates }) =>
            dates.map((date, i) => (
              <Tag key={i} color="cyan">
                {date}
              </Tag>
            )),
        },
        {
          title: td('Identifier'),
          dataIndex: 'identifier.identifier',
          key: 'identifier.identifier',
          render: (_, { identifier }) => <LinkIfUrl text={identifier.identifier} />,
        },
        {
          title: td('Identifier Source'),
          dataIndex: 'identifier.identifierSource',
          key: 'identifier.identifierSource',
          render: (_, { identifier }) => t(identifier.identifierSource),
        },
      ]}
      pagination={false}
      size="small"
    />
  );
};

export interface PublicationsTableProps {
  publications: ProvenanceStoreDataset['primaryPublications'];
}

export default PublicationsTable;