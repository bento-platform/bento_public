import { Descriptions, DescriptionsProps } from 'antd';

import { Individual } from '@/types/clinPhen/individual';
import StringList from '../Util/StringList';
import TimeElementDisplay from './TimeElementDisplay';
import { EM_DASH } from '@/constants/common';
import OntologyTerm from './OntologyTerm';

const SubjectView = ({ subject }: { subject: Individual }) => {
  const vs = subject?.vital_status;
  const vitalStatusItems: DescriptionsProps['items'] = [
    {
      key: 'status',
      label: 'Status',
      children: vs?.status,
    },
    {
      key: 'time_of_death',
      label: 'Time of Death',
      children: <TimeElementDisplay element={vs?.time_of_death} />,
    },
    {
      key: 'cause_of_death',
      label: 'Cause of Death',
      children: <OntologyTerm term={vs?.cause_of_death} />,
    },
    {
      key: 'survival_time_in_days',
      label: 'Survival Time in Days',
      children: vs?.survival_time_in_days,
    },
  ];

  const items: DescriptionsProps['items'] = [
    {
      key: 'id',
      label: 'ID',
      children: subject.id,
    },
    {
      key: 'alternate_ids',
      label: 'Alternate IDs',
      children: <StringList list={subject.alternate_ids} />,
    },
    {
      key: 'age',
      label: 'Age',
      children: `${subject?.age_numeric} ${subject?.age_unit}`,
    },
    {
      key: 'date_of_birth',
      label: 'Date of Birth',
      children: subject?.date_of_birth,
    },
    {
      key: 'time_at_last_encounter',
      label: 'Time at Last Encounter',
      children: <TimeElementDisplay element={subject?.time_at_last_encounter} />,
    },
    {
      key: 'vital_status',
      label: 'Vital Status',
      children: subject?.vital_status ? <Descriptions items={vitalStatusItems} /> : EM_DASH, //todo: complete
    },
    {
      key: 'sex',
      label: 'Sex',
      children: subject?.sex,
    },
    {
      key: 'karyotypic_sex',
      label: 'Karyotypic_sex',
      children: subject?.karyotypic_sex,
    },
    {
      key: 'taxonomy',
      label: 'Taxonomy',
      children: <OntologyTerm term={subject?.taxonomy} />,
    },
    {
      key: 'gender',
      label: 'gender',
      children: <OntologyTerm term={subject?.gender} />,
    },
  ];
  return <Descriptions items={items} column={1} bordered />;
};

export default SubjectView;
