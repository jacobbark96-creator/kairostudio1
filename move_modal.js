import fs from 'fs';

const filePath = 'src/page-components/HomePage.tsx';
let content = fs.readFileSync(filePath, 'utf8');

// The exact modal string starting from the comment
const startMarker = "              {/* MOBILE MODAL - Smooth Lightbox Transition */}";
const startIndex = content.indexOf(startMarker);

// Find the end by looking for the sequence of 4 closing divs before the hero's grid column closing div
const endMarker = `                      )}
                    </div>
                  </div>
                </div>
              </div>`;

const endIndex = content.indexOf(endMarker, startIndex);
if (endIndex === -1) {
  console.log("Could not find end marker");
  process.exit(1);
}

// Extract exactly the modal
const exactModalContent = content.substring(startIndex, endIndex + endMarker.length);

// Remove the modal from the hero section
content = content.replace(exactModalContent, "");

// Make the modal snappier and fix z-index
let newModalContent = exactModalContent
  .replace(/duration-700/g, "duration-200")
  .replace(/duration-500/g, "duration-200")
  .replace(/delay-100/g, "")
  .replace(/z-\[100\]/g, "z-[9999]")
  .replace(/z-\[110\]/g, "z-[10000]");

// Append the new modal content before the final </main> or </>
content = content.replace("    </>\n  );\n}", "\n" + newModalContent + "\n    </>\n  );\n}");

fs.writeFileSync(filePath, content, 'utf8');
console.log("Successfully moved modal!");
