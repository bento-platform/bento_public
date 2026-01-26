import { Space, Tooltip, Typography } from 'antd';
import { LinkOutlined } from '@ant-design/icons';

import { useParams } from 'react-router-dom';

import { usePhenopacketResources } from '@/features/clinPhen/hooks';
import { useTranslationFn } from '@/hooks';

import { EM_DASH } from '@/constants/common';

import type { OntologyTerm as OntologyTermType } from '@/types/ontology';
import type { RouteParams } from '../../ClinPhen/PhenopacketView';

const { Link } = Typography;

interface OntologyTermProps {
  term: OntologyTermType | null | undefined;
}

const OntologyTerm = ({ term }: OntologyTermProps) => {
  const t = useTranslationFn();
  const { packetId } = useParams<RouteParams>();
  const resources = usePhenopacketResources(packetId);

  if (!term) return EM_DASH;

  // Find the resource whose namespace_prefix matches the prefix of the term's id
  const [prefix, suffix] = term.id.split(':');
  const resource = resources.find((r) => r.namespace_prefix === prefix);
  const iri = resource ? `${resource.iri_prefix}${suffix}` : undefined;

  return (
    <Tooltip title={term.id}>
      {iri ? (
        <span>
          {t(term.label)}{' '}
          <Link href={iri} target="_blank" rel="noopener noreferrer">
            <LinkOutlined />
          </Link>
        </span>
      ) : (
        <span>{t(term.label)}</span>
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
