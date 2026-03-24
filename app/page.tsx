import HomePage from '../src/page-components/HomePage';
import MobileHome from '../src/mobile/pages/MobileHome';
import PageClientWrapper from '../src/components/PageClientWrapper';

export default function Page() {
  return (
    <PageClientWrapper 
      desktop={<HomePage />} 
      mobile={<MobileHome />} 
    />
  );
}
