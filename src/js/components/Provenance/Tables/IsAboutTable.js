import React from 'react';
import { Table, Tag } from 'antd';
import { useTranslation } from 'react-i18next';

import LinkIfUrl from '../../Util/LinkIfUrl';
import { ANY_TRANSLATION } from '../../../constants/configConstants';

const IsAboutTable = ({ isAbout }) => {
  const { t } = useTranslation(ANY_TRANSLATION);

  return (
    <Table
      dataSource={isAbout}
      columns={[
        { title: t('Name'), dataIndex: 'name', key: 'name', render: (text) => t(text) },
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
          render: (_, { identifier }) => <Tag color="cyan">{t(identifier.identifierSource)}</Tag>,
        },
      ]}
      pagination={false}
      size="small"
    />
  );
};

export default IsAboutTable;
