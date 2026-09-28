import React, { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { MapContainer, TileLayer, GeoJSON, Marker, Popup, useMap, CircleMarker } from 'react-leaflet';
import L from 'leaflet';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { 
  X, Thermometer, Droplets, Wind, Cloud, MapPin, Layers, TrendingUp, 
  AlertTriangle, Mountain, TreePine, Waves, Eye, Search, ChevronDown, 
  Loader2, Navigation, ArrowLeft, Globe, Building2, BarChart3, Wifi, 
  SearchX, Clock, ChevronUp, Check, Info, Sparkles
} from 'lucide-react';
import { useLang } from '../context/LanguageContext';
import { t } from '../i18n/translations';
import { 
  allStates, allDistricts, allBlocks, allPanchayats, getDistrict, 
  getDistrictBlocks, getDistrictPanchayats, getBlockPanchayats,
  findNearestPanchayat, tempToColor, rainToColor, confidenceToColor, 
  tempLegend, rainLegend, platformStats 
} from '../data/mockData';
import { fetchForecastCached } from '../services/weatherApi';
import { debouncedSearch } from '../services/geocodingApi';

function MapChangeCenter({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, zoom, { duration: 1.5 });
  }, [center, zoom, map]);
  return null;
}

const wmoIcon = (code) => {
  if (code === 0) return '☀️';
  if (code === 1 || code === 2 || code === 3) return '🌤️';
  if (code === 45 || code === 48) return '🌫️';
  if (code >= 51 && code <= 67) return '🌧️';
  if (code >= 71 && code <= 77) return '❄️';
  if (code >= 80 && code <= 82) return '🌦️';
  if (code >= 95) return '⛈️';
  return '☁️';
};

// High-fidelity fallback hourly curve generator (diurnal solar model)
const generateSimulatedHourly = (dayForecast, dateStr) => {
  const hours = [];
  const minT = dayForecast?.tempLow ?? 20;
  const maxT = dayForecast?.tempHigh ?? 32;
  const dayRain = dayForecast?.rainfall ?? 0;
  
  for (let h = 0; h < 24; h++) {
    // Diurnal temperature curve: minimum around 5:30 AM, peak around 2:30 PM
    const norm = ((h - 5.5 + 24) % 24) / 24;
    const tempFactor = 0.5 - 0.5 * Math.cos(norm * 2 * Math.PI);
    const temp = +(minT + (maxT - minT) * Math.pow(tempFactor, 1.25)).toFixed(1);
    
    // Relative humidity inversely related to temperature
    const humidity = Math.round(92 - ((temp - minT) / Math.max(1, maxT - minT)) * 46);
    
    // Convective rain concentrated in afternoon/evening (13h-19h)
    const isRainWindow = h >= 13 && h <= 18;
    const rain = isRainWindow && dayRain > 0 ? +(dayRain * 0.24 + Math.sin(h) * 0.3).toFixed(1) : 0;
    
    const icon = rain > 2 ? '🌧️' : rain > 0 ? '🌦️' : h < 6 || h > 19 ? '🌙' : temp > 36 ? '🌡️' : '☀️';
    
    const d = new Date(`${dateStr}T00:00:00`);
    d.setHours(h);
    const hourLabel = d.toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit', hour12: true });
    
    hours.push({
      hour: hourLabel,
      temp,
      humidity,
      rain: Math.max(0, rain),
      wind: Math.round(8 + Math.sin(h * 0.5) * 6),
      icon,
    });
  }
  return hours;
};

