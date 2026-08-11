const fs = require('fs');
let css = fs.readFileSync('src/index.css', 'utf8');

if (!css.includes('gradient-shift')) {
  const keyframes = `
@keyframes gradient-shift {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}
`;
  fs.writeFileSync('src/index.css', css + keyframes);
  console.log("Added gradient-shift keyframes");
}
