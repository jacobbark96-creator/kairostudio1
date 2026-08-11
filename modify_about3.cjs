const fs = require('fs');

let content = fs.readFileSync('src/components/AboutPage.tsx', 'utf8');

// 1. Add import
if (!content.includes('CorePrinciplesDeck')) {
  content = content.replace("import HolographicCard from './HolographicCard';", "import HolographicCard from './HolographicCard';\nimport CorePrinciplesDeck from './CorePrinciplesDeck';");
}

// 2. Replace old X-RAY BENTO CORE VALUES section
const oldStartMarker = "{/* 4. X-RAY BENTO CORE VALUES */}";
const oldEndMarker = "      </section>";
let oldStartIndex = content.indexOf(oldStartMarker);

if (oldStartIndex !== -1) {
  // Find the closing section tag that corresponds to this section
  let oldEndIndex = content.indexOf(oldEndMarker, oldStartIndex) + oldEndMarker.length;
  
  const newSection = `{/* 4. CORE PRINCIPLES (STICKY CARD DECK) */}
      <CorePrinciplesDeck />`;

  content = content.substring(0, oldStartIndex) + newSection + content.substring(oldEndIndex);
}

// 3. Remove the old values array if it exists
const valuesStart = "const values = [";
const valuesEnd = "];\n";
const valIndex = content.indexOf(valuesStart);
if(valIndex !== -1) {
    const valEndIndex = content.indexOf(valuesEnd, valIndex) + valuesEnd.length;
    content = content.substring(0, valIndex) + content.substring(valEndIndex);
}

fs.writeFileSync('src/components/AboutPage.tsx', content);
console.log('AboutPage updated with CorePrinciplesDeck');
