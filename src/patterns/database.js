module.exports = [
  { match: /DROP\s+TABLE/i, severity: 'CRITICAL', message: "🚨 CRITICAL: AI is deleting an entire database table — PERMANENT" },
  { match: /DELETE\s+FROM/i, severity: 'CRITICAL', message: "🚨 CRITICAL: AI is deleting database records — CANNOT BE UNDONE" },
  { match: /ALTER\s+TABLE/i, severity: 'HIGH', message: "⚠️ HIGH: AI is changing your database structure" },
  { match: /CREATE\s+TABLE\s+([A-Za-z0-9_]+)/i, severity: 'LOW', message: match => `AI is creating a new database table called ${match[1]}` },
  { match: /INSERT\s+INTO\s+([A-Za-z0-9_]+)/i, severity: 'LOW', message: match => `AI is adding new data to your ${match[1]} table` },
];
