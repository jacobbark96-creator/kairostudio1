const fs = require('fs');

let content = fs.readFileSync('src/page-components/AdminCRM.tsx', 'utf8');

// 1. Add logoImage state and update projectForm state
content = content.replace(
  "color: 'from-cyan-500 to-blue-600'\n  });",
  "color: 'from-cyan-500 to-blue-600',\n    show_in_marquee: false\n  });"
);
content = content.replace(
  "const [mobileProjectImage, setMobileProjectImage] = useState<File | null>(null);",
  "const [mobileProjectImage, setMobileProjectImage] = useState<File | null>(null);\n  const [logoImage, setLogoImage] = useState<File | null>(null);"
);

// 2. Update reset logic in handleSaveProject
content = content.replace(
  "color: 'from-cyan-500 to-blue-600'\n      });",
  "color: 'from-cyan-500 to-blue-600',\n        show_in_marquee: false\n      });"
);
content = content.replace(
  "setMobileProjectImage(null);\n      setEditingProject(null);",
  "setMobileProjectImage(null);\n      setLogoImage(null);\n      setEditingProject(null);"
);

// 3. Update cancel logic in UI
content = content.replace(
  "color: 'from-cyan-500 to-blue-600'\n                      });",
  "color: 'from-cyan-500 to-blue-600',\n                        show_in_marquee: false\n                      });"
);

// 4. Update handleSaveProject to upload logoImage
const handleSaveStart = "let mobileImageUrl = editingProject?.mobile_image_url;";
const logoUploadCode = `
      let logoUrl = editingProject?.logo_url;

      if (logoImage) {
        const fileExt = logoImage.name.split('.').pop();
        const fileName = \`logo_\${Math.random()}.\${fileExt}\`;
        const { error: uploadError } = await supabase.storage.from('portfolio').upload(fileName, logoImage);
        if (uploadError) throw uploadError;
        const { data: { publicUrl } } = supabase.storage.from('portfolio').getPublicUrl(fileName);
        logoUrl = publicUrl;
      }
`;
content = content.replace(handleSaveStart, handleSaveStart + logoUploadCode);

// 5. Update projectData object in handleSaveProject
content = content.replace(
  "mobile_image_url: mobileImageUrl",
  "mobile_image_url: mobileImageUrl,\n        logo_url: logoUrl,\n        show_in_marquee: projectForm.show_in_marquee"
);

// 6. Update startEditProject
content = content.replace(
  "color: project.color || 'from-cyan-500 to-blue-600'\n    });",
  "color: project.color || 'from-cyan-500 to-blue-600',\n      show_in_marquee: project.show_in_marquee || false\n    });"
);

// 7. Add UI fields in the form
const checkboxHtml = `
              <div className="flex gap-6 items-center bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                <label className="flex items-center gap-2 cursor-pointer text-gray-900 dark:text-white">
                  <input
                    type="checkbox"
                    checked={projectForm.featured}
                    onChange={(e) => setProjectForm({...projectForm, featured: e.target.checked})}
                    className="rounded text-cyan-600 focus:ring-cyan-500 w-5 h-5"
                  />
                  <span className="font-medium">Featured Project</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-gray-900 dark:text-white">
                  <input
                    type="checkbox"
                    checked={projectForm.show_in_marquee}
                    onChange={(e) => setProjectForm({...projectForm, show_in_marquee: e.target.checked})}
                    className="rounded text-purple-600 focus:ring-purple-500 w-5 h-5"
                  />
                  <span className="font-medium">Show in Client Marquee</span>
                </label>
              </div>
`;

// Replace the existing featured checkbox
const existingFeaturedHtml = `              <div className="flex items-center gap-2">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                  <input
                    type="checkbox"
                    checked={projectForm.featured}
                    onChange={(e) => setProjectForm({...projectForm, featured: e.target.checked})}
                    className="rounded text-cyan-600 focus:ring-cyan-500"
                  />
                  Featured Project
                </label>
              </div>`;

content = content.replace(existingFeaturedHtml, checkboxHtml);

// Add logo file input
const existingFileInputs = `                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Mobile Image (Optional)</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setMobileProjectImage(e.target.files?.[0] || null)}
                    className="w-full text-sm text-gray-500 dark:text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-cyan-50 file:text-cyan-700 hover:file:bg-cyan-100 dark:file:bg-gray-700 dark:file:text-white"
                  />
                </div>`;

const newFileInputs = existingFileInputs + `
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Client Logo (For Marquee)</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setLogoImage(e.target.files?.[0] || null)}
                    className="w-full text-sm text-gray-500 dark:text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100 dark:file:bg-gray-700 dark:file:text-white"
                  />
                </div>`;

content = content.replace(existingFileInputs, newFileInputs);

fs.writeFileSync('src/page-components/AdminCRM.tsx', content);
console.log('AdminCRM updated');
