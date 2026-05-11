import type { PayloadAction } from '@reduxjs/toolkit';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import type { PaginatedResponse, Project } from '@/types/metadata';
import type { Dataset } from '@/types/dataset';
import { RequestStatus } from '@/types/requests';
import type { RootState } from '@/store';
import { printAPIError } from '@/utils/error.util';
import { authorizedRequestConfig } from '@/utils/requests';
import { validProjectDataset } from '@/utils/router';
import { scopeSelectionEqual } from './utils';
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
  projectsByID: Record<string, Project>;
  datasetsByID: Record<string, Dataset>;
  datasetToProjectMap: Record<string, string>;
  projectsStatus: RequestStatus;
  projectsError: string;
  selectedScope: DiscoveryScopeSelection;
}

const initialState: MetadataState = {
  projects: [],
  projectsByID: {},
  datasetsByID: {},
  datasetToProjectMap: {},
  projectsStatus: RequestStatus.Idle,
  projectsError: '',
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
  string,
  { state: RootState; rejectValue: string }
>(
  'metadata/getProjects',
  (language, { rejectWithValue, getState }) => {
    const config = authorizedRequestConfig(getState());
    config.headers = { ...config.headers, 'Accept-Language': language };
    return axios
      .get(projectsUrl, config)
      .then((res) => res.data)
      .catch(printAPIError(rejectWithValue));
  },
  {
    condition(_, { getState }) {
      const { projectsStatus } = getState().metadata;
      const cond = projectsStatus === RequestStatus.Idle;
      if (!cond) {
        console.debug(`getProjects() was attempted, but a prior attempt gave status: ${RequestStatus[projectsStatus]}`);
      }
      return cond;
    },
  }
);

const metadata = createSlice({
  name: 'metadata',
  initialState,
  reducers: {
    resetProjects: (state) => {
      state.projectsStatus = RequestStatus.Idle;
    },
    selectScope: (state, { payload }: PayloadAction<DiscoveryScope>) => {
      // Defaults to the narrowest possible scope if there is only 1 project and only 1 dataset.
      // This forces Katsu to resolve the Discovery config with fallbacks from the bottom-up:
      // dataset -> project -> whole node
      const newScope = validProjectDataset(state.projectsByID, payload);
      if (!scopeSelectionEqual(state.selectedScope, newScope)) {
        console.debug('Selecting scope', newScope);
        state.selectedScope = newScope;
      }
    },
    markScopeSet: (state) => {
      state.selectedScope.scopeSet = true;
    },
  },
  extraReducers(builder) {
    builder.addCase(getProjects.pending, (state) => {
      state.projectsStatus = RequestStatus.Pending;
    });
    builder.addCase(getProjects.fulfilled, (state, { payload }) => {
      const projects = payload?.results ?? [];
      state.projects = projects;
      state.projectsByID = Object.fromEntries(projects.map((p) => [p.identifier, p]));
      state.datasetsByID = Object.fromEntries(projects.flatMap((p) => p.datasets_v2.map((d) => [d.identifier, d])));
      state.datasetToProjectMap = Object.fromEntries(
        projects.flatMap((p) => p.datasets_v2.map((d) => [d.identifier, p.identifier]))
      );
      state.projectsStatus = RequestStatus.Fulfilled;
      state.projectsError = '';
    });
    builder.addCase(getProjects.rejected, (state, { payload }) => {
      state.projectsStatus = RequestStatus.Rejected;
      if (typeof payload === 'string') {
        state.projectsError = payload;
      }
    });
  },
});

export const { resetProjects, selectScope, markScopeSet } = metadata.actions;
export default metadata.reducer;
