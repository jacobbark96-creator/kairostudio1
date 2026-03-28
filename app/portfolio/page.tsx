import PortfolioPage from '../../src/components/PortfolioPage';
import MobilePortfolio from '../../src/mobile/pages/MobilePortfolio';
import PageClientWrapper from '../../src/components/PageClientWrapper';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Our Work & Case Studies',
  description: 'View our portfolio of award-winning websites, applications, and digital products built by Kairo Studio.',
  alternates: {
    canonical: 'https://kairostudio.co.uk/portfolio',
  },
};

export default function Page() {
  return (
    <PageClientWrapper 
      desktop={<PortfolioPage />} 
      mobile={<MobilePortfolio />} 
    />
  );
}
