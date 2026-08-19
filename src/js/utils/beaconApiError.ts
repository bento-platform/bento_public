/* eslint-disable @typescript-eslint/no-explicit-any */
import type { AxiosError } from 'axios';
import type { BeaconErrorData } from '@/types/beacon';

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

// For beacon API errors in Redux state slices, a blank string is treated as "no error" - so we need to fall back to a
// default non-blank error string if (for some reason) we get an error with no associated message back.
export const errorMsgOrDefault = (err: unknown): string => (err as string) || 'error';
