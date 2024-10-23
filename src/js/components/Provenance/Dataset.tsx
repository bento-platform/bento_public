import { useLocation, useNavigate } from 'react-router-dom';
import { Avatar, Button, Card, List } from 'antd';
import { FaDatabase } from 'react-icons/fa';

import type { DiscoveryScope } from '@/features/metadata/metadata.store';
import type { Dataset } from '@/types/metadata';
import { getCurrentPage, scopeToUrl } from '@/utils/router';
import { useTranslationCustom } from '@/hooks';
import { BOX_SHADOW } from '@/constants/overviewConstants';
import { RightOutlined } from '@ant-design/icons';
import { useCallback } from 'react';
import SmallChartCardTitle from '@/components/Util/SmallChartCardTitle';

const Dataset = ({
  parentProjectID,
  dataset,
  format,
  selected,
}: {
  parentProjectID: string;
  dataset: Dataset;
  format: 'list-item' | 'small-card';
  selected?: boolean;
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const page = getCurrentPage();

  const t = useTranslationCustom();

  const baseURL = '/' + location.pathname.split('/')[1];

  const { identifier, title, description } = dataset;

  const scope: DiscoveryScope = { project: parentProjectID, dataset: identifier };
  const datasetURL = scopeToUrl(scope, baseURL, `/${page}`);

  const onNavigate = useCallback(() => navigate(datasetURL), [navigate, datasetURL]);

  if (format === 'list-item') {
    return (
      <List.Item
        className={`select-dataset-item${selected ? ' selected' : ''}`}
        key={identifier}
        onClick={onNavigate}
        style={{ cursor: 'pointer' }}
      >
        <List.Item.Meta avatar={<Avatar icon={<FaDatabase />} />} title={t(title)} description={t(description)} />
      </List.Item>
    );
  } else if (format === 'small-card') {
    return (
      <Card
        title={<SmallChartCardTitle title={title} />}
        size="small"
        style={{ ...BOX_SHADOW, height: 200 }}
        extra={<Button shape="circle" icon={<RightOutlined />} onClick={onNavigate} />}
      >
        {description}
      </Card>
    );
  } else {
    return <span style={{ color: 'red' }}>UNIMPLEMENTED</span>;
  }
};

export default Dataset;
