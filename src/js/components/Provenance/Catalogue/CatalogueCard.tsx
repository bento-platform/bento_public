import { useState } from 'react';
import { Button, Card, Flex, Tag, Typography, theme } from 'antd';
import { ExperimentOutlined, PieChartOutlined, SolutionOutlined, TeamOutlined } from '@ant-design/icons';
import { BiDna } from 'react-icons/bi';

import type { Project } from '@/types/metadata';
import type { Dataset, StringOrOntologyClass } from '@/types/dataset';
import { BentoRoute } from '@/types/routes';
import { isoDateToString } from '@/utils/strings';
import { useLanguage, useTranslationFn } from '@/hooks';
import { useCatalogueState, normaliseStatus } from '@/features/catalogue/hooks';
import { useNavigateToScope } from '@/hooks/navigation';
import DatasetProvenanceModal from '../DatasetProvenanceModal';
import {
  STATUS_STYLE,
  COLOR_CHART_FALLBACK,
  COLOR_TEXT_SECONDARY,
  COLOR_TEXT_MUTED,
  COLOR_BORDER,
  COLOR_BORDER_HOVER,
  COLOR_BORDER_BASE,
  SHADOW_CARD,
  SHADOW_CARD_HOVER,
} from './constants';

const { Paragraph, Text, Title } = Typography;

const MAX_KEYWORDS = 4;

const keywordLabel = (k: StringOrOntologyClass): string => (typeof k === 'string' ? k : k.label);

const CountItem = ({ icon, value }: { icon: React.ReactNode; value: number }) => (
  <Flex align="center" gap={4}>
    <span style={{ color: COLOR_TEXT_MUTED, fontSize: 13 }}>{icon}</span>
    <Text style={{ fontSize: 13 }}>{value.toLocaleString()}</Text>
  </Flex>
);

const CatalogueCard = ({ dataset, project }: { dataset: Dataset; project: Project }) => {
  const language = useLanguage();
  const t = useTranslationFn();
  const navigateToScope = useNavigateToScope();
  const [provenanceModalOpen, setProvenanceModalOpen] = useState(false);

  const { token } = theme.useToken();
  const { projectColors } = useCatalogueState();

  const { identifier, title, description } = dataset;
  const keywords = (dataset.keywords ?? []).map(keywordLabel).slice(0, MAX_KEYWORDS);
  const updatedStr = isoDateToString(dataset.last_modified ?? project.updated, language);
  const normStatus = normaliseStatus(dataset.study_status);
  const statusStyle = STATUS_STYLE[normStatus];
  const statusLabel = normStatus;
  const projectTitle = project.title;

  const counts = dataset.counts_by_entity;
  const individuals = typeof counts?.individual === 'number' ? counts.individual : 0;
  const biosamples = typeof counts?.biosample === 'number' ? counts.biosample : 0;
  const experiments = typeof counts?.experiment === 'number' ? counts.experiment : 0;

  return (
    <>
      <DatasetProvenanceModal
        dataset={dataset}
        open={provenanceModalOpen}
        onCancel={() => setProvenanceModalOpen(false)}
      />
      <Card
        style={{
          borderRadius: 10,
          border: `1px solid ${COLOR_BORDER}`,
          boxShadow: SHADOW_CARD,
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          transition: 'box-shadow 0.2s, border-color 0.2s',
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
        {/* Header row: title + status pill */}
        <Flex justify="space-between" align="flex-start" gap={8}>
          <Title level={5} style={{ margin: 0, fontSize: 16, fontWeight: 600, flex: 1 }}>
            {t(title)}
          </Title>
          {statusStyle && statusLabel && (
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
              {t(statusLabel)}
            </span>
          )}
        </Flex>

        {/* Sub line: updated date · access */}
        <Paragraph
          ellipsis={{ rows: 2, expandable: true, symbol: <span style={{ color: COLOR_TEXT_MUTED, fontSize: 11.5 }}>more</span> }}
          style={{ fontSize: 11.5, color: COLOR_TEXT_MUTED, marginTop: 4, marginBottom: 0 }}
        >
          {t('Updated')} {updatedStr}
          {dataset.privacy && ` · ${dataset.privacy}`}
        </Paragraph>

        {/* Project pill */}
        {projectTitle && (
          <div style={{ marginTop: 8, alignSelf: 'flex-start' }}>
            <button
              type="button"
              className="project-pill"
              onClick={(e) => {
                e.stopPropagation();
                navigateToScope({ project: project.identifier }, BentoRoute.Overview);
              }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                fontSize: 11.5,
                fontWeight: 600,
                color: COLOR_TEXT_SECONDARY,
                border: `1px solid ${COLOR_BORDER_BASE}`,
                borderRadius: 20,
                padding: '2px 9px 2px 7px',
                background: 'none',
                cursor: 'pointer',
                fontFamily: 'inherit',
              }}
            >
              <span
                style={{
                  width: 7,
                  height: 7,
                  borderRadius: '50%',
                  background: projectColors[projectTitle] ?? COLOR_CHART_FALLBACK,
                  flexShrink: 0,
                }}
              />
              {projectTitle}
            </button>
          </div>
        )}

        {/* Description */}
        {description && (
          <Paragraph
            ellipsis={{ rows: 5, expandable: true, symbol: <span style={{ color: COLOR_TEXT_SECONDARY, fontSize: 13 }}>more</span> }}
            style={{ fontSize: 13, color: COLOR_TEXT_SECONDARY, marginTop: 10, marginBottom: 0 }}
          >
            {t(description)}
          </Paragraph>
        )}

        {/* Keywords */}
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

        {/* Spacer pushes counts + actions to bottom */}
        <div style={{ flex: 1 }} />

        {/* Counts row */}
        {(individuals > 0 || biosamples > 0 || experiments > 0) && (
          <Flex
            gap={12}
            wrap
            style={{
              borderTop: `1px solid ${COLOR_BORDER}`,
              marginTop: 12,
              paddingTop: 10,
            }}
          >
            {individuals > 0 && <CountItem icon={<TeamOutlined />} value={individuals} />}
            {biosamples > 0 && <CountItem icon={<BiDna />} value={biosamples} />}
            {experiments > 0 && <CountItem icon={<ExperimentOutlined />} value={experiments} />}
          </Flex>
        )}

        {/* Actions row */}
        <Flex gap={8} style={{ marginTop: 12 }}>
          <Button
            type="primary"
            icon={<PieChartOutlined />}
            style={{ flex: 1 }}
            onClick={() => navigateToScope({ project: project.identifier, dataset: identifier }, BentoRoute.Overview)}
          >
            {t('Explore')}
          </Button>
          <Button icon={<SolutionOutlined />} style={{ flex: 1 }} onClick={() => setProvenanceModalOpen(true)}>
            {t('Provenance')}
          </Button>
        </Flex>
      </Card>
    </>
  );
};

export default CatalogueCard;
