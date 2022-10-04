import React from 'react';
import { Table, Tag, Typography } from 'antd';
import LinkIfUrl from '../../Util/LinkIfUrl';

const PublicationsTable = ({ publications }) => {
  return (
    <Table
      dataSource={publications}
      columns={[
        {
          title: 'Title',
          dataIndex: 'title',
          key: 'title',
          render: (_, { title, identifier }) =>
            identifier.identifier === '' ? (
              title
            ) : (
              <Typography.Link href={`https://dx.doi.org/${identifier.identifier}`} target="_blank">
                {title}
              </Typography.Link>
            ),
        },
        { title: 'Publication Venue', dataIndex: 'publicationVenue', key: 'publicationVenue' },
        {
          title: 'Authors',
          dataIndex: 'authors',
          key: 'authors',
          render: (_, { authors }) => authors.map((author) => <Tag color="cyan">{author}</Tag>),
        },
        {
          title: 'Dates',
          dataIndex: 'dates',
          key: 'dates',
          render: (_, { dates }) => dates.map((date) => <Tag color="cyan">{date}</Tag>),
        },
        {
          title: 'Identifier',
          dataIndex: 'identifier.identifier',
          key: 'identifier.identifier',
          render: (_, { identifier }) => <LinkIfUrl text={identifier.identifier} />,
        },
        {
          title: 'Identifier Source',
          dataIndex: 'identifier.identifierSource',
          key: 'identifier.identifierSource',
          render: (_, { identifier }) => identifier.identifierSource,
        },
      ]}
      pagination={false}
      size="small"
    />
  );
};

export default PublicationsTable;
