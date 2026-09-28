import React, { useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { 
  Cloud, Mountain, Network, Waves, BarChart3, Users, 
  ArrowDown, ArrowRight, Database, Cpu, GitBranch, 
  Layers, Activity, Target, Zap, ChevronDown, 
  ChevronUp, Eye, Sparkles, RefreshCcw, Map
} from 'lucide-react';
import { useLang } from '../context/LanguageContext';
import { t } from '../i18n/translations';

const Step1Viz = () => (
  <div className="mt-4 bg-slate-50 p-4 rounded-lg flex flex-col items-center justify-center border border-slate-200">
    <div className="grid grid-cols-3 gap-1 w-32 h-20">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="bg-sky-300 rounded-sm opacity-80" />
      ))}
    </div>
    <span className="text-xs text-slate-600 mt-2 font-medium">Block Forecast</span>
  </div>
);

const Step2Viz = () => (
  <div className="mt-4 bg-slate-50 p-4 rounded-lg flex flex-col gap-2 items-center justify-center border border-slate-200">
    <span className="px-3 py-1 bg-amber-100 text-amber-800 text-xs rounded-full font-medium border border-amber-200">Elevation 2100m</span>
    <span className="px-3 py-1 bg-green-100 text-green-800 text-xs rounded-full font-medium border border-green-200">Forest Cover</span>
    <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs rounded-full font-medium border border-blue-200">River 2.3km</span>
  </div>
);

const Step3Viz = () => (
  <div className="mt-4 bg-slate-50 p-4 rounded-lg flex items-center justify-center border border-slate-200 relative h-32 overflow-hidden">
    <svg className="absolute inset-0 w-full h-full text-purple-300 stroke-current" style={{ strokeWidth: 1.5 }}>
      <line x1="20%" y1="30%" x2="50%" y2="50%" />
      <line x1="80%" y1="30%" x2="50%" y2="50%" />
      <line x1="20%" y1="70%" x2="50%" y2="50%" />
      <line x1="80%" y1="70%" x2="50%" y2="50%" />
      <line x1="50%" y1="20%" x2="50%" y2="50%" />
    </svg>
    <div className="absolute w-6 h-6 bg-purple-500 rounded-full" style={{ left: 'calc(20% - 12px)', top: 'calc(30% - 12px)' }} />
    <div className="absolute w-6 h-6 bg-purple-500 rounded-full" style={{ left: 'calc(80% - 12px)', top: 'calc(30% - 12px)' }} />
    <div className="absolute w-6 h-6 bg-purple-500 rounded-full" style={{ left: 'calc(20% - 12px)', top: 'calc(70% - 12px)' }} />
    <div className="absolute w-6 h-6 bg-purple-500 rounded-full" style={{ left: 'calc(80% - 12px)', top: 'calc(70% - 12px)' }} />
    <div className="absolute w-8 h-8 bg-purple-700 rounded-full flex items-center justify-center text-white" style={{ left: 'calc(50% - 16px)', top: 'calc(50% - 16px)' }}><Zap size={16} /></div>
    <div className="absolute w-6 h-6 bg-purple-500 rounded-full" style={{ left: 'calc(50% - 12px)', top: 'calc(20% - 12px)' }} />
  </div>
);

const Step4Viz = () => (
  <div className="mt-4 bg-slate-50 p-4 rounded-lg flex flex-col items-center justify-center border border-slate-200 h-32 relative overflow-hidden">
    <div className="w-full h-16 flex items-end justify-center relative">
      <div className="w-2/3 h-full bg-gradient-to-t from-blue-300 to-transparent rounded-t-full opacity-60 relative blur-sm" />
      <svg className="absolute w-full h-full text-blue-600 fill-transparent stroke-current" style={{ strokeWidth: 2 }} viewBox="0 0 100 50" preserveAspectRatio="none">
         <path d="M 0 50 C 30 50 40 5 50 5 C 60 5 70 50 100 50" />
      </svg>
    </div>
    <span className="text-xs text-slate-600 mt-2 font-medium z-10 text-center">Ensemble of<br/>possible outcomes</span>
  </div>
);

const Step5Viz = () => (
  <div className="mt-4 bg-slate-50 p-4 rounded-lg flex flex-col items-center justify-center border border-slate-200">
    <div className="grid grid-cols-6 gap-0.5 w-32 h-20 bg-slate-300 p-0.5 rounded-sm">
      {[...Array(24)].map((_, i) => (
        <div key={i} className={`bg-green-${(i % 3 === 0 ? 500 : i % 2 === 0 ? 600 : 400)} rounded-sm`} />
      ))}
    </div>
    <span className="text-xs text-slate-600 mt-2 font-medium">Panchayat Forecast</span>
  </div>
);

