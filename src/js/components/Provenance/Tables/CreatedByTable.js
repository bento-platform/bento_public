import React from 'react';
import { Table, Tag } from 'antd';
import { useTranslation } from 'react-i18next';

const CreatedByTable = ({ creators }) => {
  const { t } = useTranslation();

  return (
    <Table
      dataSource={creators}
      columns={[
        {
          title: t('Name'),
          dataIndex: 'name',
          key: 'name',
          render: (text) => t(text),
        },
        {
          title: t('Abbreviation'),
          dataIndex: 'abbreviation',
          key: 'abbreviation',
          render: (text) => t(text),
        },
        {
          title: t('Roles'),
          dataIndex: 'roles',
          key: 'roles',
          render: (_, { roles }) =>
            roles &&
            roles.map((r, i) => (
              <Tag key={i} color="cyan">
                {t(r.value)}
              </Tag>
            )),
        },
      ]}
      pagination={false}
    />
  );
};

export default CreatedByTable;
