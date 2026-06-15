import { useState } from 'react';
import { Button, Card, Flex, Typography } from 'antd';
import { ExperimentOutlined, PieChartOutlined, SolutionOutlined, TeamOutlined } from '@ant-design/icons';
import { BiDna } from 'react-icons/bi';

import type { Project } from '@/types/metadata';
import type { Dataset, StringOrOntologyClass } from '@/types/dataset';
import { BentoRoute } from '@/types/routes';
import { isoDateToString } from '@/utils/strings';
import { useLanguage, useTranslationFn } from '@/hooks';
import { useCatalogueState } from '@/features/catalogue/hooks';
import { useNavigateToScope } from '@/hooks/navigation';
import CountItem from '@/components/Util/CountItem';
import ProvenanceTag from '@/components/Util/ProvenanceTag';
import StatusBadge from '@/components/Util/StatusBadge';
import DatasetProvenanceModal from '../DatasetProvenanceModal';
import { COLOR_CHART_FALLBACK } from './constants';

const { Paragraph, Title } = Typography;

const MAX_KEYWORDS = 4;

const keywordLabel = (k: StringOrOntologyClass): string => (typeof k === 'string' ? k : k.label);

const CatalogueCard = ({ dataset, project }: { dataset: Dataset; project: Project }) => {
  const language = useLanguage();
  const t = useTranslationFn();
  const navigateToScope = useNavigateToScope();
  const [provenanceModalOpen, setProvenanceModalOpen] = useState(false);

  const { projectColors } = useCatalogueState();

  const { identifier, title, description } = dataset;
  const keywords = (dataset.keywords ?? []).map(keywordLabel).slice(0, MAX_KEYWORDS);
  const updatedStr = isoDateToString(dataset.last_modified ?? project.updated, language);
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
      <Card className="catalogue-card">
        {/* Header row: title + status pill */}
        <Flex justify="space-between" align="flex-start" gap={8}>
          <Title level={5} className="catalogue-card__title">
            {t(title)}
          </Title>
          <StatusBadge status={dataset.study_status} />
        </Flex>

        {/* Sub line: updated date · access */}
        <Paragraph
          ellipsis={{
            rows: 2,
            expandable: true,
            symbol: <span className="catalogue-card__expand-symbol">more</span>,
          }}
          className="catalogue-card__meta"
        >
          {t('Updated')} {updatedStr}
          {dataset.privacy && ` · ${dataset.privacy}`}
        </Paragraph>

        {/* Project pill */}
        {projectTitle && (
          <div className="mt-2 self-start">
            <button
              type="button"
              className="project-pill"
              onClick={(e) => {
                e.stopPropagation();
                navigateToScope({ project: project.identifier }, BentoRoute.Overview);
              }}
            >
              <span
                className="project-pill__dot"
                style={{ background: projectColors[projectTitle] ?? COLOR_CHART_FALLBACK }}
              />
              {projectTitle}
            </button>
          </div>
        )}

        {/* Description */}
        {description && (
          <Paragraph
            ellipsis={{
              rows: 5,
              expandable: true,
              symbol: <span className="catalogue-card__description">more</span>,
            }}
            className="catalogue-card__description"
          >
            {t(description)}
          </Paragraph>
        )}

        {/* Keywords */}
        {keywords.length > 0 && (
          <Flex wrap gap={4} className="mt-2">
            {keywords.map((kw) => (
              <ProvenanceTag key={kw}>{kw}</ProvenanceTag>
            ))}
          </Flex>
        )}

        {/* Spacer pushes counts + actions to bottom */}
        <div className="flex-1" />

        {/* Counts row */}
        {(individuals > 0 || biosamples > 0 || experiments > 0) && (
          <Flex gap={12} wrap className="catalogue-card__counts-row">
            {individuals > 0 && <CountItem icon={<TeamOutlined />} value={individuals} />}
            {biosamples > 0 && <CountItem icon={<BiDna />} value={biosamples} />}
            {experiments > 0 && <CountItem icon={<ExperimentOutlined />} value={experiments} />}
          </Flex>
        )}

        {/* Actions row */}
        <Flex gap={8} className="mt-3">
          <Button
            type="primary"
            icon={<PieChartOutlined />}
            className="flex-1"
            onClick={() => navigateToScope({ project: project.identifier, dataset: identifier }, BentoRoute.Overview)}
          >
            {t('Explore')}
          </Button>
          <Button icon={<SolutionOutlined />} className="flex-1" onClick={() => setProvenanceModalOpen(true)}>
            {t('Provenance')}
          </Button>
        </Flex>
      </Card>
    </>
  );
};

export default CatalogueCard;
