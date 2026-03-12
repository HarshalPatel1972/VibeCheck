const fs = require('fs');
const path = require('path');

const CONFIG_PATH = path.join(process.cwd(), '.vibecheck', 'config.json');

const DEFAULT_CONFIG = {
  autoApproveThreshold: ['INFO', 'LOW'],
  ignoredPatterns: [],
  severityOverrides: {}
};

function getConfig() {
  if (fs.existsSync(CONFIG_PATH)) {
    try {
      const userConfig = JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf8'));
      return { ...DEFAULT_CONFIG, ...userConfig };
    } catch (e) {
      return DEFAULT_CONFIG;
    }
  }
  return DEFAULT_CONFIG;
}

function initConfig() {
  const dir = path.dirname(CONFIG_PATH);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(CONFIG_PATH)) {
    fs.writeFileSync(CONFIG_PATH, JSON.stringify(DEFAULT_CONFIG, null, 2), 'utf8');
  }
}

module.exports = {
  getConfig,
  initConfig
};
