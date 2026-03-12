const fs = require('fs');
const diff = require('diff');
const { readSnapshot, createSnapshot, restoreFromSnapshot } = require('./snapshot');

// Will be implemented in Phase 3 & 4
// const { translate } = require('./translator');
// const { askApproval } = require('./gate');

async function handleIntercept(type, filePath) {
  // During Phase 2, we just mock the gate to always approve for now, 
  // or log the diff to console.
  
  if (type === 'change') {
    const oldContent = readSnapshot(filePath, 'latest') || '';
    const newContent = fs.readFileSync(filePath, 'utf8');
    
    const patch = diff.createTwoFilesPatch(
      filePath, 
      filePath, 
      oldContent, 
      newContent,
      'Old',
      'New'
    );
    
    console.log(`\n[Interceptor] Changed file: ${filePath}`);
    console.log(patch);
    
    // Mock approval
    createSnapshot(filePath, 'latest');
  } 
  else if (type === 'add') {
    const newContent = fs.readFileSync(filePath, 'utf8');
    const firstLines = newContent.split('\n').slice(0, 20).join('\n');
    console.log(`\n[Interceptor] New file: ${filePath}\nPreview:\n${firstLines}`);
    
    // Mock approval
    createSnapshot(filePath, 'latest');
  }
  else if (type === 'unlink') {
    const oldContent = readSnapshot(filePath, 'latest') || '';
    console.log(`\n[Interceptor] Deleted file: ${filePath}\nLast known content length: ${oldContent.length} chars`);
    
    // Mock approval (do nothing so file stays deleted, but in real case we would restore if rejected)
  }
}

module.exports = {
  handleIntercept
};
