import fs from 'fs';

const filePath = 'src/page-components/HomePage.tsx';
let content = fs.readFileSync(filePath, 'utf8');

const startMarker = "              {/* MOBILE MODAL - Smooth Lightbox Transition */}";
const startIndex = content.indexOf(startMarker);

if (startIndex === -1) {
  console.log("Could not find start");
  process.exit(1);
}

// Find where the modal ends.
// The modal ends with 4 nested </div>s, followed by the 3 nested </div>s of the hero.
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

// Exact length of the modal content
const modalContentLength = (endIndex - startIndex) + endMarker.length;
let exactModalContent = content.substring(startIndex, startIndex + modalContentLength);

// Check if the next characters are the hero section's closing tags
const nextChars = content.substring(startIndex + modalContentLength, startIndex + modalContentLength + 100);
console.log("Next chars after modal:\n", nextChars);

// Remove the modal from the hero section
content = content.replace(exactModalContent, "");

// Modify the modal content
let newModalContent = exactModalContent
  .replace(/duration-700/g, "duration-200")
  .replace(/duration-500/g, "duration-200")
  .replace(/delay-100/g, "")
  .replace(/z-\[100\]/g, "z-[9999]")
  .replace(/z-\[110\]/g, "z-[10000]");

// Append the new modal content before the final </main> or </>
content = content.replace("    </>\n  );\n}", "\n" + newModalContent + "\n    </>\n  );\n}");

fs.writeFileSync(filePath, content, 'utf8');
console.log("Successfully moved modal safely!");
