"use client";
import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import heroImage from './hero/screenshot_2025-12-30_at_15.32.31.png';

type Slide = 
  | { id: string; url: string }
  | { id: number; color: string };

export default function HeroCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Placeholder cards for images user can upload later
  const placeholderSlides: Slide[] = [
    { id: 1, color: 'from-purple-400 to-blue-500' },
    { id: 2, color: 'from-pink-400 to-rose-500' },
    { id: 3, color: 'from-cyan-400 to-blue-600' },
  ];

  // Load all images from the hero folder
  const imageUrls = [(heroImage as any).src || heroImage];

  const imageSlides: Slide[] = imageUrls.map((url, i) => ({ id: `img-${i}`, url }));
  const slides = imageSlides.length ? imageSlides : placeholderSlides;

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [slides.length]);

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  return (
    <div className="relative w-full h-full rounded-xl sm:rounded-2xl overflow-hidden group will-change-transform bg-white/0 border-4 sm:border-8 border-black dark:border-white shadow-2xl">
      {/* Slides */}
      <div className="relative w-full h-full">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transform transition-all duration-700 ease-out ${
              index === currentSlide
                ? 'opacity-100 translate-y-0 scale-100'
                : 'opacity-0 translate-y-6 scale-95'
            }`}
          >
            {('url' in slide) ? (
              <img
                src={slide.url}
                alt={`Hero ${index + 1}`}
                className="w-full h-full object-cover"
              />
            ) : (
              <div
                className={`w-full h-full bg-gradient-to-br ${
                  slide.color
                } flex items-center justify-center`}
              >
                <div className="text-center">
                  <div className="text-4xl sm:text-6xl text-white/30 mb-2">🖼</div>
                  <p className="text-white/60 text-xs sm:text-sm">Upload your work</p>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Navigation buttons */}
      <button
        onClick={prevSlide}
        aria-label="Previous slide"
        className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-20 bg-white/90 dark:bg-gray-800/90 hover:bg-white dark:hover:bg-gray-800 text-gray-900 dark:text-white rounded-full p-2 sm:p-3 opacity-0 sm:opacity-0 group-hover:opacity-100 transition-all duration-200 shadow-lg hover:scale-110 active:scale-95"
      >
        <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
      </button>

      <button
        onClick={nextSlide}
        aria-label="Next slide"
        className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-20 bg-white/90 dark:bg-gray-800/90 hover:bg-white dark:hover:bg-gray-800 text-gray-900 dark:text-white rounded-full p-2 sm:p-3 opacity-0 sm:opacity-0 group-hover:opacity-100 transition-all duration-200 shadow-lg hover:scale-110 active:scale-95"
      >
        <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
      </button>

      {/* Dot indicators */}
      <div className="absolute bottom-3 sm:bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            aria-label={`Go to slide ${index + 1}`}
            className={`h-2 sm:h-2.5 rounded-full transition-all duration-300 ${
              index === currentSlide
                ? 'bg-white w-6 sm:w-8 shadow-lg'
                : 'bg-white/50 w-2 hover:bg-white/70'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
