const chokidar = require('chokidar');
const chalk = require('chalk');
const boxen = require('boxen');
const path = require('path');

function startWatching() {
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
      '**/build/**'
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
  // Pass to interceptor (to be implemented in Phase 2)
  console.log(chalk.gray(`Detected ${type} on ${filePath}`));
}

module.exports = {
  startWatching
};
