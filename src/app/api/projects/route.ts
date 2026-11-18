import {
  type Resource,
  RESOURCE_EVERYTHING,
  makeProjectDatasetDataTypeResource,
  makeProjectDatasetResource,
  makeProjectResource,
  makeResourceKey,
} from 'bento-auth-js';
import type { NextRequest } from 'next/server';
import { AUTHZ_URL, KATSU_URL, PUBLIC_CONFIG } from '@/env.server';
import type { ProjectsResponse, ProjectsWithPermissionsResponse } from '@/types/metadata';
import { makeUpstreamHeaders } from '@/utils/upstream';

/**
 * Every resource the frontend checks permissions on for the given projects (see useDatasetAccess and
 * useHasScopePermission): the whole node, each project, each dataset, and, in PCGL mode only, each dataset's
 * experiment data type. If the dev settings turn PCGL mode on in the browser only, the frontend checks the experiment
 * resources one by one instead.
 */
const permissionResources = (projects: ProjectsResponse['results']): Resource[] => [
  RESOURCE_EVERYTHING,
  ...projects.flatMap((p) => [
    makeProjectResource(p.identifier),
    ...p.datasets.flatMap((d) => [
      makeProjectDatasetResource(p.identifier, d.identifier),
      ...(PUBLIC_CONFIG.PCGL_MODE
        ? [makeProjectDatasetDataTypeResource(p.identifier, d.identifier, 'experiment')]
        : []),
    ]),
  ]),
];

// The response depends on the user's session, so shared caches must never store it.
const json = (body: unknown, status = 200) => Response.json(body, { status, headers: { 'Cache-Control': 'no-store' } });

const fetchPermissions = async (resources: Resource[], upstreamHeaders: Headers): Promise<Record<string, string[]>> => {
  const headers = new Headers(upstreamHeaders);
  headers.set('Content-Type', 'application/json');
  const res = await fetch(`${AUTHZ_URL}/policy/permissions`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ resources }),
  });
  if (!res.ok) throw new Error(`Authorization service responded with ${res.status}`);
  const { result } = (await res.json()) as { result: string[][] };
  return Object.fromEntries(resources.map((r, i) => [makeResourceKey(r), result?.[i] ?? []]));
};

/**
 * Lists projects from Katsu along with the user's permissions on them, as a flat map keyed by makeResourceKey.
 * The access token is read from the session cookie on the server (see makeUpstreamHeaders).
 */
export async function GET(request: NextRequest) {
  if (!KATSU_URL || !AUTHZ_URL) {
    console.error('KATSU_URL and BENTO_AUTHZ_SERVICE_URL must be set to list projects');
    return json({ message: 'Projects endpoint is not configured' }, 500);
  }

  const upstreamHeaders = await makeUpstreamHeaders(request);

  const katsuRes = await fetch(`${KATSU_URL}/api/projects`, { headers: upstreamHeaders });
  if (!katsuRes.ok) {
    console.error(`Katsu responded with ${katsuRes.status} when listing projects`);
    return json({ message: 'Could not fetch projects' }, katsuRes.status);
  }
  const projects = (await katsuRes.json()) as ProjectsResponse;

  // Projects are still useful without permissions: on authz failure, the frontend falls back to checking per resource.
  let permissions: Record<string, string[]> = {};
  let permissionsError: string | undefined;
  try {
    permissions = await fetchPermissions(permissionResources(projects.results ?? []), upstreamHeaders);
  } catch (err) {
    console.error('Error fetching project permissions', err);
    permissionsError = 'Could not fetch permissions';
  }

  const body: ProjectsWithPermissionsResponse = { ...projects, permissions, permissionsError };
  return json(body);
}
