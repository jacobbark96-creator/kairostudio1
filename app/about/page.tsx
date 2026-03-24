import AboutPage from '../../src/components/AboutPage';
import MobileAbout from '../../src/mobile/pages/MobileAbout';
import PageClientWrapper from '../../src/components/PageClientWrapper';

export default function Page() {
  return (
    <PageClientWrapper 
      desktop={<AboutPage />} 
      mobile={<MobileAbout />} 
    />
  );
}
