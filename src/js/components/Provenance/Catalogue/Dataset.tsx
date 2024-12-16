import { useLocation, useNavigate } from 'react-router-dom';
import { Avatar, Button, Card, List, Space, Tag, Typography } from 'antd';
import { FaDatabase } from 'react-icons/fa';
import type { DiscoveryScope } from '@/features/metadata/metadata.store';
import type { Dataset } from '@/types/metadata';
import { getCurrentPage, scopeToUrl } from '@/utils/router';
import { useTranslationFn } from '@/hooks';
import { BOX_SHADOW } from '@/constants/overviewConstants';
import { RightOutlined } from '@ant-design/icons';
import { useCallback } from 'react';
import SmallChartCardTitle from '@/components/Util/SmallChartCardTitle';

const { Paragraph, Title, Link } = Typography;

const KEYWORDS_LIMIT = 2;

const Dataset = ({
  parentProjectID,
  dataset,
  format,
  selected,
  navigateLink,
}: {
  parentProjectID: string;
  dataset: Dataset;
  format: 'list-item' | 'card' | 'carousel';
  selected?: boolean;
  navigateLink?: string;
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const page = getCurrentPage();

  const t = useTranslationFn();

  const baseURL = '/' + location.pathname.split('/')[1];

  const { identifier, title, description, dats_file: dats } = dataset;
  const keywords = dats.keywords;
  const displayKeywords = keywords?.slice(0, KEYWORDS_LIMIT) ?? [];
  const remainingKeywords = keywords?.slice(KEYWORDS_LIMIT) ?? [];

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
  } else if (format === 'card') {
    return (
      <Card
        title={<SmallChartCardTitle title={title} />}
        size="small"
        style={{ ...BOX_SHADOW, height: 200 }}
        styles={{ body: { padding: '12px 16px' } }}
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
  } else if (format === 'carousel') {
    return (
      <>
        <Space direction="horizontal">
          <Title level={5} style={{ marginTop: 0 }}>
            {t(title)}
          </Title>
          <div style={{ marginBottom: '8px' }}>
            <Link href={navigateLink}>{t('Explore Dataset')}</Link>
          </div>
        </Space>
        <Paragraph ellipsis={{ rows: 4, tooltip: { title: t(dataset.description) } }}>{t(description)}</Paragraph>
      </>
    );
  } else {
    return <span style={{ color: 'red' }}>UNIMPLEMENTED</span>;
  }
};

export default Dataset;
