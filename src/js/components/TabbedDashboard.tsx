import React, { useEffect } from 'react';
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

  let tab = 'overview';

  // fetch data from server on first render
  useEffect(() => {
    dispatch(makeGetConfigRequest());
    dispatch(makeGetAboutRequest());
    dispatch(makeGetDataRequestThunk());
    dispatch(makeGetSearchFields());
    dispatch(makeGetProvenanceRequest());
  }, []);

  useEffect(() => {
    console.log('page', page);
    if (page) {
      if (page === 'search') {
        tab = 'search';
      } else if (page === 'provenance') {
        tab = 'provenance';
      } else {
        tab = 'overview';
      }
    } else {
      tab = 'overview';
    }
  }, [page]);

  const isFetchingOverviewData = useAppSelector((state) => state.data.isFetchingData);
  const isFetchingSearchFields = useAppSelector((state) => state.query.isFetchingFields);

  const onChange = (key: string) => {
    console.log('Trigger Tab Change ' + key);
    const currentPath = location.pathname;
    const currentPathParts = currentPath.split('/');
    const currentLang = currentPathParts[1];
    if (key === 'overview') key = '';
    const newPath = `/${currentLang}/${key}`;
    // setTab(key);
    navigate(newPath);
  };

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
  if (page === 'search') {
    return 'search';
  } else if (page === 'provenance') {
    return 'provenance';
  } else {
    return 'overview';
  }
};
export default TabbedDashboard;
