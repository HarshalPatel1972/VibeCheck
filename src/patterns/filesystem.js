module.exports = [
  { match: /fs\.writeFile/, severity: 'LOW', message: "AI is writing a new file to your system" },
  { match: /fs\.unlinkSync|fs\.unlink/, severity: 'CRITICAL', message: "🚨 CRITICAL: AI is permanently deleting a file" },
  { match: /fs\.rmdir|fs\.rm/, severity: 'CRITICAL', message: "🚨 CRITICAL: AI is deleting a folder" },
  { match: /fs\.readFile/, severity: 'LOW', message: "AI is reading a file from your system" }
];
