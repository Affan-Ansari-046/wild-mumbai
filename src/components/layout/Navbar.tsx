import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Compass, 
  MapPin, 
  TreePine, 
  Calendar, 
  ShieldAlert, 
  Menu, 
  X, 
  WifiOff, 
  BookOpen, 
  Camera, 
  Settings,
  Sparkles,
  Sun,
  Moon
} from 'lucide-react';
import { usePreferences } from '../../services/preferencesContext';

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { preferences, setTheme, isDark } = usePreferences();

  const navLinks = [
    { to: '/', label: 'Home', icon: TreePine },
    { to: '/map', label: 'Park Map', icon: MapPin },
    { to: '/biodiversity', label: 'Biodiversity', icon: BookOpen },
    { to: '/attractions', label: 'Attractions', icon: Compass },
    { to: '/planner', label: 'Trip Planner', icon: Calendar },
    { to: '/offline', label: 'Offline Guide', icon: WifiOff },
    { to: '/conservation', label: 'Warli & Coexistence', icon: Sparkles },
    { to: '/sightings', label: 'Citizen Log', icon: Camera },
  ];

  const isActive = (path: string) => {
    if (path === '/' && location.pathname !== '/') return false;
    return location.pathname.startsWith(path);
  };

  return (
    <header className="sticky top-0 z-50 bg-[#070d0a]/95 backdrop-blur-md border-b border-[#1b3427] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600 to-green-950 p-0.5 flex items-center justify-center border border-emerald-500/40 shadow-lg group-hover:scale-105 transition-transform">
              <span className="text-xl">🌿</span>
            </div>
            <div>
              <div className="font-extrabold tracking-wider text-base md:text-lg flex items-center gap-1.5 font-['Cinzel'] text-emerald-400">
                WILD MUMBAI
              </div>
              <div className="text-[10px] text-neutral-400 tracking-wider uppercase font-semibold">
                Sanjay Gandhi National Park
              </div>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => {
              const active = isActive(link.to);
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                    active
                      ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-800/80 shadow-sm'
                      : 'text-neutral-300 hover:text-white hover:bg-[#12241b]'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Actions: Theme Toggle, Settings, High-Contrast SOS Button */}
          <div className="flex items-center gap-2.5">
            {/* Theme Toggle Button */}
            <button
              onClick={() => setTheme(isDark ? 'light' : 'dark')}
              title={`Switch to ${isDark ? 'Light' : 'Dark'} Mode`}
              className="p-2 rounded-xl bg-[#0f1f16] border border-[#204030] text-neutral-300 hover:text-white hover:bg-[#162e21] transition"
              aria-label="Toggle theme"
            >
              {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-emerald-400" />}
            </button>

            {/* Settings link */}
            <Link
              to="/settings"
              title="Settings & Accessibility"
              className="p-2 rounded-xl bg-[#0f1f16] border border-[#204030] text-neutral-300 hover:text-white hover:bg-[#162e21] transition hidden sm:flex"
              aria-label="Settings"
            >
              <Settings className="w-4 h-4" />
            </Link>

            {/* PROMINENT PERSISTENT SOS BUTTON */}
            <Link
              to="/sos"
              className="flex items-center gap-2 px-3.5 py-2 bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-500 hover:to-rose-600 text-white text-xs md:text-sm font-bold tracking-wider rounded-xl shadow-[0_0_15px_rgba(239,68,68,0.4)] border border-red-400/40 active:scale-95 transition-all"
            >
              <ShieldAlert className="w-4 h-4 animate-pulse text-amber-200" />
              <span>SOS EMERGENCY</span>
            </Link>

            {/* Mobile Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl bg-[#0f1f16] border border-[#204030] text-neutral-300 hover:text-white"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#09130e] border-b border-[#1b3427] px-4 pt-2 pb-6 space-y-1 animate-in slide-in-from-top duration-200">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const active = isActive(link.to);
            return (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition ${
                  active
                    ? 'bg-emerald-900/60 text-emerald-300 border border-emerald-700/60'
                    : 'text-neutral-300 hover:bg-[#13271c] hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4 text-emerald-400" />
                <span>{link.label}</span>
              </Link>
            );
          })}
          <div className="pt-2 border-t border-[#172c21]">
            <Link
              to="/settings"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-neutral-300 hover:bg-[#13271c] hover:text-white"
            >
              <Settings className="w-4 h-4 text-neutral-400" />
              <span>Settings, Battery & Offline Storage</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
