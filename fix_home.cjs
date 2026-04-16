const fs = require('fs');

function fixHomePage() {
  const filePath = 'src/page-components/HomePage.tsx';
  let content = fs.readFileSync(filePath, 'utf8');

  const startMarker = "              {/* MOBILE MODAL - Smooth Lightbox Transition */}";
  const startIndex = content.indexOf(startMarker);
  
  if (startIndex === -1) {
    console.error("Markers not found");
    return;
  }

  // Find the exact end
  const modalEndMarker = "              </div>\n            </div>\n          </div>\n        </div>\n      </section>";
  const indexOfModalEnd = content.indexOf(modalEndMarker, startIndex);
  
  if (indexOfModalEnd === -1) {
    console.error("Could not find exact modal end");
    return;
  }

  // We want to cut out from startIndex up to `              </div>\n`
  const modalContent = content.substring(startIndex, indexOfModalEnd + "              </div>\n".length);

  // Remove the modal from its original place
  content = content.replace(modalContent, "");

  // Modify the modal content to make it snappier and fix z-index
  let newModalContent = modalContent
    .replace(/duration-700/g, "duration-200")
    .replace(/duration-500/g, "duration-200")
    .replace(/delay-100/g, "")
    .replace(/z-\[100\]/g, "z-[9999]")
    .replace(/z-\[110\]/g, "z-[10000]");

  // Insert the modal right before `</>`
  content = content.replace("    </>\n  );\n}", newModalContent + "\n    </>\n  );\n}");

  fs.writeFileSync(filePath, content, 'utf8');
  console.log("HomePage fixed");
}

fixHomePage();
