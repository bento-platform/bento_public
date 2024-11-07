import { useEffect } from 'react';

import { useAppDispatch, useAppSelector } from '@/hooks';
import { makeGetAboutRequest } from './content.store';

export const useContent = () => {
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(makeGetAboutRequest());
  }, [dispatch]);
  return useAppSelector((state) => state.content);
};
