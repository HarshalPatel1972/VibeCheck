const fs = require('fs');
const path = require('path');
const { globSync } = require('glob');

const VIBECHECK_DIR = path.join(process.cwd(), '.vibecheck');
const SNAPSHOTS_DIR = path.join(VIBECHECK_DIR, 'snapshots');

function initSnapshots() {
  if (!fs.existsSync(VIBECHECK_DIR)) {
    fs.mkdirSync(VIBECHECK_DIR, { recursive: true });
  }
  if (!fs.existsSync(SNAPSHOTS_DIR)) {
    fs.mkdirSync(SNAPSHOTS_DIR, { recursive: true });
  }

  // Snapshot the current state of all files
  const files = globSync('**/*', {
    ignore: [
      '**/node_modules/**',
      '**/.git/**',
      '**/.vibecheck/**',
      '**/*.log',
      '**/dist/**',
      '**/build/**'
    ],
    nodir: true,
    dot: true
  });

  files.forEach(file => {
    createSnapshot(file, 'latest');
  });
}

function getSnapshotPath(filePath, decisionId = 'latest') {
  const safeFilename = filePath.replace(/[\/\\]/g, '_');
  return path.join(SNAPSHOTS_DIR, `${safeFilename}.${decisionId}.snap`);
}

function createSnapshot(filePath, decisionId = 'latest') {
  const absolutePath = path.resolve(filePath);
  if (!fs.existsSync(absolutePath)) return false;
  
  const snapshotPath = getSnapshotPath(filePath, decisionId);
  fs.copyFileSync(absolutePath, snapshotPath);
  return snapshotPath;
}

function readSnapshot(filePath, decisionId = 'latest') {
  const snapshotPath = getSnapshotPath(filePath, decisionId);
  if (fs.existsSync(snapshotPath)) {
    return fs.readFileSync(snapshotPath, 'utf8');
  }
  return null;
}

function restoreFromSnapshot(filePath, decisionId = 'latest') {
  const snapshotPath = getSnapshotPath(filePath, decisionId);
  if (fs.existsSync(snapshotPath)) {
    const absolutePath = path.resolve(filePath);
    fs.copyFileSync(snapshotPath, absolutePath);
    return true;
  }
  return false;
}

function removeSnapshot(filePath, decisionId = 'latest') {
  const snapshotPath = getSnapshotPath(filePath, decisionId);
  if (fs.existsSync(snapshotPath)) {
    fs.unlinkSync(snapshotPath);
  }
}

module.exports = {
  initSnapshots,
  createSnapshot,
  readSnapshot,
  restoreFromSnapshot,
  removeSnapshot,
  getSnapshotPath
};
