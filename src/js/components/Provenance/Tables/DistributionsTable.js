import React from 'react';
import { Table, Tag, Typography } from 'antd';
import { useTranslation } from 'react-i18next';
import { DEFAULT_TRANSLATION, NON_DEFAULT_TRANSLATION } from '../../../constants/configConstants';
const { Link } = Typography;

const DistributionsTable = ({ distributions }) => {
  const { t } = useTranslation(NON_DEFAULT_TRANSLATION);
  const { t: td } = useTranslation(DEFAULT_TRANSLATION);

  return (
    <Table
      dataSource={distributions}
      columns={[
        {
          title: td('Formats'),
          dataIndex: 'formats',
          key: 'formats',
          render: (_, { formats }) => (
            <Tag key={formats} color="cyan">
              {formats}
            </Tag>
          ),
        },
        {
          title: td('Size'),
          dataIndex: 'size',
          key: 'size',
          render: (text) => t(text),
        },
        {
          title: td('Unit'),
          dataIndex: 'unit',
          key: 'unit',
          render: (_, { unit }) => t(unit.value),
        },
        {
          title: td('Access'),
          children: [
            {
              title: td('Landing Page'),
              dataIndex: 'access.landingPage',
              key: 'access.landingPage',
              render: (_, { access }) => (
                <Link href={access.landingPage} target="_blank">
                  {access.landingPage}
                </Link>
              ),
            },
            {
              title: td('Authorizations'),
              dataIndex: 'access.authorizations',
              key: 'access.authorizations',
              render: (_, { access }) =>
                access.authorizations.map((a, i) => (
                  <Tag key={i} color="cyan">
                    {t(a.value)}
                  </Tag>
                )),
            },
          ],
        },
      ]}
      pagination={false}
      bordered
    />
  );
};

export default DistributionsTable;
