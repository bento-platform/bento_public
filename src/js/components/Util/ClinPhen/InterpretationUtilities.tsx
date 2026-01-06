import { Space, Table } from 'antd';

import StringList from '../StringList';
import TDescriptions from '../TDescriptions';
import OntologyTerm from './OntologyTerm';
import JsonView from '../JsonView';
import ExtraPropertiesDisplay from '@Util/ClinPhen/ExtraPropertiesDisplay';

import { useTranslatedTableColumnTitles } from '@/hooks/useTranslatedTableColumnTitles';
import { objectToBoolean } from '@/utils/boolean';

import type { VariantInterpretation as VariantInterpretationType } from '@/types/clinPhen/variantInterpretation';
import type { Extension } from '@/types/clinPhen/shared';
import type { Expression } from '@/types/clinPhen/vrs';
import type { JSONType } from '@/types/json';
import type { GeneDescriptor as GeneDescriptorType } from '@/types/clinPhen/geneDescriptor';
import type { ConditionalDescriptionItem } from '@/types/descriptions';

export const GeneDescriptor = ({ geneDescriptor }: { geneDescriptor: GeneDescriptorType }) => {
  const items: ConditionalDescriptionItem[] = [
    { key: 'id', label: 'interpretations.accession_number', children: geneDescriptor.value_id },
    { key: 'symbol', children: geneDescriptor.symbol },
    { key: 'description', children: geneDescriptor.description },
    {
      key: 'alternate_ids',
      children: <StringList list={geneDescriptor.alternate_ids} />,
      isVisible: geneDescriptor.alternate_ids?.length,
    },
    {
      key: 'xrefs',
      label: 'interpretations.cross_references',
      children: <StringList list={geneDescriptor.xrefs} />,
      isVisible: geneDescriptor.xrefs?.length,
    },
    {
      key: 'alternate_symbols',
      children: <StringList list={geneDescriptor.alternate_symbols} />,
      isVisible: geneDescriptor.alternate_symbols?.length,
    },
  ];

  return (
    <Space direction="vertical" className="w-full">
      <TDescriptions items={items} size="compact" column={1} bordered defaultI18nPrefix="interpretations." />
      <ExtraPropertiesDisplay extraProperties={geneDescriptor.extra_properties} />
    </Space>
  );
};

export const VariantInterpretation = ({
  variantInterpretation,
}: {
  variantInterpretation: VariantInterpretationType;
}) => {
  const items: ConditionalDescriptionItem[] = [
    { key: 'acmg_pathogenicity_classification', children: variantInterpretation?.acmg_pathogenicity_classification },
    { key: 'therapeutic_actionability', children: variantInterpretation?.therapeutic_actionability },
  ];

  const vd = variantInterpretation.variation_descriptor;

  const extensionTableColumns = useTranslatedTableColumnTitles<Extension>([
    { title: 'interpretations.name', dataIndex: 'name' },
    { title: 'interpretations.value', dataIndex: 'value' },
  ]);

  const variantExpressionColumns = useTranslatedTableColumnTitles<Expression>([
    { title: 'interpretations.syntax', dataIndex: 'syntax' },
    { title: 'interpretations.value', dataIndex: 'value' },
  ]);

  const variantDescriptorItems: ConditionalDescriptionItem[] = [
    { key: 'id', children: vd.id },
    {
      key: 'variation',
      children: <JsonView src={vd.variation as unknown as JSONType} />,
      isVisible: objectToBoolean(vd.variation),
    },
    { key: 'label', children: vd.label },
    { key: 'description', children: vd.description },
    {
      key: 'gene_context',
      children: <GeneDescriptor geneDescriptor={vd.gene_context!} />,
      isVisible: vd?.gene_context,
    },
    {
      key: 'expressions',
      label: 'interpretations.expressions',
      children: (
        <Table<Expression>
          columns={variantExpressionColumns}
          dataSource={vd.expressions}
          rowKey="syntax"
          size="small"
          pagination={false}
          bordered
        />
      ),
      isVisible: vd?.expressions?.length,
    },
    {
      key: 'vcf_record',
      children: <JsonView src={vd.vcf_record as unknown as JSONType} />,
      isVisible: objectToBoolean(vd.vcf_record),
    },
    { key: 'xrefs', children: vd.xrefs },
    { key: 'alternate_labels', children: vd.alternate_labels },
    {
      key: 'extensions',
      children: (
        <Table<Extension>
          columns={extensionTableColumns}
          dataSource={vd.extensions}
          rowKey="name"
          size="small"
          pagination={false}
          bordered
        />
      ),
      isVisible: vd.extensions?.length,
    },
    {
      key: 'molecule_context',
      children: vd.molecule_context,
    },
    {
      key: 'structural_type',
      children: <OntologyTerm term={vd.structural_type} />,
      isVisible: vd?.structural_type,
    },
    {
      key: 'vrs_ref_allele_seq',
      children: vd?.vrs_ref_allele_seq,
    },
    {
      key: 'allelic_state',
      children: <OntologyTerm term={vd.allelic_state} />,
      isVisible: vd?.allelic_state,
    },
  ];

  return (
    <Space direction="vertical">
      <TDescriptions items={items} size="compact" bordered defaultI18nPrefix="interpretations." />
      <TDescriptions
        items={variantDescriptorItems}
        column={2}
        size="compact"
        bordered
        defaultI18nPrefix="interpretations."
      />
    </Space>
  );
};
