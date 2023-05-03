import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { aboutUrl } from '@/constants/contentConstants';
import { printAPIError } from '@/utils/error.util';

export const makeGetAboutRequest = createAsyncThunk<string, void, { rejectValue: string }>(
  'content/getAboutHTML',
  (_, { rejectWithValue }) =>
    axios
      .get(aboutUrl)
      .then((res) => res.data)
      .catch(printAPIError(rejectWithValue))
);

export type ContentState = {
  isFetchingAbout: boolean;
  aboutHTML: string;
};

const initialState: ContentState = {
  isFetchingAbout: true,
  aboutHTML: '',
};

const content = createSlice({
  name: 'content',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(makeGetAboutRequest.pending, (state) => {
      state.isFetchingAbout = true;
    });
    builder.addCase(makeGetAboutRequest.fulfilled, (state, { payload }: PayloadAction<string>) => {
      state.aboutHTML = payload;
      state.isFetchingAbout = false;
    });
    builder.addCase(makeGetAboutRequest.rejected, (state) => {
      state.isFetchingAbout = false;
    });
  },
});

export default content.reducer;
