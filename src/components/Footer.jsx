import React from 'react';
import { Link } from 'react-router-dom';
import { Sprout, Github, ExternalLink } from 'lucide-react';
import { useLang } from '../context/LanguageContext';
import { t } from '../i18n/translations';

export default function Footer() {
  const { lang } = useLang();

  return (
    <footer className="bg-ink-900 text-white/80 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-sky-600 to-crop-600 flex items-center justify-center">
                <Sprout className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-bold text-white">{t(lang, 'appName')}</span>
            </div>
            <p className="text-sm text-white/60 leading-relaxed">
              {t(lang, 'footer.tagline')}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-3 uppercase tracking-wider">Links</h4>
            <div className="space-y-2">
              <Link to="/dashboard" className="block text-sm text-white/60 hover:text-white transition-colors">
                {t(lang, 'nav.dashboard')}
              </Link>
              <Link to="/feedback" className="block text-sm text-white/60 hover:text-white transition-colors">
                {t(lang, 'nav.feedback')}
              </Link>
              <Link to="/methodology" className="block text-sm text-white/60 hover:text-white transition-colors">
                {t(lang, 'nav.methodology')}
              </Link>
              <Link to="/admin" className="block text-sm text-white/60 hover:text-white transition-colors">
                {t(lang, 'nav.admin')}
              </Link>
            </div>
          </div>

          {/* Data Sources */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-3 uppercase tracking-wider">
              {lang === 'en' ? 'Data Sources' : 'डेटा स्रोत'}
            </h4>
            <div className="space-y-2 text-sm text-white/60">
              <p>IMD — India Meteorological Dept.</p>
              <p>SRTM DEM — Elevation Data</p>
              <p>ISRO Bhuvan — Land Use / LULC</p>
              <p>Census of India — Panchayat Boundaries</p>
            </div>
          </div>

          {/* Tech */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-3 uppercase tracking-wider">
              {lang === 'en' ? 'Built With' : 'के साथ बनाया'}
            </h4>
            <div className="space-y-2 text-sm text-white/60">
              <p>React + Tailwind CSS</p>
              <p>Leaflet.js Maps</p>
              <p>Recharts Visualization</p>
              <p>Node.js / Express API</p>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-white/40">
            {t(lang, 'footer.disclaimer')}
          </p>
          <p className="text-xs text-white/40">
            {t(lang, 'footer.madeWith')} 🇮🇳 • © 2026 KrishiDrishti
          </p>
        </div>
      </div>
    </footer>
  );
}
