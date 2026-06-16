import type { ReactNode } from 'react';
import { Flex, Tag, Typography } from 'antd';
import { GlobalOutlined, MailOutlined, PhoneOutlined } from '@ant-design/icons';
import { LuMailbox } from 'react-icons/lu';

import type { Contact, PersonOrOrganization, Phone } from '@/types/dataset';
import { useTranslationFn } from '@/hooks';

import EntityCard from './EntityCard';
import Orcid from './Orcid';

const { Text } = Typography;

const PhoneNumber = ({ phone: { country_code: countryCode, number, extension } }: { phone: Phone }) => (
  <span itemProp="telephone" content={`+${countryCode}${number}x${extension}`}>
    +{countryCode} {number} {extension !== null && extension !== undefined ? `x${extension}` : null}
  </span>
);

const Contact = ({ contact, orcid }: { contact: Contact; orcid?: string | null }) => {
  const { website, email, address, phone } = contact;
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '24px auto' }}>
      {!!website && (
        <>
          <GlobalOutlined aria-hidden />
          <a href={website} target="_blank" rel="noopener noreferrer">
            {website}
          </a>
        </>
      )}
      {!!email && (
        <>
          <MailOutlined aria-hidden />
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
          <LuMailbox aria-hidden />
          <address>{address}</address>
        </>
      )}
      {!!phone && (
        <>
          <PhoneOutlined aria-hidden />
          <PhoneNumber phone={phone} />
        </>
      )}
      {!!orcid && (
        <>
          <Orcid orcid={orcid} aria-hidden />
          <Orcid orcid={orcid}>
            <Text code>{orcid}</Text>
          </Orcid>
        </>
      )}
    </div>
  );
};

const PersonOrOrganizationDisplay = ({
  entity,
  extra,
  primary,
}: {
  entity: PersonOrOrganization;
  extra?: ReactNode;
  primary?: boolean;
}) => {
  const t = useTranslationFn();
  const { name, contact, roles, type } = entity;
  return (
    <EntityCard supertitle={type} title={name} className={`provenance-${type}`} extra={extra} primary={primary}>
      {!!contact && <Contact contact={contact} orcid={entity.type === 'person' ? entity.orcid : undefined} />}
      <Flex className="flex-1" style={{ marginTop: 8 }}>
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
