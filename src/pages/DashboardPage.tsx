import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { FileText, LogOut, Loader2, AlertCircle, Plus } from 'lucide-react';
import { Database } from '../types/supabase';
import SEO from '../components/SEO';

type Invoice = Database['public']['Tables']['invoices']['Row'];

export default function DashboardPage() {
  const { user, signOut } = useAuth();
  const [uploading, setUploading] = useState(false);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Form State
  const [clientName, setClientName] = useState('');
  const [amount, setAmount] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [showForm, setShowForm] = useState(false);

  const [activeTab, setActiveTab] = useState<'pending' | 'paid'>('pending');

  useEffect(() => {
    if (user) fetchInvoices();
  }, [user]);

  const filteredInvoices = invoices.filter(invoice => {
    if (activeTab === 'pending') return invoice.status === 'pending' || invoice.status === 'overdue';
    return invoice.status === 'paid';
  });

  const fetchInvoices = async () => {
    try {
      const { data, error } = await supabase
        .from('invoices')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setInvoices(data || []);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'An error occurred';
      console.error('Error fetching invoices:', message);
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile || !user) {
      setError('Please select a file');
      return;
    }

    try {
      setUploading(true);
      setError(null);

      // 1. Upload file to Storage
      const fileExt = selectedFile.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${user.id}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('invoices')
        .upload(filePath, selectedFile);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('invoices')
        .getPublicUrl(filePath);

      // 2. Insert record into Database
      const newInvoice: Database['public']['Tables']['invoices']['Insert'] = {
        user_id: user.id,
        client_name: clientName,
        amount: parseFloat(amount),
        due_date: dueDate || null,
        file_url: publicUrl,
        file_path: filePath,
        status: 'pending'
      };

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error: dbError } = await (supabase as any)
        .from('invoices')
        .insert(newInvoice);

      if (dbError) throw dbError;

      // Reset form and refresh list
      setClientName('');
      setAmount('');
      setDueDate('');
      setSelectedFile(null);
      setShowForm(false);
      await fetchInvoices();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'An error occurred';
      setError(message);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (invoice: Invoice) => {
    if (!confirm('Are you sure you want to delete this invoice?')) return;

    try {
      // 1. Delete from Storage
      if (invoice.file_path) {
        const { error: storageError } = await supabase.storage
          .from('invoices')
          .remove([invoice.file_path]);
        
        if (storageError) console.error('Error deleting file:', storageError);
      }

      // 2. Delete from Database
      const { error: dbError } = await supabase
        .from('invoices')
        .delete()
        .eq('id', invoice.id);

      if (dbError) throw dbError;
      
      setInvoices(invoices.filter((inv) => inv.id !== invoice.id));
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'An error occurred';
      setError(message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20 pb-12">
      <SEO 
        title="Client Dashboard" 
        description="Manage your invoices and project details in the Kairo Studio Client Portal." 
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl overflow-hidden">
          {/* Header */}
          <div className="px-6 py-8 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center flex-wrap gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Invoice Dashboard
              </h1>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Manage your client invoices
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowForm(!showForm)}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-cyan-600 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500"
              >
                <Plus className="mr-2 h-4 w-4" />
                {showForm ? 'Cancel' : 'New Invoice'}
              </button>
              <button
                onClick={signOut}
                className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </button>
            </div>
          </div>

          <div className="p-6">
            {/* Tabs */}
            <div className="flex space-x-4 mb-6 border-b border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setActiveTab('pending')}
                className={`pb-2 px-4 text-sm font-medium transition-colors relative ${
                  activeTab === 'pending' 
                    ? 'text-cyan-600 dark:text-cyan-400' 
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                Pending
                {activeTab === 'pending' && (
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-cyan-600 dark:bg-cyan-400" />
                )}
              </button>
              <button
                onClick={() => setActiveTab('paid')}
                className={`pb-2 px-4 text-sm font-medium transition-colors relative ${
                  activeTab === 'paid' 
                    ? 'text-cyan-600 dark:text-cyan-400' 
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                Paid History
                {activeTab === 'paid' && (
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-cyan-600 dark:bg-cyan-400" />
                )}
              </button>
            </div>

            {/* Upload Form */}
            {showForm && (
              <div className="mb-8 bg-gray-50 dark:bg-gray-700/30 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Add New Invoice</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Client Name</label>
                      <input
                        required
                        type="text"
                        value={clientName}
                        onChange={(e) => setClientName(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-cyan-500 focus:border-cyan-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        placeholder="e.g. Acme Corp"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Amount ($)</label>
                      <input
                        required
                        type="number"
                        step="0.01"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-cyan-500 focus:border-cyan-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        placeholder="0.00"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Due Date</label>
                      <input
                        type="date"
                        value={dueDate}
                        onChange={(e) => setDueDate(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-cyan-500 focus:border-cyan-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Invoice File</label>
                      <input
                        required
                        type="file"
                        onChange={handleFileSelect}
                        className="w-full text-sm text-gray-500 dark:text-gray-400
                          file:mr-4 file:py-2 file:px-4
                          file:rounded-md file:border-0
                          file:text-sm file:font-semibold
                          file:bg-cyan-50 file:text-cyan-700
                          dark:file:bg-cyan-900/30 dark:file:text-cyan-300
                          hover:file:bg-cyan-100 dark:hover:file:bg-cyan-900/50"
                      />
                    </div>
                  </div>

                  {error && (
                    <div className="flex items-center text-sm text-red-500 mt-2">
                      <AlertCircle className="mr-2 h-4 w-4" />
                      {error}
                    </div>
                  )}

                  <div className="flex justify-end pt-2">
                    <button
                      type="submit"
                      disabled={uploading}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-cyan-600 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 disabled:opacity-50"
                    >
                      {uploading ? (
                        <>
                          <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
                          Uploading...
                        </>
                      ) : (
                        'Upload Invoice'
                      )}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Invoices List */}
            <div className="mt-8">
              {loading ? (
                <div className="flex justify-center py-12">
                  <Loader2 className="animate-spin h-8 w-8 text-cyan-600" />
                </div>
              ) : filteredInvoices.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                  <FileText className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
                    No {activeTab} invoices
                  </h3>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    {activeTab === 'pending' ? "You're all caught up!" : "No payment history found."}
                  </p>
                </div>
              ) : (
                <>
                  {/* Desktop Table View */}
                  <div className="hidden md:block overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                      <thead className="bg-gray-50 dark:bg-gray-800">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Client</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Amount</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Date</th>
                          <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                        {filteredInvoices.map((invoice) => (
                          <tr key={invoice.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900 dark:text-white">{invoice.client_name}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900 dark:text-gray-300">${invoice.amount.toFixed(2)}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                ${invoice.status === 'paid' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' : 
                                  invoice.status === 'overdue' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300' : 
                                  'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'}`}>
                                {invoice.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                              {new Date(invoice.created_at).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <div className="flex justify-end space-x-3">
                                {invoice.file_url && (
                                  <a
                                    href={invoice.file_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-cyan-600 hover:text-cyan-900 dark:text-cyan-400 dark:hover:text-cyan-300"
                                  >
                                    View
                                  </a>
                                )}
                                <button
                                  onClick={() => handleDelete(invoice)}
                                  className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                                >
                                  Delete
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Mobile Card View */}
                  <div className="md:hidden space-y-4">
                    {filteredInvoices.map((invoice) => (
                      <div key={invoice.id} className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow border border-gray-200 dark:border-gray-700">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white">{invoice.client_name}</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{new Date(invoice.created_at).toLocaleDateString()}</p>
                          </div>
                          <span className={`px-2 py-1 text-xs font-semibold rounded-full 
                            ${invoice.status === 'paid' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' : 
                              invoice.status === 'overdue' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300' : 
                              'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'}`}>
                            {invoice.status}
                          </span>
                        </div>
                        <div className="flex justify-between items-center mt-4">
                          <span className="text-lg font-bold text-gray-900 dark:text-white">${invoice.amount.toFixed(2)}</span>
                          <div className="flex space-x-3">
                            {invoice.file_url && (
                              <a
                                href={invoice.file_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm font-medium text-cyan-600 hover:text-cyan-900 dark:text-cyan-400 dark:hover:text-cyan-300"
                              >
                                View
                              </a>
                            )}
                            <button
                              onClick={() => handleDelete(invoice)}
                              className="text-sm font-medium text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
