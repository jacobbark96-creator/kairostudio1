
import React from 'react';
import SEO from '../components/SEO';

export default function PrivacyPolicy() {
  return (
    <>
      <SEO 
        title="Privacy Policy | Kairo Studio" 
        description="Our privacy policy outlining how we handle your data, payments, and project terms." 
      />
      <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto relative z-10">
        {/* Night Sky Background */}
        <div className="absolute inset-0 w-full h-full -z-20 overflow-hidden">
            <img 
                src="https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=2940&auto=format&fit=crop" 
                alt="Night Sky" 
                className="absolute inset-0 w-full h-full object-cover"
            />
            {/* Light Mode "Fade" Overlay: Makes image subtle in light mode, invisible in dark mode */}
            <div className="absolute inset-0 bg-gradient-to-b from-white/95 via-white/80 to-white dark:opacity-0 transition-opacity duration-500 pointer-events-none" />
        </div>

        <h1 className="text-4xl sm:text-5xl font-display font-bold text-gray-900 dark:text-white mb-8">
          Privacy Policy
        </h1>
        
        <div className="prose prose-lg dark:prose-invert max-w-none space-y-8 text-gray-600 dark:text-gray-300">
          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">1. Information Collection</h2>
            <p>
              We collect information necessary to provide our digital services, including your name, email address, business details, and project requirements. This information is used solely for project communication, invoicing, and service delivery.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">2. Payments & Deposits</h2>
            <p>
              To commence any project, a non-refundable deposit is required upfront. This secures your slot in our development schedule and covers initial research and design costs. The remaining balance is due upon project completion or as per the agreed milestone schedule.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">3. Refund Policy</h2>
            <p>
              Due to the custom nature of our work, <strong>all deposits and payments are non-refundable</strong> once work has commenced. We commit to working closely with you to ensure satisfaction, but we cannot offer refunds for time and resources already allocated to your project.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">4. Monthly Maintenance Fees</h2>
            <p>
              Ongoing maintenance, hosting, and support services are subject to a monthly fee. This fee is discussed and agreed upon before the launch of your project. Failure to pay monthly fees may result in the suspension of services, including hosting and support.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">5. Data Security</h2>
            <p>
              We implement industry-standard security measures to protect your personal and business data. However, no method of transmission over the internet is 100% secure, and we cannot guarantee absolute security.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">6. Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy, please contact us at <a href="mailto:hello@kairostudio.co.uk" className="text-brand-600 hover:underline">hello@kairostudio.co.uk</a>.
            </p>
          </section>
        </div>
      </div>
    </>
  );
}
