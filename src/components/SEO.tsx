"use client";
import React from 'react';

interface SEOProps {
  title: string;
  description: string;
  name?: string;
  type?: string;
}

export default function SEO({ title, description, name = 'Kairo Studio', type = 'article' }: SEOProps) {
  // In Next.js, SEO is handled by exporting metadata in page.tsx
  // This component is kept as a no-op to prevent breaking existing imports
  return null;
}
