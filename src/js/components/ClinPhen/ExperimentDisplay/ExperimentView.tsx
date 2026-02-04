import { useMemo } from 'react';
import { useTranslationFn } from '@/hooks';

import { Divider, Space, Typography } from 'antd';

import type { DiscoveryMatchExperimentResult } from '@/features/search/types';
import type { Experiment } from '@/types/clinPhen/experiments/experiment';
import type { ExperimentResult } from '@/types/clinPhen/experiments/experimentResult';
import type { ConditionalDescriptionItem } from '@/types/descriptions';

import CustomTable, { type CustomTableColumns } from '@Util/CustomTable';
import TDescriptions from '@Util/TDescriptions';
import ExtraPropertiesDisplay from '@Util/ClinPhen/ExtraPropertiesDisplay';
import FreeTextAndOrOntologyClass from '@Util/ClinPhen/FreeTextAndOrOntologyClass';
import ExperimentResultView from '@/components/ClinPhen/ExperimentDisplay/ExperimentResultView';
import PhenopacketLink from '@/components/ClinPhen/PhenopacketLink';
import InstrumentDisplay from './InstrumentDisplay';

import { T_PLURAL_COUNT } from '@/constants/i18n';
import { objectToBoolean } from '@/utils/boolean';

type ExperimentExpandedRowProps = {
  packetId?: string;
  experiment: Experiment;
  searchRow?: boolean; // undefined implies false
};

const XXL_THREE_COLUMN = { xl: 1, xxl: 3 };

export const ExperimentExpandedRow = ({ packetId, experiment, searchRow }: ExperimentExpandedRowProps) => {
  const t = useTranslationFn();

  const items: ConditionalDescriptionItem[] = [
    { key: 'description', children: experiment.description, span: XXL_THREE_COLUMN },
    {
      key: 'protocol_url',
      children: experiment.protocol_url ? (
        <Typography.Link href={experiment.protocol_url} target="_blank" rel="noopener noreferrer">
          {experiment.protocol_url}
        </Typography.Link>
      ) : null,
      isVisible: !!experiment.protocol_url,
    },
    {
      key: 'experiment_type',
      children: (
        <FreeTextAndOrOntologyClass text={experiment.experiment_type} ontologyClass={experiment.experiment_ontology} />
      ),
    },
    { key: 'study_type', children: experiment.study_type },
    {
      key: 'molecule',
      children: <FreeTextAndOrOntologyClass text={experiment.molecule} ontologyClass={experiment.molecule_ontology} />,
      isVisible: experiment.molecule || experiment.molecule_ontology,
    },
    { key: 'extraction_protocol', children: experiment.extraction_protocol },
    { key: 'reference_registry_id', children: experiment.reference_registry_id },
    // corresponds to 'library id' from https://github.com/ga4gh/experiments-metadata/blob/main/identifiers.md
    { key: 'library_id', children: experiment.library_id },
    // corresponds to 'library description' from https://github.com/ga4gh/experiments-metadata/blob/main/core.md
    { key: 'library_description', children: experiment.library_description, span: XXL_THREE_COLUMN },
    // library_strategy originally adapted from ENA via IHEC; see:
    //  https://github.com/IHEC/ihec-ecosystems/blob/master/docs/metadata/2.0/Ihec_metadata_specification.md#experiments
    //  https://ena-docs.readthedocs.io/en/latest/submit/reads/webin-cli.html#strategy
    { key: 'library_strategy', children: experiment.library_strategy },
    // library_source originally adapted from ENA via IHEC; see:
    //  https://github.com/IHEC/ihec-ecosystems/blob/master/docs/metadata/2.0/Ihec_metadata_specification.md#experiments
    //  https://ena-docs.readthedocs.io/en/latest/submit/reads/webin-cli.html#source
    { key: 'library_source', children: experiment.library_source },
    { key: 'library_selection', children: experiment.library_selection },
    // corresponds to 'library layout' from https://github.com/ga4gh/experiments-metadata/blob/main/core.md
    { key: 'library_layout', children: experiment.library_layout },
    // corresponds to 'library extract id' from https://github.com/ga4gh/experiments-metadata/blob/main/identifiers.md
    { key: 'library_extract_id', children: experiment.library_extract_id },
    // corresponds to 'insert size' from https://github.com/ga4gh/experiments-metadata/blob/main/core.md
    { key: 'insert_size', children: experiment.insert_size },
    {
      key: 'qc_flags',
      children: (experiment.qc_flags ?? []).join(', '),
      isVisible: objectToBoolean(experiment.qc_flags),
    },
  ];

  return (
    <Space direction="vertical" className="w-full">
      <TDescriptions bordered size="compact" column={XXL_THREE_COLUMN} items={items} defaultI18nPrefix="experiment." />
      <ExtraPropertiesDisplay extraProperties={experiment.extra_properties} />
      {experiment.instrument && (
        <>
          <Divider style={{ margin: '8px 0 4px 0' }} />
          <InstrumentDisplay instrument={experiment.instrument} />
        </>
      )}
      {(experiment.experiment_results ?? []).length ? (
        <>
          <Divider style={{ margin: '8px 0 4px 0' }} />
          <Typography.Title level={4} style={{ fontSize: 14 }}>
            {t('entities.experiment_result', T_PLURAL_COUNT)}
          </Typography.Title>
          {/*
            Cannot use query key row expansion in this nested view, so we force ExperimentResultView to use local state.
            */}
          <ExperimentResultView
            packetId={packetId}
            currentExperiment={experiment.id}
            experimentResults={experiment.experiment_results!}
            urlAware={false}
            searchRow={searchRow}
          />
        </>
      ) : null}
    </Space>
  );
};

