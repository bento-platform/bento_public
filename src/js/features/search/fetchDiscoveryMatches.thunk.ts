import { createAsyncThunk } from '@reduxjs/toolkit';
import type { RootState } from '@/store';
import axios from 'axios';
import { katsuDiscoveryMatchesUrl } from '@/constants/configConstants';
import type { DiscoveryMatchPhenopacket } from '@/features/search/types';
import { bentoKatsuEntityToResultsDataEntity } from '@/features/search/utils';
import type { BentoKatsuEntity } from '@/types/entities';
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
  BentoKatsuEntity,
  {
    rejectValue: string;
    state: RootState;
  }
>(
  'query/fetchDiscoveryMatches',
  (entity, { rejectWithValue, getState }) => {
    const state = getState();
    const queryEntity = bentoKatsuEntityToResultsDataEntity(entity);
    return axios
      .get(
        katsuDiscoveryMatchesUrl,
        scopedAuthorizedRequestConfig(state, {
          ...state.query.filterQueryParams,
          _fts: state.query.textQuery || undefined,
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
      const rdEntity = bentoKatsuEntityToResultsDataEntity(entity);
      const entityStatus = getState().query.matchData[rdEntity].status;
      const cond = entityStatus !== RequestStatus.Pending;
      if (!cond) {
        console.debug(
          'performKatsuDiscovery() was attempted, but will not dispatch: ' +
            `matchData[${rdEntity}].status=${RequestStatus[entityStatus]}`
        );
      }
      return cond;
    },
  }
);
