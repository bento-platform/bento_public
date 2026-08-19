import { DOI_PATTERN, URL_PATTERN } from '@/constants/patterns';
import type { TextContentType } from '@/types/dataset';
// import i18n from '@/i18n';

export const stringToBoolean = (s: string | undefined, default_: string = '') =>
  ['true', 't', '1', 'yes'].includes((s || default_).toLocaleLowerCase());

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

export const isValidUrl = (url?: string) => {
  if (!url) return false;
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

/** Uses the browser's rendering engine to strip HTML and return tag-less plain text from content, if its MIME type is
 * text/html. Otherwise, the text will be returned as-is. */
export const stripRichText = (content: string, contentType: TextContentType) => {
  if (contentType === 'text/html') {
    const tmp = document.createElement('div');
    tmp.innerHTML = content;
    return tmp.innerText;
  } else {
    return content;
  }
};

/** Strips accents/diacritics from a string. Useful for doing normalized/fuzzy searching while handling diacritics. */
export const stripDiacritics = (s: string) => s.normalize('NFKD').replace(/\p{Diacritic}/gu, '');
