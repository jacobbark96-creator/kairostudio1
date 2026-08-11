const fs = require('fs');

let content = fs.readFileSync('src/page-components/AdminCRM.tsx', 'utf8');

// Replace the Featured Project checkbox with both checkboxes
const oldCheckboxStr = `              <div className="flex items-center gap-4">
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

const newCheckboxStr = `              <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
                <label className="flex items-center gap-3 cursor-pointer text-gray-900 dark:text-white">
                  <input
                    type="checkbox"
                    checked={projectForm.featured}
                    onChange={(e) => setProjectForm({...projectForm, featured: e.target.checked})}
                    className="rounded text-cyan-600 focus:ring-cyan-500 w-5 h-5 transition-all"
                  />
                  <span className="font-medium text-sm">Featured Project</span>
                </label>

                <label className="flex items-center gap-3 cursor-pointer text-gray-900 dark:text-white">
                  <input
                    type="checkbox"
                    checked={projectForm.show_in_marquee}
                    onChange={(e) => setProjectForm({...projectForm, show_in_marquee: e.target.checked})}
                    className="rounded text-purple-600 focus:ring-purple-500 w-5 h-5 transition-all"
                  />
                  <span className="font-medium text-sm">Show in Client Marquee</span>
                </label>
              </div>`;

if (content.includes(oldCheckboxStr)) {
  content = content.replace(oldCheckboxStr, newCheckboxStr);
} else {
  console.log("Could not find the featured checkbox block.");
}

// Add the Logo Image file input right below the Mobile Banner Image block
const mobileImageBlock = `              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Mobile Banner Image (1080x1350px)</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => e.target.files && setMobileProjectImage(e.target.files[0])}
                    className="w-full text-sm text-gray-500 dark:text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-cyan-50 file:text-cyan-700 hover:file:bg-cyan-100"
                  />
                  {editingProject?.mobile_image_url && !mobileProjectImage && (
                    <p className="text-xs text-gray-500 mt-1">Current mobile image: <a href={editingProject.mobile_image_url} target="_blank" rel="noreferrer" className="text-cyan-600 underline">View</a></p>
                  )}
                </div>
              </div>`;

const newLogoBlock = `

              <div className="grid grid-cols-1 gap-4 mt-4">
                <div className="p-4 border border-purple-100 dark:border-purple-900/30 bg-purple-50/50 dark:bg-purple-900/10 rounded-xl">
                  <label className="block text-sm font-semibold text-purple-900 dark:text-purple-300 mb-2">Client Logo (For Marquee)</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => e.target.files && setLogoImage(e.target.files[0])}
                    className="w-full text-sm text-gray-500 dark:text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-100 file:text-purple-700 hover:file:bg-purple-200 dark:file:bg-purple-900 dark:file:text-purple-200 transition-all cursor-pointer"
                  />
                  {editingProject?.logo_url && !logoImage && (
                    <div className="mt-3 flex items-center gap-3">
                      <img src={editingProject.logo_url} alt="Current logo" className="h-8 object-contain rounded bg-white/50 p-1" />
                      <p className="text-xs text-purple-600 dark:text-purple-400">Current logo: <a href={editingProject.logo_url} target="_blank" rel="noreferrer" className="underline font-medium hover:text-purple-800">View full size</a></p>
                    </div>
                  )}
                </div>
              </div>`;

if (content.includes(mobileImageBlock)) {
  content = content.replace(mobileImageBlock, mobileImageBlock + newLogoBlock);
} else {
  console.log("Could not find the mobile image block.");
}

fs.writeFileSync('src/page-components/AdminCRM.tsx', content);
console.log('AdminCRM UI updated successfully!');
