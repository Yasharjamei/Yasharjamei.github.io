/** Site content. Edit here — components read from this file only. */

export const site = {
  name: "Yashar Jamei",
  mark: "YASHAR JAMEI",
  role: "GIS / Spatial Intelligence / Strategic Planning",
  title: "Yashar Jamei — Spatial Intelligence Portfolio",
  description:
    "GIS, spatial analysis, data and urban planning. Turning spatial data into strategic insight.",
  email: "yashar.jamei@gmail.com",
  github: "https://github.com/Yasharjamei",
  linkedin: "https://www.linkedin.com/in/yjamei",
};

export const nav = [
  { id: "about", label: "About" },
  { id: "process", label: "Process" },
  { id: "work", label: "Work" },
  { id: "roadmap", label: "Roadmap" },
  { id: "capabilities", label: "Skills" },
  { id: "research", label: "Research" },
  { id: "play", label: "Play" },
  { id: "contact", label: "Contact" },
];

export const marquee = [
  "Spatial reasoning",
  "Evidence-based planning",
  "Data integrity",
  "Decision support",
  "Imperfect data, clear answers",
];

export const process = [
  { n: "01", title: "Understand", body: "Define the problem, audience and decision." },
  { n: "02", title: "Integrate", body: "Bring together spatial, operational and contextual data." },
  { n: "03", title: "Analyse", body: "Apply GIS, statistics, modelling and analytical reasoning." },
  { n: "04", title: "Visualise", body: "Translate complexity into maps, dashboards and clear views." },
  { n: "05", title: "Interpret", body: "Find patterns, relationships, risks and opportunities." },
  { n: "06", title: "Inform", body: "Turn evidence into advice that supports planning and decisions." },
];

export interface Project {
  slug: string;
  category: string;
  title: string;
  summary: string;
  liveUrl?: string;
  context: string;
  challenge: string;
  data: string;
  approach: string;
  outputs: string;
  insight: string;
  methodology: string[];
  tools: string[];
}

