"use client";

import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { ArrowRight, MapPin, Loader2, CheckCircle, Shield, Target, TrendingUp, Search } from 'lucide-react';
import Navbar from '../components/Navbar';
import { ComposableMap, Geographies, Geography, Marker, ZoomableGroup } from "react-simple-maps";

const geoUrl = "https://unpkg.com/world-atlas@2.0.2/countries-110m.json";

interface Location {
  id: string;
  city_name: string;
  x_coordinate: number;
  y_coordinate: number;
  description: string;
  status: string;
}

export default function FranchisePage() {
  const [locations, setLocations] = useState<Location[]>([]);
  const [loadingLocations, setLoadingLocations] = useState(true);
  const [hoveredLocation, setHoveredLocation] = useState<Location | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  const [mapPosition, setMapPosition] = useState({ coordinates: [0, 30] as [number, number], zoom: 2.5 });

  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formInterest, setFormInterest] = useState('');
  const [formMessage, setFormMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState('');
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchLocations();
  }, []);

  const fetchLocations = async () => {
    try {
      const { data, error } = await supabase
        .from('franchise_locations')
        .select('*')
        .in('status', ['available', 'pending', 'filled']);
      if (error) throw error;
      setLocations(data || []);
    } catch (error) {
      console.error('Error fetching franchise locations:', error);
    } finally {
      setLoadingLocations(false);
    }
  };

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const { error } = await supabase.from('franchise_applications').insert([{
        name: formName,
        email: formEmail,
        phone: formPhone,
        location_interest: formInterest,
        message: formMessage
      }]);
      if (error) throw error;
      setSubmitted(true);
    } catch (error: any) {
      alert(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  // Helper to calculate distance between two coordinates (Haversine formula approximation)
  const getDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371; // Radius of the earth in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    return R * c; // Distance in km
  };

  const handleSearchLocation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    setSearchError('');
    
    try {
      // Use OpenStreetMap Nominatim API for geocoding (free, no key required for low volume)
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}`);
      const data = await res.json();
      
      if (!data || data.length === 0) {
        setSearchError("Location not found. Try a different city.");
        setIsSearching(false);
        return;
      }
      
      const searchLat = parseFloat(data[0].lat);
      const searchLon = parseFloat(data[0].lon);
      
      // Find nearest franchise location
      if (locations.length > 0) {
        let nearestLoc = locations[0];
        let minDistance = getDistance(searchLat, searchLon, locations[0].y_coordinate, locations[0].x_coordinate);
        
        for (let i = 1; i < locations.length; i++) {
          const dist = getDistance(searchLat, searchLon, locations[i].y_coordinate, locations[i].x_coordinate);
          if (dist < minDistance) {
            minDistance = dist;
            nearestLoc = locations[i];
          }
        }
        
        // Pan and zoom to the nearest location
        setMapPosition({ coordinates: [nearestLoc.x_coordinate, nearestLoc.y_coordinate], zoom: 12 });
        setHoveredLocation(nearestLoc);
        
        // Keep tooltip visible in center temporarily
        const mapEl = document.getElementById('map-container');
        if (mapEl) {
          const rect = mapEl.getBoundingClientRect();
          setTooltipPos({ x: rect.width / 2, y: rect.height / 2 });
        }
      } else {
        // Just pan to searched location if no franchise locations exist yet
        setMapPosition({ coordinates: [searchLon, searchLat], zoom: 8 });
      }
      
    } catch (error) {
      console.error("Geocoding error:", error);
      setSearchError("Error finding location. Please try again.");
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <>
      <div className="min-h-screen bg-white dark:bg-[#0a0a0a] text-gray-900 dark:text-white">

      {/* Hero Section */}
      <section className="relative pt-40 pb-20 overflow-hidden min-h-[70vh] flex flex-col items-center justify-center text-center">
        {/* Background elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-brand-400/20 dark:bg-brand-500/10 rounded-full blur-[100px] animate-blob" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-purple-400/20 dark:bg-purple-500/10 rounded-full blur-[100px] animate-blob animation-delay-2000" />
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10">
          <span className="inline-flex px-4 py-1.5 rounded-full bg-brand-50 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400 text-sm font-bold uppercase tracking-wider mb-6 border border-brand-200 dark:border-brand-800">
            Exclusive Opportunity
          </span>
          <h1 className="text-5xl sm:text-7xl font-bold tracking-tight mb-8">
            Become Your Own <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-500 to-purple-500">Boss</span>
          </h1>
          <p className="text-xl sm:text-2xl text-gray-600 dark:text-gray-400 mb-10 max-w-3xl mx-auto">
            Work remotely, scale your income, and open your very own Kairo Studio office. We provide the blueprint, you reap the rewards.
          </p>
          <a href="#apply" className="inline-flex items-center gap-2 px-8 py-4 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-full font-bold hover:scale-105 transition-transform shadow-lg">
            Apply to Partner <ArrowRight className="w-5 h-5" />
          </a>
        </div>
      </section>

      {/* Why Franchise Section */}
      <section className="py-24 bg-gray-50 dark:bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">No Experience? No Problem.</h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              You don't need to be a developer. If you have exceptional client service skills and relentless attention to detail, we will train you on the rest.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
              <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-xl flex items-center justify-center mb-6">
                <Target className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-3">Full Training</h3>
              <p className="text-gray-600 dark:text-gray-400">
                We equip you with a proven playbook, sales strategies, and deep product knowledge. You'll hit the ground running.
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
              <div className="w-12 h-12 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded-xl flex items-center justify-center mb-6">
                <Shield className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-3">Unlimited Support</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Our central team handles the heavy lifting of development and design. You focus on building relationships and managing accounts.
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
              <div className="w-12 h-12 bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 rounded-xl flex items-center justify-center mb-6">
                <TrendingUp className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-3">Remote Freedom</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Work from anywhere. Whether you're at a local coffee shop or traveling the world, your Kairo Studio office travels with you.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-24 relative overflow-hidden bg-gray-50 dark:bg-[#0f0f0f] border-y border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12 relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-center md:text-left">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">Available Territories</h2>
              <p className="text-lg text-gray-600 dark:text-gray-400 max-w-xl">
                We are expanding globally. Explore our available, pending, and filled locations worldwide.
              </p>
            </div>
            
            {/* Search Box */}
            <div className="w-full md:w-auto min-w-[300px]">
              <form onSubmit={handleSearchLocation} className="relative">
                <div className="relative flex items-center">
                  <Search className="absolute left-4 w-5 h-5 text-gray-400" />
                  <input
                    ref={searchInputRef}
                    type="text"
                    placeholder="Find nearest location to..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-12 py-3 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-brand-500 focus:border-transparent shadow-sm"
                  />
                  <button
                    type="submit"
                    disabled={isSearching || !searchQuery.trim()}
                    className="absolute right-2 p-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-xl transition-colors disabled:opacity-50"
                  >
                    {isSearching ? <Loader2 className="w-4 h-4 animate-spin text-brand-500" /> : <ArrowRight className="w-4 h-4 text-gray-600 dark:text-gray-400" />}
                  </button>
                </div>
                {searchError && (
                  <p className="absolute top-full mt-2 left-0 text-sm text-red-500 font-medium">
                    {searchError}
                  </p>
                )}
              </form>
            </div>
          </div>
        </div>

        <div 
          id="map-container"
          className="relative w-full h-[600px] cursor-move bg-[#e6f2f8] dark:bg-[#0a1118]"
          onMouseMove={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            setTooltipPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
          }}
        >
          {loadingLocations ? (
            <div className="flex justify-center items-center h-full">
              <Loader2 className="w-10 h-10 animate-spin text-brand-500" />
            </div>
          ) : (
            <>
              <ComposableMap
                projectionConfig={{ scale: 140 }}
                className="w-full h-full outline-none"
              >
                <ZoomableGroup 
                  center={mapPosition.coordinates} 
                  zoom={mapPosition.zoom} 
                  minZoom={1} 
                  maxZoom={40}
                  onMoveEnd={(position) => setMapPosition(position)}
                >
                  <Geographies geography={geoUrl}>
                    {({ geographies }) =>
                      geographies.map((geo) => (
                        <Geography
                          key={geo.rsmKey}
                          geography={geo}
                          fill="#d1d5db"
                          stroke="#ffffff"
                          strokeWidth={0.5 / mapPosition.zoom}
                          className="dark:fill-[#1f2937] dark:stroke-[#111827] outline-none hover:outline-none focus:outline-none"
                          style={{
                            default: { outline: "none" },
                            hover: { fill: "#9ca3af", outline: "none" },
                            pressed: { outline: "none" },
                          }}
                        />
                      ))
                    }
                  </Geographies>

                  {locations.map((loc) => (
                    <Marker 
                      key={loc.id} 
                      coordinates={[loc.x_coordinate, loc.y_coordinate]}
                      onMouseEnter={() => setHoveredLocation(loc)}
                      onMouseLeave={() => setHoveredLocation(null)}
                    >
                      <g className="cursor-pointer group">
                        <circle 
                          r={4 / mapPosition.zoom} 
                          className={`transition-all duration-300 ${loc.status === 'pending' ? 'fill-amber-400 hover:fill-amber-300' : loc.status === 'filled' ? 'fill-purple-500 hover:fill-purple-400' : 'fill-brand-500 hover:fill-brand-400'}`}
                        />
                        <circle 
                          r={10 / mapPosition.zoom} 
                          className={`opacity-30 group-hover:animate-ping ${loc.status === 'pending' ? 'fill-amber-400' : loc.status === 'filled' ? 'fill-purple-500' : 'fill-brand-500'}`}
                        />
                      </g>
                    </Marker>
                  ))}
                </ZoomableGroup>
              </ComposableMap>

              {/* Lightbox for hovered location */}
              {hoveredLocation && (
                <div 
                  className="absolute z-50 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-100 dark:border-gray-700 p-4 w-64 pointer-events-none transform -translate-x-1/2 -translate-y-full mb-4 transition-all duration-200 animate-in fade-in zoom-in-95"
                  style={{ left: tooltipPos.x, top: tooltipPos.y - 10 }}
                >
                  <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white dark:bg-gray-800 border-b border-r border-gray-100 dark:border-gray-700 rotate-45" />
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-bold text-lg text-gray-900 dark:text-white flex items-center gap-1.5">
                        <MapPin className="w-4 h-4 text-brand-500" />
                        {hoveredLocation.city_name}
                      </h4>
                      <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${hoveredLocation.status === 'pending' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' : hoveredLocation.status === 'filled' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'}`}>
                        {hoveredLocation.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                      {hoveredLocation.description}
                    </p>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* Apply Section */}
      <section id="apply" className="py-24 bg-white dark:bg-[#0a0a0a]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gray-50 dark:bg-gray-900/50 p-8 sm:p-12 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-xl">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold mb-4">Apply for a Franchise</h2>
              <p className="text-gray-600 dark:text-gray-400">
                Ready to take the next step? Fill out the form below and our partnership team will reach out to schedule an introductory call.
              </p>
            </div>

            {submitted ? (
              <div className="text-center py-12">
                <div className="w-20 h-20 bg-green-50 dark:bg-green-900/20 text-green-500 mx-auto rounded-full flex items-center justify-center mb-6">
                  <CheckCircle className="w-10 h-10" />
                </div>
                <h3 className="text-2xl font-bold mb-2">Application Received</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Thank you for your interest! We'll be in touch shortly.
                </p>
              </div>
            ) : (
              <form onSubmit={handleApply} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Full Name *</label>
                    <input 
                      type="text" required 
                      value={formName} onChange={e => setFormName(e.target.value)}
                      className="w-full px-5 py-3 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email Address *</label>
                    <input 
                      type="email" required 
                      value={formEmail} onChange={e => setFormEmail(e.target.value)}
                      className="w-full px-5 py-3 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Phone Number</label>
                    <input 
                      type="tel" 
                      value={formPhone} onChange={e => setFormPhone(e.target.value)}
                      className="w-full px-5 py-3 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Location of Interest *</label>
                    <input 
                      type="text" required placeholder="e.g. Manchester, London"
                      value={formInterest} onChange={e => setFormInterest(e.target.value)}
                      className="w-full px-5 py-3 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Why are you a good fit? *</label>
                  <textarea 
                    rows={4} required 
                    value={formMessage} onChange={e => setFormMessage(e.target.value)}
                    className="w-full px-5 py-3 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-brand-500 focus:border-transparent resize-none"
                  />
                </div>

                <button 
                  type="submit" 
                  disabled={submitting}
                  className="w-full py-4 bg-gray-900 hover:bg-black dark:bg-white dark:hover:bg-gray-100 text-white dark:text-gray-900 rounded-xl font-bold text-lg shadow-xl hover:shadow-2xl transition-all disabled:opacity-70 flex justify-center items-center gap-2"
                >
                  {submitting ? <Loader2 className="w-6 h-6 animate-spin" /> : 'Submit Application'}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
    </>
  );
}
