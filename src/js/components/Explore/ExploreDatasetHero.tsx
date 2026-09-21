import { Fragment, type ReactNode } from 'react';
import { Button, Popover, Typography } from 'antd';
import {
  CalendarOutlined,
  DatabaseOutlined,
  SafetyOutlined,
  SolutionOutlined,
  TagOutlined,
  TeamOutlined,
  UserOutlined,
} from '@ant-design/icons';

import { useTranslationFn } from '@/hooks';
import { useNavigateToSameScopeUrl } from '@/hooks/navigation';
import { getLeads } from '@/features/catalogue/utils';
import type { Dataset } from '@/types/dataset';
import { BentoRoute } from '@/types/routes';

import StatusBadge from '@Util/StatusBadge';
import InteractableText from '@Util/InteractableText';
import DatasetDescription from '@/components/Provenance/DatasetProvenance/DatasetDescription';
import { PersonCard } from '@/components/Provenance/DatasetProvenance/bits';

type RecordRow = { icon: ReactNode; label: string; value: ReactNode };

const ExploreDatasetHero = ({ dataset }: { dataset: Dataset }) => {
  const t = useTranslationFn();
  const navigateToSameScopeUrl = useNavigateToSameScopeUrl();

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
            <Fragment key={i}>
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
          {rows.map((row, i) => (
            <div className="explore-hero-record-row" key={i}>
              {row.icon}
              <dt className="explore-hero-record-label">{row.label}</dt>
              <dd className="explore-hero-record-value">{row.value}</dd>
            </div>
          ))}
        </dl>
        <Button
          icon={<SolutionOutlined aria-hidden="true" />}
          block
          className="explore-hero-record-more"
          onClick={() => navigateToSameScopeUrl(BentoRoute.About, false)}
        >
          {t('About')}
        </Button>
      </section>
    </div>
  );
};

export default ExploreDatasetHero;
