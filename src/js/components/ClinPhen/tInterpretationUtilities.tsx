import { Descriptions, DescriptionsProps, Space, Table } from 'antd';

import { VariantInterpretation as VariantInterpretationType } from '@/types/clinPhen/variantInterpretation';
import JsonView from '../Util/JsonView';
import { Extension } from '@/types/clinPhen/shared';
import { Expression } from '@/types/clinPhen/vrs';
import OntologyTerm from './OntologyTerm';
import { JSONType } from '@/types/json';
import { GeneDescriptor as GeneDescriptorType } from '@/types/clinPhen/geneDescriptor';
import StringList from '../Util/StringList';

// TODO: add link to tracks
export const GeneDescriptor = ({ geneDescriptor }: { geneDescriptor: GeneDescriptorType }) => {
  const items: DescriptionsProps['items'] = [
    { key: 'id', label: 'Accession Number', children: geneDescriptor.value_id },
    { key: 'symbol', label: 'Symbol', children: geneDescriptor.symbol }, // Link to tracks
    {
      key: 'description',
      label: 'Description',
      children: geneDescriptor.description,
    },
    {
      key: 'alternate_ids',
      label: 'Alternate IDs',
      children: <StringList list={geneDescriptor.alternate_ids} />,
    },
    {
      key: 'xrefs',
      label: 'Cross References',
      children: <StringList list={geneDescriptor.xrefs} />,
    },
    {
      key: 'alternate_symbols',
      label: 'Alternate Symbols',
      children: <StringList list={geneDescriptor.alternate_symbols} />,
    },
  ];

  return <Descriptions items={items} size="small" column={1} bordered />;
};

const VariantExpressionDetails = ({ variantExpression }: { variantExpression: Expression }) => {
  const items: DescriptionsProps['items'] = [
    { key: 'syntax', label: 'Syntax', children: variantExpression.syntax },
    { key: 'value', label: 'Value', children: variantExpression.value },
  ];

  return <Descriptions items={items} size="small" />;
};

export const VariantInterpretation = ({
  variantInterpretation,
}: {
  variantInterpretation: VariantInterpretationType;
}) => {
  const items: DescriptionsProps['items'] = [
    {
      key: 'acmg_pathogenicity_classification',
      label: 'ACMG Pathogenicity Classification',
      children: variantInterpretation?.acmg_pathogenicity_classification,
    },
    {
      key: 'therapeutic_actionability',
      label: 'Therapeutic Actionability',
      children: variantInterpretation?.therapeutic_actionability,
    },
  ];

  const vd = variantInterpretation.variation_descriptor;

  const extentionTableColumns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Value',
      dataIndex: 'value',
      key: 'value',
    },
  ];

  const variantDescrptorItems: DescriptionsProps['items'] = [
    { key: 'id', label: 'ID', children: vd.id },
    vd?.variation && {
      key: 'Variation',
      label: 'Variation',
      children: <JsonView src={vd.variation as unknown as JSONType} />,
    },
    vd?.label && { key: 'Label', label: 'Label', children: vd.label },
    vd?.description && { key: 'Description', label: 'Description', children: vd.description },
    vd?.gene_context && {
      key: 'Gene Context',
      label: 'Gene Context',
      children: <GeneDescriptor geneDescriptor={vd.gene_context} />,
    },
    vd?.expressions && {
      key: 'Expressions',
      label: 'Expressions',
      children: (
        <Space direction="vertical" size="small">
          {vd.expressions.map((e) => (
            <VariantExpressionDetails variantExpression={e} />
          ))}
        </Space>
      ),
    },
    vd?.vcf_record && {
      key: 'VCF Record',
      label: 'VCF Record',
      children: <JsonView src={vd.vcf_record as unknown as JSONType} />,
    },
    vd?.xrefs && {
      key: 'Xrefs',
      label: 'Xrefs',
      children: vd.xrefs,
    },
    vd?.alternate_labels && {
      key: 'Alternate Labels',
      label: 'Alternate Labels',
      children: vd.alternate_labels,
    },
    vd?.extensions && {
      key: 'Extensions',
      label: 'Extensions',
      children: <Table<Extension> columns={extentionTableColumns} dataSource={vd.extensions} />,
    },
    vd?.molecule_context && {
      key: 'Molecule Context',
      label: 'Molecule Context',
      children: vd.molecule_context,
    },
    vd?.structural_type && {
      key: 'Structural Type',
      label: 'Structural Type',
      children: <OntologyTerm term={vd.structural_type} />,
    },
    vd?.vrs_ref_allele_seq && {
      key: 'VRS Ref Allele Seq',
      label: 'VRS Ref Allele Seq',
      children: vd.vrs_ref_allele_seq,
    },
    vd?.allelic_state && {
      key: 'Allelic State',
      label: 'Allelic State',
      children: <OntologyTerm term={vd.allelic_state} />,
    },
  ].filter(Boolean) as DescriptionsProps['items'];

  return (
    <Space direction="vertical">
      <Descriptions items={items} size="small" bordered />
      <Descriptions items={variantDescrptorItems} size="small" bordered />
    </Space>
  );
};
