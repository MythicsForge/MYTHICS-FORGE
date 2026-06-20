const fs = require('fs');
const path = require('path');
const vm = require('vm');

const filePath = path.join(__dirname, 'dist', 'index.html');
if (!fs.existsSync(filePath)) {
  console.log("dist/index.html not found!");
  process.exit(1);
}

const html = fs.readFileSync(filePath, 'utf8');
const scriptRegex = /<script([^>]*)>([\s\S]*?)<\/script>/gi;
let match;
let count = 0;

while ((match = scriptRegex.exec(html)) !== null) {
  count++;
  const attrs = match[1];
  const code = match[2];
  
  if (attrs.includes('src') && !code.trim()) {
    console.log(`Script ${count}: External src script, skipping compilation check.`);
    continue;
  }
  
  console.log(`Script ${count}: Compiling code (length ${code.length})...`);
  try {
    new vm.Script(code);
    console.log(`✅ Script ${count}: Compiled successfully!`);
  } catch (err) {
    console.error(`❌ Script ${count} FAILED compilation!`);
    console.error("Error Message:", err.message);
    console.error("Stack:", err.stack);
    
    // Print the context around the syntax error
    // Line and Column of error can be extracted from err.stack if present
    const lines = code.split('\n');
    const matchLine = err.stack.match(/evalmachine\.<anonymous>:(\d+)/);
    if (matchLine) {
      const lineNum = parseInt(matchLine[1], 10);
      console.log(`Error near line ${lineNum}:`);
      for (let i = Math.max(0, lineNum - 5); i < Math.min(lines.length, lineNum + 5); i++) {
        console.log(`${i+1}: ${lines[i]}`);
      }
    } else {
      console.log("Error code snippet:", code.substring(0, 1000));
    }
  }
}
