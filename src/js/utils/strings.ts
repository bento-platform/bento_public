import { DOI_PATTERN, URL_PATTERN } from '@/constants/patterns';

export const stringToBoolean = (s: string | undefined) =>
  ['true', 't', '1', 'yes'].includes((s || '').toLocaleLowerCase());

export const stringIsDOI = (s: string) => !!s.match(DOI_PATTERN);
export const stringIsURL = (s: string) => !!s.match(URL_PATTERN);
