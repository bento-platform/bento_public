import { notFound } from 'next/navigation';

// Unmatched paths under [lang] render [lang]/not-found.tsx inside the app shell.
export default function Page() {
  notFound();
}
