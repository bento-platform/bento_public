import axios from 'axios';
import type { PayloadAction } from '@reduxjs/toolkit';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { partialAboutUrl } from '@/constants/contentConstants';
import type { RootState } from '@/store';
import { printAPIError } from '@/utils/error.util';

export const makeGetAboutRequest = createAsyncThunk<
  { en: string; fr: string },
  void,
  {
    state: RootState;
  }
>(
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
      return !getState().content.isFetchingAbout && !getState().content.hasAttemptedAbout;
    },
  }
);

export type ContentState = {
  isFetchingAbout: boolean;
  hasAttemptedAbout: boolean;
  about: { [key: string]: string };
};

const initialState: ContentState = {
  isFetchingAbout: false,
  hasAttemptedAbout: false,
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
      state.isFetchingAbout = true;
    });
    builder.addCase(makeGetAboutRequest.fulfilled, (state, { payload }: PayloadAction<{ en: string; fr: string }>) => {
      state.about = { ...payload };
      state.isFetchingAbout = false;
      state.hasAttemptedAbout = true;
    });
    builder.addCase(makeGetAboutRequest.rejected, (state) => {
      state.isFetchingAbout = false;
      state.hasAttemptedAbout = true;
    });
  },
});

export default content.reducer;
