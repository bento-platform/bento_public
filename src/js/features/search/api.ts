import axios from 'axios';

import type { RootState } from '@/store';
import type { QueryParamEntries } from '@/utils/queryParams';
import { katsuDiscoveryUrl } from '@/constants/configConstants';
import { scopedAuthorizedRequestConfig } from '@/utils/requests';

export const getDiscovery = async (state: RootState, queryParams?: QueryParamEntries) =>
  await axios.get(katsuDiscoveryUrl, scopedAuthorizedRequestConfig(state, queryParams)).then((res) => res.data);
