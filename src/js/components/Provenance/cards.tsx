import {
  AuditOutlined,
  BankOutlined,
  BookOutlined,
  CalendarOutlined,
  CheckOutlined,
  CopyOutlined,
  DollarOutlined,
  DownloadOutlined,
  DownOutlined,
  EnvironmentOutlined,
  ExportOutlined,
  FileDoneOutlined,
  GlobalOutlined,
  LinkOutlined,
  MailOutlined,
  NumberOutlined,
  PhoneOutlined,
} from '@ant-design/icons';

import type {
  FundingSource,
  License,
  Link,
  Organization,
  Person,
  PersonOrOrganization,
  Publication,
  StringOrOntologyClass,
  TypedLink,
} from '@/types/dataset';
import type { OntologyTerm } from '@/types/ontology';

// ── Constants ──────────────────────────────────────────────────────────────

const LINK_TYPE_ICONS: Record<string, React.ReactNode> = {
  'Downloadable Artifact': <DownloadOutlined />,
  'Data Management Plan': <FileDoneOutlined />,
  Schema: <NumberOutlined />,
  'External Reference': <ExportOutlined />,
  'Data Access': <AuditOutlined />,
  'Data Request Form': <FileDoneOutlined />,
};

// ── Helpers ────────────────────────────────────────────────────────────────

const isOntologyTerm = (k: StringOrOntologyClass): k is OntologyTerm =>
  typeof k === 'object' && k !== null && 'id' in k;

const ontologyLabel = (k: StringOrOntologyClass): string =>
  isOntologyTerm(k) ? k.label : k;

const ontologyCurie = (k: StringOrOntologyClass): string | null =>
  isOntologyTerm(k) ? k.id : null;

const pubTypeLabel = (pt: Publication['publication_type']): string =>
  typeof pt === 'string' ? pt : pt.other;

const personName = (p: PersonOrOrganization): string => p.name;

// ── CopyButton ─────────────────────────────────────────────────────────────

export const CopyButton = ({
  value,
  id,
  copiedKey,
  onCopy,
}: {
  value: string;
  id: string;
  copiedKey: string | null;
  onCopy: (value: string, id: string) => void;
}) => {
  const copied = copiedKey === id;
  return (
    <button
      type="button"
      className={`pm-copy-btn${copied ? ' copied' : ''}`}
      onClick={() => onCopy(value, id)}
      title="Copy"
    >
      {copied ? <CheckOutlined /> : <CopyOutlined />}
    </button>
  );
};

// ── OntologyChip ───────────────────────────────────────────────────────────

export const OntologyChip = ({ item, variant }: { item: StringOrOntologyClass; variant: 'kw' | 'taxa' | 'dom' }) => {
  const curie = ontologyCurie(item);
  return (
    <span className={`pm-chip pm-chip-${variant}`}>
      {ontologyLabel(item)}
      {curie && <span className="pm-chip-curie">{curie}</span>}
    </span>
  );
};

// ── SectionHead ────────────────────────────────────────────────────────────

export const SectionHead = ({
  title,
  count,
  collapsed,
  onToggle,
}: {
  title: string;
  count?: number;
  collapsed: boolean;
  onToggle: () => void;
}) => (
  <button type="button" className="pm-sec-head" onClick={onToggle}>
    <DownOutlined className="pm-sec-chevron" style={collapsed ? { transform: 'rotate(-90deg)' } : undefined} />
    <h2>{title}</h2>
    {count !== undefined && <span className="pm-sec-cnt">{count}</span>}
  </button>
);

// ── LinkTile ───────────────────────────────────────────────────────────────

export const LinkTile = ({ link }: { link: Link }) => {
  const typed = link as Partial<TypedLink>;
  const typeStr = typeof typed.type === 'string' ? typed.type : typeof typed.type === 'object' ? typed.type?.other : undefined;
  const icon = (typeStr && LINK_TYPE_ICONS[typeStr]) ?? <LinkOutlined />;
  return (
    <a className="pm-link-tile" href={link.url} target="_blank" rel="noreferrer">
      <span className="pm-lt-ic">{icon}</span>
      <span className="pm-lt-main">
        {typeStr && <span className="pm-lt-type">{typeStr}</span>}
        <span className="pm-lt-label">{link.label}</span>
      </span>
      <ExportOutlined className="pm-lt-ext" />
    </a>
  );
};

// ── PersonCard ─────────────────────────────────────────────────────────────

