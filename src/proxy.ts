import { NextResponse, type NextRequest } from 'next/server';
import { SUPPORTED_LNGS, SUPPORTED_LNGS_ARRAY } from '@/constants/languages';

/** The browser's preferred language if we support it, else English (same rule the client used to apply). */
const preferredLanguage = (request: NextRequest): string => {
  const first = request.headers.get('accept-language')?.split(',')[0]?.split(/[-;]/)[0]?.trim().toLowerCase();
  return first && SUPPORTED_LNGS_ARRAY.includes(first) ? first : SUPPORTED_LNGS.ENGLISH;
};

// Explore is each scope's base path; /:lang[/(p|d)/:id]/explore is kept as a redirect for old links and bookmarks.
const EXPLORE_PATH = /^(\/[^/]+(?:\/[pd]\/[^/]+)?)\/explore\/?$/;

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const lang = pathname.split('/')[1];

  if (!SUPPORTED_LNGS_ARRAY.includes(lang)) {
    // Missing or unsupported language: go to the root of the preferred language.
    return NextResponse.redirect(new URL(`/${preferredLanguage(request)}/`, request.url));
  }

  const explore = EXPLORE_PATH.exec(pathname);
  if (explore) {
    const url = request.nextUrl.clone();
    url.pathname = `${explore[1]}/`;
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  // Everything except Next.js internals, API/auth routes, the public config and static files under /public.
  matcher: ['/((?!_next|__nextjs|api|public|service-info|favicon.ico).*)'],
};
