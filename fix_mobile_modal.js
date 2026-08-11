const fs = require('fs');

let content = fs.readFileSync('src/page-components/HomePage.tsx', 'utf8');

const startMarker = "              {/* MOBILE MODAL - Smooth Lightbox Transition */}";
const endMarker = "      </section>\n\n      <section className=\"py-16 sm:py-32 px-4 sm:px-6 lg:px-8 relative overflow-hidden block md:hidden\">";

const startIndex = content.indexOf(startMarker);
const endIndex = content.indexOf(endMarker);

if (startIndex !== -1 && endIndex !== -1) {
  // The actual end of the modal is the `</div>` before `</section>`
  // Let's find the closing `</div>` of the modal.
  // We can just take the substring, split by '\n', and keep track of bracket balance?
  // Easier: The modal is currently just inside the hero section, so it's placed right before `</div>\n          </div>\n        </div>\n      </section>`.
  
  // Let's look closely at the text.
  let textToExtract = content.substring(sconst fs = require('fs');

let content = fs.read c
let content = fs.readFileSync(: