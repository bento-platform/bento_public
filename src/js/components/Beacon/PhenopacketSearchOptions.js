import React from 'react';
import { Menu, Tooltip } from 'antd';

export const phenopacketSearchTree = [
  {
    title: 'Subject',
    value:"subject",
    selectable: false,
    children: [
      {
        title: 'subject id',
        value: 'subject.id',
      },
      {
        title: 'subject sex',
        value: 'subject.sex',
      },
      {
        title: 'subject karyotypic sex',
        value: 'subject.karyotypic_sex',
      },
      {
        title: 'subject taxonomy',
        value: 'subject.taxonomy',
      },
    ],
  },
  {
    title: 'Phenotypic Features',
    value: 'phenotypic_features',
    selectable: false,
    children: [
      {
        title: 'phenotypic feature description',
        value: 'phenotypic_features.[item].description',
      },
      {
        title: 'phenotypic feature type',
        value: 'phenotypic_features.[item].type.label',
      },
      {
        title: 'phenotypic feature severity',
        value: 'phenotypic_features.[item].severity.label',
      },
      {
        title: 'phenotypic feature modifier',
        value: 'phenotypic_features.[item].modifier.[item].label',
      },
      {
        title: 'phenotypic feature onset',
        value: 'phenotypic_features.[item].onset.label',
      },
    ],
  },
  {
    title: 'Biosamples',
    value: 'biosamples',
    selectable: false,
    children: [
      {
        title: 'biosample description',
        value: 'biosamples.[item].description',
      },
      {
        title: 'biosample sampled tissue',
        value: 'biosamples.[item].sampled_tissue.label',
      },
      {
        title: 'biosample taxonomy',
        value: 'biosamples.[item].taxonomy.label',
      },
      {
        title: 'biosample histological diagnosis',
        value: 'biosamples.[item].histological_diagnosis.label',
      },
      {
        title: 'biosample tumor progression',
        value: 'biosamples.[item].tumor_progression.label',
      },
      {
        title: 'biosample tumor grade',
        value: 'biosamples.[item].tumor_grade.label',
      },
      {
        title: 'biosample diagnostic markers',
        value: 'biosamples.[item].diagnostic_markers.[item].label',
      },
      {
        title: 'biosample procedure',
        value: 'biosamples.[item].procedure.code.label',
      },
    ],
  },
  {
    title: 'Genes',
    value: 'genes',
    selectable: false,
    children: [
      {
        title: 'gene id',
        value: 'genes.[item].id',
      },
      {
        title: 'gene symbol',
        value: 'genes.[item].symbol',
      },
    ],
  },
  {
    title: 'Diseases',
    value: 'diseases',
    selectable: false,
    children: [
      {
        title: 'disease label',
        value: 'diseases.[item].term.label',
      },
      {
        title: 'disease stage',
        value: 'diseases.[item].disease_stage.[item].label',
      },
      {
        title: 'disease TNM finding',
        value: 'diseases.[item].tnm_finding.[item].label',
      },
    ],
  },
  {
    title: 'Annotated variants',
    value: 'variants',
    selectable: false,
    children: [
      {
        title: 'variant zygosity',
        value: 'variants.[item].zygosity.label',
      },
    ],
  },
];

