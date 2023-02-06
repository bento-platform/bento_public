import React from 'react';
import { Table, Tag, Typography } from 'antd';
import { useTranslation } from 'react-i18next';

import LinkIfUrl from '../../Util/LinkIfUrl';

const PublicationsTable = ({ publications }) => {
  const { t } = useTranslation();

  return (
    <Table
      dataSource={publications}
      columns={[
        {
          title: t('Title'),
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
          title: t('Publication Venue'),
          dataIndex: 'publicationVenue',
          key: 'publicationVenue',
          render: (text) => t(text),
        },
        {
          title: t('Authors'),
          dataIndex: 'authors',
          key: 'authors',
          render: (_, { authors }) => authors.map((author, i) => <Tag key={i} color="cyan">{author}</Tag>),
        },
        {
          title: t('Dates'),
          dataIndex: 'dates',
          key: 'dates',
          render: (_, { dates }) => dates.map((date, i) => <Tag key={i} color="cyan">{date}</Tag>),
        },
        {
          title: t('Identifier'),
          dataIndex: 'identifier.identifier',
          key: 'identifier.identifier',
          render: (_, { identifier }) => <LinkIfUrl text={identifier.identifier} />,
        },
        {
          title: t('Identifier Source'),
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

export default PublicationsTable;