export const isExperimentRowExpandable = (r: Experiment) =>
  !!(
    r.description ||
    r.protocol_url ||
    r.insert_size ||
    objectToBoolean(r.experiment_ontology) ||
    r.study_type ||
    r.molecule ||
    objectToBoolean(r.molecule_ontology) ||
    r.library_id ||
    r.library_description ||
    r.library_extract_id ||
    r.library_strategy ||
    r.library_source ||
    r.library_selection ||
    r.library_layout ||
    r.extraction_protocol ||
    r.reference_registry_id ||
    r.qc_flags?.length ||
    r.experiment_results?.length ||
    objectToBoolean(r.instrument) ||
    objectToBoolean(r.extra_properties)
  );

const _countItems = (x: string[]): Record<string, number> => {
  const counts: Record<string, number> = {};
  x.forEach((v) => (counts[v] = (counts[v] ?? 0) + 1));
  return counts;
};

export const ExperimentResultFileTypeCounts = ({
  results,
}: {
  results: ExperimentResult[] | DiscoveryMatchExperimentResult[] | undefined;
}) => {
  // Render like "1 x CRAM, 2 x VCF"
  // TODO: popover with list of file names
  const counts = _countItems((results ?? []).map((er) => er.file_format ?? 'Unknown'));
  const countItems = Object.entries(counts).sort((a, b) => a[0].localeCompare(b[0]));
  return countItems.map((i) => `${i[1]} \u00d7 ${i[0]}`).join(', ');
};

type ExperimentViewProps = {
  packetId?: string;
  experiments: Experiment[];
};

const ExperimentView = ({ packetId, experiments }: ExperimentViewProps) => {
  const columns = useMemo<CustomTableColumns<Experiment>>(
    () => [
      { title: 'experiment.experiment_id', dataIndex: 'id', alwaysShow: true },
      { title: 'experiment.experiment_type', dataIndex: 'experiment_type' },
      {
        title: 'entities.biosample_one',
        dataIndex: 'biosample',
        render: (biosampleId: string | undefined) =>
          biosampleId ? <PhenopacketLink.Biosample packetId={packetId} sampleId={biosampleId} /> : null,
        isEmpty: (biosampleId: string | undefined) => biosampleId === undefined,
      },
      {
        title: 'entities.experiment_result_other',
        dataIndex: 'experiment_results',
        render: (results: ExperimentResult[] | undefined) => {
          // Render like "1 x CRAM, 2 x VCF"
          // TODO: popover with list of file names
          return <ExperimentResultFileTypeCounts results={results} />;
        },
      },
    ],
    [packetId]
  );

  return (
    <CustomTable<Experiment>
      dataSource={experiments}
      columns={columns}
      expandedRowRender={(record) => <ExperimentExpandedRow experiment={record} />}
      rowKey="id"
      queryKey="experiment"
      isRowExpandable={isExperimentRowExpandable}
    />
  );
};

export default ExperimentView;
