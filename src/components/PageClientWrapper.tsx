"use client";
import React, { useEffect, useState } from 'react';
import { useIsMobile } from '../hooks/useIsMobile';

export default function PageClientWrapper({ 
  desktop, 
  mobile 
}: { 
  desktop: React.ReactNode, 
  mobile: React.ReactNode 
}) {
  const isMobile = useIsMobile();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <>{desktop}</>;
  }

  return <>{isMobile ? mobile : desktop}</>;
}
