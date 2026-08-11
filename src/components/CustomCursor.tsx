"use client";
import React, { useEffect, useRef, useState } from 'react';

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  
  // Track actual mouse position
  const mouse = useRef({ x: -100, y: -100 });
  // Track ring position for lerping
  const ring = useRef({ x: -100, y: -100 });
  
  const requestRef = useRef<number>();

  useEffect(() => {
    // Don't run on touch devices
    if (window.matchMedia('(pointer: coarse)').matches) {
      return;
    }

    const onMouseMove = (e: MouseEvent) => {
      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;
      if (!isVisible) setIsVisible(true);
      
      // Instantly move the inner dot for zero lag
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0) translate(-50%, -50%)`;
      }
    };

    const animate = () => {
      // Lerp the ring position towards the mouse position for a snappy trailing effect
      // High lerp factor (0.4) means very low lag
      ring.current.x += (mouse.current.x - ring.current.x) * 0.4;
      ring.current.y += (mouse.current.y - ring.current.y) * 0.4;

      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ring.current.x}px, ${ring.current.y}px, 0) translate(-50%, -50%)`;
      }

      requestRef.current = requestAnimationFrame(animate);
    };

    const handleMouseDown = () => {
      if (dotRef.current) dotRef.current.style.scale = '0.5';
      if (ringRef.current) ringRef.current.style.scale = '0.8';
    };
    const handleMouseUp = () => {
      if (dotRef.current) dotRef.current.style.scale = '1';
      if (ringRef.current) ringRef.current.style.scale = '1';
    };
    const handleMouseLeave = () => setIsVisible(false);

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mouseleave', handleMouseLeave);
    
    requestRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseleave', handleMouseLeave);
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [isVisible]);

  if (typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches) {
    return null;
  }

  return (
    <>
      <div
        ref={dotRef}
        className="fixed top-0 left-0 w-2 h-2 bg-brand-500 rounded-full pointer-events-none z-[10000] mix-blend-difference hidden sm:block transition-opacity duration-300"
        style={{ opacity: isVisible ? 1 : 0, transitionProperty: 'opacity, scale', transitionDuration: '300ms, 100ms' }}
      />
      <div
        ref={ringRef}
        className="fixed top-0 left-0 w-8 h-8 border border-brand-500/50 rounded-full pointer-events-none z-[9999] hidden sm:block mix-blend-difference transition-opacity duration-300"
        style={{ opacity: isVisible ? 1 : 0, transitionProperty: 'opacity, scale', transitionDuration: '300ms, 150ms' }}
      />
    </>
  );
}