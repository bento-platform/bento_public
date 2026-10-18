import type { ReactNode } from 'react';
import { SUPPORTED_LNGS_ARRAY } from '@/constants/languages';
import ClientApp from '../ClientApp';

// proxy.ts redirects unsupported languages, so these are the only values this segment sees.
export const generateStaticParams = () => SUPPORTED_LNGS_ARRAY.map((lang) => ({ lang }));

export default function LangLayout({ children }: { children: ReactNode }) {
  return <ClientApp>{children}</ClientApp>;
}
