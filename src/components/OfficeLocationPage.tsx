"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Globe, ArrowRight, Building2 } from 'lucide-react';
import Link from 'next/link';

interface OfficeLocationProps {
  location: {
    slug: string;
    city: string;
    name: string;
    address: string;
    country: string;
    description: string;
    image: string;
  };
}

export default function OfficeLocationPage({ location }: OfficeLocationProps) {
  return (
    <div className="min-h-screen pt-24 sm:pt-32 pb-16 sm:pb-24 bg-white dark:bg-[#050505] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Decorative Background Elements */}
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-brand-500/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          
          {/* Content Column */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="relative z-10"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-50 dark:bg-brand-500/10 border border-brand-200 dark:border-brand-500/20 mb-6">
              <Globe className="w-4 h-4 text-brand-600 dark:text-brand-400" />
              <span className="text-xs font-bold tracking-wide text-brand-600 dark:text-brand-400 uppercase">
                Kairo Global Network
              </span>
            </div>

            <h1 className="text-5xl sm:text-6xl md:text-7xl font-display font-black tracking-tighter text-gray-900 dark:text-white mb-6">
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400">
                {location.city}
              </span>
              <span className="block text-3xl sm:text-4xl md:text-5xl mt-2 font-bold tracking-tight text-gray-500 dark:text-gray-400">
                {location.name}
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-400 font-light leading-relaxed mb-8 max-w-xl">
              {location.description}
            </p>

            <div className="space-y-6 mb-10 p-6 rounded-2xl bg-gray-50 dark:bg-white/[0.02] border border-gray-100 dark:border-white/5 shadow-sm">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                  <MapPin className="w-6 h-6 text-brand-600 dark:text-brand-400" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-1">
                    Address
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    {location.address}<br />
                    {location.country}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                  <Building2 className="w-6 h-6 text-brand-600 dark:text-brand-400" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-1">
                    Connect With Us
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Ready to start a project? Reach out to our {location.city} team to discuss your digital needs.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-4">
              <Link
                href="/book"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-full font-bold hover:scale-105 transition-transform duration-200"
              >
                Book a Consultation
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/"
                className="inline-flex items-center justify-center px-8 py-4 bg-gray-100 dark:bg-white/10 text-gray-900 dark:text-white rounded-full font-bold hover:bg-gray-200 dark:hover:bg-white/20 transition-colors duration-200"
              >
                Back to Home
              </Link>
            </div>
          </motion.div>

          {/* Image Column */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative h-[500px] lg:h-[700px] rounded-3xl overflow-hidden shadow-2xl border border-gray-200/50 dark:border-white/10"
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent z-10" />
            <img 
              src={location.image} 
              alt={`Kairo Studio ${location.city} Office`} 
              className="absolute inset-0 w-full h-full object-cover"
            />
            
            {/* Glassmorphism Badge */}
            <div className="absolute bottom-8 left-8 right-8 z-20">
              <div className="backdrop-blur-md bg-white/10 border border-white/20 p-6 rounded-2xl shadow-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white/80 text-sm font-medium uppercase tracking-wider mb-1">
                      Kairo Studio
                    </p>
                    <p className="text-white text-xl font-bold">
                      {location.city}
                    </p>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-brand-500/20 flex items-center justify-center border border-brand-400/30">
                    <Globe className="w-6 h-6 text-brand-300" />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
}