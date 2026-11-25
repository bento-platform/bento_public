import { createAsyncThunk } from '@reduxjs/toolkit';
import type { RootState } from '@/store';
import axios from 'axios';
import { katsuDiscoveryMatchesUrl } from '@/constants/configConstants';
import type { DiscoveryMatchIndividual } from '@/features/search/types';
import { searchQueryParamsFromState } from '@/features/search/utils';
import type { ResultsDataEntity } from '@/types/entities';
import { RequestStatus } from '@/types/requests';
import { scopedRequestConfig } from '@/utils/requests';
import { printAPIError } from '@/utils/error.util';

type DiscoveryMatchPagination = {
  page: number;
  page_size: number;
  total: number;
};

type DiscoveryMatchResponse = {
  results: DiscoveryMatchIndividual[];
  pagination: DiscoveryMatchPagination;
};

export const fetchDiscoveryMatches = createAsyncThunk<
  DiscoveryMatchResponse,
  ResultsDataEntity,
  {
    rejectValue: string;
    state: RootState;
  }
>(
  'query/fetchDiscoveryMatches',
  (entity, { rejectWithValue, getState }) => {
    const state = getState();
    console.debug('fetching discovery match page for entity:', entity);
    return axios
      .get(
        katsuDiscoveryMatchesUrl,
        scopedRequestConfig(state, [
          ...searchQueryParamsFromState(state.query),
          ['_entity', entity],
          ['_page', state.query.matchData[entity].page.toString()],
          ['_page_size', state.query.pageSize.toString()],
        ])
      )
      .then((res) => res.data)
      .catch(printAPIError(rejectWithValue));
  },
  {
    condition(entity, { getState }) {
      const { invalid, status: entityStatus } = getState().query.matchData[entity];
      return entityStatus === RequestStatus.Idle || (entityStatus !== RequestStatus.Pending && invalid);
    },
  }
);
