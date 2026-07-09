import { useTranslationFn } from '@/hooks';
import type { Dataset } from '@/types/dataset';
import { CopyButton } from './cards';

type IdentifiersSectionContentProps = {
  dataset: Dataset;
  copiedKey: string | null;
  onCopy: (value: string, id: string) => void;
};

const IdentifiersSectionContent = ({ dataset, copiedKey, onCopy }: IdentifiersSectionContentProps) => {
  const t = useTranslationFn();

  const resources = dataset.resources ?? [];

  return (
    <div className="pm-kv">
      <div className="pm-kv-row">
        <div className="pm-kv-k">{t('Identifier')}</div>
        <div className="pm-kv-v mono">
          {dataset.identifier}{' '}
          <CopyButton
            value={dataset.identifier}
            id={`dataset-${dataset.identifier}`}
            copiedKey={copiedKey}
            onCopy={onCopy}
          />
        </div>
      </div>
      <div className="pm-kv-row">
        <div className="pm-kv-k">{t('provenance.schema_version')}</div>
        <div className="pm-kv-v">{dataset.schema_version}</div>
      </div>
      <div className="pm-kv-row">
        <div className="pm-kv-k">{t('provenance.project_id')}</div>
        <div className="pm-kv-v mono">{dataset.project}</div>
      </div>
      {dataset.program_name && (
        <div className="pm-kv-row">
          <div className="pm-kv-k">{t('provenance.program_name')}</div>
          <div className="pm-kv-v">{dataset.program_name}</div>
        </div>
      )}
      {resources.length > 0 && (
        <div className="pm-kv-row span">
          <div className="pm-kv-k">Ontology resources</div>
          <div className="pm-kv-v">
            {resources.map((r, i) => (
              <div key={i} className="pm-res-row">
                <span className="pm-pfx">{r.namespace_prefix}</span>
                <span>{r.name}</span>
                <span className="pm-res-ver">· {r.version}</span>
              </div>
            ))}
          </div>
        </div>
      )}
      {dataset.extra_properties && Object.keys(dataset.extra_properties).length > 0 && (
        <div className="pm-kv-row span">
          <div className="pm-kv-k">Extra properties</div>
          <div className="pm-kv-v" style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 4 }}>
            {Object.entries(dataset.extra_properties).map(([k, v]) => (
              <span key={k} className="pm-grant">
                {k} · {String(v ?? '')}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default IdentifiersSectionContent;
