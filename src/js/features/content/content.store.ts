import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { AxiosError } from 'axios';
import axios from 'axios';
import { partialAboutUrl } from '@/constants/contentConstants';
import type { RootState } from '@/store';
import { RequestStatus } from '@/types/requests';
import { printAPIError } from '@/utils/error.util';

type AboutContent = { [key: string]: string };

export const makeGetAboutRequest = createAsyncThunk<AboutContent, void, { state: RootState; rejectValue: string }>(
  'content/getAboutHTML',
  async (_, { rejectWithValue }) => {
    // Only the outer Promise.all's rejection is passed to rejectWithValue()/printAPIError() - returning
    // rejectWithValue's result from a .catch() on one of the inner promises wouldn't reject the thunk, since
    // rejectWithValue() just produces a value, rather than throwing; it needs to be the payload creator's own
    // returned/thrown value to be recognized as a rejection.
    try {
      const [en, fr] = await Promise.all([
        axios.get(`${partialAboutUrl}/en_about.html`).then((res) => res.data),
        axios.get(`${partialAboutUrl}/fr_about.html`).then((res) => res.data),
      ]);
      return { en, fr };
    } catch (err) {
      return printAPIError(rejectWithValue)(err as AxiosError);
    }
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
