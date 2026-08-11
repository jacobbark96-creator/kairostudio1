const fs = require('fs');

let content = fs.readFileSync('src/page-components/FranchisePage.tsx', 'utf8');

// 1. Add import
if (!content.includes('BaliChatbotModal')) {
  content = content.replace(
    "import SEO from '../components/SEO';",
    "import SEO from '../components/SEO';\nimport BaliChatbotModal from '../components/BaliChatbotModal';"
  );
}

// 2. Add state
if (!content.includes('showBaliChatbot')) {
  content = content.replace(
    "const [hoveredLocation, setHoveredLocation] = useState<any | null>(null);",
    "const [hoveredLocation, setHoveredLocation] = useState<any | null>(null);\n  const [showBaliChatbot, setShowBaliChatbot] = useState(false);"
  );
}

// 3. Add onClick to marker
content = content.replace(
  /className="cursor-pointer group relative flex items-center justify-center"\s*onMouseEnter=\{\(\) => setHoveredLocation\(loc\)\}\s*onMouseLeave=\{\(\) => setHoveredLocation\(null\)\}/g,
  `className="cursor-pointer group relative flex items-center justify-center"
                    onMouseEnter={() => setHoveredLocation(loc)}
                    onMouseLeave={() => setHoveredLocation(null)}
                    onClick={() => {
                      if (loc.city_name.toLowerCase() === 'bali') {
                        setShowBaliChatbot(true);
                      }
                    }}`
);

// 4. Add modal to render
if (content.includes('return (') && !content.includes('<BaliChatbotModal')) {
  content = content.replace(
    "return (\n    <main",
    "return (\n    <>\n      <BaliChatbotModal isOpen={showBaliChatbot} onClose={() => setShowBaliChatbot(false)} />\n      <main"
  );
  content = content.replace(
    "    </main>\n  );\n}",
    "    </main>\n    </>\n  );\n}"
  );
}

fs.writeFileSync('src/page-components/FranchisePage.tsx', content);
console.log('Modified FranchisePage');