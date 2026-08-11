const fs = require('fs');

let content = fs.readFileSync('src/page-components/HomePage.tsx', 'utf8');

// 1. Add import
if (!content.includes('CodeToCanvas')) {
  content = content.replace("import { CheckCircle2 } from 'lucide-react';", "import { CheckCircle2 } from 'lucide-react';\nimport CodeToCanvas from '../components/CodeToCanvas';");
}

// 2. Replace old Code-to-Canvas section
const oldStartMarker = "{/* Code-to-Canvas Interactive Section */}";
const oldEndMarker = "      </section>";
let oldStartIndex = content.indexOf(oldStartMarker);

if (oldStartIndex !== -1) {
  // Find the closing section tag that corresponds to this section
  let oldEndIndex = content.indexOf(oldEndMarker, oldStartIndex) + oldEndMarker.length;
  
  const newSection = `{/* Code-to-Canvas Interactive Section */}
      <CodeToCanvas />`;

  content = content.substring(0, oldStartIndex) + newSection + content.substring(oldEndIndex);
}

fs.writeFileSync('src/page-components/HomePage.tsx', content);
console.log('HomePage updated with CodeToCanvas');
