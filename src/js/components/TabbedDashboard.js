import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Tabs, Typography } from 'antd';
const { Title } = Typography;

import { makeGetDataRequest } from '../features/data/data';
import { makeGetConfigRequest } from '../features/config/config';
import { makeGetSearchFields } from '../features/search/query';
import { makeGetProvenanceRequest } from '../features/provenance/provenance';

import Loader from './Loader';
import PublicOverview from './Overview/PublicOverview';
import Search from './Search/Search';
import ProvenanceTab from './Provenance/ProvenanceTab';

const TabbedDashboard = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  // fetch data from server on first render
  useEffect(() => {
    dispatch(makeGetConfigRequest());
    dispatch(makeGetDataRequest()).then(() => {
      // Sequential call intended for backend related issues
      dispatch(makeGetSearchFields());
    });
    dispatch(makeGetProvenanceRequest());
  }, []);

  const tabTitleStyle = { fontSize: '20px', fontWeight: 500 };

  const TabTitle = ({ title }) => <p style={tabTitleStyle}>{title}</p>;

  const isFetchingOverviewData = useSelector((state) => state.data.isFetchingData);
  const isFetchingSearchFields = useSelector((state) => state.query.isFetchingFields);
  const individuals = useSelector((state) => state.data.individuals);

  const individualCount = (
    <Title level={5}>
      {t('Individuals')}: {individuals}
    </Title>
  );

  const TabPanes = [
    {
      title: 'Overview',
      content: <PublicOverview />,
      loading: isFetchingOverviewData,
      key: 'overview',
    },
    {
      title: 'Search',
      content: <Search />,
      loading: isFetchingSearchFields,
      key: 'search',
    },
    {
      title: 'Provenance',
      content: <ProvenanceTab />,
      loading: false,
      key: 'provenance',
    },
  ];

  const MappedTabPanes = TabPanes.map(({ title, content, loading, key }) => ({
    label: <TabTitle title={title} />,
    children: loading ? <Loader /> : content,
    key,
  }));

  return (
    <Tabs tabBarExtraContent={{ right: individualCount }} defaultActiveKey="overview" items={MappedTabPanes} centered />
  );
};

export default TabbedDashboard;
