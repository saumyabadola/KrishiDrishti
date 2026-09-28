import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Globe, Sun, Sprout } from 'lucide-react';
import { useLang } from '../context/LanguageContext';
import { t } from '../i18n/translations';

export default function Header() {
  const { lang, toggleLang } = useLang();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const navItems = [
    { path: '/', label: t(lang, 'nav.home') },
    { path: '/dashboard', label: t(lang, 'nav.dashboard') },
    { path: '/feedback', label: t(lang, 'nav.feedback') },
    { path: '/methodology', label: t(lang, 'nav.methodology') },
    { path: '/admin', label: t(lang, 'nav.admin') },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-lg border-b border-surface-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-14 sm:h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 flex-shrink-0">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-gradient-to-br from-sky-800 to-crop-700 flex items-center justify-center shadow-md">
              <Sprout className="w-5 h-5 text-white" />
            </div>
            <div className="hidden xs:block">
              <span className="text-lg sm:text-xl font-bold text-ink-900 tracking-tight">
                {t(lang, 'appName')}
              </span>
              <span className="hidden sm:inline text-xs text-ink-500 ml-2">
                {t(lang, 'appNameSub')}
              </span>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-150 ${
                  isActive(item.path)
                    ? 'bg-sky-800/10 text-sky-800'
                    : 'text-ink-600 hover:text-ink-900 hover:bg-surface-100'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Right side: language toggle + mobile menu */}
          <div className="flex items-center gap-2">
            <button
              onClick={toggleLang}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-100 hover:bg-surface-200 text-sm font-medium text-ink-700 transition-colors duration-150"
              aria-label="Toggle language"
            >
              <Globe className="w-4 h-4" />
              <span>{lang === 'en' ? 'हिं' : 'EN'}</span>
            </button>

            {/* Mobile hamburger */}
            <button
              className="md:hidden p-2 rounded-lg hover:bg-surface-100 text-ink-700"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
            >
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <nav className="md:hidden pb-4 pt-2 border-t border-surface-200 mt-2 animate-fade-in">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMenuOpen(false)}
                className={`block px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                  isActive(item.path)
                    ? 'bg-sky-800/10 text-sky-800'
                    : 'text-ink-600 hover:bg-surface-100'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        )}
      </div>
    </header>
  );
}
