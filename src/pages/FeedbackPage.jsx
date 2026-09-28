import React, { useState, useEffect } from 'react';
import { 
  Send, 
  CheckCircle, 
  Phone, 
  CloudRain, 
  Sun, 
  Snowflake, 
  Flame, 
  Cloud, 
  CloudDrizzle, 
  TrendingUp, 
  BarChart3, 
  Users 
} from 'lucide-react';
import { useLang } from '../context/LanguageContext';
import { t } from '../i18n/translations';
import { allStates, allDistricts, allBlocks, allPanchayats } from '../data/mockData';

const FeedbackPage = () => {
  const { lang } = useLang();
  
  const [selectedPanchayat, setSelectedPanchayat] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedWeather, setSelectedWeather] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  // Model confidence animation
  const [confidence, setConfidence] = useState(0);
  useEffect(() => {
    const timer = setTimeout(() => setConfidence(82), 400);
    return () => clearTimeout(timer);
  }, []);

  const weatherOptions = [
    { id: 'rained', icon: CloudRain, label: t(lang, 'feedback.rained') || 'Rained', color: 'text-blue-500', activeBg: 'bg-blue-50', activeBorder: 'border-blue-500', ringColor: 'focus:ring-blue-500' },
    { id: 'noRain', icon: Sun, label: t(lang, 'feedback.noRain') || 'No Rain', color: 'text-yellow-500', activeBg: 'bg-yellow-50', activeBorder: 'border-yellow-500', ringColor: 'focus:ring-yellow-500' },
    { id: 'frost', icon: Snowflake, label: t(lang, 'feedback.frost') || 'Frost', color: 'text-cyan-500', activeBg: 'bg-cyan-50', activeBorder: 'border-cyan-500', ringColor: 'focus:ring-cyan-500' },
    { id: 'heatwave', icon: Flame, label: t(lang, 'feedback.heatwave') || 'Heatwave', color: 'text-red-500', activeBg: 'bg-red-50', activeBorder: 'border-red-500', ringColor: 'focus:ring-red-500' },
    { id: 'normal', icon: Cloud, label: t(lang, 'feedback.normal') || 'Normal', color: 'text-gray-500', activeBg: 'bg-gray-100', activeBorder: 'border-gray-500', ringColor: 'focus:ring-gray-500' },
    { id: 'heavyRain', icon: CloudDrizzle, label: t(lang, 'feedback.heavyRain') || 'Heavy Rain', color: 'text-indigo-600', activeBg: 'bg-indigo-50', activeBorder: 'border-indigo-600', ringColor: 'focus:ring-indigo-600' },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedPanchayat || !selectedDate || !selectedWeather) return;
    
    // Simulate submission
    setTimeout(() => {
      setIsSubmitted(true);
      setTimeout(() => {
        setIsSubmitted(false);
        setSelectedWeather('');
        setNotes('');
      }, 4000);
    }, 500);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">{t(lang, 'feedback.title') || 'Farmer Feedback'}</h1>
        <p className="mt-2 text-lg text-gray-600">{t(lang, 'feedback.subtitle') || 'Help improve weather predictions in your area'}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Left Column: Feedback Form */}
        <div className="glass-card bg-surface-50 border border-gray-200 rounded-2xl shadow-sm p-6 sm:p-8">
          {isSubmitted ? (
            <div className="flex flex-col items-center justify-center py-12 text-center animate-fade-in">
              <CheckCircle className="w-16 h-16 text-crop-700 text-green-600 mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 mb-2">{t(lang, 'feedback.thankYou') || 'Thank You!'}</h3>
              <p className="text-gray-600">Your feedback has been submitted successfully.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">{t(lang, 'feedback.selectPanchayat') || 'Select Panchayat'}</label>
                <select 
                  className="w-full rounded-xl border-gray-300 shadow-sm focus:border-sky-500 focus:ring-sky-500 min-h-[44px] px-3 py-2 border bg-white text-gray-900"
                  value={selectedPanchayat}
                  onChange={(e) => setSelectedPanchayat(e.target.value)}
                  required
                >
                  <option value="">Select a location</option>
                  {allStates.map(state => (
                    <optgroup key={state.id} label={`── ${lang === 'hi' ? state.nameHi : state.name} ──`}>
                      {allPanchayats.filter(p => p.stateId === state.id).map(p => (
                        <option key={p.id} value={p.id}>
                          {lang === 'hi' ? p.nameHi : p.name} ({lang === 'hi' ? p.districtNameHi : p.districtName})
                        </option>
                      ))}
                    </optgroup>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">{t(lang, 'feedback.selectDate') || 'Date'}</label>
                <input 
                  type="date"
                  className="w-full rounded-xl border-gray-300 shadow-sm focus:border-sky-500 focus:ring-sky-500 min-h-[44px] px-3 py-2 border bg-white text-gray-900"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">{t(lang, 'feedback.whatHappened') || 'What happened at your farm?'}</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {weatherOptions.map((option) => {
                    const isSelected = selectedWeather === option.id;
                    return (
                      <button
                        type="button"
                        key={option.id}
                        onClick={() => setSelectedWeather(option.id)}
                        className={`min-h-[80px] w-full p-4 rounded-xl border-2 transition-all flex flex-col items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-offset-1 ${option.ringColor} ${
                          isSelected 
                            ? `${option.activeBorder} ${option.activeBg}` 
                            : `border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50`
                        }`}
                      >
                        <option.icon className={`w-8 h-8 ${isSelected ? option.color : 'text-gray-400'}`} />
                        <span className={`text-sm font-medium ${isSelected ? option.color : 'text-gray-600'}`}>{option.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">{t(lang, 'feedback.additionalNotes') || 'Additional Notes (Optional)'}</label>
                <textarea 
                  rows={3}
                  className="w-full rounded-xl border-gray-300 shadow-sm focus:border-sky-500 focus:ring-sky-500 px-3 py-2 border bg-white text-gray-900"
                  placeholder="Tell us more about the impact..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>

              <button 
                type="submit"
                disabled={!selectedPanchayat || !selectedWeather}
                className="w-full flex items-center justify-center gap-2 bg-sky-800 text-white py-3 px-4 rounded-xl font-medium hover:bg-sky-900 focus:outline-none focus:ring-2 focus:ring-sky-800 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors min-h-[44px]"
              >
                <Send className="w-5 h-5" />
                {t(lang, 'feedback.submit') || 'Submit Report'}
              </button>
            </form>
          )}
        </div>

        {/* Right Column: WhatsApp Mockup */}
        <div className="space-y-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">{t(lang, 'feedback.whatsappTitle') || 'Report via WhatsApp'}</h2>
            <p className="text-gray-600 text-sm mt-1">{t(lang, 'feedback.whatsappSubtitle') || 'You can also report directly from your phone'}</p>
          </div>
          
          <div className="rounded-3xl overflow-hidden border border-gray-200 shadow-md flex flex-col h-[520px] max-w-sm mx-auto lg:mx-0 w-full bg-[#ECE5DD]">
            {/* WA Header */}
            <div className="bg-[#075E54] text-white px-4 py-3 flex items-center gap-3 shadow-sm z-10">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center shrink-0">
                <CloudRain className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-white">KrishiDrishti Bot</h3>
                <p className="text-xs text-green-100 flex items-center gap-1">
                  <span className="w-2 h-2 bg-green-400 rounded-full block"></span>
                  Online
                </p>
              </div>
              <Phone className="w-5 h-5 text-white cursor-pointer" />
            </div>

            {/* WA Chat Area */}
            <div className="flex-1 p-4 space-y-4 overflow-y-auto" style={{ 
              backgroundImage: 'url("https://w0.peakpx.com/wallpaper/508/871/HD-wallpaper-whatsapp-background-cute-patterns-texture.jpg")', 
              backgroundBlendMode: 'soft-light',
              backgroundSize: 'cover'
            }}>
              <div className="flex justify-center mb-2">
                <span className="bg-[#E1F3FB] text-gray-700 text-xs px-3 py-1 rounded-lg shadow-sm uppercase font-medium tracking-wide">Today</span>
              </div>
              
              <div className="flex justify-start">
                <div className="bg-white rounded-2xl rounded-tl-sm p-3 max-w-[85%] shadow-sm relative">
                  <p className="text-[15px] text-gray-800 leading-snug">नमस्ते! आज आपके खेत में मौसम कैसा रहा? / Hi! How was the weather at your farm today?</p>
                  <span className="text-[10px] text-gray-400 mt-1 flex justify-end">6:30 PM</span>
                </div>
              </div>

              <div className="flex justify-end">
                <div className="bg-[#DCF8C6] rounded-2xl rounded-tr-sm p-3 max-w-[85%] shadow-sm relative">
                  <p className="text-[15px] text-gray-800 leading-snug">बारिश हुई ☔ / It rained</p>
                  <div className="flex items-center justify-end gap-1 mt-1">
                    <span className="text-[10px] text-gray-500">6:32 PM</span>
                    <CheckCircle className="w-3 h-3 text-blue-500" />
                  </div>
                </div>
              </div>

              <div className="flex justify-start">
                <div className="bg-white rounded-2xl rounded-tl-sm p-3 max-w-[85%] shadow-sm relative">
                  <p className="text-[15px] text-gray-800 leading-snug">धन्यवाद! आपकी रिपोर्ट दर्ज हो गई। ✅ / Thanks! Your report is recorded.</p>
                  <span className="text-[10px] text-gray-400 mt-1 flex justify-end">6:32 PM</span>
                </div>
              </div>

              <div className="flex justify-start">
                <div className="bg-white rounded-2xl rounded-tl-sm p-3 max-w-[85%] shadow-sm relative">
                  <p className="text-[15px] text-gray-800 leading-snug">कल का पूर्वानुमान: 🌤️ 28°C, बारिश नहीं / Tomorrow's forecast: 🌤️ 28°C, no rain</p>
                  <span className="text-[10px] text-gray-400 mt-1 flex justify-end">6:32 PM</span>
                </div>
              </div>
            </div>

            {/* WA Input Area */}
            <div className="bg-[#f0f0f0] p-2 px-3 flex items-center gap-2">
              <div className="flex-1 bg-white rounded-full px-4 py-2.5 text-sm text-gray-400 border border-transparent focus-within:border-gray-200">
                Type a message...
              </div>
              <div className="w-11 h-11 bg-[#128C7E] rounded-full flex items-center justify-center shrink-0 cursor-pointer hover:bg-[#075E54] transition-colors">
                <Send className="w-5 h-5 text-white ml-1" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Model Confidence Indicators */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 lg:gap-6 pt-4">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center">
          <TrendingUp className="w-8 h-8 text-crop-700 text-green-700 mb-3" />
          <h4 className="text-gray-600 font-medium mb-1">{t(lang, 'feedback.modelConfidence') || 'Model Confidence'}</h4>
          <div className="text-4xl font-bold text-crop-700 text-green-700 mb-2 transition-all duration-1000 ease-out">
            {confidence}%
          </div>
          <p className="text-sm text-gray-500">Improving with each report</p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center">
          <BarChart3 className="w-8 h-8 text-sky-800 mb-3" />
          <h4 className="text-gray-600 font-medium mb-1">{t(lang, 'feedback.reportsThisWeek') || 'Reports This Week'}</h4>
          <div className="text-4xl font-bold text-gray-900 mb-2">
            47
          </div>
          <p className="text-sm text-gray-500">From local farmers</p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center">
          <Users className="w-8 h-8 text-amber-600 mb-3" />
          <h4 className="text-gray-600 font-medium mb-1">{t(lang, 'feedback.accuracyImprovement') || 'Accuracy Improved'}</h4>
          <div className="text-4xl font-bold text-crop-600 text-green-600 mb-2">
            +3.2%
          </div>
          <p className="text-sm text-gray-500">Since farmer feedback began</p>
        </div>
      </div>
    </div>
  );
};

export default FeedbackPage;
