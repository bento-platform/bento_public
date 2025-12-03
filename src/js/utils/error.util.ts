/* eslint-disable @typescript-eslint/no-explicit-any */
import type { AxiosError } from 'axios';

export const printAPIError = (rejectWithValue: (value: string) => any) => (error: AxiosError) => {
  if (error.response) {
    // Request made and server responded
    console.log(error.response.data);
    console.log(error.response.status);
    console.log(error.response.headers);
    return rejectWithValue(error.response.data as string);
  } else if (error.request) {
    // The request was made but no response was received
    console.log(error.request);
    return rejectWithValue(error.request);
  } else {
    // Something happened in setting up the request that triggered an Error
    console.log('Error', error.message);
    return rejectWithValue(error.message);
  }
};
