const chalk = require('chalk');
const boxen = require('boxen');
const { getLogs } = require('./logger');

function generateSummary() {
  const logs = getLogs();
  
  if (logs.length === 0) {
    console.log(chalk.yellow('No decisions logged yet.'));
    return;
  }
  
  const todayStr = new Date().toDateString();
  const sessionLogs = logs.filter(l => new Date(l.timestamp).toDateString() === todayStr);
  
  const approved = sessionLogs.filter(l => l.decision === 'approved').length;
  const rejected = sessionLogs.filter(l => l.decision === 'rejected').length;
  const total = approved + rejected;
  
  const approvedPercent = total === 0 ? 0 : Math.round((approved / total) * 100);
  const rejectedPercent = total === 0 ? 0 : Math.round((rejected / total) * 100);
  
  const filesTouched = new Set(sessionLogs.map(l => l.file)).size;
  const newFiles = sessionLogs.filter(l => l.type === 'add').length;
  const deletedFiles = sessionLogs.filter(l => l.type === 'unlink').length;
  
  const critical = sessionLogs.filter(l => l.severity === 'CRITICAL' && l.decision === 'rejected').length;
  const high = sessionLogs.filter(l => l.severity === 'HIGH' && l.decision === 'rejected').length;
  
  // Aggregate AI changes plain english for "What AI actually built"
  const buildItems = sessionLogs
    .filter(l => l.decision === 'approved' && ['LOW','MEDIUM','HIGH'].includes(l.severity))
    .slice(0, 5) // just show top 5
    .map(l => `  → ${l.plain_english.split('\n')[0]}`);

  let content = `  Total AI decisions:     ${total}\n`;
  content += `  You approved:           ${approved}  (${approvedPercent}%)\n`;
  content += `  You rejected:            ${rejected}  (${rejectedPercent}%)\n\n`;
  
  content += `  Files touched:          ${filesTouched}\n`;
  content += `  New files created:       ${newFiles}\n`;
  content += `  Files deleted:           ${deletedFiles}\n\n`;
  
  content += chalk.bold('  ⚠️  Risks caught:\n');
  content += `  → ${high} HIGH severity decisions rejected\n`;
  content += `  → ${critical} CRITICAL decisions rejected\n\n`;
  
  content += chalk.bold('  🧠 What AI actually built today:\n');
  if (buildItems.length > 0) {
    content += buildItems.join('\n');
  } else {
    content += `  → Started setting up the project structure`;
  }
  
  const formattedDate = new Date().toLocaleString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

  console.log(boxen(content, {
    title: chalk.bold(`  VibeCheck Session Summary\n  ${formattedDate}  `),
    padding: 1,
    borderStyle: 'none'
  }));
}

module.exports = {
  generateSummary
};
