import { openDB } from 'idb';
import type { DBSchema, IDBPDatabase } from 'idb';
import type { TripPlan, WildlifeSighting } from '../types';
import { SPECIES_DATA } from '../data/species';
import { ATTRACTIONS_DATA } from '../data/attractions';
import { SAFETY_GUIDES_DATA } from '../data/safetyGuides';
import { EMERGENCY_CONTACTS_DATA } from '../data/emergencyContacts';

interface WildMumbaiDB extends DBSchema {
  cachedContent: {
    key: string;
    value: {
      id: string;
      data: any;
      updatedAt: string;
    };
  };
  sightings: {
    key: string;
    value: WildlifeSighting;
    indexes: { 'by-date': string };
  };
  savedPlaces: {
    key: string;
    value: { id: string; savedAt: string };
  };
  savedSpecies: {
    key: string;
    value: { id: string; savedAt: string };
  };
  tripPlans: {
    key: string;
    value: TripPlan;
    indexes: { 'by-createdAt': string };
  };
}

const DB_NAME = 'WildMumbai_OfflineDB_v1';
const DB_VERSION = 1;

let dbPromise: Promise<IDBPDatabase<WildMumbaiDB>> | null = null;

export function getDatabase(): Promise<IDBPDatabase<WildMumbaiDB>> {
  if (!dbPromise) {
    dbPromise = openDB<WildMumbaiDB>(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains('cachedContent')) {
          db.createObjectStore('cachedContent', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('sightings')) {
          const sStore = db.createObjectStore('sightings', { keyPath: 'id' });
          sStore.createIndex('by-date', 'date');
        }
        if (!db.objectStoreNames.contains('savedPlaces')) {
          db.createObjectStore('savedPlaces', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('savedSpecies')) {
          db.createObjectStore('savedSpecies', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('tripPlans')) {
          const tStore = db.createObjectStore('tripPlans', { keyPath: 'id' });
          tStore.createIndex('by-createdAt', 'createdAt');
        }
      },
    });
  }
  return dbPromise;
}

// CACHE ALL OFFSETS (SPECIES, ATTRACTIONS, GUIDES, EMERGENCY, VECTOR POIS)
export async function downloadCompleteOfflinePack(): Promise<{ sizeBytes: number; timestamp: string }> {
  const db = await getDatabase();
  const timestamp = new Date().toISOString();

  const payload = {
    species: SPECIES_DATA,
    attractions: ATTRACTIONS_DATA,
    safetyGuides: SAFETY_GUIDES_DATA,
    emergencyContacts: EMERGENCY_CONTACTS_DATA,
    geoBounds: {
      minLat: 19.1415,
      maxLat: 19.2900,
      minLng: 72.8400,
      maxLng: 72.9700,
      center: [19.2285, 72.8984]
    }
  };

  await db.put('cachedContent', {
    id: 'full_offline_pack',
    data: payload,
    updatedAt: timestamp
  });

  localStorage.setItem('wildmumbai_last_cached', timestamp);

  // Approximate size estimation in bytes
  const serialized = JSON.stringify(payload);
  const sizeBytes = new Blob([serialized]).size;
  localStorage.setItem('wildmumbai_cached_size_bytes', String(sizeBytes));

  return { sizeBytes, timestamp };
}

export async function getOfflinePackStatus(): Promise<{ isCached: boolean; timestamp: string | null; sizeBytes: number }> {
  try {
    const db = await getDatabase();
    const item = await db.get('cachedContent', 'full_offline_pack');
    const timestamp = localStorage.getItem('wildmumbai_last_cached') || (item ? item.updatedAt : null);
    const sizeBytes = parseInt(localStorage.getItem('wildmumbai_cached_size_bytes') || '0', 10);
    return {
      isCached: !!item,
      timestamp,
      sizeBytes
    };
  } catch (e) {
    return { isCached: false, timestamp: null, sizeBytes: 0 };
  }
}

export async function clearOfflineData(): Promise<void> {
  const db = await getDatabase();
  await db.clear('cachedContent');
  localStorage.removeItem('wildmumbai_last_cached');
  localStorage.removeItem('wildmumbai_cached_size_bytes');
}

// SIGHTINGS CRUD (IndexedDB)
export async function saveSightingToDB(sighting: WildlifeSighting): Promise<void> {
  const db = await getDatabase();
  await db.put('sightings', sighting);
}

export async function getAllSightings(): Promise<WildlifeSighting[]> {
  try {
    const db = await getDatabase();
    const sightings = await db.getAll('sightings');
    return sightings.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  } catch (e) {
    return [];
  }
}

export async function deleteSightingFromDB(id: string): Promise<void> {
  const db = await getDatabase();
  await db.delete('sightings', id);
}

// SAVED PLACES (IndexedDB + quick check)
export async function toggleSavedPlace(attractionId: string): Promise<boolean> {
  const db = await getDatabase();
  const existing = await db.get('savedPlaces', attractionId);
  if (existing) {
    await db.delete('savedPlaces', attractionId);
    return false;
  } else {
    await db.put('savedPlaces', { id: attractionId, savedAt: new Date().toISOString() });
    return true;
  }
}

export async function getSavedPlacesIds(): Promise<string[]> {
  try {
    const db = await getDatabase();
    const items = await db.getAll('savedPlaces');
    return items.map(i => i.id);
  } catch (e) {
    return [];
  }
}

// SAVED SPECIES
export async function toggleSavedSpecies(speciesId: string): Promise<boolean> {
  const db = await getDatabase();
  const existing = await db.get('savedSpecies', speciesId);
  if (existing) {
    await db.delete('savedSpecies', speciesId);
    return false;
  } else {
    await db.put('savedSpecies', { id: speciesId, savedAt: new Date().toISOString() });
    return true;
  }
}

export async function getSavedSpeciesIds(): Promise<string[]> {
  try {
    const db = await getDatabase();
    const items = await db.getAll('savedSpecies');
    return items.map(i => i.id);
  } catch (e) {
    return [];
  }
}

// TRIP PLANS
export async function saveTripPlanToDB(plan: TripPlan): Promise<void> {
  const db = await getDatabase();
  await db.put('tripPlans', plan);
}

export async function getAllTripPlans(): Promise<TripPlan[]> {
  try {
    const db = await getDatabase();
    const plans = await db.getAll('tripPlans');
    return plans.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  } catch (e) {
    return [];
  }
}

export async function deleteTripPlanFromDB(id: string): Promise<void> {
  const db = await getDatabase();
  await db.delete('tripPlans', id);
}
