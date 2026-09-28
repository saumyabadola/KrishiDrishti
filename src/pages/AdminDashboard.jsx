import React, { useState, useMemo } from 'react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Legend, ReferenceLine, ComposedChart
} from 'recharts';
import {
  Search, ArrowUpDown, ChevronDown, CheckCircle, AlertTriangle,
  Clock, TrendingUp, Shield
} from 'lucide-react';
import { useLang } from '../context/LanguageContext';
import { t } from '../i18n/translations';
import {
  allStates, allDistricts, allBlocks, allPanchayats,
  verificationRows, adminStats,
  generateAccuracyTrend, confidenceToColor
} from '../data/mockData';

export default function AdminDashboard() {
  const { lang } = useLang();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedState, setSelectedState] = useState('All');
  const [selectedDistrict, setSelectedDistrict] = useState('All');
  const [selectedBlock, setSelectedBlock] = useState('All');
  const [sortField, setSortField] = useState('confidence');
  const [sortDirection, setSortDirection] = useState('desc');

  const trendData = useMemo(() => generateAccuracyTrend(), []);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const filteredAndSortedRows = useMemo(() => {
    return verificationRows
      .filter(row => {
        const matchesSearch = row.panchayat.toLowerCase().includes(searchTerm.toLowerCase()) || 
                              (row.panchayatHi && row.panchayatHi.includes(searchTerm));
        const matchesBlock = selectedBlock === 'All' || row.block === selectedBlock;
        const matchesState = selectedState === 'All' || row.state === selectedState;
        const matchesDistrict = selectedDistrict === 'All' || row.district === selectedDistrict;
        return matchesSearch && matchesBlock && matchesState && matchesDistrict;
      })
      .sort((a, b) => {
        let valA = a[sortField];
        let valB = b[sortField];
        
        if (sortDirection === 'asc') {
          return valA > valB ? 1 : -1;
        } else {
          return valA < valB ? 1 : -1;
        }
      });
  }, [searchTerm, selectedState, selectedDistrict, selectedBlock, sortField, sortDirection]);

  const displayStats = useMemo(() => {
    const isFiltered = selectedState !== 'All' || selectedDistrict !== 'All' || selectedBlock !== 'All' || searchTerm !== '';
    if (!isFiltered) return adminStats;

    const verified = filteredAndSortedRows.filter(r => r.status === 'verified').length;
    const alerts = filteredAndSortedRows.filter(r => r.status === 'alert').length;
    const avgAcc = filteredAndSortedRows.length > 0 
      ? Math.round(filteredAndSortedRows.reduce((acc, r) => acc + r.confidence, 0) / filteredAndSortedRows.length)
      : 0;

    return {
      totalPanchayats: filteredAndSortedRows.length,
      verifiedReports: verified,
      avgAccuracy: avgAcc,
      activeAlerts: alerts,
      lastUpdated: adminStats.lastUpdated
    };
  }, [filteredAndSortedRows, selectedState, selectedDistrict, selectedBlock, searchTerm]);

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-6">
      {/* 1. Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-surface-900">{t(lang, 'admin.title') || 'Admin Dashboard'}</h1>
          <p className="text-surface-600 mt-1">{t(lang, 'admin.subtitle') || 'KVK Verification & Performance Overview'}</p>
        </div>
        <div className="flex items-center gap-2 text-surface-500 text-sm">
          <Clock className="w-4 h-4" />
          <span>{t(lang, 'admin.lastUpdated') || 'Last Updated:'} {displayStats.lastUpdated || adminStats.lastUpdated}</span>
        </div>
      </div>

      {/* 2. Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl shadow-sm border border-surface-200 p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-100 text-blue-600 rounded-full">
              <Shield className="w-5 h-5" />
            </div>
            <h3 className="text-surface-600 font-medium text-sm">Total Panchayats</h3>
          </div>
          <p className="text-2xl font-bold text-surface-900">{displayStats.totalPanchayats}</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-surface-200 p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-green-100 text-green-600 rounded-full">
              <CheckCircle className="w-5 h-5" />
            </div>
            <h3 className="text-surface-600 font-medium text-sm">{t(lang, 'admin.verifiedReports') || 'Verified Reports'}</h3>
          </div>
          <p className="text-2xl font-bold text-surface-900">{displayStats.verifiedReports}</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-surface-200 p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-crop-100 text-crop-600 rounded-full">
              <TrendingUp className="w-5 h-5" />
            </div>
            <h3 className="text-surface-600 font-medium text-sm">{t(lang, 'admin.avgAccuracy') || 'Avg Accuracy'}</h3>
          </div>
          <p className="text-2xl font-bold text-surface-900">{displayStats.avgAccuracy}%</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-surface-200 p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-amber-100 text-amber-600 rounded-full">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <h3 className="text-surface-600 font-medium text-sm">{t(lang, 'admin.activeAlerts') || 'Active Alerts'}</h3>
          </div>
          <p className="text-2xl font-bold text-surface-900">{displayStats.activeAlerts}</p>
        </div>
      </div>

      {/* 3. Accuracy Trend Chart */}
      <div className="bg-white rounded-2xl shadow-sm border border-surface-200 p-6">
        <h2 className="text-lg font-semibold text-surface-900 mb-6">{t(lang, 'admin.trend') || 'Accuracy Trend (30 Days)'}</h2>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={trendData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorAccuracy" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#16a34a" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#16a34a" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
              <XAxis dataKey="dateShort" axisLine={false} tickLine={false} tick={{fill: '#6b7280', fontSize: 12}} dy={10} />
              <YAxis yAxisId="left" domain={[60, 100]} axisLine={false} tickLine={false} tick={{fill: '#6b7280', fontSize: 12}} dx={-10} />
              <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} dx={10} />
              <Tooltip 
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              />
              <Legend verticalAlign="top" height={36} />
              <Bar yAxisId="right" dataKey="reports" name="Reports Count" fill="#f3f4f6" barSize={20} radius={[4, 4, 0, 0]} />
              <Area yAxisId="left" type="monotone" dataKey="accuracy" name="Accuracy (%)" stroke="#16a34a" strokeWidth={3} fillOpacity={1} fill="url(#colorAccuracy)" />
              <ReferenceLine yAxisId="left" y={80} stroke="#ef4444" strokeDasharray="3 3" label={{ position: 'insideTopLeft', value: 'Target (80%)', fill: '#ef4444', fontSize: 12 }} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 4. Panchayat Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-surface-200 overflow-hidden flex flex-col">
        <div className="p-4 md:p-6 border-b border-surface-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <h2 className="text-lg font-semibold text-surface-900">{t(lang, 'admin.panchayatTable') || 'Panchayat Verification Data'}</h2>
          
          <div className="flex flex-col sm:flex-row flex-wrap gap-3 w-full md:w-auto">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-surface-400" />
              <input 
                type="text" 
                placeholder="Search panchayat..." 
                className="pl-9 pr-4 py-2 border border-surface-300 rounded-lg text-sm w-full focus:outline-none focus:ring-2 focus:ring-crop-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="relative">
              <select 
                className="appearance-none pl-4 pr-10 py-2 border border-surface-300 rounded-lg text-sm bg-white w-full focus:outline-none focus:ring-2 focus:ring-crop-500"
                value={selectedState}
                onChange={(e) => {
                  setSelectedState(e.target.value);
                  setSelectedDistrict('All');
                  setSelectedBlock('All');
                }}
              >
                <option value="All">All States</option>
                {allStates.map(s => (
                  <option key={s.id} value={s.id}>{lang === 'hi' ? s.nameHi : s.name}</option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-surface-400 pointer-events-none" />
            </div>

            <div className="relative">
              <select 
                className="appearance-none pl-4 pr-10 py-2 border border-surface-300 rounded-lg text-sm bg-white w-full focus:outline-none focus:ring-2 focus:ring-crop-500"
                value={selectedDistrict}
                onChange={(e) => {
                  setSelectedDistrict(e.target.value);
                  setSelectedBlock('All');
                }}
              >
                <option value="All">All Districts</option>
                {allDistricts
                  .filter(d => selectedState === 'All' || d.stateId === selectedState)
                  .map(d => (
                  <option key={d.id} value={d.id}>{lang === 'hi' ? d.nameHi : d.name}</option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-surface-400 pointer-events-none" />
            </div>

            <div className="relative">
              <select 
                className="appearance-none pl-4 pr-10 py-2 border border-surface-300 rounded-lg text-sm bg-white w-full focus:outline-none focus:ring-2 focus:ring-crop-500"
                value={selectedBlock}
                onChange={(e) => setSelectedBlock(e.target.value)}
              >
                <option value="All">All Blocks</option>
                {allBlocks
                  .filter(b => selectedState === 'All' || b.stateId === selectedState)
                  .filter(b => selectedDistrict === 'All' || b.districtId === selectedDistrict)
                  .map(b => (
                  <option key={b.id} value={b.name}>{lang === 'hi' ? b.nameHi : b.name}</option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-surface-400 pointer-events-none" />
            </div>
            
            <button 
              onClick={() => handleSort('confidence')}
              className="flex items-center gap-2 px-4 py-2 bg-surface-50 hover:bg-surface-100 text-surface-700 rounded-lg text-sm transition-colors border border-surface-200"
            >
              <ArrowUpDown className="w-4 h-4" />
              <span className="whitespace-nowrap">{t(lang, 'admin.sortByConfidence') || 'Sort Confidence'}</span>
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-surface-50 text-surface-600 font-medium border-b border-surface-200">
              <tr>
                <th className="px-4 py-3 cursor-pointer hover:bg-surface-100 transition-colors" onClick={() => handleSort('panchayat')}>
                  <div className="flex items-center gap-1">{t(lang, 'admin.panchayat') || 'Panchayat'} <ArrowUpDown className="w-3 h-3" /></div>
                </th>
                <th className="px-4 py-3 cursor-pointer hover:bg-surface-100 transition-colors" onClick={() => handleSort('block')}>
                  <div className="flex items-center gap-1">{t(lang, 'admin.block') || 'Block'} <ArrowUpDown className="w-3 h-3" /></div>
                </th>
                <th className="px-4 py-3 cursor-pointer hover:bg-surface-100 transition-colors" onClick={() => handleSort('district')}>
                  <div className="flex items-center gap-1">{t(lang, 'admin.district') || 'District'} <ArrowUpDown className="w-3 h-3" /></div>
                </th>
                <th className="px-4 py-3">{t(lang, 'admin.forecastedTemp') || 'Fore. Temp'}</th>
                <th className="px-4 py-3">{t(lang, 'admin.actualTemp') || 'Act. Temp'}</th>
                <th className="px-4 py-3 hidden md:table-cell">{t(lang, 'admin.forecastedRain') || 'Fore. Rain'}</th>
                <th className="px-4 py-3 hidden md:table-cell">{t(lang, 'admin.actualRain') || 'Act. Rain'}</th>
                <th className="px-4 py-3 cursor-pointer hover:bg-surface-100 transition-colors" onClick={() => handleSort('confidence')}>
                  <div className="flex items-center gap-1">Confidence <ArrowUpDown className="w-3 h-3" /></div>
                </th>
                <th className="px-4 py-3">{t(lang, 'admin.status') || 'Status'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-100">
              {filteredAndSortedRows.map((row, idx) => {
                const tempDiff = row.actualTemp ? Math.abs(row.forecastedTemp - row.actualTemp) : 0;
                const isTempAlert = tempDiff > 3;
                
                return (
                  <tr key={row.id} className={`hover:bg-surface-50 transition-colors ${idx % 2 !== 0 ? 'bg-surface-50/30' : 'bg-white'}`}>
                    <td className="px-4 py-3 font-medium text-surface-900">{lang === 'hi' ? row.panchayatHi : row.panchayat}</td>
                    <td className="px-4 py-3 text-surface-600">{lang === 'hi' ? row.blockHi : row.block}</td>
                    <td className="px-4 py-3 text-surface-600">{row.district}</td>
                    <td className="px-4 py-3">{row.forecastedTemp}°C</td>
                    <td className={`px-4 py-3 font-medium ${isTempAlert ? 'text-red-600' : 'text-surface-700'}`}>
                      {row.actualTemp ? `${row.actualTemp}°C` : '-'}
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">{row.forecastedRain}mm</td>
                    <td className="px-4 py-3 hidden md:table-cell text-surface-700">{row.actualRain !== null ? `${row.actualRain}mm` : '-'}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-2 h-2 rounded-full" 
                          style={{ backgroundColor: confidenceToColor(row.confidence) }}
                        />
                        <span className="font-medium">{row.confidence}%</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      {row.status === 'verified' && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          {t(lang, 'admin.verified') || 'Verified'}
                        </span>
                      )}
                      {row.status === 'pending' && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                          {t(lang, 'admin.pending') || 'Pending'}
                        </span>
                      )}
                      {row.status === 'alert' && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          {t(lang, 'admin.alert') || 'Alert'}
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
              
              {filteredAndSortedRows.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-surface-500">
                    No verification records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
