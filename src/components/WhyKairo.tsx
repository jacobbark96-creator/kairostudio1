import React, { useState } from 'react';
import { TrendingUp, ShoppingCart, Zap, Calendar, Megaphone, Users, ChevronRight } from 'lucide-react';

const features = [
  {
    key: 'seo',
    title: 'SEO Optimization',
    short: 'Improve visibility and organic traffic.',
    details:
      'Technical SEO, content strategy, and performance tuning to help your site rank higher and attract qualified visitors.',
    icon: TrendingUp,
    gradientBg: 'from-orange-400 to-red-600',
    textColor: 'text-orange-600',
  },
  {
    key: 'gmb',
    title: 'Google My Business',
    short: 'Local presence & reviews management.',
    details:
      'Setup and ongoing management of your GMB listing to boost local discovery and trust with accurate business info and review handling.',
    useGoogleFavicon: true,
    gradientBg: 'from-blue-400 to-blue-600',
    textColor: 'text-blue-600',
  },
  {
    key: 'orders',
    title: 'Online Order Taking',
    short: 'Direct orders via your site or app.',
    details:
      "Custom ordering flows, payments, and confirmation messaging so customers can buy directly — reducing fees and improving conversions.",
    icon: ShoppingCart,
    gradientBg: 'from-emerald-400 to-teal-600',
    textColor: 'text-emerald-600',
  },
  {
    key: 'ops',
    title: 'Operations & POS',
    short: 'Accounting, sales, POS and time management.',
    details:
      'Integrate accounting, inventory and staff scheduling so your sales and operations stay in sync with real-time data.',
    icon: Zap,
    gradientBg: 'from-purple-400 to-indigo-600',
    textColor: 'text-purple-600',
  },
  {
    key: 'marketing',
    title: 'Marketing & Social',
    short: 'Campaigns, automation, and social integration.',
    details:
      'Cross-channel campaigns, automation workflows, and social media integration to keep your brand visible and engaged.',
    icon: Megaphone,
    gradientBg: 'from-pink-400 to-rose-600',
    textColor: 'text-pink-600',
  },
  {
    key: 'bookings',
    title: 'Bookings & Calendars',
    short: 'Simple scheduling for clients.',
    details:
      'Customer-facing booking widgets and calendar integrations that connect directly to your availability (we sync with your backend).',
    icon: Calendar,
    gradientBg: 'from-cyan-400 to-blue-600',
    textColor: 'text-cyan-600',
  },
  {
    key: 'support',
    title: 'Dedicated Support',
    short: 'A team that understands your business.',
    details:
      'Ongoing account management and support so you can focus on growth while we handle the technical details.',
    icon: Users,
    gradientBg: 'from-amber-400 to-orange-600',
    textColor: 'text-amber-600',
  },
];

export default function WhyKairo() {
  const [open, setOpen] = useState<string | null>(null);

  return (
    <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4 text-gray-900 dark:text-gray-100">Why Kairo?</h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed px-4">
            We build systems that work together — marketing, operations and sales — to drive measurable growth.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {features.map((f) => {
            const Icon = f.icon as any;
            const isOpen = open === f.key;
            return (
              <div
                key={f.key}
                className={`relative bg-gray-50 dark:bg-gray-800 rounded-2xl p-5 sm:p-6 shadow-sm hover:shadow-xl dark:hover:shadow-2xl transition-all duration-300 focus-within:ring-2 focus-within:ring-cyan-500 border border-gray-100 dark:border-gray-700 hover:border-cyan-200 dark:hover:border-cyan-700 hover:-translate-y-1 group`}
              >
                {/* Arrow indicator */}
                <div className="absolute top-4 right-4 opacity-40 group-hover:opacity-100 transition-opacity duration-300">
                  <ChevronRight className={`w-4 h-4 sm:w-5 sm:h-5 text-gray-400 dark:text-gray-500 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-all duration-300 ${isOpen ? 'rotate-90' : ''}`} />
                </div>
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : f.key)}
                  className="w-full text-left flex items-start gap-3 sm:gap-4"
                  aria-expanded={isOpen}
                >
                  <div className={`flex-shrink-0 p-3 sm:p-4 rounded-xl bg-gradient-to-br ${f.gradientBg} transition-transform duration-300 ${isOpen ? 'scale-110 rotate-3' : ''}`}>
                    {f.useGoogleFavicon ? (
                      <svg viewBox="0 0 24 24" className="w-5 h-5 sm:w-6 sm:h-6" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="12" cy="12" r="10" fill="white" opacity="0.1"/>
                        <text x="12" y="16" textAnchor="middle" fontSize="12" fontWeight="bold" fill="white">G</text>
                      </svg>
                    ) : (
                      <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">{f.title}</h3>
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">{f.short}</p>
                  </div>
                </button>

                <div
                  className={`mt-4 text-sm text-gray-700 dark:text-gray-200 transition-all duration-300 overflow-hidden ${
                    isOpen ? 'max-h-48 sm:max-h-40 opacity-100' : 'max-h-0 opacity-0'
                  }`}
                >
                  <p className="leading-relaxed">{f.details}</p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-8 sm:mt-12 text-center px-4">
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">Want a tailored plan? Book a quick call and we'll show how Kairo fits your needs.</p>
        </div>
      </div>
    </section>
  );
}
