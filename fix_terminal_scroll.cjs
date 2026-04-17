const fs = require('fs');

let content = fs.readFileSync('src/components/DeveloperTerminal.tsx', 'utf8');

// 1. Add scrollContainerRef
if (!content.includes('scrollContainerRef')) {
  content = content.replace(
    "const outputEndRef = useRef<HTMLDivElement>(null);",
    "const outputEndRef = useRef<HTMLDivElement>(null);\n  const scrollContainerRef = useRef<HTMLDivElement>(null);"
  );
}

// 2. Replace scrollIntoView logic
const oldEffect = `  // Auto scroll to bottom, but we want to prevent the browser from scrolling the whole page
  // when the terminal output updates.
  useEffect(() => {
    if (outputEndRef.current) {
      outputEndRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [outputLines]);`;

const newEffect = `  // Auto scroll to bottom safely without moving the browser window
  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
    }
  }, [outputLines, isTerminalMode]);`;

if (content.includes(oldEffect)) {
  content = content.replace(oldEffect, newEffect);
}

// 3. Add ref to the container and preventScroll on focus
const oldDiv = `        <div className="flex-1 px-4 py-2 overflow-y-auto custom-scrollbar flex flex-col relative" onClick={() => inputRef.current?.focus()}>`;
const newDiv = `        <div ref={scrollContainerRef} className="flex-1 px-4 py-2 overflow-y-auto custom-scrollbar flex flex-col relative" onClick={() => inputRef.current?.focus({ preventScroll: true })}>`;

if (content.includes(oldDiv)) {
  content = content.replace(oldDiv, newDiv);
}

// 4. Also prevent scroll on the focus in handleSubmit if there is one?
// handleSubmit doesn't call focus(). It just sets state.

// 5. Let's make sure the input itself doesn't cause scrolling when auto-focused by the browser
const oldInput = `<input
                ref={inputRef}
                type="text"`;
const newInput = `<input
                ref={inputRef}
                type="text"
                onFocus={(e) => {
                  // Additional protection to prevent browser scroll jumping when focused
                  e.target.scrollIntoView = () => {};
                }}`;

if (content.includes(oldInput) && !content.includes('onFocus={(e) => {')) {
  content = content.replace(oldInput, newInput);
}

fs.writeFileSync('src/components/DeveloperTerminal.tsx', content);
console.log('Fixed terminal scroll jumping');
