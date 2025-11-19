import { Space, type SpaceProps } from 'antd';
import OntologyTerm from '@Util/ClinPhen/OntologyTerm';
import StringList from '@Util/StringList';
import TimeElementDisplay from '@Util/ClinPhen/TimeElementDisplay';
import TDescriptions from '@Util/TDescriptions';
import ExtraPropertiesDisplay from '@Util/ClinPhen/ExtraPropertiesDisplay';

import type { Individual } from '@/types/clinPhen/individual';
import type { ConditionalDescriptionItem } from '@/types/descriptions';

const SubjectView = ({ subject, spaceSize }: { subject: Individual; spaceSize?: SpaceProps['size'] }) => {
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
      key: 'alternate_ids',
      label: 'subject.alternate_ids',
      children: <StringList list={subject.alternate_ids} />,
      isVisible: subject.alternate_ids?.length,
    },
    {
      key: 'time_at_last_encounter',
      label: 'subject.time_at_last_encounter',
      children: <TimeElementDisplay element={subject.time_at_last_encounter} />,
      isVisible: subject.time_at_last_encounter,
    },
    {
      key: 'vital_status',
      label: 'subject.vital_status',
      children: <TDescriptions items={vitalStatusItems} size="compact" />,
      isVisible: subject.vital_status,
    },
    {
      key: 'sex',
      label: 'subject.sex',
      children: subject.sex,
    },
    {
      key: 'karyotypic_sex',
      label: 'subject.karyotypic_sex',
      children: subject.karyotypic_sex,
    },
    {
      key: 'gender',
      label: 'subject.gender',
      children: subject.gender ? <OntologyTerm term={subject.gender} /> : null,
      isVisible: subject.gender,
    },
    {
      key: 'taxonomy',
      label: 'subject.taxonomy',
      children: (
        <em>
          <OntologyTerm term={subject.taxonomy} />
        </em>
      ),
      isVisible: subject.taxonomy,
    },
  ];

  return (
    <Space id="subject-view" direction="vertical" className="w-full" size={spaceSize ?? 'middle'}>
      <TDescriptions items={items} column={1} bordered size="compact" />
      <ExtraPropertiesDisplay extraProperties={subject.extra_properties} />
    </Space>
  );
};

export default SubjectView;
