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
- Navigation uses native `history.pushState`/`replaceState` through a small `navigate`/`Link` helper (branch
  `fix/history-api-navigation`). `router.push` would re-fetch the catch-all page from the server on every navigation
  (measured at about 540 ms in dev, about 1 s from click to render), only for it to render nothing.

This works, but it fights Next.js rather than using it. The router helpers, the page switch and the scroll and
prefetch workarounds all exist because Next doesn't know about our routes. Moving to file-based routes would let us
delete that layer and use `next/link`, `useRouter`, `useParams`, `loading.tsx`, `not-found.tsx` and prefetching as
designed.

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
    layout.tsx                  app shell: providers, auth, language handling, DefaultLayout
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
```

Each `page.tsx` would be a short file that renders an existing component, for example
`export { default } from '@/components/About/AboutPage'`. The page components stay where they are.

## What this removes or replaces

| Today | With file-based routes |
|---|---|
| `matchRoute` / `useRouteMatch` | `useParams()` |
| `BentoAppRouter`'s page switch | the file tree |
| `getCurrentPage()` | `useSelectedLayoutSegment()`, or the page passes its own identity |
| `navigate` / custom `Link` (temporary) | `useRouter()` / `next/link` |
| `NotFoundPage` fallback in the switch | `not-found.tsx` + `notFound()` |
| Phenopacket tab redirect done during render | `redirect()` / `router.replace` in the tab page |

## Open questions

These are the parts that need thinking before anyone writes code.

### 1. Navigation latency in production

Our pages read their data on the client, so the server work per navigation is trivial. It is still a server round
trip, and for dynamic segments (`[projectId]`, `[datasetId]`, `[packetId]`) Next only prefetches partially, and only
when a `loading.tsx` exists. Things to measure or decide:

- How long the RSC round trip takes in a production build behind our stack. The 540 ms above is dev, which compiles on
  demand.
- Whether a `loading.tsx` per scope gives acceptable instant feedback.
- Whether `staleTimes.dynamic` or Partial Prefetching (in Next 16) gets us close to today's instant client-side
  navigation.
- Whether `generateStaticParams` for `lang` (`en`, `fr`) is worth adding.

If production navigation stays noticeably slower than today, that weakens the case for this change.

### 2. Duplicated scoped subtrees

Every page exists three times: top level, under `p/[projectId]`, and under `d/[datasetId]`. Ways to handle that:

- **(a)** Duplicate the one-line `page.tsx` files. This is simple but verbose (about 3 × 6 files).
- **(b)** Use a single `[scopeType]/[scopeId]` segment, validated in its layout to be `p` or `d`. This is one copy
  instead of two, but the segment is looser and needs validation.
- **(c)** Rewrite `/:lang/(p|d)/:id/...` to the top-level routes in `proxy`/`middleware` and carry the scope some
  other way. This needs checking: what does `usePathname` report under a rewrite?

### 3. What remounts on navigation

A layout under a dynamic segment remounts when that segment's param changes. With the tree above:

- Changing language remounts everything under `[lang]`. This already happens today: the header remounts on a
  language switch on `main`.
- Changing dataset or project remounts the scope layout and its pages. This is probably desirable, because
  `BentoAppRouter` already resets query state on scope change, but it is a behaviour change to confirm.
- Redux state survives, since the store is a module singleton provided in the shell.

### 4. Client-only rendering

The app is loaded with `dynamic(..., { ssr: false })` because of browser-only dependencies (Leaflet, antd's
cssinjs). Questions:

- Does the shell stay client-only in the `[lang]` layout, with pages as client components?
- Is any of it worth server-rendering later? This proposal doesn't depend on that, but the tree shouldn't rule it out.

### 5. Runtime-gated routes

`beacon` and `network` exist only when enabled in the runtime config (`/public/config.js`, read per deployment), so
they can't be decided at build time. Their pages would check the config and call `notFound()`. Is that acceptable, or
should disabled routes be invisible in some other way?

### 6. Redirect and validation logic

Each of these needs a new home:

- **Language** (`LanguageHandler`). The redirect from `/` or an unsupported language to `/:lang/` based on the
  browser language could move into `proxy`/`middleware` using `Accept-Language`, so it happens on the server and
  never renders.
- **Scope** (`ScopedRoute` in `BentoAppRouter`). This validates the URL scope against the projects list, cleans the
  URL on single-project instances, and sets the Redux scope. It needs the projects API, so it stays client-side, in
  the scope layouts.
- **Phenopacket tab.** A missing or invalid tab redirects to the first available tab, which depends on the loaded
  phenopacket.
- **`/:lang/` and `/:lang/explore`.** Both are Explore today. Do we keep both routes or redirect one to the other?

### 7. Existing route handlers

`/public/config.js`, `/service-info` and `/api/auth/*` sit beside `[lang]`. Static segments take priority over
dynamic ones, so they should be unaffected, but this needs verifying. Unknown first segments would hit `[lang]` and
must be rejected or redirected there.

## Incremental migration

Specific routes take priority over the `[[...slug]]` catch-all, so the two can coexist and we can migrate one route
at a time:

1. Create `[lang]/layout.tsx` with the shell, and keep the catch-all under it for the pages not yet migrated.
2. Migrate a simple page first (`about`) at all three scope levels, and measure navigation latency in a production
   build. This answers open question 1 before we commit.
3. Migrate `beacon`, `network` and `explore`, then phenopackets.
4. Delete the catch-all, `BentoAppRouter`'s switch, `matchRoute`, and the temporary `navigate`/`Link`.

## Next steps

- Agree on answers, or at least a direction, for open questions 1–3.
- Run the step 2 spike and measure latency in a production build.
