#!/usr/bin/env node

const { Command } = require('commander');
const { startWatching } = require('../src/watcher');
const pkg = require('../package.json');
const chalk = require('chalk');

const program = new Command();

program
  .name('vibecheck')
  .description('A real-time checkpoint layer that intercepts every AI agent decision')
  .version(pkg.version);

program
  .command('start')
  .description('Start watching the project for AI changes')
  .action(() => {
    startWatching();
  });

program
  .command('log')
  .description('View decision log')
  .option('--today', 'View only today\'s decisions')
  .option('--rejected', 'View only rejected decisions')
  .action((options) => {
    const { displayLog } = require('../src/logger');
    displayLog(options);
  });

program
  .command('summary')
  .description('View session summary')
  .action(() => {
    const { generateSummary } = require('../src/summary');
    generateSummary();
  });

program
  .command('rollback [id]')
  .description('Rollback to before a decision')
  .option('--last', 'Undo the last approved decision')
  .option('--session', 'Restore entire project to state before this session started')
  .action((id, options) => {
    const { performRollback } = require('../src/rollback');
    performRollback(id, options);
  });

program.parse(process.argv);
