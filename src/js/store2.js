import { configureStore } from '@reduxjs/toolkit';
import dataReducer from './features/data';

const store = configureStore({
  reducer: {
    data: dataReducer,
  },
});
