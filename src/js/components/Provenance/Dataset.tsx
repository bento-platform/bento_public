import { lazy, Suspense, type ReactNode, useCallback, useMemo, useState } from 'react';

import { Avatar, Button, Card, Flex, List, Typography } from 'antd';
import { PieChartOutlined, SolutionOutlined } from '@ant-design/icons';
import { FaDatabase } from 'react-icons/fa';

import { downloadData, queryData } from 'bento-auth-js';
import { APPLY_FOR_ACCESS_URL, PCGL_MODE } from '@/config';
import type { DiscoveryScope } from '@/features/metadata/metadata.store';
import type { Dataset } from '@/types/dataset';
import type { Project } from '@/types/metadata';
import { BentoRoute } from '@/types/routes';
import type { KatsuEntityCountsOrBooleans } from '@/types/entities';
import type { ResourcePermissionsState } from '@/features/auth/hooks';
import { getCurrentPage } from '@/utils/router';
import { useLanguage, useTranslationFn } from '@/hooks';
import { useNavigateToScope } from '@/hooks/navigation';
import { nonEmptyCounts } from '@/utils/counts';
import { isoDateToString } from '@/utils/strings';
import CountsDisplay from '@Util/CountsDisplay';
import DatasetApplyForAccessButton from '@Util/DatasetApplyForAccessButton';
import StatusBadge from '@Util/StatusBadge';
import TruncatedParagraph from '@Util/TruncatedParagraph';
import KeywordList from './KeywordList';
import ProgramPill from './Catalogue/ProgramPill';
import ProjectPill from './Catalogue/ProjectPill';
import DatasetGetManifestButton from '@Util/DatasetGetManifestButton';

const { Title, Text, Paragraph } = Typography;

const MAX_KEYWORDS = 4;

// Lazy-loaded: pulls in the Leaflet-based spatial coverage map, so it shouldn't be part of the bundle every
// catalogue-page visitor downloads for what's a rarely-opened modal (one instance imported per Dataset card).
const DatasetProvenanceModal = lazy(() => import('./DatasetProvenance/DatasetProvenanceModal'));

const Dataset = ({
  parentProjectID,
  dataset,
  format,
  project,
  selected,
  filteredCounts,
  fromProject,
  permissionsData,
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
  // Permissions data injected from bulk fetch. TODO: move to some kind of BFF shared cache state to avoid re-fetching.
  permissionsData?: ResourcePermissionsState;
}) => {
  const language = useLanguage();
  const navigateToScope = useNavigateToScope();
  const page = getCurrentPage();
  const t = useTranslationFn();

  const [provenanceModalOpen, setProvenanceModalOpen] = useState(false);
  // Track whether the modal has ever been opened so we only start fetching its (lazy-loaded) code once the
  // user actually asks for it, rather than on every Dataset card render.
  const [hasOpenedProvenanceModal, setHasOpenedProvenanceModal] = useState(false);

  const { identifier, title, description, program_name: program } = dataset;
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
  const onNavigateExplore = useCallback(
    () => navigateToScope(scope, BentoRoute.Explore, false, navigateOptions),
    [navigateToScope, scope, navigateOptions]
  );

  const openProvenanceModal = useCallback(() => {
    setHasOpenedProvenanceModal(true);
    setProvenanceModalOpen(true);
  }, []);
  const closeProvenanceModal = useCallback(() => setProvenanceModalOpen(false), []);

  const counts = filteredCounts ?? dataset.counts_by_entity;
  const hasData = nonEmptyCounts(dataset.counts_by_entity);
  const faded = !!filteredCounts && Object.values(filteredCounts).every((c) => !c) && hasData;
  const canDownloadData = permissionsData?.permissions.includes(downloadData) ?? false;

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
    // Fall back to database record update timestamp
    const updatedDate = dataset.last_modified ?? dataset.updated_at;
    const updatedStr = updatedDate ? isoDateToString(updatedDate, language) : undefined;

    inner = (
      <Card className="catalogue-card" style={{ opacity: faded ? 0.5 : undefined }}>
        <Flex justify="space-between" align="flex-start" gap={8}>
          <Title level={3} className="h-as-5 catalogue-card__title">
            {t(title)}
          </Title>
          {dataset.study_status && <StatusBadge status={dataset.study_status} />}
        </Flex>

        {updatedStr && (
          <Text className="catalogue-card__meta">
            {t('Updated')} {updatedStr}
            {dataset.privacy && ` · ${dataset.privacy}`}
          </Text>
        )}

        {PCGL_MODE ? program && <ProgramPill program={program} /> : project && <ProjectPill project={project} />}

        {description && (
          <Paragraph
            ellipsis={{
              rows: 3,
              expandable: true,
              symbol: <span className="catalogue-card__expand-symbol">{t('dataset.expand')}</span>,
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

        <Flex gap={8} className="catalogue-card__actions mt-3" wrap>
          <Button icon={<SolutionOutlined />} className="flex-1" onClick={openProvenanceModal}>
            {t('About')}
          </Button>
          {hasData && (
            // hasData checks counts_by_entity, which is a proxy for having dataset-level counts permissions, but we
            // load them earlier than permissions so we 'cheat' a little (don't explicitly check permissions) to avoid
            // rendering flicker.
            <Button type="primary" icon={<PieChartOutlined />} className="flex-1" onClick={onNavigateExplore}>
              {t('Explore')}
            </Button>
          )}
          {/* mutually-exclusive buttons; either:
               - applying for access (if the instance provides an application URL), or
               - downloading a PCGL-formatted file manifest (if PCGL_MODE is on, and we have download:data permissions)
            */}
          {APPLY_FOR_ACCESS_URL &&
            permissionsData?.hasAttempted &&
            !permissionsData.permissions.includes(queryData) &&
            !canDownloadData && <DatasetApplyForAccessButton />}
          {PCGL_MODE &&
            permissionsData?.hasAttempted &&
            canDownloadData &&
            !!dataset.counts_by_entity?.experiment_result && <DatasetGetManifestButton scope={scope} />}
        </Flex>
      </Card>
    );
  } else {
    inner = <span className="error-text">UNIMPLEMENTED</span>;
  }

  return (
    <>
      {hasOpenedProvenanceModal && (
        <Suspense fallback={null}>
          <DatasetProvenanceModal dataset={dataset} open={provenanceModalOpen} onCancel={closeProvenanceModal} />
        </Suspense>
      )}
      {inner}
    </>
  );
};

export default Dataset;