export default function MapDashboard() {
  const { lang } = useLang();
  
  // Navigation State
  const [navLevel, setNavLevel] = useState('india'); // 'india', 'state', 'district'
  const [activeStateId, setActiveStateId] = useState(null);
  const [activeDistrictId, setActiveDistrictId] = useState(null);
  
  // View State
  const [viewLevel, setViewLevel] = useState('panchayat'); // 'block' or 'panchayat'
  const [activeLayer, setActiveLayer] = useState('temperature'); // 'temperature' or 'rainfall'
  const [selectedPanchayat, setSelectedPanchayat] = useState(null);
  const [selectedBlock, setSelectedBlock] = useState(null);
  const [hoveredFeature, setHoveredFeature] = useState(null);
  
  // Map State
  const [mapCenter, setMapCenter] = useState([22.5, 82]);
  const [mapZoom, setMapZoom] = useState(5);
  const [searchMarker, setSearchMarker] = useState(null);
  
  // Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  
  // Live Forecast State
  const [liveForecast, setLiveForecast] = useState(null);
  const [isLiveLoading, setIsLiveLoading] = useState(false);

  // Hourly Expansion State
  const [expandedDay, setExpandedDay] = useState(null);
  const [hourlyData, setHourlyData] = useState(null);
  const [isHourlyLoading, setIsHourlyLoading] = useState(false);

  // Search effect
  useEffect(() => {
    let isActive = true;
    if (searchQuery.trim().length > 2) {
      setIsSearching(true);
      debouncedSearch(searchQuery)
        .then(results => {
          if (isActive) {
            setSearchResults(results.slice(0, 6));
            setShowDropdown(true);
            setIsSearching(false);
          }
        })
        .catch(() => {
          if (isActive) setIsSearching(false);
        });
    } else {
      setSearchResults([]);
      setShowDropdown(false);
    }
    return () => { isActive = false; };
  }, [searchQuery]);

  // Live weather fetch effect when a panchayat is selected
  useEffect(() => {
    let isActive = true;
    if (selectedPanchayat) {
      setLiveForecast(null);
      setIsLiveLoading(true);
      setExpandedDay(null);
      setHourlyData(null);
      const [lat, lng] = selectedPanchayat.center;
      fetchForecastCached(lat, lng)
        .then(res => {
          if (isActive && res) {
            setLiveForecast(res);
          }
          if (isActive) setIsLiveLoading(false);
        })
        .catch(() => {
          if (isActive) setIsLiveLoading(false);
        });
    }
    return () => { isActive = false; };
  }, [selectedPanchayat]);

  // Hourly fetch / expand handler
  const handleDayClick = async (idx) => {
    if (expandedDay === idx) {
      setExpandedDay(null);
      setHourlyData(null);
      return;
    }
    setExpandedDay(idx);
    setIsHourlyLoading(true);
    
    const d = new Date();
    d.setDate(d.getDate() + idx);
    const dateStr = d.toISOString().split('T')[0];
    const targetDay = (liveForecast?.days || selectedPanchayat?.fiveDayForecast || selectedBlock?.forecast)?.[idx];

    try {
      const coords = selectedPanchayat ? selectedPanchayat.center : (selectedBlock ? selectedBlock.center : [28.6, 77.2]);
      const params = new URLSearchParams({
        latitude: coords[0].toFixed(4),
        longitude: coords[1].toFixed(4),
        hourly: 'temperature_2m,relative_humidity_2m,precipitation,wind_speed_10m,weather_code',
        timezone: 'Asia/Kolkata',
        start_date: dateStr,
        end_date: dateStr,
      });

      // Quick timeout fallback (3.5s) so user never waits forever
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3500);
      
      const res = await fetch(`https://api.open-meteo.com/v1/forecast?${params}`, { signal: controller.signal });
      clearTimeout(timeoutId);
      
      if (res.ok) {
        const data = await res.json();
        const mapped = data.hourly.time.map((t, i) => ({
          hour: new Date(t).toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit', hour12: true }),
          temp: data.hourly.temperature_2m[i],
          humidity: data.hourly.relative_humidity_2m[i],
          rain: data.hourly.precipitation[i],
          wind: data.hourly.wind_speed_10m[i],
          icon: wmoIcon(data.hourly.weather_code[i]),
        }));
        setHourlyData(mapped);
      } else {
        setHourlyData(generateSimulatedHourly(targetDay, dateStr));
      }
    } catch {
      // Graceful instant fallback to mathematical solar model
      setHourlyData(generateSimulatedHourly(targetDay, dateStr));
    } finally {
      setIsHourlyLoading(false);
    }
  };

  // Navigation Handlers
  const goIndia = () => {
    setNavLevel('india');
    setActiveStateId(null);
    setActiveDistrictId(null);
    setMapCenter([22.5, 82]);
    setMapZoom(5);
    setSelectedPanchayat(null);
    setSelectedBlock(null);
    setHoveredFeature(null);
  };
  
  const goState = (stateId) => {
    const s = allStates.find(x => x.id === stateId);
    if (!s) return;
    setNavLevel('state');
    setActiveStateId(stateId);
    setActiveDistrictId(null);
    setMapCenter(s.center);
    setMapZoom(s.zoom);
    setSelectedPanchayat(null);
    setSelectedBlock(null);
    setHoveredFeature(null);
  };
  
  const goDistrict = (distId) => {
    const d = allDistricts.find(x => x.id === distId);
    if (!d) return;
    setNavLevel('district');
    setActiveStateId(d.stateId);
    setActiveDistrictId(distId);
    setMapCenter(d.center);
    setMapZoom(d.zoom);
    setSelectedBlock(null);
    setHoveredFeature(null);
    // Auto-select first panchayat to display immediate rich sidebar data
    const pList = getDistrictPanchayats(distId);
    if (pList.length > 0) {
      setSelectedPanchayat(pList[0]);
    }
  };

  const handleSearchResult = (res) => {
    setSearchQuery('');
    setShowDropdown(false);
    setMapCenter([res.lat, res.lng]);
    setMapZoom(11);
    setSearchMarker({ lat: res.lat, lng: res.lng, name: res.displayName });
    
    const nearest = findNearestPanchayat(res.lat, res.lng);
    if (nearest) {
      goDistrict(nearest.districtId);
      setSelectedPanchayat(nearest);
    }
  };

  const styleGeoJSON = (feature) => {
    const props = feature.properties;
    let val = props.tempHigh;
    if (activeLayer === 'rainfall') val = props.rainfall;
    
    const fillColor = activeLayer === 'temperature' ? tempToColor(val || 28) : rainToColor(val || 5);
    const isSelected = selectedPanchayat && selectedPanchayat.id === props.id;
    const isBlockSelected = selectedBlock && selectedBlock.id === props.id;

    return {
      fillColor,
      weight: isSelected || isBlockSelected ? 3 : 1.5,
      opacity: 1,
      color: isSelected || isBlockSelected ? '#000000' : '#ffffff',
      dashArray: props.type === 'block' ? '4' : '',
      fillOpacity: isSelected || isBlockSelected ? 0.9 : 0.72
    };
  };

  const onEachFeature = (feature, layer) => {
    const props = feature.properties;
    
    // Rich, land-accurate tooltip content
    const tooltipHtml = `
      <div style="font-family: sans-serif; padding: 6px 10px; min-width: 150px; line-height: 1.4;">
        <div style="font-weight: 700; font-size: 13px; color: #111827; border-bottom: 1px solid #e5e7eb; padding-bottom: 3px; margin-bottom: 4px;">
          ${lang === 'hi' && props.nameHi ? props.nameHi : props.name}
          <span style="font-size: 10px; font-weight: normal; color: #6b7280; text-transform: uppercase; margin-left: 4px; background: #f3f4f6; padding: 1px 4px; rounded: 4px;">
            ${props.type === 'block' ? (lang === 'hi' ? 'ब्लॉक' : 'Block') : (lang === 'hi' ? 'पंचायत' : 'Panchayat')}
          </span>
        </div>
        <div style="font-size: 11px; color: #4b5563; margin-bottom: 4px;">
          ${props.districtName ? `${props.districtName}, ` : ''}${props.stateName || ''}
        </div>
        <div style="display: flex; gap: 8px; font-size: 12px; margin-top: 3px;">
          <span style="color: #ea580c; font-weight: 600;">🌡 ${props.tempHigh}°C</span>
          <span style="color: #2563eb; font-weight: 600;">🌧 ${props.rainfall}mm</span>
          ${props.elevation ? `<span style="color: #4b5563;">⛰ ${props.elevation}m</span>` : ''}
        </div>
        ${props.panchayatCount ? `<div style="font-size: 10px; color: #059669; margin-top: 4px;">✔ ${props.panchayatCount} Panchayats</div>` : ''}
        <div style="font-size: 10px; color: #9ca3af; margin-top: 3px; font-style: italic;">
          ${lang === 'hi' ? 'क्लिक करके पूर्वानुमान देखें' : 'Click to inspect forecast'}
        </div>
      </div>
    `;

    layer.bindTooltip(tooltipHtml, { 
      sticky: true, 
      opacity: 0.98,
      direction: 'top',
      className: 'leaflet-tooltip-custom' 
    });

    layer.on({
      mouseover: (e) => {
        const target = e.target;
        target.setStyle({
          weight: 3,
          color: '#1f2937',
          fillOpacity: 0.92
        });
        target.bringToFront();
        setHoveredFeature(props);
      },
      mouseout: (e) => {
        const target = e.target;
        const isSelected = (selectedPanchayat && selectedPanchayat.id === props.id) || (selectedBlock && selectedBlock.id === props.id);
        target.setStyle({
          weight: isSelected ? 3 : 1.5,
          color: isSelected ? '#000000' : '#ffffff',
          fillOpacity: isSelected ? 0.9 : 0.72
        });
        setHoveredFeature(null);
      },
      click: () => {
        if (props.type === 'panchayat') {
          const selected = allPanchayats.find(p => p.id === props.id);
          if (selected) {
            setSelectedPanchayat(selected);
            setSelectedBlock(null);
            setMapCenter(selected.center);
          }
        } else {
          // Block clicked: inspect block details & its panchayats
          const blk = allBlocks.find(b => b.id === props.id);
          if (blk) {
            setSelectedBlock(blk);
            const pFirst = allPanchayats.find(p => p.blockId === blk.id);
            if (pFirst) {
              setSelectedPanchayat(pFirst);
            }
            setMapCenter(blk.center);
          }
        }
      }
    });
  };

  const activeState = allStates.find(s => s.id === activeStateId);
  const activeDistrict = allDistricts.find(d => d.id === activeDistrictId);
  
  let geojsonData = null;
  if (navLevel === 'district' && activeDistrict) {
    const fullDist = getDistrict(activeDistrict.id);
    geojsonData = viewLevel === 'block' ? fullDist?.blockGeoJSON : fullDist?.panchayatGeoJSON;
  }

  const legendData = activeLayer === 'temperature' ? tempLegend : rainLegend;
  const forecastData = liveForecast || (selectedPanchayat ? { days: selectedPanchayat.fiveDayForecast, isLive: false } : null);

  const customMarkerIcon = new L.Icon({
    iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });

  return (
    <>
      <style>{`
        .leaflet-tooltip-custom {
          background: rgba(255, 255, 255, 0.98);
          border: 1px solid #d1d5db;
          border-radius: 10px;
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
          padding: 0;
          color: #111827;
        }
        .leaflet-tooltip-custom::before { border-top-color: #d1d5db; }
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      <div className="relative w-full h-[calc(100vh-56px)] bg-gray-50 flex flex-col overflow-hidden">
        
        {/* Top Control Bar */}
        <div className="bg-white border-b border-gray-200 shadow-sm z-20 w-full p-2.5 lg:px-4 flex flex-col gap-2">
          
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
            
            {/* Left: Breadcrumbs & Search */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2.5 w-full md:w-auto">
              
              {/* Breadcrumbs */}
              <div className="flex items-center text-xs sm:text-sm text-gray-600 bg-gray-100 rounded-lg px-2.5 py-1.5 whitespace-nowrap overflow-x-auto max-w-full hide-scrollbar border border-gray-200">
                <button onClick={goIndia} className="hover:text-green-700 font-semibold flex items-center text-gray-800 transition-colors">
                  <Globe size={15} className="mr-1 text-green-600" /> {lang === 'hi' ? 'भारत' : 'India'}
                </button>
                {activeState && (
                  <>
                    <span className="mx-1.5 text-gray-400">/</span>
                    <button onClick={() => goState(activeState.id)} className="hover:text-green-700 font-medium text-gray-700 transition-colors">
                      {lang === 'hi' ? activeState.nameHi : activeState.name}
                    </button>
                  </>
                )}
                {activeDistrict && (
                  <>
                    <span className="mx-1.5 text-gray-400">/</span>
                    <span className="text-green-800 font-bold bg-green-50 px-2 py-0.5 rounded border border-green-200 truncate">
                      {lang === 'hi' ? activeDistrict.nameHi : activeDistrict.name}
                    </span>
                  </>
                )}
              </div>
              
              {/* Search Bar */}
              <div className="relative w-full sm:w-72">
                <div className="relative">
                  <input 
                    type="text" 
                    placeholder={lang === 'hi' ? 'स्थान, गाँव या जिला खोजें...' : 'Search location, village or district...'}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-3 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm shadow-inner"
                  />
                  <div className="absolute left-2.5 top-2 text-gray-400">
                    {isSearching ? <Loader2 size={16} className="animate-spin text-green-600" /> : <Search size={16} />}
                  </div>
                </div>
                
                {showDropdown && searchResults.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden z-50 max-h-60 overflow-y-auto">
                    {searchResults.map((res, i) => (
                      <button 
                        key={i}
                        onClick={() => handleSearchResult(res)}
                        className="w-full text-left px-3 py-2.5 hover:bg-green-50 border-b border-gray-100 last:border-0 flex flex-col transition-colors"
                      >
                        <span className="text-sm font-semibold text-gray-900 truncate">{res.displayName}</span>
                        <span className="text-xs text-gray-500 truncate">{res.district || res.village || ''}, {res.state || 'India'}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Right: Selectors & Toggles */}
            <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
              
              {/* Always-Active Cascading Selectors */}
              <div className="flex gap-2 w-full sm:w-auto">
                <select 
                  className="border border-gray-300 rounded-lg py-1.5 px-2.5 text-xs sm:text-sm bg-white font-medium focus:ring-2 focus:ring-green-500 flex-1 sm:flex-none shadow-sm cursor-pointer"
                  value={activeStateId || ''}
                  onChange={(e) => {
                    if (e.target.value) goState(e.target.value);
                    else goIndia();
                  }}
                >
                  <option value="">{lang === 'hi' ? 'सभी 12 राज्य' : 'All 12 States'}</option>
                  {allStates.map(s => (
                    <option key={s.id} value={s.id}>{lang === 'hi' ? s.nameHi : s.name}</option>
                  ))}
                </select>
                
                {/* ALWAYS ENABLED District Selector */}
                <select 
                  className="border border-gray-300 rounded-lg py-1.5 px-2.5 text-xs sm:text-sm bg-white font-medium focus:ring-2 focus:ring-green-500 flex-1 sm:flex-none shadow-sm cursor-pointer"
                  value={activeDistrictId || ''}
                  onChange={(e) => e.target.value && goDistrict(e.target.value)}
                >
                  <option value="">
                    {activeStateId 
                      ? (lang === 'hi' ? 'जिला चुनें' : 'Select District') 
                      : (lang === 'hi' ? `सभी 24 जिले (${allDistricts.length})` : `All 24 Districts (${allDistricts.length})`)}
                  </option>
                  {activeStateId ? (
                    allDistricts.filter(d => d.stateId === activeStateId).map(d => (
                      <option key={d.id} value={d.id}>{lang === 'hi' ? d.nameHi : d.name}</option>
                    ))
                  ) : (
                    allStates.map(s => (
                      <optgroup key={s.id} label={`── ${lang === 'hi' ? s.nameHi : s.name} ──`}>
                        {allDistricts.filter(d => d.stateId === s.id).map(d => (
                          <option key={d.id} value={d.id}>{lang === 'hi' ? d.nameHi : d.name}</option>
                        ))}
                      </optgroup>
                    ))
                  )}
                </select>
              </div>
              
              {/* View & Layer Toggles (Visible in District View) */}
              {navLevel === 'district' && (
                <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-lg border border-gray-200">
                  <div className="flex rounded-md overflow-hidden bg-white border border-gray-200 shadow-xs">
                    <button 
                      className={`px-2.5 py-1 text-xs font-semibold transition-colors ${viewLevel === 'block' ? 'bg-green-600 text-white' : 'text-gray-600 hover:text-gray-900'}`}
                      onClick={() => setViewLevel('block')}
                    >
                      {lang === 'hi' ? 'ब्लॉक स्तर' : 'Block Level'}
                    </button>
                    <button 
                      className={`px-2.5 py-1 text-xs font-semibold transition-colors ${viewLevel === 'panchayat' ? 'bg-green-600 text-white' : 'text-gray-600 hover:text-gray-900'}`}
                      onClick={() => setViewLevel('panchayat')}
                    >
                      {lang === 'hi' ? 'पंचायत स्तर' : 'Panchayat Level'}
                    </button>
                  </div>
                  
                  <div className="flex rounded-md overflow-hidden bg-white border border-gray-200 shadow-xs">
                    <button 
                      className={`px-2 py-1 text-xs font-medium flex items-center transition-colors ${activeLayer === 'temperature' ? 'bg-orange-500 text-white' : 'text-gray-600 hover:text-gray-900'}`}
                      onClick={() => setActiveLayer('temperature')}
                    >
                      <Thermometer size={13} className="mr-1" /> {lang === 'hi' ? 'तापमान' : 'Temp'}
                    </button>
                    <button 
                      className={`px-2 py-1 text-xs font-medium flex items-center transition-colors ${activeLayer === 'rainfall' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:text-gray-900'}`}
                      onClick={() => setActiveLayer('rainfall')}
                    >
                      <Droplets size={13} className="mr-1" /> {lang === 'hi' ? 'वर्षा' : 'Rain'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Quick District Navigation Bar — All 24 Districts Visibly Accessible */}
          <div className="flex items-center gap-1.5 overflow-x-auto hide-scrollbar pt-1 text-xs border-t border-gray-100">
            <span className="text-gray-400 font-medium shrink-0 flex items-center mr-1">
              <Sparkles size={12} className="text-amber-500 mr-1" />
              {lang === 'hi' ? 'प्रमुख जिले:' : 'Districts:'}
            </span>
            {allDistricts.map(d => {
              const isSelected = activeDistrictId === d.id;
              return (
                <button
                  key={d.id}
                  onClick={() => goDistrict(d.id)}
                  className={`px-2.5 py-0.5 rounded-full whitespace-nowrap transition-all text-xs font-medium border ${
                    isSelected 
                      ? 'bg-green-700 text-white border-green-800 shadow-xs scale-105' 
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-700 border-gray-200'
                  }`}
                >
                  {lang === 'hi' ? d.nameHi : d.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* Main Map Area */}
        <div className="flex-1 relative">
          <MapContainer 
            center={mapCenter} 
            zoom={mapZoom} 
            style={{ width: '100%', height: '100%', zIndex: 0 }}
            zoomControl={false}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <MapChangeCenter center={mapCenter} zoom={mapZoom} />

            {/* Search Location Marker */}
            {searchMarker && (
              <Marker position={[searchMarker.lat, searchMarker.lng]} icon={customMarkerIcon}>
                <Popup>{searchMarker.name}</Popup>
              </Marker>
            )}

            {/* India Level: All 24 District Markers Visible with Rich Popups */}
            {navLevel === 'india' && allDistricts.map(d => (
              <CircleMarker 
                key={d.id}
                center={d.center}
                radius={7}
                fillColor="#0284c7"
                color="#ffffff"
                weight={2}
                fillOpacity={0.88}
                eventHandlers={{ click: () => goDistrict(d.id) }}
              >
                <Popup>
                  <div className="text-center p-1">
                    <div className="font-bold text-sm text-gray-900">{lang === 'hi' ? d.nameHi : d.name}</div>
                    <div className="text-xs text-gray-500">{d.stateName} • {d.climate?.zone}</div>
                    <div className="text-xs font-semibold text-green-700 mt-1">
                      {d.climate?.baseTempH}°C • {d.climate?.baseRain}mm rain
                    </div>
                    <button 
                      onClick={() => goDistrict(d.id)} 
                      className="mt-2 w-full py-1 bg-green-600 text-white text-xs font-semibold rounded hover:bg-green-700 transition-colors shadow-xs"
                    >
                      {lang === 'hi' ? 'पंचायत मानचित्र खोलें' : 'Open Panchayat Map'} &rarr;
                    </button>
                  </div>
                </Popup>
              </CircleMarker>
            ))}

            {/* State Level: District Markers for selected state */}
            {navLevel === 'state' && allDistricts.filter(d => d.stateId === activeStateId).map(d => (
              <CircleMarker 
                key={d.id}
                center={d.center}
                radius={9}
                fillColor="#16a34a"
                color="#ffffff"
                weight={2.5}
                fillOpacity={0.9}
                eventHandlers={{ click: () => goDistrict(d.id) }}
              >
                <Popup>
                  <div className="text-center p-1">
                    <div className="font-bold text-sm text-gray-900">{lang === 'hi' ? d.nameHi : d.name}</div>
                    <div className="text-xs text-gray-500">{d.stateName}</div>
                    <button 
                      onClick={() => goDistrict(d.id)} 
                      className="mt-2 w-full py-1 bg-blue-600 text-white text-xs font-semibold rounded hover:bg-blue-700 transition-colors"
                    >
                      {lang === 'hi' ? 'देखें' : 'View District'} &rarr;
                    </button>
                  </div>
                </Popup>
              </CircleMarker>
            ))}

            {/* District Level: Organic, Land-Accurate Choropleth */}
            {navLevel === 'district' && geojsonData && (
              <GeoJSON 
                key={`${activeDistrictId}-${viewLevel}-${activeLayer}`}
                data={geojsonData}
                style={styleGeoJSON}
                onEachFeature={onEachFeature}
              />
            )}
          </MapContainer>

          {/* Prominent Live Hover Card (Guarantees hover info is 100% visible) */}
          {hoveredFeature && (
            <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-md px-4 py-2.5 rounded-xl shadow-xl border border-gray-200 z-[1000] text-sm pointer-events-none transition-all flex items-center gap-4">
              <div>
                <div className="font-bold text-gray-900 flex items-center gap-1.5">
                  <span 
                    className="w-3 h-3 rounded-full shrink-0 shadow-xs" 
                    style={{ backgroundColor: activeLayer === 'temperature' ? tempToColor(hoveredFeature.tempHigh) : rainToColor(hoveredFeature.rainfall) }}
                  ></span>
                  {lang === 'hi' && hoveredFeature.nameHi ? hoveredFeature.nameHi : hoveredFeature.name}
                  <span className="text-[10px] font-semibold text-gray-600 uppercase px-1.5 py-0.5 bg-gray-100 rounded ml-1 border border-gray-200">
                    {hoveredFeature.type === 'block' ? (lang === 'hi' ? 'ब्लॉक' : 'Block') : (lang === 'hi' ? 'पंचायत' : 'Panchayat')}
                  </span>
                </div>
                <div className="text-xs text-gray-500 mt-0.5">
                  {hoveredFeature.districtName}, {hoveredFeature.stateName}
                </div>
              </div>
              <div className="flex items-center gap-3 pl-3 border-l border-gray-200 text-xs">
                <div className="text-center">
                  <div className="text-gray-400 font-medium">Temp</div>
                  <div className="font-bold text-orange-600">{hoveredFeature.tempHigh}°C</div>
                </div>
                <div className="text-center">
                  <div className="text-gray-400 font-medium">Rain</div>
                  <div className="font-bold text-blue-600">{hoveredFeature.rainfall}mm</div>
                </div>
                {hoveredFeature.elevation && (
                  <div className="text-center hidden sm:block">
                    <div className="text-gray-400 font-medium">Elev</div>
                    <div className="font-bold text-gray-700">{hoveredFeature.elevation}m</div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* India Level Guidance Banner */}
          {navLevel === 'india' && (
            <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-white/95 backdrop-blur-md px-5 py-2 rounded-full shadow-lg border border-gray-200 pointer-events-none z-[1000] flex items-center gap-2">
              <span className="w-2.5 h-2.5 bg-blue-500 rounded-full animate-pulse"></span>
              <p className="font-semibold text-gray-800 text-xs sm:text-sm">
                {lang === 'hi' 
                  ? 'संपूर्ण भारत — मानचित्र पर किसी भी जिले पर क्लिक करें या ऊपर से चुनें' 
                  : 'All India — Click any district marker or select from top'}
              </p>
            </div>
          )}

          {/* Map Legend */}
          {navLevel === 'district' && (
            <div className="absolute bottom-6 left-6 bg-white/95 backdrop-blur-sm p-3 rounded-xl shadow-lg border border-gray-200 z-[1000] text-xs max-w-xs">
              <div className="font-bold text-gray-800 mb-2 flex items-center justify-between">
                <span>{activeLayer === 'temperature' ? (lang === 'hi' ? 'तापमान लीजेंड' : 'Temperature Scale') : (lang === 'hi' ? 'वर्षा लीजेंड' : 'Rainfall Scale')}</span>
                <span className="text-[10px] text-gray-500 font-normal">
                  {activeLayer === 'temperature' ? '°C' : 'mm'}
                </span>
              </div>
              <div className="flex gap-1">
                {legendData.map((item, idx) => (
                  <div key={idx} className="flex-1 flex flex-col items-center">
                    <div className="w-full h-3 rounded-xs" style={{ backgroundColor: item.color }} />
                    <span className="text-[9px] text-gray-600 mt-1 whitespace-nowrap scale-90">{item.label}</span>
                  </div>
                ))}
              </div>
              {forecastData?.isLive && (
                <div className="mt-2 text-[10px] text-gray-400 italic text-center">Powered by Open-Meteo</div>
              )}
            </div>
          )}

          {/* Side Panel for Selected Panchayat or Block */}
          <div className={`absolute top-0 right-0 h-full w-full sm:w-[440px] bg-white shadow-2xl z-[1500] transform transition-transform duration-300 ease-in-out flex flex-col ${selectedPanchayat ? 'translate-x-0' : 'translate-x-full'}`}>
            {selectedPanchayat && (
              <>
                {/* Header */}
                <div className="p-4 border-b border-gray-200 bg-white flex justify-between items-start sticky top-0 z-10 shadow-xs">
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-xl font-bold text-gray-900">
                        {lang === 'hi' ? selectedPanchayat.nameHi : selectedPanchayat.name}
                      </h2>
                      {selectedPanchayat.elevation > 1200 && (
                        <span className="bg-blue-100 text-blue-800 text-[10px] px-2 py-0.5 rounded-full font-semibold flex items-center">
                          <Mountain size={10} className="mr-0.5" /> High Alt
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {lang === 'hi' ? 'ब्लॉक' : 'Block'}: <span className="font-semibold text-gray-700">{selectedPanchayat.blockName}</span> • {selectedPanchayat.districtName}, {selectedPanchayat.stateName}
                    </p>
                  </div>
                  <button 
                    onClick={() => setSelectedPanchayat(null)}
                    className="p-1.5 bg-gray-100 text-gray-500 rounded-full hover:bg-gray-200 hover:text-gray-800 transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>

                {/* Content Body */}
                <div className="flex-1 overflow-y-auto p-4 space-y-5 bg-gray-50 hide-scrollbar">
                  
                  {/* Forecast Header with Live Indicator */}
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-gray-800 flex items-center">
                      <Cloud className="mr-1.5 text-blue-500" size={17} />
                      {t(lang, 'dashboard.fiveDayForecast')}
                      <span className="ml-2 text-[10px] font-normal text-gray-400">
                        ({lang === 'hi' ? 'प्रति घंटा देखने हेतु टैप करें' : 'tap any day for hourly'})
                      </span>
                    </h3>
                    {isLiveLoading ? (
                      <span className="flex items-center text-xs font-medium bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full">
                        <Loader2 size={11} className="animate-spin mr-1" /> Loading...
                      </span>
                    ) : forecastData?.isLive ? (
                      <span className="flex items-center text-xs font-semibold bg-red-100 text-red-700 px-2.5 py-0.5 rounded-full border border-red-200 shadow-xs">
                        <Wifi size={11} className="mr-1 text-red-600" /> 🔴 LIVE
                      </span>
                    ) : (
                      <span className="flex items-center text-xs font-medium bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full">
                        Simulated
                      </span>
                    )}
                  </div>

                  {/* 5-Day Forecast Cards (Clickable & Expandable to Hourly) */}
                  {forecastData?.days && (
                    <div className="flex flex-col gap-2">
                      <div className="flex overflow-x-auto pb-2 gap-2.5 snap-x hide-scrollbar">
                        {forecastData.days.map((day, idx) => {
                          const isExpanded = expandedDay === idx;
                          return (
                            <div 
                              key={idx} 
                              onClick={() => handleDayClick(idx)}
                              className={`min-w-[110px] cursor-pointer rounded-xl border p-2.5 snap-start flex flex-col items-center justify-between shadow-xs transition-all ${
                                isExpanded 
                                  ? 'bg-green-100 border-green-600 ring-2 ring-green-500 scale-102' 
                                  : idx === 0 
                                    ? 'bg-green-50/70 border-green-200 hover:border-green-400' 
                                    : 'bg-white border-gray-200 hover:border-gray-400'
                              }`}
                            >
                              <span className={`text-[11px] font-bold ${idx === 0 ? 'text-green-800' : 'text-gray-600'}`}>
                                {idx === 0 ? (lang === 'hi' ? 'आज' : 'Today') : day.dateLabel}
                              </span>
                              <div className="text-2xl my-1.5">{day.icon}</div>
                              <div className="flex items-center justify-center gap-1.5 w-full text-xs font-bold text-gray-900">
                                <span>{day.tempHigh}°</span>
                                <span className="text-gray-400 font-normal">{day.tempLow}°</span>
                              </div>
                              <div className="flex items-center justify-between w-full mt-1.5 pt-1.5 border-t border-gray-200 text-[10px]">
                                <div className="flex items-center text-blue-600 font-medium">
                                  <Droplets size={11} className="mr-0.5" />
                                  <span>{day.rainfall}mm</span>
                                </div>
                                <span className="text-[10px] text-green-700 font-semibold flex items-center">
                                  {isExpanded ? <ChevronUp size={11} /> : <Clock size={11} />}
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* Hourly Weather Expansion Section */}
                      {expandedDay !== null && (
                        <div className="bg-white rounded-xl border border-green-300 p-3 shadow-md animate-fade-in">
                          <div className="flex items-center justify-between pb-2 mb-2 border-b border-gray-100">
                            <div className="flex items-center gap-1.5">
                              <Clock size={14} className="text-green-600" />
                              <h4 className="text-xs font-bold text-gray-800">
                                {lang === 'hi' ? '24 घंटे का मौसम' : '24-Hour Weather'} — {forecastData.days[expandedDay]?.dateLabel}
                              </h4>
                            </div>
                            <button 
                              onClick={() => { setExpandedDay(null); setHourlyData(null); }}
                              className="text-gray-400 hover:text-gray-700 p-0.5 rounded"
                            >
                              <X size={14} />
                            </button>
                          </div>

                          {isHourlyLoading ? (
                            <div className="py-6 flex flex-col items-center justify-center gap-2">
                              <Loader2 size={22} className="animate-spin text-green-600" />
                              <span className="text-xs text-gray-500">Loading hourly timeline...</span>
                            </div>
                          ) : hourlyData && (
                            <div className="overflow-x-auto hide-scrollbar">
                              <div className="flex gap-2 min-w-max pb-1">
                                {hourlyData.map((h, hi) => (
                                  <div key={hi} className="flex flex-col items-center min-w-[58px] p-2 rounded-lg bg-gray-50 border border-gray-200 text-[11px] shadow-2xs">
                                    <span className="text-gray-500 font-semibold text-[10px] whitespace-nowrap">{h.hour}</span>
                                    <span className="text-lg my-1">{h.icon}</span>
                                    <span className="font-bold text-gray-900">{h.temp}°</span>
                                    <div className="flex items-center text-blue-600 text-[10px] mt-0.5">
                                      <Droplets size={10} className="mr-0.5" />{h.rain}mm
                                    </div>
                                    <div className="text-[9px] text-gray-400 mt-0.5">
                                      {h.humidity}%
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Uncertainty Chart */}
                  {forecastData?.days && (
                    <div className="bg-white rounded-xl shadow-xs border border-gray-200 p-3.5">
                      <div className="flex justify-between items-end mb-3">
                        <div>
                          <h3 className="text-xs font-bold text-gray-800 uppercase tracking-wider">{t(lang, 'dashboard.temperatureUncertainty')}</h3>
                          <p className="text-[11px] text-gray-500 mt-0.5">Confidence interval (High/Low variation band)</p>
                        </div>
                        <div className="text-right">
                          <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-green-50 text-green-700 border border-green-200">
                            {forecastData.days[0].confidence}% Confidence
                          </span>
                        </div>
                      </div>
                      <div className="h-36 w-full -ml-3">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={forecastData.days} margin={{ top: 5, right: 0, left: 0, bottom: 0 }}>
                            <defs>
                              <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#f97316" stopOpacity={0.35}/>
                                <stop offset="95%" stopColor="#f97316" stopOpacity={0.02}/>
                              </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                            <XAxis dataKey="dateLabel" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#6b7280' }} dy={8} />
                            <YAxis hide domain={['dataMin - 2', 'dataMax + 2']} />
                            <Tooltip 
                              contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                              labelStyle={{ color: '#111827', fontWeight: 'bold' }}
                            />
                            <Area type="monotone" dataKey="tempHighUpper" stroke="none" fill="url(#colorTemp)" />
                            <Area type="monotone" dataKey="tempHigh" stroke="#ea580c" strokeWidth={2.5} fill="none" />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  )}

                  {/* Explainability Card */}
                  <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-xl shadow-xs border border-indigo-100 p-3.5">
                    <h3 className="text-xs font-bold text-indigo-900 mb-2.5 flex items-center uppercase tracking-wider">
                      <Eye size={15} className="mr-1.5 text-indigo-600" />
                      {t(lang, 'dashboard.whyThesePredictions')}
                    </h3>
                    
                    <div className="space-y-2.5">
                      {/* Elevation Factor */}
                      <div className="flex gap-2.5 items-start">
                        <div className="mt-0.5 bg-white p-1.5 rounded-lg shadow-2xs text-indigo-600">
                          <Mountain size={14} />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-indigo-950">Elevation Profile ({selectedPanchayat.elevation}m)</div>
                          <div className="text-[11px] text-indigo-800 leading-relaxed mt-0.5">
                            {selectedPanchayat.elevation > 1000 
                              ? "High mountain altitude reduces ambient temperature by ~2.5°C compared to block plains." 
                              : "Standard foothill/plain elevation. Normal diurnal heating gradients apply."}
                          </div>
                        </div>
                      </div>

                      {/* Water Proximity Factor */}
                      <div className="flex gap-2.5 items-start">
                        <div className="mt-0.5 bg-white p-1.5 rounded-lg shadow-2xs text-blue-600">
                          <Waves size={14} />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-indigo-950">Water Body Proximity ({selectedPanchayat.distToWater} km)</div>
                          <div className="text-[11px] text-indigo-800 leading-relaxed mt-0.5">
                            {selectedPanchayat.distToWater < 3 
                              ? `Close to active water channel (${selectedPanchayat.distToWater} km). Moderates heatwaves and elevates local relative humidity.` 
                              : `Located ${selectedPanchayat.distToWater} km from major surface water. Exhibits sharper day-night temperature swings.`}
                          </div>
                        </div>
                      </div>

                      {/* Land Use Factor */}
                      <div className="flex gap-2.5 items-start">
                        <div className="mt-0.5 bg-white p-1.5 rounded-lg shadow-2xs text-green-600">
                          <TreePine size={14} />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-indigo-950">Land-Cover Type ({selectedPanchayat.landUse})</div>
                          <div className="text-[11px] text-indigo-800 leading-relaxed mt-0.5">
                            {t(lang, `landUseLabels.${selectedPanchayat.landUse}`)}. 
                            {selectedPanchayat.landUse === 'dense_forest' ? ' Dense canopy retains sub-soil moisture and reduces peak midday surface temperature.' : 
                             selectedPanchayat.landUse === 'irrigated_cropland' ? ' Active crop transpiration creates cooler micro-climate during morning hours.' : 
                             ' Open land use influences local thermal absorption and moisture runoff.'}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* AI Crop Advisory */}
                  <div className="bg-green-50 rounded-xl shadow-xs border border-green-200 p-3.5">
                    <h3 className="text-xs font-bold text-green-900 mb-1.5 flex items-center uppercase tracking-wider">
                      <TrendingUp size={15} className="mr-1.5 text-green-700" />
                      {t(lang, 'dashboard.cropAdvisory')}
                    </h3>
                    <p className="text-xs text-green-800 font-medium leading-relaxed">
                      {lang === 'hi' 
                        ? (selectedPanchayat.advisory?.hi?.text || 'मौसम के अनुसार फसल की समय पर सिंचाई और देखभाल करें।') 
                        : (selectedPanchayat.advisory?.en?.text || 'Perform timely irrigation and monitor crop stages according to local weather.')}
                    </p>
                  </div>

                  {/* Constituent Panchayats inside same Block */}
                  {selectedPanchayat.blockId && (
                    <div className="bg-white rounded-xl border border-gray-200 p-3.5 shadow-xs">
                      <h4 className="text-xs font-bold text-gray-800 mb-2">
                        {lang === 'hi' ? 'इस ब्लॉक की अन्य पंचायतें' : 'Other Panchayats in this Block'}:
                      </h4>
                      <div className="grid grid-cols-2 gap-2">
                        {getBlockPanchayats(selectedPanchayat.blockId).map(p => (
                          <button
                            key={p.id}
                            onClick={() => {
                              setSelectedPanchayat(p);
                              setMapCenter(p.center);
                            }}
                            className={`p-2 rounded-lg text-left text-xs border transition-all ${
                              p.id === selectedPanchayat.id 
                                ? 'bg-green-50 border-green-400 font-bold text-green-800 shadow-2xs' 
                                : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
                            }`}
                          >
                            <div className="truncate">{lang === 'hi' ? p.nameHi : p.name}</div>
                            <div className="text-[10px] text-gray-500 font-normal mt-0.5">{p.forecast.tempHigh}°C • {p.forecast.rainfall}mm</div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="h-4"></div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
