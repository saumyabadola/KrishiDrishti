import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, Bot, X, Send, Sparkles, HelpCircle, ChevronRight, CornerDownLeft } from 'lucide-react';
import { useLang } from '../context/LanguageContext';
import { platformStats } from '../data/mockData';

export default function ChatbotWidget() {
  const { lang } = useLang();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showCallout, setShowCallout] = useState(true);
  const messagesEndRef = useRef(null);

  // Listen for custom trigger event (e.g. from Header button)
  useEffect(() => {
    const handleOpen = () => {
      setIsOpen(true);
      setShowCallout(false);
    };
    window.addEventListener('open-krishi-chatbot', handleOpen);
    return () => window.removeEventListener('open-krishi-chatbot', handleOpen);
  }, []);

  // Initialize welcome message when opened for the first time
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          role: 'bot',
          text: lang === 'hi'
            ? 'नमस्ते! 🌾 मैं KrishiDrishti AI सहायक हूँ। मौसम पूर्वानुमान, ब्लॉक/पंचायत डेटा, फसल सलाह या प्लेटफॉर्म के बारे में मुझसे कुछ भी पूछें!'
            : "Hello! 🌾 I am the KrishiDrishti AI Assistant. Ask me anything about hyperlocal weather forecasts, block & panchayat boundaries, crop advisories, or our downscaling technology!",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    }
  }, [lang]);

  // Auto-scroll chat to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const quickQuestions = lang === 'hi' ? [
    'मौसम पूर्वानुमान कैसे देखें?',
    'मॉडल सटीकता कितनी है?',
    'ब्लॉक और पंचायत में क्या अंतर है?',
    'फसल सलाह कैसे मिलती है?'
  ] : [
    'How accurate is the forecast?',
    'How do I search my location?',
    'Block vs Panchayat difference?',
    'What crop advisories are available?'
  ];

  const getBotResponse = (query, currentLang) => {
    const q = query.toLowerCase();

    if (q.includes('accuracy') || q.includes('accurate') || q.includes('सटीक') || q.includes('सटीकता')) {
      return currentLang === 'hi'
        ? `हमारे AI मॉडल की पंचायत-स्तरीय सटीकता ${platformStats.forecastAccuracy} है। यह IMD के ब्लॉक डेटा को स्थानीय ऊँचाई (Elevation), जल निकायों की दूरी, और उपग्रह भूमि-उपयोग डेटा के साथ डाउनस्केल करता है। किसान फीडबैक से यह समय के साथ और बेहतर हो रहा है!`
        : `Our downscaling model operates at ${platformStats.forecastAccuracy} accuracy across India. It refines coarse IMD forecasts by modeling microclimate drivers like elevation gradients, proximity to water bodies, and satellite land cover!`;
    }

    if (q.includes('search') || q.includes('location') || q.includes('खोज') || q.includes('गाँव') || q.includes('स्थान')) {
      return currentLang === 'hi'
        ? 'मानचित्र डैशबोर्ड के शीर्ष पर स्थित सर्च बार में भारत के किसी भी गाँव, कस्बे, या जिले का नाम टाइप करें (जैसे "Dehradun", "Roorkee", "Chakrata")। सिस्टम तुरंत उस स्थान पर जाकर निकटतम पंचायत का लाइव पूर्वानुमान दिखाएगा!'
        : 'Use the search bar at the top of the Map Dashboard to type any Indian village, town, or landmark (e.g. "Dehradun", "Roorkee", "Chakrata"). The map will fly to your location and show its block and panchayat forecast!';
    }

    if (q.includes('block') || q.includes('panchayat') || q.includes('ब्लॉक') || q.includes('पंचायत') || q.includes('difference') || q.includes('अंतर')) {
      return currentLang === 'hi'
        ? 'IMD केवल "ब्लॉक स्तर" (सैंकड़ों वर्ग किमी) का सामान्य पूर्वानुमान देता है। KrishiDrishti इसे वास्तविक भूमि सीमाओं के अनुसार "पंचायत स्तर" (3×3 किमी) के सटीक स्थानीय मौसम में विभाजित करता है।'
        : 'Standard forecasts are block-level averages covering hundreds of sq km. KrishiDrishti downscales this into precise panchayat boundaries tailored to the exact terrain and microclimate of your village!';
    }

    if (q.includes('crop') || q.includes('advisory') || q.includes('farming') || q.includes('फसल') || q.includes('खेती') || q.includes('सलाह') || q.includes('irrigation')) {
      return currentLang === 'hi'
        ? 'डैशबोर्ड में किसी भी पंचायत पर क्लिक करें। दाईं ओर का पैनल आपको तापमान, वर्षा और हवा के आधार पर तात्कालिक फसल सलाह देगा—जैसे सिंचाई कब करनी है, कब कीटनाशक छिड़काव टालना है, और पाला/लू से बचाव कैसे करना है।'
        : 'Click on any Panchayat or Block on the map. The side panel automatically generates actionable AI Crop Advisories—such as whether to delay irrigation before rain, avoid midday spraying during heatwaves, or shield seedlings from frost.';
    }

    if (q.includes('hourly') || q.includes('hour') || q.includes('घंटा') || q.includes('समय')) {
      return currentLang === 'hi'
        ? 'डैशबोर्ड में किसी भी पंचायत के 5-दिवसीय कार्ड पर क्लिक करें! वह कार्ड विस्तृत होकर 24 घंटे का प्रति-घंटे का तापमान, वर्षा और हवा का पूर्वानुमान दिखाएगा।'
        : 'In the Map Dashboard, click on any of the 5 forecast day cards! It expands to reveal a full 24-hour timeline showing hourly temperature curves, rain volume, and wind speeds.';
    }

    if (q.includes('coverage') || q.includes('state') || q.includes('district') || q.includes('राज्य') || q.includes('जिला') || q.includes('कवरेज')) {
      return currentLang === 'hi'
        ? `KrishiDrishti वर्तमान में भारत के ${platformStats.totalStates} राज्यों के ${platformStats.totalDistricts} जिलों, ${platformStats.totalBlocks} ब्लॉकों और ${platformStats.totalPanchayats} पंचायतों को कवर करता है—जिसमें उत्तराखंड, पंजाब, उत्तर प्रदेश, राजस्थान, गुजरात, महाराष्ट्र, मध्य प्रदेश, पश्चिम बंगाल, कर्नाटक, तमिलनाडु, केरल और असम शामिल हैं!`
        : `KrishiDrishti currently covers ${platformStats.totalStates} major agricultural states, ${platformStats.totalDistricts} districts, ${platformStats.totalBlocks} blocks, and ${platformStats.totalPanchayats} panchayats across all agro-climatic zones of India!`;
    }

    if (q.includes('hello') || q.includes('hi') || q.includes('hey') || q.includes('नमस्ते') || q.includes('हैलो')) {
      return currentLang === 'hi'
        ? 'नमस्ते! 🌾 मैं आपकी क्या सहायता कर सकता हूँ? मौसम, मानचित्र, खोज या फसल सलाह के बारे में पूछें।'
        : 'Hello! 🌾 How can I help you today? Feel free to ask about live weather forecasts, map navigation, search, or crop advisories.';
    }

    return currentLang === 'hi'
      ? 'यह एक अच्छा प्रश्न है! आप मानचित्र डैशबोर्ड पर किसी भी ब्लॉक या पंचायत पर क्लिक करके 5-दिवसीय पूर्वानुमान, 24 घंटे का प्रति-घंटे का मौसम, और फसल सलाह देख सकते हैं।'
      : 'Great question! You can explore the interactive Map Dashboard to view 5-day panchayat forecasts, 24-hour hourly weather timelines, and AI crop advisories across 24 Indian districts.';
  };

  const handleSend = (textToSend) => {
    const query = textToSend || inputValue;
    if (!query.trim()) return;

    const userMsg = {
      role: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);

    setTimeout(() => {
      const botReply = {
        role: 'bot',
        text: getBotResponse(query, lang),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, botReply]);
      setIsTyping(false);
    }, 600);
  };

  return (
    <div className="fixed bottom-6 right-6 z-[2000] flex flex-col items-end">
      
      {/* Floating Prompt Callout (Guides user directly to chatbot) */}
      {!isOpen && showCallout && (
        <div 
          onClick={() => { setIsOpen(true); setShowCallout(false); }}
          className="bg-white/95 backdrop-blur-md border border-green-300 text-gray-800 px-3.5 py-2 rounded-2xl shadow-xl mb-3 flex items-center gap-2 cursor-pointer hover:bg-green-50 transition-all animate-bounce"
        >
          <span className="flex h-2.5 w-2.5 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
          </span>
          <span className="text-xs font-bold text-green-900">
            {lang === 'hi' ? '🌾 AI सहायक से पूछें' : '🌾 Ask KrishiDrishti AI'}
          </span>
          <button 
            onClick={(e) => { e.stopPropagation(); setShowCallout(false); }}
            className="text-gray-400 hover:text-gray-600 ml-1 p-0.5"
          >
            <X size={12} />
          </button>
        </div>
      )}

      {/* Chat Window Panel */}
      {isOpen && (
        <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 mb-3 w-[92vw] sm:w-[380px] h-[520px] max-h-[82vh] flex flex-col overflow-hidden animate-fade-in">
          
          {/* Header */}
          <div className="bg-gradient-to-r from-green-700 to-green-600 text-white p-3.5 flex items-center justify-between shadow-xs">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center shrink-0 shadow-inner">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-sm leading-tight text-white flex items-center gap-1.5">
                  KrishiDrishti AI
                  <span className="text-[10px] bg-green-800/80 px-1.5 py-0.2 rounded text-green-200 font-normal">Hyperlocal</span>
                </h3>
                <p className="text-[11px] text-green-100 flex items-center gap-1 mt-0.5">
                  <span className="w-2 h-2 bg-green-300 rounded-full inline-block animate-pulse"></span>
                  {lang === 'hi' ? 'सक्रिय • सभी 24 जिलों के लिए' : 'Online • 24 Districts Covered'}
                </p>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-lg hover:bg-white/20 text-white/90 hover:text-white transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          {/* Quick Suggestion Chips */}
          <div className="bg-green-50/70 border-b border-green-100 px-3 py-2 flex gap-1.5 overflow-x-auto hide-scrollbar">
            {quickQuestions.map((q, i) => (
              <button
                key={i}
                onClick={() => handleSend(q)}
                className="text-[11px] bg-white border border-green-200 hover:border-green-400 text-green-900 px-2.5 py-1 rounded-full whitespace-nowrap shadow-2xs font-medium hover:bg-green-100/50 transition-colors"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Messages Area */}
          <div className="flex-1 p-3.5 space-y-3.5 overflow-y-auto bg-gray-50/80">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div 
                  className={`p-3 max-w-[85%] rounded-2xl shadow-xs text-xs sm:text-sm leading-relaxed ${
                    msg.role === 'user' 
                      ? 'bg-green-700 text-white rounded-tr-xs' 
                      : 'bg-white border border-gray-200 text-gray-800 rounded-tl-xs'
                  }`}
                >
                  <p>{msg.text}</p>
                  <span className={`text-[10px] mt-1 flex ${msg.role === 'user' ? 'justify-end text-green-200' : 'justify-end text-gray-400'}`}>
                    {msg.timestamp}
                  </span>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white border border-gray-200 rounded-2xl rounded-tl-xs p-3 shadow-xs flex items-center gap-1.5">
                  <span className="text-[11px] text-gray-400 font-medium mr-1">AI Thinking</span>
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-bounce"></div>
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Box */}
          <form 
            onSubmit={(e) => { e.preventDefault(); handleSend(); }} 
            className="p-2.5 bg-white border-t border-gray-200 flex items-center gap-2"
          >
            <input
              type="text"
              className="flex-1 rounded-full px-4 py-2 text-xs sm:text-sm border border-gray-300 focus:outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600"
              placeholder={lang === 'hi' ? 'मौसम, फसल या स्थान के बारे में पूछें...' : 'Ask about weather, crops, accuracy...'}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
            <button 
              type="submit"
              disabled={!inputValue.trim()}
              className="w-9 h-9 bg-green-700 rounded-full flex items-center justify-center shrink-0 text-white hover:bg-green-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed shadow-xs"
            >
              <Send size={15} />
            </button>
          </form>
        </div>
      )}

      {/* Floating Toggle Button */}
      <button
        onClick={() => {
          setIsOpen(!isOpen);
          setShowCallout(false);
        }}
        className="w-14 h-14 bg-gradient-to-tr from-green-700 to-green-600 hover:from-green-800 hover:to-green-700 text-white rounded-full flex items-center justify-center shadow-xl transition-all hover:scale-105 focus:outline-none focus:ring-3 focus:ring-green-400 group relative cursor-pointer"
        aria-label="Toggle AI Assistant"
      >
        {isOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-7 h-7" />}
        <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-amber-400 rounded-full border-2 border-white"></span>
      </button>
    </div>
  );
}
