"use client";

import React from 'react';
import SEO from '../components/SEO';

export default function TermsOfService() {
  return (
    <>
      <SEO 
        title="Terms of Service | Kairo Studio" 
        description="Terms and conditions for working with Kairo Studio, including deposits, refunds, and maintenance." 
      />
      <div className="pt-48 sm:pt-56 pb-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto relative z-10">
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
          Terms of Service
        </h1>
        
        <div className="prose prose-lg dark:prose-invert max-w-none space-y-8 text-gray-600 dark:text-gray-300">
          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">1. Acceptance of Terms</h2>
            <p>
              By engaging Kairo Studio for any digital service, you agree to these Terms of Service. These terms constitute a legally binding agreement between you and Kairo Studio.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">2. Deposits & Payment Schedule</h2>
            <p>
              All projects require a <strong>non-refundable deposit</strong> (typically 50%) before work begins. This deposit secures your project slot and covers initial research, planning, and design. The remaining balance is due upon project completion and before the final launch or handover of files.
            </p>
            <p>
              Work will not commence until the deposit has been received. Delays in payment may result in delays to your project timeline.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">3. Refund Policy</h2>
            <p>
              <strong>All payments, including deposits and milestone payments, are non-refundable.</strong> We allocate time and resources immediately upon project confirmation. In the event of project cancellation by the client, no refunds will be issued for work already scheduled or completed.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">4. Monthly Maintenance & Hosting</h2>
            <p>
              Many of our projects involve ongoing monthly fees for hosting, maintenance, and support. These fees are discussed upfront and are essential for the continued operation and security of your website or application.
            </p>
            <p>
              Failure to pay monthly fees may result in the suspension or termination of your services. Kairo Studio is not liable for any loss of data or revenue resulting from service suspension due to non-payment.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">5. Intellectual Property</h2>
            <p>
              Upon full payment, you will own the final design and code of your project. Kairo Studio retains the right to display the project in our portfolio and marketing materials. We also retain ownership of any reusable code libraries or frameworks used in the project.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">6. Project Scope & Revisions</h2>
            <p>
              The scope of the project is defined in the initial proposal or agreement. Any additional features or major revisions outside this scope will be billed at our standard hourly rate. We include a set number of revision rounds (typically 2-3) for design and content.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">7. Limitation of Liability</h2>
            <p>
              Kairo Studio is not liable for any indirect, special, or consequential damages arising out of the use or inability to use our services. Our total liability is limited to the amount paid for the specific service in question.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">8. Contact</h2>
            <p>
              For any questions regarding these terms, please contact us at <a href="mailto:hello@kairostudio.co.uk" className="text-brand-600 hover:underline">hello@kairostudio.co.uk</a>.
            </p>
          </section>
        </div>
      </div>
    </>
  );
}
