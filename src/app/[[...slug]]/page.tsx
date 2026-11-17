import ClientApp from './ClientApp';

// Server component on purpose: Next passes `params`/`searchParams` Promises to page components. In a client page,
// dev tooling enumerates those props in the browser and logs sync-dynamic-apis warnings.
// TODO: Adapt paths to static routes
export default function Page() {
  return <ClientApp />;
}
