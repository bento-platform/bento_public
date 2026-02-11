import { Space, Tooltip, Typography } from 'antd';
import { LinkOutlined } from '@ant-design/icons';

import { useParams } from 'react-router-dom';

import { usePhenopacketResources } from '@/features/clinPhen/hooks';
import { useTranslationFn } from '@/hooks';

import { EM_DASH } from '@/constants/common';

import type { CSSProperties, ReactNode } from 'react';
import type { LinkProps } from 'antd/es/typography/Link';
import type { OntologyTerm as OntologyTermType } from '@/types/ontology';
import type { RouteParams } from '../../ClinPhen/PhenopacketView';

const { Link } = Typography;

type IriLinkProps = { iri: string } & Omit<LinkProps, 'href' | 'rel' | 'target'>;

const IriLink = ({ iri, className, children, ...props }: IriLinkProps) => (
  <Link
    href={iri}
    target="_blank"
    rel="noopener noreferrer"
    className={'iri-link' + (className ? ` ${className}` : '')}
    {...props}
  >
    {children ?? <LinkOutlined />}
  </Link>
);

interface OntologyTermProps {
  term: OntologyTermType | null | undefined;
  suffix?: ReactNode;
  style?: CSSProperties;
  tooltipLink?: boolean;
}

const OntologyTerm = ({ term, suffix, style, tooltipLink = false }: OntologyTermProps) => {
  const t = useTranslationFn();
  const { packetId } = useParams<RouteParams>();
  const resources = usePhenopacketResources(packetId);

  if (!term) return EM_DASH;

  // Find the resource whose namespace_prefix matches the prefix of the term's id
  const [idPrefix, idSuffix] = term.id.split(':');
  const resource = resources.find((r) => r.namespace_prefix === idPrefix);
  const iri = resource ? `${resource.iri_prefix}${idSuffix}` : undefined;

  return (
    <Tooltip
      title={
        iri ? (
          <IriLink iri={iri} className="underline text-white-90">
            {term.id}
          </IriLink>
        ) : (
          term.id
        )
      }
      mouseLeaveDelay={0.15} // Slightly higher than default (0.1) to let users better see the ontology class ID
    >
      {iri && !tooltipLink ? (
        <div className="ontology-class" style={style}>
          {t(term.label)}
          {suffix} <IriLink iri={iri} />
        </div>
      ) : (
        <div className={'ontology-class' + iri ? ' underline' : ''}>
          {t(term.label)}
          {suffix}
        </div>
      )}
    </Tooltip>
  );
};

interface OntologyTermStackProps {
  terms: OntologyTermType[] | undefined;
}

export const OntologyTermStack = ({ terms }: OntologyTermStackProps) => {
  if (!terms || terms.length === 0) return EM_DASH;

  return (
    <Space direction="vertical">
      {terms.map((term, index) => (
        <OntologyTerm key={index} term={term} />
      ))}
    </Space>
  );
};

export default OntologyTerm;
