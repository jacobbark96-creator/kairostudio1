const fs = require('fs');

let content = fs.readFileSync('src/components/DeveloperTerminal.tsx', 'utf8');

// 1. Add imports
if (!content.includes('VaultRiddleModal')) {
  content = content.replace(
    "import { Terminal } from 'lucide-react';", 
    "import { Terminal } from 'lucide-react';\nimport VaultRiddleModal from './VaultRiddleModal';"
  );
}

// 2. Add state
if (!content.includes('showVaultRiddle')) {
  content = content.replace(
    "const { openContactModal } = useUI();",
    "const { openContactModal } = useUI();\n  const [showVaultRiddle, setShowVaultRiddle] = useState(false);"
  );
}

// 3. Add command to processCommand
const helpCmd = "    } else if (trimmed === 'help') {";
const newCmd = `    } else if (trimmed === 'showme --secrets' || trimmed === 'showme 0--secrets') {
      await simulateTyping([
        "WARNING: UNAUTHORIZED ACCESS DETECTED.",
        "Initiating lockdown protocol...",
      ]);
      setTimeout(() => {
        setShowVaultRiddle(true);
      }, 1000);\n`;

if (!content.includes('showme --secrets')) {
  content = content.replace(helpCmd, newCmd + helpCmd);
}

// 4. Add Modal to render
const returnStart = "return (\n    <motion.div";
if (content.includes(returnStart) && !content.includes('<VaultRiddleModal')) {
  content = content.replace(
    returnStart,
    "return (\n    <>\n      <VaultRiddleModal isOpen={showVaultRiddle} onClose={() => setShowVaultRiddle(false)} />\n      <motion.div"
  );
  content = content.replace(
    "    </motion.div>\n  );\n}",
    "    </motion.div>\n    </>\n  );\n}"
  );
}

fs.writeFileSync('src/components/DeveloperTerminal.tsx', content);
console.log('Modified Developer Terminal');