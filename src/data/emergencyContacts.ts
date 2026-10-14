import type { EmergencyContact } from '../types';

export const EMERGENCY_CONTACTS_DATA: EmergencyContact[] = [
  {
    id: 'sgnp-control-room',
    name: 'SGNP Forest Control Room (Borivali Main)',
    role: 'Central Park Administration & Incident Dispatch',
    phone: '+912228860360',
    altPhone: '+912228860389',
    department: 'Maharashtra Forest Department — SGNP Division',
    location: 'Main Administrative Complex, Borivali East, Mumbai 400066',
    availableHours: '24 Hours / 7 Days a week',
    priority: 'primary',
    verified: true,
    description: 'Direct control room for reporting lost visitors, forest fires, animal encounters, or immediate park staff deployment inside SGNP.'
  },
  {
    id: 'maha-wildlife-helpline',
    name: 'Maharashtra Wildlife 24x7 Helpline',
    role: 'Statewide Forest & Wildlife Distress Response',
    phone: '1926',
    department: 'Maharashtra Forest Department (Toll-Free)',
    location: 'Statewide Control Center (Maharashtra)',
    availableHours: '24 Hours / 7 Days a week (Toll-Free)',
    priority: 'primary',
    verified: true,
    description: 'Official 4-digit toll-free emergency number across Maharashtra for wildlife emergencies, injured animals, leopard conflict, and forest trespass.'
  },
  {
    id: 'rfo-borivali',
    name: 'Range Forest Officer (RFO) — Borivali Range',
    role: 'Field Rescue & Territorial Forest Operations',
    phone: '+912228866449',
    department: 'SGNP Territorial Wing',
    location: 'Borivali Range Office, SGNP',
    availableHours: '08:00 AM – 08:00 PM (Emergency on-call 24x7)',
    priority: 'primary',
    verified: true,
    description: 'Coordinates ranger patrol teams on trails including Shilonda, Kanheri valleys, and core buffer boundaries.'
  },
  {
    id: 'national-emergency-112',
    name: 'National Emergency Response (Police / Fire / Rescue)',
    role: 'All-India Integrated Emergency Service',
    phone: '112',
    department: 'Government of Maharashtra / Mumbai Police',
    location: 'Mumbai Central Emergency Dispatch',
    availableHours: '24 Hours / 7 Days a week (Toll-Free)',
    priority: 'secondary',
    verified: true,
    description: 'Universal emergency lifeline. Directs calls to nearest police station (Kasturba Marg Police Station covers Borivali entrance of SGNP).'
  },
  {
    id: 'medical-ambulance-108',
    name: 'Emergency Medical Ambulance (MEMS)',
    role: 'Free Advanced Life Support / Basic Life Support',
    phone: '108',
    department: 'Maharashtra Emergency Medical Services',
    location: 'Dispatched to nearest access gate (Borivali / Yeoor)',
    availableHours: '24 Hours / 7 Days a week (Toll-Free)',
    priority: 'secondary',
    verified: true,
    description: 'For severe medical traumas, heat stroke, cardiac events, or snakebite emergencies requiring rapid transit to trauma centers (e.g. Shatabdi Hospital, Borivali).'
  },
  {
    id: 'mumbai-disaster-mgmt',
    name: 'BMC Disaster Management Control Room',
    role: 'Urban Disaster Response & Flash Flood Coordination',
    phone: '1916',
    department: 'Brihanmumbai Municipal Corporation (BMC)',
    location: 'BMC Headquarters, Fort, Mumbai',
    availableHours: '24 Hours / 7 Days a week (Toll-Free)',
    priority: 'secondary',
    verified: true,
    description: 'Coordinates heavy rainfall alerts, Dahisar river swelling warnings, and citywide monsoon emergency response.'
  },
  {
    id: 'wildlife-rescue-ngo',
    name: 'SARRP & Wildlife Welfare Association (Rescue Liaison)',
    role: 'Volunteer Snake & Wildlife Rescue Team',
    phone: '+919820141163',
    department: 'Forest Department Authorized Wildlife Rescue Partner',
    location: 'Mumbai Suburbs & Thane Division',
    availableHours: '07:00 AM – 11:00 PM',
    priority: 'specialized',
    verified: true,
    description: 'Authorized NGO volunteers trained in humane reptile rescue, snakebite advice, and wildlife conflict mitigation.'
  }
];
