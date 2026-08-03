const licenses = [
  {
    id: 1,
    slug: "mining-refining",
    name: "Mining / Refining",
    shortName: "MiRe",
    classification: "Resource Extraction and Processing",
    status: "Active",
    summary:
      "Licensed miners and refiners responsible for extracting raw ores and converting them into usable ingots.",
    description:
      "The Mining and Refining license, commonly called MiRe, is intended for players who want to locate, extract, process, and distribute mineral resources. MiRe operators mine ores from planetary deposits, moons, asteroids, and other viable resource sites before transporting those materials back to an approved base or processing facility. Once delivered, the raw ore is refined into usable ingots that can be sold directly, stored for later collection, or prepared for delivery.",
    permittedActivities: [
      "Planetary, lunar, asteroid, and deep-space mining",
      "Ore surveying and resource deposit identification",
      "Operation of mining ships, rovers, and drilling equipment",
      "Processing raw ore into usable ingots",
      "Storage and sale of refined materials",
      "Delivery of ingots when transport capacity is available",
    ],
    responsibilities: [
      "Maintain safe mining and refining operations",
      "Avoid interfering with active registered mining claims",
      "Clearly publish available resources and pricing",
      "Keep customer orders separated and properly documented",
      "Coordinate with Logistics license holders when outside transport is required",
    ],
    services: [
      "Raw ore extraction",
      "Ore-to-ingot refining",
      "Bulk ingot sales",
      "Scheduled material pickup",
      "Optional material delivery",
    ],
    registryNotice:
      "MiRe operations may eventually support additional sub-licenses for specialized mining, refining, surveying, or resource transportation activities.",
  },
  {
    id: 2,
    slug: "logistics",
    name: "Logistics",
    shortName: "Loggy",
    classification: "Cargo and Supply Transportation",
    status: "Active",
    summary:
      "Cargo specialists who transport fuel, food, clones, ingots, building materials, and general supplies.",
    description:
      "Logistics license holders, commonly called Loggies, are the truckers and space-lane transporters of Volsung Origins. They move the goods that keep every other industrial sector functioning. Their routes may cross planetary surfaces, orbital space, asteroid fields, moons, and long-distance trade corridors. Logistics operations focus on cargo rather than passenger transportation.",
    permittedActivities: [
      "Transportation of hydrogen and other fuel resources",
      "Transportation of batteries and stored energy supplies",
      "Movement of food and agricultural products",
      "Delivery of clones and approved biological cargo",
      "Transportation of ingots and construction materials",
      "General commercial cargo hauling",
      "Scheduled and contract-based freight delivery",
    ],
    responsibilities: [
      "Maintain accurate cargo manifests",
      "Protect transported goods from damage or loss",
      "Honor agreed pickup and delivery schedules",
      "Report destroyed, stolen, or abandoned shipments",
      "Use cargo vessels appropriate for the transported materials",
    ],
    services: [
      "Ground freight transport",
      "Orbital cargo delivery",
      "Interplanetary supply runs",
      "Fuel transportation",
      "Bulk industrial hauling",
    ],
    registryNotice:
      "Logistics licenses authorize cargo transportation. Passenger-only transportation is handled through the separate Transport license.",
  },
  {
    id: 3,
    slug: "construction",
    name: "Construction",
    shortName: "Builders",
    classification: "Design and Assembly",
    status: "Active",
    summary:
      "Designers and builders responsible for producing ships, stations, buildings, rovers, and custom engineering projects.",
    description:
      "Construction license holders are the builders and envisioners of Volsung Origins. They take an idea, blueprint, or operational requirement and turn it into a functional structure or vehicle. Builders may offer existing blueprints for purchase or accept custom commissions. Custom projects may require additional planning, materials, testing, and labor, causing the final cost to increase with complexity.",
    permittedActivities: [
      "Construction of spacecraft and atmospheric vessels",
      "Construction of rovers and ground vehicles",
      "Construction of buildings and industrial facilities",
      "Assembly of player-provided blueprints",
      "Sale of pre-designed blueprint packages",
      "Design and completion of custom engineering orders",
      "Repair, expansion, and modification of existing builds",
    ],
    responsibilities: [
      "Provide clear project estimates before construction begins",
      "Document customer-requested features and revisions",
      "Disclose material requirements and additional costs",
      "Test major systems before final delivery",
      "Avoid unauthorized duplication of privately commissioned designs",
    ],
    services: [
      "Blueprint sales",
      "Ship construction",
      "Rover construction",
      "Facility construction",
      "Custom engineering commissions",
    ],
    registryNotice:
      "Custom orders may cost significantly more than standard blueprint builds depending on size, complexity, armament, automation, and required testing.",
  },
  {
    id: 4,
    slug: "farming",
    name: "Farming",
    shortName: "Land Jacks",
    classification: "Agriculture and Food Production",
    status: "Active",
    summary:
      "Agricultural specialists who grow, process, and distribute food products throughout the registry.",
    description:
      "Farming license holders, known as Land Jacks, produce the food and biological resources required to sustain the population of Volsung Origins. They cultivate available crops, maintain growing facilities, harvest agricultural products, and process raw food resources into edible or usable forms.",
    permittedActivities: [
      "Cultivation of approved food crops",
      "Operation of farms and controlled growing facilities",
      "Harvesting of agricultural resources",
      "Processing raw crops into edible food products",
      "Storage and commercial sale of food supplies",
      "Premium transportation of food products",
    ],
    responsibilities: [
      "Maintain stable food production environments",
      "Protect food supplies from contamination or loss",
      "Clearly identify available food products and quantities",
      "Fulfill accepted food supply agreements",
      "Coordinate refrigerated or specialized transport when required",
    ],
    services: [
      "Crop production",
      "Food processing",
      "Bulk food sales",
      "Agricultural supply contracts",
      "Premium food delivery",
    ],
    registryNotice:
      "Food delivery may be provided directly by the Farming license holder at a premium or assigned to an available Logistics operator.",
  },
  {
    id: 5,
    slug: "salvaging",
    name: "Salvaging",
    shortName: "Repo",
    classification: "Recovery and Reclamation",
    status: "Active",
    summary:
      "Recovery specialists who dismantle derelicts, wrecks, and abandoned structures into reusable materials.",
    description:
      "Salvaging license holders, commonly called Repos, specialize in breaking down wreckage and abandoned assets into usable components and raw materials. Whether the target is a destroyed ship, damaged rover, derelict station, or abandoned industrial structure, Repo operators recover whatever value remains.",
    permittedActivities: [
      "Dismantling wrecked or disabled spacecraft",
      "Recovery of abandoned rovers and vehicles",
      "Deconstruction of derelict facilities",
      "Reclamation of reusable components",
      "Collection of scrap and recoverable materials",
      "Cleanup of approved wreck sites",
      "Transportation of salvaged materials for an added fee",
    ],
    responsibilities: [
      "Verify that a target is eligible for salvage",
      "Respect active ownership and recovery claims",
      "Document valuable or restricted recovered items",
      "Avoid dismantling occupied or active structures",
      "Coordinate transportation when recovered materials exceed available capacity",
    ],
    services: [
      "Wreck dismantling",
      "Derelict cleanup",
      "Component recovery",
      "Scrap reclamation",
      "Premium salvage transportation",
    ],
    registryNotice:
      "Salvage rights should be confirmed before dismantling begins. Active ownership claims take priority over unapproved recovery operations.",
  },
  {
    id: 6,
    slug: "manufacturing",
    name: "Manufacturing",
    shortName: "Manufacturing",
    classification: "Industrial Production",
    status: "Active",
    summary:
      "Factory operators who convert refined ingots into components, building materials, and industrial supplies.",
    description:
      "Manufacturing license holders are the factory-line workers of the Volsung economy. They take refined ingots supplied by miners, customers, or commercial partners and convert them into components and building materials. With large assemblers, extensive production lines, and high-capacity cargo storage, manufacturers support projects of every scale.",
    permittedActivities: [
      "Production of construction components",
      "Manufacturing of ship and rover parts",
      "Assembly of industrial equipment",
      "Operation of large-scale assembler facilities",
      "Storage and sale of manufactured goods",
      "Completion of bulk production orders",
      "Premium transportation of completed orders",
    ],
    responsibilities: [
      "Clearly document customer material requirements",
      "Maintain organized production queues",
      "Protect customer-provided ingots",
      "Confirm quantities before completing large orders",
      "Coordinate transport for orders requiring outside delivery",
    ],
    services: [
      "Component manufacturing",
      "Building material production",
      "Bulk industrial orders",
      "Customer-supplied material processing",
      "Premium product delivery",
    ],
    registryNotice:
      "Manufacturing focuses on component production. Complete ships, rovers, and facilities are generally handled by Construction license holders.",
  },
  {
    id: 7,
    slug: "transport",
    name: "Transport",
    shortName: "Taxis",
    classification: "Passenger Transportation",
    status: "Active",
    summary:
      "Passenger transport specialists responsible for safely moving people and clones across ground, air, and space routes.",
    description:
      "Transport license holders, commonly called Taxis, specialize in moving people rather than cargo. They operate passenger-capable vehicles across planetary surfaces, atmospheric routes, orbital space, moons, asteroids, and distant installations. When someone needs to leave a planet quickly or reach a remote iceteroid, the Taxis are the operators to call.",
    permittedActivities: [
      "Ground transportation of passengers",
      "Atmospheric passenger flights",
      "Orbital and interplanetary passenger transportation",
      "Clone transportation",
      "Emergency evacuation services",
      "Scheduled shuttle routes",
      "Private passenger charters",
    ],
    responsibilities: [
      "Use vehicles equipped for safe passenger transport",
      "Clearly communicate route risks and estimated travel time",
      "Protect passengers during transit",
      "Maintain adequate fuel and life-support reserves",
      "Avoid carrying commercial cargo beyond personal passenger allowances",
    ],
    services: [
      "Ground taxi service",
      "Orbital shuttle service",
      "Interplanetary travel",
      "Clone transport",
      "Emergency evacuation",
    ],
    registryNotice:
      "Transport license holders may move passengers and clones but are not authorized to operate as commercial cargo haulers.",
  },
  {
    id: 8,
    slug: "security",
    name: "Security",
    shortName: "PewPews",
    classification: "Combat and Protection",
    status: "Active",
    summary:
      "Combat specialists available for protection, escort, defensive operations, and contracted retaliation.",
    description:
      "Security license holders, informally known as PewPews, specialize in ground and space combat. They may be hired to protect personnel, escort valuable shipments, defend industrial sites, respond to hostile threats, or support players who lack the equipment or experience needed to fight back.",
    permittedActivities: [
      "Ground-based combat operations",
      "Space combat and ship-to-ship engagements",
      "Convoy and cargo escort",
      "Protection of industrial facilities",
      "Defensive patrols",
      "Emergency combat response",
      "Contracted retaliation within server rules",
    ],
    responsibilities: [
      "Operate within established server combat rules",
      "Clearly document accepted contracts",
      "Avoid unauthorized aggression against neutral parties",
      "Protect contracted personnel and assets",
      "Report major engagements and unresolved disputes",
    ],
    services: [
      "Armed escort",
      "Facility defense",
      "Ground combat support",
      "Space combat support",
      "Threat response contracts",
    ],
    registryNotice:
      "Security contracts do not override server rules. Unauthorized aggression, griefing, or indiscriminate attacks remain prohibited.",
  },
  {
    id: 9,
    slug: "free-lance",
    name: "Free Lance",
    shortName: "Temps",
    classification: "General Contract Labor",
    status: "Active",
    summary:
      "Flexible temporary workers available to assist with a wide range of short-term jobs and industrial needs.",
    description:
      "Free Lance license holders, commonly called Temps, are the jack-of-all-trades workers of Volsung Origins. They may not specialize in a single industrial discipline, but they can provide temporary labor and general assistance to individuals or factions that need additional hands.",
    permittedActivities: [
      "Temporary mining assistance",
      "General construction labor",
      "Cargo loading and unloading",
      "Basic repair and maintenance support",
      "Agricultural labor",
      "Salvage assistance",
      "Short-term crew assignments",
      "Other approved general contract work",
    ],
    responsibilities: [
      "Clearly communicate relevant skills and limitations",
      "Follow the instructions of the contracting party",
      "Avoid independently performing restricted specialist work",
      "Respect customer property and confidential projects",
      "Complete accepted assignments in good faith",
    ],
    services: [
      "Temporary industrial labor",
      "Additional ship crew",
      "Project assistance",
      "Loading and unloading support",
      "General contract work",
    ],
    registryNotice:
      "Free Lance workers may assist licensed operators but should not independently perform work that requires a specialized license.",
  },
]

export function getLicenseBySlug(slug) {
  return licenses.find((license) => license.slug === slug)
}

export default licenses