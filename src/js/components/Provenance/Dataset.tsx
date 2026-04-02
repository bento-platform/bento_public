import { type ReactNode, useCallback, useMemo, useState } from 'react';

import { Avatar, Button, Card, Flex, List, Popover, Space, Tag, Typography } from 'antd';
import { ExpandAltOutlined, PieChartOutlined, SolutionOutlined } from '@ant-design/icons';
import { FaDatabase } from 'react-icons/fa';

import type { DiscoveryScope } from '@/features/metadata/metadata.store';
import type { DatasetV2, OntologyClass } from '@/types/datasetV2';
import { BentoRoute } from '@/types/routes';
import type { KatsuEntityCountsOrBooleans } from '@/types/entities';
import clsx from 'clsx';
import { getCurrentPage } from '@/utils/router';
import { useTranslationFn } from '@/hooks';
import { useNavigateToScope } from '@/hooks/navigation';
import SmallChartCardTitle from '@/components/Util/SmallChartCardTitle';
import TruncatedParagraph from '@/components/Util/TruncatedParagraph';
import CountsDisplay from '@/components/Util/CountsDisplay';
import DatasetProvenanceModal from './DatasetProvenanceModal';

const { Title } = Typography;

const KEYWORDS_LIMIT = 2;

const keywordLabel = (k: string | OntologyClass): string => (typeof k === 'string' ? k : k.label);

const TagList = ({ keywords }: { keywords?: (string | OntologyClass)[] }) => {
  const t = useTranslationFn();
  return (
    <Space size={[0, 8]} align="start" wrap className="w-full">
      {keywords?.map((k, i) => (
        <Tag key={i} color="cyan" style={i === (keywords.length - 1) ? { marginInlineEnd: 0 } : undefined}>
          {t(keywordLabel(k))}
        </Tag>
      ))}
    </Space>
  );
};

const Dataset = ({
  parentProjectID,
  dataset,
  format,
  selected,
  filteredCounts,
}: {
  parentProjectID: string;
  dataset: DatasetV2;
  format: 'list-item' | 'card' | 'carousel';
  selected?: boolean;
  filteredCounts?: KatsuEntityCountsOrBooleans;
}) => {
  const navigateToScope = useNavigateToScope();
  const page = getCurrentPage();

  const t = useTranslationFn();

  const [provenanceModalOpen, setProvenanceModalOpen] = useState(false);

  const { identifier, title, description } = dataset;
  const keywords = dataset.keywords ?? [];
  const displayKeywords = keywords.slice(0, KEYWORDS_LIMIT);
  const remainingKeywords = keywords.slice(KEYWORDS_LIMIT);

  const scope: DiscoveryScope = useMemo(
    () => ({ project: parentProjectID, dataset: identifier }),
    [parentProjectID, identifier]
  );

  const onNavigateCurrent = useCallback(() => navigateToScope(scope, page), [navigateToScope, scope, page]);
  const onNavigateOverview = useCallback(() => navigateToScope(scope, BentoRoute.Overview), [navigateToScope, scope]);

  const openProvenanceModal = useCallback(() => setProvenanceModalOpen(true), []);
  const closeProvenanceModal = useCallback(() => setProvenanceModalOpen(false), []);

  let inner: ReactNode;

  if (format === 'list-item') {
    inner = (
      <List.Item
        className={`cursor-pointer select-dataset-item${selected ? ' selected' : ''}`}
        key={identifier}
        onClick={onNavigateCurrent}
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
        className={clsx('shadow', 'h-full')}
        style={{ minHeight: 200 }}
        styles={{ body: { padding: '12px 16px', height: 'calc(100% - 53px)' } }}
        extra={
          <Button icon={<SolutionOutlined />} onClick={openProvenanceModal}>
            {t('Provenance')}
            <ExpandAltOutlined />
          </Button>
        }
      >
        <Flex vertical={true} gap={12} className="h-full">
          <TruncatedParagraph maxRows={2}>{t(description)}</TruncatedParagraph>
          <Space size={8} align="start" wrap className="w-full">
            <TagList keywords={displayKeywords} />
            {remainingKeywords.length > 0 && (
              <Popover content={<TagList keywords={remainingKeywords} />}>
                <span className="cursor-pointer">
                  + {remainingKeywords.length} {t('more', { count: remainingKeywords.length })}
                </span>
              </Popover>
            )}
          </Space>
          <CountsDisplay counts={filteredCounts} fontSize="0.875rem" />
          <Flex gap={12} align="flex-end" className="flex-1">
            <Button icon={<PieChartOutlined />} onClick={onNavigateOverview}>
              {t('Explore')}
            </Button>
          </Flex>
        </Flex>
      </Card>
    );
  } else if (format === 'carousel') {
    inner = (
      <>
        <Flex justify="space-between" align="center">
          <Title level={5} className="mb-0">
            {t(title)}
          </Title>
          <Button size="small" icon={<SolutionOutlined />} className="float-right" onClick={openProvenanceModal}>
            {t('Provenance')}
            <ExpandAltOutlined />
          </Button>
        </Flex>
        <TruncatedParagraph>{t(description)}</TruncatedParagraph>
        <CountsDisplay counts={filteredCounts} fontSize="0.875rem" />
        <Flex gap={8} style={{ marginTop: 8 }}>
          <Button size="small" icon={<PieChartOutlined />} onClick={onNavigateOverview}>
            {t('Explore')}
          </Button>
        </Flex>
      </>
    );
  } else {
    inner = <span className="error-text">UNIMPLEMENTED</span>;
  }

  return (
    <>
      <DatasetProvenanceModal dataset={dataset} open={provenanceModalOpen} onCancel={closeProvenanceModal} />
      {inner}
    </>
  );
};

export default Dataset;
