// Ministry of Statistics and Programme Implementation (MoSPI)
// Organization-Wide Workforce Competency & Capacity Building Analytics Data (DIID & NSSTA)

export const MINISTRY_OVERVIEW_METRICS = {
  totalOfficers: 3840,
  issOfficers: 820,
  sssOfficers: 2680,
  technicalOfficers: 340,
  averageCompetencyIndex: 72.4, // percentage
  activeLearnersLast30Days: 2940,
  totalLearningHoursYTD: 54820,
  igotCompletedModules: 14380,
  nsstaNominatedYTD: 1420,
  criticalSkillGapsCount: 842, // across entire workforce
  avgReadinessForPromotion: 68.2
};

export const DIVISIONS_METRICS = [
  {
    code: 'FOD',
    name: 'Field Operations Division',
    headquarters: 'Faridabad / 6 Zonal & 49 Regional Offices',
    officerCount: 2150,
    cadreBreakdown: { sss: 1950, iss: 160, tech: 40 },
    avgCompetency: 68.5,
    topStrengths: ['Field Enumeration', 'PLFS Methodology', 'CAPI Operations', 'Conduct Rules'],
    criticalGaps: ['Python for Microdata', 'QGIS Spatial Boundaries', 'Cybersecurity Protocols'],
    learningHoursPerOfficer: 18.4,
    igotAdoptionRate: 78.5,
    nsstaTpacSeatsAllocated: 620
  },
  {
    code: 'NAD',
    name: 'National Accounts Division',
    headquarters: 'Sardar Patel Bhawan, New Delhi',
    officerCount: 380,
    cadreBreakdown: { sss: 220, iss: 140, tech: 20 },
    avgCompetency: 79.2,
    topStrengths: ['SNA 2008 Framework', 'Supply-Use Tables', 'GVA Compilation', 'Macroeconomics'],
    criticalGaps: ['SNA 2025 Digital Asset Valuation', 'R Time Series Forecasting', 'Cloud Microdata APIs'],
    learningHoursPerOfficer: 26.8,
    igotAdoptionRate: 88.2,
    nsstaTpacSeatsAllocated: 180
  },
  {
    code: 'ESD',
    name: 'Economic Statistics Division',
    headquarters: 'New Delhi / Kolkata',
    officerCount: 420,
    cadreBreakdown: { sss: 290, iss: 110, tech: 20 },
    avgCompetency: 74.6,
    topStrengths: ['ASI Factory Scrutiny', 'IIP Compilation', 'NIC Classification'],
    criticalGaps: ['Automated NLP Text Classification', 'SQL Data Warehouses', 'Data Disclosure Control'],
    learningHoursPerOfficer: 21.3,
    igotAdoptionRate: 82.0,
    nsstaTpacSeatsAllocated: 210
  },
  {
    code: 'SDRD',
    name: 'Survey Design & Research Division',
    headquarters: 'Mahalanobis Bhawan, Kolkata',
    officerCount: 310,
    cadreBreakdown: { sss: 150, iss: 140, tech: 20 },
    avgCompetency: 84.1,
    topStrengths: ['Sampling Design', 'Stratification Theory', 'Small Area Estimation', 'Questionnaire Design'],
    criticalGaps: ['Big Data Integration with Surveys', 'Python Distributed Computing', 'DPI & MeghRaj'],
    learningHoursPerOfficer: 31.5,
    igotAdoptionRate: 91.4,
    nsstaTpacSeatsAllocated: 140
  },
  {
    code: 'DIID',
    name: 'Data Informatics & Innovation Division',
    headquarters: 'Sankhyiki Bhawan, New Delhi',
    officerCount: 290,
    cadreBreakdown: { sss: 70, iss: 120, tech: 100 },
    avgCompetency: 86.8,
    topStrengths: ['Python & Data Engineering', 'Cloud Lakehouse', 'Cybersecurity', 'SDMX Metadata'],
    criticalGaps: ['LLM & AI Assessment Generation', 'Advanced Econometrics', 'Civil Service Leadership'],
    learningHoursPerOfficer: 36.2,
    igotAdoptionRate: 94.8,
    nsstaTpacSeatsAllocated: 160
  },
  {
    code: 'SSD',
    name: 'Social Statistics Division',
    headquarters: 'New Delhi',
    officerCount: 290,
    cadreBreakdown: { sss: 180, iss: 90, tech: 20 },
    avgCompetency: 73.0,
    topStrengths: ['SDG National Indicators', 'Gender Statistics', 'Time Use Survey'],
    criticalGaps: ['Power BI Dashboards', 'Sub-national Small Area Models', 'DPDP Compliance'],
    learningHoursPerOfficer: 22.0,
    igotAdoptionRate: 80.6,
    nsstaTpacSeatsAllocated: 110
  }
];

