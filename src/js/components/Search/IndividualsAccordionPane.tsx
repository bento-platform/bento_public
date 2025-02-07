import { useEffect } from 'react';
import { useAppDispatch, useAppSelector, useTranslationFn } from '@/hooks';
import type { DescriptionsProps } from 'antd';
import { Descriptions, Skeleton } from 'antd';

import { makeGetIndividualData } from '@/features/search/makeGetIndividualData.thunk';
import { EM_DASH } from '@/constants/contentConstants';

const IndividualsAccordionPane = ({ id }: { id: string }) => {
  const dispatch = useAppDispatch();
  const t = useTranslationFn();

  useEffect(() => {
    dispatch(makeGetIndividualData(id));
  }, [dispatch, id]);

  const individualData = useAppSelector((state) => state.query.individualDataCache[id]);
  const isFetchingIndividualData = useAppSelector((state) => state.query.isFetchingIndividualData[id]);

  const items: DescriptionsProps['items'] = [
    {
      label: t('individual.date_of_birth'),
      children: individualData?.date_of_birth || EM_DASH,
      span: 2,
    },
    {
      label: t('individual.sex'),
      children: individualData?.sex,
    },
    {
      label: t('individual.time_at_last_encounter'),
      children: JSON.stringify(individualData?.time_at_last_encounter), // TODO: handle other time elements if there are any
    },
    {
      label: t('individual.karyotypic_sex'),
      children: individualData?.karyotypic_sex || t('individual.unknown_karyotypic_sex'),
    },
    {
      label: t('individual.taxonomy'),
      children: individualData?.taxonomy?.label || EM_DASH,
    },
    {
      span: 3,
      label: t('individual.extra_properties'),
      children: JSON.stringify(individualData?.extra_properties, null, 2),
    },
  ];

  return isFetchingIndividualData ? <Skeleton active /> : <Descriptions items={items} />;
};

export default IndividualsAccordionPane;
