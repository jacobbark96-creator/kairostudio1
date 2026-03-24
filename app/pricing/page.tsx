import PricingPage from '../../src/page-components/PricingPage';
// Since there's no MobilePricing, we use PricingPage for both for now, or just render PricingPage.
import PageClientWrapper from '../../src/components/PageClientWrapper';

export default function Page() {
  return (
    <PageClientWrapper 
      desktop={<PricingPage />} 
      mobile={<PricingPage />} 
    />
  );
}
