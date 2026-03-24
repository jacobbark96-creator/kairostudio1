import PortfolioPage from '../../src/components/PortfolioPage';
import MobilePortfolio from '../../src/mobile/pages/MobilePortfolio';
import PageClientWrapper from '../../src/components/PageClientWrapper';

export default function Page() {
  return (
    <PageClientWrapper 
      desktop={<PortfolioPage />} 
      mobile={<MobilePortfolio />} 
    />
  );
}
