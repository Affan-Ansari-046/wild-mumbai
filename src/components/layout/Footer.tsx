import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, MapPin, Phone, Info, Leaf, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#050907] border-t border-[#152a1e] text-neutral-400 text-xs py-12 px-4 sm:px-6 lg:px-8 mb-16 lg:mb-0">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
        
        {/* Col 1: Brand & Identity */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-2xl">🌿</span>
            <span className="font-extrabold text-white text-base tracking-wider font-['Cinzel']">
              WILD MUMBAI
            </span>
          </div>
          <p className="text-neutral-400 leading-relaxed mb-4">
            An independent, high-fidelity conservation and visitor safety platform dedicated to Sanjay Gandhi National Park — Mumbai’s 104 km² ancient urban rainforest.
          </p>
          <div className="flex items-center gap-2 text-emerald-400 font-medium">
            <Leaf className="w-4 h-4" />
            <span>Zero Plastic Sanctuary • Protect Waghoba</span>
          </div>
        </div>

        {/* Col 2: Quick Links */}
        <div>
          <h4 className="text-white font-semibold uppercase tracking-wider text-xs mb-3">
            Explorer Architecture
          </h4>
          <ul className="space-y-2">
            <li><Link to="/map" className="hover:text-emerald-400 transition">Interactive Park Map (Leaflet)</Link></li>
            <li><Link to="/biodiversity" className="hover:text-emerald-400 transition">Biodiversity & Species Directory</Link></li>
            <li><Link to="/attractions" className="hover:text-emerald-400 transition">Kanheri Caves & Mapped POIs</Link></li>
            <li><Link to="/planner" className="hover:text-emerald-400 transition">Itinerary & Packing Planner</Link></li>
            <li><Link to="/offline" className="hover:text-emerald-400 transition">Offline Explorer & Tile Cache</Link></li>
            <li><Link to="/conservation" className="hover:text-emerald-400 transition">Warli Indigenous Coexistence</Link></li>
            <li><Link to="/sightings" className="hover:text-emerald-400 transition">Citizen Observation Log</Link></li>
          </ul>
        </div>

        {/* Col 3: Official Park Contacts */}
        <div>
          <h4 className="text-white font-semibold uppercase tracking-wider text-xs mb-3">
            Official SGNP Information
          </h4>
          <div className="space-y-2.5">
            <div className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>Sanjay Gandhi National Park, Borivali East, Mumbai 400066</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Control Room: <a href="tel:+912228860360" className="text-neutral-200 hover:underline">+91 22 2886 0360</a></span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Forest Helpline: <a href="tel:1926" className="text-neutral-200 hover:underline">1926 (Toll-Free)</a></span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Emergency Services: <a href="tel:112" className="text-neutral-200 hover:underline">112</a> / Medical: <a href="tel:108" className="text-neutral-200 hover:underline">108</a></span>
            </div>
          </div>
        </div>

        {/* Col 4: Safety & Dispatch Disclaimer */}
        <div>
          <h4 className="text-white font-semibold uppercase tracking-wider text-xs mb-3 flex items-center gap-1.5">
            <Info className="w-4 h-4 text-amber-400" />
            Safety & Dispatch Notice
          </h4>
          <div className="bg-[#0b1610] p-3 rounded-xl border border-[#1b3424] text-[11px] leading-relaxed text-neutral-300">
            <p className="mb-2">
              <strong>Frontend Capability Notice:</strong> This web application prepares preformatted emergency SMS, WhatsApp messages, and coordinates via browser GPS.
            </p>
            <p className="text-amber-300/90">
              It cannot silently dispatch forest rangers or emergency workers without an active cellular or data connection initiated by the user.
            </p>
          </div>
        </div>

      </div>

      {/* Bottom Bar: Copyright & Attribution */}
      <div className="max-w-7xl mx-auto pt-6 border-t border-[#14261b] flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px]">
        <div>
          Map data © <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer" className="underline hover:text-white">OpenStreetMap</a> contributors. Wildlife records verified via Maharashtra Forest Dept & eBird.
        </div>
        <div className="flex items-center gap-4">
          <Link to="/safety" className="hover:text-white transition">Visitor Rules</Link>
          <Link to="/sources" className="hover:text-white transition">Sources & Data Freshness</Link>
          <Link to="/settings" className="hover:text-white transition">Privacy & Settings</Link>
        </div>
      </div>
    </footer>
  );
};
