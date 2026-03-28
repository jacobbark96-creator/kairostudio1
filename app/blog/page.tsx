import BlogList from '../../src/components/BlogList';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Blog & Insights',
  description: 'Read the latest insights, tutorials, and case studies on web design, development, and digital strategy from the Kairo Studio team.',
  alternates: {
    canonical: 'https://kairostudio.co.uk/blog',
  },
};

export default function Page() {
  return <BlogList />;
}
