import { Phenopacket } from '@/types/clinPhen/phenopacket';
import { Row, Col, Divider } from 'antd';

// Import all related views
import SubjectView from './SubjectView';
import BiosampleView from './BiosampleView';
import DiseasesView from './DiseasesView';
import InterpretationsView from './InterpretationsView';
import MeasurementsView from './MeasurementsView';
import MedicalActionsView from './MedicalActionsView';
import PhenotypicFeaturesView from './PhenotypicFeaturesView';

interface CompactViewProps {
  phenopacket: Phenopacket;
}

const dividerStyle: React.CSSProperties = {
  fontSize: '12px',
  fontWeight: 600,
  margin: '8px 0',
  color: 'blue',
};

const CompactView = ({ phenopacket }: CompactViewProps) => {
  const { id, time_at_last_encounter, karyotypic_sex, extra_properties } = phenopacket.subject!;
  const subjectSubset = { id, time_at_last_encounter, karyotypic_sex, extra_properties };

  return (
    <Row gutter={28} style={{ fontSize: '12px !important' }}>
      <Col>
        <Divider orientation="left" style={dividerStyle}>
          Subject
        </Divider>
        <SubjectView subject={subjectSubset} tiny />

        <Divider orientation="left" style={dividerStyle}>
          Biosamples
        </Divider>
        <BiosampleView biosamples={phenopacket.biosamples!} />

        <Divider orientation="left" style={dividerStyle}>
          Diseases
        </Divider>
        <DiseasesView diseases={phenopacket.diseases!} />
      </Col>

      <Col>
        <Divider orientation="left" style={dividerStyle}>
          Interpretations
        </Divider>
        <InterpretationsView interpretations={phenopacket.interpretations!} />

        <Divider orientation="left" style={dividerStyle}>
          Measurements
        </Divider>
        <MeasurementsView measurements={phenopacket.measurements!} />

        <Divider orientation="left" style={dividerStyle}>
          Medical Actions
        </Divider>
        <MedicalActionsView medicalActions={phenopacket.medical_actions!} />

        <Divider orientation="left" style={dividerStyle}>
          Phenotypic Features
        </Divider>
        <PhenotypicFeaturesView features={phenopacket.phenotypic_features!} />
      </Col>
    </Row>
  );
};

export default CompactView;
