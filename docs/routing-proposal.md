# Proposal: file-based routes for Bento Public

Status: draft, for discussion

## Why

All of Bento Public currently runs under one Next.js catch-all page, `src/app/[[...slug]]/page.tsx`. Routing is done
client-side:

- `matchRoute` / `useRouteMatch` (`src/js/hooks/router.tsx`) parse the pathname into `lang`, `projectId`/`datasetId`,
  `page`, `packetId` and `tab`.
- `BentoAppRouter` switches on `page` to choose what to render.
- The app is rendered from the root layout. A Next.js navigation changes the catch-all page's params, which would
  remount the app if it lived in the page.
- Navigation uses native `history.pushState`/`replaceState` through a small `navigate`/`Link` helper (#477). The
  helper exists because `router.push` re-fetches the catch-all page from the server on every navigation, only for it
  to render nothing.

This works, but it fights Next.js rather than using it. The router helpers, the page switch and the workarounds all
exist because Next doesn't know about our routes. Moving to file-based routes would let us delete that layer and use
`next/link`, `useRouter`, `useParams`, `not-found.tsx` and prefetching as designed.

## Current URL structure

```
/:lang/                                    explore (catalogue when there are several projects)
/:lang/explore
/:lang/about
/:lang/beacon                              only if BEACON_UI_ENABLED
/:lang/network                             only if BEACON_NETWORK_ENABLED; top level only
/:lang/phenopackets/:packetId[/:tab]

/:lang/p/:projectId/...                    same pages as above, scoped to a project (no network)
/:lang/d/:datasetId/...                    same pages as above, scoped to a dataset (no network)
```

Query parameters hold the rest of the state: search filters, text query, results table, catalogue facets, expanded
phenopacket sections and the highlight target. That doesn't need to change.

## Proposed route tree

```
src/app/
  layout.tsx                    <html>, config scripts (unchanged)
  [lang]/
    layout.tsx                  app shell: providers, auth, DefaultLayout
    page.tsx                    explore / catalogue
    explore/page.tsx
    about/page.tsx
    beacon/page.tsx
    network/page.tsx
    phenopackets/[packetId]/[[...tab]]/page.tsx
    p/[projectId]/
      layout.tsx                scope validation, sets the Redux scope
      (same pages as above, without network)
    d/[datasetId]/
      layout.tsx
      (same pages as above, without network)
    not-found.tsx
proxy.ts                        language redirect (see 6)
```

Each `page.tsx` would be a short file that renders an existing component, for example
`export { default } from '@/components/About/AboutPage'`. The page components stay where they are.

## What this removes or replaces

| Today | With file-based routes |
|---|---|
| `matchRoute` / `useRouteMatch` | `useParams()` |
| `BentoAppRouter`'s page switch | the file tree |
| `getCurrentPage()` | `useSelectedLayoutSegment()`, or the page passes its own identity |
| `navigate` / custom `Link` (temporary, #477) | `useRouter()` / `next/link` |
| `NotFoundPage` fallback in the switch | `not-found.tsx` + `notFound()` |
| Phenopacket tab redirect done during render | `router.replace` in the tab page |
| `LanguageHandler` redirect | `proxy.ts` (server-side, before render) |

## Findings

Sources are the Next 16.4 docs in `node_modules/next/dist/docs/`, plus a spike: a production build (`next build`,
then `next start`) with one file-based route, `[lang]/about`, beside today's catch-all.

### 1. Navigation latency: not a concern in production

The ~540 ms per navigation we saw in dev comes from the dev server compiling on demand, not from the round-trip
itself. These are client-side navigations measured in a production build on `localhost`:

| Navigation | RSC fetch | URL updated |
|---|---|---|
| Catch-all, dynamic (`/en/d/abc/explore`) | 4–9 ms | 10–40 ms |
| File-based, SSG (`/en/about`, `/fr/about`) | 7–15 ms | 13–24 ms |
| After `router.prefetch` | 6–7 ms | 12–17 ms |

A real deployment adds one network round-trip through the gateway per uncached navigation. It can be avoided
completely:

- Our pages render nothing on the server; all their data is fetched on the client. That means every route can be
  **static** even with dynamic params: if `generateStaticParams` returns `[]`, each path is rendered on its first
  visit and then served as static content. The spike build marked `/[lang]/about` this way as `●` (SSG).
- Static routes are fully prefetched by `next/link` when it enters the viewport, and kept in the client cache for 5
  minutes (`staleTimes.static`), so navigation after a prefetch needs no network.
- One cost to keep in mind: the server keeps a rendered copy of each visited path (for example each phenopacket ID).
  These copies are tiny because the pages render almost nothing, but the cache grows with the number of distinct
  URLs visited.

**Recommendation:** make every page static with `generateStaticParams() { return [] }` and use `next/link`. This
removes the main argument for keeping the History API workaround.

### 2. Duplicated scoped subtrees

Every page exists three times: top level, under `p/[projectId]`, and under `d/[datasetId]`.

- **(a)** Duplicate the one-line `page.tsx` files (about 3 × 6 files). Simple and explicit.
- **(b)** Use a single `[scopeType]/[scopeId]` segment, validated in its layout to be `p` or `d`. This is one copy
  instead of two, but the segment is looser.
- **(c)** Rewrite `/:lang/(p|d)/:id/...` to the top-level routes in `proxy.ts`. With rewrites, `usePathname` can
  differ from the browser URL and the docs warn about hydration mismatches. We render client-only, so we would avoid
  the mismatch, but it hides routing in the proxy.

**Recommendation:** (a). The files carry no logic, and the explicit tree is easiest to read.

### 3. What remounts on navigation

- Navigations below a layout don't re-render it, so the shell in `[lang]/layout.tsx` stays mounted across every page
  change within a language.
- A segment whose dynamic param changes renders fresh. In this tree that means changing `lang` remounts the shell
  (the header already remounts on a language switch today), and changing project or dataset remounts the scope
  layout and its pages. That should be harmless because `BentoAppRouter` already resets query state on scope change,
  but it should be confirmed in the spike.
- Redux state survives because the store is a module singleton.
- An option for later: Next 16's Cache Components keeps up to 3 previously visited pages mounted but hidden (React
  `<Activity>`). Back/forward would then restore scroll, open sections and form state. It's opt-in
  (`cacheComponents: true`), and it changes how `generateStaticParams` works (it must return at least one param), so
  it's out of scope for this migration.

### 4. Client-only rendering

The shell stays a client component loaded with `dynamic(..., { ssr: false })`, because Leaflet and antd's cssinjs
are browser-only. It moves from the root layout into `[lang]/layout.tsx`. Pages are client components too. Nothing
in this tree prevents server-rendering parts of the app later.

### 5. Runtime-gated routes

`beacon` and `network` exist only when enabled in the runtime config (`/public/config.js`), so they can't be decided
at build time. Their pages check the config and call `notFound()`, which matches today's behaviour, where the switch
falls through to `NotFoundPage`.

### 6. Redirect and validation logic

- **Language** (`LanguageHandler`). The Next i18n guide does the locale redirect in `proxy.ts` using
  `Accept-Language`, so `/` or an unsupported language redirects to `/:lang/...` before anything renders.
  `generateStaticParams` on `[lang]` can list `en` and `fr`.
- **Scope** (`ScopedRoute`). This validates the URL scope against the projects list, cleans the URL on
  single-project instances, and sets the Redux scope. It needs the projects API, so it stays client-side, in the
  `p/[projectId]` and `d/[datasetId]` layouts. The top level also needs it, for the single-project URL cleanup, so it
  lives in `[lang]/layout.tsx`.
- **Phenopacket tab.** A missing or invalid tab redirects to the first available tab, which depends on the loaded
  phenopacket. This stays in `PhenopacketView`, but uses `router.replace` in an effect instead of navigating during
  render.
- **`/:lang/` and `/:lang/explore`.** Both are Explore today. This needs a decision: keep both routes, or redirect
  one to the other.

### 7. Existing route handlers

In the spike build, `/public/config.js`, `/service-info` and `/api/auth/*` sat beside the new `[lang]` route. Static
segments take priority over dynamic ones, so they are unaffected. Unknown first segments (for example `/xyz`) will
hit `[lang]`. The proxy redirects them, and `[lang]/layout.tsx` calls `notFound()` for anything that isn't a
supported language.

## Incremental migration

Specific routes take priority over the `[[...slug]]` catch-all, so the two can coexist and we can migrate one route
at a time:

1. Add `proxy.ts` (language redirect) and `[lang]/layout.tsx` (shell + top-level scope validation). Move the
   catch-all to `[lang]/[[...slug]]` for the pages not yet migrated.
2. Migrate `about` at all three scope levels with `generateStaticParams() { return [] }` and `next/link`. Confirm
   finding 3 (what remounts on a scope change), and measure navigation in a production build behind the bentoctl
   stack.
3. Migrate `beacon`, `network` and `explore`, then phenopackets.
4. Delete the catch-all, `BentoAppRouter`'s switch, `matchRoute`, `LanguageHandler`, and the temporary
   `navigate`/`Link` from #477.

## Decisions needed

- **Q1:** agree to make every page static with `generateStaticParams` returning `[]`.
- **Q2:** how to handle the scoped subtrees: (a), (b) or (c). Recommended: (a).
- **Q6:** for `/:lang/` and `/:lang/explore`, keep both routes or redirect one to the other.
- Whether to go ahead with the step 2 spike.
