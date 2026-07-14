import { type ReactNode, useCallback, useMemo, useState } from 'react';

import { Avatar, Button, Card, Flex, List, Typography } from 'antd';
import { PieChartOutlined, SolutionOutlined } from '@ant-design/icons';
import { FaDatabase } from 'react-icons/fa';

import type { DiscoveryScope } from '@/features/metadata/metadata.store';
import type { Dataset } from '@/types/dataset';
import type { Project } from '@/types/metadata';
import { BentoRoute } from '@/types/routes';
import type { KatsuEntityCountsOrBooleans } from '@/types/entities';
import { getCurrentPage } from '@/utils/router';
import { useLanguage, useTranslationFn } from '@/hooks';
import { useNavigateToScope } from '@/hooks/navigation';
import { nonEmptyCounts } from '@/utils/counts';
import { isoDateToString } from '@/utils/strings';
import StatusBadge from '@/components/Util/StatusBadge';
import TruncatedParagraph from '@/components/Util/TruncatedParagraph';
import CountsDisplay from '@/components/Util/CountsDisplay';
import DatasetProvenanceModal from './Modal/DatasetProvenanceModal';
import KeywordList from './KeywordList';
import ProjectPill from './Catalogue/ProjectPill';

const { Title, Text, Paragraph } = Typography;

const MAX_KEYWORDS = 4;

const Dataset = ({
  parentProjectID,
  dataset,
  format,
  project,
  selected,
  filteredCounts,
  fromProject,
}: {
  parentProjectID: string;
  dataset: Dataset;
  format: 'list-item' | 'card';
  project?: Project;
  selected?: boolean;
  filteredCounts?: KatsuEntityCountsOrBooleans;
  // Whether this dataset is being linked to from within its parent project's own page - used to inform the
  // dataset scope's back button (in PCGL mode, it otherwise defaults to going back to the catalogue).
  fromProject?: boolean;
}) => {
  const language = useLanguage();
  const navigateToScope = useNavigateToScope();
  const page = getCurrentPage();
  const t = useTranslationFn();

  const [provenanceModalOpen, setProvenanceModalOpen] = useState(false);

  const { identifier, title, description } = dataset;
  const keywords = dataset.keywords ?? [];

  const scope: DiscoveryScope = useMemo(
    () => ({ project: parentProjectID, dataset: identifier }),
    [parentProjectID, identifier]
  );
  const navigateOptions = useMemo(
    () => (fromProject ? { state: { fromProjectScope: true } } : undefined),
    [fromProject]
  );

  const onNavigateCurrent = useCallback(
    () => navigateToScope(scope, page, false, navigateOptions),
    [navigateToScope, scope, page, navigateOptions]
  );
  const onNavigateOverview = useCallback(
    () => navigateToScope(scope, BentoRoute.Overview, false, navigateOptions),
    [navigateToScope, scope, navigateOptions]
  );

  const openProvenanceModal = useCallback(() => setProvenanceModalOpen(true), []);
  const closeProvenanceModal = useCallback(() => setProvenanceModalOpen(false), []);

  const counts = filteredCounts ?? dataset.counts_by_entity;
  const hasData = nonEmptyCounts(dataset.counts_by_entity);
  const faded = filteredCounts && Object.values(filteredCounts).every((c) => !c) && hasData;

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
    const updatedDate = dataset.last_modified ?? project?.updated;
    const updatedStr = updatedDate ? isoDateToString(updatedDate, language) : undefined;

    inner = (
      <Card className="catalogue-card" style={{ opacity: faded ? 0.5 : undefined }}>
        <Flex justify="space-between" align="flex-start" gap={8}>
          <Title level={5} className="catalogue-card__title">
            {t(title)}
          </Title>
          <StatusBadge status={dataset.study_status} />
        </Flex>

        {updatedStr && (
          <Text className="catalogue-card__meta">
            {t('Updated')} {updatedStr}
            {dataset.privacy && ` · ${dataset.privacy}`}
          </Text>
        )}

        {project && <ProjectPill project={project} />}

        {description && (
          <Paragraph
            ellipsis={{
              rows: 3,
              expandable: true,
              symbol: <span className="catalogue-card__expand-symbol">{t('catalogue.datasets.expand')}</span>,
            }}
            className="catalogue-card__description"
          >
            {t(description)}
          </Paragraph>
        )}

        <KeywordList keywords={keywords} max={MAX_KEYWORDS} className="mt-2" />

        <div className="flex-1" />

        {counts && (
          <div className="catalogue-card__counts-row">
            <CountsDisplay counts={counts} totalCounts={filteredCounts ? dataset.counts_by_entity : undefined} />
          </div>
        )}

        <Flex gap={8} className="mt-3">
          {hasData && (
            <Button type="primary" icon={<PieChartOutlined />} className="flex-1" onClick={onNavigateOverview}>
              {t('Explore')}
            </Button>
          )}
          <Button icon={<SolutionOutlined />} className="flex-1" onClick={openProvenanceModal}>
            {t('Provenance')}
          </Button>
        </Flex>
      </Card>
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
