import { Space } from 'antd';
import OntologyTerm from '@Util/ClinPhen/OntologyTerm';
import JsonView from '@Util/JsonView';
import StringList from '@Util/StringList';
import TimeElementDisplay from '@Util/ClinPhen/TimeElementDisplay';
import TDescriptions from '@Util/TDescriptions';

import type { Individual } from '@/types/clinPhen/individual';
import type { ConditionalDescriptionItem } from '@/types/descriptions';

import { EM_DASH } from '@/constants/common';

const SubjectView = ({ subject }: { subject: Individual }) => {
  const vs = subject?.vital_status;
  const vitalStatusItems: ConditionalDescriptionItem[] = [
    {
      key: 'status',
      label: 'subject.status',
      children: vs?.status,
    },
    {
      key: 'time_of_death',
      label: 'subject.time_of_death',
      children: <TimeElementDisplay element={vs?.time_of_death} />,
      isVisible: vs?.time_of_death,
    },
    {
      key: 'cause_of_death',
      label: 'subject.cause_of_death',
      children: <OntologyTerm term={vs?.cause_of_death} />,
      isVisible: vs?.cause_of_death,
    },
    {
      key: 'survival_time_in_days',
      label: 'subject.survival_time_in_days',
      children: vs?.survival_time_in_days,
      isVisible: typeof vs?.survival_time_in_days === 'number',
    },
  ];

  const items: ConditionalDescriptionItem[] = [
    {
      key: 'id',
      label: 'subject.id',
      children: subject.id,
    },
    {
      key: 'Age',
      label: 'subject.age',
      children: `${subject?.age_numeric} ${subject?.age_unit}`,
    },
    {
      key: 'alternate_ids',
      label: 'subject.alternate_ids',
      children: <StringList list={subject.alternate_ids} />,
      isVisible: subject.alternate_ids?.length,
    },
    {
      key: 'time_at_last_encounter',
      label: 'subject.time_at_last_encounter',
      children: <TimeElementDisplay element={subject?.time_at_last_encounter} />,
      isVisible: subject?.time_at_last_encounter,
    },
    {
      key: 'vital_status',
      label: 'subject.vital_status',
      children: <TDescriptions items={vitalStatusItems} />,
      isVisible: subject?.vital_status,
    },
    {
      key: 'sex',
      label: 'subject.sex',
      children: subject?.sex,
    },
    {
      key: 'karyotypic_sex',
      label: 'subject.karyotypic_sex',
      children: subject?.karyotypic_sex,
    },
    {
      key: 'taxonomy',
      label: 'subject.taxonomy',
      children: (
        <em>
          <OntologyTerm term={subject?.taxonomy} />
        </em>
      ),
      isVisible: subject?.taxonomy,
    },
  ];

  const extraProperties = Object.entries(subject?.extra_properties ?? {}).map(([key, value]) => ({
    key,
    label: key,
    children: (typeof value === 'string' || typeof value === 'number' ? value : <JsonView src={value} />) ?? EM_DASH,
  }));

  return (
    <Space id="subject-view" direction="vertical" className="w-full" size="large">
      <TDescriptions items={items} column={1} bordered />
      {!!extraProperties.length && <TDescriptions items={extraProperties} column={1} bordered />}
    </Space>
  );
};

export default SubjectView;