const Step6Viz = () => (
  <div className="mt-4 bg-slate-50 p-4 rounded-lg flex items-center justify-center border border-slate-200 h-32">
    <div className="flex items-center gap-4 relative">
       <div className="flex flex-col items-center">
         <div className="w-10 h-10 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center"><Users size={20} /></div>
         <span className="text-[10px] font-bold mt-1 text-slate-600 uppercase tracking-wider">Farmer</span>
       </div>
       
       <div className="relative flex items-center justify-center">
         <RefreshCcw size={24} className="text-orange-400 animate-[spin_4s_linear_infinite]" />
       </div>

       <div className="flex flex-col items-center">
         <div className="w-10 h-10 bg-sky-100 text-sky-600 rounded-full flex items-center justify-center"><Cpu size={20} /></div>
         <span className="text-[10px] font-bold mt-1 text-slate-600 uppercase tracking-wider">Model</span>
       </div>
    </div>
  </div>
);

const stepComponents = [
  { icon: Cloud, Viz: Step1Viz, color: "bg-sky-800 text-white", border: "border-sky-800", text: "text-sky-800" },
  { icon: Mountain, Viz: Step2Viz, color: "bg-amber-700 text-white", border: "border-amber-700", text: "text-amber-700" }, // earth-700
  { icon: Network, Viz: Step3Viz, color: "bg-[#7C3AED] text-white", border: "border-[#7C3AED]", text: "text-[#7C3AED]" },
  { icon: Layers, Viz: Step4Viz, color: "bg-[#2563EB] text-white", border: "border-[#2563EB]", text: "text-[#2563EB]" },
  { icon: Target, Viz: Step5Viz, color: "bg-green-700 text-white", border: "border-green-700", text: "text-green-700" }, // crop-700
  { icon: RefreshCcw, Viz: Step6Viz, color: "bg-[#EA580C] text-white", border: "border-[#EA580C]", text: "text-[#EA580C]" }
];

const AccordionItem = ({ title, content, icon: Icon, defaultOpen = false }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  return (
    <div className="border border-slate-200 rounded-xl mb-4 overflow-hidden bg-white shadow-sm hover:border-slate-300 transition-colors">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-5 text-left bg-slate-50 hover:bg-slate-100 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 bg-slate-200 rounded-lg text-slate-700">
            <Icon size={20} />
          </div>
          <span className="font-semibold text-lg text-slate-900">{title}</span>
        </div>
        {isOpen ? <ChevronUp className="text-slate-500" /> : <ChevronDown className="text-slate-500" />}
      </button>
      {isOpen && (
        <div className="p-5 bg-white border-t border-slate-100">
          <div className="text-slate-600 leading-relaxed text-sm md:text-base whitespace-pre-line" dangerouslySetInnerHTML={{ __html: content }} />
        </div>
      )}
    </div>
  );
};