const searchUiMappings = {
  phenopacket: {
    id: 'id',
    subject: {
      id: {
        path: 'subject.id',
        ui_name: 'Subject ID',
      },
      sex: {
        path: 'subject.sex',
        ui_name: 'Sex',
      },
      karyotypic_sex: {
        path: 'subject.karyotypic_sex',
        ui_name: 'Karyotypic sex',
      },
      taxonomy: {
        path: 'subject.taxonomy.label',
        ui_name: 'Subject Taxonomy',
      },
    },
    phenotypic_features: {
      description: {
        path: 'phenotypic_features.[item].description',
        ui_name: 'Phenotypic feature description',
      },
      type: {
        path: 'phenotypic_features.[item].type.label',
        ui_name: 'Phenotypic feature type',
      },
      severity: {
        path: 'phenotypic_features.[item].severity.label',
        ui_name: 'Phenotypic feature severity',
      },
      modifier: {
        path: 'phenotypic_features.[item].modifier.[item].label',
        ui_name: 'Phenotypic feature modifier',
      },
      onset: {
        path: 'phenotypic_features.[item].onset.label',
        ui_name: 'Phenotypic feature onset',
      },
    },
    biosamples: {
      description: {
        path: 'biosamples.[item].description',
        ui_name: 'Biosample description',
      },
      sampled_tissue: {
        path: 'biosamples.[item].sampled_tissue.label',
        ui_name: 'Sampled tissue',
      },
      taxonomy: {
        path: 'biosamples.[item].taxonomy.label',
        ui_name: 'Biosample taxonomy',
      },
      histological_diagnosis: {
        path: 'biosamples.[item].histological_diagnosis.label',
        ui_name: 'Biosample histological diagnosis',
      },
      tumor_progression: {
        path: 'biosamples.[item].tumor_progression.label',
        ui_name: 'Tumor progression',
      },
      tumor_grade: {
        path: 'biosamples.[item].tumor_grade.label',
        ui_name: 'Tumor grade',
      },
      diagnostic_markers: {
        path: 'biosamples.[item].diagnostic_markers.[item].label',
        ui_name: 'Diagnostic markers',
      },
      procedure: {
        path: 'biosamples.[item].procedure.code.label',
        ui_name: 'Procedure',
      },
    },
    genes: {
      id: {
        path: 'genes.[item].id',
        ui_name: 'Gene ID',
      },
      symbol: {
        path: 'genes.[item].symbol',
        ui_name: 'Gene symbol',
      },
    },
    variants: {
      zygosity: {
        path: 'variants.[item].zygosity.label',
        ui_name: 'Variant Zygosity',
      },
    },
    diseases: {
      term: {
        path: 'diseases.[item].term.label',
        ui_name: 'Disease',
      },
      disease_stage: {
        path: 'diseases.[item].disease_stage.[item].label',
        ui_name: 'Disease stage',
      },
      tnm_finding: {
        path: 'diseases.[item].tnm_finding.[item].label',
        ui_name: 'TNM finding',
      },
    },
  },
};

const items = [
  { label: 'item 1', key: 'item-1' }, // remember to pass the key prop
  { label: 'item 2', key: 'item-2' }, // which is required
  {
    label: 'sub menu',
    key: 'submenu',
    children: [{ label: 'item 3', key: 'submenu-item-1' }],
  },
];

const PhenopacketSearchOptions = () => {
  const phenopacketSearchOptions = searchUiMappings.phenopacket;
  const subjectOptions = Object.values(phenopacketSearchOptions.subject);
  const phenotypicFeaturesOptions = Object.values(phenopacketSearchOptions.phenotypic_features);
  const biosamplesOptions = Object.values(phenopacketSearchOptions.biosamples);
  const genesOptions = Object.values(phenopacketSearchOptions.genes);
  const variantsOptions = Object.values(phenopacketSearchOptions.variants);
  const diseasesOptions = Object.values(phenopacketSearchOptions.diseases);

  const DropdownOption = ({ option }) => {
    const schema = this.getDataTypeFieldSchema('[dataset item].' + option.path);
    return (
      <Tooltip title={schema.description} mouseEnterDelay={TOOLTIP_DELAY_SECONDS}>
        {option.ui_name}
      </Tooltip>
    );
  };

  // longest title padded with marginRight
  return (
    <Menu style={{ display: 'inline-block' }} onClick={this.addConditionFromPulldown}>
      <Menu.SubMenu title={<span>Subject</span>}>
        {subjectOptions.map((o) => (
          <Menu.Item key={o.path}>
            <DropdownOption option={o} />
          </Menu.Item>
        ))}
      </Menu.SubMenu>
      <Menu.SubMenu title={<span style={{ marginRight: '10px' }}>Phenotypic Features </span>}>
        {phenotypicFeaturesOptions.map((o) => (
          <Menu.Item key={o.path}>
            <DropdownOption option={o} />
          </Menu.Item>
        ))}
      </Menu.SubMenu>
      <Menu.SubMenu title={<span>Biosamples</span>}>
        {biosamplesOptions.map((o) => (
          <Menu.Item key={o.path}>
            <DropdownOption option={o} />
          </Menu.Item>
        ))}
      </Menu.SubMenu>
      <Menu.SubMenu title={<span>Genes</span>}>
        {genesOptions.map((o) => (
          <Menu.Item key={o.path}>
            <DropdownOption option={o} />
          </Menu.Item>
        ))}
      </Menu.SubMenu>
      <Menu.SubMenu title={<span>Annotated variants</span>}>
        {variantsOptions.map((o) => (
          <Menu.Item key={o.path}>
            <DropdownOption option={o} />
          </Menu.Item>
        ))}
      </Menu.SubMenu>
      <Menu.SubMenu title={<span>Diseases</span>}>
        {diseasesOptions.map((o) => (
          <Menu.Item key={o.path}>
            <DropdownOption option={o} />
          </Menu.Item>
        ))}
      </Menu.SubMenu>
    </Menu>
  );
};

export default PhenopacketSearchOptions;
