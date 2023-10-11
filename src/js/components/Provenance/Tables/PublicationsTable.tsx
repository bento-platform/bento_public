import React, { ReactNode } from 'react';
import { Tag, Typography } from 'antd';

import BaseProvenanceTable from './BaseProvenanceTable';
import LinkIfUrl from '../../Util/LinkIfUrl';
import { useTranslationCustom, useTranslationDefault } from '@/hooks';
import { ProvenanceStoreDataset } from '@/types/provenance';

const DOI_REGEX = /^10.\d{4,9}\/[-._;()/:A-Z0-9]+$/i;
const isDOI = (s: string) => s.match(DOI_REGEX);

const DOILink = ({ doi, children }: { doi: string; children?: ReactNode }) => (
  <Typography.Link href={`https://dx.doi.org/${doi}`} target="_blank" rel="noopener noreferrer">
    {children ?? doi}
  </Typography.Link>
);

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

          render: (_, { title, identifier: { identifier } }) =>
            isDOI(identifier) ? <DOILink doi={identifier}>{t(title)}</DOILink> : t(title),
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
            (authors ?? []).map((author, i) => (
              <Tag key={i} color="cyan">
                {author}
              </Tag>
            )),
        },
        {
          title: td('Dates'),
          dataIndex: 'dates',
          render: (_, { dates }) =>
            (dates ?? []).map((date, i) => (
              <Tag key={i} color="cyan">
                {date}
              </Tag>
            )),
        },
        {
          title: td('Identifier'),
          dataIndex: 'identifier.identifier',
          render: (_, { identifier: { identifier } }) =>
            isDOI(identifier) ? <DOILink doi={identifier} /> : <LinkIfUrl text={identifier} />,
        },
        {
          title: td('Identifier Source'),
          dataIndex: 'identifier.identifierSource',
          render: (_, { identifier: { identifierSource } }) => t(identifierSource),
        },
      ]}
    />
  );
};

export interface PublicationsTableProps {
  publications: ProvenanceStoreDataset['primaryPublications'];
}

export default PublicationsTable;
