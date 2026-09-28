import React, { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { MapContainer, TileLayer, GeoJSON, Marker, Popup, useMap, CircleMarker } from 'react-leaflet';
import L from 'leaflet';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { X, Thermometer, Droplets, Wind, Cloud, MapPin, Layers, TrendingUp, AlertTriangle, Mountain, TreePine, Waves, Eye, Search, ChevronDown, Loader2, Navigation, ArrowLeft, Globe, Building2, BarChart3, Wifi, SearchX } from 'lucide-react';
import { useLang } from '../context/LanguageContext';
import { t } from '../i18n/translations';
import { allStates, allDistricts, allBlocks, allPanchayats, getDistrict, getDistrictBlocks, getDistrictPanchayats, findNearestPanchayat, tempToColor, rainToColor, confidenceToColor, tempLegend, rainLegend, platformStats } from '../data/mockData';
import { fetchForecastCached } from '../services/weatherApi';
import { debouncedSearch, reverseGeocode } from '../services/geocodingApi';

function MapChangeCenter({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, zoom, { duration: 1.5 });
  }, [center, zoom, map]);
  return null;
}

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

  // Live data fetch effect
  useEffect(() => {
    let isActive = true;
    if (selectedPanchayat) {
      setLiveForecast(null);
      setIsLiveLoading(true);
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

  // Navigation Handlers
  const goIndia = () => {
    setNavLevel('india');
    setActiveStateId(null);
    setActiveDistrictId(null);
    setMapCenter([22.5, 82]);
    setMapZoom(5);
    setSelectedPanchayat(null);
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
  };
  
  const goDistrict = (distId) => {
    const d = allDistricts.find(x => x.id === distId);
    if (!d) return;
    setNavLevel('district');
    setActiveStateId(d.stateId);
    setActiveDistrictId(distId);
    setMapCenter(d.center);
    setMapZoom(d.zoom);
  };

  const handleSearchResult = (res) => {
    setSearchQuery('');
    setShowDropdown(false);
    setMapCenter([res.lat, res.lng]);
    setMapZoom(12);
    setSearchMarker({ lat: res.lat, lng: res.lng, name: res.displayName });
    
    const nearest = findNearestPanchayat(res.lat, res.lng);
    if (nearest) {
      // Basic distance check (~0.3 deg)
      const d = Math.sqrt(Math.pow(nearest.center[0] - res.lat, 2) + Math.pow(nearest.center[1] - res.lng, 2));
      if (d < 0.3) {
        goDistrict(nearest.districtId);
        setSelectedPanchayat(nearest);
      }
    }
  };

  const styleGeoJSON = (feature) => {
    let value;
    if (viewLevel === 'block') {
      const block = allBlocks.find(b => b.blockId === feature.properties.block_id);
      value = block ? block.forecast[activeLayer] : null;
    } else {
      const panchayat = allPanchayats.find(p => p.id === feature.properties.id);
      value = panchayat ? panchayat.fiveDayForecast[0][activeLayer] : null;
    }
    
    let fillColor = '#cccccc';
    if (value !== null) {
      fillColor = activeLayer === 'temperature' ? tempToColor(value) : rainToColor(value);
    }
    
    return {
      fillColor,
      weight: 1,
      opacity: 1,
      color: 'white',
      dashArray: '3',
      fillOpacity: 0.7
    };
  };

  const onEachFeature = (feature, layer) => {
    layer.on({
      mouseover: (e) => {
        const layer = e.target;
        layer.setStyle({
          weight: 2,
          color: '#666',
          dashArray: '',
          fillOpacity: 0.9
        });
        layer.bringToFront();
      },
      mouseout: (e) => {
        const layer = e.target;
        layer.setStyle({
          weight: 1,
          color: 'white',
          dashArray: '3',
          fillOpacity: 0.7
        });
      },
      click: (e) => {
        const props = feature.properties;
        let selected;
        if (viewLevel === 'block') {
           // Not selecting block directly to show panel, just center maybe or select first panchayat
        } else {
           selected = allPanchayats.find(p => p.id === props.id);
           if (selected) {
             setSelectedPanchayat(selected);
             setMapCenter(selected.center);
           }
        }
      }
    });
  };

  const activeState = allStates.find(s => s.id === activeStateId);
  const activeDistrict = allDistricts.find(d => d.id === activeDistrictId);
  
  // Data for current view
  let geojsonData = null;
  if (navLevel === 'district' && activeDistrict) {
    const fullDist = getDistrict(activeDistrict.id);
    geojsonData = viewLevel === 'block' ? fullDist.blockGeoJSON : fullDist.panchayatGeoJSON;
  }

  const legendData = activeLayer === 'temperature' ? tempLegend : rainLegend;

  // Render variables
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
    <div className="relative w-full h-[calc(100vh-56px)] bg-gray-50 flex flex-col overflow-hidden">
      
      {/* Top Toolbar */}
      <div className="bg-white shadow-md z-10 w-full p-2 lg:p-3 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        
        {/* Left: Breadcrumbs & Search */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full md:w-auto">
          {/* Breadcrumbs */}
          <div className="flex items-center text-sm text-gray-600 bg-gray-100 rounded-md px-2 py-1.5 whitespace-nowrap overflow-x-auto max-w-full">
             <button onClick={goIndia} className="hover:text-green-600 font-medium flex items-center">
               <Globe size={14} className="mr-1" /> {lang === 'hi' ? 'भारत' : 'India'}
             </button>
             {activeState && (
               <>
                 <span className="mx-1">/</span>
                 <button onClick={() => goState(activeState.id)} className="hover:text-green-600 font-medium">
                   {lang === 'hi' ? activeState.nameHi : activeState.name}
                 </button>
               </>
             )}
             {activeDistrict && (
               <>
                 <span className="mx-1">/</span>
                 <span className="text-gray-900 font-semibold truncate">
                   {lang === 'hi' ? activeDistrict.nameHi : activeDistrict.name}
                 </span>
               </>
             )}
          </div>
          
          {/* Search Bar */}
          <div className="relative w-full sm:w-64">
            <div className="relative">
              <input 
                type="text" 
                placeholder={lang === 'hi' ? 'भारत में कोई भी स्थान खोजें...' : 'Search any location in India...'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm"
              />
              <div className="absolute left-2.5 top-2 text-gray-400">
                {isSearching ? <Loader2 size={16} className="animate-spin" /> : <Search size={16} />}
              </div>
            </div>
            
            {showDropdown && searchResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg overflow-hidden z-50 max-h-60 overflow-y-auto">
                {searchResults.map((res, i) => (
                  <button 
                    key={i}
                    onClick={() => handleSearchResult(res)}
                    className="w-full text-left px-3 py-2 hover:bg-gray-50 border-b border-gray-100 last:border-0 flex flex-col"
                  >
                    <span className="text-sm font-medium text-gray-900 truncate">{res.displayName}</span>
                    <span className="text-xs text-gray-500 truncate">{res.district}, {res.state}</span>
                  </button>
                ))}
              </div>
            )}
            {showDropdown && searchQuery.length > 2 && searchResults.length === 0 && !isSearching && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-50 p-3 text-sm text-gray-500 text-center">
                {lang === 'hi' ? 'कोई परिणाम नहीं मिला' : 'No results found'}
              </div>
            )}
          </div>
        </div>

        {/* Right: Selectors & Toggles */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
           {/* Selectors */}
           <div className="flex gap-2 w-full sm:w-auto">
             <select 
                className="border border-gray-300 rounded-md py-1.5 px-2 text-sm bg-white focus:ring-2 focus:ring-green-500 flex-1 sm:flex-none"
                value={activeStateId || ''}
                onChange={(e) => {
                  if (e.target.value) goState(e.target.value);
                  else goIndia();
                }}
             >
               <option value="">{lang === 'hi' ? 'राज्य चुनें' : 'Select State'}</option>
               {allStates.map(s => (
                 <option key={s.id} value={s.id}>{lang === 'hi' ? s.nameHi : s.name}</option>
               ))}
             </select>
             
             <select 
                className="border border-gray-300 rounded-md py-1.5 px-2 text-sm bg-white focus:ring-2 focus:ring-green-500 flex-1 sm:flex-none disabled:bg-gray-100"
                value={activeDistrictId || ''}
                onChange={(e) => e.target.value && goDistrict(e.target.value)}
                disabled={!activeStateId}
             >
               <option value="">{lang === 'hi' ? 'जिला चुनें' : 'Select District'}</option>
               {allDistricts.filter(d => d.stateId === activeStateId).map(d => (
                 <option key={d.id} value={d.id}>{lang === 'hi' ? d.nameHi : d.name}</option>
               ))}
             </select>
           </div>
           
           {/* Toggles */}
           {navLevel === 'district' && (
           <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-md">
             <div className="flex rounded-md overflow-hidden bg-white border border-gray-200">
               <button 
                 className={`px-2 py-1 text-xs font-medium ${viewLevel === 'block' ? 'bg-green-100 text-green-700' : 'text-gray-600'}`}
                 onClick={() => setViewLevel('block')}
               >
                 {lang === 'hi' ? 'ब्लॉक' : 'Block'}
               </button>
               <button 
                 className={`px-2 py-1 text-xs font-medium ${viewLevel === 'panchayat' ? 'bg-green-100 text-green-700' : 'text-gray-600'}`}
                 onClick={() => setViewLevel('panchayat')}
               >
                 {lang === 'hi' ? 'पंचायत' : 'Panchayat'}
               </button>
             </div>
             
             <div className="flex rounded-md overflow-hidden bg-white border border-gray-200">
               <button 
                 className={`px-2 py-1 text-xs font-medium flex items-center ${activeLayer === 'temperature' ? 'bg-orange-100 text-orange-700' : 'text-gray-600'}`}
                 onClick={() => setActiveLayer('temperature')}
               >
                 <Thermometer size={14} className="mr-1" /> {lang === 'hi' ? 'तापमान' : 'Temp'}
               </button>
               <button 
                 className={`px-2 py-1 text-xs font-medium flex items-center ${activeLayer === 'rainfall' ? 'bg-blue-100 text-blue-700' : 'text-gray-600'}`}
                 onClick={() => setActiveLayer('rainfall')}
               >
                 <Droplets size={14} className="mr-1" /> {lang === 'hi' ? 'वर्षा' : 'Rain'}
               </button>
             </div>
           </div>
           )}
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

          {/* Search Marker */}
          {searchMarker && (
            <Marker position={[searchMarker.lat, searchMarker.lng]} icon={customMarkerIcon}>
              <Popup>{searchMarker.name}</Popup>
            </Marker>
          )}

          {/* India Level: State Markers */}
          {navLevel === 'india' && allStates.map(s => (
            <CircleMarker 
              key={s.id}
              center={s.center}
              radius={8}
              fillColor="#16a34a"
              color="#ffffff"
              weight={2}
              fillOpacity={0.8}
              eventHandlers={{ click: () => goState(s.id) }}
            >
              <Popup>
                <div className="text-center">
                  <div className="font-bold">{lang === 'hi' ? s.nameHi : s.name}</div>
                  <div className="text-xs text-gray-600">{s.districtIds.length} {lang === 'hi' ? 'जिले' : 'Districts'}</div>
                  <button onClick={() => goState(s.id)} className="mt-1 text-xs text-green-600 font-medium">
                    {lang === 'hi' ? 'देखें' : 'View'} &rarr;
                  </button>
                </div>
              </Popup>
            </CircleMarker>
          ))}

          {/* State Level: District Markers */}
          {navLevel === 'state' && allDistricts.filter(d => d.stateId === activeStateId).map(d => (
            <CircleMarker 
              key={d.id}
              center={d.center}
              radius={7}
              fillColor="#0ea5e9"
              color="#ffffff"
              weight={2}
              fillOpacity={0.8}
              eventHandlers={{ click: () => goDistrict(d.id) }}
            >
              <Popup>
                <div className="text-center">
                  <div className="font-bold">{lang === 'hi' ? d.nameHi : d.name}</div>
                  <button onClick={() => goDistrict(d.id)} className="mt-1 text-xs text-blue-600 font-medium">
                    {lang === 'hi' ? 'देखें' : 'View'} &rarr;
                  </button>
                </div>
              </Popup>
            </CircleMarker>
          ))}

          {/* District Level: GeoJSON */}
          {navLevel === 'district' && geojsonData && (
            <GeoJSON 
              key={`${activeDistrictId}-${viewLevel}-${activeLayer}`}
              data={geojsonData}
              style={styleGeoJSON}
              onEachFeature={onEachFeature}
            />
          )}
        </MapContainer>

        {/* Informational Overlays */}
        {navLevel === 'india' && (
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-md border border-gray-200 pointer-events-none z-[1000]">
            <p className="font-medium text-gray-800 text-sm">
              {lang === 'hi' ? 'संपूर्ण भारत — आरंभ करने के लिए एक राज्य चुनें' : 'All India — Select a State to begin'}
            </p>
          </div>
        )}

        {/* Legend */}
        {navLevel === 'district' && (
        <div className="absolute bottom-6 left-4 bg-white/95 backdrop-blur-sm p-3 rounded-lg shadow-lg border border-gray-100 z-[1000] text-sm">
          <div className="font-semibold text-gray-700 mb-2">
            {activeLayer === 'temperature' ? (lang === 'hi' ? 'तापमान (°C)' : 'Temperature (°C)') : (lang === 'hi' ? 'वर्षा (मिमी)' : 'Rainfall (mm)')}
          </div>
          <div className="flex flex-col gap-1.5">
            {legendData.map((item, i) => (
              <div key={i} className="flex items-center">
                <div className="w-4 h-4 rounded-sm mr-2 shadow-inner" style={{ backgroundColor: item.color }}></div>
                <span className="text-gray-600 text-xs">{item.label}</span>
              </div>
            ))}
          </div>
          {forecastData?.isLive && (
             <div className="mt-2 text-[10px] text-gray-400 italic">Powered by Open-Meteo</div>
          )}
        </div>
        )}

        {/* Side Panel for Selected Panchayat */}
        <div className={`absolute top-0 right-0 h-full w-full sm:w-[420px] bg-white shadow-2xl z-[1500] transform transition-transform duration-300 ease-in-out flex flex-col ${selectedPanchayat ? 'translate-x-0' : 'translate-x-full'}`}>
          {selectedPanchayat && (
            <>
              {/* Header */}
              <div className="p-4 border-b border-gray-100 bg-white flex justify-between items-start sticky top-0 z-10">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-bold text-gray-800">
                      {lang === 'hi' ? selectedPanchayat.nameHi : selectedPanchayat.name}
                    </h2>
                    {selectedPanchayat.elevation > 1500 && (
                      <span className="bg-blue-100 text-blue-800 text-[10px] px-1.5 py-0.5 rounded flex items-center">
                        <Mountain size={10} className="mr-0.5" /> High Alt
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    {lang === 'hi' ? 'ब्लॉक' : 'Block'}: {lang === 'hi' ? allBlocks.find(b=>b.id===selectedPanchayat.blockId)?.nameHi : allBlocks.find(b=>b.id===selectedPanchayat.blockId)?.name} • {lang === 'hi' ? selectedPanchayat.districtName : selectedPanchayat.districtName}, {lang === 'hi' ? selectedPanchayat.stateName : selectedPanchayat.stateName}
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
              <div className="flex-1 overflow-y-auto p-4 space-y-6 bg-gray-50">
                
                {/* Forecast Header */}
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-semibold text-gray-800 flex items-center">
                    <Cloud className="mr-2 text-blue-500" size={18} />
                    {t(lang, 'dashboard.fiveDayForecast')}
                  </h3>
                  {isLiveLoading ? (
                    <span className="flex items-center text-xs font-medium bg-gray-200 text-gray-600 px-2 py-1 rounded-full">
                      <Loader2 size={12} className="animate-spin mr-1" /> Fetching...
                    </span>
                  ) : forecastData?.isLive ? (
                    <span className="flex items-center text-xs font-medium bg-red-100 text-red-700 px-2 py-1 rounded-full border border-red-200">
                      <Wifi size={12} className="mr-1" /> 🔴 LIVE
                    </span>
                  ) : (
                    <span className="flex items-center text-xs font-medium bg-gray-200 text-gray-600 px-2 py-1 rounded-full">
                      Simulated
                    </span>
                  )}
                </div>

                {/* 5-Day Forecast Cards */}
                {forecastData?.days && (
                <div className="flex overflow-x-auto pb-2 gap-3 snap-x -mx-4 px-4 hide-scrollbar">
                  {forecastData.days.map((day, idx) => (
                    <div key={idx} className={`min-w-[120px] rounded-xl border p-3 snap-start flex flex-col items-center justify-between shadow-sm transition-all ${idx === 0 ? 'bg-green-50 border-green-200 shadow-green-100' : 'bg-white border-gray-100'}`}>
                      <span className={`text-xs font-semibold ${idx === 0 ? 'text-green-700' : 'text-gray-500'}`}>
                        {idx === 0 ? (lang === 'hi' ? 'आज' : 'Today') : day.dateLabel}
                      </span>
                      <div className="text-3xl my-2">{day.icon}</div>
                      <div className="flex items-center justify-center gap-2 w-full text-sm font-bold text-gray-800">
                        <span>{day.tempHigh}°</span>
                        <span className="text-gray-400 text-xs font-normal">{day.tempLow}°</span>
                      </div>
                      <div className="flex items-center justify-between w-full mt-2 pt-2 border-t border-gray-100/50 text-xs">
                        <div className="flex items-center text-blue-600" title="Rainfall">
                          <Droplets size={12} className="mr-0.5" />
                          <span>{day.rainfall}mm</span>
                        </div>
                        {day.rainProb > 0 && (
                          <div className="text-gray-400">
                            {day.rainProb}%
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                )}

                {/* Uncertainty Chart */}
                {forecastData?.days && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                  <div className="flex justify-between items-end mb-4">
                    <div>
                      <h3 className="text-sm font-bold text-gray-800">{t(lang, 'dashboard.temperatureUncertainty')}</h3>
                      <p className="text-xs text-gray-500 mt-0.5">High/Low prediction band</p>
                    </div>
                    <div className="text-right">
                      <div className="text-xs font-medium" style={{ color: confidenceToColor(forecastData.days[0].confidence) }}>
                        {forecastData.days[0].confidence}% Confidence
                      </div>
                    </div>
                  </div>
                  <div className="h-40 w-full -ml-4">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={forecastData.days} margin={{ top: 5, right: 0, left: 0, bottom: 0 }}>
                        <defs>
                          <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#f97316" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                        <XAxis dataKey="dateLabel" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#9ca3af' }} dy={10} />
                        <YAxis hide domain={['dataMin - 2', 'dataMax + 2']} />
                        <Tooltip 
                          contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                          labelStyle={{ color: '#4b5563', fontWeight: 'bold', marginBottom: '4px' }}
                        />
                        <Area 
                          type="monotone" 
                          dataKey="tempHighUpper" 
                          stroke="none" 
                          fill="url(#colorTemp)" 
                        />
                        <Area 
                          type="monotone" 
                          dataKey="tempHigh" 
                          stroke="#f97316" 
                          strokeWidth={2}
                          fill="none" 
                          activeDot={{ r: 4, strokeWidth: 0, fill: '#f97316' }}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                )}

                {/* Explainability Card */}
                <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-xl shadow-sm border border-indigo-100 p-4">
                  <h3 className="text-sm font-bold text-indigo-900 mb-3 flex items-center">
                    <Eye size={16} className="mr-1.5" />
                    {t(lang, 'dashboard.whyThesePredictions')}
                  </h3>
                  
                  <div className="space-y-3">
                    {/* Elevation Factor */}
                    <div className="flex gap-3">
                      <div className="mt-0.5 bg-white p-1.5 rounded-lg shadow-sm text-indigo-500 h-fit">
                        <Mountain size={16} />
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-indigo-900">Elevation Impact ({selectedPanchayat.elevation}m)</div>
                        <div className="text-xs text-indigo-700/80 mt-0.5 leading-relaxed">
                          {selectedPanchayat.elevation > 1000 
                            ? "High altitude lowers baseline temperatures by 2-3°C compared to district average." 
                            : "Standard elevation profile. Normal temperature gradients apply."}
                        </div>
                      </div>
                    </div>

                    {/* Water Proximity Factor */}
                    <div className="flex gap-3">
                      <div className="mt-0.5 bg-white p-1.5 rounded-lg shadow-sm text-blue-500 h-fit">
                        <Waves size={16} />
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-indigo-900">Water Body Proximity</div>
                        <div className="text-xs text-indigo-700/80 mt-0.5 leading-relaxed">
                          {selectedPanchayat.nearestWaterBodyDist < 10 
                            ? `Close to water (${selectedPanchayat.nearestWaterBodyDist}km). Increases local humidity and moderates extreme heat.` 
                            : `Far from major water bodies (${selectedPanchayat.nearestWaterBodyDist}km). Higher diurnal temperature variation expected.`}
                        </div>
                      </div>
                    </div>

                    {/* Land Use Factor */}
                    <div className="flex gap-3">
                      <div className="mt-0.5 bg-white p-1.5 rounded-lg shadow-sm text-green-500 h-fit">
                        <TreePine size={16} />
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-indigo-900">Primary Land Use</div>
                        <div className="text-xs text-indigo-700/80 mt-0.5 leading-relaxed">
                          {t(lang, `landUseLabels.${selectedPanchayat.landUse}`)}. 
                          {selectedPanchayat.landUse === 'dense_forest' ? ' High canopy cover increases soil moisture retention.' : 
                           selectedPanchayat.landUse === 'agriculture' ? ' Open fields lead to faster daytime heating.' : 
                           ' Affects surface runoff and local heat island effects.'}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* AI Crop Advisory */}
                <div className="bg-green-50 rounded-xl shadow-sm border border-green-200 p-4">
                  <h3 className="text-sm font-bold text-green-800 mb-2 flex items-center">
                    <TrendingUp size={16} className="mr-1.5" />
                    AI Crop Advisory
                  </h3>
                  <p className="text-sm text-green-700 leading-relaxed">
                    {forecastData?.days[0].rainfall > 10 
                      ? "Heavy rain expected. Delay fertilizer application to prevent runoff. Ensure field drainage channels are clear." 
                      : forecastData?.days[0].tempHigh > 35 
                        ? "High heat stress risk. Irrigate during early morning or evening hours. Monitor crops for wilting." 
                        : "Optimal weather conditions for standard agricultural activities. Good time for scheduled spraying or harvesting."}
                  </p>
                </div>

                {/* Bottom Padding for scroll */}
                <div className="h-6"></div>

              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
