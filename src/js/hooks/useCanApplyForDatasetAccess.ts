import { APPLY_FOR_ACCESS_URL } from '@/config';
import { useScopeDownloadData, useScopeQueryData } from '@/hooks/censorship';
import { downloadData, queryData } from 'bento-auth-js';

export const useCanApplyForDatasetAccess = (config: { permissionsList?: string[] } | { useScope: true }) => {
  const { hasPermission: queryDataPerm, fetchingPermission: fetchingQueryDataPerm } = useScopeQueryData();
  const { hasPermission: downloadDataPerm, fetchingPermission: fetchingDownloadDataPerm } = useScopeDownloadData();

  if ('useScope' in config) {
    return (
      !!APPLY_FOR_ACCESS_URL &&
      !fetchingQueryDataPerm &&
      !fetchingDownloadDataPerm &&
      !queryDataPerm &&
      !downloadDataPerm
    );
  }

  return (
    !!APPLY_FOR_ACCESS_URL &&
    !config.permissionsList?.includes(queryData) &&
    !config.permissionsList?.includes(downloadData)
  );
};
