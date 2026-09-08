// Bento authorization-service resource shapes. Ported from bento-auth-js: these describe what's being asked
// permission for (a project, a dataset, "everything"), which is Bento's own authz contract, not an Auth.js concern.

/**
 * Resources are expressed as simple key-value pairs.
 * Where the key is always a string identifying the resource type,
 * and the value is either a string identifying the resource ID,
 * or a boolean for everything.
 *
 * e.g. The resource for a project with ID "project-1" would be expressed as:
 * { "project": "project-1" }
 */
export type Resource = { everything: true } | { project: string; dataset?: string; data_type?: string };

export const RESOURCE_EVERYTHING: Resource = { everything: true };

export const makeProjectResource = (projectId: string): Resource => {
  return {
    project: projectId,
  };
};

export const makeProjectDataTypeResource = (projectId: string, dataType: string): Resource => {
  return {
    ...makeProjectResource(projectId),
    data_type: dataType,
  };
};

export const makeProjectDatasetResource = (projectId: string, datasetId: string): Resource => {
  return {
    ...makeProjectResource(projectId),
    dataset: datasetId,
  };
};

export const makeProjectDatasetDataTypeResource = (
  projectId: string,
  datasetId: string,
  dataType: string
): Resource => {
  return {
    ...makeProjectDatasetResource(projectId, datasetId),
    data_type: dataType,
  };
};

// Recursively sorts an object's keys (without touching array order) so two structurally-equal resources always
// serialize to the same string, regardless of property insertion order.
const recursiveOrderedObject = (x: unknown): unknown => {
  if (Array.isArray(x)) {
    return x.map((y) => recursiveOrderedObject(y));
  } else if (typeof x === 'object' && x !== null) {
    return Object.keys(x)
      .sort()
      .reduce<Record<string, unknown>>((acc, y) => {
        acc[y] = (x as Record<string, unknown>)[y];
        return acc;
      }, {});
  } else {
    return x;
  }
};

export const makeResourceKey = (x: Resource): string => JSON.stringify(recursiveOrderedObject(x));
