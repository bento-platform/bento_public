import React, { ReactNode, useMemo } from 'react';

import { Tag, Typography } from 'antd';
import { ColumnsType } from 'antd/es/table';

import BaseProvenanceTable from './BaseProvenanceTable';
import LinkIfUrl from '../../Util/LinkIfUrl';
import { useTranslationCustom, useTranslationDefault } from '@/hooks';
import { Person, PrimaryPublication, ProvenanceStoreDataset } from '@/types/provenance';

import { stringIsDOI, stringIsURL } from '@/utils/strings';

const URLLink = ({ url, children }: { url: string; children?: ReactNode }) => (
  <Typography.Link href={url} target="_blank" rel="noopener noreferrer">
    {children || url}
  </Typography.Link>
);

const DOILink = ({ doi, children }: { doi: string; children?: ReactNode }) => (
  <URLLink url={`https://dx.doi.org/${doi}`}>{children}</URLLink>
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
                {stringIsDOI(identifier) ? (
                  <DOILink doi={identifier}>{formattedTitle}</DOILink>
                ) : stringIsURL(identifier) ? (
                  <URLLink url={identifier}>{formattedTitle}</URLLink>
                ) : (
                  formattedTitle
                )}
                {authors ? (
                  <>
                    <br />
                    <em>{formatAuthorList(authors)}</em>
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
            stringIsDOI(identifier) ? <DOILink doi={identifier} /> : <LinkIfUrl text={identifier} />,
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
