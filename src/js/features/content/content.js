import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { aboutUrl } from '../../constants/contentConstants';
import { printAPIError } from '../../utils/error';

export const makeGetAboutRequest = createAsyncThunk('content/getAboutHTML', async () => {
  const en_aboutHTML = await axios
    .get(`${aboutUrl}en_about.html`)
    .then((res) => res.data)
    .catch(printAPIError);

  const fr_aboutHTML = await axios
    .get(`${aboutUrl}fr_about.html`)
    .then((res) => res.data)
    .catch(printAPIError);

  return { en_aboutHTML, fr_aboutHTML };
});

const initialState = {
  isFetchingAbout: true,
  en_aboutHTML: "",
  fr_aboutHTML: "",
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
      state.eng_aboutHTML = payload.en_aboutHTML;
      state.fr_aboutHTML = payload.fr_aboutHTML;
      state.isFetchingAbout = false;
    },
    [makeGetAboutRequest.rejected]: (state) => {
      state.isFetchingAbout = false;
    },
  },
});

export default content.reducer;
