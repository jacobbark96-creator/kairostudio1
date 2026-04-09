"use client";
import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { FileText, Download, Calendar, PoundSterling, Clock, CheckCircle, AlertCircle, Layout as LayoutIcon, ExternalLink } from 'lucide-react';
import { Database } from '../types/supabase';

type Invoice = Database['public']['Tables']['invoices']['Row'];

export default function ClientDashboard() {
  const { user, isAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'invoices'>('dashboard');
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchInvoices();
      fetchProject();
    }
  }, [user]);

  const fetchProject = async () => {
    try {
      const { data, error } = await supabase
        .from('client_projects')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (!error && data) {
        setProject(data);
      }
    } catch (err: unknown) {
      console.error('Error fetching project:', err);
    }
  };

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

  const handlePayment = async (invoice: Invoice) => {
    try {
      // Use the remaining outstanding amount for the payment
      const amountToPay = invoice.amount - (invoice.amount_paid || 0);
      
      const { data, error } = await supabase.functions.invoke('create-checkout-session', {
        body: {
          price: amountToPay,
          email: user?.email,
          offer: `Invoice #${invoice.id.slice(0, 8)} - ${invoice.client_name}`,
          invoiceId: invoice.id // Optional: Pass invoice ID for metadata/webhook handling later
        }
      });

      if (error) throw error;

      if (data?.url) {
        window.location.href = data.url;
      } else {
        throw new Error('No checkout URL returned');
      }
    } catch (err) {
      console.error('Payment initiation failed:', err);
      alert('Failed to start payment process. Please try again.');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'text-green-600 bg-green-100 dark:bg-green-900/30 dark:text-green-400';
      case 'partial': return 'text-blue-600 bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400';
      case 'overdue': return 'text-red-600 bg-red-100 dark:bg-red-900/30 dark:text-red-400';
      default: return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30 dark:text-yellow-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid': return <CheckCircle className="w-4 h-4" />;
      case 'partial': return <Clock className="w-4 h-4" />;
      case 'overdue': return <AlertCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen pt-48 pb-12 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">My Dashboard</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">View and download your invoices and documents.</p>
          </div>
          {isAdmin && (
            <a 
              href="/crm" 
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors shadow-sm"
            >
              Go to Admin CRM
            </a>
          )}
        </div>

        <div className="flex space-x-4 mb-8 border-b border-gray-200 dark:border-gray-700">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`pb-4 px-4 flex items-center gap-2 font-medium transition-colors ${
              activeTab === 'dashboard' 
                ? 'border-b-2 border-cyan-600 text-cyan-600 dark:text-cyan-400' 
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
            }`}
          >
            <LayoutIcon className="w-4 h-4" />
            Dashboard
          </button>
          <button
            onClick={() => setActiveTab('invoices')}
            className={`pb-4 px-4 flex items-center gap-2 font-medium transition-colors ${
              activeTab === 'invoices' 
                ? 'border-b-2 border-cyan-600 text-cyan-600 dark:text-cyan-400' 
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
            }`}
          >
            <FileText className="w-4 h-4" />
            Invoices
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-600"></div>
          </div>
        ) : activeTab === 'invoices' ? (
          invoices.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-12 text-center">
              <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No invoices yet</h3>
              <p className="text-gray-500 dark:text-gray-400">Any invoices sent to you will appear here.</p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {invoices.map((invoice) => (
                <div key={invoice.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden border border-gray-100 dark:border-gray-700">
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="p-3 bg-cyan-50 dark:bg-cyan-900/20 rounded-lg">
                        <FileText className="w-6 h-6 text-cyan-600 dark:text-cyan-400" />
                      </div>
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(invoice.status || 'pending')}`}>
                        {getStatusIcon(invoice.status || 'pending')}
                        {(invoice.status || 'pending').charAt(0).toUpperCase() + (invoice.status || 'pending').slice(1)}
                      </span>
                    </div>
                    
                    <div className="mb-4">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">{invoice.client_name}</h3>
                      <div className="flex items-center text-2xl font-bold text-gray-900 dark:text-white">
                        <PoundSterling className="w-5 h-5 text-gray-400" />
                        {invoice.amount.toFixed(2)}
                      </div>
                      {invoice.amount_paid > 0 && (
                        <div className="text-sm text-green-600 dark:text-green-400 mt-1">
                          Paid: £{invoice.amount_paid.toFixed(2)}
                        </div>
                      )}
                      {(invoice.amount - (invoice.amount_paid || 0) > 0) && (
                        <div className="text-sm text-red-500 font-medium mt-1">
                          Outstanding: £{(invoice.amount - (invoice.amount_paid || 0)).toFixed(2)}
                        </div>
                      )}
                    </div>

                    <div className="space-y-3 mb-6">
                      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                        <Calendar className="w-4 h-4 mr-2" />
                        Due: {invoice.due_date ? new Date(invoice.due_date).toLocaleDateString() : 'No due date'}
                      </div>
                      
                      {invoice.status !== 'paid' && (
                          <button
                              onClick={() => handlePayment(invoice)}
                              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-500 transition-colors text-sm font-medium shadow-sm"
                          >
                              <PoundSterling className="w-4 h-4" />
                              Pay Now
                          </button>
                      )}
                    </div>

                    {invoice.file_url && (
                      <a
                        href={invoice.file_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gray-900 dark:bg-gray-700 text-white rounded-lg hover:bg-gray-800 dark:hover:bg-gray-600 transition-colors text-sm font-medium"
                      >
                        <Download className="w-4 h-4" />
                        Download Invoice
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )
        ) : (
          <div className="grid gap-6 md:grid-cols-3">
            {/* Active Project Module */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-8 border border-gray-100 dark:border-gray-700 flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 bg-brand-50 dark:bg-brand-900/20 rounded-xl flex items-center justify-center mb-6">
                  <LayoutIcon className="w-6 h-6 text-brand-600 dark:text-brand-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Active Project</h3>
                <p className="text-gray-500 dark:text-gray-400 mb-6">
                  {project?.project_name || 'No active project currently assigned.'}
                </p>
              </div>
              
              {project?.live_link && (
                <a 
                  href={project.live_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl font-bold hover:opacity-90 transition-opacity"
                >
                  <ExternalLink className="w-4 h-4" />
                  View Live Project
                </a>
              )}
            </div>

            {/* Latest Update Module */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-8 border border-gray-100 dark:border-gray-700 flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 bg-purple-50 dark:bg-purple-900/20 rounded-xl flex items-center justify-center mb-6">
                  <Clock className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Latest Update</h3>
                <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-xl mt-4">
                  <p className="text-gray-700 dark:text-gray-300">
                    {project?.latest_update || 'No recent updates. Check back soon!'}
                  </p>
                </div>
              </div>
            </div>
            
            {/* Latest Invoice Module */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-8 border border-gray-100 dark:border-gray-700 flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 bg-cyan-50 dark:bg-cyan-900/20 rounded-xl flex items-center justify-center mb-6">
                  <FileText className="w-6 h-6 text-cyan-600 dark:text-cyan-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Latest Invoice</h3>
                
                {(() => {
                  const latestUnpaidInvoice = invoices
                    .filter(i => i.status !== 'paid')
                    .sort((a, b) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime())[0];
                    
                  if (latestUnpaidInvoice) {
                    const amountDue = latestUnpaidInvoice.amount - (latestUnpaidInvoice.amount_paid || 0);
                    return (
                      <>
                        <div className="mb-6">
                          <p className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                            £{amountDue.toFixed(2)}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Due: {latestUnpaidInvoice.due_date ? new Date(latestUnpaidInvoice.due_date).toLocaleDateString() : 'No due date'}
                          </p>
                        </div>
                        <button
                          onClick={() => handlePayment(latestUnpaidInvoice)}
                          className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-cyan-600 text-white rounded-xl font-bold hover:bg-cyan-500 transition-colors shadow-sm"
                        >
                          <PoundSterling className="w-4 h-4" />
                          Pay Now
                        </button>
                      </>
                    );
                  } else {
                    return (
                      <p className="text-gray-500 dark:text-gray-400 mb-6">
                        You're all caught up! No unpaid invoices at this time.
                      </p>
                    );
                  }
                })()}
              </div>
            </div>
            
            {/* Quick Stats / Billing Snapshot */}
            <div className="md:col-span-3 bg-gradient-to-br from-gray-900 to-gray-800 dark:from-gray-800 dark:to-gray-900 rounded-xl shadow-sm p-8 text-white">
               <h3 className="text-xl font-bold mb-6">Billing Snapshot</h3>
               <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Total Due</p>
                    <p className="text-3xl font-bold">
                      £{invoices.filter(i => i.status !== 'paid').reduce((acc, curr) => acc + (curr.amount - (curr.amount_paid || 0)), 0).toFixed(2)}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Pending Invoices</p>
                    <p className="text-3xl font-bold">
                      {invoices.filter(i => i.status !== 'paid').length}
                    </p>
                  </div>
               </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
