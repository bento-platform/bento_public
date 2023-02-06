import React from 'react';
import { Table, Tag } from 'antd';
import { useTranslation } from 'react-i18next';

import LinkIfUrl from '../../Util/LinkIfUrl';
import { ANY_TRANSLATION } from '../../../constants/configConstants';

const AcknowledgesTable = ({ acknowledges }) => {
  const { t } = useTranslation(ANY_TRANSLATION);

  return (
    <Table
      dataSource={acknowledges}
      columns={[
        {
          title: t('Name'),
          dataIndex: 'name',
          key: 'name',
          render: (text) => t(text),
        },
        {
          title: t('Funders'),
          dataIndex: 'funders',
          key: 'funders',
          render: (_, { funders }) =>
            funders.map((f, i) => (
              <Tag key={i} color="cyan">
                <LinkIfUrl text={f.name} />
                {f.abbreviation ? `(${t(f.abbreviation)})` : ''}
              </Tag>
            )),
        },
      ]}
      pagination={false}
    />
  );
};

export default AcknowledgesTable;
