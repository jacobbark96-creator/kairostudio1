import { Metadata } from 'next';
import PrivacyPolicy from '../../src/page-components/PrivacyPolicy';

export const metadata: Metadata = {
  title: 'Privacy Policy | Kairo Studio',
  description: 'Our Privacy Policy outlines how we collect, use, and protect your data.',
  robots: {
    index: false,
    follow: true,
  }
};

export default function Page() {
  return <PrivacyPolicy />;
}
