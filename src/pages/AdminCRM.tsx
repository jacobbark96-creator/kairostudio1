import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { Upload, Trash2, Loader2, UserCheck, Save, UserPlus, FileText, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { Database } from '../types/supabase';

type Profile = Database['public']['Tables']['profiles']['Row'];
type Invoice = Database['public']['Tables']['invoices']['Row'];

export default function AdminCRM() {
  const [activeTab, setActiveTab] = useState<'invoices' | 'users' | 'content' | 'offers'>('invoices');
  
  // Invoice State
  const [uploading, setUploading] = useState(false);
  const [allInvoices, setAllInvoices] = useState<Invoice[]>([]);
  const [loadingInvoices, setLoadingInvoices] = useState(false);
  const [clientName, setClientName] = useState('');
  const [amount, setAmount] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [targetUserId, setTargetUserId] = useState('');
  const [users, setUsers] = useState<Profile[]>([]);
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserPassword, setNewUserPassword] = useState('');
  const [creatingUser, setCreatingUser] = useState(false);
  
  // Content State
  const [heroTitle, setHeroTitle] = useState('');
  const [heroSubtitle, setHeroSubtitle] = useState('');
  const [savingContent, setSavingContent] = useState(false);

  // Offer State
  const [offers, setOffers] = useState<Database['public']['Tables']['offers']['Row'][]>([]);
  const [offerTitle, setOfferTitle] = useState('');
  const [offerDescription, setOfferDescription] = useState('');
  const [offerMaxClaims, setOfferMaxClaims] = useState(1);
  const [creatingOffer, setCreatingOffer] = useState(false);

  // Invoice Filter
  const [invoiceFilter, setInvoiceFilter] = useState<'all' | 'pending' | 'paid'>('all');

  useEffect(() => {
    fetchUsers();
    fetchContent();
    fetchOffers();
    fetchAllInvoices();
  }, []);

  const fetchAllInvoices = async () => {
    setLoadingInvoices(true);
    const { data } = await supabase
      .from('invoices')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (data) setAllInvoices(data);
    setLoadingInvoices(false);
  };

  const markInvoiceAsPaid = async (id: string) => {
    if (!confirm('Mark this invoice as paid?')) return;
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase.from('invoices') as any)
      .update({ status: 'paid' })
      .eq('id', id);

    if (error) alert(error.message);
    else {
      fetchAllInvoices();
    }
  };

  const fetchUsers = async () => {
    const { data } = await supabase.from('profiles').select('*');
    if (data) setUsers(data);
  };

  const fetchContent = async () => {
    const { data } = await supabase.from('site_content').select('*');
    if (data) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const title = (data as any[]).find(item => item.key === 'hero_title')?.value || '';
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const subtitle = (data as any[]).find(item => item.key === 'hero_subtitle')?.value || '';
      setHeroTitle(title);
      setHeroSubtitle(subtitle);
    }
  };

  const fetchOffers = async () => {
    const { data } = await supabase.from('offers').select('*').order('created_at', { ascending: false });
    if (data) setOffers(data);
  };

  const handleCreateOffer = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreatingOffer(true);
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error } = await (supabase.from('offers') as any).insert({
        title: offerTitle,
        description: offerDescription,
        max_claims: offerMaxClaims,
        active: true
      });
      if (error) throw error;
      alert('Offer created!');
      setOfferTitle('');
      setOfferDescription('');
      setOfferMaxClaims(1);
      fetchOffers();
    } catch (error: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
      alert(error.message);
    } finally {
      setCreatingOffer(false);
    }
  };

  const toggleOfferStatus = async (id: string, currentStatus: boolean) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase.from('offers') as any).update({ active: !currentStatus }).eq('id', id);
    if (error) alert(error.message);
    else fetchOffers();
  };

  const deleteOffer = async (id: string) => {
    if (!confirm('Are you sure you want to delete this offer?')) return;
    const { error } = await supabase.from('offers').delete().eq('id', id);
    if (error) alert(error.message);
    else fetchOffers();
  };

  const handleInvoiceUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile || !targetUserId) return;

    try {
      setUploading(true);
      const fileExt = selectedFile.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${targetUserId}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('invoices')
        .upload(filePath, selectedFile);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('invoices')
        .getPublicUrl(filePath);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error: dbError } = await (supabase.from('invoices') as any).insert({
          user_id: targetUserId, // Uploading FOR this user
          client_name: clientName,
          amount: parseFloat(amount),
          due_date: dueDate || null,
          file_url: publicUrl,
          file_path: filePath,
          status: 'pending'
        });

      if (dbError) throw dbError;
      alert('Invoice sent successfully!');
      setClientName('');
      setAmount('');
      setDueDate('');
      setSelectedFile(null);
    } catch (error: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
      alert(error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserEmail || !newUserPassword) return;

    setCreatingUser(true);
    try {
      // Create a temporary client to sign up without logging out the admin
      const tempSupabase = createClient(
        import.meta.env.VITE_SUPABASE_URL,
        import.meta.env.VITE_SUPABASE_ANON_KEY,
        {
          auth: {
            persistSession: false, // Don't persist the session
            autoRefreshToken: false, // Don't refresh tokens
            detectSessionInUrl: false, // Don't look for session in URL
          },
        }
      );

      const { data, error } = await tempSupabase.auth.signUp({
        email: newUserEmail,
        password: newUserPassword,
      });

      if (error) throw error;

      if (data.user) {
        alert('User created successfully!');
        setNewUserEmail('');
        setNewUserPassword('');
        // Refresh users list after a short delay to allow trigger to run
        setTimeout(fetchUsers, 1000);
      }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      alert(error.message);
    } finally {
      setCreatingUser(false);
    }
  };

  const handlePromoteAdmin = async (userId: string) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase.from('profiles') as any).update({ role: 'admin' }).eq('id', userId);
    
    if (error) alert(error.message);
    else {
      alert('User promoted to admin');
      fetchUsers();
    }
  };

  const handleUpdateContent = async () => {
    setSavingContent(true);
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (supabase.from('site_content') as any).upsert([
        { key: 'hero_title', value: heroTitle },
        { key: 'hero_subtitle', value: heroSubtitle }
      ]);
      alert('Content updated!');
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      alert(error.message);
    } finally {
      setSavingContent(false);
    }
  };

  return (
    <div className="min-h-screen pt-32 pb-12 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">Admin CRM</h1>
        
        <div className="flex space-x-4 mb-8 border-b border-gray-200 dark:border-gray-700 overflow-x-auto">
          <button
            onClick={() => setActiveTab('invoices')}
            className={`pb-4 px-4 ${activeTab === 'invoices' ? 'border-b-2 border-cyan-600 text-cyan-600' : 'text-gray-500'}`}
          >
            Send Invoices
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`pb-4 px-4 ${activeTab === 'users' ? 'border-b-2 border-cyan-600 text-cyan-600' : 'text-gray-500'}`}
          >
            Manage Users
          </button>
          <button
            onClick={() => setActiveTab('content')}
            className={`pb-4 px-4 ${activeTab === 'content' ? 'border-b-2 border-cyan-600 text-cyan-600' : 'text-gray-500'}`}
          >
            Edit Content
          </button>
          <button
            onClick={() => setActiveTab('offers')}
            className={`pb-4 px-4 ${activeTab === 'offers' ? 'border-b-2 border-cyan-600 text-cyan-600' : 'text-gray-500'}`}
          >
            Manage Offers
          </button>
        </div>

        {activeTab === 'invoices' && (
          <>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg mb-8">
            <h2 className="text-xl font-semibold mb-6 text-gray-900 dark:text-white">Upload Invoice for Client</h2>
            <form onSubmit={handleInvoiceUpload} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Select Client</label>
                <select
                  value={targetUserId}
                  onChange={(e) => setTargetUserId(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  required
                >
                  <option value="">Select a user...</option>
                  {users.map(u => (
                    <option key={u.id} value={u.id}>{u.email} ({u.role})</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Client Name (Display)</label>
                  <input
                    type="text"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Amount ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Due Date</label>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Invoice File (PDF)</label>
                <input
                  type="file"
                  accept=".pdf,.png,.jpg"
                  onChange={(e) => e.target.files && setSelectedFile(e.target.files[0])}
                  className="w-full text-sm text-gray-500 dark:text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-cyan-50 file:text-cyan-700 hover:file:bg-cyan-100"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={uploading}
                className="w-full py-3 px-4 bg-cyan-600 text-white rounded-lg hover:bg-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {uploading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Upload className="w-5 h-5" />}
                {uploading ? 'Sending...' : 'Send Invoice'}
              </button>
            </form>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
            <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">All Invoices</h2>
              <div className="flex items-center gap-4">
                <select
                  value={invoiceFilter}
                  onChange={(e) => setInvoiceFilter(e.target.value as 'all' | 'pending' | 'paid')}
                  className="rounded-lg border-gray-300 dark:border-gray-600 text-sm focus:ring-cyan-500 focus:border-cyan-500 dark:bg-gray-700 dark:text-white"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Outstanding (Pending/Overdue)</option>
                  <option value="paid">Paid</option>
                </select>
                <button onClick={fetchAllInvoices} className="text-sm text-cyan-600 hover:text-cyan-500">Refresh</button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead>
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Client</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Details</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Amount</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {allInvoices
                    .filter(inv => {
                      if (invoiceFilter === 'all') return true;
                      if (invoiceFilter === 'paid') return inv.status === 'paid';
                      return inv.status === 'pending' || inv.status === 'overdue';
                    })
                    .map((invoice) => {
                    const client = users.find(u => u.id === invoice.user_id);
                    return (
                      <tr key={invoice.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">{client?.email || 'Unknown'}</div>
                          <div className="text-xs text-gray-500">{invoice.client_name}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {invoice.file_url && (
                            <a href={invoice.file_url} target="_blank" rel="noopener noreferrer" className="text-cyan-600 hover:text-cyan-800 flex items-center gap-1">
                              <FileText className="w-4 h-4" /> View
                            </a>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">
                          ${invoice.amount.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                            ${invoice.status === 'paid' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'}`}>
                            {invoice.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          {invoice.status !== 'paid' && (
                            <button
                              onClick={() => markInvoiceAsPaid(invoice.id)}
                              className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300 flex items-center gap-1 ml-auto"
                            >
                              <CheckCircle className="w-4 h-4" /> Mark Paid
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                  {allInvoices.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                        No invoices found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
          </>
        )}

        {activeTab === 'users' && (
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
            <h2 className="text-xl font-semibold mb-6 text-gray-900 dark:text-white">Create New User</h2>
            <form onSubmit={handleCreateUser} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end mb-8 border-b border-gray-200 dark:border-gray-700 pb-8">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
                <input
                  type="email"
                  value={newUserEmail}
                  onChange={(e) => setNewUserEmail(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Password</label>
                <input
                  type="password"
                  value={newUserPassword}
                  onChange={(e) => setNewUserPassword(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  required
                  minLength={6}
                />
              </div>
              <button
                type="submit"
                disabled={creatingUser}
                className="py-2 px-4 bg-green-600 text-white rounded-lg hover:bg-green-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 h-[42px]"
              >
                {creatingUser ? <Loader2 className="w-5 h-5 animate-spin" /> : <UserPlus className="w-5 h-5" />}
                {creatingUser ? 'Creating...' : 'Create User'}
              </button>
            </form>

            <h2 className="text-xl font-semibold mb-6 text-gray-900 dark:text-white">User Management</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead>
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Role</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {users.map((user) => (
                    <tr key={user.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{user.email}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.role === 'admin' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        {user.role !== 'admin' && (
                          <button
                            onClick={() => handlePromoteAdmin(user.id)}
                            className="text-cyan-600 hover:text-cyan-900 dark:text-cyan-400 dark:hover:text-cyan-300 flex items-center gap-1"
                          >
                            <UserCheck className="w-4 h-4" /> Make Admin
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'content' && (
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
            <h2 className="text-xl font-semibold mb-6 text-gray-900 dark:text-white">Edit Hero Content</h2>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Hero Title</label>
                <input
                  type="text"
                  value={heroTitle}
                  onChange={(e) => setHeroTitle(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Hero Subtitle</label>
                <textarea
                  value={heroSubtitle}
                  onChange={(e) => setHeroSubtitle(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <button
                onClick={handleUpdateContent}
                disabled={savingContent}
                className="w-full py-3 px-4 bg-cyan-600 text-white rounded-lg hover:bg-cyan-500 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {savingContent ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                {savingContent ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        )}

        {activeTab === 'offers' && (
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
            <h2 className="text-xl font-semibold mb-6 text-gray-900 dark:text-white">Create New Offer</h2>
            <form onSubmit={handleCreateOffer} className="space-y-4 mb-8">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Title</label>
                <input
                  type="text"
                  value={offerTitle}
                  onChange={(e) => setOfferTitle(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
                <textarea
                  value={offerDescription}
                  onChange={(e) => setOfferDescription(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Max Claims</label>
                <input
                  type="number"
                  min="1"
                  value={offerMaxClaims}
                  onChange={(e) => setOfferMaxClaims(parseInt(e.target.value))}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={creatingOffer}
                className="w-full py-3 px-4 bg-cyan-600 text-white rounded-lg hover:bg-cyan-500 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {creatingOffer ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                {creatingOffer ? 'Creating...' : 'Create Offer'}
              </button>
            </form>

            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Existing Offers</h2>
            <div className="space-y-4">
              {offers.map((offer) => (
                <div key={offer.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 flex justify-between items-center">
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white">{offer.title}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{offer.description}</p>
                    <p className="text-xs text-gray-400 mt-1">Claims: {offer.current_claims} / {offer.max_claims}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleOfferStatus(offer.id, offer.active)}
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        offer.active 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                          : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                      }`}
                    >
                      {offer.active ? 'Active' : 'Inactive'}
                    </button>
                    <button
                      onClick={() => deleteOffer(offer.id)}
                      className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
              {offers.length === 0 && (
                <p className="text-center text-gray-500 py-4">No offers created yet.</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
