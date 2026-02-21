import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface TypewriterHeroProps {
  text: string;
  speed?: number;
  className?: string;
}

export const TypewriterHero: React.FC<TypewriterHeroProps> = ({ 
  text, 
  speed = 100,
  className = ""
}) => {
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, speed);
      
      return () => clearTimeout(timeout);
    }
  }, [currentIndex, text, speed]);

  // Reset if text changes
  useEffect(() => {
    setDisplayedText('');
    setCurrentIndex(0);
  }, [text]);

  return (
    <motion.span 
      className={className}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {displayedText}
      <motion.span
        animate={{ opacity: [0, 1, 0] }}
        transition={{ repeat: Infinity, duration: 0.8 }}
        className="inline-block ml-1 w-3 h-[1em] bg-cyan-600 dark:bg-cyan-400 align-middle"
      />
    </motion.span>
  );
};

export default TypewriterHero;
