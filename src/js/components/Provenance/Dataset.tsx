import { type ReactNode, useCallback, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { Avatar, Button, Card, Flex, List, Modal, Space, Tag, Typography } from 'antd';
import { ExpandAltOutlined, PieChartOutlined, SearchOutlined, SolutionOutlined } from '@ant-design/icons';
import { FaDatabase } from 'react-icons/fa';

import type { DiscoveryScope } from '@/features/metadata/metadata.store';
import type { Dataset } from '@/types/metadata';
import { getCurrentPage, scopeToUrl } from '@/utils/router';
import { useTranslationFn } from '@/hooks';
import { BOX_SHADOW } from '@/constants/overviewConstants';
import { DatasetProvenanceContent } from '@/components/Provenance/DatasetProvenance';
import SmallChartCardTitle from '@/components/Util/SmallChartCardTitle';
import TruncatedParagraph from '@/components/Util/TruncatedParagraph';

const { Paragraph, Title } = Typography;

const KEYWORDS_LIMIT = 2;

const Dataset = ({
  parentProjectID,
  dataset,
  format,
  selected,
}: {
  parentProjectID: string;
  dataset: Dataset;
  format: 'list-item' | 'card' | 'carousel';
  selected?: boolean;
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const page = getCurrentPage();

  const t = useTranslationFn();

  const [provenanceModalOpen, setProvenanceModalOpen] = useState(false);

  const baseURL = '/' + location.pathname.split('/')[1];

  const { identifier, title, description, dats_file: dats } = dataset;
  const keywords = dats.keywords;
  const displayKeywords = keywords?.slice(0, KEYWORDS_LIMIT) ?? [];
  const remainingKeywords = keywords?.slice(KEYWORDS_LIMIT) ?? [];

  const scope: DiscoveryScope = { project: parentProjectID, dataset: identifier };
  const datasetBaseURL = scopeToUrl(scope, baseURL);

  const onNavigateCurrent = useCallback(() => navigate(`${datasetBaseURL}${page}`), [navigate, datasetBaseURL, page]);
  const onNavigateOverview = useCallback(() => navigate(`${datasetBaseURL}overview`), [navigate, datasetBaseURL]);
  const onNavigateSearch = useCallback(() => navigate(`${datasetBaseURL}search`), [navigate, datasetBaseURL]);

  const openProvenanceModal = useCallback(() => setProvenanceModalOpen(true), []);
  const closeProvenanceModal = useCallback(() => setProvenanceModalOpen(false), []);

  let inner: ReactNode;

  if (format === 'list-item') {
    inner = (
      <List.Item
        className={`select-dataset-item${selected ? ' selected' : ''}`}
        key={identifier}
        onClick={onNavigateCurrent}
        style={{ cursor: 'pointer' }}
      >
        <List.Item.Meta
          avatar={<Avatar icon={<FaDatabase />} />}
          title={t(title)}
          description={<TruncatedParagraph>{t(description)}</TruncatedParagraph>}
        />
      </List.Item>
    );
  } else if (format === 'card') {
    inner = (
      <Card
        title={<SmallChartCardTitle title={title} />}
        size="small"
        style={{ ...BOX_SHADOW, height: 200 }}
        styles={{ body: { padding: '12px 16px', height: 'calc(100% - 53px)' } }}
        extra={
          <Button icon={<SolutionOutlined />} onClick={openProvenanceModal}>
            Provenance
          </Button>
        }
      >
        <Flex vertical={true} gap={12} style={{ height: '100%' }}>
          <TruncatedParagraph maxRows={2}>{t(description)}</TruncatedParagraph>
          <Space size={[0, 8]} align="start" wrap style={{ width: '100%' }}>
            {displayKeywords?.map((keyword, i) => (
              <Tag key={i} color="cyan">
                {t(keyword.value.toString())}
              </Tag>
            ))}
            {remainingKeywords?.length > 0 && <Paragraph>+{remainingKeywords.length} more</Paragraph>}
          </Space>
          <Space size={12} style={{ flex: 1, display: 'flex', alignItems: 'flex-end', gap: 12 }}>
            <Button icon={<PieChartOutlined />} onClick={onNavigateOverview}>
              {t('Overview')}
            </Button>
            <Button icon={<SearchOutlined />} onClick={onNavigateSearch}>
              {t('Search')}
            </Button>
          </Space>
        </Flex>
      </Card>
    );
  } else if (format === 'carousel') {
    inner = (
      <>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Title level={5} style={{ marginTop: 0 }}>
            {t(title)}
          </Title>
          <Button size="small" icon={<SolutionOutlined />} style={{ float: 'right' }} onClick={openProvenanceModal}>
            {t('Provenance')}
            <ExpandAltOutlined />
          </Button>
        </div>
        <TruncatedParagraph>{t(description)}</TruncatedParagraph>
        <div style={{ display: 'flex', gap: 8 }}>
          <Button size="small" icon={<PieChartOutlined />} onClick={onNavigateOverview}>
            {t('Overview')}
          </Button>
          <Button size="small" icon={<SearchOutlined />} onClick={onNavigateSearch}>
            {t('Search')}
          </Button>
        </div>
      </>
    );
  } else {
    inner = <span style={{ color: 'red' }}>UNIMPLEMENTED</span>;
  }

  return (
    <>
      <Modal title={dataset.title} open={provenanceModalOpen} onCancel={closeProvenanceModal} footer={null} width={960}>
        <DatasetProvenanceContent dataset={dataset} />
      </Modal>
      {inner}
    </>
  );
};

export default Dataset;
