import React, { useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { Tabs, Typography } from 'antd';

const { Title } = Typography;

import { makeGetConfigRequest } from '@/features/config/config.store';
import { makeGetAboutRequest } from '@/features/content/content.store';
import { makeGetDataRequestThunk } from '@/features/data/data.store';
import { makeGetSearchFields } from '@/features/search/query.store';
import { makeGetProvenanceRequest } from '@/features/provenance/provenance.store';

import Loader from './Loader';
import PublicOverview from './Overview/PublicOverview';
import Search from './Search/Search';
import ProvenanceTab from './Provenance/ProvenanceTab';
import { DEFAULT_TRANSLATION } from '@/constants/configConstants';
import { useAppDispatch, useAppSelector } from '@/hooks';

const TabbedDashboard = () => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation(DEFAULT_TRANSLATION);
  const navigate = useNavigate();
  const location = useLocation();
  const { page } = useParams<{ page?: string }>();

  useEffect(() => {
    dispatch(makeGetConfigRequest());
    dispatch(makeGetAboutRequest());
    dispatch(makeGetDataRequestThunk());
    dispatch(makeGetSearchFields());
    dispatch(makeGetProvenanceRequest());
  }, []);

  const isFetchingOverviewData = useAppSelector((state) => state.data.isFetchingData);
  const isFetchingSearchFields = useAppSelector((state) => state.query.isFetchingFields);

  const onChange = useCallback(
    (key: string) => {
      const currentPath = location.pathname;
      const currentPathParts = currentPath.split('/');
      const currentLang = currentPathParts[1];
      const newPath = `/${currentLang}/${key === 'overview' ? '' : key}`;
      console.log('onChange: ', newPath);
      navigate(newPath);
    },
    [location, navigate]
  );

  const TabTitle = ({ title }: { title: string }) => (
    <Title level={4} style={{ margin: '0' }}>
      {title}
    </Title>
  );

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

  return <Tabs defaultActiveKey={getTabKey(page)} items={mappedTabPanes} onChange={onChange} centered />;
};

const getTabKey = (page: string | undefined) => {
  switch (page) {
    case 'search':
      return 'search';
    case 'provenance':
      return 'provenance';
    default:
      return 'overview';
  }
};

export default TabbedDashboard;
