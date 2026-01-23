import { useId, useMemo, useState } from 'react';
import { useTranslationFn } from '@/hooks';

import { Divider, Flex, Radio, Space, Table, Typography } from 'antd';

import type { DiscoveryMatchExperimentResult } from '@/features/search/types';
import type { Biosample } from '@/types/clinPhen/biosample';
import type { Experiment } from '@/types/clinPhen/experiments/experiment';
import type { ExperimentResult } from '@/types/clinPhen/experiments/experimentResult';
import type { ConditionalDescriptionItem } from '@/types/descriptions';

import { OntologyTermStack } from '@Util/ClinPhen/OntologyTerm';
import CustomTable, { type CustomTableColumns } from '@Util/CustomTable';
import TDescriptions from '@Util/TDescriptions';
import ExtraPropertiesDisplay from '@Util/ClinPhen/ExtraPropertiesDisplay';
import PhenopacketLink from '@/components/ClinPhen/PhenopacketLink';
import InstrumentDisplay from './InstrumentDisplay';
import ExperimentResultView from '@/components/ClinPhen/ExperimentDisplay/ExperimentResultView';

import { T_PLURAL_COUNT } from '@/constants/i18n';
import { objectToBoolean } from '@/utils/boolean';

type ExperimentExpandedRowProps = {
  packetId?: string;
  experiment: Experiment;
  searchRow?: boolean; // undefined implies false
};

export const ExperimentExpandedRow = ({ packetId, experiment, searchRow }: ExperimentExpandedRowProps) => {
  const t = useTranslationFn();

  const items: ConditionalDescriptionItem[] = [
    { key: 'experiment_type', children: experiment.experiment_type },
    {
      key: 'experiment_ontology',
      children: <OntologyTermStack terms={experiment.experiment_ontology} />,
      isVisible: objectToBoolean(experiment.experiment_ontology),
    },
    { key: 'study_type', children: experiment.study_type },
    { key: 'molecule', children: experiment.molecule },
    {
      key: 'molecule_ontology',
      children: <OntologyTermStack terms={experiment.molecule_ontology} />,
      isVisible: !!experiment.molecule_ontology?.length,
    },
    { key: 'library_strategy', children: experiment.library_strategy },
    { key: 'library_source', children: experiment.library_source },
    { key: 'library_selection', children: experiment.library_selection },
    { key: 'library_layout', children: experiment.library_layout },
    { key: 'extraction_protocol', children: experiment.extraction_protocol },
    { key: 'reference_registry_id', children: experiment.reference_registry_id },
    {
      key: 'qc_flags',
      children: (experiment.qc_flags ?? []).join(', '),
      isVisible: objectToBoolean(experiment.qc_flags),
    },
  ];

  return (
    <Space direction="vertical" className="w-full">
      <TDescriptions bordered size="compact" column={{ xl: 1, xxl: 3 }} items={items} defaultI18nPrefix="experiment." />
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
    objectToBoolean(r.experiment_ontology) ||
    r.study_type ||
    r.molecule ||
    objectToBoolean(r.molecule_ontology) ||
    r.library_strategy ||
    r.library_source ||
    r.library_selection ||
    r.library_layout ||
    r.extraction_protocol ||
    r.reference_registry_id ||
    r.qc_flags?.length ||
    r.experiment_results?.length ||
    r.instrument ||
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
  biosamples: Biosample[];
  experiments: Experiment[];
};

const MATRIX_EXPERIMENT_TYPE_WIDTH = 170;

const ExperimentView = ({ packetId, biosamples, experiments }: ExperimentViewProps) => {
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

  const viewModeRadioId = useId();
  const [viewMode, setViewMode] = useState<'list' | 'matrix'>('list');

  const experimentsByBiosample = Object.fromEntries(biosamples.map((bb) => [bb.id, bb.experiments ?? []]));

  const experimentTypes = [
    ...new Set(Object.values(experimentsByBiosample).flatMap((e) => e.map((ee) => ee.experiment_type))),
  ];

  return (
    <Flex vertical={true} gap={12}>
      <Flex gap="0.7em" align="center">
        <label htmlFor={viewModeRadioId}>View as:</label>
        <Radio.Group
          id={viewModeRadioId}
          optionType="button"
          buttonStyle="solid"
          size="small"
          value={viewMode}
          onChange={(e) => setViewMode(e.target.value)}
          options={[
            { label: 'List', value: 'list' },
            { label: 'Matrix', value: 'matrix', disabled: !biosamples.length },
          ]}
        />
      </Flex>
      {viewMode === 'matrix' ? (
        <Table
          pagination={false}
          bordered={true}
          columns={[
            {
              dataIndex: 'experimentType',
              title: 'Experiment Type',
              width: MATRIX_EXPERIMENT_TYPE_WIDTH,
              align: 'right',
            },
            {
              title: 'Biosamples',
              children: Object.keys(experimentsByBiosample).map((bId) => ({
                dataIndex: `biosample_${bId}`,
                title: <PhenopacketLink.Biosample packetId={packetId} sampleId={bId} />,
                width: `calc((100% - ${MATRIX_EXPERIMENT_TYPE_WIDTH}px) / ${biosamples.length})`,
                align: 'center',
                // TODO: multiple experiments per experiment type
                render: (eId: string | undefined) =>
                  eId ? <PhenopacketLink.Experiment packetId={packetId} experimentId={eId} /> : null,
              })),
            },
          ]}
          dataSource={experimentTypes.map((et) => ({
            experimentType: et,
            // TODO: multiple experiments per experiment type
            ...Object.fromEntries(
              Object.entries(experimentsByBiosample).map(([bId, es]) => [
                `biosample_${bId}`,
                es.find((ee) => ee.experiment_type === et)?.id,
              ])
            ),
          }))}
        />
      ) : (
        <CustomTable<Experiment>
          dataSource={experiments}
          columns={columns}
          expandedRowRender={(record) => <ExperimentExpandedRow experiment={record} />}
          rowKey="id"
          queryKey="experiment"
          isRowExpandable={isExperimentRowExpandable}
        />
      )}
    </Flex>
  );
};

export default ExperimentView;
