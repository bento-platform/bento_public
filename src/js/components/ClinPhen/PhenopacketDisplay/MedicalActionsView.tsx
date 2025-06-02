import { Flex, Table } from 'antd';

import OntologyTermComponent, { OntologyTermStack } from '@Util/ClinPhen/OntologyTerm';
import QuantityDisplay from '@Util/ClinPhen/QuantityDisplay';
import TimeElementDisplay, { TimeIntervalDisplay } from '@Util/ClinPhen/TimeElementDisplay';
import TDescriptions from '@Util/TDescriptions';

import { EM_DASH } from '@/constants/common';

import type { DescriptionsProps } from 'antd';
import type {
  Treatment,
  DoseInterval,
  RadiationTherapy,
  TherapeuticRegimen,
  MedicalAction,
} from '@/types/clinPhen/medicalAction';
import type { Quantity } from '@/types/clinPhen/measurement';
import type { OntologyTerm } from '@/types/ontology';
import type { Procedure } from '@/types/clinPhen/procedure';
import type { TimeInterval } from '@/types/clinPhen/shared';
import { useTranslatedTableColumnTitles } from '@/hooks/useTranslatedTableColumnTitles';
export const ProcedureComponent = ({ procedure }: { procedure: Procedure }) => {
  const ProcedureItems: DescriptionsProps['items'] = [
    {
      key: 'code',
      label: 'medical_actions.code',
      children: <OntologyTermComponent term={procedure.code} />,
    },
    {
      key: 'bodySite',
      label: 'medical_actions.body_site',
      children: <OntologyTermComponent term={procedure.body_site} />,
    },
    {
      key: 'Performed',
      label: 'medical_actions.performed',
      children: <TimeElementDisplay element={procedure.performed} />,
    },
  ];
  return <TDescriptions bordered column={1} size="small" items={ProcedureItems} />;
};

const TreatmentComponent = ({ treatment }: { treatment: Treatment }) => {
  const DOSE_INTERVAL_COLUMNS = useTranslatedTableColumnTitles<DoseInterval>([
    {
      key: 'quantity',
      title: 'medical_actions.quantity',
      dataIndex: 'quantity',
      render: (quantity: Quantity) => <QuantityDisplay quantity={quantity} />,
    },
    {
      key: 'schedule_frequency',
      title: 'medical_actions.schedule_frequency',
      dataIndex: 'schedule_frequency',
      render: (term: OntologyTerm) => <OntologyTermComponent term={term} />,
    },
    {
      key: 'interval',
      title: 'medical_actions.interval',
      dataIndex: 'interval',
      render: (interval: TimeInterval) => <TimeIntervalDisplay timeInterval={interval} />,
    },
  ]);

  const TreatmentItems: DescriptionsProps['items'] = [
    {
      key: 'agent',
      label: 'medical_actions.agent',
      children: <OntologyTermComponent term={treatment.agent} />,
    },
    {
      key: 'routeOfAdministration',
      label: 'medical_actions.route_of_administration',
      children: <OntologyTermComponent term={treatment.route_of_administration} />,
    },
    {
      key: 'doseIntervals',
      label: 'medical_actions.dose_intervals',
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
      label: 'medical_actions.drug_type',
      children: treatment.drug_type,
    },
    {
      key: 'cumulativeDose',
      label: 'medical_actions.cumulative_dose',
      children: treatment?.cumulative_dose ? (
        <QuantityDisplay quantity={treatment.cumulative_dose} title="medical_actions.cumulative_dose" />
      ) : (
        EM_DASH
      ),
    },
  ];
  return <TDescriptions bordered column={1} size="small" items={TreatmentItems} />;
};

