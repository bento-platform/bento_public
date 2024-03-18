import React, { ReactNode, useMemo } from 'react';

import { Typography } from 'antd';
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
  <URLLink url={`https://dx.doi.org/${doi}`}>{children || doi}</URLLink>
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
                {!!authors?.length && (
                  <>
                    <br />
                    <em>{formatAuthorList(authors)}</em>
                  </>
                )}
              </>
            );
          },

          sorter: (a, b) => a.title.localeCompare(b.title),
        },
        {
          title: td('Publication Venue'),
          dataIndex: 'publicationVenue',
          render: (text) => t(text),
          sorter: (a, b) => a.publicationVenue.localeCompare(b.publicationVenue),
        },
        {
          title: td('Date'),
          dataIndex: 'dates',
          render: (_, { dates }) => {
            const _dates = dates ?? [];
            return _dates.map((date, i) => (
              <>
                {new Date(Date.parse(date.date)).toLocaleDateString()}
                {i < _dates.length - 1 ? '; ' : ''}
              </>
            ));
          },
          sorter: (a, b) => {
            if (!a.dates?.length) {
              if (!b.dates?.length) return 0;
              return 1; // Sort blank entries after
            } else if (!b.dates?.length) {
              return -1; // Sort blank entries after
            } else {
              return Date.parse(a.dates[0].date) - Date.parse(b.dates[0].date);
            }
          },
          defaultSortOrder: 'descend',
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
          sorter: (a, b) => a.identifier.identifierSource.localeCompare(b.identifier.identifierSource),
          filters: Array.from(new Set(publications.map((p) => p.identifier.identifierSource))).map((v) => ({
            text: v,
            value: v,
          })),
          onFilter: (filterValue, p) => p.identifier.identifierSource === filterValue,
        },
      ] as ColumnsType<PrimaryPublication>,
    [td, publications]
  );

  return <BaseProvenanceTable dataSource={publications} columns={columns} rowKey="title"/>;
};

export interface PublicationsTableProps {
  publications: ProvenanceStoreDataset['primaryPublications'];
}

export default PublicationsTable;
