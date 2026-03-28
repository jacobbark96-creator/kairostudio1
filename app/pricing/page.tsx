import PricingPage from '../../src/page-components/PricingPage';
import PageClientWrapper from '../../src/components/PageClientWrapper';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Pricing & Packages',
  description: 'Transparent pricing for custom web design, development, and ongoing maintenance packages.',
  alternates: {
    canonical: 'https://kairostudio.co.uk/pricing',
  },
};

export default function Page() {
  return (
    <PageClientWrapper 
      desktop={<PricingPage />} 
      mobile={<PricingPage />} 
    />
  );
}
