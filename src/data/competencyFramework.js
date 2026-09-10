// Official Competency Framework for India's Official Statistical System (MoSPI - DIID & NSSTA)
// Structured across 4 Core Domains and 24 Sub-competencies aligned with iGOT Karmayogi FRAC

export const DOMAINS = {
  STATISTICAL: 'statistical',
  TECHNICAL: 'technical',
  DIGITAL_GOVERNANCE: 'digital_governance',
  BEHAVIOURAL: 'behavioural'
};

export const DOMAIN_METADATA = {
  [DOMAINS.STATISTICAL]: {
    id: DOMAINS.STATISTICAL,
    title: 'Statistical Competencies',
    shortTitle: 'Statistical',
    color: '#FF671F', // India Saffron
    bgLight: 'rgba(255, 103, 31, 0.1)',
    border: 'rgba(255, 103, 31, 0.3)',
    description: 'Core statistical methodologies, survey designs, macroeconomic aggregates, and official data quality frameworks.'
  },
  [DOMAINS.TECHNICAL]: {
    id: DOMAINS.TECHNICAL,
    title: 'Technical & Analytical Competencies',
    shortTitle: 'Technical & AI',
    color: '#2563EB', // Tech Blue
    bgLight: 'rgba(37, 99, 235, 0.1)',
    border: 'rgba(37, 99, 235, 0.3)',
    description: 'Modern programming languages, data science, GIS, machine learning, and statistical computing tools.'
  },
  [DOMAINS.DIGITAL_GOVERNANCE]: {
    id: DOMAINS.DIGITAL_GOVERNANCE,
    title: 'Digital Governance & Public Infrastructure',
    shortTitle: 'Digital Gov & DPI',
    color: '#059669', // Emerald Green
    bgLight: 'rgba(5, 150, 105, 0.1)',
    border: 'rgba(5, 150, 105, 0.3)',
    description: 'Cybersecurity, DPDP Act compliance, cloud platforms (MeghRaj), open data dissemination, and digital public infrastructure.'
  },
  [DOMAINS.BEHAVIOURAL]: {
    id: DOMAINS.BEHAVIOURAL,
    title: 'Behavioural & Managerial Competencies',
    shortTitle: 'Managerial & Ethics',
    color: '#8B5CF6', // Purple / Leadership
    bgLight: 'rgba(139, 92, 246, 0.1)',
    border: 'rgba(139, 92, 246, 0.3)',
    description: 'Leadership, ethical civil service conduct, project management, evidence-based policy briefing, and change management.'
  }
};

export const PROFICIENCY_LEVELS = [
  { level: 1, label: 'Novice / Beginner', shortLabel: 'L1: Novice', desc: 'Basic conceptual awareness, requires constant guidance.' },
  { level: 2, label: 'Basic Practitioner', shortLabel: 'L2: Basic', desc: 'Can execute standard tasks following standard operating procedures.' },
  { level: 3, label: 'Intermediate Competent', shortLabel: 'L3: Intermediate', desc: 'Independent practitioner capable of solving non-routine field/analytical challenges.' },
  { level: 4, label: 'Advanced Specialist', shortLabel: 'L4: Advanced', desc: 'Subject matter expert capable of designing methodologies and guiding others.' },
  { level: 5, label: 'Master / Policy Lead', shortLabel: 'L5: Expert', desc: 'National/international expert driving policy, reforms, and strategic statistical architecture.' }
];

