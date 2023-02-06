import React from 'react';
import { Table, Tag } from 'antd';
import { useTranslation } from 'react-i18next';

import LinkIfUrl from '../../Util/LinkIfUrl';
import { ANY_TRANSLATION } from '../../../constants/configConstants';

const ExtraPropertiesTable = ({ extraProperties }) => {
  const { t } = useTranslation(ANY_TRANSLATION);

  return (
    <Table
      dataSource={extraProperties}
      columns={[
        { title: t('Category'), dataIndex: 'category', key: 'category', render: (text) => t(text) },
        {
          title: t('Values'),
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
