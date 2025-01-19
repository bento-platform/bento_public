import React, { useEffect } from 'react';
import { makeGetIndividualData } from '@/features/search/makeGetIndividualData.thunk';
import { useAppDispatch, useAppSelector } from '@/hooks';
import type { DescriptionsProps } from 'antd';
import { Descriptions } from 'antd';
import { EM_DASH } from '@/constants/contentConstants';

const IndividualsAccordianPane = ({ id }: { id: string }) => {
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(makeGetIndividualData(id));
  }, [id]);

  const individualData = useAppSelector((state) => state.query.individualDataCache[id]);

  const items: DescriptionsProps['items'] = [
    {
      key: 1,
      label: 'Date of Birth',
      children: individualData?.date_of_birth || EM_DASH,
      span: 2,
    },
    {
      key: 2,
      label: 'Sex',
      children: individualData?.sex,
    },
    {
      key: 3,
      label: 'time at last encounter',
      children: individualData?.time_at_last_encounter?.age.iso8601duration, // TODO: handle other time elements if there are any
    },
    {
      key: 4,
      label: 'Karyotypic Sex',
      children: individualData?.karyotypic_sex || 'UNKNOWN_KARYOTYPE',
    },
    {
      key: 5,
      label: 'Taxonomy',
      children: individualData?.taxonomy?.label || 'UNKNOWN_TAXONOMY',
    },
    {
      key: 6,
      span: 3,
      label: 'Extra Properties',
      children: JSON.stringify(individualData?.extra_properties, null, 2),
    },
  ];

  return <Descriptions items={items} />;
};

export default IndividualsAccordianPane;
