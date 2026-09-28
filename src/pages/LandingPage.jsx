import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  MapPin, 
  BarChart3, 
  Zap, 
  MessageSquare, 
  ArrowRight, 
  Layers, 
  Activity,
  CloudRain,
  Thermometer,
  Droplets,
  Users,
  TrendingUp
} from 'lucide-react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { useLang } from '../context/LanguageContext';
import { t } from '../i18n/translations';
import { blocks, panchayats, tempToColor, platformStats } from '../data/mockData';

// Reusable animated section wrapper
const FadeIn = ({ children, delay = 0, className = '', direction = 'up' }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  
  const yOffset = direction === 'up' ? 40 : direction === 'down' ? -40 : 0;
  const xOffset = direction === 'left' ? 40 : direction === 'right' ? -40 : 0;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: yOffset, x: xOffset }}
      animate={isInView ? { opacity: 1, y: 0, x: 0 } : { opacity: 0, y: yOffset, x: xOffset }}
      transition={{ duration: 0.7, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

const AnimatedMapTeaser = () => {
  const [isPanchayatView, setIsPanchayatView] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsPanchayatView(prev => !prev);
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  // Prepare 6 blocks for the grid, each with 4 panchayats
  const displayBlocks = blocks.slice(0, 6).map(block => {
    let pList = panchayats.filter(p => p.block_id === block.id);
    // Fallback if mock data doesn't have exactly 4 per block
    if (pList.length < 4) {
      pList = [...pList, ...panchayats].slice(0, 4);
    } else {
      pList = pList.slice(0, 4);
    }
    return { block, panchayats: pList };
  });

  return (
    <div className="w-full max-w-3xl mx-auto flex flex-col items-center">
      {/* Toggle UI */}
      <div className="flex items-center space-x-2 md:space-x-4 mb-8 bg-white p-1.5 rounded-full shadow-sm border border-gray-100 relative z-10">
        <button 
          className={`px-5 py-2.5 rounded-full text-sm md:text-base font-semibold transition-all duration-300 ${!isPanchayatView ? 'bg-[#0F4C75] text-white shadow-md' : 'text-[#5E5E78] hover:bg-gray-50'}`} 
          onClick={() => setIsPanchayatView(false)}
        >
          Block Level (Coarse)
        </button>
        <button 
          className={`px-5 py-2.5 rounded-full text-sm md:text-base font-semibold transition-all duration-300 ${isPanchayatView ? 'bg-[#40916C] text-white shadow-md' : 'text-[#5E5E78] hover:bg-gray-50'}`} 
          onClick={() => setIsPanchayatView(true)}
        >
          Panchayat Level (Precise)
        </button>
      </div>

      {/* Map Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4 w-full bg-[#F8F6F0] p-4 md:p-6 rounded-2xl border border-gray-200 shadow-inner">
        {displayBlocks.map((item, i) => (
          <div key={i} className="aspect-square relative overflow-hidden rounded-xl shadow-sm border border-gray-200 bg-gray-100">
            <AnimatePresence mode="wait">
              {!isPanchayatView ? (
                <motion.div
                  key="block"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.05 }}
                  transition={{ duration: 0.6 }}
                  className="absolute inset-0 flex items-center justify-center text-white font-bold text-lg md:text-xl tracking-wide"
                  style={{ backgroundColor: tempToColor(item.block.forecast?.tempHigh || 32) }}
                >
                  <div className="bg-black/20 px-3 py-1 rounded backdrop-blur-sm">
                    {item.block.name}
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="panchayat"
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.6 }}
                  className="absolute inset-0 grid grid-cols-2 gap-0.5 bg-gray-300"
                >
                  {item.panchayats.map((p, j) => (
                    <div
                      key={j}
                      className="w-full h-full flex items-center justify-center text-[10px] md:text-xs text-white font-medium p-1 text-center leading-tight transition-colors duration-500"
                      style={{ backgroundColor: tempToColor(p.forecast?.tempHigh || (30 + j)) }}
                    >
                      <span className="truncate w-full drop-shadow-md bg-black/10 px-1 rounded">{p.name}</span>
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </div>
  );
};

export default function LandingPage() {
  const { lang } = useLang();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#FAFAF7] text-[#1A1A2E] overflow-hidden">
      
      {/* Hero Section */}
      <section className="relative pt-24 pb-20 md:pt-32 md:pb-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-12">
        {/* Background Decorative Elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
          <div className="absolute -top-[20%] -right-[10%] w-[50%] h-[50%] rounded-full bg-gradient-to-br from-[#0F4C75]/10 to-[#52B788]/10 blur-3xl" />
          <div className="absolute top-[40%] -left-[10%] w-[40%] h-[40%] rounded-full bg-gradient-to-tr from-[#D4A843]/10 to-[#40916C]/10 blur-3xl" />
        </div>

        <div className="w-full lg:w-1/2 flex flex-col items-start text-left">
          <FadeIn>
            <div className="inline-block px-4 py-1.5 mb-6 rounded-full bg-white/60 border border-[#0F4C75]/20 text-[#0F4C75] font-semibold text-sm shadow-sm backdrop-blur-sm">
              8 States • 14 Districts • 84 Blocks • 336 Panchayats
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-4 leading-tight">
              <span className="block">{t(lang, 'hero.title') || 'Hyperlocal Weather.'}</span>
              <span className="block bg-clip-text text-transparent bg-gradient-to-r from-[#0F4C75] via-[#40916C] to-[#D4A843]">
                {t(lang, 'hero.titleHighlight') || 'Empowering Farmers.'}
              </span>
            </h1>
          </FadeIn>
          
          <FadeIn delay={0.2}>
            <p className="text-lg md:text-xl text-[#5E5E78] mb-8 max-w-2xl leading-relaxed">
              {t(lang, 'hero.subtitle') || 'KrishiDrishti sharpens broad meteorological data down to the Panchayat level, giving you precise, actionable agricultural advisories.'}
            </p>
          </FadeIn>

          <FadeIn delay={0.4} className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <Link 
              to="/dashboard" 
              className="inline-flex justify-center items-center px-8 py-4 rounded-xl bg-[#0F4C75] text-white font-semibold text-lg hover:bg-[#0a3654] transition-all shadow-lg hover:shadow-xl hover:-translate-y-1"
            >
              {t(lang, 'hero.cta') || 'Explore the Dashboard'}
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
            <Link 
              to="/methodology" 
              className="inline-flex justify-center items-center px-8 py-4 rounded-xl bg-white text-[#0F4C75] border-2 border-[#0F4C75]/20 font-semibold text-lg hover:bg-gray-50 transition-all"
            >
              {t(lang, 'nav.methodology') || 'Our Methodology'}
            </Link>
          </FadeIn>

          <FadeIn delay={0.6} className="w-full mt-12 grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: t(lang, 'hero.stat1Label') || 'Panchayats', value: platformStats.totalPanchayats.toLocaleString(), icon: MapPin },
              { label: t(lang, 'hero.stat2Label') || 'Accuracy', value: platformStats.forecastAccuracy, icon: TrendingUp },
              { label: t(lang, 'hero.stat3Label') || 'Farmers', value: platformStats.farmersReached, icon: Users },
              { label: t(lang, 'hero.stat4Label') || 'Blocks', value: platformStats.totalBlocks.toString(), icon: Layers }
            ].map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <div key={idx} className="bg-white/60 backdrop-blur-sm border border-gray-200 rounded-xl p-4 flex flex-col items-center justify-center shadow-sm">
                  <Icon className="w-6 h-6 text-[#0F4C75] mb-2" />
                  <span className="text-2xl md:text-3xl font-bold text-[#0F4C75]">{stat.value}</span>
                  <span className="text-xs md:text-sm text-[#5E5E78] font-medium mt-1">{stat.label}</span>
                </div>
              );
            })}
          </FadeIn>
        </div>

        <div className="w-full lg:w-1/2 flex justify-center lg:justify-end mt-12 lg:mt-0">
          <FadeIn delay={0.3} direction="left" className="w-full">
             <AnimatedMapTeaser />
          </FadeIn>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-center gap-16">
          <div className="w-full lg:w-1/2 order-2 lg:order-1">
            {/* Simple CSS Illustration for Problem */}
            <FadeIn direction="right">
              <div className="flex flex-col sm:flex-row items-center gap-6 p-8 bg-[#F8F6F0] rounded-3xl border border-gray-100">
                <div className="flex-1 w-full aspect-square bg-[#e65c5c] rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-inner shadow-black/20">
                  Block Level
                </div>
                <ArrowRight className="text-gray-400 w-8 h-8 hidden sm:block shrink-0" />
                <ArrowRight className="text-gray-400 w-8 h-8 sm:hidden shrink-0 rotate-90" />
                <div className="flex-1 w-full aspect-square grid grid-cols-2 grid-rows-2 gap-2">
                  <div className="bg-[#52B788] rounded-tl-xl shadow-inner shadow-black/10 flex items-center justify-center text-white/90 text-sm font-medium">P1</div>
                  <div className="bg-[#40916C] rounded-tr-xl shadow-inner shadow-black/10 flex items-center justify-center text-white/90 text-sm font-medium">P2</div>
                  <div className="bg-[#D4A843] rounded-bl-xl shadow-inner shadow-black/10 flex items-center justify-center text-white/90 text-sm font-medium">P3</div>
                  <div className="bg-[#0F4C75] rounded-br-xl shadow-inner shadow-black/10 flex items-center justify-center text-white/90 text-sm font-medium">P4</div>
                </div>
              </div>
            </FadeIn>
          </div>
          
          <div className="w-full lg:w-1/2 order-1 lg:order-2">
            <FadeIn>
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-[#1A1A2E]">
                {t(lang, 'landing.problemTitle') || 'The Problem with Broad Forecasts'}
              </h2>
              <p className="text-lg text-[#5E5E78] leading-relaxed">
                {t(lang, 'landing.problemText') || 'Traditional weather forecasts are provided at the block level. For a farmer, a block covering hundreds of square kilometers means the predicted rainfall might completely miss their specific village. This coarse resolution leads to inaccurate agricultural advisories and lost crop yield.'}
              </p>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section className="py-20 bg-[#F8F6F0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-4xl">
          <FadeIn>
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-[#1A1A2E]">
              {t(lang, 'landing.solutionTitle') || 'Our Hyperlocal Solution'}
            </h2>
            <p className="text-lg md:text-xl text-[#5E5E78] leading-relaxed mb-12">
              {t(lang, 'landing.solutionText') || 'KrishiDrishti employs statistical and dynamical downscaling techniques to sharpen block-level forecasts into precise, panchayat-level intelligence. We combine IMD data with local topography and historical patterns to give you actionable insights for your exact location.'}
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 bg-[#FAFAF7] relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <FadeIn>
            <div className="text-center mb-16">
              <span className="inline-block bg-[#40916C]/10 text-[#40916C] text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
                {lang === 'hi' ? 'प्रमुख विशेषताएँ' : 'Key Features'}
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-[#1A1A2E] mb-4">
                {lang === 'hi' ? 'किसानों के लिए बनी बुद्धिमान तकनीक' : 'Intelligent Technology Built for Farmers'}
              </h2>
              <p className="text-lg text-[#5E5E78] max-w-2xl mx-auto">
                {lang === 'hi' 
                  ? 'हमारी AI-संचालित पाइपलाइन ब्लॉक-स्तरीय पूर्वानुमानों को पंचायत-स्तरीय कार्रवाई योग्य सलाह में बदलती है।' 
                  : 'Our AI-powered pipeline transforms coarse block-level forecasts into panchayat-level actionable advisories.'}
              </p>
            </div>
          </FadeIn>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <FadeIn delay={0.1}>
              <div className="glass-card bg-white/70 backdrop-blur-xl border border-gray-200 shadow-xl rounded-3xl p-8 h-full transition-transform hover:-translate-y-1">
                <div className="w-14 h-14 bg-[#0F4C75]/10 text-[#0F4C75] rounded-2xl flex items-center justify-center mb-6">
                  <MapPin className="w-7 h-7" />
                </div>
                <h3 className="text-2xl font-bold mb-3">{t(lang, 'landing.feature1Title') || 'Panchayat-Level Precision'}</h3>
                <p className="text-[#5E5E78] text-lg leading-relaxed">
                  {t(lang, 'landing.feature1Text') || 'Forecasts tailored to your village\'s exact elevation, land use, and proximity to water bodies — not a broad block average.'}
                </p>
              </div>
            </FadeIn>
            
            <FadeIn delay={0.2}>
              <div className="glass-card bg-white/70 backdrop-blur-xl border border-gray-200 shadow-xl rounded-3xl p-8 h-full transition-transform hover:-translate-y-1">
                <div className="w-14 h-14 bg-[#40916C]/10 text-[#40916C] rounded-2xl flex items-center justify-center mb-6">
                  <BarChart3 className="w-7 h-7" />
                </div>
                <h3 className="text-2xl font-bold mb-3">{t(lang, 'landing.feature2Title') || 'Uncertainty Bands'}</h3>
                <p className="text-[#5E5E78] text-lg leading-relaxed">
                  {t(lang, 'landing.feature2Text') || 'Not just a single number — see the range of possible outcomes with calibrated confidence intervals so you can plan for risk.'}
                </p>
              </div>
            </FadeIn>

            <FadeIn delay={0.3}>
              <div className="glass-card bg-white/70 backdrop-blur-xl border border-gray-200 shadow-xl rounded-3xl p-8 h-full transition-transform hover:-translate-y-1">
                <div className="w-14 h-14 bg-[#D4A843]/10 text-[#D4A843] rounded-2xl flex items-center justify-center mb-6">
                  <Zap className="w-7 h-7" />
                </div>
                <h3 className="text-2xl font-bold mb-3">{t(lang, 'landing.feature3Title') || 'Crop-Specific Advisories'}</h3>
                <p className="text-[#5E5E78] text-lg leading-relaxed">
                  {t(lang, 'landing.feature3Text') || 'Actionable guidance: when to irrigate, when to harvest, frost warnings, and heat-stress alerts — all tuned to your crop\'s growth stage.'}
                </p>
              </div>
            </FadeIn>

            <FadeIn delay={0.4}>
              <div className="glass-card bg-white/70 backdrop-blur-xl border border-gray-200 shadow-xl rounded-3xl p-8 h-full transition-transform hover:-translate-y-1">
                <div className="w-14 h-14 bg-[#52B788]/10 text-[#52B788] rounded-2xl flex items-center justify-center mb-6">
                  <MessageSquare className="w-7 h-7" />
                </div>
                <h3 className="text-2xl font-bold mb-3">{t(lang, 'landing.feature4Title') || 'Farmer Feedback Loop'}</h3>
                <p className="text-[#5E5E78] text-lg leading-relaxed">
                  {t(lang, 'landing.feature4Text') || 'Report what actually happened in your field. Your ground truth makes our model smarter over time — crowd-sourced accuracy.'}
                </p>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Animated Map Teaser Section is included in the Hero */}
      <section className="py-20 bg-[#0F4C75] text-white text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <FadeIn>
            <h2 className="text-3xl md:text-5xl font-bold mb-8">
              {lang === 'hi' ? 'अपने खेत का हाइपरलोकल मौसम पूर्वानुमान देखें' : 'See the Hyperlocal Forecast for Your Farm'}
            </h2>
            <Link 
              to="/dashboard" 
              className="inline-flex justify-center items-center px-10 py-5 rounded-full bg-white text-[#0F4C75] font-bold text-xl hover:bg-gray-100 transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1"
            >
              {t(lang, 'nav.dashboard') || 'Go to Dashboard'}
              <ArrowRight className="ml-3 w-6 h-6" />
            </Link>
          </FadeIn>
        </div>
      </section>
      
    </div>
  );
}
