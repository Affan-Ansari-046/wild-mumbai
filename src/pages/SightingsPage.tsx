import React, { useState, useEffect } from 'react';
import { 
  Camera, 
  Plus, 
  Calendar, 
  Clock, 
  MapPin, 
  Trash2, 
  ShieldAlert, 
  CheckCircle2, 
  X,
  Upload,
  Info
} from 'lucide-react';
import { SPECIES_DATA } from '../data/species';
import type { WildlifeSighting } from '../types';
import { saveSightingToDB, getAllSightings, deleteSightingFromDB } from '../services/offlineStorage';

export const SightingsPage: React.FC = () => {
  const [sightings, setSightings] = useState<WildlifeSighting[]>([]);
  const [showAddForm, setShowAddForm] = useState<boolean>(false);

  // Form states
  const [speciesName, setSpeciesName] = useState<string>('');
  const [speciesId, setSpeciesId] = useState<string>('');
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState<string>('08:30');
  const [locationName, setLocationName] = useState<string>('Shilonda Nature Trail');
  const [count, setCount] = useState<number>(1);
  const [notes, setNotes] = useState<string>('');
  const [photoDataUrl, setPhotoDataUrl] = useState<string | undefined>(undefined);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  useEffect(() => {
    loadSightings();
  }, []);

  const loadSightings = async () => {
    const data = await getAllSightings();
    setSightings(data);
  };

  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoDataUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!speciesName.trim()) return;

    setIsSubmitting(true);
    const newSighting: WildlifeSighting = {
      id: 'sighting_' + Date.now(),
      speciesName: speciesName.trim(),
      speciesId: speciesId || undefined,
      date,
      time,
      locationName: locationName.trim() || 'General SGNP',
      count: Number(count) || 1,
      notes: notes.trim(),
      photoDataUrl,
      createdAt: new Date().toISOString()
    };

    await saveSightingToDB(newSighting);
    await loadSightings();
    setIsSubmitting(false);

    // Reset Form
    setSpeciesName('');
    setSpeciesId('');
    setNotes('');
    setPhotoDataUrl(undefined);
    setShowAddForm(false);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Delete this sighting record from your device?')) {
      await deleteSightingFromDB(id);
      await loadSightings();
    }
  };

  return (
    <div className="min-h-screen bg-[#070c09] text-white py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#1b3425] pb-6">
          <div>
            <div className="flex items-center gap-2 text-xs uppercase tracking-wider font-semibold text-emerald-400 mb-2">
              <Camera className="w-4 h-4" />
              <span>Citizen Science Field Log</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold font-['Cinzel'] text-white">
              Wildlife Observation Journal
            </h1>
            <p className="text-xs sm:text-sm text-neutral-300 max-w-2xl mt-1">
              Record personal bird, mammal, and botanical sightings inside SGNP. Stored privately on your device.
            </p>
          </div>

          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-bold rounded-xl shadow-lg transition text-xs sm:text-sm"
          >
            {showAddForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            <span>{showAddForm ? 'Close Entry Form' : 'Log New Sighting'}</span>
          </button>
        </div>

        {/* Ethical Coordinates Disclosure */}
        <div className="p-4 rounded-2xl bg-[#09150e] border border-[#1c3826] flex items-start gap-3 text-xs text-neutral-300">
          <Info className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
          <div>
            <strong>Wildlife Protection & Data Privacy:</strong> To safeguard vulnerable species (such as leopards, pythons, and nesting raptors) against poaching or overcrowding, personal observation records are stored strictly in your browser's private IndexedDB storage.
          </div>
        </div>

        {/* Add Observation Form Modal / Drawer */}
        {showAddForm && (
          <form
            onSubmit={handleSubmit}
            className="p-6 rounded-3xl bg-[#0b1610] border border-[#234533] shadow-2xl space-y-5 animate-in fade-in duration-200"
          >
            <h2 className="text-sm font-bold uppercase tracking-wider text-emerald-400">
              New Wildlife Observation Record
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Species Auto-select or Type */}
              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1.5">
                  Select Verified Species or Type Name *
                </label>
                <select
                  value={speciesId}
                  onChange={(e) => {
                    const found = SPECIES_DATA.find(s => s.id === e.target.value);
                    setSpeciesId(e.target.value);
                    if (found) setSpeciesName(found.commonName);
                  }}
                  className="w-full px-3.5 py-2 bg-[#070e0a] border border-[#1f3b2a] rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500 mb-2"
                >
                  <option value="">-- Choose from SGNP Catalog --</option>
                  {SPECIES_DATA.map(sp => (
                    <option key={sp.id} value={sp.id}>{sp.commonName} ({sp.group})</option>
                  ))}
                </select>
                <input
                  type="text"
                  required
                  placeholder="Or enter custom species name (e.g. White-throated Kingfisher)"
                  value={speciesName}
                  onChange={(e) => setSpeciesName(e.target.value)}
                  className="w-full px-3.5 py-2 bg-[#070e0a] border border-[#1f3b2a] rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              {/* Location */}
              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1.5">
                  Observation Location / Trail *
                </label>
                <select
                  value={locationName}
                  onChange={(e) => setLocationName(e.target.value)}
                  className="w-full px-3.5 py-2 bg-[#070e0a] border border-[#1f3b2a] rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="Shilonda Nature Trail">Shilonda Nature Trail</option>
                  <option value="Kanheri Caves Outskirts">Kanheri Caves Outskirts</option>
                  <option value="Dahisar River Bank">Dahisar River Bank</option>
                  <option value="Jambhulmal Ridge Trail">Jambhulmal Ridge Trail</option>
                  <option value="Krishnagiri Upavan / Entrance">Krishnagiri Upavan / Entrance</option>
                  <option value="Yeoor Hills Trailhead">Yeoor Hills Trailhead</option>
                  <option value="Tulsi Lake Catchment Verge">Tulsi Lake Catchment Verge</option>
                </select>
              </div>

              {/* Date & Time */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">Date</label>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-3 py-2 bg-[#070e0a] border border-[#1f3b2a] rounded-xl text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">Time</label>
                  <input
                    type="time"
                    required
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full px-3 py-2 bg-[#070e0a] border border-[#1f3b2a] rounded-xl text-xs text-white"
                  />
                </div>
              </div>

              {/* Individuals Count */}
              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1">Estimated Count</label>
                <input
                  type="number"
                  min="1"
                  value={count}
                  onChange={(e) => setCount(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-[#070e0a] border border-[#1f3b2a] rounded-xl text-xs text-white"
                />
              </div>

              {/* Photo Upload */}
              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-neutral-300 mb-1">
                  Optional Photo Attachment (Stored locally in IndexedDB)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoSelect}
                  className="w-full text-xs text-neutral-400 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-emerald-950 file:text-emerald-300 hover:file:bg-emerald-900"
                />
                {photoDataUrl && (
                  <div className="mt-2 w-24 h-24 rounded-xl overflow-hidden border border-emerald-500">
                    <img src={photoDataUrl} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>

              {/* Notes */}
              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-neutral-300 mb-1">
                  Behavioral Notes / Context
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Perched on dead teak branch, giving whistling territorial call..."
                  className="w-full px-3 py-2 bg-[#070e0a] border border-[#1f3b2a] rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-4 py-2 bg-[#12241b] text-neutral-300 rounded-xl text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-lg"
              >
                {isSubmitting ? 'Saving...' : 'Record Sighting'}
              </button>
            </div>
          </form>
        )}

        {/* Observations List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold uppercase tracking-wider text-emerald-400">
              Personal Observations ({sightings.length})
            </h2>
          </div>

          {sightings.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {sightings.map((sighting) => (
                <div
                  key={sighting.id}
                  className="p-5 rounded-2xl bg-[#0b1610] border border-[#1b3425] flex flex-col justify-between shadow-lg"
                >
                  <div className="flex items-start gap-4 mb-3">
                    {sighting.photoDataUrl ? (
                      <img
                        src={sighting.photoDataUrl}
                        alt={sighting.speciesName}
                        className="w-16 h-16 rounded-xl object-cover shrink-0 border border-[#20422f]"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-xl bg-[#070e0a] border border-[#1e3929] flex items-center justify-center text-xl shrink-0">
                        🐾
                      </div>
                    )}
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="text-base font-bold text-white">
                          {sighting.speciesName}
                        </h3>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 font-semibold border border-emerald-800">
                          Count: {sighting.count}
                        </span>
                      </div>
                      <div className="text-xs text-neutral-400 mt-0.5 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-emerald-400" />
                        <span>{sighting.locationName}</span>
                      </div>
                    </div>
                  </div>

                  {sighting.notes && (
                    <p className="text-xs text-neutral-300 italic bg-[#060c08] p-3 rounded-xl border border-[#173022] mb-3">
                      "{sighting.notes}"
                    </p>
                  )}

                  <div className="flex items-center justify-between pt-2 border-t border-[#162c1f] text-[11px] text-neutral-400">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{sighting.date} at {sighting.time}</span>
                    </span>
                    <button
                      onClick={() => handleDelete(sighting.id)}
                      className="p-1 text-neutral-500 hover:text-red-400 transition"
                      title="Delete record"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-12 text-center rounded-2xl bg-[#0b1610] border border-[#1b3425] text-neutral-400">
              <Camera className="w-10 h-10 text-emerald-500/40 mx-auto mb-3" />
              <h3 className="text-base font-semibold text-white mb-1">No sightings recorded yet</h3>
              <p className="text-xs max-w-sm mx-auto mb-4">
                Keep a field journal of the birds, mammals, and flowers you encounter along the Kanheri or Shilonda trails.
              </p>
              <button
                onClick={() => setShowAddForm(true)}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow"
              >
                Log Your First Observation
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