export default function MethodologyPage() {
  const { lang } = useLang();

  const getStepText = (i, field) => {
    return t(lang, `methodology.step${i + 1}${field}`) || `Step ${i + 1} ${field}`;
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-20 pb-16">
      
      {/* Header */}
      <section className="bg-gradient-to-b from-sky-50 to-slate-50 py-16 text-center px-4">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4 tracking-tight">
            {t(lang, 'methodology.title') || 'How KrishiDrishti Works'}
          </h1>
          <p className="text-lg text-slate-600">
            {t(lang, 'methodology.subtitle') || 'A technical deep-dive into our AI-driven spatial downscaling pipeline.'}
          </p>
        </div>
      </section>

      {/* Pipeline Diagram */}
      <section className="py-12 px-4 max-w-4xl mx-auto">
        <div className="relative">
          {stepComponents.map((step, i) => {
            const { icon: Icon, Viz, color, border, text } = step;
            return (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="relative flex flex-col md:flex-row items-center md:items-start gap-6 mb-12"
              >
                {/* Step Connector - hidden on last item */}
                {i < stepComponents.length - 1 && (
                  <div className="absolute left-1/2 -bottom-10 md:left-8 transform -translate-x-1/2 w-0.5 h-10 bg-slate-300 md:-bottom-12 md:h-12 z-0 hidden md:block">
                     <ArrowDown className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 text-slate-400 animate-pulse" size={20} />
                  </div>
                )}
                
                {/* Step Mobile Connector */}
                {i < stepComponents.length - 1 && (
                  <div className="absolute left-1/2 -bottom-8 transform -translate-x-1/2 text-slate-400 z-0 md:hidden animate-pulse">
                     <ArrowDown size={24} />
                  </div>
                )}

                {/* Step Number & Icon */}
                <div className="z-10 flex-shrink-0 flex flex-col items-center mt-2">
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center ${color} shadow-lg`}>
                    <Icon size={28} />
                  </div>
                  <div className={`mt-2 font-bold text-lg ${text}`}>
                    Step {i + 1}
                  </div>
                </div>

                {/* Step Content */}
                <div className={`flex-grow bg-white p-6 rounded-2xl shadow-sm border-l-4 ${border} border-t border-r border-b border-slate-200 w-full max-w-lg md:max-w-none`}>
                  <h3 className="text-xl font-bold text-slate-800 mb-2">
                    {getStepText(i, 'Title')}
                  </h3>
                  <p className="text-slate-600 mb-4 leading-relaxed">
                    {getStepText(i, 'Text')}
                  </p>
                  
                  <Viz />
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Technical Details Accordion */}
      <section className="py-12 px-4 max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold text-slate-900 mb-8 text-center">Technical Architecture</h2>
        
        <AccordionItem 
          title="Graph Attention Network Architecture" 
          icon={Network} 
          defaultOpen={true}
          content={`Our core spatial downscaling uses a <strong>Graph Attention Network (GAT)</strong>. 

Panchayats act as <code>nodes</code>, while their shared boundaries or geographic proximity act as <code>edges</code>. The attention mechanism allows the network to dynamically weigh the influence of neighboring panchayats. 

For instance, a panchayat sharing a valley with its neighbor will pay more "attention" to it than one separated by a high ridge, learning these complex spatial relationships directly from historical data.`}
        />
        
        <AccordionItem 
          title="Conditional Diffusion Model" 
          icon={Layers}
          content={`To handle the inherent uncertainty of weather, we employ a <strong>Conditional Diffusion Model</strong>.

Instead of predicting a single deterministic outcome, the model learns the conditional distribution of local weather given the coarse block-level forecast and local terrain. By running the reverse diffusion process multiple times, we generate an <code>ensemble</code> of plausible panchayat-level weather scenarios, giving us both a mean prediction and a confidence interval.`}
        />
        
        <AccordionItem 
          title="Uncertainty Quantification" 
          icon={BarChart3}
          content={`Weather forecasts are most useful when accompanied by reliability metrics. 

By utilizing the ensemble generated by our diffusion model, we calculate the spread of outcomes. A tight cluster of predictions indicates high certainty (e.g., clear skies across the board), while a wide spread signifies high uncertainty (e.g., scattered local thunderstorms). 

These calibrated intervals empower farmers to make risk-aware agricultural decisions.`}
        />
        
        <AccordionItem 
          title="Feedback Loop & Recalibration" 
          icon={RefreshCcw}
          content={`The system continuously learns from the ground up. 

When a farmer reports that actual rainfall differed significantly from the forecast, this data acts as a sparse ground-truth signal. We use these reports to apply <strong>bias corrections</strong> and incrementally fine-tune the model weights. 

This human-in-the-loop approach ensures the model adapts to highly localized microclimates that even our high-resolution terrain data might miss.`}
        />
      </section>

      {/* Data Sources Grid */}
      <section className="py-16 px-4 max-w-5xl mx-auto">
        <h2 className="text-2xl font-bold text-slate-900 mb-2 text-center">Data Sources</h2>
        <p className="text-slate-600 text-center mb-10">The foundational datasets powering our models.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col items-center text-center">
            <div className="w-12 h-12 bg-sky-100 text-sky-700 rounded-full flex items-center justify-center mb-4">
              <Cloud size={24} />
            </div>
            <h4 className="font-bold text-slate-800">IMD</h4>
            <p className="text-xs text-slate-500 mt-1 mb-2">India Meteorological Department</p>
            <p className="text-sm text-slate-600">Block-level weather forecasts and historical gridded data.</p>
          </div>
          
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col items-center text-center">
            <div className="w-12 h-12 bg-amber-100 text-amber-700 rounded-full flex items-center justify-center mb-4">
              <Mountain size={24} />
            </div>
            <h4 className="font-bold text-slate-800">SRTM</h4>
            <p className="text-xs text-slate-500 mt-1 mb-2">Shuttle Radar Topography</p>
            <p className="text-sm text-slate-600">High-resolution (30m) digital elevation models for terrain features.</p>
          </div>
          
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col items-center text-center">
            <div className="w-12 h-12 bg-green-100 text-green-700 rounded-full flex items-center justify-center mb-4">
              <Map size={24} />
            </div>
            <h4 className="font-bold text-slate-800">ISRO Bhuvan</h4>
            <p className="text-xs text-slate-500 mt-1 mb-2">National Geo-portal</p>
            <p className="text-sm text-slate-600">Land Use and Land Cover (LULC) maps for surface characteristics.</p>
          </div>
          
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col items-center text-center">
            <div className="w-12 h-12 bg-purple-100 text-purple-700 rounded-full flex items-center justify-center mb-4">
              <Database size={24} />
            </div>
            <h4 className="font-bold text-slate-800">Census of India</h4>
            <p className="text-xs text-slate-500 mt-1 mb-2">Government of India</p>
            <p className="text-sm text-slate-600">Administrative boundaries and Panchayat polygon spatial data.</p>
          </div>
        </div>
      </section>

    </div>
  );
}

