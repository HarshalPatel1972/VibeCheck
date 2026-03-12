module.exports = [
  { match: /eval\(/, severity: 'DANGER', message: "🚨 DANGER: AI is using eval() — major security risk" },
  { match: /\.innerHTML/, severity: 'HIGH', message: "⚠️ HIGH: AI is using innerHTML — potential XSS vulnerability" },
  { match: /localStorage/, severity: 'MEDIUM', message: "MEDIUM: AI is storing data in browser localStorage — clears when user resets browser" },
  { match: /md5\(/, severity: 'HIGH', message: "⚠️ HIGH: AI is using MD5 for hashing — this is not secure for passwords" },
  { match: /http:\/\//, severity: 'MEDIUM', message: "MEDIUM: AI is using HTTP instead of HTTPS — data is not encrypted" }
];
