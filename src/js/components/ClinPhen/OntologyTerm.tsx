import { Space, Typography } from 'antd';
import { LinkOutlined } from '@ant-design/icons';
import type { OntologyTerm as OntologyTermType } from '@/types/ontology';
import type { Resource } from '@/types/clinPhen/resource';

const { Link } = Typography;

interface OntologyTermProps {
  term: OntologyTermType;
  resources: Resource[];
}

const OntologyTerm = ({ term, resources }: OntologyTermProps) => {
  if (!term) return null;
  // Find the resource whose namespace_prefix matches the prefix of the term's id
  const prefix = term.id.split(':')[0];
  const resource = resources.find((r) => r.namespace_prefix === prefix);
  const iri = resource ? `${resource.iri_prefix}${term.id}` : undefined;

  return iri ? (
    <span>
      {term.label}{' '}
      <Link href={iri} target="_blank" rel="noopener noreferrer">
        <LinkOutlined />
      </Link>
    </span>
  ) : (
    <span>{term.label}</span>
  );
};

interface OntologyTermStackProps {
  terms: OntologyTermType[];
  resources: Resource[];
}

export const OntologyTermStack = ({ terms, resources }: OntologyTermStackProps) => {
  if (!terms || terms.length === 0) return null;

  return (
    <Space direction="vertical">
      {terms.map((term, index) => (
        <OntologyTerm key={index} term={term} resources={resources} />
      ))}
    </Space>
  );
};

export default OntologyTerm;
