/* eslint-disable @typescript-eslint/no-var-requires */
const childProcess = require('child_process');
const packageData = require('./package.json');

const nodeEnv = process.env.NODE_ENV || 'production';

const serviceType = {
  group: 'ca.c3g.bento',
  artifact: 'public',
  version: packageData.version,
};

const serviceID = process.env.SERVICE_ID || `${serviceType.group}:${serviceType.artifact}`;

const serviceInfo = {
  id: serviceID,
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

const hasGit = (() => {
  try {
    return childProcess.execSync('which git').toString().trim() === '';
  } catch (_e) {
    // Exit code 1 (git not found)
    return false;
  }
})();
const git = (cmd) => childProcess.execSync(`git ${cmd}`).toString().trim();
if (nodeEnv === 'development' && hasGit) {
  try {
    serviceInfo.bento.gitTag = git('describe --tags --abbrev=0');
    serviceInfo.bento.gitBranch = git('branch --show-current');
    serviceInfo.bento.gitCommit = git('rev-parse HEAD');
  } catch (e) {
    console.warn(`Could not get git information (${e})`);
  }
} else if (!hasGit) {
  console.warn('Could not get git information (missing git)');
}

if (typeof require !== 'undefined' && require.main === module) {
  console.log(JSON.stringify(serviceInfo, null, 2));
}

module.exports = {
  serviceInfo,
};
