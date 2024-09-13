import type { PayloadAction } from '@reduxjs/toolkit';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import type { PaginatedResponse, Project } from '@/types/metadata';
import type { RootState } from '@/store';
import { printAPIError } from '@/utils/error.util';
import { validProjectDataset } from '@/utils/router';
import { projectsUrl } from '@/constants/configConstants';

export interface MetadataState {
  projects: Project[];
  isFetching: boolean;
  selectedScope: {
    project: string | undefined;
    dataset: string | undefined;
    fixedProject: boolean;
    fixedDataset: boolean;
  };
}

const initialState: MetadataState = {
  projects: [],
  isFetching: true,
  selectedScope: {
    project: undefined,
    dataset: undefined,
    fixedProject: false,
    fixedDataset: false,
  },
};

export const getProjects = createAsyncThunk<
  PaginatedResponse<Project>,
  void,
  { state: RootState; rejectValue: string }
>('metadata/getProjects', (_, { rejectWithValue }) => {
  return axios
    .get(projectsUrl)
    .then((res) => res.data)
    .catch(printAPIError(rejectWithValue));
});

const metadata = createSlice({
  name: 'metadata',
  initialState,
  reducers: {
    selectScope: (state, { payload }: PayloadAction<{ project?: string; dataset?: string }>) => {
      // Defaults to the narrowest possible scope if there is only 1 project and only 1 dataset.
      // This forces Katsu to resolve the Discovery config with fallbacks from the bottom-up:
      // dataset -> project -> whole node
      state.selectedScope = validProjectDataset(state.projects, payload.project, payload.dataset);
    },
  },
  extraReducers(builder) {
    builder.addCase(getProjects.pending, (state) => {
      state.isFetching = true;
    });
    builder.addCase(getProjects.fulfilled, (state, { payload }) => {
      state.projects = payload?.results ?? [];
      state.isFetching = false;
    });
    builder.addCase(getProjects.rejected, (state) => {
      state.isFetching = false;
    });
  },
});

export const { selectScope } = metadata.actions;
export default metadata.reducer;
