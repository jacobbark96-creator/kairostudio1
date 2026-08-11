"use client";

import React, { useState } from 'react';
import { Send, Loader2, CheckCircle, User, Mail, Globe, Target, AlertTriangle, Users, Briefcase, Calendar, MessageSquare } from 'lucide-react';

const QUESTIONS = [
  { id: 'client_name', label: 'Client / Business Name', icon: Briefcase },
  { id: 'website', label: 'Current Website (if any)', icon: Globe },
  { id: 'goals', label: 'Main Goals for the Project', icon: Target },
  { id: 'pain_points', label: 'Key Pain Points with Current Setup', icon: AlertTriangle },
  { id: 'audience', label: 'Target Audience', icon: Users },
  { id: 'competitors', label: 'Key Competitors', icon: Target },
  { id: 'budget', label: 'Budget Range', icon: MessageSquare },
  { id: 'timeline', label: 'Timeline Expectations', icon: Calendar },
  { id: 'notes', label: 'Additional Notes', icon: MessageSquare, isTextArea: true },
];

export default function DiscoveryForm() {
  const [staffPrefix, setStaffPrefix] = useState('');
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnswerChange = (id: string, value: string) => {
    setAnswers(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!staffPrefix) return;

    setIsSubmitting(true);
    setError(null);

    const staffEmail = `${staffPrefix.trim().toLowerCase()}@kairostudio.co.uk`;
    
    // Map internal IDs to labels for the email
    const formattedAnswers: Record<string, string> = {};
    QUESTIONS.forEach(q => {
      formattedAnswers[q.label] = answers[q.id] || '';
    });

    try {
      const res = await fetch('/api/discovery-form', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          staffEmail,
          answers: formattedAnswers
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to submit form');
      }

      setIsSuccess(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="max-w-2xl mx-auto p-8 text-center animate-fade-in">
        <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-10 h-10 text-green-600" />
        </div>
        <h2 className="text-3xl font-black tracking-tighter text-gray-900 dark:text-white mb-4">Discovery Submitted!</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          The summary has been emailed to <span className="font-bold text-cyan-600">{staffPrefix}@kairostudio.co.uk</span>
        </p>
        <button
          onClick={() => window.location.reload()}
          className="px-8 py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl font-bold tracking-tight hover:scale-105 transition-transform"
        >
          Start New Form
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-12 text-center">
        <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-gray-900 dark:text-white mb-4">
          Discovery Call Form
        </h1>
        <p className="text-gray-600 dark:text-gray-400 font-medium">
          Internal tool for staff to document client discovery sessions.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Staff Email Section */}
        <section className="bg-white dark:bg-gray-800/50 p-6 md:p-8 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-xl backdrop-blur-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-cyan-100 dark:bg-cyan-900/30 rounded-lg">
              <User className="w-5 h-5 text-cyan-600" />
            </div>
            <h2 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">Staff Member</h2>
          </div>
          
          <div className="flex items-center">
            <div className="relative flex-1">
              <input
                type="text"
                required
                placeholder="Your name"
                value={staffPrefix}
                onChange={(e) => setStaffPrefix(e.target.value)}
                className="w-full px-4 py-4 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-l-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none transition-all text-gray-900 dark:text-white font-medium"
              />
            </div>
            <div className="px-4 py-4 bg-gray-100 dark:bg-gray-800 border border-l-0 border-gray-200 dark:border-gray-700 rounded-r-xl text-gray-500 dark:text-gray-400 font-bold tracking-tight">
              @kairostudio.co.uk
            </div>
          </div>
        </section>

        {/* Questions Section */}
        <div className="grid grid-cols-1 gap-6">
          {QUESTIONS.map((q) => (
            <div 
              key={q.id}
              className="bg-white dark:bg-gray-800/50 p-6 md:p-8 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-lg hover:shadow-xl transition-shadow"
            >
              <label className="flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
                    <q.icon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  </div>
                  <span className="text-lg font-bold tracking-tight text-gray-900 dark:text-white">
                    {q.label}
                  </span>
                </div>

                {q.isTextArea ? (
                  <textarea
                    rows={4}
                    value={answers[q.id] || ''}
                    onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none transition-all text-gray-900 dark:text-white resize-none"
                    placeholder="Enter details here..."
                  />
                ) : (
                  <input
                    type="text"
                    value={answers[q.id] || ''}
                    onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none transition-all text-gray-900 dark:text-white"
                    placeholder="Type answer..."
                  />
                )}
              </label>
            </div>
          ))}
        </div>

        {error && (
          <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30 rounded-xl text-red-600 dark:text-red-400 text-sm font-medium flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" />
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-2xl font-black tracking-tighter text-xl shadow-2xl shadow-cyan-600/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-3"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-6 h-6 animate-spin" />
              SUBMITTING...
            </>
          ) : (
            <>
              <Send className="w-6 h-6" />
              SUBMIT DISCOVERY
            </>
          )}
        </button>
      </form>
    </div>
  );
}
