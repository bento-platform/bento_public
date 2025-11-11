import { Flex, Typography } from 'antd';

import OntologyTermComponent, { OntologyTermStack } from '@Util/ClinPhen/OntologyTerm';
import QuantityDisplay from '@Util/ClinPhen/QuantityDisplay';
import TimeElementDisplay, { TimeIntervalDisplay } from '@Util/ClinPhen/TimeElementDisplay';
import TDescriptions from '@Util/TDescriptions';
import CustomTable, { type CustomTableColumns } from '@Util/CustomTable';
import ProcedureComponent from '@Util/ClinPhen/Procedure';

import { EM_DASH } from '@/constants/common';

import type {
  Treatment,
  DoseInterval,
  RadiationTherapy,
  TherapeuticRegimen,
  MedicalAction,
} from '@/types/clinPhen/medicalAction';
import type { Quantity } from '@/types/clinPhen/measurement';
import type { OntologyTerm } from '@/types/ontology';
import type { TimeInterval } from '@/types/clinPhen/shared';
import type { ConditionalDescriptionItem } from '@/types/descriptions';

import { addId, type WithId } from '@/utils/arrays';
import { useTranslationFn } from '@/hooks';

const { Text } = Typography;

type DoseIntervalWithId = WithId<DoseInterval>;

const DOSE_INTERVAL_COLUMNS: CustomTableColumns<DoseIntervalWithId> = [
  {
    title: 'medical_actions.quantity',
    dataIndex: 'quantity',
    render: (quantity: Quantity) => <QuantityDisplay quantity={quantity} />,
    alwaysShow: true,
  },
  {
    title: 'medical_actions.schedule_frequency',
    dataIndex: 'schedule_frequency',
    render: (term: OntologyTerm) => <OntologyTermComponent term={term} />,
    alwaysShow: true,
  },
  {
    title: 'medical_actions.interval',
    dataIndex: 'interval',
    render: (interval: TimeInterval) => <TimeIntervalDisplay timeInterval={interval} br />,
    alwaysShow: true,
  },
];

const TreatmentComponent = ({ treatment }: { treatment: Treatment }) => {
  const TreatmentItems: ConditionalDescriptionItem[] = [
    {
      key: 'agent',
      label: 'medical_actions.agent',
      children: <OntologyTermComponent term={treatment.agent} />,
      isVisible: treatment?.agent,
    },
    {
      key: 'routeOfAdministration',
      label: 'medical_actions.route_of_administration',
      children: <OntologyTermComponent term={treatment.route_of_administration} />,
      isVisible: treatment?.route_of_administration,
    },
    {
      key: 'doseIntervals',
      label: 'medical_actions.dose_intervals',
      children: (
        <CustomTable<DoseIntervalWithId>
          columns={DOSE_INTERVAL_COLUMNS}
          dataSource={addId(treatment.dose_intervals || [])}
          rowKey={(record) => record.id}
          isRowExpandable={() => true}
        />
      ),
      isVisible: treatment?.dose_intervals,
    },
    {
      key: 'drugType',
      label: 'medical_actions.drug_type',
      children: treatment?.drug_type,
    },
    {
      key: 'cumulativeDose',
      label: 'medical_actions.cumulative_dose',
      children: <QuantityDisplay quantity={treatment.cumulative_dose!} title="medical_actions.cumulative_dose" />,
      isVisible: treatment?.cumulative_dose,
    },
  ];
  return <TDescriptions bordered column={1} size="compact" items={TreatmentItems} />;
};

const RadiationTherapyComponent = ({ radiationTherapy }: { radiationTherapy: RadiationTherapy }) => {
  const radiationTherapyItems: ConditionalDescriptionItem[] = [
    {
      key: 'modality',
      label: 'medical_actions.modality',
      children: <OntologyTermComponent term={radiationTherapy.modality} />,
      isVisible: radiationTherapy.modality,
    },
    {
      key: 'bodySite',
      label: 'medical_actions.body_site',
      children: <OntologyTermComponent term={radiationTherapy.body_site} />,
      isVisible: radiationTherapy.body_site,
    },
    {
      key: 'dosage',
      label: 'medical_actions.dosage',
      children: radiationTherapy.dosage,
    },
    {
      key: 'fractions',
      label: 'medical_actions.fractions',
      children: radiationTherapy.fractions,
    },
  ];
  return <TDescriptions bordered column={1} size="compact" items={radiationTherapyItems} />;
};

