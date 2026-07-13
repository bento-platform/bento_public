import { useCallback, useState } from 'react';
import axios from 'axios';
import { useAppSelector } from '@/hooks';
import { useSelectedScope } from '@/features/metadata/hooks';
import { scopedAuthorizedRequestConfigFromParts } from '@/utils/requests';
import { katsuDiscoveryMatchesExportFieldsUrl } from '@/constants/configConstants';
import type { ResultsDataEntity, ExportField } from '@/types/entities';

// Fields available per entity rarely change within a session, so cache per-entity once fetched.
const fieldsCache = new Map<ResultsDataEntity, ExportField[]>();

export const useDiscoveryMatchExportFields = () => {
  const auth = useAppSelector((state) => state.auth);
  const selectedScope = useSelectedScope();

  const [fields, setFields] = useState<ExportField[] | null>(null);
  const [fetching, setFetching] = useState<boolean>(false);

  const fetchFields = useCallback(
    async (entity: ResultsDataEntity) => {
      const cached = fieldsCache.get(entity);
      if (cached) {
        setFields(cached);
        return;
      }

      setFetching(true);
      setFields(null);
      try {
        const config = scopedAuthorizedRequestConfigFromParts(auth, selectedScope, [['_entity', entity]]);
        const res = await axios.get<ExportField[]>(katsuDiscoveryMatchesExportFieldsUrl, config);
        fieldsCache.set(entity, res.data);
        setFields(res.data);
      } finally {
        setFetching(false);
      }
    },
    [auth, selectedScope]
  );

  return { fields, fetching, fetchFields };
};
