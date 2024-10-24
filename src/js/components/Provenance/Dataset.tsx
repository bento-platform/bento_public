import { useLocation, useNavigate } from 'react-router-dom';
import { Avatar, Button, Card, List, Space, Tag, Typography } from 'antd';
import { FaDatabase } from 'react-icons/fa';
import type { DiscoveryScope } from '@/features/metadata/metadata.store';
import type { Dataset } from '@/types/metadata';
import { getCurrentPage, scopeToUrl } from '@/utils/router';
import { useTranslationCustom } from '@/hooks';
import { BOX_SHADOW } from '@/constants/overviewConstants';
import { RightOutlined } from '@ant-design/icons';
import { useCallback } from 'react';
import SmallChartCardTitle from '@/components/Util/SmallChartCardTitle';

const { Paragraph } = Typography;

const KEYWORDS_LIMIT = 2;

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
  const keywords = dataset.dats_file.keywords;
  const displayKeywords = keywords?.slice(0, KEYWORDS_LIMIT) ?? [];
  const remainingKeywords = keywords?.slice(KEYWORDS_LIMIT) ?? [];

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
        <Paragraph
          ellipsis={{
            rows: 2,
            tooltip: { title: description, color: 'white', overlayInnerStyle: { color: 'rgba(0, 0, 0, 0.88)' } },
          }}
        >
          {description}
        </Paragraph>
        <Space size={[0, 8]} align="start" wrap>
          {displayKeywords?.map((keyword, i) => (
            <Tag key={i} color="cyan">
              {t(keyword.value.toString())}
            </Tag>
          ))}
          {remainingKeywords?.length > 0 && <Paragraph>+{remainingKeywords.length} more</Paragraph>}
        </Space>
      </Card>
    );
  } else {
    return <span style={{ color: 'red' }}>UNIMPLEMENTED</span>;
  }
};

export default Dataset;