export const work: Project[] = [
  {
    slug: "infrastructure-pipeline-intelligence",
    category: "Business Intelligence",
    title: "Infrastructure Pipeline Intelligence",
    summary:
      "A spatial decision-support view for long-term infrastructure planning and capital works visibility.",
    context:
      "Local government infrastructure planning, with spatial, financial and project information needing to be understood together.",
    challenge:
      "Fragmented data made it difficult to see program scale, funding sources, ownership, delivery timing and priority areas in one reliable view.",
    data: "Project pipeline records, spatial assets, program hierarchy, financial year, funding source, delivery status and project owner attributes.",
    approach:
      "Integrated multiple datasets, designed filters for decision pathways, structured the dashboard around planning questions and surfaced key financial and spatial patterns.",
    outputs:
      "Interactive map, funding charts, program filters, project search, budget summaries and scenario tabs.",
    insight:
      "Infrastructure planning becomes stronger when project data is treated as an intelligence system, not a static list.",
    methodology: ["Data audit", "Cleaning", "Spatial join", "Model", "Dashboard", "Insight"],
    tools: ["Power BI", "ArcGIS Online", "SQL", "Power Automate", "Fulcrum"],
  },
  {
    slug: "urban-heat-climate-vulnerability",
    category: "Research",
    title: "Urban Heat and Climate Vulnerability",
    summary:
      "A climate resilience dashboard translating land surface temperature and vulnerability into place-based insight.",
    context: "Applied urban climate analytics for planning, greening and public health conversations.",
    challenge:
      "Heat risk is spatially uneven and shaped by vegetation, density, built form and vulnerable populations.",
    data: "Land surface temperature, relative surface temperature, vegetation, built-up areas, demographic vulnerability and suburb boundaries.",
    approach:
      "Processed spatial layers, classified heat exposure, interpreted vulnerability drivers and presented the evidence through map-based storytelling.",
    outputs:
      "Heat maps, vulnerability layers, explanatory panels, filters and priority area visualisations.",
    insight:
      "Climate risk analysis is most useful when it connects environmental exposure with people and place.",
    methodology: ["Remote sensing", "Index design", "Overlay", "Classification", "Map narrative"],
    tools: ["ArcGIS Pro", "QGIS", "Python", "Remote Sensing"],
  },
  {
    slug: "twenty-minute-neighbourhood-access",
    category: "Strategic Planning",
    title: "20-Minute Neighbourhood Access",
    summary:
      "Walkability and access analysis for residential parcels, activity centres and community infrastructure.",
    context: "Neighbourhood planning and service access assessment.",
    challenge:
      "Decision-makers needed to understand which residential areas had strong or weak access to daily needs.",
    data: "Residential parcels, activity centres, schools, parks, health facilities, bus stops, train stations and community infrastructure.",
    approach:
      "Used catchment and distance logic to compare access by suburb and infrastructure type.",
    outputs:
      "Access maps, average distance metrics, within/outside threshold summaries and facility-type views.",
    insight:
      "Accessibility evidence helps shift planning conversations from general aspiration to specific place-based gaps.",
    methodology: ["Define threshold", "Network/catchment", "Compare", "Visualise", "Prioritise"],
    tools: ["ArcGIS Pro", "QGIS", "Power BI"],
  },
  {
    slug: "open-space-function-catchment",
    category: "Urban Planning",
    title: "Open Space Function & Catchment",
    summary: "Spatial analysis of open space function, quantity, catchment and walkability.",
    context: "Open space planning and community infrastructure evidence.",
    challenge:
      "Open space supply needs to be understood by function, access and distribution, not only total area.",
    data: "Open space assets, primary function, residential catchments, suburbs, wards and walkability indicators.",
    approach:
      "Classified assets, calculated spatial distribution and designed comparative views for selected suburbs and whole municipality context.",
    outputs: "Function maps, pie charts, catchment views, filters and thematic summaries.",
    insight:
      "Open space planning benefits from separating quantity, access and function because each tells a different planning story.",
    methodology: ["Classify", "Catchment", "Summarise", "Compare", "Brief"],
    tools: ["ArcGIS Pro", "QGIS", "Power BI"],
  },
  {
    slug: "canopy-coverage-greening-projection",
    category: "Geospatial Analytics",
    title: "Canopy Coverage & Greening Projection",
    summary:
      "Canopy coverage and projection analysis across road reserves, open space and urban greening contexts.",
    context: "Urban forest, climate resilience and heat mitigation analysis.",
    challenge:
      "Greening investment needs evidence on where canopy exists, where it is missing and where future opportunity may be strongest.",
    data: "Canopy layers, road reserve geometry, open space boundaries, imagery-derived features and administrative boundaries.",
    approach:
      "Calculated coverage patterns, compared spatial units and framed canopy projection as a decision-support problem.",
    outputs:
      "Canopy maps, projection views, road reserve analysis and priority area interpretation.",
    insight:
      "Canopy analytics is most valuable when it links environmental benefit with implementable spatial opportunity.",
    methodology: ["Extract", "Overlay", "Measure", "Project", "Prioritise"],
    tools: ["ArcGIS Pro", "QGIS", "Python", "Remote Sensing"],
  },
  {
    slug: "road-management-spatial-dashboard",
    category: "GIS",
    title: "Road Management Spatial Dashboard",
    summary:
      "A live operational spatial dashboard connecting field datasets and road management layers.",
    context: "Operational local government analytics where field data and spatial visibility matter.",
    challenge:
      "Operational teams need current, searchable and map-based views of road closures, traffic impacts and civil works activity.",
    data: "Fulcrum field records, road assets, traffic impact categories, closure records, project layers and date filters.",
    approach:
      "Connected operational datasets to a map interface with filters, layers, active/past project logic and category symbology.",
    outputs: "Live map, timeline filters, operational layers, search and traffic impact visualisation.",
    insight:
      "Operational spatial intelligence reduces friction between field activity, asset management and decision-making.",
    methodology: ["Connect", "Validate", "Filter", "Layer", "Monitor"],
    tools: ["Fulcrum", "ArcGIS Online", "Power BI", "Mapbox"],
  },
  {
    slug: "fees-bonds-status-intelligence",
    category: "Data & Insights",
    title: "Fees & Bonds Status Intelligence",
    summary:
      "Financial and spatial search dashboard for fees, bonds, estates and received/returned status.",
    context: "Local government financial and development-related obligation tracking.",
    challenge:
      "Teams needed a clearer way to search, reconcile and interpret fees and bonds across estates and identifiers.",
    data: "Estate names, stage IDs, Fulcrum IDs, fee categories, bond types, amounts, received dates and returned status.",
    approach:
      "Structured financial categories, built searchable identifiers and combined map context with status cards.",
    outputs: "Map, fee table, bond cards, search controls and status summaries.",
    insight:
      "Financial dashboards are stronger when identifiers, status and location are visible together.",
    methodology: ["Reconcile", "Index", "Map", "Search", "Report"],
    tools: ["Power BI", "Excel", "Fulcrum", "Mapbox"],
  },
  {
    slug: "transport-accessibility-luptai",
    category: "Spatial Analysis",
    title: "Transport Accessibility & LUPTAI",
    summary: "Transport accessibility analysis using route coverage, stops and LUPTAI-style scoring.",
    context: "Public transport access and service equity analysis.",
    challenge:
      "Route changes and service gaps need to be assessed spatially, not only described by route lists.",
    data: "Bus routes, stops, route directness, frequency, points of interest, residential areas and accessibility score components.",
    approach:
      "Mapped routes, scored access, compared existing and proposed scenarios and visualised spatial gaps.",
    outputs: "Accessibility maps, score categories, route overlays and proposed scenario views.",
    insight:
      "Accessibility indexes are useful when their inputs are transparent enough for planners to trust and discuss.",
    methodology: ["Prepare routes", "Score", "Classify", "Compare", "Explain"],
    tools: ["Power BI", "GIS", "SQL", "Mapbox"],
  },
  {
    slug: "budget-melton-capital-works-explorer",
    category: "Business Intelligence",
    title: "Budget Melton Capital Works Explorer",
    summary:
      "A public-facing capital works program website for exploring projects by suburb, ward, category, status and financial chart views.",
    liveUrl: "https://budget.melton.vic.gov.au/",
    context:
      "Public local government communication and capital works transparency. The live site presents a Capital Works Program with suburb and ward filters, category navigation, project details, status and financial chart areas.",
    challenge:
      "Capital works programs are complex for residents to understand because projects differ by location, category, status, funding profile and timing.",
    data: "Capital works project records, suburb and ward fields, project categories such as transport, parks/reserve, recreation facilities and building/structure, status fields, map clusters and financial chart information.",
    approach:
      "Designed the project as a public exploration experience: filters first, category navigation, selected-project detail, financial chart visibility and plain-language update disclaimers.",
    outputs:
      "Public web interface, suburb/ward filters, category buttons, map clusters, project description panel, status information and financial chart view.",
    insight:
      "Public transparency improves when capital works information is spatial, searchable and understandable rather than hidden inside static budget documents.",
    methodology: ["Structure data", "Filter", "Categorise", "Map context", "Publish", "Explain"],
    tools: ["Web GIS", "Data Visualisation", "Capital Works Data", "Public Dashboard"],
  },
  {
    slug: "local-government-data-integrity",
    category: "Data & Insights",
    title: "Local Government Data Integrity",
    summary: "A data validation and reconciliation case for improving confidence before reporting.",
    context:
      "Local government reporting where multiple datasets need to align before outputs can be trusted.",
    challenge:
      "Small inconsistencies between spreadsheets, field systems and spatial records can undermine executive reporting.",
    data: "Excel extracts, project IDs, financial fields, spatial identifiers, status fields and operational records.",
    approach:
      "Compared records, matched identifiers, isolated discrepancies and created a repeatable validation logic.",
    outputs: "Exception lists, reconciliation checks, data quality notes and decision-ready clean records.",
    insight:
      "Good analysis starts before visualisation: trust is built through reconciliation, definitions and quality checks.",
    methodology: ["Extract", "VLOOKUP", "INDEX-MATCH", "Validate", "Resolve", "Report"],
    tools: ["Excel", "Power Query", "SQL", "Power BI"],
  },
];

