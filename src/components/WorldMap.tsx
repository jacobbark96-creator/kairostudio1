"use client";

import React, { useState, useEffect } from 'react';
import Map, { Marker, NavigationControl } from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';
import { supabase } from '../lib/supabase';
import { Loader2, MapPin } from 'lucide-react';
import BaliChatbotModal from './BaliChatbotModal';

interface Location {
  id: string;
  city_name: string;
  x_coordinate: number;
  y_coordinate: number;
  description: string;
  status: string;
}

interface WorldMapProps {
  hideTooltips?: boolean;
}

export default function WorldMap({ hideTooltips = false }: WorldMapProps) {
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);
  const [hoveredLocation, setHoveredLocation] = useState<Location | null>(null);
  const [showBaliChatbot, setShowBaliChatbot] = useState(false);
  
  const [viewState, setViewState] = useState({
    longitude: 0,
    latitude: 20,
    zoom: 1.2,
    pitch: 0,
    bearing: 0
  });

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
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="w-full h-full flex justify-center items-center bg-gray-200 dark:bg-gray-900 rounded-[2rem]">
        <Loader2 className="w-10 h-10 animate-spin text-brand-500" />
      </div>
    );
  }

  return (
    <>
      {!hideTooltips && <BaliChatbotModal isOpen={showBaliChatbot} onClose={() => setShowBaliChatbot(false)} />}
      
      <Map
        {...viewState}
        onMove={evt => setViewState(evt.viewState)}
        mapStyle="https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json"
        style={{ width: '100%', height: '100%', borderRadius: '2rem' }}
        minZoom={1}
        maxZoom={20}
        dragRotate={false}
        scrollZoom={false}
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
              {!hideTooltips && hoveredLocation?.id === loc.id && (
                <div className="absolute z-[100] bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-100 dark:border-gray-700 p-4 w-64 transform -translate-x-1/2 bottom-[calc(50%+14px)] left-1/2 transition-all duration-200 animate-in fade-in zoom-in-95 pointer-events-auto">
                  <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white dark:bg-gray-800 border-b border-r border-gray-100 dark:border-gray-700 rotate-45 pointer-events-none" />
                  <div className="relative z-10 pointer-events-none">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-bold text-lg text-gray-900 dark:text-white flex items-center gap-1.5">
                        <MapPin className="w-4 h-4 text-brand-500" />
                        {loc.city_name}
                      </h4>
                      <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${loc.status === 'pending' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' : loc.status === 'filled' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'}`}>
                        {loc.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed text-left whitespace-normal mb-3">
                      {loc.description}
                    </p>
                  </div>
                  {loc.city_name.toLowerCase() === 'bali' && (
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowBaliChatbot(true);
                      }}
                      className="w-full py-1.5 px-3 bg-brand-500/10 hover:bg-brand-500/20 text-brand-600 dark:text-brand-400 text-xs font-bold rounded-lg transition-colors border border-brand-500/20 flex items-center justify-center gap-1.5 relative z-20 pointer-events-auto"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-brand-500 animate-pulse" />
                      Treasure
                    </button>
                  )}
                </div>
              )}
            </div>
          </Marker>
        ))}
      </Map>
    </>
  );
}
