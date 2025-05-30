import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

import { individualUrl } from '@/constants/configConstants';
import type { RootState } from '@/store';
import type { OntologyTerm } from '@/types/ontology';
import { RequestStatus } from '@/types/requests';
import { scopedAuthorizedRequestConfig } from '@/utils/requests';
import { printAPIError } from '@/utils/error.util';

export type BentoOldSearchResponseFormat = {
  results: {
    // --- begin new fields for UI hacking together
    project_id: string;
    dataset_id: string;
    phenopacket_id: string;
    // --- end new fields for UI hacking together
    subject_id: string;
    alternate_ids: string[];
    num_experiments: 1;
    biosamples: string[];
    experiments_with_biosamples: {
      biosample_id: string;
      sampled_tissue: OntologyTerm;
      experiment: {
        experiment_id: string;
        experiment_type: string;
        study_type: string;
      };
    }[];
  }[];
  time: number;
};

export const performFreeTextSearch = createAsyncThunk<
  BentoOldSearchResponseFormat,
  void,
  {
    rejectValue: string;
    state: RootState;
  }
>(
  'query/performFreeTextSearch',
  async (_, { rejectWithValue, getState }) => {
    const state = getState();
    // TODO: this is not a good endpoint. need a better free-text search endpoint. ported from Bento Web for now.
    return axios
      .get(
        individualUrl,
        scopedAuthorizedRequestConfig(state, {
          search: state.query.textQuery,
          page_size: '10000',
          format: 'bento_search_result',
        })
      )
      .then((res) => res.data)
      .catch(printAPIError(rejectWithValue));
  },
  {
    condition(_, { getState }) {
      const { filterQueryStatus, textQueryStatus } = getState().query;
      return filterQueryStatus !== RequestStatus.Pending && textQueryStatus !== RequestStatus.Pending;
    },
  }
);
