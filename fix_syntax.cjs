const fs = require('fs');
let content = fs.readFileSync('src/page-components/HomePage.tsx', 'utf8');
content = content.replace(/\{\{'\{'\}\{'\{'\}/g, '{"{{"}');
content = content.replace(/\{'\}'\}\{'\}'\}/g, '{"}}"}');
fs.writeFileSync('src/page-components/HomePage.tsx', content);
