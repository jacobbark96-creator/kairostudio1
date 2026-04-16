import React, { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

export default function HolographicCard({ member, index }: { member: any, index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Springs for smooth tilting
  const springConfig = { damping: 20, stiffness: 300, mass: 0.5 };
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [15, -15]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-15, 15]), springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    
    // Calculate mouse position relative to center of card (-0.5 to 0.5)
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      className="relative w-full max-w-[320px] aspect-[3/4] rounded-3xl overflow-hidden cursor-pointer group"
    >
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-110"
        style={{ backgroundImage: `url(${member.img})` }}
      />
      
      {/* Dark Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

      {/* Holographic Glare Effect */}
      <motion.div
        className="absolute inset-0 pointer-events-none mix-blend-overlay opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background: useTransform(
            [mouseX, mouseY],
            ([x, y]) => {
              // Move the gradient center based on mouse position
              const posX = (x + 0.5) * 100;
              const posY = (y + 0.5) * 100;
              return `radial-gradient(circle at ${posX}% ${posY}%, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0) 60%)`;
            }
          )
        }}
      />

      {/* Iridescent Foil Overlay */}
      <motion.div
        className="absolute inset-0 pointer-events-none mix-blend-color-dodge opacity-0 group-hover:opacity-30 transition-opacity duration-300"
        style={{
          background: useTransform(
            [mouseX, mouseY],
            ([x, y]) => {
              const angle = Math.atan2(y, x) * (180 / Math.PI) + 180;
              return `linear-gradient(${angle}deg, #ff0080, #ff8c00, #40e0d0, #ff0080)`;
            }
          )
        }}
      />

      {/* Content */}
      <div 
        className="absolute inset-0 p-8 flex flex-col justify-end transform-gpu"
        style={{ transform: "translateZ(40px)" }}
      >
        <h4 className="text-3xl font-display font-bold text-white mb-2">{member.name}</h4>
        <p className="text-brand-400 font-medium tracking-wide uppercase text-sm">
          {member.role}
        </p>
      </div>

      {/* Border Glow */}
      <div className="absolute inset-0 rounded-3xl border border-white/10 group-hover:border-white/30 transition-colors duration-300" />
    </motion.div>
  );
}