const TherapeuticRegimenIdentifier = ({ regimen }: { regimen: TherapeuticRegimen }) => {
  const t = useTranslationFn();
  return (
    <>
      {regimen.ontology_class ?? <OntologyTermComponent term={regimen.ontology_class} />}
      {regimen.external_reference && (
        <Flex vertical>
          <div>
            <strong>ID:</strong>
            {regimen?.external_reference?.id ?? EM_DASH}
          </div>
          <div>
            <strong>{t('medical_actions.reference')}:</strong>
            {t(regimen?.external_reference?.reference) ?? EM_DASH}
          </div>
          <div>
            <strong>{t('Description')}:</strong>
            {t(regimen?.external_reference?.description) ?? EM_DASH}
          </div>
        </Flex>
      )}
    </>
  );
};

const TherapeuticRegimenComponent = ({ regimen }: { regimen: TherapeuticRegimen }) => {
  const items: ConditionalDescriptionItem[] = [
    {
      key: 'identifier',
      label: 'medical_actions.identifier',
      children: <TherapeuticRegimenIdentifier regimen={regimen} />,
      isVisible: regimen.ontology_class || regimen.external_reference,
    },
    {
      key: 'start_time',
      label: 'medical_actions.start_time',
      children: <TimeElementDisplay element={regimen.start_time} />,
      isVisible: regimen.start_time,
    },
    {
      key: 'end_time',
      label: 'medical_actions.end_time',
      children: <TimeElementDisplay element={regimen.end_time} />,
      isVisible: regimen.end_time,
    },
    {
      key: 'status',
      label: 'medical_actions.status',
      children: regimen.status,
      isVisible: regimen.status,
    },
  ];
  return <TDescriptions bordered column={1} size="compact" items={items} />;
};

const MedicalActionDetails = ({ medicalAction }: { medicalAction: MedicalAction }) => {
  const medicalActionItems: ConditionalDescriptionItem[] = [
    {
      key: 'procedure',
      label: 'medical_actions.procedure',
      children: <ProcedureComponent procedure={medicalAction.procedure!} />,
      isVisible: medicalAction.procedure,
    },
    {
      key: 'treatment',
      label: 'medical_actions.treatment',
      children: <TreatmentComponent treatment={medicalAction.treatment!} />,
      isVisible: medicalAction.treatment,
    },
    {
      key: 'radiationTherapy',
      label: 'medical_actions.radiation_therapy',
      children: <RadiationTherapyComponent radiationTherapy={medicalAction.radiation_therapy!} />,
      isVisible: medicalAction.radiation_therapy,
    },
    {
      key: 'therapeuticRegimen',
      label: 'medical_actions.therapeutic_regimen',
      children: <TherapeuticRegimenComponent regimen={medicalAction.therapeutic_regimen!} />,
      isVisible: medicalAction.therapeutic_regimen,
    },
    {
      key: 'adverseEvents',
      label: 'medical_actions.adverse_events',
      children: <OntologyTermStack terms={medicalAction.adverse_events} />,
      isVisible: medicalAction.adverse_events?.length,
    },
  ];
  return <TDescriptions bordered column={1} size="compact" items={medicalActionItems} />;
};

