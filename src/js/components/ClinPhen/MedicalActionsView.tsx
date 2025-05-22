import { Descriptions, DescriptionsProps, Flex, Table } from 'antd';
import {
  DoseInterval,
  MedicalAction,
  RadiationTherapy,
  TherapeuticRegimen,
  Treatment,
} from '@/types/clinPhen/medicalAction';
import { OntologyTerm } from '@/types/ontology';
import OntologyTermComponent, { OntologyTermStack } from './OntologyTerm';
import { Procedure } from '@/types/clinPhen/procedure';
import TimeElementDisplay, { TimeIntervalDisplay } from './TimeElementDisplay';
import { EM_DASH } from '@/constants/common';
import { Quantity } from '@/types/clinPhen/measurement';
import { TimeInterval } from '@/types/clinPhen/shared';
import QuantityDisplay from '../Util/QuantityDisplay';

const ProcedureComponent = ({ procedure }: { procedure: Procedure }) => {
  const ProcedureItems: DescriptionsProps['items'] = [
    {
      key: 'code',
      label: 'Code',
      children: <OntologyTermComponent term={procedure.code} />,
    },
    {
      key: 'bodySite',
      label: 'Body Site',
      children: <OntologyTermComponent term={procedure.body_site} />,
    },
    {
      key: 'Performed',
      label: 'Performed',
      children: <TimeElementDisplay element={procedure.performed} />,
    },
  ];
  return <Descriptions bordered column={1} size="small" items={ProcedureItems} />;
};

const TreatmentComponent = ({ treatment }: { treatment: Treatment }) => {
  const DOSE_INTERVAL_COLUMNS = [
    {
      key: 'quantity',
      title: 'Quantity',
      dataIndex: 'quantity',
      render: (quantity: Quantity) => <QuantityDisplay quantity={quantity} />,
    },
    {
      key: 'schedule_frequency',
      title: 'Schedule Frequency',
      dataIndex: 'schedule_frequency',
      render: (term: OntologyTerm) => <OntologyTermComponent term={term} />,
    },
    {
      key: 'interval',
      title: 'Interval',
      dataIndex: 'interval',
      render: (interval: TimeInterval) => <TimeIntervalDisplay timeInterval={interval} />,
    },
  ];

  const TreatmentItems: DescriptionsProps['items'] = [
    {
      key: 'agent',
      label: 'Agent',
      children: <OntologyTermComponent term={treatment.agent} />,
    },
    {
      key: 'routeOfAdministration',
      label: 'Route of Administration',
      children: <OntologyTermComponent term={treatment.route_of_administration} />,
    },
    {
      key: 'doseIntervals',
      label: 'Dose Intervals',
      children: treatment?.dose_intervals ? (
        <Table<DoseInterval>
          bordered={true}
          pagination={false}
          size="small"
          columns={DOSE_INTERVAL_COLUMNS}
          dataSource={treatment.dose_intervals}
        />
      ) : (
        EM_DASH
      ),
    },
    {
      key: 'drugType',
      label: 'Drug Type',
      children: treatment.drug_type,
    },
    {
      key: 'cumulativeDose',
      label: 'Cumulative Dose',
      children: treatment?.cumulative_dose ? (
        <QuantityDisplay quantity={treatment.cumulative_dose} title="Cumulative Dose" />
      ) : (
        EM_DASH
      ),
    },
  ];
  return <Descriptions bordered column={1} size="small" items={TreatmentItems} />;
};

const RadiationTherapyComponent = ({ radiation_therapy }: { radiation_therapy: RadiationTherapy }) => {
  const RadiationTherapyItems: DescriptionsProps['items'] = [
    {
      key: 'modality',
      label: 'Modality',
      children: <OntologyTermComponent term={radiation_therapy.modality} />,
    },
    {
      key: 'bodySite',
      label: 'Body Site',
      children: <OntologyTermComponent term={radiation_therapy.body_site} />,
    },
    {
      key: 'dosage',
      label: 'Dosage',
      children: radiation_therapy.dosage,
    },
    {
      key: 'fractions',
      label: 'Fractions',
      children: radiation_therapy.fractions,
    },
  ];
  return <Descriptions bordered column={1} size="small" items={RadiationTherapyItems} />;
};

