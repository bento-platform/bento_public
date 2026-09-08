// Bento authorization-service permission strings. Ported from bento-auth-js: these are Bento domain constants, not
// part of the OIDC/session library, so they don't move with the rest of the auth stack to Auth.js.

export const queryProjectLevelBoolean = 'query:project_level_boolean';
export const queryDatasetLevelBoolean = 'query:dataset_level_boolean';

export const queryProjectLevelCounts = 'query:project_level_counts';
export const queryDatasetLevelCounts = 'query:dataset_level_counts';

export const queryData = 'query:data';
export const downloadData = 'download:data';
export const deleteData = 'delete:data';

export const ingestData = 'ingest:data';
export const analyzeData = 'analyze:data';
export const exportData = 'export:data';

export const viewRuns = 'view:runs';

export const viewNotifications = 'view:notifications';
export const createNotifications = 'create:notifications';

export const createProject = 'create:project';
export const editProject = 'edit:project';
export const deleteProject = 'delete:project';

export const createDataset = 'create:dataset';
export const deleteDataset = 'delete:dataset';
export const editDataset = 'edit:dataset';

export const viewPermissions = 'view:permissions';
export const editPermissions = 'edit:permissions';

export const viewDropBox = 'view:drop_box';
export const ingestDropBox = 'ingest:drop_box';
export const deleteDropBox = 'delete:drop_box';

export const ingestReferenceMaterial = 'ingest:reference_material';
export const deleteReferenceMaterial = 'delete:reference_material';
