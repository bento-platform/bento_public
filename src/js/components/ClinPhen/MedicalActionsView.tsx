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
import { Resource } from '@/types/clinPhen/resource';
import { Procedure } from '@/types/clinPhen/procedure';
import TimeElementDisplay, { TimeIntervalDisplay } from './TimeElementDisplay';
import { EM_DASH } from '@/constants/common';
import { QuantityComponent } from './Measurements';
import { Quantity } from '@/types/clinPhen/measurement';
import { TimeInterval } from '@/types/clinPhen/shared';

const ProcedureComponent = ({ procedure, resources }: { procedure: Procedure; resources: Resource[] }) => {
  const ProcedureItems: DescriptionsProps['items'] = [
    {
      key: 'code',
      label: 'Code',
      children: <OntologyTermComponent term={procedure.code} resources={resources} />,
    },
    {
      key: 'bodySite',
      label: 'Body Site',
      children: <OntologyTermComponent term={procedure.body_site} resources={resources} />,
    },
    {
      key: 'Performed',
      label: 'Performed',
      children: <TimeElementDisplay element={procedure.performed} />,
    },
  ];
  return <Descriptions bordered column={1} size="small" items={ProcedureItems} />;
};

const TreatmentComponent = ({ treatment, resources }: { treatment: Treatment; resources: Resource[] }) => {
  const DOSE_INTERVAL_COLUMNS = [
    {
      key: 'quantity',
      title: 'Quantity',
      dataIndex: 'quantity',
      render: (quantity: Quantity) => <QuantityComponent quantity={quantity} resources={resources} />,
    },
    {
      key: 'schedule_frequency',
      title: 'Schedule Frequency',
      dataIndex: 'schedule_frequency',
      render: (term: OntologyTerm) => <OntologyTermComponent term={term} resources={resources} />,
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
      children: <OntologyTermComponent term={treatment.agent} resources={resources} />,
    },
    {
      key: 'routeOfAdministration',
      label: 'Route of Administration',
      children: <OntologyTermComponent term={treatment.route_of_administration} resources={resources} />,
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
        <QuantityComponent quantity={treatment.cumulative_dose} title="Cumulative Dose" resources={resources} />
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
      children: <OntologyTermComponent term={radiation_therapy.modality} resources={[]} />,
    },
    {
      key: 'bodySite',
      label: 'Body Site',
      children: <OntologyTermComponent term={radiation_therapy.body_site} resources={[]} />,
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

const TherapeuticRegimenComponent = ({
  therapeutic_regimen,
  resources,
}: {
  therapeutic_regimen: TherapeuticRegimen;
  resources: Resource[];
}) => {
  const TherapeuticRegimenItems: DescriptionsProps['items'] = [
    {
      key: 'Identifier',
      label: 'Identifier',
      children: (
        <>
          {therapeutic_regimen.ontology_class ?? (
            <OntologyTermComponent term={therapeutic_regimen.ontology_class} resources={resources} />
          )}
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

const MedicalActionDetails = ({
  medicalAction,
  resources,
}: {
  medicalAction: MedicalAction;
  resources: Resource[];
}) => {
  const MedicalActionItems: DescriptionsProps['items'] = [
    medicalAction.procedure && {
      key: 'procedure',
      label: 'Procedure',
      children: <ProcedureComponent procedure={medicalAction.procedure} resources={resources} />,
    },
    medicalAction.treatment && {
      key: 'treatment',
      label: 'Treatment',
      children: <TreatmentComponent treatment={medicalAction.treatment} resources={resources} />,
    },
    medicalAction.radiation_therapy && {
      key: 'radiationTherapy',
      label: 'Radiation Therapy',
      children: <RadiationTherapyComponent radiation_therapy={medicalAction.radiation_therapy} />,
    },
    medicalAction.therapeutic_regimen && {
      key: 'therapeuticRegimen',
      label: 'Therapeutic Regimen',
      children: (
        <TherapeuticRegimenComponent therapeutic_regimen={medicalAction.therapeutic_regimen} resources={resources} />
      ),
    },
    {
      key: 'adverseEvents',
      label: 'Adverse Events',
      children: <OntologyTermStack terms={medicalAction.adverse_events} resources={resources} />,
    },
  ].filter((item) => item) as DescriptionsProps['items'];
  return <Descriptions bordered column={1} size="small" items={MedicalActionItems} />;
};

const MedicalActionsView = ({
  medicalActions,
  resources,
}: {
  medicalActions: MedicalAction[];
  resources: Resource[];
}) => {
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
      render: (target: OntologyTerm) => <OntologyTermComponent term={target} resources={resources} />,
    },
    {
      title: 'Treatment Intent',
      dataIndex: 'treatment_intent',
      key: 'treatmentIntent',
      render: (intent: OntologyTerm) => <OntologyTermComponent term={intent} resources={resources} />,
    },
    {
      title: 'Response to Treatment',
      dataIndex: 'response_to_treatment',
      key: 'responseToTreatment',
      render: (response: OntologyTerm) => <OntologyTermComponent term={response} resources={resources} />,
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
      render: (reason: OntologyTerm) => <OntologyTermComponent term={reason} resources={resources} />,
    },
  ];

  return (
    <Table<MedicalAction>
      dataSource={medicalActions}
      columns={columns}
      expandable={{
        expandedRowRender: (record) => <MedicalActionDetails medicalAction={record} resources={resources} />,
      }}
      rowKey={(record) =>
        record.procedure?.code?.id || record.treatment?.agent?.id || record.radiation_therapy?.modality?.id || 'unknown'
      }
    />
  );
};

export default MedicalActionsView;
