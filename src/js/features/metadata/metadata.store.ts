import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { projectsUrl } from '@/constants/configConstants';
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
  params: {
    project: string;
    dataset: string;
  };
}

const initialState: MetadataState = {
  projects: [],
  datasets: [],
  datasetsById: {},
  projectsById: {},
  isFetching: true,
  selectedProjectId: '',
  selectedDatasetId: '',
  params: {
    project: '',
    dataset: '',
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
    selectProject: (state, { payload }: PayloadAction<string>) => {
      // Change project selection if valid
      if (payload === '' || state.projectsById[payload]) {
        // select project
        state.selectedProjectId = payload;
        state.params.project = payload;
        // unselect dataset
        state.selectedDatasetId = '';
        state.params.dataset = '';
      } else {
        console.error(`Project ID ${payload} does not exist.`);
      }
    },
    selectDataset: (state, { payload }: PayloadAction<string>) => {
      const selectedProject = state.selectedProjectId;
      // Change dataset selection if it is included in the selected project
      if (
        payload === '' ||
        (selectedProject && state.projectsById[selectedProject].datasets.some((d) => d.identifier === payload))
      ) {
        state.selectedDatasetId = payload;
        state.params.dataset = payload;
      } else {
        console.error(`Dataset ID ${payload} does not exist, or is not a member of the selected project.`);
      }
    },
  },
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

      // let selectedProjectId = state.selectedProjectId;
      // if (!selectedProjectId) {
      //   // set default project
      //   selectedProjectId = state.projects.at(0)?.identifier ?? '';
      //   state.selectedProjectId = selectedProjectId;
      //   state.params.project = selectedProjectId
      // }
      // if (!state.selectedDatasetId && selectedProjectId) {
      //   // set default dataset
      //   const datasetId = state.projectsById[state.selectedProjectId]?.datasets.at(0)?.identifier ?? '';
      //   state.selectedDatasetId = datasetId;
      //   state.params.dataset = datasetId;
      // }
    });
    builder.addCase(getProjects.rejected, (state) => {
      state.isFetching = false;
    });
  },
});

export const { selectProject, selectDataset } = metadata.actions;
export default metadata.reducer;
