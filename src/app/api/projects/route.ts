// Deep imports: bento-auth-js's main entry also loads its React contexts, which call createContext at module load.
// That throws in the server React build used by Route Handlers. These two modules have no React dependency.
import {
  type Resource,
  RESOURCE_EVERYTHING,
  makeProjectDatasetDataTypeResource,
  makeProjectDatasetResource,
  makeProjectResource,
  makeResourceKey,
} from 'bento-auth-js/dist/resources';
import { makeAuthorizationHeader } from 'bento-auth-js/dist/utils';
import type { NextRequest } from 'next/server';
import { getServerAccessToken } from '@/auth';
import { AUTHZ_URL, KATSU_URL } from '@/env.server';
import type { ProjectsResponse, ProjectsWithPermissionsResponse } from '@/types/metadata';

/**
 * Every resource the frontend checks permissions on for the given projects (see useDatasetAccess and
 * useHasScopePermission): the whole node, each project, each dataset, and each dataset's experiment data type.
 */
const permissionResources = (projects: ProjectsResponse['results']): Resource[] => [
  RESOURCE_EVERYTHING,
  ...projects.flatMap((p) => [
    makeProjectResource(p.identifier),
    ...p.datasets.flatMap((d) => [
      makeProjectDatasetResource(p.identifier, d.identifier),
      makeProjectDatasetDataTypeResource(p.identifier, d.identifier, 'experiment'),
    ]),
  ]),
];

const fetchPermissions = async (
  resources: Resource[],
  authHeader: Record<string, string>
): Promise<Record<string, string[]>> => {
  const res = await fetch(`${AUTHZ_URL}/policy/permissions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeader },
    body: JSON.stringify({ resources }),
  });
  if (!res.ok) throw new Error(`Authorization service responded with ${res.status}`);
  const { result } = (await res.json()) as { result: string[][] };
  return Object.fromEntries(resources.map((r, i) => [makeResourceKey(r), result?.[i] ?? []]));
};

/**
 * Lists projects from Katsu along with the user's permissions on them, as a flat map keyed by makeResourceKey.
 * The access token is read from the session cookie on the server, as in the BFF proxy (see getServerAccessToken).
 */
export async function GET(request: NextRequest) {
  if (!KATSU_URL || !AUTHZ_URL) {
    console.error('KATSU_URL and BENTO_AUTHZ_SERVICE_URL must be set to list projects');
    return Response.json({ message: 'Projects endpoint is not configured' }, { status: 500 });
  }

  const authHeader = makeAuthorizationHeader(await getServerAccessToken(request));
  const acceptLanguage = request.headers.get('Accept-Language');

  const katsuRes = await fetch(`${KATSU_URL}/api/projects`, {
    headers: { ...authHeader, ...(acceptLanguage ? { 'Accept-Language': acceptLanguage } : {}) },
  });
  if (!katsuRes.ok) {
    console.error(`Katsu responded with ${katsuRes.status} when listing projects`);
    return Response.json({ message: 'Could not fetch projects' }, { status: katsuRes.status });
  }
  const projects = (await katsuRes.json()) as ProjectsResponse;

  // Projects are still useful without permissions: on authz failure, the frontend falls back to checking per resource.
  let permissions: Record<string, string[]> = {};
  let permissionsError: string | undefined;
  try {
    permissions = await fetchPermissions(permissionResources(projects.results ?? []), authHeader);
  } catch (err) {
    console.error('Error fetching project permissions', err);
    permissionsError = 'Could not fetch permissions';
  }

  const body: ProjectsWithPermissionsResponse = { ...projects, permissions, permissionsError };
  return Response.json(body);
}
