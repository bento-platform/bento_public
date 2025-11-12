import { Divider, Space, Typography } from 'antd';

import type { Experiment } from '@/types/clinPhen/experiments/experiment';
import type { ExperimentResult } from '@/types/clinPhen/experiments/experimentResult';
import type { ConditionalDescriptionItem } from '@/types/descriptions';

import { OntologyTermStack } from '@Util/ClinPhen/OntologyTerm';
import CustomTable, { type CustomTableColumns } from '@Util/CustomTable';
import TDescriptions from '@Util/TDescriptions';
import ExtraPropertiesDisplay from '@/components/ClinPhen/PhenopacketDisplay/ExtraPropertiesDisplay';
import InstrumentDisplay from './InstrumentDisplay';
import ExperimentResultView from '@/components/ClinPhen/ExperimentDisplay/ExperimentResultView';

import { T_PLURAL_COUNT } from '@/constants/i18n';
import { useTranslationFn } from '@/hooks';

export const ExperimentExpandedRow = ({ experiment, searchRow }: { experiment: Experiment; searchRow?: boolean }) => {
  const t = useTranslationFn();

  const items: ConditionalDescriptionItem[] = [
    ...(searchRow
      ? [
          {
            key: 'experiment_type',
            label: 'experiment.experiment_type',
            children: experiment.experiment_type,
          },
        ]
      : []),
    {
      key: 'experiment_ontology',
      label: 'experiment.experiment_ontology',
      children: <OntologyTermStack terms={experiment.experiment_ontology} />,
      isVisible: !!experiment.experiment_ontology?.length,
    },
    {
      key: 'study_type',
      label: 'experiment.study_type',
      children: experiment.study_type,
    },
    {
      key: 'molecule',
      label: 'experiment.molecule',
      children: experiment.molecule,
    },
    {
      key: 'molecule_ontology',
      label: 'experiment.molecule_ontology',
      children: <OntologyTermStack terms={experiment.molecule_ontology} />,
      isVisible: !!experiment.molecule_ontology?.length,
    },
    {
      key: 'library_strategy',
      label: 'experiment.library_strategy',
      children: experiment.library_strategy,
    },
    {
      key: 'library_source',
      label: 'experiment.library_source',
      children: experiment.library_source,
    },
    {
      key: 'library_selection',
      label: 'experiment.library_selection',
      children: experiment.library_selection,
    },
    {
      key: 'library_layout',
      label: 'experiment.library_layout',
      children: experiment.library_layout,
    },
    {
      key: 'extraction_protocol',
      label: 'experiment.extraction_protocol',
      children: experiment.extraction_protocol,
    },
    {
      key: 'reference_registry_id',
      label: 'experiment.reference_registry_id',
      children: experiment.reference_registry_id,
    },
    {
      key: 'qc_flags',
      label: 'experiment.qc_flags',
      children: (experiment.qc_flags ?? []).join(', '),
      isVisible: (experiment.qc_flags ?? []).length,
    },
  ];

  return (
    <Space direction="vertical" className="w-full">
      <TDescriptions bordered size="compact" column={{ lg: 1, xl: 3 }} items={items} />
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
            Cannot use query key row expansion in search right now, so we force ExperimentResultView to use local state.
            */}
          <ExperimentResultView experimentResults={experiment.experiment_results!} urlAware={!searchRow} />
        </>
      ) : null}
    </Space>
  );
};

export const isExperimentRowExpandable = (r: Experiment) =>
  !!(
    r.experiment_ontology?.length ||
    r.study_type ||
    r.molecule ||
    r.molecule_ontology?.length ||
    r.library_strategy ||
    r.library_source ||
    r.library_selection ||
    r.library_layout ||
    r.extraction_protocol ||
    r.reference_registry_id ||
    r.qc_flags?.length ||
    r.experiment_results?.length ||
    r.instrument ||
    Object.keys(r.extra_properties ?? {}).length
  );

const _countItems = (x: string[]): Record<string, number> => {
  const counts: Record<string, number> = {};
  x.forEach((v) => (counts[v] = (counts[v] ?? 0) + 1));
  return counts;
};

const EXPERIMENT_VIEW_COLUMNS: CustomTableColumns<Experiment> = [
  {
    title: 'experiment.experiment_id',
    dataIndex: 'id',
    alwaysShow: true,
  },
  {
    title: 'experiment.experiment_type',
    dataIndex: 'experiment_type',
  },
  {
    title: 'entities.experiment_result_other',
    dataIndex: 'experiment_results',
    render: (results: ExperimentResult[]) => {
      // Render like "1 x CRAM, 2 x VCF"
      // TODO: popover with list of file names
      const counts = _countItems(results.map((er) => er.file_format ?? 'Unknown'));
      const countItems = Object.entries(counts).sort((a, b) => a[0].localeCompare(b[0]));
      return countItems.map((i) => `${i[1]} \u00d7 ${i[0]}`).join(', ');
    },
  },
];

type ExperimentViewProps = {
  experiments: Experiment[];
};

const ExperimentView = ({ experiments }: ExperimentViewProps) => {
  return (
    <CustomTable<Experiment>
      dataSource={experiments}
      columns={EXPERIMENT_VIEW_COLUMNS}
      expandedRowRender={(record) => <ExperimentExpandedRow experiment={record} />}
      rowKey="id"
      queryKey="experiment"
      isRowExpandable={isExperimentRowExpandable}
    />
  );
};

export default ExperimentView;
