export type SpeciesGroup = 'mammals' | 'birds' | 'reptiles' | 'amphibians-insects' | 'flora';

export type IUCNStatus = 'Critically Endangered' | 'Endangered' | 'Vulnerable' | 'Near Threatened' | 'Least Concern' | 'Data Deficient';

export interface Species {
  id: string;
  commonName: string;
  scientificName: string;
  marathiName: string;
  group: SpeciesGroup;
  iucnStatus: IUCNStatus;
  isSGNPResident: boolean;
  isWesternGhatsEndemic: boolean;
  habitat: string;
  diet: string;
  ecologicalRole: string;
  identificationNotes: string[];
  observationGuidance: string;
  bestSeason: string;
  bestTime: string;
  audioDescription: string;
  image: string;
  imageAttribution: string;
  sourceName: string;
  sourceUrl: string;
  verificationStatus: 'Verified Official SGNP Record' | 'Maharashtra Tourism Documented' | 'ASI Official Record';
  lastVerified: string;
  dietCategory: 'Carnivore' | 'Herbivore' | 'Omnivore' | 'Insectivore' | 'Producer' | 'Scavenger';
  sizeWeight?: string;
}

export type AttractionCategory = 'caves' | 'trails' | 'safaris' | 'viewpoints' | 'facilities' | 'lakes' | 'entrances';

export interface Attraction {
  id: string;
  name: string;
  marathiName: string;
  category: AttractionCategory;
  coordinates: [number, number]; // [lat, lng]
  description: string;
  history?: string;
  hours: string;
  entryFee: string;
  duration: string;
  difficulty: 'Easy' | 'Moderate' | 'Challenging' | 'Restricted / Guide Required';
  accessibility: string;
  rules: string[];
  highlights: string[];
  bestSeason: string;
  image: string;
  imageAttribution: string;
  sourceName: string;
  sourceUrl: string;
  verificationStatus: 'Verified Official SGNP Record' | 'Maharashtra Tourism Documented' | 'ASI Official Record';
  lastVerified: string;
  operatingStatus: 'Open Daily' | 'Closed Mondays' | 'Subject to Forest Permit' | 'Operating';
  distanceKmFromMainGate: number;
}

export interface EmergencyContact {
  id: string;
  name: string;
  role: string;
  phone: string;
  altPhone?: string;
  department: string;
  location: string;
  availableHours: string;
  priority: 'primary' | 'secondary' | 'specialized';
  verified: boolean;
  description: string;
}

export interface TrustedContact {
  id: string;
  name: string;
  relationship: string;
  phone: string;
  isPrimary?: boolean;
}

export interface SafetyGuide {
  id: string;
  title: string;
  category: 'lost' | 'wildlife-leopard' | 'wildlife-snake' | 'weather-monsoon' | 'general-code';
  severity: 'critical' | 'warning' | 'info';
  icon: string;
  summary: string;
  actionSteps: string[];
  doNotSteps: string[];
  context: string;
}

export interface TripPlan {
  id: string;
  title: string;
  visitDate: string;
  arrivalTime: string;
  groupProfile: 'solo' | 'couple' | 'family' | 'seniors' | 'photographers' | 'hikers';
  duration: 'quick' | 'half-day' | 'full-day';
  interests: string[];
  stops: {
    attractionId: string;
    plannedTime: string;
    estimatedDuration: string;
    notes: string;
  }[];
  estimatedCost: {
    parkEntry: number;
    attractions: number;
    safariOrCycle: number;
    total: number;
  };
  packingList: string[];
  createdAt: string;
}

export interface WildlifeSighting {
  id: string;
  speciesName: string;
  speciesId?: string;
  date: string;
  time: string;
  locationName: string;
  coordinates?: [number, number];
  notes: string;
  count: number;
  photoDataUrl?: string;
  createdAt: string;
}

export interface UserPreferences {
  theme: 'dark' | 'light' | 'system';
  reducedMotion: boolean;
  lowPowerMode: boolean;
  distanceUnit: 'km' | 'mi';
}
