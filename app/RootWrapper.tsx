"use client";
import React, { useEffect, useState } from 'react';
import Layout from '../src/components/Layout';
import { AnimatePresence, motion } from 'framer-motion';
import { usePathname } from 'next/navigation';
// import Chatbot from '../src/components/Chatbot';

export default function RootWrapper({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

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
      <Layout>
        <AnimatePresence mode="wait">
          <motion.div
            key={pathname}
            className="w-full h-full"
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {children}
            
            {/* The wiping panels that slide across the screen on route exit */}
            <motion.div 
              className="fixed inset-0 bg-brand-500 z-[9999] pointer-events-none"
              initial={{ x: "-100%" }}
              animate={{ x: "-100%" }}
              exit={{ x: "0%" }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            />
            <motion.div 
              className="fixed inset-0 bg-purple-500 z-[9998] pointer-events-none"
              initial={{ x: "-100%" }}
              animate={{ x: "-100%" }}
              exit={{ x: "0%" }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
            />
            <motion.div 
              className="fixed inset-0 bg-[#0a0a0a] z-[9997] pointer-events-none"
              initial={{ x: "-100%" }}
              animate={{ x: "-100%" }}
              exit={{ x: "0%" }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
            />
            
            {/* The revealing panel that slides off screen when a new route enters */}
            <motion.div
              className="fixed inset-0 bg-[#0a0a0a] z-[9999] pointer-events-none"
              initial={{ x: "0%" }}
              animate={{ x: "100%" }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            />
          </motion.div>
        </AnimatePresence>
      </Layout>
      {/* <Chatbot /> */}
    </>
  );
}
