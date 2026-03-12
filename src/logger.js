const fs = require('fs');
const path = require('path');
const chalk = require('chalk');

const LOG_FILE = path.join(process.cwd(), '.vibecheck', 'vibecheck.log');

function initLog() {
  const dir = path.dirname(LOG_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(LOG_FILE)) {
    fs.writeFileSync(LOG_FILE, '[]', 'utf8');
  }
}

function logDecision({ id, filePath, type, severity, plainEnglish, linesAdded, linesRemoved, decision, decidedBy }) {
  initLog();
  const currentLogs = JSON.parse(fs.readFileSync(LOG_FILE, 'utf8') || '[]');
  
  const entry = {
    id: id || `decision-${currentLogs.length + 1}`,
    timestamp: new Date().toISOString(),
    file: filePath,
    type,
    severity,
    plain_english: plainEnglish,
    lines_added: linesAdded || 0,
    lines_removed: linesRemoved || 0,
    decision,     // 'approved', 'rejected', etc
    decided_by: decidedBy // 'user', 'auto'
  };
  
  currentLogs.push(entry);
  fs.writeFileSync(LOG_FILE, JSON.stringify(currentLogs, null, 2), 'utf8');
  
  return entry;
}

function displayLog(options) {
  if (!fs.existsSync(LOG_FILE)) {
    console.log(chalk.red('No logs found. Start vibecheck first.'));
    return;
  }
  
  let logs = JSON.parse(fs.readFileSync(LOG_FILE, 'utf8'));
  
  if (options.today) {
    const today = new Date().toDateString(); // quick today check
    logs = logs.filter(l => new Date(l.timestamp).toDateString() === today);
  }
  
  if (options.rejected) {
    logs = logs.filter(l => l.decision === 'rejected');
  }
  
  console.log(chalk.bold('\n--- VibeCheck Decision Log ---\n'));
  
  logs.forEach(log => {
    const color = log.decision === 'approved' ? chalk.green : 
                  log.decision === 'rejected' ? chalk.red : chalk.yellow;
                  
    const sevColor = log.severity === 'CRITICAL' ? chalk.bgRed :
                     log.severity === 'HIGH' ? chalk.keyword('orange') : chalk.blue;

    console.log(`${color(log.id)} | ${log.timestamp} | ${sevColor(log.severity)}`);
    console.log(`File: ${log.file} | Action: ${log.type}`);
    console.log(`Msg:  ${log.plain_english}`);
    console.log(`Result: ${color(log.decision.toUpperCase())} by ${log.decided_by}`);
    console.log('-------------------------------------------');
  });
}

// Get all logs for summary
function getLogs() {
  if (!fs.existsSync(LOG_FILE)) return [];
  return JSON.parse(fs.readFileSync(LOG_FILE, 'utf8'));
}

module.exports = {
  logDecision,
  displayLog,
  getLogs
};
