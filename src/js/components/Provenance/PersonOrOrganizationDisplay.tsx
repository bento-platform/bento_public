import type { ReactNode } from 'react';
import { Flex, Tag } from 'antd';
import { GlobalOutlined, MailOutlined, PhoneOutlined } from '@ant-design/icons';
import { LuMailbox } from 'react-icons/lu';

import type { Contact, PersonOrOrganization, Phone } from '@/types/dataset';
import { useTranslationFn } from '@/hooks';
import EntityCard from './EntityCard';

const PhoneNumber = ({ phone: { country_code: countryCode, number, extension } }: { phone: Phone }) => (
  <span>
    +{countryCode} {number} {extension !== null && extension !== undefined ? `x${extension}` : null}
  </span>
);

const Contact = ({ contact }: { contact: Contact }) => {
  const { website, email, address, phone } = contact;
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '24px auto' }}>
      {!!website && (
        <>
          <div aria-hidden="true">
            <GlobalOutlined />
          </div>
          <div>
            <a href={website} target="_blank" rel="noopener noreferrer">
              {website}
            </a>
          </div>
        </>
      )}
      {!!email && (
        <>
          <div aria-hidden="true">
            <MailOutlined />
          </div>
          <div>
            {email.map((e, ei) => (
              <>
                <a href={`mailto:${e}`}>{e}</a>
                {ei < email.length - 1 ? ', ' : ''}
              </>
            ))}
          </div>
        </>
      )}
      {!!address && (
        <>
          <div aria-hidden="true">
            <LuMailbox />
          </div>
          <div>{address}</div>
        </>
      )}
      {!!phone && (
        <>
          <div aria-hidden="true">
            <PhoneOutlined />
          </div>
          <div>
            <PhoneNumber phone={phone} />
          </div>
        </>
      )}
    </div>
  );
};

export const PersonOrOrganizationName = ({ entity }: { entity: PersonOrOrganization }) => {
  const { name, contact } = entity;
  return contact?.website ? (
    <a href={contact?.website} target="_blank" rel="noopener noreferrer">
      {name}
    </a>
  ) : (
    name
  );
};

const PersonOrOrganizationDisplay = ({ entity, extra }: { entity: PersonOrOrganization; extra?: ReactNode }) => {
  const t = useTranslationFn();
  const { contact, roles, type } = entity;
  return (
    <EntityCard
      supertitle={type}
      title={<PersonOrOrganizationName entity={entity} />}
      className={`provenance-${type}`}
      extra={extra}
    >
      {!!contact && <Contact contact={contact} />}
      <Flex className="flex-1">
        {roles.map((r, i) => (
          <Tag key={i} color="green" style={{ alignSelf: 'flex-end' }}>
            {t(r)}
          </Tag>
        ))}
      </Flex>
    </EntityCard>
  );
};

export default PersonOrOrganizationDisplay;
