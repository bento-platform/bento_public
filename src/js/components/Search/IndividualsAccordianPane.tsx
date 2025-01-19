import React, { useEffect } from 'react';
import { makeGetIndividualData } from '@/features/search/makeGetIndividualData.thunk';
import { useAppDispatch, useAppSelector } from '@/hooks';
import IndividualOverivew from '@/components/Search/Individuals/IndividualOverview';

const IndividualsAccordianPane = ({ id }: { id: string }) => {
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(makeGetIndividualData(id));
  }, [id]);

  const individualData = useAppSelector((state) => state.query.individualDataCache[id]);

  return <IndividualOverivew individualData={individualData} />;
};

export default IndividualsAccordianPane;
