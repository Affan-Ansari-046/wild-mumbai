import React from 'react';
import { NavLink } from 'react-router-dom';
import { TreePine, MapPin, BookOpen, Calendar, ShieldAlert } from 'lucide-react';

export const MobileNav: React.FC = () => {
  return (
    <nav 
      aria-label="Mobile Bottom Navigation"
      className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#070d0a]/95 backdrop-blur-lg border-t border-[#1b3427] pb-safe px-2 py-2"
    >
      <div className="flex items-center justify-around">
        <NavLink
          to="/"
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl transition ${
              isActive ? 'text-emerald-400 font-semibold' : 'text-neutral-400 hover:text-neutral-200'
            }`
          }
        >
          <TreePine className="w-5 h-5" />
          <span className="text-[10px]">Home</span>
        </NavLink>

        <NavLink
          to="/map"
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl transition ${
              isActive ? 'text-emerald-400 font-semibold' : 'text-neutral-400 hover:text-neutral-200'
            }`
          }
        >
          <MapPin className="w-5 h-5" />
          <span className="text-[10px]">Map</span>
        </NavLink>

        <NavLink
          to="/sos"
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 py-1 px-3 rounded-2xl bg-red-600/90 text-white shadow-[0_0_12px_rgba(239,68,68,0.5)] border border-red-400/50 -translate-y-2.5 transition active:scale-95 ${
              isActive ? 'ring-2 ring-red-400' : ''
            }`
          }
        >
          <ShieldAlert className="w-5 h-5 text-amber-200 animate-pulse" />
          <span className="text-[10px] font-extrabold uppercase tracking-wider">SOS</span>
        </NavLink>

        <NavLink
          to="/biodiversity"
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl transition ${
              isActive ? 'text-emerald-400 font-semibold' : 'text-neutral-400 hover:text-neutral-200'
            }`
          }
        >
          <BookOpen className="w-5 h-5" />
          <span className="text-[10px]">Species</span>
        </NavLink>

        <NavLink
          to="/planner"
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl transition ${
              isActive ? 'text-emerald-400 font-semibold' : 'text-neutral-400 hover:text-neutral-200'
            }`
          }
        >
          <Calendar className="w-5 h-5" />
          <span className="text-[10px]">Plan</span>
        </NavLink>
      </div>
    </nav>
  );
};
