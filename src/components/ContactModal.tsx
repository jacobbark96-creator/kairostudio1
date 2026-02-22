import React, { useEffect, useState } from 'react';
import { X, Send, Loader2, Check, User, Mail, MessageSquare, Rocket, AlertCircle, CreditCard } from 'lucide-react';
import { useUI } from '../context/UIContext';
import { supabase } from '../lib/supabase';

export default function ContactModal() {
  const { isContactModalOpen: isOpen, closeContactModal: onClose, contactModalPreill: lockedSubject, offerPrice } = useUI();
  const [name, setName] = useState('');
  const [business, setBusiness] = useState('');
  const [description, setDescription] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [website, setWebsite] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) {
      // reset lightly when closed
      setSubmitted(false);
      setSubmitError(null);
    }
  }, [isOpen]);

  async function handleSubmit(e?: React.FormEvent) {
    if (e) e.preventDefault();
    setSubmitting(true);
    setSubmitError(null);

    const formData = {
      name,
      business,
      description,
      email,
      phone,
      website: website.trim() || undefined,
      subject: lockedSubject || undefined,
      offer_price: offerPrice || null,
      deposit_amount: offerPrice ? offerPrice * 0.1 : null
    };

    try {
      const { error } = await (supabase.from('contact_submissions') as any)
        .insert([formData]);

      if (error) throw error;
      
      if (offerPrice) {
        // Redirect to Stripe checkout for deposit
        const { data, error: functionError } = await supabase.functions.invoke('create-checkout-session', {
          body: {
            price: offerPrice * 0.1, // 10% deposit
            email: formData.email,
            offer: lockedSubject || formData.subject
          }
        });

        if (functionError) throw functionError;
        
        if (data?.url) {
          window.location.href = data.url;
          return; // Don't reset form or show success message yet
        }
      }

      setSubmitted(true);
      setName('');
      setBusiness('');
      setDescription('');
      setEmail('');
      setPhone('');
      setWebsite('');
    } catch (err: unknown) {
      console.error('Error submitting form:', err);
      const errorMessage = err instanceof Error ? err.message : 'Submission failed';
      setSubmitError(errorMessage);
    } finally {
      setSubmitting(false);
    }
  }

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4 sm:px-6 py-4 sm:py-6 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-label="Contact form"
    >
      <div className="fixed inset-0 bg-black/60 dark:bg-black/70 backdrop-blur-sm" onClick={onClose} />

      <div className="relative max-w-3xl w-full mx-auto bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-2xl overflow-hidden my-auto max-h-[95vh] sm:max-h-[90vh] overflow-y-auto">
        <div className="p-4 sm:p-6 md:p-8">
          <div className="flex items-start justify-between gap-4 mb-4 sm:mb-6">
            <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100">Let's talk</h3>
            <button
              aria-label="Close contact form"
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-gray-100 text-2xl sm:text-3xl leading-none transition-colors duration-200 p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
            >
              ✕
            </button>
          </div>

          {/* Locked Subject Field */}
          {lockedSubject && (
            <div className="space-y-4 mb-6">
              <div className="p-4 bg-brand-50 dark:bg-brand-900/20 border border-brand-100 dark:border-brand-900/30 rounded-2xl flex items-center gap-4">
                <div className="w-10 h-10 bg-brand-100 dark:bg-brand-900/40 rounded-full flex items-center justify-center flex-shrink-0">
                  <Rocket className="w-5 h-5 text-brand-600 dark:text-brand-400" />
                </div>
                <div>
                  <p className="text-xs font-bold text-brand-600 dark:text-brand-400 uppercase tracking-wider mb-0.5">Selected Offer</p>
                  <p className="font-semibold text-gray-900 dark:text-white">{lockedSubject}</p>
                </div>
              </div>

              {offerPrice && (
                <div className="p-4 bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/20 rounded-2xl flex items-start gap-4">
                  <div className="w-10 h-10 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-amber-800 dark:text-amber-200 mb-1">Upfront Deposit Required</p>
                    <p className="text-sm text-amber-700 dark:text-amber-300 leading-relaxed">
                      To cover domain registration, hosting setup, and initial costs, we require a <span className="font-bold">10% deposit (£{(offerPrice * 0.1).toFixed(2)})</span>. You'll be redirected to a secure checkout after submitting.
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {!submitted ? (
            <form onSubmit={(e) => handleSubmit(e)} className="mt-4 sm:mt-6 grid grid-cols-1 gap-4 sm:gap-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <label className="flex flex-col text-sm sm:text-base">
                  <span className="mb-1.5 sm:mb-2 font-medium text-gray-700 dark:text-gray-200">Your name</span>
                  <input
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="px-4 py-2.5 sm:py-3 rounded-lg border bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200 text-gray-900 dark:text-gray-100"
                  />
                </label>

                <label className="flex flex-col text-sm sm:text-base">
                  <span className="mb-1.5 sm:mb-2 font-medium text-gray-700 dark:text-gray-200">Business name</span>
                  <input
                    value={business}
                    onChange={(e) => setBusiness(e.target.value)}
                    className="px-4 py-2.5 sm:py-3 rounded-lg border bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200 text-gray-900 dark:text-gray-100"
                  />
                </label>
              </div>

              <label className="flex flex-col text-sm sm:text-base">
                <span className="mb-1.5 sm:mb-2 font-medium text-gray-700 dark:text-gray-200">Tell us a little about your business</span>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  className="px-4 py-2.5 sm:py-3 rounded-lg border bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200 text-gray-900 dark:text-gray-100 resize-none"
                />
              </label>

              <div className="grid sm:grid-cols-2 gap-4 sm:gap-5">
                <label className="flex flex-col text-sm sm:text-base">
                  <span className="mb-1.5 sm:mb-2 font-medium text-gray-700 dark:text-gray-200">Email</span>
                  <input
                    required
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="px-4 py-2.5 sm:py-3 rounded-lg border bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200 text-gray-900 dark:text-gray-100"
                  />
                </label>

                <label className="flex flex-col text-sm sm:text-base">
                  <span className="mb-1.5 sm:mb-2 font-medium text-gray-700 dark:text-gray-200">Phone</span>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="px-4 py-2.5 sm:py-3 rounded-lg border bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200 text-gray-900 dark:text-gray-100"
                  />
                </label>
              </div>

              <label className="flex flex-col text-sm sm:text-base">
                <span className="mb-1.5 sm:mb-2 font-medium text-gray-700 dark:text-gray-200">
                  Current web address <span className="text-gray-500 dark:text-gray-400 font-normal">(if you have one)</span>
                </span>
                <input
                  type="url"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  placeholder="https://example.com"
                  className="px-4 py-2.5 sm:py-3 rounded-lg border bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
                />
              </label>

              {submitError && <div className="text-sm text-red-500">{submitError}</div>}

              <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 sm:px-8 py-3 bg-cyan-600 text-white rounded-lg hover:bg-cyan-500 disabled:opacity-60 transition-all duration-200 font-medium text-sm sm:text-base shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 disabled:hover:scale-100"
                >
                  {submitting ? 'Submitting…' : 'Submit'}
                </button>

                <button 
                  type="button" 
                  onClick={onClose} 
                  className="px-6 sm:px-8 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 transition-all duration-200 font-medium text-sm sm:text-base"
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <div className="mt-6 text-center">
              <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Thank you</h4>
              <p className="mt-2 text-sm text-gray-700 dark:text-gray-200">One of our team will be in touch soon.</p>

              <div className="mt-6">
                <button onClick={onClose} className="px-4 py-2 bg-cyan-600 text-white rounded-md">Close</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
