const fs = require('fs');

let content = fs.readFileSync('src/components/AboutPage.tsx', 'utf8');

// The bug "Rendered fewer hooks than expected" is because of the `{!isTerminalMode && (<> ... </>\n)}` wrapping.
// If `isTerminalMode` changes from false to true, React unmounts everything inside.
// Since we have `useMotionValue` and other hooks inside the mapping components, it throws error #300.
// The solution is to hide the bottom part of the page using CSS `display: none` instead of unmounting it from the React tree.

const targetStart = "{!isTerminalMode && (\n        <>";
const newStart = "<div className={isTerminalMode ? 'hidden' : 'block'}>";

if (content.includes(targetStart)) {
  content = content.replace(targetStart, newStart);
  content = content.replace("        </>\n      )", "        </div>");
}

// 2. Hide the Team module (Holographic Cards) for now
const teamMarker = "{/* 4.5 TEAM ROSTER (HOLOGRAPHIC CARDS) */}";
const teamEndMarker = "</section>";
const teamStartIndex = content.indexOf(teamMarker);

if (teamStartIndex !== -1) {
  const teamEndIndex = content.indexOf(teamEndMarker, teamStartIndex) + teamEndMarker.length;
  const teamSection = content.substring(teamStartIndex, teamEndIndex);
  
  if (!teamSection.includes('className="hidden"')) {
    content = content.replace(
      teamSection, 
      teamSection.replace('<section className="py-24 sm:py-32', '<section className="hidden py-24 sm:py-32')
    );
  }
}

fs.writeFileSync('src/components/AboutPage.tsx', content);
console.log('Fixed React Hook error and hid team module');
