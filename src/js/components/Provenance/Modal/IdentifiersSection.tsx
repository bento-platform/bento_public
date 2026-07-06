import type { Dataset } from '@/types/dataset';
import { SectionHead } from './cards';

type IdentifiersSectionProps = {
  dataset: Dataset;
  collapsed: boolean;
  onToggle: () => void;
};

const IdentifiersSection = ({ dataset, collapsed, onToggle }: IdentifiersSectionProps) => {
  const resources = dataset.resources ?? [];

  return (
    <section id="identifiers" className={`pm-sec${collapsed ? ' collapsed' : ''}`}>
      <SectionHead title="Identifiers & Technical" collapsed={collapsed} onToggle={onToggle} />
      <div className="pm-sec-body">
        <div className="pm-kv">
          <div className="pm-kv-row">
            <div className="pm-kv-k">Identifier</div>
            <div className="pm-kv-v mono">{dataset.identifier}</div>
          </div>
          <div className="pm-kv-row">
            <div className="pm-kv-k">Schema version</div>
            <div className="pm-kv-v">{dataset.schema_version}</div>
          </div>
          <div className="pm-kv-row">
            <div className="pm-kv-k">Project UUID</div>
            <div className="pm-kv-v mono">{dataset.project}</div>
          </div>
          {dataset.program_name && (
            <div className="pm-kv-row">
              <div className="pm-kv-k">Program</div>
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
      </div>
    </section>
  );
};

export default IdentifiersSection;
