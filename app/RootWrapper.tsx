"use client";
import React, { useEffect, useState, useContext, useRef } from 'react';
import Layout from '../src/components/Layout';
import { AnimatePresence, motion } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { LayoutRouterContext } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import CustomCursor from '../src/components/CustomCursor';

function FrozenRouter({ children }: { children: React.ReactNode }) {
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

const columns = 10;
const rows = 10;
const totalSquares = columns * rows;

const transitionVariants = {
  initial: {
    rotateX: 0,
    opacity: 1,
    scale: 1,
  },
  animate: (i: number) => {
    const row = Math.floor(i / columns);
    const col = i % columns;
    return {
      rotateX: 90,
      opacity: 0,
      scale: 0.5,
      transition: {
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1],
        delay: (row + col) * 0.04,
      }
    };
  },
  exit: (i: number) => {
    const row = Math.floor(i / columns);
    const col = i % columns;
    return {
      rotateX: 0,
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1],
        delay: ((rows - row) + (columns - col)) * 0.04,
      }
    };
  }
};

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
      <CustomCursor />
      <Layout>
        <AnimatePresence mode="wait">
          <motion.div key={pathname} className="w-full h-full relative">
            <FrozenRouter>{children}</FrozenRouter>
            
            {/* The revealing geometric grid that covers and uncovers the screen */}
            <div className="fixed inset-0 z-[9999] pointer-events-none grid grid-cols-[repeat(10,1fr)] grid-rows-[repeat(10,1fr)]">
              {Array.from({ length: totalSquares }).map((_, i) => (
                <motion.div
                  key={i}
                  custom={i}
                  variants={transitionVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  className="bg-gray-950 dark:bg-[#0a0a0a] border-[0.5px] border-white/5 w-full h-full origin-center shadow-[0_0_15px_rgba(0,0,0,0.5)]"
                />
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </Layout>
    </>
  );
}
