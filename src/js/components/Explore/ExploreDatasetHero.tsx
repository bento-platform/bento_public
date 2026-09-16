import type { ReactNode } from 'react';
import { Typography } from 'antd';
import { Link } from 'react-router-dom';
import {
  ArrowRightOutlined,
  CalendarOutlined,
  DatabaseOutlined,
  SafetyOutlined,
  SolutionOutlined,
  TagOutlined,
  UserOutlined,
} from '@ant-design/icons';

import { useTranslationFn } from '@/hooks';
import { useCurrentScopePrefixedUrl } from '@/hooks/navigation';
import { normaliseStatus, statusTranslationKey, studyContextTranslationKey } from '@/features/catalogue/utils';
import type { Dataset } from '@/types/dataset';
import { BentoRoute } from '@/types/routes';

import StatusBadge from '@Util/StatusBadge';
import DatasetDescription from '@/components/Provenance/DatasetProvenance/DatasetDescription';

type RecordRow = { icon: ReactNode; label: string; value: ReactNode };

const ExploreDatasetHero = ({ dataset }: { dataset: Dataset }) => {
  const t = useTranslationFn();
  const aboutUrl = useCurrentScopePrefixedUrl(BentoRoute.About);

  const contextValue = [
    dataset.study_context ? t(studyContextTranslationKey(dataset.study_context)) : null,
    dataset.study_status ? t(statusTranslationKey(normaliseStatus(dataset.study_status))) : null,
  ]
    .filter(Boolean)
    .join(' · ');

  // No dedicated schema field exists yet for a dataset's Data Access Committee identifier; it's carried
  // as a conventional `dac_id` extra property until the dataset schema grows a first-class field for it.
  const dacId = dataset.extra_properties?.dac_id;

  const rows: RecordRow[] = [];
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
  if (contextValue) {
    rows.push({
      icon: <SolutionOutlined aria-hidden="true" />,
      label: t('provenance.record.context'),
      value: contextValue,
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
        <div className="explore-hero-eyebrow">
          <DatabaseOutlined />
          <Typography.Title level={2} className="explore-hero-title">
            {t(dataset.title)}
          </Typography.Title>
          {dataset.study_status && <StatusBadge status={dataset.study_status} />}
        </div>
        <DatasetDescription dataset={dataset} />
      </section>

      <section className="explore-hero-record shadow rounded-xl" aria-labelledby="explore-hero-record-cap">
        <div className="explore-hero-record-cap" id="explore-hero-record-cap">
          {t('provenance.record.title')}
        </div>
        <dl className="explore-hero-record-list">
          {rows.map((row, i) => (
            <div className="explore-hero-record-row" key={i}>
              {row.icon}
              <dt className="explore-hero-record-label">{row.label}</dt>
              <dd className="explore-hero-record-value">{row.value}</dd>
            </div>
          ))}
        </dl>
        <Link to={aboutUrl} className="explore-hero-record-more">
          <SolutionOutlined aria-hidden="true" />
          {t('About')}
          <ArrowRightOutlined aria-hidden="true" />
        </Link>
      </section>
    </div>
  );
};

export default ExploreDatasetHero;
