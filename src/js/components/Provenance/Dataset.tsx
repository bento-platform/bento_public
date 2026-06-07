import { type ReactNode, useCallback, useMemo, useState } from 'react';

import { Avatar, Button, Card, Flex, List, Tag, Typography, theme } from 'antd';
import {
  ExperimentOutlined,
  ExpandAltOutlined,
  PieChartOutlined,
  SolutionOutlined,
  TeamOutlined,
} from '@ant-design/icons';
import { FaDatabase } from 'react-icons/fa';
import { BiDna } from 'react-icons/bi';

import type { DiscoveryScope } from '@/features/metadata/metadata.store';
import type { Dataset } from '@/types/dataset';
import type { OntologyTerm } from '@/types/ontology';
import { BentoRoute } from '@/types/routes';
import type { KatsuEntityCountsOrBooleans } from '@/types/entities';
import { getCurrentPage } from '@/utils/router';
import { useLanguage, useTranslationFn } from '@/hooks';
import { useNavigateToScope } from '@/hooks/navigation';
import { normaliseStatus } from '@/features/catalogue/hooks';
import { isoDateToString } from '@/utils/strings';
import TruncatedParagraph from '@/components/Util/TruncatedParagraph';
import CountsDisplay from '@/components/Util/CountsDisplay';
import DatasetProvenanceModal from './DatasetProvenanceModal';
import {
  STATUS_STYLE,
  COLOR_TEXT_MUTED,
  COLOR_TEXT_SECONDARY,
  COLOR_BORDER,
  COLOR_BORDER_HOVER,
  SHADOW_CARD,
  SHADOW_CARD_HOVER,
} from './Catalogue/constants';

const { Title, Text } = Typography;

const MAX_KEYWORDS = 4;

const keywordLabel = (k: string | OntologyTerm): string => (typeof k === 'string' ? k : k.label);

const CountItem = ({ icon, value }: { icon: React.ReactNode; value: number }) => (
  <Flex align="center" gap={4}>
    <span style={{ color: COLOR_TEXT_MUTED, fontSize: 13 }}>{icon}</span>
    <Text style={{ fontSize: 13 }}>{value.toLocaleString()}</Text>
  </Flex>
);

const Dataset = ({
  parentProjectID,
  dataset,
  format,
  selected,
  filteredCounts,
}: {
  parentProjectID: string;
  dataset: Dataset;
  format: 'list-item' | 'card' | 'carousel';
  selected?: boolean;
  filteredCounts?: KatsuEntityCountsOrBooleans;
}) => {
  const language = useLanguage();
  const navigateToScope = useNavigateToScope();
  const page = getCurrentPage();
  const t = useTranslationFn();
  const { token } = theme.useToken();

  const [provenanceModalOpen, setProvenanceModalOpen] = useState(false);

  const { identifier, title, description } = dataset;
  const keywords = (dataset.keywords ?? []).map(keywordLabel).slice(0, MAX_KEYWORDS);

  const scope: DiscoveryScope = useMemo(
    () => ({ project: parentProjectID, dataset: identifier }),
    [parentProjectID, identifier]
  );

  const onNavigateCurrent = useCallback(() => navigateToScope(scope, page), [navigateToScope, scope, page]);
  const onNavigateOverview = useCallback(() => navigateToScope(scope, BentoRoute.Overview), [navigateToScope, scope]);

  const openProvenanceModal = useCallback(() => setProvenanceModalOpen(true), []);
  const closeProvenanceModal = useCallback(() => setProvenanceModalOpen(false), []);

  const counts = filteredCounts ?? dataset.counts_by_entity;
  const faded =
    filteredCounts &&
    dataset.counts_by_entity &&
    Object.values(filteredCounts).every((c) => !c) &&
    Object.values(dataset.counts_by_entity).some((c) => !!c);

  const individuals = typeof counts?.individual === 'number' ? counts.individual : 0;
  const biosamples = typeof counts?.biosample === 'number' ? counts.biosample : 0;
  const experiments = typeof counts?.experiment === 'number' ? counts.experiment : 0;

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
    const normStatus = normaliseStatus(dataset.study_status);
    const statusStyle = STATUS_STYLE[normStatus];
    const updatedStr = dataset.last_modified ? isoDateToString(dataset.last_modified, language) : undefined;

    inner = (
      <Card
        style={{
          borderRadius: 10,
          border: `1px solid ${COLOR_BORDER}`,
          boxShadow: SHADOW_CARD,
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          transition: 'box-shadow 0.2s, border-color 0.2s',
          opacity: faded ? 0.5 : undefined,
        }}
        styles={{ body: { display: 'flex', flexDirection: 'column', height: '100%', padding: 16, gap: 0 } }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLElement).style.borderColor = COLOR_BORDER_HOVER;
          (e.currentTarget as HTMLElement).style.boxShadow = SHADOW_CARD_HOVER;
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLElement).style.borderColor = COLOR_BORDER;
          (e.currentTarget as HTMLElement).style.boxShadow = SHADOW_CARD;
        }}
      >
        <Flex justify="space-between" align="flex-start" gap={8}>
          <Title level={5} style={{ margin: 0, fontSize: 16, fontWeight: 600, flex: 1 }}>
            {t(title)}
          </Title>
          {statusStyle && (
            <span
              style={{
                flexShrink: 0,
                fontSize: 11,
                fontWeight: 600,
                padding: '1px 8px',
                borderRadius: 10,
                color: statusStyle.color,
                background: statusStyle.bg,
                border: `1px solid ${statusStyle.border}`,
                whiteSpace: 'nowrap',
              }}
            >
              {t(normStatus)}
            </span>
          )}
        </Flex>

        {updatedStr && (
          <Text style={{ fontSize: 11.5, color: COLOR_TEXT_MUTED, marginTop: 4 }}>
            {t('Updated')} {updatedStr}
            {dataset.privacy && ` · ${dataset.privacy}`}
          </Text>
        )}

        {description && (
          <Text
            style={{
              fontSize: 13,
              color: COLOR_TEXT_SECONDARY,
              marginTop: 10,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {t(description)}
          </Text>
        )}

        {keywords.length > 0 && (
          <div style={{ marginTop: 8, display: 'flex', flexWrap: 'wrap', gap: 4 }}>
            {keywords.map((kw) => (
              <Tag
                key={kw}
                style={{
                  fontSize: 11,
                  borderRadius: 4,
                  background: token.colorPrimaryBg,
                  color: token.colorPrimary,
                  border: `1px solid ${token.colorPrimaryBorder}`,
                  margin: 0,
                }}
              >
                {kw}
              </Tag>
            ))}
          </div>
        )}

        <div style={{ flex: 1 }} />

        {(individuals > 0 || biosamples > 0 || experiments > 0) && (
          <Flex gap={12} wrap style={{ borderTop: `1px solid ${COLOR_BORDER}`, marginTop: 12, paddingTop: 10 }}>
            {individuals > 0 && <CountItem icon={<TeamOutlined />} value={individuals} />}
            {biosamples > 0 && <CountItem icon={<BiDna />} value={biosamples} />}
            {experiments > 0 && <CountItem icon={<ExperimentOutlined />} value={experiments} />}
          </Flex>
        )}

        <Flex gap={8} style={{ marginTop: 12 }}>
          <Button type="primary" icon={<PieChartOutlined />} style={{ flex: 1 }} onClick={onNavigateOverview}>
            {t('Explore')}
          </Button>
          <Button icon={<SolutionOutlined />} style={{ flex: 1 }} onClick={openProvenanceModal}>
            {t('Provenance')}
          </Button>
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
