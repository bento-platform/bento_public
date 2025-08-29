import { createAsyncThunk } from '@reduxjs/toolkit';
import type { RootState } from '@/store';
import axios from 'axios';
import { katsuDiscoveryMatchesUrl } from '@/constants/configConstants';
import type { DiscoveryMatchPhenopacket } from '@/features/search/types';
import { bentoEntityToResultsDataEntity } from '@/features/search/query.store';
import type { BentoEntity } from '@/types/entities';
import { RequestStatus } from '@/types/requests';
import { scopedAuthorizedRequestConfig } from '@/utils/requests';
import { printAPIError } from '@/utils/error.util';

type DiscoveryMatchPagination = {
  page: number;
  page_size: number;
  total: number;
};

export const fetchDiscoveryMatches = createAsyncThunk<
  {
    results: DiscoveryMatchPhenopacket[];
    pagination: DiscoveryMatchPagination;
  },
  BentoEntity,
  {
    rejectValue: string;
    state: RootState;
  }
>(
  'query/fetchDiscoveryMatches',
  async (entity, { rejectWithValue, getState }) => {
    const state = getState();
    const queryEntity = bentoEntityToResultsDataEntity(entity);
    return axios
      .get(
        katsuDiscoveryMatchesUrl,
        scopedAuthorizedRequestConfig(state, {
          ...state.query.filterQueryParams,
          _entity: queryEntity,
          _page: state.query.matchData[queryEntity].page.toString(),
          _page_size: state.query.pageSize.toString(),
        })
      )
      .then((res) => res.data)
      .catch(printAPIError(rejectWithValue));
  },
  {
    condition(entity, { getState }) {
      return getState().query.matchData[bentoEntityToResultsDataEntity(entity)].status !== RequestStatus.Pending;
    },
  }
);
