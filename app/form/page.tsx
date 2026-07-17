import DiscoveryForm from '../../src/components/DiscoveryForm';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Discovery Form | Kairo Studio',
  description: 'Internal discovery call form for Kairo Studio staff.',
  robots: {
    index: false,
    follow: false,
  }
};

export default function FormPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <DiscoveryForm />
      </div>
    </div>
  );
}
