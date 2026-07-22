import { useId } from 'react';
import { BankOutlined, EnvironmentOutlined, GlobalOutlined, MailOutlined, PhoneOutlined, UserOutlined } from '@ant-design/icons';

import { useTranslationFn } from '@/hooks';
import type { Organization, Person, PersonOrOrganization } from '@/types/dataset';
import { CopyButton } from './CopyButton';

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
  const t = useTranslationFn();

  const typeId = useId();

  const isPerson = person.type === 'person';
  const p = person as Person;
  const org = person as Organization;

  const affiliationLine =
    isPerson && p.affiliations?.length
      ? typeof p.affiliations[0] === 'string'
        ? p.affiliations[0]
        : (p.affiliations[0] as Organization).name
      : null;

  const contact = person.contact;
  const hasContact = contact && (contact.email?.length || contact.website || contact.address || contact.phone);

  const displayName =
    isPerson && p.honorific && !person.name.toLowerCase().startsWith(p.honorific.toLowerCase())
      ? `${p.honorific} ${person.name}`
      : person.name;

  return (
    <div className={`pm-pcard${lead ? ' lead' : ''}`}>
      <div className="pm-pc-top">
        <div className="pm-pc-id">
          <div className="pm-pc-type" id={typeId}>
            {isPerson ? <UserOutlined /> : <BankOutlined />}{' '}
            {t(isPerson ? 'provenance.person' : 'provenance.organization')}
          </div>
          <div className="pm-pc-name" aria-labelledby={typeId}>
            {displayName}
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
            <span key={i} className="pm-role">
              {r}
            </span>
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
                <a href={contact.website} target="_blank" rel="noreferrer">
                  {contact.website}
                </a>
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
