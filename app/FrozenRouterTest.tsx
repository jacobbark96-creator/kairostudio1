"use client";
import React, { useContext, useRef } from 'react';
import { LayoutRouterContext } from 'next/dist/shared/lib/app-router-context.shared-runtime';

export default function FrozenRouterTest({ children }: { children: React.ReactNode }) {
  const context = useContext(LayoutRouterContext ?? React.createContext(null));
  const frozen = useRef(context).current;

  if (!frozen) {
    return <>{children}</>;
  }

  return (
    <LayoutRouterContext.Provider value={frozen}>
      {children}
    </LayoutRouterContext.Provider>
  );
}
