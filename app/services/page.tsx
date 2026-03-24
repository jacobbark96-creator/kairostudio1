import ServicesPage from '../../src/components/ServicesPage';
import MobileServices from '../../src/mobile/pages/MobileServices';
import PageClientWrapper from '../../src/components/PageClientWrapper';

export default function Page() {
  return (
    <PageClientWrapper 
      desktop={<ServicesPage />} 
      mobile={<MobileServices />} 
    />
  );
}
