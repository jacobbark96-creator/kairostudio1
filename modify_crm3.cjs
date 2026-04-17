const fs = require('fs');
let content = fs.readFileSync('src/page-components/AdminCRM.tsx', 'utf8');

// 1. Add 'bali' to availablePermissionTabs
content = content.replace(
  "const availablePermissionTabs = ['invoices', 'users', 'content', 'portfolio', 'offers', 'pricing', 'careers', 'media', 'bookings', 'audit_qs', 'terms', 'franchise'];",
  "const availablePermissionTabs = ['invoices', 'users', 'content', 'portfolio', 'offers', 'pricing', 'careers', 'media', 'bookings', 'audit_qs', 'terms', 'franchise', 'bali'];"
);

// 2. Add Tab
const newTab = `
            <button
              onClick={() => setActiveTab('bali')}
              className={\`pb-4 px-4 whitespace-nowrap \${activeTab === 'bali' ? 'border-b-2 border-cyan-600 text-cyan-600' : 'text-gray-500'}\`}
            >
              Bali Easter Egg
            </button>`;

if (!content.includes("setActiveTab('bali')")) {
  content = content.replace(
    /onClick=\{\(\) => setActiveTab\('franchise'\)\}.*?Franchise\n\s*<\/button>/s,
    "$&" + newTab
  );
}

// 3. Add Panel
const newPanel = `
      {activeTab === 'bali' && (userRole === 'super_admin' || allowedTabs.includes('bali')) && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold dark:text-white">Bali Chatbot Questions (Easter Egg)</h2>
            <button onClick={handleAddBaliQuestion} className="px-4 py-2 bg-cyan-600 text-white rounded hover:bg-cyan-700">Add Question</button>
          </div>
          <div className="space-y-4">
            {baliQuestions.map((q) => (
              <div key={q.id} className="p-4 border border-gray-200 dark:border-gray-700 rounded relative">
                <button onClick={() => handleDeleteBaliQuestion(q.id)} className="absolute top-4 right-4 text-red-500">Delete</button>
                <div className="mb-2">
                  <label className="block text-sm mb-1 dark:text-white">Order Index</label>
                  <input type="number" value={q.order_index} onChange={e => setBaliQuestions(baliQuestions.map(bq => bq.id === q.id ? { ...bq, order_index: parseInt(e.target.value) } : bq))} className="border dark:border-gray-700 dark:bg-gray-900 dark:text-white p-2 rounded w-full max-w-[100px]" />
                </div>
                <div className="mb-2">
                  <label className="block text-sm mb-1 dark:text-white">Question Text</label>
                  <textarea value={q.question_text} onChange={e => setBaliQuestions(baliQuestions.map(bq => bq.id === q.id ? { ...bq, question_text: e.target.value } : bq))} className="border dark:border-gray-700 dark:bg-gray-900 dark:text-white p-2 rounded w-full h-24" />
                </div>
                <button onClick={() => handleSaveBaliQuestion(q)} className="px-4 py-2 bg-gray-900 dark:bg-white dark:text-black text-white rounded">Save Changes</button>
              </div>
            ))}
          </div>
        </div>
      )}
`;

if (!content.includes("activeTab === 'bali'")) {
  const lastTag = "</main>\n      </div>\n    </div>\n  );\n}";
  content = content.replace(lastTag, newPanel + "\n" + lastTag);
}

fs.writeFileSync('src/page-components/AdminCRM.tsx', content);
console.log('Modified AdminCRM third time');