export const PREDICTIVE_CAPACITY_FORECASTS = [
  {
    id: 'forecast_1',
    milestone: '7th Economic Census Modernization (2026-27)',
    targetTimeline: 'Q1-Q2 2026',
    projectedDemand: 'High (1,800 Officers)',
    primarySkillsNeeded: ['GIS Enumeration Block Mapping', 'QGIS PSU Boundaries', 'CAPI Tablet Security', 'AI Fraud Detection'],
    currentReadiness: 54, // percentage
    recommendedAction: 'Mandate iGOT Module IGOT-TECH-004 (QGIS) and schedule 8 regional NSSTA hybrid workshops.',
    riskLevel: 'High'
  },
  {
    id: 'forecast_2',
    milestone: 'Transition to System of National Accounts (SNA 2025 Revision)',
    targetTimeline: 'Q3-Q4 2026',
    projectedDemand: 'Critical (450 Officers in NAD/ESD/DIID)',
    primarySkillsNeeded: ['Crypto/Digital Asset Accounting', 'Environmental Economic Accounting (SEEA)', 'SUT Balancing in Python'],
    currentReadiness: 41,
    recommendedAction: 'Collaborate with UNSD & IMF for advanced NSSTA residential masterclasses and launch specialized iGOT pathway.',
    riskLevel: 'Critical'
  },
  {
    id: 'forecast_3',
    milestone: 'Implementation of DPDP Act 2023 across All MoSPI Survey Datasets',
    targetTimeline: 'Immediate (Ongoing)',
    projectedDemand: 'Universal (All 3,840 Officers)',
    primarySkillsNeeded: ['Statistical Disclosure Control (SDC)', 'Respondent Anonymization Algorithms', 'DPDP Compliance Rules'],
    currentReadiness: 62,
    recommendedAction: 'Roll out mandatory 4-hour micro-credential on iGOT Karmayogi with automated certificate verification.',
    riskLevel: 'Moderate'
  },
  {
    id: 'forecast_4',
    milestone: 'AI-Powered Automated Coding for Industrial & Occupational Classifications (NIC/NCO)',
    targetTimeline: 'Q4 2025',
    projectedDemand: 'Specialized (320 Officers in ESD/FOD/DIID)',
    primarySkillsNeeded: ['NLP Classification Models', 'Python Microdata Processing', 'Model Drift & Quality Auditing'],
    currentReadiness: 48,
    recommendedAction: 'Deploy NSSTA hands-on computational lab and pilot AI auto-coding module in regional offices.',
    riskLevel: 'High'
  }
];

export const MONTHLY_LEARNING_TREND = [
  { month: 'Apr 2025', hours: 3820, completions: 940, avgScore: 68 },
  { month: 'May 2025', hours: 4150, completions: 1120, avgScore: 70 },
  { month: 'Jun 2025', hours: 4900, completions: 1350, avgScore: 71 },
  { month: 'Jul 2025', hours: 5620, completions: 1580, avgScore: 73 },
  { month: 'Aug 2025', hours: 6480, completions: 1890, avgScore: 75 },
  { month: 'Sep 2025', hours: 7120, completions: 2100, avgScore: 77 }
];
