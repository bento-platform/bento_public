import { useTranslationFn } from '@/hooks';
import type { DescriptionsProps } from 'antd';
import { Descriptions, Skeleton } from 'antd';

import TimeElementDisplay from '@/components/ClinPhen/TimeElementDisplay';
import JsonView from '@/components/Util/JsonView';

import { EM_DASH } from '@/constants/contentConstants';
import { useIndividualData } from '@/features/search/hooks';
import { RequestStatus } from '@/types/requests';

const IndividualsAccordionPane = ({ id }: { id: string }) => {
  const t = useTranslationFn();

  const { data: individualData, status: individualDataStatus } = useIndividualData(id);
  const isFetchingIndividualData = individualDataStatus === RequestStatus.Pending;

  const items: DescriptionsProps['items'] = [
    {
      label: t('individual.date_of_birth'),
      children: individualData?.date_of_birth || EM_DASH,
      span: 2,
    },
    {
      label: t('individual.sex'),
      children: t(individualData?.sex ?? 'UNKNOWN_SEX'),
    },
    {
      label: t('individual.time_at_last_encounter'),
      children: <TimeElementDisplay element={individualData?.time_at_last_encounter} />,
    },
    {
      label: t('individual.karyotypic_sex'),
      children: individualData?.karyotypic_sex || t('individual.unknown_karyotypic_sex'),
    },
    {
      label: t('individual.taxonomy'),
      children: <em>{individualData?.taxonomy?.label || EM_DASH}</em>,
    },
    // Only show extra properties field if we have any:
    ...(individualData?.extra_properties
      ? [
          {
            span: 3,
            label: t('individual.extra_properties'),
            children: <JsonView src={individualData?.extra_properties} />,
          },
        ]
      : []),
  ];

  return isFetchingIndividualData ? <Skeleton active /> : <Descriptions items={items} />;
};

export default IndividualsAccordionPane;
