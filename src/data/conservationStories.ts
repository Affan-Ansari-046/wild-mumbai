export interface ConservationStory {
  id: string;
  title: string;
  marathiTitle: string;
  subtitle: string;
  category: 'community' | 'coexistence' | 'ecology' | 'initiatives';
  readTime: string;
  image: string;
  summary: string;
  fullStory: string[];
  keyTakeaways: string[];
  quote: {
    text: string;
    author: string;
  };
}

export const CONSERVATION_STORIES: ConservationStory[] = [
  {
    id: 'warli-adivasi-waghoba',
    title: 'The Warli Guardians and the Sacred Waghoba',
    marathiTitle: 'वारली आदिवासी आणि वाघोबा उपासना',
    subtitle: 'Centuries of Indigenous Ecological Wisdom and Coexistence with the Big Cat',
    category: 'community',
    readTime: '5 min read',
    image: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=1200&q=80',
    summary: 'Inside the wooded boundaries of SGNP live thousands of indigenous Warli and Kokna tribal residents in traditional hamlets (padas). Their culture is built on a deep reverence for nature and peaceful coexistence with the leopard, revered as the forest deity Waghoba.',
    fullStory: [
      'Long before the modern metropolis of Mumbai exploded along the coast of the Arabian Sea, the indigenous Warli community inhabited the teak forests and basalt ridges of what is today Sanjay Gandhi National Park. Living in hamlets known as padas (such as Navpada, Chinchpada, and Keltipada), they have cultivated a timeless understanding of the forest rhythm.',
      'At the entrance of many padas stands a sacred stone or carved wooden idol anointed with vermilion, dedicated to Waghoba — the big cat deity. In Warli cosmology, the leopard is not an intruder or an adversary to be eradicated; it is a forest guardian and spiritual equal.',
      'During annual festivals like Waghoba Pujan, villagers offer prayers to the deity, asking for protection and promising to respect the boundary between human habitations and the deep jungle. This cultural reverence translates into everyday behavior: community members walk quietly through trails after dusk in pairs, carry bamboo staffs that tap rhythmically against stones, avoid leaving garbage or stray animals in open compounds, and speak of leopards with dignity and calm respect rather than irrational hysteria.',
      'The traditional Warli huts, built with karvi shrub stems plastered with red mud and cow dung, reflect a minimal ecological footprint. Their famous monochromatic Warli paintings — using rice paste on terracotta backgrounds — depict the circle of life, dancing humans holding hands, sacred trees, and forest animals cohabiting in seamless harmony.'
    ],
    keyTakeaways: [
      'Waghoba reverence represents one of the world\'s most enduring examples of indigenous large carnivore coexistence.',
      'Warli folklore and behavior provide modern urban planners with invaluable lessons in living alongside wildlife.',
      'Traditional Warli architecture utilizes local renewable forest materials like Karvi (Strobilanthes callosa) and mud.',
      'Respecting tribal hamlets and supporting indigenous cooperatives directly strengthens park conservation.'
    ],
    quote: {
      text: 'To us, Waghoba is the true landlord of these hills. We share this earth with him as guests who know where our doorstep ends and the jungle begins.',
      author: 'Warli elder from Keltipada, SGNP'
    }
  },
  {
    id: 'living-with-leopards',
    title: 'Living With Leopards: Mumbai’s Groundbreaking Model',
    marathiTitle: 'लिव्हिंग विथ लेपर्ड्स: मुंबईचे सहअस्तित्व मॉडेल',
    subtitle: 'How Forest Rangers, Wildlife Biologists, and Citizens Transformed Human-Leopard Relations',
    category: 'coexistence',
    readTime: '6 min read',
    image: 'https://images.unsplash.com/photo-1456926631375-92c8ce872def?auto=format&fit=crop&w=1200&q=80',
    summary: 'In the early 2000s, panic and frequent confrontations plagued park borders. Today, Mumbai has become a globally renowned benchmark for carnivore coexistence through scientific monitoring, rapid rescue protocols, and community engagement.',
    fullStory: [
      'Sanjay Gandhi National Park is an anomaly in modern wildlife conservation: a 104-square-kilometer tropical forest island surrounded on all four sides by an ultra-dense urban matrix housing over 18 million residents. In the early 2000s, misconceptions led to frequent captures of leopards whenever one was spotted near human dwellings, which paradoxically exacerbated territorial conflicts and attacks.',
      'A pioneering initiative titled "Living with Leopards" was launched by the Maharashtra Forest Department in close partnership with wildlife biologists (including Dr. Vidya Athreya), the Mumbai Police, civil society NGOs, local journalists, and Warli volunteers.',
      'Biologists proved through camera trapping and GPS telemetry that leopards were not straying or "lost" when moving through fringe housing colonies like Aarey Milk Colony or Borivali East — these were established home ranges where leopards naturally patrolled, feeding primarily on feral dogs, rodents, and wild chital.',
      'Instead of trapping and translocating cats (which disrupted territorial hierarchies and caused new conflicts), the project instituted community awareness workshops. Residents learned simple yet powerful protocols: ensuring bright perimeter lighting around residential societies, clearing organic open garbage that attracts stray dogs, keeping young children supervised after dusk, and learning never to run if a cat is sighted.',
      'As a consequence of these evidence-based interventions, leopard-related human casualties along the park perimeter dropped to historic lows, earning international acclaim as one of the world’s most remarkable urban wildlife management triumphs.'
    ],
    keyTakeaways: [
      'Translocating large carnivores often intensifies conflict; stabilizing resident populations in their territories is vastly more effective.',
      'Urban waste management is directly linked to wildlife safety: eliminating food waste reduces stray dog populations, shrinking the attractant for predators.',
      'Empowering local citizens with knowledge eradicates panic and replaces fear with vigilant composure.'
    ],
    quote: {
      text: 'Mumbai shows that the boundary between the wild and the city isn’t a concrete wall — it is human understanding and empathy.',
      author: 'Living with Leopards Conservation Team'
    }
  },
  {
    id: 'green-lung-of-mumbai',
    title: 'The Green Lung of Mumbai: An Ecological Lifeline',
    marathiTitle: 'मुंबईचे हिरवे फुफ्फुस: एक परिसंस्थीय वरदान',
    subtitle: 'Water Security, Carbon Sequestration, and Microclimate Moderation in a Megacity',
    category: 'ecology',
    readTime: '4 min read',
    image: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1200&q=80',
    summary: 'Beyond its wildlife, SGNP is an irreplaceable ecological infrastructure provider for Mumbai: purifying billions of cubic meters of air, cooling urban temperatures by up to 3°C, and safeguarding two major drinking water lakes.',
    fullStory: [
      'Every day, millions of vehicles, construction sites, and industries emit thousands of metric tons of greenhouse gases into the Mumbai skies. Just a few kilometers north, the continuous canopy of Sanjay Gandhi National Park acts as a giant natural filter, absorbing carbon dioxide and replenishing the atmosphere with oxygen.',
      'Studies by meteorological researchers have documented that the forested expanse of SGNP generates an "urban cooling island" effect, keeping the ambient temperature of adjacent northern suburbs 2°C to 4°C cooler than the concrete heat sinks of downtown Mumbai.',
      'Equally vital is water security. Within the park’s protected core lie Tulsi Lake and Vihar Lake. Because their entire catchment basins are enveloped by untouched forest roots that naturally filter rainwater runoff, these reservoirs deliver millions of liters of pristine drinking water to Mumbai residents daily, requiring far less artificial chemical treatment.',
      'During the torrential South-West monsoon, the dense root networks of teak, bamboo, and karvi act as a natural sponge, preventing devastating hillside mudslides and absorbing millions of gallons of storm runoff that would otherwise trigger catastrophic flash flooding across northern Mumbai.'
    ],
    keyTakeaways: [
      'SGNP captures and stores an estimated millions of tons of carbon within its forest biomass and soil.',
      'Tulsi and Vihar lakes provide high-quality municipal drinking water shielded from industrial contaminants.',
      'The forest prevents soil erosion and mitigates urban flooding by moderating heavy monsoon downpours.'
    ],
    quote: {
      text: 'Without SGNP, Mumbai would be uninhabitable — it is the lungs that let the city breathe and the watershed that quenches its thirst.',
      author: 'Maharashtra Forest Department Ecological Report'
    }
  }
];
