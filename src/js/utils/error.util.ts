/* eslint-disable @typescript-eslint/no-explicit-any */
import type { AxiosError } from 'axios';

export const printAPIError = (rejectWithValue: (value: string) => any) => (error: AxiosError) => {
  if (error.response) {
    // Request made and server responded
    console.log(error.response.data);
    console.log(error.response.status, error.response.statusText);
    console.log(error.response.headers);

    let errorMessage = '';
    const contentType = error.response.headers['content-type'];
    if (contentType === 'text/html') {
      errorMessage = `${error.response.status} ${error.response.statusText}`;
    } else if (contentType === 'application/json') {
      const data = JSON.parse(error.response.data as string);
      // handle Bento error format(s)
      // see https://github.com/bento-platform/bento_lib/blob/master/bento_lib/responses/errors.py
      if ('message' in data) {
        errorMessage = data['message'];
      }
      if ('errors' in data && Array.isArray(data['errors']) && data['errors'].length) {
        if (errorMessage) errorMessage += ' | '; // separator
        errorMessage += data.errors
          .map((e: unknown) => {
            if (typeof e === 'string') {
              return e;
            } else if (e && typeof e === 'object' && 'message' in e) {
              return e.message as string;
            }
            return undefined;
          })
          .filter((e: string | undefined) => !!e)
          .join(', ');
      }
    } else {
      errorMessage = error.response.data as string;
    }

    return rejectWithValue(errorMessage);
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
