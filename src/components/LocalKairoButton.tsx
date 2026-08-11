"use client";

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { MapPin, Loader2, Search } from 'lucide-react';
import { officeLocations } from '../data/locations';

// Haversine formula to calculate distance between two lat/lng points in km
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371; // Radius of the earth in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * 
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export default function LocalKairoButton() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'fallback' | 'error'>('idle');
  const [postcode, setPostcode] = useState('');
  const router = useRouter();
  const popoverRef = useRef<HTMLDivElement>(null);

  // Close popover when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setStatus('idle');
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const findNearestOffice = (lat: number, lng: number) => {
    let nearest = officeLocations[0];
    let minDistance = Infinity;

    officeLocations.forEach((office) => {
      const distance = calculateDistance(lat, lng, office.lat, office.lng);
      if (distance < minDistance) {
        minDistance = distance;
        nearest = office;
      }
    });

    return nearest;
  };

  const handleLocationRequest = () => {
    setStatus('loading');

    if (!navigator.geolocation) {
      setStatus('fallback');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const nearest = findNearestOffice(latitude, longitude);
        router.push(`/locations/${nearest.slug}`);
        setStatus('idle');
      },
      (error) => {
        console.warn('Geolocation failed or denied:', error);
        setStatus('fallback');
      },
      { timeout: 5000 }
    );
  };

  const handlePostcodeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!postcode.trim()) return;

    setStatus('loading');
    try {
      // Use Nominatim free geocoding API
      const res = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(postcode)}&format=json&limit=1`);
      const data = await res.json();

      if (data && data.length > 0) {
        const lat = parseFloat(data[0].lat);
        const lng = parseFloat(data[0].lon);
        const nearest = findNearestOffice(lat, lng);
        router.push(`/locations/${nearest.slug}`);
        setStatus('idle');
      } else {
        setStatus('error');
      }
    } catch (err) {
      console.error('Failed to fetch postcode location:', err);
      setStatus('error');
    }
  };

  return (
    <div className="relative" ref={popoverRef}>
      <button
        onClick={handleLocationRequest}
        disabled={status === 'loading'}
        className="flex items-center gap-2 px-5 py-2 text-sm font-medium rounded-full text-gray-600 dark:text-gray-300 hover:text-brand-600 dark:hover:text-brand-400 hover:bg-brand-50 dark:hover:bg-white/5 transition-all duration-300"
      >
        {status === 'loading' ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <MapPin className="w-4 h-4" />
        )}
        Your Local Kairo
      </button>

      {(status === 'fallback' || status === 'error') && (
        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-72 p-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-xl z-50">
          <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-2">
            Find your nearest office
          </h4>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
            We couldn't access your location. Enter your postcode or city to find your local Kairo Studio.
          </p>
          
          <form onSubmit={handlePostcodeSubmit} className="relative">
            <input
              type="text"
              value={postcode}
              onChange={(e) => setPostcode(e.target.value)}
              placeholder="e.g. SW1A 1AA or Paris"
              className="w-full pl-3 pr-10 py-2 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 dark:text-white"
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-brand-500"
            >
              <Search className="w-4 h-4" />
            </button>
          </form>

          {status === 'error' && (
            <p className="text-xs text-red-500 mt-2">
              Could not find that location. Please try again.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
