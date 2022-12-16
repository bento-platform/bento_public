import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Tabs, Typography } from 'antd';
const { Title } = Typography;

import { makeGetConfigRequest } from '../features/config/config';
import { makeGetAboutRequest } from '../features/content/content';
import { makeGetDataRequest } from '../features/data/data';
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
    dispatch(makeGetAboutRequest());
    dispatch(makeGetDataRequest()).then(() => {
      // Sequential call intended for backend related issues
      dispatch(makeGetSearchFields());
    });
    dispatch(makeGetProvenanceRequest());
  }, []);

  const [activeKey, setActiveKey] = useState('overview');

  const isFetchingOverviewData = useSelector((state) => state.data.isFetchingData);
  const isFetchingSearchFields = useSelector((state) => state.query.isFetchingFields);
  const individuals = useSelector((state) => state.data.individuals);

  const TabTitle = ({ title }) => (
    <Title level={4} style={{ margin: '0' }}>
      {title}
    </Title>
  );

  const individualCount =
    activeKey === 'overview' ? (
      <Title level={5} type="secondary" style={{ position: 'absolute', width: '150px', right: '50px', top: '-10px' }}>
        {t('Individuals')}: {individuals}
      </Title>
    ) : null;

  const tabPanes = [
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

  const mappedTabPanes = tabPanes.map(({ title, content, loading, key }) => ({
    label: <TabTitle title={t(title)} />,
    children: loading ? <Loader /> : content,
    key,
  }));

  return (
    <Tabs
      tabBarExtraContent={{ right: individualCount }}
      defaultActiveKey="overview"
      items={mappedTabPanes}
      onChange={setActiveKey}
      centered
    />
  );
};

export default TabbedDashboard;