// Cases:
//  - Procedure: we'll automatically show code in the actionType column.
//    This should only be expandable if we have other procedure data not shown in the main table (body_site/performed)
//  - Treatment: agent is required. If we have any more keys, the row should be expandable.
//  - Radiation therapy: all keys are required; if this is present at all, the row should be expandable.
//  - Therapeutic regimen: ID & status are required, but we only show ID in the table itself, so if present, expandable.
const isMedicalActionExpandable = (r: MedicalAction) =>
  !!(
    r.adverse_events?.length ||
    r.procedure?.body_site ||
    r.procedure?.performed ||
    Object.keys(r.treatment ?? {}).length > 1 ||
    r.radiation_therapy ||
    r.therapeutic_regimen
  );

const MedicalActionsView = ({ medicalActions }: { medicalActions: MedicalAction[] }) => {
  const t = useTranslationFn();
  const columns: CustomTableColumns<MedicalAction> = [
    {
      title: 'medical_actions.action_type',
      key: 'actionType',
      render: (_: undefined, action: MedicalAction) => {
        // Each of the medical action types has at least one additional required property (often in effect the "ID" of
        // the medical action) we can show beyond just the type name.
        // Procedure: procedure code
        // Treatment: agent
        // Radiation therapy: modality, body site, dosage, fractions - for now we show the first two in the table
        // Therapeutic regimen: identifier
        if (action.procedure) {
          return (
            <>
              {t('medical_actions.procedure')} ({t('clinphen_generic.code')}:{' '}
              <OntologyTermComponent term={action.procedure.code} />)
            </>
          );
        } else if (action.treatment) {
          return (
            <>
              {t('medical_actions.treatment')} ({t('medical_actions.agent')}:{' '}
              <OntologyTermComponent term={action.treatment.agent} />)
            </>
          );
        } else if (action.radiation_therapy) {
          return (
            <>
              {t('medical_actions.radiation_therapy')} ({t('medical_actions.modality')}:{' '}
              <OntologyTermComponent term={action.radiation_therapy.modality} />, {t('medical_actions.body_site')}:{' '}
              <OntologyTermComponent term={action.radiation_therapy.body_site} />)
            </>
          );
        } else if (action.therapeutic_regimen) {
          return (
            <>
              {t('medical_actions.therapeutic_regimen')} ({t('medical_actions.identifier')}:{' '}
              <TherapeuticRegimenIdentifier regimen={action.therapeutic_regimen} />)
            </>
          );
        } else {
          return (
            <Text type="secondary" italic>
              {t('medical_actions.unknown')}
            </Text>
          );
        }
      },
      alwaysShow: true,
    },
    {
      title: 'medical_actions.treatment_target',
      dataIndex: 'treatment_target',
      render: (target: OntologyTerm) => <OntologyTermComponent term={target} />,
    },
    {
      title: 'medical_actions.treatment_intent',
      dataIndex: 'treatment_intent',
      render: (intent: OntologyTerm) => <OntologyTermComponent term={intent} />,
    },
    {
      title: 'medical_actions.response_to_treatment',
      dataIndex: 'response_to_treatment',
      render: (response: OntologyTerm) => <OntologyTermComponent term={response} />,
    },
    {
      title: 'medical_actions.adverse_events',
      dataIndex: 'adverse_events',
      render: (events: OntologyTerm[]) => events?.length ?? 0,
      isEmpty: (events: OntologyTerm[]) => !events?.length,
    },
    {
      title: 'medical_actions.treatment_termination_reason',
      dataIndex: 'treatment_termination_reason',
      render: (reason: OntologyTerm) => <OntologyTermComponent term={reason} />,
    },
  ];

  return (
    <CustomTable<MedicalAction>
      dataSource={medicalActions}
      columns={columns}
      expandedRowRender={(record) => <MedicalActionDetails medicalAction={record} />}
      queryKey="medical_action"
      rowKey={(record) =>
        record.procedure?.code?.id ??
        record.treatment?.agent?.id ??
        record.radiation_therapy?.modality?.id ??
        record.therapeutic_regimen?.ontology_class?.id ??
        record.therapeutic_regimen?.external_reference?.id ??
        'unknown'
      }
      isRowExpandable={isMedicalActionExpandable}
    />
  );
};

export default MedicalActionsView;
