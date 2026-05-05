const fs = require('fs');
const path = require('path');

function checkFile(filePath) {
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n');
    const imports = {};

    lines.forEach((line, index) => {
        const match = line.match(/import\s+{(.*)}\s+from\s+['"](.*)['"]/);
        if (match) {
            const symbols = match[1].split(',').map(s => s.trim().split(/\s+as\s+/)[0]);
            const source = match[2];
            if (!imports[source]) imports[source] = [];
            
            symbols.forEach(symbol => {
                if (symbol && imports[source].includes(symbol)) {
                    console.log(`Duplicate import found in ${filePath} at line ${index + 1}: ${symbol} from ${source}`);
                }
                imports[source].push(symbol);
            });
        }
    });
}

function walk(dir) {
    const files = fs.readdirSync(dir);
    files.forEach(file => {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            if (file !== 'node_modules' && file !== 'dist') walk(fullPath);
        } else if (file.endsWith('.jsx') || file.endsWith('.js')) {
            checkFile(fullPath);
        }
    });
}

walk('src');