const TherapeuticRegimenComponent = ({ therapeutic_regimen }: { therapeutic_regimen: TherapeuticRegimen }) => {
  const TherapeuticRegimenItems: DescriptionsProps['items'] = [
    {
      key: 'Identifier',
      label: 'Identifier',
      children: (
        <>
          {therapeutic_regimen.ontology_class ?? <OntologyTermComponent term={therapeutic_regimen.ontology_class} />}
          {therapeutic_regimen.external_reference && (
            <Flex vertical>
              <div>
                <strong>ID:</strong>
                {therapeutic_regimen?.external_reference?.id ?? EM_DASH}
              </div>
              <div>
                <strong>Reference:</strong>
                {therapeutic_regimen?.external_reference?.reference ?? EM_DASH}
              </div>
              <div>
                <strong>Description:</strong>
                {therapeutic_regimen?.external_reference?.description ?? EM_DASH}
              </div>
            </Flex>
          )}
        </>
      ),
    },
    {
      key: 'Start Time',
      label: 'Start Time',
      children: <TimeElementDisplay element={therapeutic_regimen.start_time} />,
    },
    {
      key: 'End Time',
      label: 'End Time',
      children: <TimeElementDisplay element={therapeutic_regimen.end_time} />,
    },
    {
      key: 'Status',
      label: 'Status',
      children: therapeutic_regimen.status ?? EM_DASH,
    },
  ];
  return <Descriptions bordered column={1} size="small" items={TherapeuticRegimenItems} />;
};

const MedicalActionDetails = ({ medicalAction }: { medicalAction: MedicalAction }) => {
  const MedicalActionItems: DescriptionsProps['items'] = [
    medicalAction.procedure && {
      key: 'procedure',
      label: 'Procedure',
      children: <ProcedureComponent procedure={medicalAction.procedure} />,
    },
    medicalAction.treatment && {
      key: 'treatment',
      label: 'Treatment',
      children: <TreatmentComponent treatment={medicalAction.treatment} />,
    },
    medicalAction.radiation_therapy && {
      key: 'radiationTherapy',
      label: 'Radiation Therapy',
      children: <RadiationTherapyComponent radiation_therapy={medicalAction.radiation_therapy} />,
    },
    medicalAction.therapeutic_regimen && {
      key: 'therapeuticRegimen',
      label: 'Therapeutic Regimen',
      children: <TherapeuticRegimenComponent therapeutic_regimen={medicalAction.therapeutic_regimen} />,
    },
    {
      key: 'adverseEvents',
      label: 'Adverse Events',
      children: <OntologyTermStack terms={medicalAction.adverse_events} />,
    },
  ].filter((item) => item) as DescriptionsProps['items'];
  return <Descriptions bordered column={1} size="small" items={MedicalActionItems} />;
};

const MedicalActionsView = ({ medicalActions }: { medicalActions: MedicalAction[] }) => {
  const columns = [
    {
      title: 'Action Type',
      key: 'actionType',
      render: (_: any, action: MedicalAction) => {
        if (action.procedure) return 'Procedure';
        if (action.treatment) return 'Treatment';
        if (action.radiation_therapy) return 'Radiation Therapy';
        if (action.therapeutic_regimen) return 'Therapeutic Regimen';
        return 'Unknown';
      },
    },
    {
      title: 'Treatment Target',
      dataIndex: 'treatment_target',
      key: 'treatmentTarget',
      render: (target: OntologyTerm) => <OntologyTermComponent term={target} />,
    },
    {
      title: 'Treatment Intent',
      dataIndex: 'treatment_intent',
      key: 'treatmentIntent',
      render: (intent: OntologyTerm) => <OntologyTermComponent term={intent} />,
    },
    {
      title: 'Response to Treatment',
      dataIndex: 'response_to_treatment',
      key: 'responseToTreatment',
      render: (response: OntologyTerm) => <OntologyTermComponent term={response} />,
    },
    {
      title: 'Adverse Events',
      dataIndex: 'adverse_events',
      key: 'adverseEvents',
      render: (events: OntologyTerm[]) => events?.length ?? 0,
    },
    {
      title: 'Treatment Termination Reason',
      dataIndex: 'treatment_termination_reason',
      key: 'treatmentTerminationReason',
      render: (reason: OntologyTerm) => <OntologyTermComponent term={reason} />,
    },
  ];

  return (
    <Table<MedicalAction>
      dataSource={medicalActions}
      columns={columns}
      expandable={{
        expandedRowRender: (record) => <MedicalActionDetails medicalAction={record} />,
      }}
      rowKey={(record) =>
        record.procedure?.code?.id || record.treatment?.agent?.id || record.radiation_therapy?.modality?.id || 'unknown'
      }
    />
  );
};

export default MedicalActionsView;
