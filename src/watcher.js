const chokidar = require('chokidar');
const chalk = require('chalk');
const boxen = require('boxen');
const path = require('path');

const { handleIntercept } = require('./interceptor');
const { initSnapshots } = require('./snapshot');
const { initConfig } = require('./config');
const fs = require('fs');

function getIgnoredPatterns() {
  const ignoreFile = path.join(process.cwd(), '.vibecheckignore');
  if (fs.existsSync(ignoreFile)) {
    return fs.readFileSync(ignoreFile, 'utf8')
      .split('\n')
      .map(line => line.trim())
      .filter(line => line && !line.startsWith('#'));
  }
  return [];
}

function startWatching() {
  console.log(chalk.blue('Initializing VibeCheck...'));
  initConfig();
  initSnapshots();
  console.log(chalk.green('Snapshots and config ready.'));

  console.log(boxen(
    chalk.bold('VibeCheck is watching your project\n') +
    'Every AI decision needs your OK \u2713',
    {
      padding: 1,
      margin: 1,
      borderStyle: 'round',
      borderColor: 'cyan'
    }
  ));

  const cwd = process.cwd();
  
  const watcher = chokidar.watch('.', {
    ignored: [
      /(^|[\/\\])\../, // ignore dotfiles
      '**/node_modules/**',
      '**/.git/**',
      '**/.vibecheck/**',
      '**/*.log',
      '**/dist/**',
      '**/build/**',
      ...getIgnoredPatterns()
    ],
    persistent: true,
    ignoreInitial: true
  });

  watcher
    .on('add', filePath => handleEvent('add', filePath))
    .on('change', filePath => handleEvent('change', filePath))
    .on('unlink', filePath => handleEvent('unlink', filePath));

  process.on('SIGINT', () => {
    console.log(chalk.yellow('\nStopping VibeCheck watcher...'));
    watcher.close();
    process.exit(0);
  });
}

function handleEvent(type, filePath) {
  handleIntercept(type, filePath).catch(err => {
    console.error(chalk.red(`Error processing ${type} on ${filePath}:`), err);
  });
}

module.exports = {
  startWatching
};
