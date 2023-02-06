import React from 'react';
import { Table, Tag, Typography } from 'antd';
import { useTranslation } from 'react-i18next';
import { ANY_TRANSLATION } from '../../../constants/configConstants';
const { Link } = Typography;

const DistributionsTable = ({ distributions }) => {
  const { t } = useTranslation(ANY_TRANSLATION);

  return (
    <Table
      dataSource={distributions}
      columns={[
        {
          title: t('Formats'),
          dataIndex: 'formats',
          key: 'formats',
          render: (_, { formats }) => (
            <Tag key={formats} color="cyan">
              {formats}
            </Tag>
          ),
        },
        {
          title: t('Size'),
          dataIndex: 'size',
          key: 'size',
          render: (text) => t(text),
        },
        {
          title: t('Unit'),
          dataIndex: 'unit',
          key: 'unit',
          render: (_, { unit }) => t(unit.value),
        },
        {
          title: t('Access'),
          children: [
            {
              title: t('Landing Page'),
              dataIndex: 'access.landingPage',
              key: 'access.landingPage',
              render: (_, { access }) => (
                <Link href={access.landingPage} target="_blank">
                  {access.landingPage}
                </Link>
              ),
            },
            {
              title: t('Authorizations'),
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
