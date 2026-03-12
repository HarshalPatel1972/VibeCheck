const fs = require('fs');
const diff = require('diff');
const { readSnapshot, createSnapshot, restoreFromSnapshot } = require('./snapshot');
const { translate } = require('./translator');
const { askApproval } = require('./gate');

// Process changes synchronously by queueing them
const queue = [];
let isProcessing = false;

async function handleIntercept(type, filePath) {
  queue.push({ type, filePath });
  if (!isProcessing) {
    isProcessing = true;
    while (queue.length > 0) {
      const task = queue.shift();
      await processIntercept(task.type, task.filePath);
    }
    isProcessing = false;
  }
}

async function processIntercept(type, filePath) {
  if (type === 'change') {
    const oldContent = readSnapshot(filePath, 'latest') || '';
    const newContent = fs.readFileSync(filePath, 'utf8');
    
    const patchParts = diff.diffLines(oldContent, newContent);
    const translation = translate(patchParts, filePath, type);
    
    // Snippet for UI
    let snippet = '';
    patchParts.forEach(part => {
      if (part.added) snippet += `+ ${part.value}`;
      if (part.removed) snippet += `- ${part.value}`;
    });
    // Truncate snippet if too long
    if (snippet.length > 500) snippet = snippet.substring(0, 500) + '...\n(diff truncated)';

    const decision = await askApproval(translation, filePath, snippet.trim());
    
    if (decision === 'approve' || decision === 'approved_auto') {
      createSnapshot(filePath, 'latest');
    } else {
      // Reject: write old content back immediately
      fs.writeFileSync(filePath, oldContent, 'utf8');
    }
  } 
  else if (type === 'add') {
    const newContent = fs.readFileSync(filePath, 'utf8');
    const firstLines = newContent.split('\n').slice(0, 10).join('\n');
    
    const patchParts = diff.diffLines('', newContent);
    const translation = translate(patchParts, filePath, type);
    
    const decision = await askApproval(translation, filePath, `+ ${firstLines}`);
    
    if (decision === 'approve' || decision === 'approved_auto') {
      createSnapshot(filePath, 'latest');
    } else {
      fs.unlinkSync(filePath);
    }
  }
  else if (type === 'unlink') {
    const oldContent = readSnapshot(filePath, 'latest') || '';
    const patchParts = diff.diffLines(oldContent, '');
    const translation = translate(patchParts, filePath, type);
    
    const decision = await askApproval(translation, filePath, `- (file deleted)`);
    
    if (decision === 'approve' || decision === 'approved_auto') {
      // It's already deleted from disk, just remove snapshot
      // Wait, we need a removeSnapshot tool? Let's assume snapshot stays as backup
    } else {
      // Restore
      fs.writeFileSync(filePath, oldContent, 'utf8');
    }
  }
}

module.exports = {
  handleIntercept
};
