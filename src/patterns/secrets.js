module.exports = [
  { match: /\.env/, severity: 'DANGER', message: "⚠️ DANGER: AI is touching your secrets/environment file" },
  { match: /process\.env\.([A-Za-z0-9_]+)/, severity: 'MEDIUM', message: match => `MEDIUM: AI is reading an environment variable: ${match[1]}` },
  { match: /process\.env/, severity: 'MEDIUM', message: "MEDIUM: AI is reading an environment variable" },
  { match: /API_KEY/i, severity: 'HIGH', message: "⚠️ HIGH: AI is working with an API key" },
  { match: /password/i, severity: 'HIGH', message: "⚠️ HIGH: AI is working with a password field" },
  { match: /private_key/i, severity: 'CRITICAL', message: "🚨 CRITICAL: AI is touching a private key" }
];
