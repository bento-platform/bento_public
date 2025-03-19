import axios from 'axios';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import type { RootState } from '@/store';
import type { BentoServiceDataType } from '@/types/dataTypes';
import { RequestStatus } from '@/types/requests';
import { scopedAuthorizedRequestConfig } from '@/utils/requests';

export const makeGetDataTypes = createAsyncThunk<
  BentoServiceDataType[],
  void,
  {
    rejectValue: string;
    state: RootState;
  }
>(
  'dataTypes/makeGetDataTypes',
  async (_, { getState }) => {
    // Service registry handles scoping here, although having the data types endpoint be the same as the
    // counts/last-ingested endpoint is odd and should be re-thought in the future.
    const res = await axios.get('/api/service-registry/data-types', scopedAuthorizedRequestConfig(getState()));
    return res.data;
  },
  {
    condition(_, { getState }) {
      const {
        dataTypes: { status, isInvalid },
        metadata: {
          selectedScope: { scopeSet },
        },
      } = getState();

      if (!scopeSet) {
        console.debug(`makeGetDataTypes() waiting for scopeSet`);
        return false;
      }

      if (!(status === RequestStatus.Idle || (status !== RequestStatus.Pending && isInvalid))) {
        console.debug(
          `makeGetDataTypes() was attempted, but a prior attempt gave status: ${status} (isInvalid: ${isInvalid})`
        );
        return false;
      }

      return true;
    },
  }
);

export type DataTypesState = {
  status: RequestStatus;
  isInvalid: boolean;
  dataTypesById: Record<string, BentoServiceDataType>;
};

const initialState: DataTypesState = {
  status: RequestStatus.Idle,
  isInvalid: false,
  dataTypesById: {},
};

const dataTypes = createSlice({
  name: 'dataTypes',
  initialState,
  reducers: {
    invalidateDataTypes: (state) => {
      state.isInvalid = true;
    },
  },
  extraReducers(builder) {
    builder.addCase(makeGetDataTypes.pending, (state) => {
      state.status = RequestStatus.Pending;
    });
    builder.addCase(makeGetDataTypes.fulfilled, (state, { payload }) => {
      state.status = RequestStatus.Fulfilled;
      state.isInvalid = false;
      state.dataTypesById = Object.fromEntries(payload.map((dt) => [dt.id, dt]));
    });
    builder.addCase(makeGetDataTypes.rejected, (state) => {
      state.status = RequestStatus.Rejected;
    });
  },
});

export const { invalidateDataTypes } = dataTypes.actions;
export default dataTypes.reducer;
