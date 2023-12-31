/* eslint-disable @typescript-eslint/no-explicit-any */
import { AxiosError } from 'axios';
import { BeaconErrorData } from '@/types/beacon';

export const beaconApiError = (rejectWithValue: (value: string) => any) => (error: AxiosError) => {
  if (error.response) {
    // got error response from beacon (any response beyond 2xx)
    const d = error.response.data as BeaconErrorData;
    const beaconErrorMessage = d.error?.errorMessage;
    console.error(beaconErrorMessage);
    return rejectWithValue(beaconErrorMessage as string);
  } else if (error.request) {
    // The request was made but no response was received
    console.error(error.request);
    return rejectWithValue(error.request);
  } else {
    // Something happened in setting up the request that triggered an Error
    console.error('Error', error.message);
    return rejectWithValue(error.message);
  }
};
