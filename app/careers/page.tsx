import CareersPage from '../../src/page-components/CareersPage';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Careers | Join the Team',
  description: 'View our open positions and join the Kairo Studio team to help build the future of digital experiences.',
  alternates: {
    canonical: 'https://kairostudio.co.uk/careers',
  },
};

export default function Page() {
  return <CareersPage />;
}
