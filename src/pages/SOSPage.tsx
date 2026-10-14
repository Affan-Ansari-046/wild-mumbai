import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, 
  MapPin, 
  Phone, 
  Copy, 
  Share2, 
  MessageSquare, 
  AlertTriangle, 
  Check, 
  RefreshCw, 
  Compass, 
  HeartPulse, 
  Users, 
  HelpCircle, 
  UserPlus, 
  Trash2, 
  ExternalLink,
  Info
} from 'lucide-react';
import { 
  EMERGENCY_TYPES, 
  buildEmergencyMessage, 
  buildWhatsAppLink, 
  buildSmsLink, 
  getTrustedContacts, 
  saveTrustedContacts, 
  type EmergencyTypeOption 
} from '../features/emergency/emergencyUtils';
import { 
  getCurrentBrowserPosition, 
  formatCoordinates, 
  getGoogleMapsUrl, 
  getOpenStreetMapUrl, 
  type GPSPosition 
} from '../services/geolocationService';
import { EMERGENCY_CONTACTS_DATA } from '../data/emergencyContacts';
import { SAFETY_GUIDES_DATA } from '../data/safetyGuides';
import type { TrustedContact } from '../types';

export const SOSPage: React.FC = () => {
  const [selectedType, setSelectedType] = useState<EmergencyTypeOption>(EMERGENCY_TYPES[0]);
  const [additionalDetails, setAdditionalDetails] = useState<string>('');
  const [position, setPosition] = useState<GPSPosition | null>(null);
  const [isLocating, setIsLocating] = useState<boolean>(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [copiedMessage, setCopiedMessage] = useState<boolean>(false);
  const [copiedCoords, setCopiedCoords] = useState<boolean>(false);
  
  // Trusted Contacts Management
  const [trustedContacts, setTrustedContacts] = useState<TrustedContact[]>([]);
  const [newContactName, setNewContactName] = useState<string>('');
  const [newContactPhone, setNewContactPhone] = useState<string>('');
  const [newContactRelation, setNewContactRelation] = useState<string>('');
  const [showAddContact, setShowAddContact] = useState<boolean>(false);

  // Load contacts & attempt immediate GPS acquisition
  useEffect(() => {
    setTrustedContacts(getTrustedContacts());
    handleAcquireLocation();
  }, []);

  const handleAcquireLocation = async () => {
    setIsLocating(true);
    setLocationError(null);
    try {
      const pos = await getCurrentBrowserPosition();
      setPosition(pos);
    } catch (err: any) {
      setLocationError(err.message || 'Unable to retrieve GPS coordinates.');
    } finally {
      setIsLocating(false);
    }
  };

  const emergencyMessage = buildEmergencyMessage(selectedType, position, additionalDetails);

  const handleCopyMessage = async () => {
    try {
      await navigator.clipboard.writeText(emergencyMessage);
      setCopiedMessage(true);
      setTimeout(() => setCopiedMessage(false), 2500);
    } catch (e) {
      // fallback
    }
  };

  const handleCopyCoords = async () => {
    if (!position) return;
    const coordText = `${position.latitude.toFixed(6)}, ${position.longitude.toFixed(6)}`;
    try {
      await navigator.clipboard.writeText(coordText);
      setCopiedCoords(true);
      setTimeout(() => setCopiedCoords(false), 2500);
    } catch (e) {
      // fallback
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `SGNP EMERGENCY — ${selectedType.label}`,
          text: emergencyMessage
        });
      } catch (err) {
        // User cancelled or share failed
      }
    } else {
      handleCopyMessage();
    }
  };

  const handleAddContact = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newContactName.trim() || !newContactPhone.trim()) return;

    const newContact: TrustedContact = {
      id: 'contact_' + Date.now(),
      name: newContactName.trim(),
      phone: newContactPhone.trim(),
      relationship: newContactRelation.trim() || 'Family / Friend'
    };

    const updated = [...trustedContacts, newContact];
    setTrustedContacts(updated);
    saveTrustedContacts(updated);
    setNewContactName('');
    setNewContactPhone('');
    setNewContactRelation('');
    setShowAddContact(false);
  };

  const handleDeleteContact = (id: string) => {
    const updated = trustedContacts.filter(c => c.id !== id);
    setTrustedContacts(updated);
    saveTrustedContacts(updated);
  };

  return (
    <div className="min-h-screen bg-[#060a08] text-white py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* EMERGENCY BANNER HEADER */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-red-950 via-rose-950 to-red-900 border-2 border-red-600/80 p-6 md:p-8 shadow-[0_0_35px_rgba(239,68,68,0.25)]">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-red-600 text-white rounded-2xl shadow-lg shrink-0 animate-pulse">
                <ShieldAlert className="w-8 h-8" />
              </div>
              <div>
                <div className="inline-block px-2.5 py-0.5 rounded-full bg-red-800/80 text-amber-200 text-xs font-bold uppercase tracking-wider mb-1">
                  Urgent Assistance
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-['Cinzel']">
                  SGNP Visitor Safety & SOS Center
                </h1>
                <p className="text-xs sm:text-sm text-red-200 mt-1 max-w-xl">
                  Quickly generate formatted emergency distress messages with exact GPS coordinates for Sanjay Gandhi National Park, call verified forest rangers, and access offline survival protocols.
                </p>
              </div>
            </div>

            {/* Direct 1-Tap Calling to SGNP Control Room */}
            <a
              href="tel:+912228860360"
              className="flex items-center justify-center gap-2 px-6 py-3.5 bg-white hover:bg-neutral-100 text-red-700 font-extrabold rounded-2xl shadow-xl transition active:scale-95 shrink-0 text-sm"
            >
              <Phone className="w-5 h-5 text-red-600 fill-red-600" />
              <span>Call SGNP Control (+91 22 2886 0360)</span>
            </a>
          </div>
        </div>

        {/* 1. SELECT EMERGENCY CATEGORY */}
        <div className="bg-[#0b140f] rounded-2xl border border-[#1b3425] p-5 shadow-lg">
          <h2 className="text-sm font-bold uppercase tracking-wider text-emerald-400 mb-3 flex items-center gap-2">
            <span>1. Select Emergency Type</span>
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {EMERGENCY_TYPES.map((type) => {
              const isSelected = selectedType.key === type.key;
              return (
                <button
                  key={type.key}
                  type="button"
                  onClick={() => setSelectedType(type)}
                  className={`p-3.5 rounded-xl border text-left transition flex flex-col justify-between ${
                    isSelected
                      ? 'bg-red-950/80 border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.3)] text-white'
                      : 'bg-[#0f1d16] border-[#1e392a] text-neutral-300 hover:bg-[#152a20] hover:text-white'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold">{type.label}</span>
                    {isSelected && <span className="w-2 h-2 rounded-full bg-red-400 animate-ping"></span>}
                  </div>
                  <div className="text-[11px] text-neutral-400 font-serif">{type.marathiLabel}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. REAL GPS COORDINATES & GEOLOCATION STATUS */}
        <div className="bg-[#0b140f] rounded-2xl border border-[#1b3425] p-5 shadow-lg">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-emerald-400" />
              <span>2. Current GPS Position in SGNP</span>
            </h2>
            <button
              onClick={handleAcquireLocation}
              disabled={isLocating}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#14281e] hover:bg-[#1a3427] text-neutral-200 text-xs font-medium rounded-lg border border-[#274836] transition"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLocating ? 'animate-spin' : ''}`} />
              <span>{isLocating ? 'Locating...' : 'Refresh GPS'}</span>
            </button>
          </div>

          {position ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-xl bg-[#060e09] border border-[#173022]">
                <div>
                  <div className="text-[11px] text-neutral-400 uppercase font-semibold">Latitude & Longitude</div>
                  <div className="text-base font-bold text-white tracking-wide mt-0.5">
                    {position.latitude.toFixed(6)}, {position.longitude.toFixed(6)}
                  </div>
                  <div className="text-xs text-emerald-400">
                    {formatCoordinates(position.latitude, position.longitude)}
                  </div>
                </div>

                <div>
                  <div className="text-[11px] text-neutral-400 uppercase font-semibold">Accuracy Radius</div>
                  <div className="text-base font-bold text-emerald-300 mt-0.5">
                    ±{position.accuracy} meters
                  </div>
                  <div className="text-xs text-neutral-400">
                    {position.accuracy <= 25 ? 'High GPS precision' : 'Approximate fix'}
                  </div>
                </div>

                <div>
                  <div className="text-[11px] text-neutral-400 uppercase font-semibold">Recorded At</div>
                  <div className="text-xs font-medium text-neutral-200 mt-1">
                    {new Date(position.timestamp).toLocaleTimeString('en-IN')} IST
                  </div>
                  <div className="text-[11px] text-neutral-400">
                    {new Date(position.timestamp).toLocaleDateString('en-IN')}
                  </div>
                </div>
              </div>

              {/* External Mapping Links & Copy Coords */}
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={handleCopyCoords}
                  className="flex items-center gap-1.5 px-3 py-2 bg-[#14281e] hover:bg-[#1b3628] text-xs font-semibold rounded-xl border border-[#274836] transition text-neutral-200"
                >
                  {copiedCoords ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedCoords ? 'Coordinates Copied!' : 'Copy Coordinates'}</span>
                </button>

                <a
                  href={getGoogleMapsUrl(position.latitude, position.longitude)}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 px-3 py-2 bg-[#14281e] hover:bg-[#1b3628] text-xs font-semibold rounded-xl border border-[#274836] transition text-neutral-200"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Open in Google Maps</span>
                </a>

                <a
                  href={getOpenStreetMapUrl(position.latitude, position.longitude)}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 px-3 py-2 bg-[#14281e] hover:bg-[#1b3628] text-xs font-semibold rounded-xl border border-[#274836] transition text-neutral-200"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Open in OpenStreetMap</span>
                </a>
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-xl bg-amber-950/40 border border-amber-800/60 text-amber-200 text-xs flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                <span>
                  {locationError || 'Click "Refresh GPS" to acquire your satellite coordinates. Please grant location permissions when prompted.'}
                </span>
              </div>
              <button
                onClick={handleAcquireLocation}
                className="px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-black font-bold rounded-lg ml-2 shrink-0"
              >
                Allow GPS
              </button>
            </div>
          )}
        </div>

        {/* 3. ADDITIONAL DETAILS & PREFORMATTED MESSAGE PREVIEW */}
        <div className="bg-[#0b140f] rounded-2xl border border-[#1b3425] p-5 shadow-lg space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-emerald-400">
            3. Additional Details & Message Preview
          </h2>

          <div>
            <label className="block text-xs font-medium text-neutral-300 mb-1">
              Optional description (e.g., "Near Cave 41", "Bitten on left ankle", "2 adults, 1 child"):
            </label>
            <input
              type="text"
              value={additionalDetails}
              onChange={(e) => setAdditionalDetails(e.target.value)}
              placeholder="e.g. Near Kanheri stream, battery at 15%"
              className="w-full px-3.5 py-2.5 bg-[#070e09] border border-[#1f3b2a] rounded-xl text-neutral-100 placeholder-neutral-500 text-xs focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs text-neutral-400 font-semibold">Generated Message:</span>
              <button
                onClick={handleCopyMessage}
                className="text-xs text-emerald-400 hover:text-emerald-300 font-medium flex items-center gap-1"
              >
                {copiedMessage ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedMessage ? 'Copied' : 'Copy Full Message'}</span>
              </button>
            </div>
            <div className="p-4 rounded-xl bg-[#060c08] border border-[#183122] text-xs sm:text-sm text-neutral-200 font-mono leading-relaxed select-all">
              {emergencyMessage}
            </div>
          </div>

          {/* SEND ACTIONS: SHARE / WHATSAPP / SMS */}
          <div className="flex flex-wrap gap-3 pt-2">
            <button
              onClick={handleNativeShare}
              className="flex-1 min-w-[150px] flex items-center justify-center gap-2 py-3 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow-lg transition active:scale-95 text-xs sm:text-sm"
            >
              <Share2 className="w-4 h-4" />
              <span>Share via App / Sheet</span>
            </button>

            <a
              href={buildWhatsAppLink(emergencyMessage)}
              target="_blank"
              rel="noreferrer"
              className="flex-1 min-w-[150px] flex items-center justify-center gap-2 py-3 px-4 bg-green-600 hover:bg-green-500 text-white font-bold rounded-xl shadow-lg transition active:scale-95 text-xs sm:text-sm"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Send via WhatsApp</span>
            </a>

            <a
              href={buildSmsLink(emergencyMessage)}
              className="flex-1 min-w-[150px] flex items-center justify-center gap-2 py-3 px-4 bg-neutral-800 hover:bg-neutral-700 text-white font-bold rounded-xl shadow-lg transition active:scale-95 text-xs sm:text-sm border border-neutral-700"
            >
              <Phone className="w-4 h-4" />
              <span>Send via SMS</span>
            </a>
          </div>

          {/* Honest Capability Disclaimer */}
          <div className="p-3.5 rounded-xl bg-[#07100a] border border-[#183021] text-[11px] text-neutral-400 flex items-start gap-2.5">
            <Info className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <strong>Transmission Guarantee:</strong> Clicking WhatsApp, SMS, or Share opens your device's native messaging applications with the exact text and coordinates filled in. Because this is a frontend web application, it does not silently dispatch park staff without you pressing "Send" or making a telephone call.
            </div>
          </div>
        </div>

        {/* 4. VERIFIED OFFICIAL EMERGENCY CONTACTS */}
        <div className="bg-[#0b140f] rounded-2xl border border-[#1b3425] p-5 shadow-lg">
          <h2 className="text-sm font-bold uppercase tracking-wider text-emerald-400 mb-4">
            4. Verified Official SGNP Emergency Contacts
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {EMERGENCY_CONTACTS_DATA.map((contact) => (
              <div
                key={contact.id}
                className="p-4 rounded-xl bg-[#070e0a] border border-[#1a3324] flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-white">{contact.name}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                      Verified
                    </span>
                  </div>
                  <div className="text-[11px] text-emerald-400 font-medium mb-1.5">{contact.role}</div>
                  <p className="text-[11px] text-neutral-400 leading-snug mb-3">
                    {contact.description}
                  </p>
                </div>

                <div className="flex items-center gap-2 pt-2 border-t border-[#14281c]">
                  <a
                    href={`tel:${contact.phone}`}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 bg-red-950/80 hover:bg-red-900 border border-red-700/60 text-red-200 text-xs font-bold rounded-lg transition"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Call: {contact.phone}</span>
                  </a>
                  {contact.altPhone && (
                    <a
                      href={`tel:${contact.altPhone}`}
                      className="flex items-center justify-center py-2 px-3 bg-[#112318] hover:bg-[#183222] border border-[#21422f] text-neutral-300 text-xs rounded-lg transition"
                      title="Alternate line"
                    >
                      <span>Alt</span>
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 5. TRUSTED PERSONAL CONTACTS */}
        <div className="bg-[#0b140f] rounded-2xl border border-[#1b3425] p-5 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-bold uppercase tracking-wider text-emerald-400">
                5. Trusted Personal Emergency Contacts
              </h2>
              <p className="text-xs text-neutral-400 mt-0.5">
                Saved privately on your device in localStorage to quickly forward your location in one tap.
              </p>
            </div>
            <button
              onClick={() => setShowAddContact(!showAddContact)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-semibold rounded-lg shadow transition"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>{showAddContact ? 'Cancel' : 'Add Contact'}</span>
            </button>
          </div>

          {/* Add Contact Form */}
          {showAddContact && (
            <form onSubmit={handleAddContact} className="p-4 rounded-xl bg-[#070e0a] border border-[#203f2c] mb-4 space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] text-neutral-400 mb-1">Contact Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rahul Sharma"
                    value={newContactName}
                    onChange={(e) => setNewContactName(e.target.value)}
                    className="w-full px-3 py-2 bg-[#0d1c14] border border-[#234531] rounded-lg text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-neutral-400 mb-1">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. +91 98765 43210"
                    value={newContactPhone}
                    onChange={(e) => setNewContactPhone(e.target.value)}
                    className="w-full px-3 py-2 bg-[#0d1c14] border border-[#234531] rounded-lg text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-neutral-400 mb-1">Relationship</label>
                  <input
                    type="text"
                    placeholder="e.g. Spouse / Trek Buddy"
                    value={newContactRelation}
                    onChange={(e) => setNewContactRelation(e.target.value)}
                    className="w-full px-3 py-2 bg-[#0d1c14] border border-[#234531] rounded-lg text-xs text-white"
                  />
                </div>
              </div>
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg"
                >
                  Save to Device
                </button>
              </div>
            </form>
          )}

          {/* Contacts List */}
          {trustedContacts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {trustedContacts.map((contact) => (
                <div
                  key={contact.id}
                  className="p-3.5 rounded-xl bg-[#070e0a] border border-[#183122] flex items-center justify-between"
                >
                  <div>
                    <div className="text-xs font-bold text-white">{contact.name}</div>
                    <div className="text-[11px] text-neutral-400">{contact.relationship} • {contact.phone}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <a
                      href={buildWhatsAppLink(emergencyMessage, contact.phone)}
                      target="_blank"
                      rel="noreferrer"
                      className="px-2.5 py-1.5 bg-green-700/80 hover:bg-green-600 text-white text-[11px] font-semibold rounded-lg transition"
                    >
                      WhatsApp
                    </a>
                    <a
                      href={`tel:${contact.phone}`}
                      className="p-1.5 bg-[#14281e] hover:bg-[#1b3628] text-white rounded-lg transition"
                      title="Call Contact"
                    >
                      <Phone className="w-3.5 h-3.5" />
                    </a>
                    <button
                      onClick={() => handleDeleteContact(contact.id)}
                      className="p-1.5 text-neutral-500 hover:text-red-400 transition"
                      title="Remove Contact"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-neutral-400 italic">
              No trusted contacts added yet. Add family members or friends above so you can notify them with your GPS coordinates in a single click.
            </p>
          )}
        </div>

        {/* 6. OFFLINE EMERGENCY SAFETY GUIDES */}
        <div className="bg-[#0b140f] rounded-2xl border border-[#1b3425] p-5 shadow-lg space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-emerald-400">
            6. Critical Offline Survival Protocols (No Internet Required)
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {SAFETY_GUIDES_DATA.slice(0, 3).map((guide) => (
              <div
                key={guide.id}
                className="p-4 rounded-xl bg-[#070e0a] border border-[#183122] flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-2 text-xs font-bold text-amber-300 mb-1">
                    <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>{guide.title}</span>
                  </div>
                  <p className="text-[11px] text-neutral-300 leading-snug mb-3">
                    {guide.summary}
                  </p>
                  <div className="text-[11px] text-neutral-400 space-y-1">
                    <div className="font-semibold text-emerald-400">Immediate Action:</div>
                    <ul className="list-disc list-inside space-y-1 text-[11px]">
                      {guide.actionSteps.slice(0, 3).map((step, idx) => (
                        <li key={idx} className="line-clamp-2">{step}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="mt-3 pt-2 border-t border-[#14281c] text-[10px] text-rose-300 font-medium">
                  Crucial: {guide.doNotSteps[0]}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
