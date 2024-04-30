import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { projectsUrl } from '@/constants/configConstants';
// import {Project, Dataset} from '@/types/overviewResponse';
import { Project, Dataset, PaginatedResponse } from '@/types/metadata';
import { RootState } from '@/store';
import axios from 'axios';
import { printAPIError } from '@/utils/error.util';

interface MetadataState {
  projects: Project[];
  datasets: Dataset[];
  projectsById: Record<string, Project>;
  datasetsById: Record<string, Dataset>;
  isFetching: boolean;
  selectedProjectId: string;
  selectedDatasetId: string;
}

const initialState: MetadataState = {
  projects: [],
  datasets: [],
  datasetsById: {},
  projectsById: {},
  isFetching: true,
  selectedProjectId: '',
  selectedDatasetId: '',
};

// interface PaginatedResponse<T> {
//     count: number;
//     next: T;
//     previous: T;
//     results: T[]
// }

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
  reducers: {},
  extraReducers(builder) {
    // Projects
    builder.addCase(getProjects.pending, (state) => {
      state.isFetching = true;
    });
    builder.addCase(getProjects.fulfilled, (state, { payload }) => {
      const projects = payload?.results ?? [];
      const datasets = projects.flatMap((p) => p?.datasets ?? []);
      state.projects = projects;
      state.datasets = datasets;
      state.projectsById = Object.fromEntries(projects.map((p) => [p.identifier, p]));
      state.datasetsById = Object.fromEntries(datasets.map((d) => [d.identifier, d]));
      state.isFetching = false;

      let selectedProjectId = state.selectedProjectId;
      if (!selectedProjectId) {
        // set default project
        selectedProjectId = state.projects.at(0)?.identifier ?? '';
        state.selectedProjectId = selectedProjectId;
      }
      if (!state.selectedDatasetId && selectedProjectId) {
        // set default dataset
        state.selectedDatasetId = state.projectsById[state.selectedProjectId]?.datasets.at(0)?.identifier ?? '';
      }
    });
    builder.addCase(getProjects.rejected, (state) => {
      state.isFetching = false;
    });
  },
});

export default metadata.reducer;
