import BookingCalendar from '../../src/components/BookingCalendar';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Book a Consultation | Kairo Studio',
  description: 'Schedule a 30-minute consultation with Kairo Studio.',
  robots: {
    index: false, // We want this hidden from search engines
    follow: false,
  }
};

export default function Page() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-32 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-display font-bold text-gray-900 dark:text-white mb-6">
            Book a Consultation
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Select a time below to schedule a 30-minute call with our team. We'll discuss your project goals and how we can help.
          </p>
        </div>
        <BookingCalendar />
      </div>
    </div>
  );
}
