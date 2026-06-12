/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface LoreItem {
  id: string;
  title: string;
  tagline: string;
  description: string;
  details: string[];
  imagePrompt: string; // Tailored prompt for generating an interactive infographic style illustration
  stats?: { label: string; value: string }[];
}

export interface CharacterPortal {
  id: string;
  name: string;
  subtitle: string;
  tagline: string;
  themeColor: string; // hex or Tailwind color
  accentColor: string; // for glowing buttons
  glowClass: string;
  imagePrompt: string;
  defaultImage: string; // stylized SVG fallback
  sections: {
    [key: string]: LoreItem;
  };
}

export const LORE_DATABASE: { [key: string]: CharacterPortal } = {
  'war-witch': {
    id: 'war-witch',
    name: 'War Witch',
    subtitle: 'Sirens of Abyssum',
    tagline: 'Enigmatic Gateways · Sirens of Abyssum',
    themeColor: 'from-[#1e0a05] to-[#45180c] text-orange-400',
    accentColor: '#ffa04d',
    glowClass: 'shadow-[0_0_25px_rgba(249,115,22,0.35)] border-orange-500/40',
    imagePrompt: 'War Witch: Sirens of Abyssum, cybermatic witch-mech, red and amber molten iron armor, steam gauges, blazing fire, high-tech HUD elements, cinematic anime concept art, volumetric lighting, epic compositions.',
    defaultImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=800',
    sections: {
      'WORLD': {
        id: 'world',
        title: 'Molten Sinks of Abyssum',
        tagline: 'Underground geothermal foundries of the heavy metal abyss.',
        description: 'Deep below the surface sits Abyssum, a vast sinkhole of toxic smog, churning automated smelters, and rivers of superheated slag. The War Witches scavenge industrial machinery to build high-energy resonant reactors.',
        details: [
          'Unstable core temperatures exceeding 4200 Kelvin.',
          'Atmospheric composition: 12% sulfur dioxide, 34% particulate scrap particulates.',
          'Primary energy source: Thermal-Siphon turbines driven by sub-crustal seismic compression.'
        ],
        imagePrompt: 'A massive subterranean geothermal foundry with rivers of liquid glowing lava and giant mechanical scrap cylinders under a dark metal ceiling, industrial sci-fi steampunk style.',
        stats: [
          { label: 'Ambient Temp', value: '1,450°C' },
          { label: 'Scrap Density', value: '94.2%' },
          { label: 'Toxicity', value: 'EXTREME' }
        ]
      },
      'FACTIONS': {
        id: 'factions',
        title: 'The Amber Sisterhood',
        tagline: 'Slag-scavenger cult in direct rebellion against the Guild.',
        description: 'An underground syndicate of witch-mechanics and pilot engineers who convert decommissioned slag-extractors and drill-rigs into acoustic, seismic-disruption weaponry. They control the lower sub-levels of Sector 7.',
        details: [
          'Autonomous cell structure operated by Mother-Founders.',
          'Utilizes the "Weave" - an encrypted low-frequency sonic resonance field to bypass corporate security nets.',
          'Current target: Guild Refinery Core 09 in the mid-sinks.'
        ],
        imagePrompt: 'A group of hooded sci-fi scavengers wearing glowing orange goggles and rustic exosuits standing in front of a giant rusted excavation vehicle, tactical cyberpunk matte painting.',
        stats: [
          { label: 'Active Pilots', value: '4,200+' },
          { label: 'Refined Cores', value: '18' },
          { label: 'Threat Index', value: 'LEVEL S' }
        ]
      },
      'STORY': {
        id: 'story',
        title: 'The Lost Slag Chorus',
        tagline: 'The mysterious, ancient sound-waves resetting automated mechs.',
        description: 'For decades, automated scrap-harvesting drones have been acting erratically when near Section 12-B. The Witches discovered a repeating sonic signal embedded in the seismic pulses of the slag lake. They call it the Lost Chorus.',
        details: [
          'Signal originates from a depth of 12.4 kilometers beneath solid volcanic basalt.',
          'Transmissions carry highly complex fractal binary codes compatible with pre-Collapse interfaces.',
          'Witches believe this signal holds the consciousness of the original Forge-Beast engine.'
        ],
        imagePrompt: 'An ancient glowing runic structure submerged inside a dark orange magma pool with binary codes and holographic waves propagating into the steam, sci-fi lore art.',
        stats: [
          { label: 'Signal Depth', value: '12.4km' },
          { label: 'Decryption', value: '41%' },
          { label: 'Frequency', value: '8.4 Hz' }
        ]
      },
      'ARENAS': {
        id: 'arenas',
        title: 'The Foundry Crucible',
        tagline: 'Gladiatorial mecha matches fought on unstable cargo platforms.',
        description: 'Deep-sink pilots sort out resource and turf wars on floating magnetic cranes and heavy crane hooks. Battles take place over molten copper reservoirs, requiring skilled positioning and thruster management.',
        details: [
          'Platforms tilt and descend as magnetic fields fluctuate.',
          'Hazardous slag geysers erupt periodically from the depths of the crucible.',
          'Fully destructible crane gantries and fuel pipelines can be triggered for explosive hazard plays.'
        ],
        imagePrompt: 'Two heavy robots with orange hydraulic lines colliding on a suspended container platform above a lake of molten copper, sci-fi arena battle, cinematic action shot.',
        stats: [
          { label: 'Grid Width', value: '250m' },
          { label: 'Hazards', value: 'Slag Geysers' },
          { label: 'Max Capacity', value: '24 Pilots' }
        ]
      },
      'ARMORY': {
        id: 'armory',
        title: 'Slag-Splitter resonance lance',
        tagline: 'Modular thermal-sonic polearms capable of shearing titan armor.',
        description: 'Constructed from superheated tungsten drill-tips and retrofitted with high-yield sonic actuators, this lance focuses seismic resonance and thermal heat into a microscopic focal point, melting compound armor instantly.',
        details: [
          'Utilizes Abyssum amber batteries for high-amperage cooling loops.',
          'Capable of direct ultrasonic vibration that shakes mecha frames to pieces.',
          'Equipped with an overdrive mechanism discharging a conic sound wave at a range of 15 meters.'
        ],
        imagePrompt: 'A glowing hot orange plasma spear resting on a mechanic workbench surrounded by wires, screens, and hydraulic gears, high tech armory display.',
        stats: [
          { label: 'Core Temp', value: '4,800K' },
          { label: 'Wattage Output', value: '2.4 GW' },
          { label: 'Weight', value: '340kg' }
        ]
      }
    }
  },
  'jane-district': {
    id: 'jane-district',
    name: 'Jane District',
    subtitle: 'Horror Witch Reporter',
    tagline: 'Investigate the Abyss · Report What Survives',
    themeColor: 'from-[#0b130a] to-[#122210] text-yellow-500',
    accentColor: '#eab308',
    glowClass: 'shadow-[0_0_25px_rgba(234,179,8,0.25)] border-yellow-500/40',
    imagePrompt: 'Jane District: Horror Witch Reporter, gothic cyberpunk city with towering dark gargoyles, rain slick streets, yellow neon gas lanterns, investigator in yellow trench coat and fedora, holding a vintage camera glowing with runic code.',
    defaultImage: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&q=80&w=800',
    sections: {
      'CASE FILES': {
        id: 'case-files',
        title: 'File 412: The Yellow Lanterns',
        tagline: 'Investigating the cyber-occult light-posts driving citizens mad.',
        description: 'Reports of ghostly yellow lights floating through the rain-slick gothic streets of Sector 9. Witness reports indicate a low humming sound, immediately followed by persistent, vivid hallucinations of ancient cybernetic temples.',
        details: [
          'Victims display localized neural burns congruent with synthetic telepathic broadcast waves.',
          'All cases occur near water-drain intersections where bio-slag levels are highest.',
          'Lantern models do not match municipal power records; they appear to grow organically out of the masonry.'
        ],
        imagePrompt: 'A dark rainy cyberpunk street with black concrete gargoyles, featuring a towering antique streetlamp that casts a heavy, eerie yellow neon glow across wet brick tiles.',
        stats: [
          { label: 'Active Reports', value: '87 Cases' },
          { label: 'Pulse Frequency', value: '19.4 Hz' },
          { label: 'Fatality Rate', value: '14.2%' }
        ]
      },
      'FACTIONS': {
        id: 'factions',
        title: 'The Chronicle Underground',
        tagline: 'Renegade investigative journalists broadcasting banned reports.',
        description: 'Led by Jane, this network of whistleblowers, print-press saboteurs, and rogue netrunners aims to expose the biomechanical occult experiments occurring in the corporate sub-layers.',
        details: [
          'Uses analog printing press machines to avoid corporate signal sweepers.',
          'Distributes chemical-paper journals that self-combust upon security check scans.',
          'Headquarters hidden in a flooded sewage treatment vault under the central cathedral.'
        ],
        imagePrompt: 'A secret dark printing room with stacks of paper, flashing monitors showing green and yellow charts, and a large analog press lit by a industrial desk lamp, retro sci-fi reporter vibe.',
        stats: [
          { label: 'Broadcasters', value: '14 Cells' },
          { label: 'Press Machines', value: '3' },
          { label: 'Suppression Index', value: 'HIGH' }
        ]
      },
      'EVIDENCE': {
        id: 'evidence',
        title: 'The Deep-Web Bio-Negative',
        tagline: 'Physical photo exposures holding encrypted paranormal data.',
        description: 'Jane captured a series of snapshots in Sector 9 using a custom silver-halide camera loaded with bio-conductive synthetic film. When developed, the negatives revealed physical cybernetic tendrils connecting human shadows directly to the sewer vents.',
        details: [
          'Silver-crystals on film reacted chemically to bio-mechanical ghost static.',
          'Encrypted binary runes are visibly etched into the borders of the shadow reflections.',
          'Scans show micro-cables growing underneath the skin of target specimens.'
        ],
        imagePrompt: 'A glowing bio-luminescent photographic negative clipping onto a hanging line inside a darkroom with yellow safe-light, showing ghost-like cybernetic structures with runic code details.',
        stats: [
          { label: 'Resolution', value: '8.4K lines' },
          { label: 'Mutagen Code', value: 'C-9195' },
          { label: 'Integrity', value: 'COMPROMISED' }
        ]
      },
      'THREATS': {
        id: 'threats',
        title: 'Biomechanical Shroud-Stalkers',
        tagline: 'Sentient corporate cyber-parasites that consume information.',
        description: 'Organisms constructed from flexible graphite mesh, carbon-fiber teeth, and viral sensory nodes. They are programmed by the corporate elite to locate and liquidize journalists, netrunners, and neural records.',
        details: [
          'Virtually invisible in low-light rain-slick shadows.',
          'Can transform into a vaporous liquid state through microscopic vents to slide under doors.',
          'Equipped with EM-blanket emitters that disrupt wireless communications in a 30m radius.'
        ],
        imagePrompt: 'A mechanical black panther-like robotic creature with a chest cavity glowing with amber cybernetic circuits walking under dark iron pipelines in a wet dark gothic corridor.',
        stats: [
          { label: 'Stealth Shielding', value: '98.5%' },
          { label: 'Search Speed', value: '45 km/h' },
          { label: 'Classification', value: 'KILL-ON-SIGHT' }
        ]
      },
      'ARCHIVE': {
        id: 'archive',
        title: 'The Dread Ledger',
        tagline: 'Jane’s personal ledger of occult-tech conspiracies.',
        description: 'A physical notebook bound with copper thread and wrapped in cyber-leather. It lists the names of corporate executives who have traded sections of their central computing networks to the unseen "Entities in the Smog".',
        details: [
          'Contains names, retinal scans, and quantum-key access cards to 9 research vaults.',
          'Details the exact design structure of the "Entropy Engine" that drains reality from the district.',
          'Self-destructs via thermite strip if opened without Jane’s biometric thumbprint.'
        ],
        imagePrompt: 'An old cybernetic diary notebook bound in heavy brown leather with glowing copper circuits and a small screen embedded on the cover sitting on a desk with old coffee cups and yellow papers.',
        stats: [
          { label: 'Entries', value: '148 Nodes' },
          { label: 'Target Vaults', value: '9' },
          { label: 'Calculated Danger', value: 'FATAL' }
        ]
      }
    }
  },
  'arenas-echelon': {
    id: 'arenas-echelon',
    name: 'Arenas of Echelon',
    subtitle: 'Gladiators of the High Skies',
    tagline: 'Glory. Honor. Dominance.',
    themeColor: 'from-[#05162a] to-[#0c2b4c] text-cyan-400',
    accentColor: '#22d3ee',
    glowClass: 'shadow-[0_0_25px_rgba(34,211,238,0.25)] border-cyan-500/40',
    imagePrompt: 'Arenas of Echelon, futuristic floating coliseum, hovering titanium shields, massive blue plasma floodlights shining upwards into high white clouds, cyber-knight on mechanical horse mount holding a glowing blue energy javelin, epic tournament sky.',
    defaultImage: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&q=80&w=800',
    sections: {
      'FEATURED MODE': {
        id: 'featured-mode',
        title: 'Mount Jousting Rodeo',
        tagline: 'A double-speed gladiatorial mount joust over bottomless clouds.',
        description: 'Champions mount heavy mechanized war beasts (from robotic steel horses to hover-drakes) and race down a narrow, suspended titanium track at 150 km/h. The goal: unseat the opponent into the sky below with plasma lances.',
        details: [
          'Tracks are 3 meters wide, suspended 15 kilometers in the air over the Echelon capital.',
          'Mounts feature magnetic-clamping systems that can be overcharged to execute wall-runs.',
          'Lances discharge electric kinetic impulses, knocking back mecha shields without direct chassis destruction.'
        ],
        imagePrompt: 'Two futuristic white mecha knights riding fast robotic stallions across a skyway bridge with blue energy barriers and bright clouds below, highly detailed digital speed-illustration.',
        stats: [
          { label: 'Rodeo Velocity', value: '150 km/h' },
          { label: 'Track Height', value: '15 km' },
          { label: 'Deflection Shield', value: 'Active' }
        ]
      },
      'RANKED TOURNAMENTS': {
        id: 'ranked-tournaments',
        title: 'The Sky-Core Invitational',
        tagline: 'High-stake brackets fought by Echelon’s premier factions.',
        description: 'An elite quarterly championship held inside the hovering "Glass Ring" stadium. Successful fighters earn royal titles, noble-caste privileges, and direct access to high-potency Sky-Core power cells.',
        details: [
          'Single-elimination matching consisting of three round duels.',
          'Combat is monitored by high-altitude camera nodes broadcasting to billions below.',
          'Victors earn the legendary "Sky-Pinnacle Laurel" cosmetic aura.'
        ],
        imagePrompt: 'A massive floating stadium looking like a giant ring of glass and pure blue plasma jets high in the clouds, illuminated by thousands of holographic searchlights.',
        stats: [
          { label: 'Fighter Pool', value: '128 Clans' },
          { label: 'Grand Prize', value: '50,000 SC' },
          { label: 'Win Rate Barrier', value: '72%' }
        ]
      },
      'CUSTOM CHAMPIONS': {
        id: 'custom-champions',
        title: 'Beastmaster & Vanguard Classes',
        tagline: 'Modular build configurations combining mech anatomy and pilot tech.',
        description: 'Gladiators customize both their pilot exosuit and their cybernetically augmented sentinel mounts. You can swap pneumatic thrusters, laser shields, armor density, and gravity anchors to suit your combat strategy.',
        details: [
          'Choose between 3 core chassis weights: Agile Harrier, Heavy Warden, or Core-Breaker.',
          'Equip special module boards that enable brief teleport blinks or defensive energy barriers.',
          'Mount customization includes claws, carbon-clamped talons, and plasma exhaust plumes.'
        ],
        imagePrompt: 'A technical rendering of a cybermatic war tiger mount with blueprints, cybernetic joints, blue wireframes, and steel armor plates, scientific blueprint design style.',
        stats: [
          { label: 'Exosuit Combos', value: '450+' },
          { label: 'Gravity Anchors', value: 'Grade V' },
          { label: 'Shield Capacity', value: '12,000 HP' }
        ]
      },
      'FACTION REWARDS': {
        id: 'faction-rewards',
        title: 'The High-Aether Holographics',
        tagline: 'Unlocking cosmetic banners that project hard-light trophies.',
        description: 'Echelon tournaments reward victorious clans with high-prestige vanity items. Banners of light can be deployed dynamically across active arenas, projecting royal crests and hard-light holographic victory arches.',
        details: [
          'Cosmetics integrate seamlessly with the standard HUD of other match pilots.',
          'Aura effects alter the color of the character’s thruster fire and neon highlights.',
          'Reaching Rank 1 unlocks the "Seraph Wing" thruster plume.'
        ],
        imagePrompt: 'A glowing futuristic trophy floating above a marble pedestal projecting a brilliant blue holographic angel-mech with glowing sword, elegant cyber-knighthood reward.',
        stats: [
          { label: 'Aura Types', value: '14 Cosmic' },
          { label: 'Hard-Light Badges', value: '88' },
          { label: 'Prestige Level', value: 'MAX' }
        ]
      },
      'LIVE EVENTS': {
        id: 'live-events',
        title: 'Dawn of the Rift-Beast',
        tagline: 'A community raid boss match where the cloud city collapses.',
        description: 'A limited-time battle where a gigantic dimensional rift tears open the skies of Echelon. Thousands of fighters must band together to suppress a titan mechanical beast of prehistoric core origin before it drains the city’s floating thrusters.',
        details: [
          'Features a 100-player co-op raid battle on a degrading arena platform.',
          'Requires coordinated javelin harpoon shots to anchor the boss mecha.',
          'Success grants exclusive Rift-Skin composite armor coatings.'
        ],
        imagePrompt: 'A massive metallic storm dragon emerging from a glowing purple rip in the dark blue sky, targeting high towering sky-scrapers of a futuristic white cloud city.',
        stats: [
          { label: 'Scale Rank', value: 'TITAN' },
          { label: 'Co-op Limit', value: '100 Pilots' },
          { label: 'Time Remaining', value: '12 Hours' }
        ]
      }
    }
  }
};
