import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/hooks';
import { fetchDiscoveryMatchExportFields } from '@/features/search/fetchDiscoveryMatchExportFields.thunk';
import { RequestStatus } from '@/types/requests';
import type { ResultsDataEntity } from '@/types/entities';

export const useDiscoveryMatchExportFields = (entity: ResultsDataEntity, enabled: boolean) => {
  const dispatch = useAppDispatch();
  const { status, fields } = useAppSelector((state) => state.query.exportFields[entity]);

  useEffect(() => {
    if (enabled) dispatch(fetchDiscoveryMatchExportFields(entity));
  }, [dispatch, entity, enabled]);

  return { fields: fields ?? null, fetching: status === RequestStatus.Pending };
};
