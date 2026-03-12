module.exports = [
  // These require specialized handling in the translator (e.g. knowing file additions or functions)
  // We'll define simple string patterns but catch complex ones in logic
  { match: /function\s+([a-zA-Z0-9_]+)/, severity: 'LOW', message: match => `AI is adding a new function called ${match[1]}` },
  { match: /import\s+.*from\s+['"]([^'"]+)['"]/, severity: 'LOW', message: match => `AI is importing ${match[1]} into file` },
  { match: /require\(['"]([^'"]+)['"]\)/, severity: 'LOW', message: match => `AI is requiring ${match[1]} into file` },
  { match: /\/\/.*/, severity: 'INFO', message: "AI is adding a comment" }
];
