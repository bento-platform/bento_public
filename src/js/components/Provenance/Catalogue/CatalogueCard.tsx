import { useState } from 'react';
import { Button, Card, Flex, Tag, Typography, theme } from 'antd';
import { ExperimentOutlined, PieChartOutlined, SolutionOutlined, TeamOutlined } from '@ant-design/icons';
import { BiDna } from 'react-icons/bi';

import type { Project } from '@/types/metadata';
import type { Dataset, StringOrOntologyClass } from '@/types/dataset';
import { BentoRoute } from '@/types/routes';
import { isoDateToString } from '@/utils/strings';
import { useLanguage, useTranslationFn } from '@/hooks';
import { useNavigateToScope } from '@/hooks/navigation';
import DatasetProvenanceModal from '../DatasetProvenanceModal';

const { Text, Title } = Typography;

const MAX_KEYWORDS = 4;

const keywordLabel = (k: StringOrOntologyClass): string => (typeof k === 'string' ? k : k.label);

const STATUS_STYLE: Record<string, { color: string; bg: string; border: string }> = {
  ONGOING: { color: '#389E0D', bg: '#F6FFED', border: '#B7EB8F' },
  COMPLETED: { color: '#054A74', bg: 'rgba(5,74,116,0.10)', border: '#91CAFF' },
  DRAFT: { color: '#A5640E', bg: '#FFF7E6', border: '#FFD591' },
};

const STATUS_LABEL: Record<string, string> = {
  ONGOING: 'Ongoing',
  COMPLETED: 'Completed',
  DRAFT: 'Draft',
};

const PROGRAM_DOT_COLOR: Record<string, string> = {
  MOHCCN: '#1677FF',
  CPHI: '#13C2C2',
};

const CountItem = ({ icon, value }: { icon: React.ReactNode; value: number }) => (
  <Flex align="center" gap={4}>
    <span style={{ color: 'rgba(0,0,0,0.45)', fontSize: 13 }}>{icon}</span>
    <Text style={{ fontSize: 13 }}>{value.toLocaleString()}</Text>
  </Flex>
);

const CatalogueCard = ({ dataset, project }: { dataset: Dataset; project: Project }) => {
  const language = useLanguage();
  const t = useTranslationFn();
  const navigateToScope = useNavigateToScope();
  const [provenanceModalOpen, setProvenanceModalOpen] = useState(false);

  const { token } = theme.useToken();

  const { identifier, title, description } = dataset;
  const keywords = (dataset.keywords ?? []).map(keywordLabel).slice(0, MAX_KEYWORDS);
  const updatedStr = isoDateToString(dataset.last_modified ?? project.updated, language);
  const statusStyle = dataset.study_status ? STATUS_STYLE[dataset.study_status] : null;
  const statusLabel = dataset.study_status ? STATUS_LABEL[dataset.study_status] : null;
  const programName = dataset.program_name;

  const counts = dataset.counts_by_entity;
  const individuals = typeof counts?.individual === 'number' ? counts.individual : 0;
  const biosamples = typeof counts?.biosample === 'number' ? counts.biosample : 0;
  const experiments = typeof counts?.experiment === 'number' ? counts.experiment : 0;

  return (
    <>
      <DatasetProvenanceModal dataset={dataset} open={provenanceModalOpen} onCancel={() => setProvenanceModalOpen(false)} />
      <Card
        style={{
          borderRadius: 10,
          border: '1px solid #F0F0F0',
          boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          transition: 'box-shadow 0.2s, border-color 0.2s',
        }}
        styles={{ body: { display: 'flex', flexDirection: 'column', height: '100%', padding: 16, gap: 0 } }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLElement).style.borderColor = '#E2E8EE';
          (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 14px rgba(5,74,116,0.10)';
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLElement).style.borderColor = '#F0F0F0';
          (e.currentTarget as HTMLElement).style.boxShadow = '0 2px 10px rgba(0,0,0,0.05)';
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
        <Text style={{ fontSize: 11.5, color: 'rgba(0,0,0,0.45)', marginTop: 4 }}>
          {t('Updated')} {updatedStr}
          {dataset.privacy && ` · ${dataset.privacy}`}
        </Text>

        {/* Program pill */}
        {programName && (
          <div style={{ marginTop: 8, alignSelf: 'flex-start' }}>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 5,
                fontSize: 12,
                border: '1px solid #D9D9D9',
                borderRadius: 20,
                padding: '1px 8px',
              }}
            >
              <span
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: '50%',
                  background: PROGRAM_DOT_COLOR[programName] ?? '#8C8C8C',
                  flexShrink: 0,
                }}
              />
              {programName}
            </span>
          </div>
        )}

        {/* Description */}
        {description && (
          <Text
            style={{
              fontSize: 13,
              color: 'rgba(0,0,0,0.65)',
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
              borderTop: '1px solid #F0F0F0',
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
