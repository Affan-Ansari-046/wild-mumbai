import type { GPSPosition } from '../../services/geolocationService';
import { formatCoordinates } from '../../services/geolocationService';
import type { TrustedContact } from '../../types';

export type EmergencyTypeKey = 
  | 'lost'
  | 'injured'
  | 'wildlife-encounter'
  | 'separated-group'
  | 'unsafe-trail'
  | 'other';

export interface EmergencyTypeOption {
  key: EmergencyTypeKey;
  label: string;
  marathiLabel: string;
  icon: string;
  color: string;
  severity: 'high' | 'critical';
  description: string;
}

export const EMERGENCY_TYPES: EmergencyTypeOption[] = [
  {
    key: 'lost',
    label: 'Lost / Off-Trail',
    marathiLabel: 'रस्ता भरकटलो / हरवलो',
    icon: 'Compass',
    color: 'amber',
    severity: 'high',
    description: 'Unable to locate trail marks or main road; disoriented in forest or ravines'
  },
  {
    key: 'injured',
    label: 'Medical Injury / Snakebite',
    marathiLabel: 'वैद्यकीय दुखापत / सर्पदंश',
    icon: 'HeartPulse',
    color: 'rose',
    severity: 'critical',
    description: 'Fall fracture, severe bleeding, heat stroke, or suspected venomous snakebite'
  },
  {
    key: 'wildlife-encounter',
    label: 'Dangerous Wildlife Encounter',
    marathiLabel: 'वन्यजीव आमनेसामने (बिबट्या)',
    icon: 'ShieldAlert',
    color: 'red',
    severity: 'critical',
    description: 'Close proximity to an agitated leopard, large python, or aggressive pack'
  },
  {
    key: 'separated-group',
    label: 'Separated Group Member / Child',
    marathiLabel: 'गटातून व्यक्ती किंवा मूल वेगळे झाले',
    icon: 'Users',
    color: 'orange',
    severity: 'high',
    description: 'Member of your trekking or family party missing on forest trail'
  },
  {
    key: 'unsafe-trail',
    label: 'Unsafe Trail / Flash Flood / Landslide',
    marathiLabel: 'असुरक्षित रस्ता / पूर / दरड कोसळणे',
    icon: 'AlertTriangle',
    color: 'amber',
    severity: 'high',
    description: 'Dahisar river swelling, collapsed rock pathway, or blocked return route'
  },
  {
    key: 'other',
    label: 'Other Urgent Distress',
    marathiLabel: 'इतर तातडीची मदत',
    icon: 'HelpCircle',
    color: 'blue',
    severity: 'high',
    description: 'Dehydration, impending darkness, or other non-classified park emergency'
  }
];

export function buildEmergencyMessage(
  type: EmergencyTypeOption,
  position: GPSPosition | null,
  additionalDetails: string = ''
): string {
  const coordinatesStr = position
    ? `${position.latitude.toFixed(6)}, ${position.longitude.toFixed(6)} (${formatCoordinates(position.latitude, position.longitude)})`
    : '[Coordinates unavailable — GPS locating in progress]';

  const timestampStr = position
    ? new Date(position.timestamp).toLocaleString('en-IN', {
        dateStyle: 'medium',
        timeStyle: 'medium',
        timeZone: 'Asia/Kolkata'
      }) + ' IST'
    : new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'medium' });

  const accuracyStr = position
    ? `±${position.accuracy} meters`
    : 'Unknown accuracy';

  const detailsStr = additionalDetails.trim() || 'None provided';

  // EXACT FORMAT SPECIFIED IN PROMPT
  return `EMERGENCY — I need assistance in Sanjay Gandhi National Park, Mumbai. Emergency type: ${type.label}. My coordinates are [${coordinatesStr}]. Location recorded at [${timestampStr}], with estimated accuracy [${accuracyStr}]. Additional details: [${detailsStr}]. Please help me contact the appropriate park authorities or emergency services.`;
}

export function buildWhatsAppLink(message: string, phone?: string): string {
  const encoded = encodeURIComponent(message);
  if (phone) {
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    return `https://wa.me/${cleanPhone}?text=${encoded}`;
  }
  return `https://wa.me/?text=${encoded}`;
}

export function buildSmsLink(message: string, phone?: string): string {
  const encoded = encodeURIComponent(message);
  if (phone) {
    const cleanPhone = phone.replace(/[^0-9+]/g, '');
    return `sms:${cleanPhone}?body=${encoded}`;
  }
  return `sms:?body=${encoded}`;
}

// TRUSTED CONTACTS LOCAL STORAGE HELPERS
const TRUSTED_CONTACTS_KEY = 'wildmumbai_trusted_contacts';

export function getTrustedContacts(): TrustedContact[] {
  try {
    const raw = localStorage.getItem(TRUSTED_CONTACTS_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (e) {
    return [];
  }
}

export function saveTrustedContacts(contacts: TrustedContact[]): void {
  localStorage.setItem(TRUSTED_CONTACTS_KEY, JSON.stringify(contacts));
}
