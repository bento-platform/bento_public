import type { PayloadAction } from '@reduxjs/toolkit';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import type { PaginatedResponse, Project, Dataset } from '@/types/metadata';
import { RequestStatus } from '@/types/requests';
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
  projectsByID: Record<string, Project>;
  datasetsByID: Record<string, Dataset>;
  projectsStatus: RequestStatus;
  selectedScope: DiscoveryScopeSelection;
}

const initialState: MetadataState = {
  projects: [],
  projectsByID: {},
  datasetsByID: {},
  projectsStatus: RequestStatus.Idle,
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
      // Only need to fetch projects once - if the projects are being/have already been fetched, don't re-execute.
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
    selectScope: (state, { payload }: PayloadAction<DiscoveryScope>) => {
      // Defaults to the narrowest possible scope if there is only 1 project and only 1 dataset.
      // This forces Katsu to resolve the Discovery config with fallbacks from the bottom-up:
      // dataset -> project -> whole node
      const newScope = validProjectDataset(state.projectsByID, payload);
      console.debug('Selecting scope', newScope);
      state.selectedScope = newScope;
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
      state.datasetsByID = Object.fromEntries(projects.flatMap((p) => p.datasets.map((d) => [d.identifier, d])));
      state.projectsStatus = RequestStatus.Fulfilled;
    });
    builder.addCase(getProjects.rejected, (state) => {
      state.projectsStatus = RequestStatus.Rejected;
    });
  },
});

export const { selectScope, markScopeSet } = metadata.actions;
export default metadata.reducer;
