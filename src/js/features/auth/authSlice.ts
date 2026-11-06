import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { RootState } from '@/store';
import { type Resource, makeResourceKey } from 'bento-auth-js';

type FetchPermissionsPayload = {
  result: string[][];
};
type FetchPermissionsParams = {
  resources: Resource[];
  authzUrl: string;
};

export const fetchResourcesPermissions = createAsyncThunk<
  FetchPermissionsPayload,
  FetchPermissionsParams,
  { state: RootState }
>(
  'auth/FETCH_RESOURCES_PERMISSIONS',
  async ({ resources, authzUrl }) => {
    const url = `${authzUrl}/policy/permissions`;
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ resources }),
    });
    return await response.json();
  },
  {
    condition: ({ resources }, { getState }) => {
      // Allow the fetch to fire only if none of the requested resource permission-sets are already being fetched.
      const { auth } = getState();
      return resources.every((resource) => {
        const key = makeResourceKey(resource);
        const rp = auth.resourcePermissions?.[key];
        return !rp?.isFetching;
      });
    },
  }
);

export type AuthSliceState = {
  resourcePermissions: {
    [name: string]: {
      isFetching: boolean;
      hasAttempted: boolean;
      error: string;
      permissions: string[];
    };
  };
};
const initialState: AuthSliceState = {
  resourcePermissions: {},
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchResourcesPermissions.pending, (state, { meta }) => {
        for (const resource of meta.arg.resources) {
          const key = makeResourceKey(resource);
          state.resourcePermissions[key] = {
            ...state.resourcePermissions[key],
            isFetching: true,
            hasAttempted: false,
            permissions: [],
            error: '',
          };
        }
      })
      .addCase(fetchResourcesPermissions.fulfilled, (state, { meta, payload }) => {
        const resources = meta.arg.resources;
        for (const r in resources) {
          const key = makeResourceKey(resources[r]);
          state.resourcePermissions[key] = {
            ...state.resourcePermissions[key],
            isFetching: false,
            hasAttempted: true,
            permissions: payload?.result?.[r] ?? [],
          };
        }
      })
      .addCase(fetchResourcesPermissions.rejected, (state, { meta, error }) => {
        if (error) console.error(error);

        for (const resource of meta.arg.resources) {
          const key = makeResourceKey(resource);

          const permissionsError = error.message ?? 'An error occurred while fetching permissions for a resource';
          state.resourcePermissions[key] = {
            ...state.resourcePermissions[key],
            isFetching: false,
            hasAttempted: true,
            error: permissionsError,
          };
        }
      });
  },
});

export default authSlice.reducer;
