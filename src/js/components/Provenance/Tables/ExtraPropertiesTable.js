import React from 'react';
import { Table, Tag } from 'antd';
import { useTranslation } from 'react-i18next';

import LinkIfUrl from '../../Util/LinkIfUrl';
import { DEFAULT_TRANSLATION, NON_DEFAULT_TRANSLATION } from '../../../constants/configConstants';

const ExtraPropertiesTable = ({ extraProperties }) => {
  const { t } = useTranslation(NON_DEFAULT_TRANSLATION);
  const { t: td } = useTranslation(DEFAULT_TRANSLATION);

  return (
    <Table
      dataSource={extraProperties}
      columns={[
        { title: td('Category'), dataIndex: 'category', key: 'category', render: (text) => t(text) },
        {
          title: td('Values'),
          dataIndex: 'values',
          key: 'values',
          render: (_, { values }) =>
            values.map((v, i) => (
              <Tag key={i} color="cyan">
                <LinkIfUrl text={v.value} />
              </Tag>
            )),
        },
      ]}
      pagination={false}
    />
  );
};

export default ExtraPropertiesTable;
