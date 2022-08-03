import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { katsuUrl } from '../../constants/configConstants';

export const makeGetKatsuPublic = createAsyncThunk('query/makeGetKatsuPublic', async (_ignore, thunkAPI) => {
  const queryParams = thunkAPI.getState().query.queryParams;

  return await axios.get(katsuUrl, { params: queryParams }).then((res) => res.data);
});

export default {
  [makeGetKatsuPublic.pending]: (state) => {
    state.isFetchingData = true;
  },
  [makeGetKatsuPublic.fulfilled]: (state, { payload }) => {
    if ('message' in payload)
      state.queryResponseData = {
        status: 'message',
        message: payload.message,
      };
    else state.queryResponseData = { status: 'count', count: payload.count };

    state.isValid = true;
    state.isFetchingData = false;
  },
  [makeGetKatsuPublic.rejected]: (state) => {
    state.isFetchingData = false;
  },
};