export const PersonCard = ({
  person,
  idx,
  lead,
  copiedKey,
  onCopy,
}: {
  person: PersonOrOrganization;
  idx: number;
  lead?: boolean;
  copiedKey: string | null;
  onCopy: (value: string, id: string) => void;
}) => {
  const isPerson = person.type === 'person';
  const p = person as Person;
  const org = person as Organization;

  const affiliationLine = isPerson && p.affiliations?.length
    ? (typeof p.affiliations[0] === 'string' ? p.affiliations[0] : (p.affiliations[0] as Organization).name)
    : null;

  const contact = person.contact;
  const hasContact = contact && (contact.email?.length || contact.website || contact.address || contact.phone);

  return (
    <div className={`pm-pcard${lead ? ' lead' : ''}`}>
      <div className="pm-pc-top">
        <div className="pm-pc-id">
          <div className="pm-pc-type">{isPerson ? 'Person' : 'Organization'}</div>
          <div className="pm-pc-name">
            {isPerson && p.honorific ? `${p.honorific} ${person.name}` : person.name}
          </div>
          {affiliationLine && (
            <div className="pm-pc-affil">
              <BankOutlined />
              <span>{affiliationLine}</span>
            </div>
          )}
          {!isPerson && org.location && (
            <div className="pm-pc-affil">
              <EnvironmentOutlined />
              <span>{org.location}</span>
            </div>
          )}
        </div>
      </div>

      {person.roles.length > 0 && (
        <div className="pm-pc-roles">
          {person.roles.map((r, i) => (
            <span key={i} className="pm-role">{r}</span>
          ))}
        </div>
      )}

      {hasContact && (
        <div className="pm-pc-contact">
          {contact?.email?.map((email, i) => (
            <div key={i} className="pm-cline">
              <MailOutlined />
              <span className="pm-cline-text">
                <a href={`mailto:${email}`}>{email}</a>
              </span>
              <CopyButton value={email} id={`email-${idx}-${i}`} copiedKey={copiedKey} onCopy={onCopy} />
            </div>
          ))}
          {contact?.website && (
            <div className="pm-cline">
              <GlobalOutlined />
              <span className="pm-cline-text">
                <a href={contact.website} target="_blank" rel="noreferrer">{contact.website}</a>
              </span>
            </div>
          )}
          {contact?.address && (
            <div className="pm-cline">
              <EnvironmentOutlined />
              <span className="pm-cline-text">{contact.address}</span>
            </div>
          )}
          {contact?.phone && (
            <div className="pm-cline">
              <PhoneOutlined />
              <span className="pm-cline-text">
                {contact.phone.country_code && `+${contact.phone.country_code} `}
                {contact.phone.number}
                {contact.phone.extension && ` x${contact.phone.extension}`}
              </span>
            </div>
          )}
          {isPerson && p.orcid && (
            <div className="pm-cline">
              <span className="pm-orcid">
                <span className="pm-orcid-badge">iD</span>
                {p.orcid}
              </span>
              <CopyButton value={p.orcid} id={`orcid-${idx}`} copiedKey={copiedKey} onCopy={onCopy} />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// ── PublicationCard ────────────────────────────────────────────────────────

export const PublicationCard = ({
  pub,
  idx,
  copiedKey,
  onCopy,
}: {
  pub: Publication;
  idx: number;
  copiedKey: string | null;
  onCopy: (value: string, id: string) => void;
}) => (
  <div className="pm-pub">
    <div className="pm-pub-top">
      <span className="pm-pub-type">{pubTypeLabel(pub.publication_type)}</span>
      {pub.publication_date && (
        <span className="pm-pub-date">
          <CalendarOutlined />
          {pub.publication_date}
        </span>
      )}
    </div>
    <div className="pm-pub-title">{pub.title}</div>
    {pub.authors && pub.authors.length > 0 && (
      <div className="pm-pub-authors">{pub.authors.map(personName).join(', ')}</div>
    )}
    {pub.publication_venue && (
      <div className="pm-pub-venue">
        <BookOutlined />
        {pub.publication_venue.name}
        {pub.publication_venue.publisher && ` · ${pub.publication_venue.publisher}`}
      </div>
    )}
    {(pub.doi || pub.url) && (
      <div className="pm-pub-foot">
        {pub.doi && (
          <span className="pm-doi">
            {pub.doi}
            <CopyButton value={pub.doi} id={`doi-${idx}`} copiedKey={copiedKey} onCopy={onCopy} />
          </span>
        )}
        {pub.url && (
          <a className="pm-pub-view" href={pub.url} target="_blank" rel="noreferrer">
            View publication <ExportOutlined />
          </a>
        )}
      </div>
    )}
  </div>
);

// ── FundingCard ────────────────────────────────────────────────────────────

export const FundingCard = ({ source, idx }: { source: FundingSource | Link; idx: number }) => {
  if ('url' in source && 'label' in source) {
    const link = source as Link;
    return (
      <div className="pm-fcard">
        <div className="pm-fc-top">
          <span className="pm-fc-ic"><LinkOutlined /></span>
          <div>
            <div className="pm-fc-name">
              <a href={link.url} target="_blank" rel="noreferrer">{link.label}</a>
            </div>
          </div>
        </div>
      </div>
    );
  }
  const fs = source as FundingSource;
  const funderName =
    !fs.funder ? null
    : typeof fs.funder === 'string' ? fs.funder
    : personName(fs.funder as PersonOrOrganization);

  return (
    <div className="pm-fcard">
      <div className="pm-fc-top">
        <span className="pm-fc-ic"><DollarOutlined /></span>
        <div>
          {funderName && <div className="pm-fc-name">{funderName}</div>}
        </div>
      </div>
      {fs.grant_numbers && fs.grant_numbers.length > 0 && (
        <div className="pm-grants">
          <span className="pm-grant-k">Grant numbers</span>
          {fs.grant_numbers.map((g, i) => (
            <span key={i} className="pm-grant">{g}</span>
          ))}
        </div>
      )}
    </div>
  );
};

// ── LicenseTile ────────────────────────────────────────────────────────────

export const LicenseTile = ({ license }: { license: License }) => (
  <a
    className="pm-link-tile"
    href={license.url || undefined}
    target={license.url ? '_blank' : undefined}
    rel="noreferrer"
    style={{ maxWidth: 330, textDecoration: 'none' }}
  >
    <span className="pm-lt-ic"><AuditOutlined /></span>
    <span className="pm-lt-main">
      {license.type && <span className="pm-lt-type">{license.type}</span>}
      <span className="pm-lt-label">{license.label}</span>
    </span>
    {license.url && <ExportOutlined className="pm-lt-ext" />}
  </a>
);
