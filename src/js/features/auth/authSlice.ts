import { createAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { RootState } from '@/store';
import { type Resource, makeResourceKey, makeAuthorizationHeader } from 'bento-auth-js';

type FetchPermissionsPayload = {
  result: string[][];
};
type FetchPermissionsParams = {
  resources: Resource[];
  authzUrl: string;
  accessToken: string | undefined;
};

export const fetchResourcesPermissions = createAsyncThunk<
  FetchPermissionsPayload,
  FetchPermissionsParams,
  { state: RootState }
>(
  'auth/FETCH_RESOURCES_PERMISSIONS',
  async ({ resources, authzUrl, accessToken }) => {
    const url = `${authzUrl}/policy/permissions`;
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...makeAuthorizationHeader(accessToken) },
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
  accessToken?: string;
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

export const setAccessToken = createAction<string | undefined>('auth/SET_ACCESS_TOKEN');

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(setAccessToken, (state, { payload }) => {
        state.accessToken = payload;
      })
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
