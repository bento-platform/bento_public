import { DOI_PATTERN, URL_PATTERN } from '@/constants/patterns';

export const stringIsDOI = (s: string) => !!s.match(DOI_PATTERN);
export const stringIsURL = (s: string) => !!s.match(URL_PATTERN);
