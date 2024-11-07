import type { PayloadAction } from '@reduxjs/toolkit';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import type { PaginatedResponse, Project } from '@/types/metadata';
import type { RootState } from '@/store';
import { printAPIError } from '@/utils/error.util';
import { validProjectDataset } from '@/utils/router';
import { projectsUrl } from '@/constants/configConstants';

export type DiscoveryScope = { project?: string; dataset?: string };

export type DiscoveryScopeSelection = {
  scope: DiscoveryScope;
  scopeSet: boolean;
  fixedProject: boolean;
  fixedDataset: boolean;
};

export interface MetadataState {
  projects: Project[];
  isFetching: boolean;
  hasAttempted: boolean;
  selectedScope: DiscoveryScopeSelection;
}

const initialState: MetadataState = {
  projects: [],
  isFetching: false,
  hasAttempted: false,
  selectedScope: {
    scope: { project: undefined, dataset: undefined },
    // Whether scope has been set from URL/action yet. If it hasn't, we need to wait before fetching scoped data.
    scopeSet: false,
    fixedProject: false,
    fixedDataset: false,
  },
};

export const getProjects = createAsyncThunk<
  PaginatedResponse<Project>,
  void,
  { state: RootState; rejectValue: string }
>(
  'metadata/getProjects',
  (_, { rejectWithValue }) => {
    return axios
      .get(projectsUrl)
      .then((res) => res.data)
      .catch(printAPIError(rejectWithValue));
  },
  {
    condition(_, { getState }) {
      return !getState().metadata.isFetching && !getState().metadata.hasAttempted;
    },
  }
);

const metadata = createSlice({
  name: 'metadata',
  initialState,
  reducers: {
    selectScope: (state, { payload }: PayloadAction<DiscoveryScope>) => {
      // Defaults to the narrowest possible scope if there is only 1 project and only 1 dataset.
      // This forces Katsu to resolve the Discovery config with fallbacks from the bottom-up:
      // dataset -> project -> whole node
      state.selectedScope = validProjectDataset(state.projects, payload);
    },
    markScopeSet: (state) => {
      state.selectedScope.scopeSet = true;
    },
  },
  extraReducers(builder) {
    builder.addCase(getProjects.pending, (state) => {
      state.isFetching = true;
    });
    builder.addCase(getProjects.fulfilled, (state, { payload }) => {
      state.projects = payload?.results ?? [];
      state.isFetching = false;
      state.hasAttempted = true;
    });
    builder.addCase(getProjects.rejected, (state) => {
      state.isFetching = false;
      state.hasAttempted = true;
    });
  },
});

export const { selectScope, markScopeSet } = metadata.actions;
export default metadata.reducer;
