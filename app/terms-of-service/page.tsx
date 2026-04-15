import { Metadata } from 'next';
import TermsOfService from '../../src/page-components/TermsOfService';

export const metadata: Metadata = {
  title: 'Terms of Service | Kairo Studio',
  description: 'Read the Terms of Service for using Kairo Studio\'s website and services.',
  robots: {
    index: false,
    follow: true,
  }
};

export default function Page() {
  return <TermsOfService />;
}
