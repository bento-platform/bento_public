import { useMemo } from 'react';
import { useTranslationFn } from '@/hooks';

import { Space, type SpaceProps } from 'antd';
import OntologyTerm from '@Util/ClinPhen/OntologyTerm';
import StringList from '@Util/StringList';
import TimeElementDisplay from '@Util/ClinPhen/TimeElementDisplay';
import TDescriptions from '@Util/TDescriptions';
import ExtraPropertiesDisplay from '@Util/ClinPhen/ExtraPropertiesDisplay';

import type { Individual, VitalStatus } from '@/types/clinPhen/individual';
import type { ConditionalDescriptionItem } from '@/types/descriptions';
import { EM_DASH } from '@/constants/common';

const VitalStatusDisplay = ({ vitalStatus: vs }: { vitalStatus?: VitalStatus }) => {
  const t = useTranslationFn();
  const vitalStatusItems: ConditionalDescriptionItem[] = useMemo(() => {
    const days = vs?.survival_time_in_days;
    return [
      {
        key: 'status',
        label: 'subject.status',
        children: vs?.status ? `subject.${vs.status}` : undefined,
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
        label: 'subject.survival_time',
        children: days === undefined ? EM_DASH : `${days} ${t('time.day', { count: days }).toLocaleLowerCase()}`,
        isVisible: typeof vs?.survival_time_in_days === 'number',
      },
    ];
  }, [t, vs]);

  return Object.keys(vs ?? {}).length === 1 ? (
    // If we have a vital status without any other properties (just status), simply render it as a plain string
    t(`subject.${vs?.status}`)
  ) : (
    <TDescriptions items={vitalStatusItems} className="fixed-item-label-width-narrow" column={1} size="compact" />
  );
};

const SubjectView = ({ subject, spaceSize }: { subject: Individual; spaceSize?: SpaceProps['size'] }) => {
  const items: ConditionalDescriptionItem[] = useMemo(
    () => [
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
        children: <VitalStatusDisplay vitalStatus={subject.vital_status} />,
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
        children: <OntologyTerm term={subject.taxonomy} italic />,
        isVisible: subject.taxonomy,
      },
    ],
    [subject]
  );

  return (
    <Space className="w-full" direction="vertical" size={spaceSize ?? 'middle'}>
      <TDescriptions className="fixed-item-label-width" items={items} column={1} bordered size="compact" />
      <ExtraPropertiesDisplay extraProperties={subject.extra_properties} />
    </Space>
  );
};

export default SubjectView;
