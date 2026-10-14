import type { SafetyGuide } from '../types';

export const SAFETY_GUIDES_DATA: SafetyGuide[] = [
  {
    id: 'guide-getting-lost',
    title: 'Protocol: If You Are Lost or Disoriented on a Trail',
    category: 'lost',
    severity: 'critical',
    icon: 'Compass',
    summary: 'Remain calm and execute the S.T.O.P. methodology immediately. Wandering into unfamiliar ravines drastically complicates rescue operations.',
    actionSteps: [
      'S — STOP: Immediately halt walking. Sit down, take deep breaths, and resist the panic impulse to run or push blindly forward through thickets.',
      'T — THINK: Recall your last confirmed landmark (e.g., Kanheri stone step, Dahisar river crossing, electricity pylon, tourist signpost).',
      'O — OBSERVE: Look around for high-ground terrain, clear paths, moving sun position, or sounds of traffic from Western Express Highway to the west or Ghodbunder Road to the north.',
      'P — PLAN: Check your battery level. Open the Wild Mumbai SOS tab to obtain your precise GPS coordinates.',
      'Share your coordinates and status via WhatsApp/SMS to SGNP Control Room (+91 22 2886 0360) and your trusted contacts.',
      'Stay in an open, visible, elevated area if safe. Do NOT descend into steep unmapped stream gullies which trap moisture and obscure phone reception.',
      'If daylight is fading, create an audible signal: blow a whistle in sets of three loud blasts or shout at regular intervals.'
    ],
    doNotSteps: [
      'DO NOT walk after dark. Navigating SGNP after sunset exposes you to nocturnal leopard movements, venomous snakes, and sheer cliff drop-offs.',
      'DO NOT take unverified downhill shortcuts through dense bamboo screes; these frequently end in vertical basalt cliffs.',
      'DO NOT exhaust your phone battery by repeatedly watching videos, browsing, or running unneeded background apps.',
      'DO NOT drink unfiltered stagnant puddle water unless using chlorine/purification tablets.'
    ],
    context: 'Sanjay Gandhi National Park encompasses 104 square kilometers of rugged basalt hills, dense bamboo brakes, and interconnected valleys. Mobile signals can fluctuate in deep ravines behind Kanheri and Jambhulmal.'
  },
  {
    id: 'guide-leopard-encounter',
    title: 'Wildlife Encounter: Indian Leopard (Panthera pardus)',
    category: 'wildlife-leopard',
    severity: 'critical',
    icon: 'ShieldAlert',
    summary: 'Leopards are naturally shy and generally avoid adult human confrontation. They rarely attack unless cornered, provoked, or surprised at close range.',
    actionSteps: [
      'Stand ground and make yourself appear as large as possible. Raise both arms or hold a jacket/backpack over your head.',
      'Maintain calm eye contact and face the leopard without aggressively staring. Keep looking towards it so it knows it has been detected.',
      'Back away slowly and deliberately while maintaining forward-facing orientation. Ensure the leopard has a clear, unobstructed escape route.',
      'If accompanied by children, immediately lift them onto your shoulders or hold them between adults in the center of the group.',
      'Make calm, firm, deep human vocal sounds or talk loudly in a steady tone. Clap hands rhythmically.',
      'If the leopard does not move away immediately, maintain your stance. It will almost always retreat into the forest once it senses your awareness.'
    ],
    doNotSteps: [
      'DO NEVER RUN. Running triggers an involuntary feline predatory chase reflex.',
      'DO NOT crouch, bend down, sit, or bend over to pick up stones. Crouching mimics small quadruped prey in outline.',
      'DO NOT attempt to advance towards the leopard to take close-up mobile photos or selfies.',
      'DO NOT throw stones or aggressively swing sticks unless the animal charges; provocative aggression can elicit a defensive strike.',
      'DO NOT corner a mother with cubs or approach a freshly cached deer carcass under any circumstances.'
    ],
    context: 'SGNP has one of the highest densities of free-ranging leopards in any urban setting on Earth (~40+ resident individuals). Over a decade of research through the "Living with Leopards" program shows peaceful coexistence is routine when humans follow basic etiquette.'
  },
  {
    id: 'guide-snake-safety',
    title: 'Snakebite Emergency & First Aid Protocol',
    category: 'wildlife-snake',
    severity: 'critical',
    icon: 'AlertTriangle',
    summary: 'Most snakes in SGNP are non-venomous (e.g., Rat snakes, Bronze-back tree snakes). However, four venomous species ("The Big Four") occur: Russell’s Viper, Indian Cobra, Common Krait, and Saw-scaled Viper, plus the mildly venomous Bamboo Pit Viper.',
    actionSteps: [
      'Reassure and calm the victim immediately. Anxiety elevates heart rate and accelerates venom dissemination through the lymphatic system.',
      'Immobilize the affected limb completely using a splint or rolled cloth (similar to treating a bone fracture). Keep the limb at or slightly below heart level.',
      'Remove all restrictive jewelry, rings, watches, or tight shoes near the bite site before swelling sets in.',
      'Note the time of the bite and observe any physical symptoms (pain, local swelling, drooping eyelids/ptosis, bleeding gums).',
      'Call Medical Ambulance (108) or SGNP Control Room immediately to arrange emergency transport to the nearest hospital equipped with Anti-Snake Venom (ASV).',
      'Nearest designated public hospitals with 24x7 ASV availability: Bharatratna Dr. Babasaheb Ambedkar Municipal General Hospital (Shatabdi Hospital, Borivali West) and Bhagwati Hospital (Borivali West).'
    ],
    doNotSteps: [
      'DO NOT apply a tight arterial tourniquet or tight rope around the limb; this causes tissue gangrene and amputations.',
      'DO NOT cut the bite wound with razor blades or attempt to suck out the venom with your mouth or suction devices.',
      'DO NOT apply ice packs, herbal concoctions, turmeric, kerosene, or electric shocks.',
      'DO NOT attempt to catch, kill, or corner the snake for identification; this frequently results in a second bite. A quick photograph from a safe distance of 3+ meters is sufficient.'
    ],
    context: 'Over 90% of snakebite complications arise from delays caused by traditional "healers" or harmful first-aid attempts. Rapid transport to an ASV-equipped hospital is the ONLY scientifically proven treatment.'
  },
  {
    id: 'guide-monsoon-hazards',
    title: 'Monsoon Stream & Flash Flood Precautions',
    category: 'weather-monsoon',
    severity: 'warning',
    icon: 'CloudRain',
    summary: 'Between June and September, SGNP receives over 2,500 mm of torrential rainfall. Water levels in Dahisar river and tributary ravines can rise by multiple feet in minutes.',
    actionSteps: [
      'Always check the Mumbai IMD weather radar before embarking on interior trails.',
      'Cross seasonal streams only at designated, shallow fording stones with stable footing.',
      'Wear high-traction hiking shoes with deep rubber lugs; basalt rock covered with green microscopic algae becomes as slippery as wet ice.',
      'Watch for leeches along stream verges; apply neem oil, tobacco water, or salt to footwear.',
      'Stay off exposed open rock plateaus (Kanheri roof, Jambhulmal peak) during thunderstorms due to severe lightning strike danger.'
    ],
    doNotSteps: [
      'DO NOT attempt to ford waist-deep churning stream currents; undertows against hidden boulders cause severe foot entrapment.',
      'DO NOT dive or jump into murky forest pools; submerged basalt boulders and tree trunks cause spinal injuries.',
      'DO NOT stand directly under unstable basalt overhangs or loose mud slopes during continuous torrential downpours.'
    ],
    context: 'The Dahisar river originates inside the park near Tulsi lake and cascades through rocky gorges before reaching the urban plains. It is a dynamic monsoon torrent.'
  },
  {
    id: 'guide-responsible-code',
    title: 'Park Rules & Responsible Eco-Tourism Code',
    category: 'general-code',
    severity: 'info',
    icon: 'Leaf',
    summary: 'Sanjay Gandhi National Park is a protected wildlife habitat under the Wildlife (Protection) Act, 1972. Preserving its sanctity is every visitor’s legal and moral obligation.',
    actionSteps: [
      'Carry back all personal trash. Practice strict "Leave No Trace" wilderness ethics.',
      'Maintain low conversational volume so other visitors can enjoy bird songs and natural ambient sounds.',
      'Stick strictly to officially sanctioned trails (Main road, Kanheri paths, or authorized NIC guided trails).',
      'Support local Warli artisans by purchasing authentic traditional Warli art and products at the park souvenir shop.',
      'Drive under 20 km/h on internal park roads; animals frequently cross between Krishnagiri Upavan and the river.'
    ],
    doNotSteps: [
      'STRICTLY NO PLASTICS: Single-use plastic bottles, bags, and thermocol are banned. Violators face spot fines.',
      'DO NOT FEED WILDLIFE: Feeding monkeys or deer disrupts natural foraging, causes digestive disorders, and creates aggressive habituation.',
      'NO ALCOHOL, SMOKING OR CAMPFIRES: Fire is a devastating existential threat to dry deciduous forest and bamboo groves.',
      'NO LOUD MUSIC OR BLUETOOTH SPEAKERS: High decibel sound is an illegal disturbance to wildlife.'
    ],
    context: 'SGNP is one of the very few surviving pristine forest ecosystems enclosed entirely by an 18-million-person metropolis. Responsible conduct ensures this ancient green jewel survives for future generations.'
  }
];
