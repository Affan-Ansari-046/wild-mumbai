import React, { useState, useEffect } from 'react';
import { usePreferences } from '../services/preferencesContext';
import { 
  Settings, 
  Sun, 
  Moon, 
  Zap, 
  Eye, 
  Compass, 
  Database, 
  Trash2, 
  Check, 
  ShieldCheck,
  UserPlus
} from 'lucide-react';
import { getOfflinePackStatus, clearOfflineData } from '../services/offlineStorage';
import { getTrustedContacts, saveTrustedContacts } from '../features/emergency/emergencyUtils';
import type { TrustedContact } from '../types';

export const SettingsPage: React.FC = () => {
  const { preferences, setTheme, setReducedMotion, setLowPowerMode, setDistanceUnit, isDark } = usePreferences();
  
  const [storageBytes, setStorageBytes] = useState<number>(0);
  const [isCached, setIsCached] = useState<boolean>(false);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);

  // Trusted Contacts
  const [trustedContacts, setTrustedContacts] = useState<TrustedContact[]>([]);
  const [showAddContact, setShowAddContact] = useState<boolean>(false);
  const [newName, setNewName] = useState<string>('');
  const [newPhone, setNewPhone] = useState<string>('');
  const [newRelation, setNewRelation] = useState<string>('');

  useEffect(() => {
    checkStorage();
    setTrustedContacts(getTrustedContacts());
  }, []);

  const checkStorage = async () => {
    const status = await getOfflinePackStatus();
    setIsCached(status.isCached);
    setStorageBytes(status.sizeBytes);
  };

  const handleClearCache = async () => {
    if (confirm('Clear offline cached data from this browser?')) {
      await clearOfflineData();
      await checkStorage();
      setStatusMsg('Offline cache cleared.');
      setTimeout(() => setStatusMsg(null), 3000);
    }
  };

  const handleAddContact = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newPhone.trim()) return;

    const contact: TrustedContact = {
      id: 'contact_' + Date.now(),
      name: newName.trim(),
      phone: newPhone.trim(),
      relationship: newRelation.trim() || 'Emergency Contact'
    };

    const updated = [...trustedContacts, contact];
    setTrustedContacts(updated);
    saveTrustedContacts(updated);
    setNewName('');
    setNewPhone('');
    setNewRelation('');
    setShowAddContact(false);
  };

  const handleDeleteContact = (id: string) => {
    const updated = trustedContacts.filter(c => c.id !== id);
    setTrustedContacts(updated);
    saveTrustedContacts(updated);
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 KB';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="min-h-screen bg-[#070c09] text-white py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="border-b border-[#1b3425] pb-6">
          <div className="flex items-center gap-2 text-xs uppercase tracking-wider font-semibold text-emerald-400 mb-2">
            <Settings className="w-4 h-4" />
            <span>Preferences & Device Controls</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold font-['Cinzel'] text-white">
            Settings & Accessibility
          </h1>
          <p className="text-xs sm:text-sm text-neutral-300 max-w-2xl mt-1">
            Customize visual themes, enable low-power battery conservation for field treks, and manage offline data.
          </p>
        </div>

        {/* 1. APPEARANCE & THEME */}
        <div className="p-6 rounded-3xl bg-[#0b1610] border border-[#1b3425] shadow-xl space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-emerald-400">
            1. Theme & Appearance
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { id: 'dark', label: 'Dark Forest (Default)', icon: Moon },
              { id: 'light', label: 'Light Forest', icon: Sun },
              { id: 'system', label: 'System Default', icon: Eye },
            ].map((th) => {
              const active = preferences.theme === th.id;
              const Icon = th.icon;
              return (
                <button
                  key={th.id}
                  onClick={() => setTheme(th.id as any)}
                  className={`p-4 rounded-xl border flex items-center justify-between transition ${
                    active
                      ? 'bg-emerald-950 text-emerald-300 border-emerald-500 shadow-md ring-1 ring-emerald-500/40'
                      : 'bg-[#070e0a] text-neutral-300 border-[#1b3425] hover:bg-[#12241b]'
                  }`}
                >
                  <div className="flex items-center gap-2.5 text-xs font-semibold">
                    <Icon className="w-4 h-4 text-emerald-400" />
                    <span>{th.label}</span>
                  </div>
                  {active && <Check className="w-4 h-4 text-emerald-400" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. FIELD POWER & ACCESSIBILITY */}
        <div className="p-6 rounded-3xl bg-[#0b1610] border border-[#1b3425] shadow-xl space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-emerald-400">
            2. Field Power & Accessibility
          </h2>
          
          <div className="space-y-3">
            {/* Battery Saver */}
            <div className="p-4 rounded-xl bg-[#070e0a] border border-[#173022] flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 text-xs font-bold text-white">
                  <Zap className="w-4 h-4 text-amber-400" />
                  <span>Low-Power Battery-Saver Mode</span>
                </div>
                <div className="text-[11px] text-neutral-400 mt-0.5">
                  Reduces background effects and animations to conserve smartphone battery on long forest walks.
                </div>
              </div>
              <input
                type="checkbox"
                checked={preferences.lowPowerMode}
                onChange={(e) => setLowPowerMode(e.target.checked)}
                className="w-5 h-5 rounded border-[#244633] text-emerald-500 focus:ring-0 cursor-pointer"
              />
            </div>

            {/* Reduced Motion */}
            <div className="p-4 rounded-xl bg-[#070e0a] border border-[#173022] flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 text-xs font-bold text-white">
                  <Eye className="w-4 h-4 text-emerald-400" />
                  <span>Reduced Motion</span>
                </div>
                <div className="text-[11px] text-neutral-400 mt-0.5">
                  Disables parallax shifts, mist drift animations, and zoom transitions.
                </div>
              </div>
              <input
                type="checkbox"
                checked={preferences.reducedMotion}
                onChange={(e) => setReducedMotion(e.target.checked)}
                className="w-5 h-5 rounded border-[#244633] text-emerald-500 focus:ring-0 cursor-pointer"
              />
            </div>

            {/* Units */}
            <div className="p-4 rounded-xl bg-[#070e0a] border border-[#173022] flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 text-xs font-bold text-white">
                  <Compass className="w-4 h-4 text-emerald-400" />
                  <span>Distance Measurement Units</span>
                </div>
                <div className="text-[11px] text-neutral-400 mt-0.5">
                  Display trail and attraction distances in kilometers or miles.
                </div>
              </div>
              <div className="flex bg-[#12241b] p-1 rounded-xl border border-[#244633]">
                <button
                  onClick={() => setDistanceUnit('km')}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold ${
                    preferences.distanceUnit === 'km' ? 'bg-emerald-600 text-white' : 'text-neutral-400'
                  }`}
                >
                  Kilometers (km)
                </button>
                <button
                  onClick={() => setDistanceUnit('mi')}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold ${
                    preferences.distanceUnit === 'mi' ? 'bg-emerald-600 text-white' : 'text-neutral-400'
                  }`}
                >
                  Miles (mi)
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 3. TRUSTED EMERGENCY CONTACTS */}
        <div className="p-6 rounded-3xl bg-[#0b1610] border border-[#1b3425] shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold uppercase tracking-wider text-emerald-400">
              3. Manage Trusted SOS Contacts ({trustedContacts.length})
            </h2>
            <button
              onClick={() => setShowAddContact(!showAddContact)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-semibold rounded-lg shadow transition"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>{showAddContact ? 'Cancel' : 'Add Contact'}</span>
            </button>
          </div>

          {showAddContact && (
            <form onSubmit={handleAddContact} className="p-4 rounded-xl bg-[#070e0a] border border-[#203f2c] space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <input
                  type="text"
                  required
                  placeholder="Full Name"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="px-3 py-2 bg-[#0d1c14] border border-[#234531] rounded-lg text-xs text-white"
                />
                <input
                  type="tel"
                  required
                  placeholder="Phone (with country code)"
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value)}
                  className="px-3 py-2 bg-[#0d1c14] border border-[#234531] rounded-lg text-xs text-white"
                />
                <input
                  type="text"
                  placeholder="Relationship (e.g. Spouse)"
                  value={newRelation}
                  onChange={(e) => setNewRelation(e.target.value)}
                  className="px-3 py-2 bg-[#0d1c14] border border-[#234531] rounded-lg text-xs text-white"
                />
              </div>
              <div className="flex justify-end">
                <button type="submit" className="px-4 py-1.5 bg-emerald-600 text-white rounded-lg text-xs font-bold">
                  Save Contact
                </button>
              </div>
            </form>
          )}

          {trustedContacts.length > 0 ? (
            <div className="space-y-2">
              {trustedContacts.map(c => (
                <div key={c.id} className="p-3 rounded-xl bg-[#070e0a] border border-[#173022] flex items-center justify-between text-xs">
                  <div>
                    <span className="font-semibold text-white">{c.name}</span>
                    <span className="text-neutral-400 ml-2">({c.relationship}) • {c.phone}</span>
                  </div>
                  <button onClick={() => handleDeleteContact(c.id)} className="text-neutral-500 hover:text-red-400">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-neutral-400 italic">No personal SOS contacts saved yet.</p>
          )}
        </div>

        {/* 4. OFFLINE STORAGE & DATA RESET */}
        <div className="p-6 rounded-3xl bg-[#0b1610] border border-[#1b3425] shadow-xl space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-emerald-400">
            4. Local Storage & Privacy
          </h2>
          <div className="p-4 rounded-xl bg-[#070e0a] border border-[#173022] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="text-xs font-bold text-white flex items-center gap-2">
                <Database className="w-4 h-4 text-emerald-400" />
                <span>IndexedDB Storage Used: {formatBytes(storageBytes)}</span>
              </div>
              <div className="text-[11px] text-neutral-400 mt-1">
                Stores your saved species, custom trip plans, personal sightings, and offline vector map coordinates.
              </div>
            </div>

            {isCached && (
              <button
                onClick={handleClearCache}
                className="px-4 py-2 bg-red-950/60 hover:bg-red-900 border border-red-700/60 text-red-200 rounded-xl text-xs font-semibold transition shrink-0"
              >
                Clear Cached Data
              </button>
            )}
          </div>
          {statusMsg && (
            <div className="text-xs text-emerald-400">{statusMsg}</div>
          )}
        </div>

      </div>
    </div>
  );
};
