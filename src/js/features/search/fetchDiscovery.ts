import axios from 'axios';

import type { RootState } from '@/store';
import type { QueryParamEntries } from '@/utils/queryParams';
import { katsuDiscoveryUrl } from '@/constants/configConstants';
import { scopedRequestConfig } from '@/utils/requests';

export const fetchDiscovery = async (state: RootState, queryParams?: QueryParamEntries) =>
  await axios.get(katsuDiscoveryUrl, scopedRequestConfig(state, queryParams)).then((res) => res.data);
