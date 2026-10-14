import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Clock, 
  Users, 
  Compass, 
  CheckSquare, 
  Printer, 
  Share2, 
  Save, 
  Trash2, 
  Copy, 
  Check, 
  AlertCircle, 
  Sparkles, 
  CloudSun,
  Droplets,
  Footprints,
  Info
} from 'lucide-react';
import { ATTRACTIONS_DATA } from '../data/attractions';
import type { TripPlan } from '../types';
import { saveTripPlanToDB, getAllTripPlans, deleteTripPlanFromDB } from '../services/offlineStorage';

export const TripPlannerPage: React.FC = () => {
  const [visitDate, setVisitDate] = useState<string>(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  });
  const [arrivalTime, setArrivalTime] = useState<string>('08:30');
  const [groupProfile, setGroupProfile] = useState<TripPlan['groupProfile']>('couple');
  const [duration, setDuration] = useState<TripPlan['duration']>('half-day');
  const [selectedInterests, setSelectedInterests] = useState<string[]>(['caves', 'wildlife']);
  const [savedPlans, setSavedPlans] = useState<TripPlan[]>([]);
  const [copiedPlan, setCopiedPlan] = useState<boolean>(false);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);

  useEffect(() => {
    getAllTripPlans().then(setSavedPlans);
  }, []);

  const toggleInterest = (interest: string) => {
    setSelectedInterests((prev) =>
      prev.includes(interest) ? prev.filter((i) => i !== interest) : [...prev, interest]
    );
  };

  // Build Dynamic Itinerary based on inputs
  const buildCurrentItinerary = () => {
    let stops = [];
    
    // Stop 1: Entrance & Transit
    stops.push({
      attractionId: 'borivali-main-entrance',
      name: 'Borivali Main Entrance (Western Gate)',
      plannedTime: arrivalTime,
      estimatedDuration: '30 mins',
      notes: 'Purchase entry tickets (₹85 adults, ₹45 kids). Rent bicycles (₹80/hr) or board the green electric shuttle to Kanheri.'
    });

    // If History or Caves or Full Day
    if (selectedInterests.includes('caves') || duration === 'full-day' || duration === 'half-day') {
      stops.push({
        attractionId: 'kanheri-caves',
        name: 'Kanheri Caves Complex (Caves 1–109)',
        plannedTime: '09:30 AM',
        estimatedDuration: duration === 'full-day' ? '3 hours' : '2 hours',
        notes: 'Explore Cave 3 (Great Chaitya Hall), Cave 11 (Darbar Hall), and ancient rock cisterns. Keep snacks zipped away from macaques. (Closed Mondays)'
      });
    }

    // If Wildlife or Safaris
    if (selectedInterests.includes('wildlife') || selectedInterests.includes('family')) {
      stops.push({
        attractionId: 'lion-tiger-safari',
        name: 'Lion & Tiger Safari Enclosure',
        plannedTime: '12:30 PM',
        estimatedDuration: '45 mins',
        notes: 'Caged bus safari through semi-natural forest enclosures to see rescued big cats. Tickets ₹110 adults.'
      });
    }

    // If Nature Walks / Birdwatching
    if (selectedInterests.includes('nature') || selectedInterests.includes('birds')) {
      stops.push({
        attractionId: 'nature-information-centre',
        name: 'Nature Information Centre (NIC) & Trailhead',
        plannedTime: '02:00 PM',
        estimatedDuration: '1 hour',
        notes: 'Visit biodiversity exhibition, butterfly garden, and register with accredited naturalist for forest exploration.'
      });
    }

    // Relaxed afternoon stop
    if (duration === 'full-day' || selectedInterests.includes('family')) {
      stops.push({
        attractionId: 'dahisar-river-boating',
        name: 'Dahisar River Boating & Gandhi Smarak',
        plannedTime: '03:30 PM',
        estimatedDuration: '45 mins',
        notes: 'Gentle pedal boat ride along Dahisar riverbank, followed by quiet sunset view from Gandhi Smarak hillock.'
      });
    }

    // Estimated Cost
    const numPeople = groupProfile === 'solo' ? 1 : groupProfile === 'couple' ? 2 : 4;
    const parkEntryCost = numPeople * 85;
    const cavesCost = numPeople * 25;
    const safariCost = selectedInterests.includes('wildlife') ? numPeople * 110 : 0;
    const totalCost = parkEntryCost + cavesCost + safariCost;

    return {
      stops,
      estimatedCost: {
        parkEntry: parkEntryCost,
        attractions: cavesCost,
        safariOrCycle: safariCost,
        total: totalCost
      }
    };
  };

  const itinerary = buildCurrentItinerary();

  // Dynamic Packing Checklist
  const getPackingList = () => {
    const list = [
      'Minimum 1.5–2 Liters of drinking water in reusable bottle (Single-use plastics banned)',
      'Comfortable walking shoes with good grip (Avoid open flip-flops on basalt rocks)',
      'Valid Government Photo ID for ticket counter verification',
      'Small cash (₹500–₹1000) for bicycle deposit and local Warli handicraft purchases'
    ];

    const visitMonth = new Date(visitDate).getMonth(); // 0-11
    if (visitMonth >= 5 && visitMonth <= 8) {
      // Monsoon (June - Sept)
      list.push('High-traction waterproof hiking shoes or sandals');
      list.push('Lightweight breathable raincoat or windcheater');
      list.push('Waterproof phone pouch or dry bag for electronics');
    } else if (visitMonth >= 9 || visitMonth <= 1) {
      // Winter (Oct - Feb)
      list.push('Binoculars for migratory raptors and canopy birdwatching');
      list.push('Light morning jacket or shawl for cool 07:30 AM breeze');
    } else {
      // Summer (March - May)
      list.push('Wide-brimmed sun hat and UV sunglasses');
      list.push('Electrolyte sachets (ORS) to prevent heat exhaustion on open rock plateaus');
    }

    return list;
  };

  const packingList = getPackingList();

  const handleSavePlan = async () => {
    const newPlan: TripPlan = {
      id: 'plan_' + Date.now(),
      title: `SGNP Visit (${groupProfile.toUpperCase()} • ${duration.toUpperCase()})`,
      visitDate,
      arrivalTime,
      groupProfile,
      duration,
      interests: selectedInterests,
      stops: itinerary.stops.map(s => ({
        attractionId: s.attractionId,
        plannedTime: s.plannedTime,
        estimatedDuration: s.estimatedDuration,
        notes: s.notes
      })),
      estimatedCost: itinerary.estimatedCost,
      packingList,
      createdAt: new Date().toISOString()
    };

    await saveTripPlanToDB(newPlan);
    const updated = await getAllTripPlans();
    setSavedPlans(updated);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const handleDeletePlan = async (id: string) => {
    await deleteTripPlanFromDB(id);
    const updated = await getAllTripPlans();
    setSavedPlans(updated);
  };

  const handleCopySummary = () => {
    const text = `WILD MUMBAI — TRIP ITINERARY
Date: ${visitDate} | Arrival: ${arrivalTime} IST
Group: ${groupProfile} | Duration: ${duration}
Estimated Cost: ₹${itinerary.estimatedCost.total} total

PLANNED STOPS:
${itinerary.stops.map((s, idx) => `${idx + 1}. [${s.plannedTime}] ${s.name} (${s.estimatedDuration})\n   ${s.notes}`).join('\n\n')}

PACKING CHECKLIST:
${packingList.map(item => `• ${item}`).join('\n')}

Note: Please exit park before 06:30 PM. Keep emergency numbers handy (SGNP Control Room: +91 22 2886 0360).`;

    navigator.clipboard.writeText(text);
    setCopiedPlan(true);
    setTimeout(() => setCopiedPlan(false), 2500);
  };

  return (
    <div className="min-h-screen bg-[#070c09] text-white py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#1b3425] pb-6">
          <div>
            <div className="flex items-center gap-2 text-xs uppercase tracking-wider font-semibold text-emerald-400 mb-2">
              <Calendar className="w-4 h-4" />
              <span>Sanjay Gandhi National Park Trip Architect</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold font-['Cinzel'] text-white">
              Plan Your SGNP Expedition
            </h1>
            <p className="text-xs sm:text-sm text-neutral-300 max-w-2xl mt-1">
              Build an optimized, time-sequenced itinerary with verified stops, estimated fee breakdowns, and seasonal packing guidance.
            </p>
          </div>

          <div className="flex items-center gap-2 no-print">
            <button
              onClick={handleCopySummary}
              className="flex items-center gap-1.5 px-3 py-2 bg-[#12241b] hover:bg-[#183224] text-neutral-200 text-xs font-semibold rounded-xl border border-[#244633] transition"
            >
              {copiedPlan ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              <span>{copiedPlan ? 'Copied' : 'Copy Summary'}</span>
            </button>

            <button
              onClick={() => window.print()}
              className="flex items-center gap-1.5 px-3 py-2 bg-[#12241b] hover:bg-[#183224] text-neutral-200 text-xs font-semibold rounded-xl border border-[#244633] transition"
            >
              <Printer className="w-4 h-4 text-emerald-400" />
              <span>Print Itinerary</span>
            </button>
          </div>
        </div>

        {/* 1. INTERACTIVE CONFIGURATION FORM */}
        <div className="bg-[#0b1610] rounded-3xl border border-[#1b3425] p-6 shadow-xl space-y-6 no-print">
          <h2 className="text-sm font-bold uppercase tracking-wider text-emerald-400">
            1. Configure Visit Parameters
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Visit Date */}
            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1.5">Visit Date</label>
              <input
                type="date"
                value={visitDate}
                onChange={(e) => setVisitDate(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#070e0a] border border-[#1f3b2a] rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            {/* Arrival Time */}
            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1.5">Gate Arrival Time</label>
              <select
                value={arrivalTime}
                onChange={(e) => setArrivalTime(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#070e0a] border border-[#1f3b2a] rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
              >
                <option value="07:30">07:30 AM (Gates open, prime birding)</option>
                <option value="08:30">08:30 AM (Pleasant morning light)</option>
                <option value="09:30">09:30 AM (Standard morning arrival)</option>
                <option value="11:00">11:00 AM (Mid-day visit)</option>
                <option value="01:30">01:30 PM (Afternoon half-day)</option>
              </select>
            </div>

            {/* Group Profile */}
            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1.5">Group Profile</label>
              <select
                value={groupProfile}
                onChange={(e) => setGroupProfile(e.target.value as any)}
                className="w-full px-3.5 py-2.5 bg-[#070e0a] border border-[#1f3b2a] rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
              >
                <option value="solo">Solo Traveler</option>
                <option value="couple">Couple</option>
                <option value="family">Family with Children</option>
                <option value="seniors">Senior Citizens</option>
                <option value="photographers">Wildlife Photographers</option>
                <option value="hikers">Trekking Enthusiasts</option>
              </select>
            </div>

            {/* Visit Duration */}
            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1.5">Trip Duration</label>
              <select
                value={duration}
                onChange={(e) => setDuration(e.target.value as any)}
                className="w-full px-3.5 py-2.5 bg-[#070e0a] border border-[#1f3b2a] rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
              >
                <option value="quick">Quick Visit (2 – 3 Hours)</option>
                <option value="half-day">Half Day (4 – 5 Hours)</option>
                <option value="full-day">Full Day (7 – 8 Hours)</option>
              </select>
            </div>
          </div>

          {/* Interests Pills */}
          <div>
            <label className="block text-xs font-medium text-neutral-300 mb-2">Primary Interests</label>
            <div className="flex flex-wrap gap-2">
              {[
                { id: 'caves', label: '🏛️ Kanheri Caves & History' },
                { id: 'wildlife', label: '🐅 Big Cat Safari & Animals' },
                { id: 'nature', label: '🌿 Guided Nature Trails (Shilonda)' },
                { id: 'birds', label: '🦅 Birdwatching & Western Ghats Species' },
                { id: 'family', label: '🚣 Family Boating & Recreation' },
                { id: 'photography', label: '📷 Landscape & Wildlife Photography' },
              ].map((interest) => {
                const active = selectedInterests.includes(interest.id);
                return (
                  <button
                    key={interest.id}
                    type="button"
                    onClick={() => toggleInterest(interest.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition border ${
                      active
                        ? 'bg-emerald-600 text-white border-emerald-500 shadow'
                        : 'bg-[#070e0a] text-neutral-300 border-[#1e3929] hover:bg-[#12241b]'
                    }`}
                  >
                    {interest.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* 2. GENERATED ITINERARY PREVIEW */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Stops List (2 Cols) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold uppercase tracking-wider text-emerald-400">
                2. Recommended Route Stops ({itinerary.stops.length})
              </h2>
              <span className="text-xs text-neutral-400">
                Scheduled for {visitDate}
              </span>
            </div>

            <div className="space-y-4">
              {itinerary.stops.map((stop, index) => (
                <div
                  key={index}
                  className="p-5 rounded-2xl bg-[#0b1610] border border-[#1b3425] shadow-lg flex items-start gap-4"
                >
                  <div className="w-9 h-9 rounded-xl bg-emerald-950 border border-emerald-700/60 flex items-center justify-center font-bold text-emerald-300 text-sm shrink-0">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                      <h3 className="text-base font-bold text-white">
                        {stop.name}
                      </h3>
                      <div className="flex items-center gap-2 text-xs">
                        <span className="text-emerald-400 font-semibold">{stop.plannedTime}</span>
                        <span className="text-neutral-500">•</span>
                        <span className="text-neutral-300">{stop.estimatedDuration}</span>
                      </div>
                    </div>
                    <p className="text-xs text-neutral-300 leading-relaxed">
                      {stop.notes}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Estimated Fees Breakdown */}
            <div className="p-5 rounded-2xl bg-[#070e0a] border border-[#1a3324] space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                Estimated Official Fee Breakdown
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div>
                  <span className="text-neutral-400 block text-[11px]">Park Gate Entry</span>
                  <span className="text-white font-semibold">₹{itinerary.estimatedCost.parkEntry}</span>
                </div>
                <div>
                  <span className="text-neutral-400 block text-[11px]">ASI Cave Tickets</span>
                  <span className="text-white font-semibold">₹{itinerary.estimatedCost.attractions}</span>
                </div>
                <div>
                  <span className="text-neutral-400 block text-[11px]">Safari / Activities</span>
                  <span className="text-white font-semibold">₹{itinerary.estimatedCost.safariOrCycle}</span>
                </div>
                <div>
                  <span className="text-neutral-400 block text-[11px]">Estimated Total</span>
                  <span className="text-emerald-300 font-bold text-sm">₹{itinerary.estimatedCost.total}</span>
                </div>
              </div>
              <div className="text-[11px] text-neutral-400 italic pt-1">
                *Tickets are purchased directly at the official Borivali gate ticket windows. This app does not sell tickets.
              </div>
            </div>

            {/* Save Button */}
            <div className="no-print pt-2 flex items-center gap-3">
              <button
                onClick={handleSavePlan}
                className="flex items-center gap-2 px-5 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow-lg transition active:scale-95 text-xs sm:text-sm"
              >
                <Save className="w-4 h-4" />
                <span>{saveSuccess ? 'Itinerary Saved to Device!' : 'Save Itinerary Locally'}</span>
              </button>
            </div>
          </div>

          {/* Right Col: Packing & Safety Checklists */}
          <div className="space-y-6">
            
            {/* Seasonal Packing Checklist */}
            <div className="p-5 rounded-2xl bg-[#0b1610] border border-[#1b3425] shadow-lg">
              <h3 className="text-sm font-bold uppercase tracking-wider text-emerald-400 mb-3 flex items-center gap-2">
                <CheckSquare className="w-4 h-4 text-emerald-400" />
                <span>Seasonal Packing Checklist</span>
              </h3>
              <ul className="space-y-2.5">
                {packingList.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-xs text-neutral-200">
                    <input type="checkbox" className="mt-0.5 rounded border-[#244633] text-emerald-500 focus:ring-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Weather & Park Reminders */}
            <div className="p-5 rounded-2xl bg-[#0b1610] border border-[#1b3425] shadow-lg space-y-3">
              <h3 className="text-sm font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-2">
                <CloudSun className="w-4 h-4 text-emerald-400" />
                <span>Weather Awareness & Advisory</span>
              </h3>
              <p className="text-xs text-neutral-300 leading-relaxed">
                Mumbai weather varies sharply from torrential southwest monsoon showers (June – Sept) to dry, sun-baked basalt heat (March – May).
              </p>
              <a
                href="https://mausam.imd.gov.in/mumbai/"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-emerald-400 hover:text-emerald-300 font-semibold"
              >
                <span>Check Real IMD Mumbai Weather Radar</span>
              </a>
            </div>

            {/* Saved Plans Archive */}
            {savedPlans.length > 0 && (
              <div className="p-5 rounded-2xl bg-[#0b1610] border border-[#1b3425] shadow-lg space-y-3 no-print">
                <h3 className="text-sm font-bold uppercase tracking-wider text-emerald-400">
                  Locally Saved Plans ({savedPlans.length})
                </h3>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {savedPlans.map((plan) => (
                    <div
                      key={plan.id}
                      className="p-3 rounded-xl bg-[#070e0a] border border-[#183122] flex items-center justify-between text-xs"
                    >
                      <div>
                        <div className="font-semibold text-white">{plan.title}</div>
                        <div className="text-[11px] text-neutral-400">{plan.visitDate} • {plan.stops.length} stops</div>
                      </div>
                      <button
                        onClick={() => handleDeletePlan(plan.id)}
                        className="p-1 text-neutral-500 hover:text-red-400 transition"
                        title="Delete saved plan"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

        </div>

      </div>
    </div>
  );
};
