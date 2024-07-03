import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { projectsUrl } from '@/constants/configConstants';
import { PaginatedResponse, Project } from '@/types/metadata';
import { RootState } from '@/store';
import axios from 'axios';
import { printAPIError } from '@/utils/error.util';

interface MetadataState {
  projects: Project[];
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
      if (payload === '' || state.projects.find(({ identifier }) => identifier === payload)) {
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
        (selectedProject &&
          state.projects
            .find(({ identifier }) => identifier === selectedProject)!
            .datasets.some((d) => d.identifier === payload))
      ) {
        state.selectedDatasetId = payload;
        state.params.dataset = payload;
      } else {
        console.error(`Dataset ID ${payload} does not exist, or is not a member of the selected project.`);
      }
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

export const { selectProject, selectDataset } = metadata.actions;
export default metadata.reducer;
