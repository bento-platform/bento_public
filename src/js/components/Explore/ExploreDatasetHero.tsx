import { Fragment, type ReactNode } from 'react';
import { Button, Flex, Popover, Typography } from 'antd';
import {
  CalendarOutlined,
  DatabaseOutlined,
  SafetyOutlined,
  SolutionOutlined,
  TagOutlined,
  TeamOutlined,
  UserOutlined,
} from '@ant-design/icons';

import { APPLY_FOR_ACCESS_URL, PCGL_MODE } from '@/config';

import { useTranslationFn } from '@/hooks';
import { useScopeQueryData, useScopeDownloadData } from '@/hooks/censorship';
import { useNavigateToSameScopeUrl } from '@/hooks/navigation';
import { getLeads } from '@/features/catalogue/utils';
import type { Dataset } from '@/types/dataset';
import { BentoRoute } from '@/types/routes';

import StatusBadge from '@Util/StatusBadge';
import InteractableText from '@Util/InteractableText';
import DatasetDescription from '@/components/Provenance/DatasetProvenance/DatasetDescription';
import { PersonCard } from '@/components/Provenance/DatasetProvenance/bits';
import DatasetApplyForAccessButton from '@Util/DatasetApplyForAccessButton';
import DatasetGetManifestButton from '@Util/DatasetGetManifestButton';

type RecordRow = { icon: ReactNode; label: string; value: ReactNode };

const ExploreDatasetHero = ({ dataset }: { dataset: Dataset }) => {
  const t = useTranslationFn();
  const navigateToSameScopeUrl = useNavigateToSameScopeUrl();

  const { hasPermission: queryDataPerm, fetchingPermission: fetchingQueryDataPerm } = useScopeQueryData();
  const { hasPermission: downloadDataPerm, fetchingPermission: fetchingDownloadDataPerm } = useScopeDownloadData();

  const statusContextLabel = dataset.study_context ?? null;

  // No dedicated schema field exists yet for a dataset's Data Access Committee identifier; it's carried
  // as a conventional `dac_id` extra property until the dataset schema grows a first-class field for it.
  const dacId = dataset.extra_properties?.dac_id;

  const leads = getLeads(dataset);

  const rows: RecordRow[] = [];
  if (leads.length) {
    rows.push({
      icon: <TeamOutlined aria-hidden="true" />,
      label: t('provenance.record.lead', { count: leads.length }),
      value: (
        <span>
          {leads.map((lead, i) => (
            <Fragment key={lead.name}>
              {i > 0 && ', '}
              <Popover
                placement="bottomLeft"
                classNames={{ container: 'explore-hero-lead-popover' }}
                content={<PersonCard person={lead} compact />}
              >
                <InteractableText className="explore-hero-lead cursor-pointer" tabIndex={0}>
                  {lead.name}
                </InteractableText>
              </Popover>
            </Fragment>
          ))}
        </span>
      ),
    });
  }
  if (dataset.version) {
    rows.push({ icon: <TagOutlined aria-hidden="true" />, label: t('provenance.version'), value: dataset.version });
  }
  if (dataset.release_date) {
    rows.push({
      icon: <CalendarOutlined aria-hidden="true" />,
      label: t('provenance.released'),
      value: dataset.release_date,
    });
  }
  if (dataset.last_modified) {
    rows.push({
      icon: <CalendarOutlined aria-hidden="true" />,
      label: t('provenance.record.last_modified'),
      value: dataset.last_modified,
    });
  }
  if (dataset.privacy) {
    rows.push({
      icon: <SafetyOutlined aria-hidden="true" />,
      label: t('provenance.record.access'),
      value: dataset.privacy,
    });
  }
  if (statusContextLabel || dataset.study_status) {
    rows.push({
      icon: <SolutionOutlined aria-hidden="true" />,
      label: t('provenance.record.status'),
      value: (
        <>
          {statusContextLabel}
          {dataset.study_status && <StatusBadge status={dataset.study_status} />}
        </>
      ),
    });
  }
  rows.push({
    icon: <DatabaseOutlined aria-hidden="true" />,
    label: t('Identifier'),
    value: (
      <Typography.Text className="font-mono text-xs break-all" copyable={{ text: dataset.identifier }}>
        {dataset.identifier}
      </Typography.Text>
    ),
  });
  if (dacId) {
    const dacIdStr = String(dacId);
    rows.push({
      icon: <UserOutlined aria-hidden="true" />,
      label: t('provenance.record.dac_id'),
      value: (
        <Typography.Text className="font-mono text-xs break-all" copyable={{ text: dacIdStr }}>
          {dacIdStr}
        </Typography.Text>
      ),
    });
  }

  return (
    <div className="explore-hero">
      <section className="explore-hero-main shadow rounded-xl distinguished">
        <DatasetDescription dataset={dataset} />
      </section>

      <section className="explore-hero-record shadow rounded-xl">
        <dl className="explore-hero-record-list">
          {rows.map((row) => (
            <div className="explore-hero-record-row" key={row.label}>
              {row.icon}
              <dt className="explore-hero-record-label">{row.label}</dt>
              <dd className="explore-hero-record-value">{row.value}</dd>
            </div>
          ))}
        </dl>
        <Flex gap="medium" className="explore-hero-record-actions">
          <Button
            icon={<SolutionOutlined aria-hidden="true" />}
            block
            className="flex-1"
            onClick={() => navigateToSameScopeUrl(BentoRoute.About, false)}
          >
            {t('About')}
          </Button>
          {APPLY_FOR_ACCESS_URL &&
            !fetchingQueryDataPerm &&
            !fetchingDownloadDataPerm &&
            !queryDataPerm &&
            !downloadDataPerm && <DatasetApplyForAccessButton type="primary" />}
          {PCGL_MODE && downloadDataPerm && !!dataset.counts_by_entity?.experiment_result && (
            <DatasetGetManifestButton />
          )}
        </Flex>
      </section>
    </div>
  );
};

export default ExploreDatasetHero;
