"use client";
import React, { useEffect, useState } from 'react';
import Layout from '../src/components/Layout';
import MobileLayout from '../src/mobile/MobileLayout';
import { useIsMobile } from '../src/hooks/useIsMobile';

export default function RootWrapper({ children }: { children: React.ReactNode }) {
  const isMobile = useIsMobile();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <Layout>{children}</Layout>;
  }

  return isMobile ? <MobileLayout>{children}</MobileLayout> : <Layout>{children}</Layout>;
}
