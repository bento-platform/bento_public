import axios from 'axios';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { partialAboutUrl } from '@/constants/contentConstants';
import type { RootState } from '@/store';
import { RequestStatus } from '@/types/requests';
import { printAPIError } from '@/utils/error.util';

type AboutContent = { [key: string]: string };

export const makeGetAboutRequest = createAsyncThunk<AboutContent, void, { state: RootState }>(
  'content/getAboutHTML',
  async (_, { rejectWithValue }) => {
    const [en, fr] = await Promise.all([
      axios
        .get(`${partialAboutUrl}/en_about.html`)
        .then((res) => res.data)
        .catch(printAPIError(rejectWithValue)),
      axios
        .get(`${partialAboutUrl}/fr_about.html`)
        .then((res) => res.data)
        .catch(printAPIError(rejectWithValue)),
    ]);

    return { en, fr };
  },
  {
    condition(_, { getState }) {
      return getState().content.status === RequestStatus.Idle;
    },
  }
);

export type ContentState = {
  status: RequestStatus;
  about: AboutContent;
};

const initialState: ContentState = {
  status: RequestStatus.Idle,
  about: {
    en: '',
    fr: '',
  },
};

const content = createSlice({
  name: 'content',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(makeGetAboutRequest.pending, (state) => {
      state.status = RequestStatus.Pending;
    });
    builder.addCase(makeGetAboutRequest.fulfilled, (state, { payload }) => {
      state.about = { ...payload };
      state.status = RequestStatus.Fulfilled;
    });
    builder.addCase(makeGetAboutRequest.rejected, (state) => {
      state.status = RequestStatus.Rejected;
    });
  },
});

export default content.reducer;
