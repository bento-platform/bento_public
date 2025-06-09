import { createAsyncThunk } from '@reduxjs/toolkit';
import type { RootState } from '@/store';
import axios from 'axios';
import { katsuDiscoveryMatchesUrl } from '@/constants/configConstants';
import type { DiscoveryMatchPhenopacket } from '@/features/search/types';
import { RequestStatus } from '@/types/requests';
import { scopedAuthorizedRequestConfig } from '@/utils/requests';
import { printAPIError } from '@/utils/error.util';

export const fetchDiscoveryMatches = createAsyncThunk<
  {
    results: DiscoveryMatchPhenopacket[];
    pagination: {
      page: number;
      page_size: number;
      total: number;
    };
  },
  void,
  {
    rejectValue: string;
    state: RootState;
  }
>(
  'query/fetchDiscoveryMatches',
  async (_, { rejectWithValue, getState }) => {
    const state = getState();
    return axios
      .get(
        katsuDiscoveryMatchesUrl,
        scopedAuthorizedRequestConfig(state, {
          ...state.query.filterQueryParams,
          _page: state.query.page.toString(),
          _page_size: state.query.pageSize.toString(),
        })
      )
      .then((res) => res.data)
      .catch(printAPIError(rejectWithValue));
  },
  {
    condition(_, { getState }) {
      return getState().query.matchesStatus !== RequestStatus.Pending;
    },
  }
);
