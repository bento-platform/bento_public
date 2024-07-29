import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { projectsUrl } from '@/constants/configConstants';
import { PaginatedResponse, Project } from '@/types/metadata';
import { RootState } from '@/store';
import axios from 'axios';
import { printAPIError } from '@/utils/error.util';
import { validProjectDataset } from '@/utils/router';

export interface MetadataState {
  projects: Project[];
  isFetching: boolean;
  selectedScope: {
    project: string | undefined;
    dataset: string | undefined;
  };
}

const initialState: MetadataState = {
  projects: [],
  isFetching: true,
  selectedScope: {
    project: undefined,
    dataset: undefined,
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
