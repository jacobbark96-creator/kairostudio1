const fs = require('fs');

let content = fs.readFileSync('src/components/AboutPage.tsx', 'utf8');

if (!content.includes('framer-motion')) {
  content = content.replace("import SEO from './SEO';", "import SEO from './SEO';\nimport { motion } from 'framer-motion';");
}

// 1. Wrap the Hero text
content = content.replace(
  '<div className="max-w-7xl mx-auto w-full relative z-10 text-center mt-16 sm:mt-0">',
  '<motion.div \n          initial={{ opacity: 0, y: 30 }}\n          animate={{ opacity: 1, y: 0 }}\n          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}\n          className="max-w-7xl mx-auto w-full relative z-10 text-center mt-16 sm:mt-0">'
);
content = content.replace(
  '          </p>\n        </div>\n      </section>',
  '          </p>\n        </motion.div>\n      </section>'
);

// 2. Wrap Stats Section
content = content.replace(
  '<div className="grid grid-cols-2 md:grid-cols-4 gap-8 sm:gap-12">',
  '<div className="grid grid-cols-2 md:grid-cols-4 gap-8 sm:gap-12">\n            <motion.div \n              initial="hidden"\n              whileInView="visible"\n              viewport={{ once: true }}\n              variants={{ visible: { transition: { staggerChildren: 0.1 } } }}\n              className="col-span-2 md:col-span-4 grid grid-cols-2 md:grid-cols-4 gap-8 sm:gap-12"\n            >'
);
content = content.replace(
  '              <div key={index} className="text-center group">',
  '              <motion.div \n                key={index} \n                variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}\n                transition={{ duration: 0.5 }}\n                className="text-center group"\n              >'
);
content = content.replace(
  '                </div>\n              </div>',
  '                </div>\n              </motion.div>'
);
content = content.replace(
  '            ))}\n          </div>\n        </div>',
  '            ))}\n            </motion.div>\n          </div>\n        </div>'
);

// 3. Wrap Story Section
content = content.replace(
  '<div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-start">',
  '<motion.div \n            initial={{ opacity: 0, y: 40 }}\n            whileInView={{ opacity: 1, y: 0 }}\n            viewport={{ once: true, margin: "-100px" }}\n            transition={{ duration: 0.8 }}\n            className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-start"\n          >'
);
content = content.replace(
  '                 </div>\n              </div>\n            </div>\n          </div>\n        </div>',
  '                 </div>\n              </div>\n            </div>\n          </motion.div>\n        </div>'
);

// 4. Wrap CTA Section
content = content.replace(
  '<div className="max-w-4xl mx-auto text-center relative z-10">',
  '<motion.div \n          initial={{ opacity: 0, scale: 0.95 }}\n          whileInView={{ opacity: 1, scale: 1 }}\n          viewport={{ once: true }}\n          transition={{ duration: 0.6 }}\n          className="max-w-4xl mx-auto text-center relative z-10"\n        >'
);
content = content.replace(
  '          </button>\n        </div>\n      </section>',
  '          </button>\n        </motion.div>\n      </section>'
);

fs.writeFileSync('src/components/AboutPage.tsx', content);
console.log('Done about');
