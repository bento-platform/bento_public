import { useEffect } from 'react';
import { makeGetIndividualData } from '@/features/search/makeGetIndividualData.thunk';
import { useAppDispatch, useAppSelector } from '@/hooks';
import type { DescriptionsProps } from 'antd';
import { Descriptions } from 'antd';
import { EM_DASH } from '@/constants/contentConstants';

const IndividualsAccordianPane = ({ id }: { id: string }) => {
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(makeGetIndividualData(id));
  }, [dispatch, id]);

  const individualData = useAppSelector((state) => state.query.individualDataCache[id]);

  const items: DescriptionsProps['items'] = [
    {
      label: 'Date of Birth',
      children: individualData?.date_of_birth || EM_DASH,
      span: 2,
    },
    {
      label: 'Sex',
      children: individualData?.sex,
    },
    {
      label: 'Time at last encounter',
      children: individualData?.time_at_last_encounter?.age.iso8601duration, // TODO: handle other time elements if there are any
    },
    {
      label: 'Karyotypic Sex',
      children: individualData?.karyotypic_sex || 'UNKNOWN_KARYOTYPE',
    },
    {
      label: 'Taxonomy',
      children: individualData?.taxonomy?.label || 'UNKNOWN_TAXONOMY',
    },
    {
      span: 3,
      label: 'Extra Properties',
      children: JSON.stringify(individualData?.extra_properties, null, 2),
    },
  ];

  return <Descriptions items={items} />;
};

export default IndividualsAccordianPane;
