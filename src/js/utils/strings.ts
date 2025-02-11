import { DOI_PATTERN, URL_PATTERN } from '@/constants/patterns';
// import i18n from '@/i18n';

export const stringToBoolean = (s: string | undefined) =>
  ['true', 't', '1', 'yes'].includes((s || '').toLocaleLowerCase());

export const stringIsDOI = (s: string) => !!s.match(DOI_PATTERN);
export const stringIsURL = (s: string) => !!s.match(URL_PATTERN);

export const isoDateToString = (d: string, lang?: string) => {
  const dateLang = lang === 'fr' ? 'fr-CA' : 'en-US';
  return new Date(d).toLocaleString(dateLang, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};
