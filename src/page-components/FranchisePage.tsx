"use client";

import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { ArrowRight, MapPin, Loader2, CheckCircle, Shield, Target, TrendingUp, Search, Plus, Minus, Globe, Briefcase, Zap, Rocket } from 'lucide-react';
import Layout from '../components/Layout';
import Map, { Marker, NavigationControl, ViewStateChangeEvent } from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';

interface Location {
  id: string;
  city_name: string;
  x_coordinate: number;
  y_coordinate: number;
  description: string;
  status: string;
}

export default function FranchisePage() {
  // Use Framer Motion hooks for numbers
  const countAnimation = useAnimation();
  const [displayCounts, setDisplayCounts] = useState({ available: 0, pending: 0, filled: 0 });

  const [locations, setLocations] = useState<Location[]>([]);
  const [loadingLocations, setLoadingLocations] = useState(true);
  const [hoveredLocation, setHoveredLocation] = useState<Location | null>(null);
  
  const [viewState, setViewState] = useState({
    longitude: 0,
    latitude: 20,
    zoom: 1.2,
    pitch: 0,
    bearing: 0
  });

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

  const [faqs, setFaqs] = useState<any[]>([]);
  const [loadingFaqs, setLoadingFaqs] = useState(true);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  useEffect(() => {
    fetchLocations();
    fetchFaqs();
  }, []);

  const fetchFaqs = async () => {
    try {
      const { data, error } = await supabase.from('franchise_faqs').select('*').order('created_at', { ascending: true });
      if (error) throw error;
      setFaqs(data || []);
    } catch (error) {
      console.error('Error fetching franchise faqs:', error);
    } finally {
      setLoadingFaqs(false);
    }
  };

  const fetchLocations = async () => {
    try {
      const { data, error } = await supabase
        .from('franchise_locations')
        .select('*')
        .in('status', ['available', 'pending', 'filled']);
      if (error) throw error;
      const dataSafe = data || [];
      setLocations(dataSafe);
      
      // Animate counters
      let av = 0, pe = 0, fi = 0;
      dataSafe.forEach((l: any) => {
        if (l.status === 'available') av++;
        if (l.status === 'pending') pe++;
        if (l.status === 'filled') fi++;
      });
      
      // Simple interval animation for numbers
      let currentAv = 0, currentPe = 0, currentFi = 0;
      const interval = setInterval(() => {
        let changed = false;
        if (currentAv < av) { currentAv++; changed = true; }
        if (currentPe < pe) { currentPe++; changed = true; }
        if (currentFi < fi) { currentFi++; changed = true; }
        
        setDisplayCounts({ available: currentAv, pending: currentPe, filled: currentFi });
        
        if (!changed) clearInterval(interval);
      }, 50);

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
      }] as any);
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
        setViewState({ 
          longitude: nearestLoc.x_coordinate, 
          latitude: nearestLoc.y_coordinate, 
          zoom: 8,
          pitch: 0,
          bearing: 0
        });
        setHoveredLocation(nearestLoc);
      } else {
        // Just pan to searched location if no franchise locations exist yet
        setViewState({ 
          longitude: searchLon, 
          latitude: searchLat, 
          zoom: 8,
          pitch: 0,
          bearing: 0
        });
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
      <section className="relative pt-40 pb-20 mt-16 overflow-hidden min-h-[80vh] flex flex-col items-center justify-center text-center">
        {/* Cyberpunk Grid Background */}
        <div className="absolute inset-0 w-full h-full overflow-hidden -z-10 pointer-events-none bg-[#0a0a0a]">
          <div className="absolute inset-0 bg-[linear-gradient(rgba(14,165,233,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(14,165,233,0.05)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,#000_20%,transparent_100%)]" />
          <div className="absolute top-[20%] left-[20%] w-[300px] h-[300px] bg-brand-500/20 rounded-full blur-[100px] animate-pulse" />
          <div className="absolute bottom-[20%] right-[20%] w-[400px] h-[400px] bg-purple-600/20 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }} />
          
          {/* Moving scanline */}
          <motion.div 
            className="absolute top-0 left-0 w-full h-[2px] bg-brand-500/50 shadow-[0_0_20px_rgba(14,165,233,0.8)]"
            animate={{ top: ['0%', '100%', '0%'] }}
            transition={{ duration: 10, ease: "linear", repeat: Infinity }}
          />
        </div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="mb-8 inline-block"
          >
            <div className="relative inline-flex items-center gap-2 px-4 py-2 rounded-sm bg-brand-500/10 border border-brand-500/30 text-brand-400 text-xs font-mono uppercase tracking-[0.2em] backdrop-blur-sm">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-500"></span>
              </span>
              SYSTEM.INIT() // GLOBAL_EXPANSION_PROTOCOL
              
              {/* Corner tech accents */}
              <div className="absolute -top-1 -left-1 w-2 h-2 border-t border-l border-brand-500/50" />
              <div className="absolute -top-1 -right-1 w-2 h-2 border-t border-r border-brand-500/50" />
              <div className="absolute -bottom-1 -left-1 w-2 h-2 border-b border-l border-brand-500/50" />
              <div className="absolute -bottom-1 -right-1 w-2 h-2 border-b border-r border-brand-500/50" />
            </div>
          </motion.div>
          
          <motion.h1 
            className="text-6xl sm:text-7xl lg:text-8xl font-black tracking-tight mb-8 text-white uppercase font-sans"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
          >
            COMMAND YOUR <br className="hidden sm:block" />
            <span className="relative inline-block">
              <span className="absolute -inset-2 bg-brand-500/20 blur-xl rounded-full"></span>
              <span className="relative text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-brand-500 to-purple-500 animate-pulse">EMPIRE.</span>
            </span>
          </motion.h1>
          
          <motion.p 
            className="text-xl sm:text-2xl text-gray-400 mb-12 max-w-3xl mx-auto font-light"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
          >
            Deploy a Kairo Studio node in your territory. Leverage our enterprise infrastructure to scale a high-yield digital agency from anywhere on Earth.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3, ease: "easeOut" }}
            className="flex flex-col sm:flex-row items-center justify-center gap-6"
          >
            <a href="#apply" className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 bg-transparent text-brand-400 border border-brand-500/50 uppercase font-mono tracking-widest text-sm overflow-hidden transition-all hover:bg-brand-500/10 hover:border-brand-400 hover:shadow-[0_0_30px_rgba(14,165,233,0.4)]">
              {/* Glitch hover effect block */}
              <span className="absolute inset-0 w-full h-full bg-brand-500 -translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-out z-0"></span>
              <span className="relative z-10 flex items-center gap-2 group-hover:text-gray-900 font-bold transition-colors">
                [ INIT_APPLICATION ] <ArrowRight className="w-4 h-4" />
              </span>
              
              {/* Corner accents */}
              <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-brand-400" />
              <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-brand-400" />
            </a>
            <a href="#map-container" className="group inline-flex items-center justify-center gap-2 px-8 py-4 text-gray-400 hover:text-white uppercase font-mono tracking-widest text-sm transition-colors relative">
              <Globe className="w-4 h-4 group-hover:animate-spin-slow" /> VIEW_RADAR
              <span className="absolute bottom-2 left-1/2 -translate-x-1/2 w-0 h-[1px] bg-brand-500 group-hover:w-1/2 transition-all duration-300"></span>
            </a>
          </motion.div>
        </div>
      </section>

      {/* Why Franchise Section - Bento Grid */}
      <section className="py-32 bg-gray-50 dark:bg-[#0a0a0a] border-t border-gray-200 dark:border-gray-800 relative">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(14,165,233,0.03)_0,transparent_100%)] dark:bg-[radial-gradient(circle_at_center,rgba(14,165,233,0.05)_0,transparent_100%)]"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div 
            className="text-center mb-20"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-4xl sm:text-5xl font-bold mb-6 tracking-tight">No Experience? <span className="text-gray-400">No Problem.</span></h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              You don't need to be a developer. If you have exceptional client service skills and relentless attention to detail, we will train you on the rest.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 auto-rows-[minmax(280px,auto)]">
            {/* Card 1 - Large */}
            <motion.div 
              className="md:col-span-8 bg-white dark:bg-gray-900 rounded-3xl p-10 border border-gray-200 dark:border-gray-800 shadow-sm relative overflow-hidden group"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-blue-500/20 transition-colors duration-500"></div>
              <div className="w-14 h-14 bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-2xl flex items-center justify-center mb-8 shadow-sm border border-blue-100 dark:border-blue-500/20 relative z-10">
                <Target className="w-7 h-7" />
              </div>
              <h3 className="text-3xl font-bold mb-4 relative z-10">Full Blueprint & Training</h3>
              <p className="text-lg text-gray-600 dark:text-gray-400 relative z-10 max-w-xl">
                We equip you with a proven playbook, advanced sales strategies, and deep product knowledge. You'll hit the ground running with everything needed to scale a 6-figure agency.
              </p>
            </motion.div>

            {/* Card 2 - Small */}
            <motion.div 
              className="md:col-span-4 bg-white dark:bg-gray-900 rounded-3xl p-10 border border-gray-200 dark:border-gray-800 shadow-sm relative overflow-hidden group"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 group-hover:bg-purple-500/20 transition-colors duration-500"></div>
              <div className="w-14 h-14 bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400 rounded-2xl flex items-center justify-center mb-8 shadow-sm border border-purple-100 dark:border-purple-500/20 relative z-10">
                <TrendingUp className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-bold mb-4 relative z-10">Remote Freedom</h3>
              <p className="text-gray-600 dark:text-gray-400 relative z-10">
                Work from anywhere. Whether you're at a local coffee shop or traveling the world, your Kairo Studio office travels with you.
              </p>
            </motion.div>

            {/* Card 3 - Small */}
            <motion.div 
              className="md:col-span-4 bg-gradient-to-br from-brand-500 to-blue-600 rounded-3xl p-10 shadow-lg relative overflow-hidden text-white group"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
              <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mb-8 shadow-sm border border-white/20 relative z-10">
                <Rocket className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4 relative z-10">High Margins</h3>
              <p className="text-white/80 relative z-10">
                With zero inventory and low overhead, our franchise model is built for profitability and fast ROI.
              </p>
            </motion.div>

            {/* Card 4 - Large */}
            <motion.div 
              className="md:col-span-8 bg-white dark:bg-gray-900 rounded-3xl p-10 border border-gray-200 dark:border-gray-800 shadow-sm relative overflow-hidden group"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-green-500/5 rounded-full blur-3xl -translate-y-1/2 -translate-x-1/2 group-hover:bg-green-500/10 transition-colors duration-500"></div>
              <div className="w-14 h-14 bg-green-50 dark:bg-green-500/10 text-green-600 dark:text-green-400 rounded-2xl flex items-center justify-center mb-8 shadow-sm border border-green-100 dark:border-green-500/20 relative z-10">
                <Shield className="w-7 h-7" />
              </div>
              <h3 className="text-3xl font-bold mb-4 relative z-10">Unlimited Technical Support</h3>
              <p className="text-lg text-gray-600 dark:text-gray-400 relative z-10 max-w-xl">
                Our central team handles the heavy lifting of development, design, and complex technical SEO. You focus entirely on building relationships, closing deals, and managing accounts.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Data Counters Section */}
      <section className="py-12 bg-gray-950 border-t border-b border-gray-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-overlay"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 divide-y md:divide-y-0 md:divide-x divide-gray-800">
            
            <motion.div 
              className="flex flex-col items-center justify-center p-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <div className="text-sm font-mono text-gray-500 mb-2 uppercase tracking-widest flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-brand-500 animate-pulse"></div> Nodes Available
              </div>
              <div className="text-5xl font-black text-white tracking-tighter">
                {displayCounts.available}
              </div>
            </motion.div>

            <motion.div 
              className="flex flex-col items-center justify-center p-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="text-sm font-mono text-gray-500 mb-2 uppercase tracking-widest flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></div> Booting Up
              </div>
              <div className="text-5xl font-black text-white tracking-tighter">
                {displayCounts.pending}
              </div>
            </motion.div>

            <motion.div 
              className="flex flex-col items-center justify-center p-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <div className="text-sm font-mono text-gray-500 mb-2 uppercase tracking-widest flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse"></div> Active Sectors
              </div>
              <div className="text-5xl font-black text-white tracking-tighter">
                {displayCounts.filled}
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-32 relative overflow-hidden bg-white dark:bg-[#0f0f0f] border-y border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16 relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <motion.div 
              className="text-center md:text-left"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-4xl sm:text-5xl font-bold mb-4 tracking-tight">Available <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-500 to-purple-500">Territories</span></h2>
              <p className="text-xl text-gray-600 dark:text-gray-400 max-w-xl">
                We are expanding globally. Explore our available, pending, and filled locations worldwide.
              </p>
            </motion.div>
            
            {/* Search Box */}
            <motion.div 
              className="w-full md:w-auto min-w-[350px]"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <form onSubmit={handleSearchLocation} className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-brand-500 to-purple-500 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-500"></div>
                <div className="relative flex items-center bg-white dark:bg-gray-900 rounded-2xl p-1">
                  <Search className="absolute left-4 w-5 h-5 text-gray-400" />
                  <input
                    ref={searchInputRef}
                    type="text"
                    placeholder="Find nearest location to..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-14 py-3 bg-transparent border-none focus:ring-0 focus:outline-none text-gray-900 dark:text-white"
                  />
                  <button
                    type="submit"
                    disabled={isSearching || !searchQuery.trim()}
                    className="absolute right-2 p-2.5 bg-brand-50 dark:bg-brand-500/10 hover:bg-brand-100 dark:hover:bg-brand-500/20 text-brand-600 dark:text-brand-400 rounded-xl transition-colors disabled:opacity-50"
                  >
                    {isSearching ? <Loader2 className="w-5 h-5 animate-spin" /> : <ArrowRight className="w-5 h-5" />}
                  </button>
                </div>
                {searchError && (
                  <p className="absolute top-full mt-2 left-0 text-sm text-red-500 font-medium">
                    {searchError}
                  </p>
                )}
              </form>
            </motion.div>
          </div>
        </div>

        <motion.div 
          id="map-container"
          className="relative w-full h-[600px] md:h-[700px] bg-gray-900 shadow-2xl overflow-hidden border-y border-gray-200 dark:border-gray-800"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          {loadingLocations ? (
            <div className="flex justify-center items-center h-full">
              <Loader2 className="w-10 h-10 animate-spin text-brand-500" />
            </div>
          ) : (
            <Map
              {...viewState}
              onMove={evt => setViewState(evt.viewState)}
              mapStyle="https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json"
              style={{ width: '100%', height: '100%' }}
              minZoom={1}
              maxZoom={20}
              dragRotate={false}
            >
              <NavigationControl position="bottom-right" />
              
              {locations.map((loc) => (
                <Marker 
                  key={loc.id} 
                  longitude={loc.x_coordinate}
                  latitude={loc.y_coordinate}
                  anchor="center"
                  style={{zIndex: hoveredLocation?.id === loc.id ? 50 : 1}}
                >
                  <div 
                    className="cursor-pointer group relative flex items-center justify-center"
                    onMouseEnter={() => setHoveredLocation(loc)}
                    onMouseLeave={() => setHoveredLocation(null)}
                  >
                    {/* The actual dot */}
                    <div className={`w-3 h-3 rounded-full transition-all duration-300 shadow-lg group-hover:scale-125 z-10 ${loc.status === 'pending' ? 'bg-amber-400 hover:bg-amber-300' : loc.status === 'filled' ? 'bg-purple-500 hover:bg-purple-400' : 'bg-brand-500 hover:bg-brand-400'}`} />
                    
                    {/* Pulsing ring */}
                    <div className={`absolute w-8 h-8 rounded-full opacity-30 group-hover:animate-ping ${loc.status === 'pending' ? 'bg-amber-400' : loc.status === 'filled' ? 'bg-purple-500' : 'bg-brand-500'}`} />
                    
                    {/* Invisible larger hover area */}
                    <div className="absolute w-6 h-6 rounded-full z-20" />
                    
                    {/* Tooltip rendered directly on the hovered marker */}
                    {hoveredLocation?.id === loc.id && (
                      <div className="absolute z-[100] bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-100 dark:border-gray-700 p-4 w-64 pointer-events-none transform -translate-x-1/2 bottom-[calc(50%+14px)] left-1/2 transition-all duration-200 animate-in fade-in zoom-in-95">
                        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white dark:bg-gray-800 border-b border-r border-gray-100 dark:border-gray-700 rotate-45" />
                        <div className="relative z-10">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-bold text-lg text-gray-900 dark:text-white flex items-center gap-1.5">
                              <MapPin className="w-4 h-4 text-brand-500" />
                              {loc.city_name}
                            </h4>
                            <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${loc.status === 'pending' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' : loc.status === 'filled' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'}`}>
                              {loc.status}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed text-left whitespace-normal">
                            {loc.description}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </Marker>
              ))}
            </Map>
          )}
        </motion.div>
      </section>

      {/* FAQ Section */}
      <section className="py-32 bg-white dark:bg-[#0a0a0a] relative">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-4xl sm:text-5xl font-bold mb-4 tracking-tight">Frequently Asked Questions</h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              Everything you need to know about partnering with Kairo Studio.
            </p>
          </motion.div>

          {loadingFaqs ? (
            <div className="flex justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-brand-500" />
            </div>
          ) : faqs.length === 0 ? (
            <p className="text-center text-gray-500 py-12">No FAQs available at the moment.</p>
          ) : (
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <motion.div 
                  key={faq.id}
                  className={`border ${openFaqIndex === index ? 'border-brand-500/50 dark:border-brand-500/50 shadow-lg shadow-brand-500/10' : 'border-gray-200 dark:border-gray-800'} rounded-2xl overflow-hidden transition-all duration-300 bg-white dark:bg-[#111]`}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  <button
                    onClick={() => setOpenFaqIndex(openFaqIndex === index ? null : index)}
                    className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 dark:hover:bg-[#151515] transition-colors"
                  >
                    <span className="font-bold text-lg pr-8">{faq.question}</span>
                    <span className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-colors ${openFaqIndex === index ? 'bg-brand-500 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400'}`}>
                      <motion.div
                        initial={false}
                        animate={{ rotate: openFaqIndex === index ? 180 : 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        {openFaqIndex === index ? <Minus className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                      </motion.div>
                    </span>
                  </button>
                  
                  <AnimatePresence>
                    {openFaqIndex === index && (
                      <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="overflow-hidden"
                      >
                        <div className="p-6 pt-0 text-gray-600 dark:text-gray-400 leading-relaxed border-t border-gray-100 dark:border-gray-800/50 mt-2 pt-4">
                          {faq.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Apply Section */}
      <section id="apply" className="py-32 bg-gray-50 dark:bg-[#0a0a0a] relative overflow-hidden">
        <div className="absolute inset-0 w-full h-full">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-brand-500/10 rounded-full blur-[120px] mix-blend-multiply dark:mix-blend-lighten"></div>
          <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-purple-500/10 rounded-full blur-[120px] mix-blend-multiply dark:mix-blend-lighten"></div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div 
            className="bg-white/70 dark:bg-gray-900/50 backdrop-blur-xl p-8 sm:p-14 rounded-[2.5rem] border border-white/50 dark:border-gray-800/50 shadow-2xl relative overflow-hidden"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            {/* Inner glow line */}
            <div className="absolute inset-0 rounded-[2.5rem] ring-1 ring-inset ring-white/10 pointer-events-none"></div>
            
            <div className="text-center mb-12">
              <h2 className="text-4xl sm:text-5xl font-extrabold mb-4 tracking-tight">Apply for a Franchise</h2>
              <p className="text-xl text-gray-600 dark:text-gray-400">
                Ready to take the next step? Fill out the form below and our partnership team will reach out to schedule an introductory call.
              </p>
            </div>

            {submitted ? (
              <motion.div 
                className="text-center py-16"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
              >
                <div className="w-24 h-24 bg-green-500/10 text-green-500 mx-auto rounded-full flex items-center justify-center mb-8 shadow-[0_0_40px_rgba(34,197,94,0.3)]">
                  <CheckCircle className="w-12 h-12" />
                </div>
                <h3 className="text-3xl font-bold mb-4">Application Received</h3>
                <p className="text-xl text-gray-600 dark:text-gray-400">
                  Thank you for your interest! We'll be in touch shortly.
                </p>
              </motion.div>
            ) : (
              <form onSubmit={handleApply} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 ml-1">Full Name *</label>
                    <input 
                      type="text" required 
                      value={formName} onChange={e => setFormName(e.target.value)}
                      className="w-full px-5 py-4 rounded-2xl bg-white dark:bg-gray-950/50 border border-gray-200 dark:border-gray-800 focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all shadow-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 ml-1">Email Address *</label>
                    <input 
                      type="email" required 
                      value={formEmail} onChange={e => setFormEmail(e.target.value)}
                      className="w-full px-5 py-4 rounded-2xl bg-white dark:bg-gray-950/50 border border-gray-200 dark:border-gray-800 focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all shadow-sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 ml-1">Phone Number</label>
                    <input 
                      type="tel" 
                      value={formPhone} onChange={e => setFormPhone(e.target.value)}
                      className="w-full px-5 py-4 rounded-2xl bg-white dark:bg-gray-950/50 border border-gray-200 dark:border-gray-800 focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all shadow-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 ml-1">Location of Interest *</label>
                    <input 
                      type="text" required placeholder="e.g. Manchester, London"
                      value={formInterest} onChange={e => setFormInterest(e.target.value)}
                      className="w-full px-5 py-4 rounded-2xl bg-white dark:bg-gray-950/50 border border-gray-200 dark:border-gray-800 focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all shadow-sm"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 ml-1">Why are you a good fit? *</label>
                  <textarea 
                    rows={5} required 
                    value={formMessage} onChange={e => setFormMessage(e.target.value)}
                    className="w-full px-5 py-4 rounded-2xl bg-white dark:bg-gray-950/50 border border-gray-200 dark:border-gray-800 focus:ring-2 focus:ring-brand-500 focus:border-transparent resize-none transition-all shadow-sm"
                  />
                </div>

                <motion.button 
                  type="submit" 
                  disabled={submitting}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-5 bg-gradient-to-r from-brand-500 to-purple-600 text-white rounded-2xl font-extrabold text-xl shadow-[0_0_40px_rgba(14,165,233,0.3)] hover:shadow-[0_0_60px_rgba(14,165,233,0.5)] transition-all disabled:opacity-70 flex justify-center items-center gap-2 mt-8"
                >
                  {submitting ? <Loader2 className="w-6 h-6 animate-spin" /> : 'Submit Application'}
                </motion.button>
              </form>
            )}
          </motion.div>
        </div>
      </section>
    </div>
    </>
  );
}