const RadiationTherapyComponent = ({ radiation_therapy }: { radiation_therapy: RadiationTherapy }) => {
  const RadiationTherapyItems: DescriptionsProps['items'] = [
    {
      key: 'modality',
      label: 'medical_actions.modality',
      children: <OntologyTermComponent term={radiation_therapy.modality} />,
    },
    {
      key: 'bodySite',
      label: 'medical_actions.body_site',
      children: <OntologyTermComponent term={radiation_therapy.body_site} />,
    },
    {
      key: 'dosage',
      label: 'medical_actions.dosage',
      children: radiation_therapy.dosage,
    },
    {
      key: 'fractions',
      label: 'medical_actions.fractions',
      children: radiation_therapy.fractions,
    },
  ];
  return <TDescriptions bordered column={1} size="small" items={RadiationTherapyItems} />;
};

const TherapeuticRegimenComponent = ({ therapeutic_regimen }: { therapeutic_regimen: TherapeuticRegimen }) => {
  const TherapeuticRegimenItems: DescriptionsProps['items'] = [
    {
      key: 'Identifier',
      label: 'medical_actions.identifier',
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
      label: 'medical_actions.start_time',
      children: <TimeElementDisplay element={therapeutic_regimen.start_time} />,
    },
    {
      key: 'End Time',
      label: 'medical_actions.end_time',
      children: <TimeElementDisplay element={therapeutic_regimen.end_time} />,
    },
    {
      key: 'Status',
      label: 'medical_actions.status',
      children: therapeutic_regimen.status ?? EM_DASH,
    },
  ];
  return <TDescriptions bordered column={1} size="small" items={TherapeuticRegimenItems} />;
};

const MedicalActionDetails = ({ medicalAction }: { medicalAction: MedicalAction }) => {
  const MedicalActionItems: DescriptionsProps['items'] = [
    medicalAction.procedure && {
      key: 'procedure',
      label: 'medical_actions.procedure',
      children: <ProcedureComponent procedure={medicalAction.procedure} />,
    },
    medicalAction.treatment && {
      key: 'treatment',
      label: 'medical_actions.treatment',
      children: <TreatmentComponent treatment={medicalAction.treatment} />,
    },
    medicalAction.radiation_therapy && {
      key: 'radiationTherapy',
      label: 'medical_actions.radiation_therapy',
      children: <RadiationTherapyComponent radiation_therapy={medicalAction.radiation_therapy} />,
    },
    medicalAction.therapeutic_regimen && {
      key: 'therapeuticRegimen',
      label: 'medical_actions.therapeutic_regimen',
      children: <TherapeuticRegimenComponent therapeutic_regimen={medicalAction.therapeutic_regimen} />,
    },
    {
      key: 'adverseEvents',
      label: 'medical_actions.adverse_events',
      children: <OntologyTermStack terms={medicalAction.adverse_events} />,
    },
  ].filter((item) => item) as DescriptionsProps['items'];
  return <TDescriptions bordered column={1} size="small" items={MedicalActionItems} />;
};

const MedicalActionsView = ({ medicalActions }: { medicalActions: MedicalAction[] }) => {
  const columns = useTranslatedTableColumnTitles<MedicalAction>([
    {
      title: 'medical_actions.action_type',
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
      title: 'medical_actions.treatment_target',
      dataIndex: 'treatment_target',
      key: 'treatmentTarget',
      render: (target: OntologyTerm) => <OntologyTermComponent term={target} />,
    },
    {
      title: 'medical_actions.treatment_intent',
      dataIndex: 'treatment_intent',
      key: 'treatmentIntent',
      render: (intent: OntologyTerm) => <OntologyTermComponent term={intent} />,
    },
    {
      title: 'medical_actions.response_to_treatment',
      dataIndex: 'response_to_treatment',
      key: 'responseToTreatment',
      render: (response: OntologyTerm) => <OntologyTermComponent term={response} />,
    },
    {
      title: 'medical_actions.adverse_events',
      dataIndex: 'adverse_events',
      key: 'adverseEvents',
      render: (events: OntologyTerm[]) => events?.length ?? 0,
    },
    {
      title: 'medical_actions.treatment_termination_reason',
      dataIndex: 'treatment_termination_reason',
      key: 'treatmentTerminationReason',
      render: (reason: OntologyTerm) => <OntologyTermComponent term={reason} />,
    },
  ]);

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
