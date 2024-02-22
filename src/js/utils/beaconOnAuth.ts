import { useHasResourcePermission, Resource, RESOURCE_EVERYTHING } from 'bento-auth-js';
import { useAppDispatch, useAppSelector } from '@/hooks';
import { setMaxQueryParametersRequired } from '@/features/config/config.store';

export const useHasResourcePermissionWrapper = (resource: Resource, permission: string) => {
  const authzUrl = useAppSelector((state) => state.config.serviceInfo.auth);

  const { isFetching: fetchingPermission, hasPermission } = useHasResourcePermission(resource, authzUrl, permission);

  return {
    fetchingPermission,
    hasPermission,
  };
};

export const beaconOnAuth = () => {
  const dispatch = useAppDispatch();
  console.log('logged in');
  // if (useHasResourcePermissionWrapper(RESOURCE_EVERYTHING, 'query:data')) {
  //   dispatch(setMaxQueryParametersRequired(false));
  // }
};
