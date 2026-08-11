const fs = require('fs');
let content = fs.readFileSync('src/page-components/AdminCRM.tsx', 'utf8');

// 4. Add Tab
const newTab = `
            <button 
              onClick={() => setActiveTab('bali')}
              className={\`pb-4 px-4 whitespace-nowrap \${activeTab === 'bali' ? 'border-b-2 border-cyan-600 text-cyan-600' : 'text-gray-500'}\`}
            >
              Bali Easter Egg
            </button>`;

if (!content.includes("setActiveTab('bali')")) {
  const franchiseBtn = `onClick={() => setActiveTab('franchise')}
              className={\`pb-4 px-4 whitespace-nowrap \${activeTab === 'franchise' ? 'border-b-2 border-cyan-600 text-cyan-600' : 'text-gray-500'}\`}
            >
              Franchise Map
            </button>`;
  
  if (content.includes(franchiseBtn)) {
    content = content.replace(franchiseBtn, franchiseBtn + newTab);
  }
}

// 5. Add Panel
const newPanel = `
      {activeTab === 'bali' && (userRole === 'super_admin' || allowedTabs.includes('bali')) && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">Bali Chatbot Questions (Easter Egg)</h2>
            <button onClick={handleAddBaliQuestion} className="px-4 py-2 bg-cyan-600 text-white rounded hover:bg-cyan-700">Add Question</button>
          </div>
          <div className="space-y-4">
            {baliQuestions.map((q) => (
              <div key={q.id} className="p-4 border rounded relative">
                <button onClick={() => handleDeleteBaliQuestion(q.id)} className="absolute top-4 right-4 text-red-500">Delete</button>
                <div className="mb-2">
                  <label className="block text-sm mb-1">Order Index</label>
                  <input type="number" value={q.order_index} onChange={e => setBaliQuestions(baliQuestions.map(bq => bq.id === q.id ? { ...bq, order_index: parseInt(e.target.value) } : bq))} className="border p-2 rounded w-full max-w-[100px]" />
                </div>
                <div className="mb-2">
                  <label className="block text-sm mb-1">Question Text</label>
                  <textarea value={q.question_text} onChange={e => setBaliQuestions(baliQuestions.map(bq => bq.id === q.id ? { ...bq, question_text: e.target.value } : bq))} className="border p-2 rounded w-full h-24" />
                </div>
                <button onClick={() => handleSaveBaliQuestion(q)} className="px-4 py-2 bg-gray-900 text-white rounded">Save Changes</button>
              </div>
            ))}
          </div>
        </div>
      )}
`;

if (!content.includes("activeTab === 'bali'")) {
  const franchisePanelEnd = `          </div>
        </div>
      )}
    </div>
  </main>
</div>
</div>
  );
}`;
  if (content.includes(franchisePanelEnd)) {
    content = content.replace(
      franchisePanelEnd,
      `          </div>
        </div>
      )}
      ${newPanel}
    </div>
  </main>
</div>
</div>
  );
}`
    );
  } else {
    // fallback
    const lastTag = "</main>\n      </div>\n    </div>\n  );\n}";
    content = content.replace(lastTag, newPanel + "\n" + lastTag);
  }
}

// 6. Fix handleSaveBaliQuestion etc.
if (!content.includes('handleSaveBaliQuestion')) {
  const saveFunc = `
  const handleSaveBaliQuestion = async (q: any) => {
    const { error } = await supabase.from('bali_chatbot_questions').update(q).eq('id', q.id);
    if (error) alert(error.message);
    else alert('Saved successfully!');
  };

  const handleAddBaliQuestion = async () => {
    const { error } = await supabase.from('bali_chatbot_questions').insert({
      order_index: baliQuestions.length,
      question_text: 'New Question'
    });
    if (!error) fetchBaliQuestions();
  };

  const handleDeleteBaliQuestion = async (id: string) => {
    const { error } = await supabase.from('bali_chatbot_questions').delete().eq('id', id);
    if (!error) fetchBaliQuestions();
  };
`;
  content = content.replace("const handleSaveAuditQ", saveFunc + "\n  const handleSaveAuditQ");
}

fs.writeFileSync('src/page-components/AdminCRM.tsx', content);
console.log('Modified AdminCRM again');