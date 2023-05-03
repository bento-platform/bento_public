import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { partialAboutUrl } from '@/constants/contentConstants';
import { printAPIError } from '@/utils/error.util';

export const makeGetAboutRequest = createAsyncThunk('content/getAboutHTML', async () => {
  const en_aboutHTML = await axios
    .get(`${partialAboutUrl}en_about.html`)
    .then((res) => res.data)
    .catch(printAPIError);

  const fr_aboutHTML = await axios
    .get(`${partialAboutUrl}fr_about.html`)
    .then((res) => res.data)
    .catch(printAPIError);

  return { en_aboutHTML, fr_aboutHTML };
});

export type ContentState = {
  isFetchingAbout: boolean;
  en_aboutHTML: string;
  fr_aboutHTML: string;
};

const initialState: ContentState = {
  isFetchingAbout: true,
  en_aboutHTML: "",
  fr_aboutHTML: "",
};

const content = createSlice({
  name: 'content',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(makeGetAboutRequest.pending, (state) => {
      state.isFetchingAbout = true;
    });
    builder.addCase(makeGetAboutRequest.fulfilled, (state, { payload }: PayloadAction<{ en_aboutHTML: string; fr_aboutHTML: string }>) => {
      state.en_aboutHTML = payload.en_aboutHTML;
      state.fr_aboutHTML = payload.fr_aboutHTML;
      state.isFetchingAbout = false;
    });
    builder.addCase(makeGetAboutRequest.rejected, (state) => {
      state.isFetchingAbout = false;
    });
  },
});

export default content.reducer;
