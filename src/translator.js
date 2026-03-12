const patterns = require('./patterns');

function translate(diffParts, filePath, eventType) {
  let highestSeverity = 'INFO';
  const severities = ['INFO', 'LOW', 'MEDIUM', 'HIGH', 'DANGER', 'CRITICAL'];
  const messages = [];

  const updateSeverity = (newSeverity) => {
    if (severities.indexOf(newSeverity) > severities.indexOf(highestSeverity)) {
      highestSeverity = newSeverity;
    }
  };

  // Special cases for files
  if (eventType === 'add') {
    messages.push(`AI is creating a new file: ${filePath}`);
    updateSeverity('LOW');
  } else if (eventType === 'unlink') {
    messages.push(`🚨 AI is deleting: ${filePath}`);
    updateSeverity('CRITICAL');
  }

  let linesAdded = 0;
  let linesRemoved = 0;

  // Process diff
  if (diffParts && Array.isArray(diffParts)) {
    diffParts.forEach(part => {
      if (!part.added && !part.removed) return; // Skip unchanged

      if (part.added) {
        linesAdded += (part.value.match(/\n/g) || []).length || 1;
      }
      if (part.removed) {
        linesRemoved += (part.value.match(/\n/g) || []).length || 1;
      }

      patterns.forEach(pattern => {
        // Evaluate condition if any
        if (pattern.condition) {
          const context = { file: filePath, added: part.added, removed: part.removed, value: part.value };
          if (!pattern.condition(context)) return;
        }

        const matches = part.value.match(pattern.match);
        if (matches) {
          updateSeverity(pattern.severity);
          const msg = typeof pattern.message === 'function' ? pattern.message(matches) : pattern.message;
          if (!messages.includes(msg)) {
            messages.push(msg);
          }
        }
      });
    });

    if (linesAdded > 20 || linesRemoved > 20) {
      const msg = `AI is making a large change to ${filePath} — ${linesAdded + linesRemoved} lines modified`;
      if (!messages.includes(msg)) messages.push(msg);
    }
  }

  // Fallback
  if (messages.length === 0 && eventType === 'change') {
    messages.push(`AI is making changes to ${filePath} — ${linesAdded} lines added, ${linesRemoved} lines removed`);
  }

  return {
    severity: highestSeverity,
    messages: messages,
    plainEnglish: messages.join('\n'),
    linesAdded,
    linesRemoved
  };
}

module.exports = {
  translate
};