export const COMPETENCIES = [
  // --- STATISTICAL COMPETENCIES ---
  {
    id: 'stat_survey_sampling',
    domain: DOMAINS.STATISTICAL,
    name: 'Survey Design & Sampling Theory',
    shortName: 'Survey & Sampling',
    description: 'Stratified multi-stage sampling, PPSWR/PPSWOR, sample allocation, household listing, and weight calibration used in NSS/PLFS.',
    benchmark: { jso: 3, sso: 4, asst_dir: 4, dep_dir: 5, data_officer: 2 }
  },
  {
    id: 'stat_national_accounts',
    domain: DOMAINS.STATISTICAL,
    name: 'National Accounts & Macroeconomic Aggregates',
    shortName: 'National Accounts (SNA)',
    description: 'Compilation of GDP, GVA at basic prices, Supply and Use Tables (SUT), Capital Formation, and System of National Accounts (SNA 2008).',
    benchmark: { jso: 2, sso: 3, asst_dir: 4, dep_dir: 5, data_officer: 2 }
  },
  {
    id: 'stat_price_statistics',
    domain: DOMAINS.STATISTICAL,
    name: 'Price Statistics & Index Numbers',
    shortName: 'Price & Indices (CPI/IIP)',
    description: 'Methodology of Consumer Price Index (CPI), Index of Industrial Production (IIP), Wholesale Price Index (WPI), and base year revision.',
    benchmark: { jso: 3, sso: 4, asst_dir: 4, dep_dir: 4, data_officer: 2 }
  },
  {
    id: 'stat_labour_statistics',
    domain: DOMAINS.STATISTICAL,
    name: 'Labour & Employment Statistics (PLFS)',
    shortName: 'Labour Statistics (PLFS)',
    description: 'Periodic Labour Force Survey methodologies, Usual Status (ps+ss), Current Weekly Status (CWS), LFPR, WPR, and unemployment rates.',
    benchmark: { jso: 4, sso: 4, asst_dir: 4, dep_dir: 5, data_officer: 2 }
  },
  {
    id: 'stat_industrial_stats',
    domain: DOMAINS.STATISTICAL,
    name: 'Industrial Statistics & Annual Survey of Industries',
    shortName: 'Industrial Stats (ASI)',
    description: 'Annual Survey of Industries (ASI), National Industrial Classification (NIC), factory sector accounting, gross output and value added.',
    benchmark: { jso: 3, sso: 4, asst_dir: 4, dep_dir: 4, data_officer: 2 }
  },
  {
    id: 'stat_sdg_indicators',
    domain: DOMAINS.STATISTICAL,
    name: 'SDG Indicators & National Indicator Framework',
    shortName: 'SDG & NIF Tracking',
    description: 'Monitoring Sustainable Development Goals through India’s National Indicator Framework (NIF), metadata guidelines, and data disaggregation.',
    benchmark: { jso: 2, sso: 3, asst_dir: 4, dep_dir: 5, data_officer: 3 }
  },
  {
    id: 'stat_data_quality',
    domain: DOMAINS.STATISTICAL,
    name: 'Data Quality Assurance Framework (DQAF) & SDMX',
    shortName: 'DQAF & SDMX Standards',
    description: 'Statistical Data and Metadata Exchange (SDMX), MoSPI Data Quality Assurance Framework, sampling and non-sampling error handling.',
    benchmark: { jso: 2, sso: 3, asst_dir: 4, dep_dir: 5, data_officer: 4 }
  },

  // --- TECHNICAL & ANALYTICAL COMPETENCIES ---
  {
    id: 'tech_python_stats',
    domain: DOMAINS.TECHNICAL,
    name: 'Python for Statistical Computing & Big Data',
    shortName: 'Python for Statistics',
    description: 'Pandas, NumPy, SciPy, Statsmodels for large-scale microdata processing, unit-record validation, and automated reporting.',
    benchmark: { jso: 2, sso: 3, asst_dir: 4, dep_dir: 3, data_officer: 5 }
  },
  {
    id: 'tech_r_econometrics',
    domain: DOMAINS.TECHNICAL,
    name: 'R Programming & Applied Econometrics',
    shortName: 'R & Econometrics',
    description: 'Complex survey data analysis with `survey` package, time-series forecasting (ARIMA/ETS), panel data regressions, and ggplot2.',
    benchmark: { jso: 2, sso: 3, asst_dir: 4, dep_dir: 3, data_officer: 4 }
  },
  {
    id: 'tech_sql_databases',
    domain: DOMAINS.TECHNICAL,
    name: 'SQL & Relational Database Architecture',
    shortName: 'SQL & Databases',
    description: 'Querying enterprise data warehouses, PostgreSQL, indexing, multi-table joins, ETL pipelines for census and survey microdata.',
    benchmark: { jso: 2, sso: 3, asst_dir: 3, dep_dir: 3, data_officer: 5 }
  },
  {
    id: 'tech_gis_spatial',
    domain: DOMAINS.TECHNICAL,
    name: 'GIS & Spatial Analytics for Surveys (QGIS)',
    shortName: 'GIS & Spatial Analytics',
    description: 'Geospatial mapping of Primary Sampling Units (PSUs), shapefile manipulation, satellite remote sensing for agricultural estimates, and QGIS.',
    benchmark: { jso: 2, sso: 3, asst_dir: 3, dep_dir: 3, data_officer: 4 }
  },
  {
    id: 'tech_data_viz',
    domain: DOMAINS.TECHNICAL,
    name: 'Data Visualization & Interactive Dashboards',
    shortName: 'Data Viz & BI Dashboards',
    description: 'Designing executive MoSPI dashboards using Power BI, Tableau, D3.js, and storytelling with official statistics.',
    benchmark: { jso: 2, sso: 3, asst_dir: 4, dep_dir: 4, data_officer: 5 }
  },
  {
    id: 'tech_ai_ml',
    domain: DOMAINS.TECHNICAL,
    name: 'Artificial Intelligence & Machine Learning in Surveys',
    shortName: 'AI & Machine Learning',
    description: 'Automated text coding (NIC/NCO classification via NLP), imputation of missing survey responses, anomaly detection in economic returns.',
    benchmark: { jso: 1, sso: 2, asst_dir: 3, dep_dir: 4, data_officer: 5 }
  },
  {
    id: 'tech_cloud_apis',
    domain: DOMAINS.TECHNICAL,
    name: 'Cloud Computing, Microservices & Open Data APIs',
    shortName: 'Cloud & Microdata APIs',
    description: 'Disseminating microdata via RESTful APIs, data lakehouses, MeghRaj cloud containerization, and data anonymization algorithms.',
    benchmark: { jso: 1, sso: 2, asst_dir: 3, dep_dir: 3, data_officer: 5 }
  },

  // --- DIGITAL GOVERNANCE & DPI ---
  {
    id: 'gov_cybersecurity',
    domain: DOMAINS.DIGITAL_GOVERNANCE,
    name: 'Government Cybersecurity & CERT-In Guidelines',
    shortName: 'Cybersecurity & Audits',
    description: 'Securing government statistical servers, two-factor authentication, incident reporting under CERT-In, and safe CAPI tablet handling.',
    benchmark: { jso: 2, sso: 3, asst_dir: 3, dep_dir: 4, data_officer: 4 }
  },
  {
    id: 'gov_data_privacy',
    domain: DOMAINS.DIGITAL_GOVERNANCE,
    name: 'Data Privacy & Digital Personal Data Protection (DPDP)',
    shortName: 'DPDP Act & Data Privacy',
    description: 'Compliance with DPDP Act 2023, Collection of Statistics Act 2008, respondent anonymity, statistical disclosure control (SDC).',
    benchmark: { jso: 3, sso: 4, asst_dir: 4, dep_dir: 5, data_officer: 4 }
  },
  {
    id: 'gov_dpi_cloud',
    domain: DOMAINS.DIGITAL_GOVERNANCE,
    name: 'Digital Public Infrastructure & MeghRaj Cloud',
    shortName: 'DPI & MeghRaj Cloud',
    description: 'Integration with India Stack, Aadhaar-based authentication, DigiLocker integration, and NIC MeghRaj Government Cloud hosting.',
    benchmark: { jso: 2, sso: 2, asst_dir: 3, dep_dir: 4, data_officer: 5 }
  },
  {
    id: 'gov_eoffice_workflows',
    domain: DOMAINS.DIGITAL_GOVERNANCE,
    name: 'e-Office, Digital Signatures & Paperless Governance',
    shortName: 'e-Office & Digital Workflows',
    description: 'Operating e-Office 7.0, digital signing (DSC), file management system (FMS), and RTI Act record management.',
    benchmark: { jso: 4, sso: 4, asst_dir: 4, dep_dir: 4, data_officer: 4 }
  },

  // --- BEHAVIOURAL & MANAGERIAL ---
  {
    id: 'mgmt_ethics_conduct',
    domain: DOMAINS.BEHAVIOURAL,
    name: 'Civil Service Conduct Rules & Statistical Ethics',
    shortName: 'Ethics & Conduct Rules',
    description: 'Central Civil Services (Conduct) Rules 1964, UN Fundamental Principles of Official Statistics, impartiality and public trust.',
    benchmark: { jso: 4, sso: 4, asst_dir: 5, dep_dir: 5, data_officer: 4 }
  },
  {
    id: 'mgmt_project_management',
    domain: DOMAINS.BEHAVIOURAL,
    name: 'Survey Project Management & Field Monitoring',
    shortName: 'Survey Project Management',
    description: 'Planning survey timelines, budget allocation, field inspection schedules, and team workload balancing across regional offices.',
    benchmark: { jso: 2, sso: 3, asst_dir: 4, dep_dir: 5, data_officer: 3 }
  },
  {
    id: 'mgmt_communication_briefs',
    domain: DOMAINS.BEHAVIOURAL,
    name: 'Evidence-based Policy Briefing & Communication',
    shortName: 'Policy Briefing & Reports',
    description: 'Translating complex statistical metrics into actionable policy briefs for NITI Aayog, Prime Minister’s Economic Advisory Council, and Parliament.',
    benchmark: { jso: 2, sso: 3, asst_dir: 4, dep_dir: 5, data_officer: 3 }
  },
  {
    id: 'mgmt_leadership_change',
    domain: DOMAINS.BEHAVIOURAL,
    name: 'Strategic Leadership & Change Management',
    shortName: 'Strategic Leadership',
    description: 'Leading digital transformation initiatives, motivating regional statistical cadres, and fostering a culture of innovation.',
    benchmark: { jso: 1, sso: 2, asst_dir: 3, dep_dir: 5, data_officer: 3 }
  }
];
