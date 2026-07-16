import { Flex } from 'antd';
import { ExportOutlined } from '@ant-design/icons';
import KeyValueDisplay, { type KeyValueItem } from '@Util/KeyValueDisplay';
import { CopyButton } from './cards';

import { useTranslationFn } from '@/hooks';
import type { Dataset } from '@/types/dataset';

type IdentifiersSectionContentProps = {
  dataset: Dataset;
  copiedKey: string | null;
  onCopy: (value: string, id: string) => void;
};

const IdentifiersSectionContent = ({ dataset, copiedKey, onCopy }: IdentifiersSectionContentProps) => {
  const t = useTranslationFn();

  const resources = dataset.resources ?? [];

  const kvItems: KeyValueItem[] = [
    {
      label: t('Identifier'),
      value: (
        <>
          {dataset.identifier}{' '}
          <CopyButton
            value={dataset.identifier}
            id={`dataset-${dataset.identifier}`}
            copiedKey={copiedKey}
            onCopy={onCopy}
          />
        </>
      ),
      valueClassName: 'mono',
    },
    {
      label: t('provenance.schema_version'),
      value: dataset.schema_version,
    },
    {
      label: t('provenance.project_id'),
      value: dataset.project,
      valueClassName: 'mono',
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
              <span className="pm-pfx">{r.namespace_prefix}</span>
              <span>{r.name}</span>
              <span className="pm-res-ver">· {r.version}</span>
              {r.url && (
                <a href={r.url} target="_blank" rel="noreferrer" title={t('provenance.ontology_resources')}>
                  <ExportOutlined style={{ fontSize: 11 }} />
                </a>
              )}
              {r.repository_url && (
                <a href={r.repository_url} target="_blank" rel="noreferrer" title={t('provenance.repository')}>
                  <ExportOutlined style={{ fontSize: 11 }} />
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
        <Flex wrap gap={6} style={{ marginTop: 6 }}>
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
