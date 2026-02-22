import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface TypewriterHeroProps {
  texts: string[];
  speed?: number;
  deleteSpeed?: number;
  delay?: number;
  className?: string;
}

export const TypewriterHero: React.FC<TypewriterHeroProps> = ({ 
  texts, 
  speed = 100,
  deleteSpeed = 50,
  delay = 2000,
  className = ""
}) => {
  const [displayedText, setDisplayedText] = useState('');
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  
  // Calculate common prefix to avoid retyping it
  const commonPrefix = React.useMemo(() => {
    if (!texts || texts.length === 0) return '';
    if (texts.length === 1) return ''; // If only one text, treat as full type/delete or just static? Actually if 1 text, standard behavior.
    
    let prefix = texts[0];
    for (let i = 1; i < texts.length; i++) {
      while (!texts[i].startsWith(prefix)) {
        prefix = prefix.slice(0, -1);
      }
    }
    // Ensure we don't cut in the middle of a word if possible, or just strict character match
    // Strict character match is safer for "delete and retype last word" behavior.
    // But we might want to ensure we keep a space if it exists?
    // Let's just stick to raw string prefix.
    return prefix;
  }, [texts]);

  useEffect(() => {
    if (!texts || texts.length === 0) return;

    const currentFullText = texts[currentTextIndex];
    
    const handleTyping = () => {
      setDisplayedText(prev => {
        // If deleting
        if (isDeleting) {
          // If we reached the common prefix, stop deleting and switch to next text
          if (prev.length <= commonPrefix.length) {
            setIsDeleting(false);
            setCurrentTextIndex((prevIndex) => (prevIndex + 1) % texts.length);
            return prev;
          }
          return prev.slice(0, -1);
        } 
        
        // If typing
        else {
          // If we reached full text, start waiting then delete
          if (prev === currentFullText) {
            // We need a way to trigger the delay before deleting.
            // Since this is inside the interval/timeout, we can't easily pause here without effect cleanup.
            // So we'll handle the "wait" phase in the useEffect logic below.
            return prev;
          }
          return currentFullText.slice(0, prev.length + 1);
        }
      });
    };

    let timeout: NodeJS.Timeout;

    if (isDeleting) {
      if (displayedText.length > commonPrefix.length) {
        timeout = setTimeout(handleTyping, deleteSpeed);
      } else {
        // Finished deleting suffix
        setIsDeleting(false);
        setCurrentTextIndex((prev) => (prev + 1) % texts.length);
      }
    } else {
      // Typing
      if (displayedText !== currentFullText) {
        timeout = setTimeout(handleTyping, speed);
      } else {
        // Finished typing, wait before deleting
        // Only delete if we have multiple texts to cycle through
        if (texts.length > 1) {
          timeout = setTimeout(() => setIsDeleting(true), delay);
        }
      }
    }

    return () => clearTimeout(timeout);
  }, [displayedText, isDeleting, currentTextIndex, texts, speed, deleteSpeed, delay, commonPrefix]);

  // Reset if texts change
  useEffect(() => {
    // Only reset if the actual content changes
    setDisplayedText('');
    setCurrentTextIndex(0);
    setIsDeleting(false);
  }, [JSON.stringify(texts)]);

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
