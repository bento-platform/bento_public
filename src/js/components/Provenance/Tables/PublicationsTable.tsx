import React from 'react';
import { Tag, Typography } from 'antd';

import BaseProvenanceTable from './BaseProvenanceTable';
import LinkIfUrl from '../../Util/LinkIfUrl';
import { useTranslationCustom, useTranslationDefault } from '@/hooks';
import { ProvenanceStoreDataset } from '@/types/provenance';

const PublicationsTable = ({ publications }: PublicationsTableProps) => {
  const t = useTranslationCustom();
  const td = useTranslationDefault();

  return (
    <BaseProvenanceTable
      dataSource={publications}
      columns={[
        {
          title: td('Title'),
          dataIndex: 'title',

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
          render: (text) => t(text),
        },
        {
          title: td('Authors'),
          dataIndex: 'authors',
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
          render: (_, { identifier }) => <LinkIfUrl text={identifier.identifier} />,
        },
        {
          title: td('Identifier Source'),
          dataIndex: 'identifier.identifierSource',
          render: (_, { identifier }) => t(identifier.identifierSource),
        },
      ]}
    />
  );
};

export interface PublicationsTableProps {
  publications: ProvenanceStoreDataset['primaryPublications'];
}

export default PublicationsTable;
