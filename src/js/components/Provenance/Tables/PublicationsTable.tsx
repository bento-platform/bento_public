import React, { ReactNode, useMemo } from 'react';

import { Tag, Typography } from 'antd';
import { ColumnsType } from 'antd/es/table';

import BaseProvenanceTable from './BaseProvenanceTable';
import LinkIfUrl from '../../Util/LinkIfUrl';
import { useTranslationCustom, useTranslationDefault } from '@/hooks';
import { Person, PrimaryPublication, ProvenanceStoreDataset } from '@/types/provenance';

const DOI_REGEX = /^10.\d{4,9}\/[-._;()/:A-Z0-9]+$/i;
const isDOI = (s: string) => s.match(DOI_REGEX);

const DOILink = ({ doi, children }: { doi: string; children?: ReactNode }) => (
  <Typography.Link href={`https://dx.doi.org/${doi}`} target="_blank" rel="noopener noreferrer">
    {children ?? doi}
  </Typography.Link>
);

const formatAuthorList = (authors: Person[]): string => {
  const fullNames = authors.map((a) => a.fullName);
  if (fullNames.length === 0) {
    return '';
  } else if (fullNames.length === 1) {
    return `${fullNames[0]}.`;
  } else if (fullNames.length === 2) {
    return `${fullNames.join(' and ')}.`;
  } else {
    return `${fullNames.slice(0, -1).join(', ')}, and ${fullNames.at(-1)}.`;
  }
};

const PublicationsTable = ({ publications }: PublicationsTableProps) => {
  const t = useTranslationCustom();
  const td = useTranslationDefault();

  const columns = useMemo(
    () =>
      [
        {
          title: td('Publication'),
          key: 'publication',

          render: (_, { title, identifier: { identifier }, authors }) => {
            const formattedTitle = `${t(title)}${title.endsWith('.') ? '' : '.'}`;
            return (
              <>
                {isDOI(identifier) ? <DOILink doi={identifier}>{formattedTitle}</DOILink> : formattedTitle}
                {authors ? (
                  <>
                    <br />
                    {formatAuthorList(authors)}
                  </>
                ) : null}
              </>
            );
          },
        },
        {
          title: td('Publication Venue'),
          dataIndex: 'publicationVenue',
          render: (text) => t(text),
        },
        {
          title: td('Date'),
          dataIndex: 'dates',
          render: (_, { dates }) =>
            (dates ?? []).map((date, i) => (
              <Tag key={i} color="cyan">
                {date.date}
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
      ] as ColumnsType<PrimaryPublication>,
    [td]
  );

  return <BaseProvenanceTable dataSource={publications} columns={columns} />;
};

export interface PublicationsTableProps {
  publications: ProvenanceStoreDataset['primaryPublications'];
}

export default PublicationsTable;
