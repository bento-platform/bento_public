import { useEffect, useState } from 'react';
import { useAuthorizationHeader } from 'bento-auth-js';
import { referenceGenomesUrl } from '@/constants/configConstants';
import { useAppSelector } from '@/hooks';
import { RequestStatus } from '@/types/requests';
import type { GenomeFeature } from './types';

export const useReference = () => {
  return useAppSelector((state) => state.reference);
};

export const useGeneNameSearch = (referenceGenomeID: string | undefined, nameQuery: string | null | undefined) => {
  const authHeader = useAuthorizationHeader();

  const [status, setStatus] = useState<RequestStatus>(RequestStatus.Idle);
  const [data, setData] = useState<GenomeFeature[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!referenceGenomeID || !nameQuery) return;

    const params = new URLSearchParams({ name: nameQuery, name_fzy: 'true', limit: '10' });
    const searchUrl = `${referenceGenomesUrl}/${referenceGenomeID}/features?${params.toString()}`;

    setError(null);

    (async () => {
      setStatus(RequestStatus.Pending);

      try {
        const res = await fetch(searchUrl, { headers: { Accept: 'application/json', ...authHeader } });
        const resData = await res.json();
        if (res.ok) {
          console.debug('Genome feature search - got results:', resData.results);
          setData(resData.results);
          setStatus(RequestStatus.Fulfilled);
        } else {
          setError(`Genome feature search failed with message: ${resData.message}`);
          setStatus(RequestStatus.Rejected);
        }
      } catch (e) {
        console.error(e);
        setError(`Genome feature search failed: ${(e as Error).toString()}`);
        setStatus(RequestStatus.Rejected);
      }
    })();
  }, [referenceGenomeID, nameQuery, authHeader]);

  return { status, data, error };
};
