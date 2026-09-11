import { useCallback, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';

// The language segment ([lang]) is a real Next.js route param, so - unlike the old BrowserRouter, which had
// it baked into its basename - paths pushed via next/navigation's router are NOT automatically prefixed with
// it. Anything that builds a brand-new lang-free path from scratch (as opposed to tweaking the query string of
// the current page) needs to re-add it before navigating; this hook centralizes that.
export const useLangPrefix = (): string => {
  const { lang } = useParams<{ lang: string }>();
  return `/${lang}`;
};

export const useLangHref = (): ((path: string) => string) => {
  const prefix = useLangPrefix();
  return useCallback((path: string) => `${prefix}${path.startsWith('/') ? path : `/${path}`}`, [prefix]);
};

export interface AppRouter {
  push: (path: string) => void;
  replace: (path: string) => void;
}

/** Like next/navigation's useRouter, but push/replace take a lang-free path and re-add the [lang] prefix. */
export const useAppRouter = (): AppRouter => {
  const router = useRouter();
  const toHref = useLangHref();

  return useMemo(
    () => ({
      push: (path: string) => router.push(toHref(path)),
      replace: (path: string) => router.replace(toHref(path)),
    }),
    [router, toHref]
  );
};
