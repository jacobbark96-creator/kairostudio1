import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import OfficeLocationPage from '../../../src/components/OfficeLocationPage';
import { officeLocations } from '../../../src/data/locations';

export const dynamicParams = false;

interface Props {
  params: { city: string };
}

export function generateStaticParams() {
  return officeLocations.map((location) => ({
    city: location.slug,
  }));
}

export function generateMetadata({ params }: Props): Metadata {
  const location = officeLocations.find((loc) => loc.slug === params.city);

  if (!location) {
    return {
      title: 'Office Not Found | Kairo Studio',
    };
  }

  return {
    title: `Web Design Agency ${location.city} | Kairo Studio`,
    description: location.description,
    alternates: {
      canonical: `https://kairostudio.co.uk/locations/${location.slug}/`,
    },
    openGraph: {
      title: `Web Design Agency ${location.city} | Kairo Studio`,
      description: location.description,
      url: `https://kairostudio.co.uk/locations/${location.slug}/`,
      images: [
        {
          url: location.image,
          width: 1200,
          height: 630,
          alt: `Kairo Studio ${location.city} Office`,
        },
      ],
      locale: 'en_GB',
      type: 'website',
    },
  };
}

export default function Page({ params }: Props) {
  const location = officeLocations.find((loc) => loc.slug === params.city);

  if (!location) {
    notFound();
  }

  return <OfficeLocationPage location={location} />;
}
