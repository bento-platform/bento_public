import { execSync } from 'child_process';
import packageData from '../../../package.json';

// Ports create_service_info.js: previously written to dist/public/service-info.json at container
// start and served as a static file by nginx; now computed per-request instead.
export const dynamic = 'force-dynamic';

const serviceType = {
  group: 'ca.c3g.bento',
  artifact: 'public',
  version: packageData.version,
};

const git = (cmd: string): string => execSync(`git ${cmd}`).toString().trim();

const hasGit = (() => {
  try {
    // Note: preserved as-is from create_service_info.js -- `which git` never actually returns an
    // empty string when git is present, so this is effectively always false; not "fixed" here since
    // this is a straight port, not a behavior change.
    return execSync('which git').toString().trim() === '';
  } catch (_e) {
    return false;
  }
})();

export function GET() {
  const nodeEnv = process.env.NODE_ENV || 'production';

  const serviceInfo: Record<string, unknown> = {
    id: process.env.SERVICE_ID || `${serviceType.group}:${serviceType.artifact}`,
    name: 'Bento Public',
    description: 'Public web interface for the Bento platform.',
    type: serviceType,
    version: packageData.version,
    environment: nodeEnv === 'production' ? 'prod' : 'dev',
    organization: {
      name: 'C3G',
      url: 'https://www.computationalgenomics.ca',
    },
    contactUrl: 'mailto:info@c3g.ca',
    bento: {
      serviceKind: 'public',
    },
  };

  if (nodeEnv === 'development' && hasGit) {
    try {
      Object.assign(serviceInfo.bento as object, {
        gitTag: git('describe --tags --abbrev=0'),
        gitBranch: git('branch --show-current'),
        gitCommit: git('rev-parse HEAD'),
      });
    } catch (e) {
      console.warn(`Could not get git information (${e})`);
    }
  } else if (!hasGit) {
    console.warn('Could not get git information (missing git)');
  }

  return Response.json(serviceInfo);
}