export const capabilities = [
  {
    group: "Spatial",
    items: ["GIS", "Spatial Analysis", "Remote Sensing", "Cartography", "Spatial Statistics"],
  },
  {
    group: "Data",
    items: ["Data Cleaning", "Integration", "Validation", "Business Intelligence", "Dashboards"],
  },
  {
    group: "Strategy",
    items: ["Strategic Planning", "Urban Planning", "Decision Support", "Evidence-Based Planning"],
  },
  {
    group: "Technology",
    items: ["ArcGIS Pro", "QGIS", "Python", "SQL", "Power BI", "Excel"],
  },
];

/** Career timeline, drawn from the CV. */
export const roadmap = [
  {
    year: "2013",
    body: "Completed a Bachelor of Urban Planning at the University of Mazandaran — the start of a consistent interest in how places are structured and why they work the way they do.",
    tags: ["Urban Planning"],
  },
  {
    year: "2016",
    body: "Finished a Master of Regional Planning at the University of Tehran, moving from site-scale questions to regional systems and the evidence needed to plan them.",
    tags: ["Regional Planning", "Spatial Analysis"],
  },
  {
    year: "2018",
    body: "Began designing and teaching GIS and spatial analysis within Building and Urban Design courses at Victoria University — five years of building curriculum that made spatial tools usable by students with no prior GIS background.",
    tags: ["QGIS", "Curriculum Design", "Teaching"],
  },
  {
    year: "2019",
    body: "Published a time-series dataset linking land surface temperature, vegetation and built-up areas across the top 20 global cities in Data in Brief — groundwork for the urban heat research that followed.",
    tags: ["Remote Sensing", "Urban Climate", "Open Data"],
  },
  {
    year: "2021",
    body: "Research Fellow and Geospatial Scientist at Deakin University and the Office of Planetary Observations. Built machine learning classifiers in Python to automate land cover analysis from satellite imagery, supporting urban heat island and renewable energy siting research.",
    tags: ["Python", "Machine Learning", "Satellite Imagery", "ArcGIS"],
  },
  {
    year: "2022",
    body: "Awarded a PhD in Built Environment at RMIT University, combining GIS, remote sensing and spatial statistical modelling. The research now sits near 1,000 citations.",
    tags: ["GIS", "Remote Sensing", "Spatial Statistics"],
  },
  {
    year: "2023",
    body: "Moved into practice. Validated planning and cadastral data at Macedon Ranges Shire Council, built interactive zoning web maps at Echelon Planning, then joined Melton City Council as Planning Integration and Innovation Specialist on the Long-Term Infrastructure Pipeline.",
    tags: ["IntraMaps", "QGIS", "Fulcrum", "ArcGIS Online"],
  },
  {
    year: "2024",
    body: "Built and maintained the geodatabase and data pipeline behind Council's infrastructure planning — connecting Fulcrum field collection, ArcGIS Online and Power BI so engineering, planning and finance work from one reliable set of spatial information.",
    tags: ["Power BI", "Geodatabase", "Power Automate", "SQL"],
  },
  {
    year: "2025",
    body: "Extended the work into spatial prioritisation: a model combining demographic, spatial and cost data to rank capital works for budget submission, alongside public-facing capital works transparency and accessibility scoring.",
    tags: ["Multi-Criteria Analysis", "Web GIS", "FME", "Python"],
  },
  {
    year: "2026",
    body: "Co-authored a triadic integration framework for electric vehicle, land-use and urban-development policy in New South Wales, published in the Journal of Urban Intelligence and Smart Systems.",
    tags: ["Policy Analysis", "Text Mining", "Land Use"],
  },
];

