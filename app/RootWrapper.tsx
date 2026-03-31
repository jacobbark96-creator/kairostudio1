"use client";
import React, { useEffect, useState } from 'react';
import Layout from '../src/components/Layout';
// import Chatbot from '../src/components/Chatbot';

export default function RootWrapper({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Layout>
        {children}
      </Layout>
    );
  }

  return (
    <>
      <Layout>{children}</Layout>
      {/* <Chatbot /> */}
    </>
  );
}
