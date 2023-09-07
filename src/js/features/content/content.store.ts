import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { partialAboutUrl } from '@/constants/contentConstants';
import { printAPIError } from '@/utils/error.util';

export const makeGetAboutRequest = createAsyncThunk('content/getAboutHTML', async (_, { rejectWithValue }) => {
  const en = await axios
    .get(`${partialAboutUrl}/en_about.html`)
    .then((res) => res.data)
    .catch(printAPIError(rejectWithValue));

  const fr = await axios
    .get(`${partialAboutUrl}/fr_about.html`)
    .then((res) => res.data)
    .catch(printAPIError(rejectWithValue));

  return { en, fr };
});

export type ContentState = {
  isFetchingAbout: boolean;
  about: { [key: string]: string };
};

const initialState: ContentState = {
  isFetchingAbout: true,
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
    });
    builder.addCase(makeGetAboutRequest.rejected, (state) => {
      state.isFetchingAbout = false;
    });
  },
});

export default content.reducer;
