import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { aboutUrl } from '../../constants/contentConstants';
import { printAPIError } from '../../utils/error';

export const makeGetAboutRequest = createAsyncThunk('content/getAboutHTML', async () => {
  return axios
    .get(aboutUrl)
    .then((res) => res.data)
    .catch(printAPIError);
});

const initialState = {
  isFetchingAbout: true,
  aboutHTML: "",
};

const content = createSlice({
  name: "content",
  initialState,
  reducers: {},
  extraReducers: {
    [makeGetAboutRequest.pending]: (state) => {
      state.isFetchingAbout = true;
    },
    [makeGetAboutRequest.fulfilled]: (state, { payload }) => {
      state.aboutHTML = payload;
      state.isFetchingAbout = false;
    },
    [makeGetAboutRequest.rejected]: (state) => {
      state.isFetchingAbout = false;
    },
  },
});

export default content.reducer;
