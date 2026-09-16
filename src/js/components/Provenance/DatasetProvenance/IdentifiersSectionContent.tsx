import { Flex, Typography } from 'antd';
import { CodeOutlined, GlobalOutlined } from '@ant-design/icons';
import KeyValueDisplay, { type KeyValueItem } from '@Util/KeyValueDisplay';

import { useTranslationFn } from '@/hooks';
import type { Dataset } from '@/types/dataset';

type IdentifiersSectionContentProps = {
  dataset: Dataset;
};

const IdentifiersSectionContent = ({ dataset }: IdentifiersSectionContentProps) => {
  const t = useTranslationFn();

  const resources = dataset.resources ?? [];

  const kvItems: KeyValueItem[] = [
    {
      label: t('Identifier'),
      value: (
        <>
          {dataset.identifier} <Typography.Text copyable={{ text: dataset.identifier }} />
        </>
      ),
      valueClassName: 'font-mono text-xs',
    },
    {
      label: t('provenance.schema_version'),
      value: dataset.schema_version,
    },
    {
      label: t('provenance.project_id'),
      value: (
        <>
          {dataset.project} <Typography.Text copyable={{ text: dataset.project }} />
        </>
      ),
      valueClassName: 'font-mono text-xs',
    },
  ];

  if (dataset.program_name) {
    kvItems.push({ label: t('provenance.program_name'), value: dataset.program_name });
  }

  if (resources.length > 0) {
    kvItems.push({
      label: t('provenance.ontology_resources'),
      value: (
        <>
          {resources.map((r, i) => (
            <div key={i} className="pm-res-row">
              <span className="pm-pfx" aria-label={t('provenance.namespace_prefix')}>
                {r.namespace_prefix}
              </span>
              <span aria-label={t('general.name')}>{r.name}</span>
              <span aria-hidden>·</span>
              <span className="pm-res-ver" aria-label={t('provenance.version')}>
                {r.version}
              </span>
              {r.url && (
                <a href={r.url} target="_blank" rel="noreferrer" title={t('provenance.ontology_resources')}>
                  <GlobalOutlined style={{ fontSize: 11 }} />
                </a>
              )}
              {r.repository_url && (
                <a href={r.repository_url} target="_blank" rel="noreferrer" title={t('provenance.repository')}>
                  <CodeOutlined style={{ fontSize: 11 }} />
                </a>
              )}
            </div>
          ))}
        </>
      ),
      span: true,
    });
  }

  if (dataset.extra_properties && Object.keys(dataset.extra_properties).length > 0) {
    kvItems.push({
      label: t('general.extra_properties'),
      value: (
        <Flex wrap gap={6} className="mt-6px">
          {Object.entries(dataset.extra_properties).map(([k, v]) => (
            <span key={k} className="pm-grant">
              {k} · {String(v ?? '')}
            </span>
          ))}
        </Flex>
      ),
      span: true,
    });
  }

  return <KeyValueDisplay items={kvItems} />;
};

export default IdentifiersSectionContent;
