module.exports = [
  { match: /"([^"]+)":\s*"\^?[0-9]/, condition: (diffObj) => diffObj.file && diffObj.file.includes('package.json') && diffObj.added, severity: 'MEDIUM', message: match => `AI is adding ${match[1]} to your project` },
  { match: /"([^"]+)":\s*"\^?[0-9]/, condition: (diffObj) => diffObj.file && diffObj.file.includes('package.json') && diffObj.removed, severity: 'MEDIUM', message: match => `AI is removing ${match[1]} — make sure nothing depends on it` },
];