/** Ordered newest first. */
export const research = [
  {
    title: "Charging Ahead or Charging Alone?",
    body: "A triadic integration framework for electric vehicle, land-use and urban-development policy in New South Wales, Australia.",
    url: "https://juiss.org/index.php/juiss/article/view/329",
    journal: "Journal of Urban Intelligence and Smart Systems",
    year: "2026",
  },
  {
    title: "COVID, Urban Climate and Energy",
    body: "Applied analysis connecting urban climate, air quality, land surface temperature and activity patterns.",
    url: "https://www.sciencedirect.com/science/article/pii/S2211467X22001572",
    journal: "Energy Strategy Reviews",
    year: "2022",
  },
  {
    title: "LULC Change and Land Surface Temperature",
    body: "Remote sensing and spatial modelling of land-use/land-cover change and temperature impacts.",
    url: "https://www.mdpi.com/2071-1050/14/22/14868",
    journal: "Sustainability (MDPI)",
    year: "2022",
  },
  {
    title: "Global Urban Climate Dataset",
    body: "Time-series dataset linking land surface temperature, vegetation, built-up areas and climatic factors across global cities.",
    url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC6660608/",
    journal: "Data in Brief",
    year: "2019",
  },
  {
    title: "Melbourne Surface Urban Heat Island",
    body: "Research connecting vegetation, built-up areas and land surface temperature patterns in Melbourne.",
    url: "https://www.sciencedirect.com/science/article/abs/pii/S0048969718351854",
    journal: "Science of The Total Environment",
    year: "2019",
  },
  {
    title: "Urban Geometry, Greening and Thermal Comfort",
    body: "Review evidence on how urban geometry and pedestrian-level greening influence outdoor thermal comfort.",
    url: "https://www.sciencedirect.com/science/article/abs/pii/S1364032115011831",
    journal: "Renewable and Sustainable Energy Reviews",
    year: "2016",
  },
  {
    title: "Built-Up Ratio and Air Temperature",
    body: "Evidence on how development intensity and built-up form affect air temperature in urban contexts.",
    url: "https://www.sciencedirect.com/science/article/abs/pii/S2210670714001085",
    journal: "Sustainable Cities and Society",
    year: "2015",
  },
];
