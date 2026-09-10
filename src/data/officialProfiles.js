// Authentic MoSPI & Indian Official Statistical System Trainee Profiles & Personas

export const ROLES_CONFIG = {
  jso: {
    id: 'jso',
    title: 'Junior Statistical Officer (JSO)',
    cadre: 'Subordinate Statistical Service (SSS)',
    typicalDivision: 'Field Operations Division (FOD)',
    nextElevation: 'Senior Statistical Officer (SSO)',
    desc: 'Conducts primary field enumeration, CAPI data entry, local listing, and initial data scrutiny.'
  },
  sso: {
    id: 'sso',
    title: 'Senior Statistical Officer (SSO)',
    cadre: 'Subordinate Statistical Service (SSS)',
    typicalDivision: 'National Accounts Division (NAD) / ESD',
    nextElevation: 'Assistant Director (ISS)',
    desc: 'Supervises field inspections, validates unit-record datasets, compiles regional macroeconomic aggregates.'
  },
  asst_dir: {
    id: 'asst_dir',
    title: 'Assistant Director',
    cadre: 'Indian Statistical Service (ISS - Group A)',
    typicalDivision: 'Data Informatics & Innovation Division (DIID)',
    nextElevation: 'Deputy Director (ISS)',
    desc: 'Oversees methodology formulation, AI/ML implementation, microdata dissemination, and policy coordination.'
  },
  dep_dir: {
    id: 'dep_dir',
    title: 'Deputy Director',
    cadre: 'Indian Statistical Service (ISS - Group A)',
    typicalDivision: 'Survey Design & Research Division (SDRD)',
    nextElevation: 'Joint Director (ISS)',
    desc: 'Leads national survey sample designs, international statistical liaison (UNSD/IMF), and strategic reforms.'
  },
  data_officer: {
    id: 'data_officer',
    title: 'Data Informatics Officer',
    cadre: 'Technical / IT Specialist (DIID)',
    typicalDivision: 'DIID - Cloud & Analytics Wing',
    nextElevation: 'Senior Systems Architect',
    desc: 'Manages MoSPI cloud data lakehouse, API microservices, automated validation pipelines, and cybersecurity.'
  }
};

export const OFFICIAL_PERSONAS = [
  {
    id: 'persona_ananya',
    name: 'Smt. Ananya Sharma',
    avatar: 'AS',
    designation: 'Junior Statistical Officer (JSO)',
    roleKey: 'jso',
    cadre: 'Subordinate Statistical Service (SSS)',
    division: 'Field Operations Division (FOD)',
    posting: 'Regional Office, Jaipur, Rajasthan',
    employeeId: 'MoSPI/SSS/2021/8412',
    email: 'ananya.sharma@mospi.gov.in',
    qualification: 'M.Sc. in Statistics (University of Rajasthan)',
    experienceYears: 3.5,
    currentAssignment: 'PLFS Quarterly Field Survey & Annual Survey of Industries (ASI) factory verification',
    pastTrainings: [
      'NSSTA Induction Training for SSS Recruits (2021)',
      'iGOT: Code of Conduct and Ethics for Civil Servants',
      'Workshop on CAPI (Computer Assisted Personal Interviewing) on Android Tablets'
    ],
    targetRole: 'sso',
    karmayogiCredits: 420,
    streakDays: 14,
    learningHours: 38.5,
    // Baseline current scores (1-5)
    competencyScores: {
      stat_survey_sampling: 3,
      stat_national_accounts: 1, // Gap
      stat_price_statistics: 2, // Gap
      stat_labour_statistics: 4,
      stat_industrial_stats: 3,
      stat_sdg_indicators: 1, // Gap
      stat_data_quality: 2, // Gap
      tech_python_stats: 1, // Major Gap
      tech_r_econometrics: 1, // Gap
      tech_sql_databases: 2,
      tech_gis_spatial: 2,
      tech_data_viz: 1, // Gap
      tech_ai_ml: 1,
      tech_cloud_apis: 1,
      gov_cybersecurity: 2,
      gov_data_privacy: 3,
      gov_dpi_cloud: 1, // Gap
      gov_eoffice_workflows: 4,
      mgmt_ethics_conduct: 4,
      mgmt_project_management: 2,
      mgmt_communication_briefs: 2,
      mgmt_leadership_change: 1
    }
  },
  {
    id: 'persona_rajesh',
    name: 'Shri Rajesh Kumar Verma',
    avatar: 'RV',
    designation: 'Senior Statistical Officer (SSO)',
    roleKey: 'sso',
    cadre: 'Subordinate Statistical Service (SSS)',
    division: 'National Accounts Division (NAD)',
    posting: 'MoSPI Headquarters, Sardar Patel Bhawan, New Delhi',
    employeeId: 'MoSPI/SSS/2016/3291',
    email: 'rajesh.verma@mospi.gov.in',
    qualification: 'M.A. in Econometrics (Delhi School of Economics)',
    experienceYears: 8.5,
    currentAssignment: 'Supply and Use Tables (SUT) compilation & Gross Value Added estimation for Manufacturing',
    pastTrainings: [
      'NSSTA Workshop on System of National Accounts (SNA 2008)',
      'iGOT: Public Procurement through GeM',
      'NSSTA In-Service Refresher on Advanced Time Series Forecasting'
    ],
    targetRole: 'asst_dir',
    karmayogiCredits: 890,
    streakDays: 22,
    learningHours: 64.0,
    competencyScores: {
      stat_survey_sampling: 4,
      stat_national_accounts: 4,
      stat_price_statistics: 3, // Gap for Asst Dir
      stat_labour_statistics: 3, // Gap for Asst Dir
      stat_industrial_stats: 4,
      stat_sdg_indicators: 2, // Gap
      stat_data_quality: 3, // Gap
      tech_python_stats: 2, // Gap (Needs 4 for Asst Dir)
      tech_r_econometrics: 3, // Gap
      tech_sql_databases: 2, // Gap
      tech_gis_spatial: 2,
      tech_data_viz: 2, // Gap
      tech_ai_ml: 1, // Gap
      tech_cloud_apis: 1, // Gap
      gov_cybersecurity: 2,
      gov_data_privacy: 4,
      gov_dpi_cloud: 2,
      gov_eoffice_workflows: 4,
      mgmt_ethics_conduct: 4,
      mgmt_project_management: 3, // Gap
      mgmt_communication_briefs: 3, // Gap
      mgmt_leadership_change: 2 // Gap
    }
  },
  {
    id: 'persona_priya',
    name: 'Dr. Priya Nair, ISS',
    avatar: 'PN',
    designation: 'Assistant Director',
    roleKey: 'asst_dir',
    cadre: 'Indian Statistical Service (ISS - 43rd Batch)',
    division: 'Data Informatics & Innovation Division (DIID)',
    posting: 'MoSPI, Sankhyiki Bhawan, CBD Belapur / New Delhi',
    employeeId: 'MoSPI/ISS/2018/0043',
    email: 'priya.nair@mospi.gov.in',
    qualification: 'Ph.D. in Data Science & Official Statistics (ISI Kolkata)',
    experienceYears: 6.0,
    currentAssignment: 'MoSPI Microdata Portal modernization, SDMX API integration & AI in Survey Processing',
    pastTrainings: [
      'NSSTA 2-Year ISS Probationary Induction (2018-2020)',
      'iGOT: Mission Karmayogi Leadership for Digital Public Goods',
      'UNSD-SIAP International Workshop on Big Data in Official Statistics (Tokyo)'
    ],
    targetRole: 'dep_dir',
    karmayogiCredits: 1450,
    streakDays: 31,
    learningHours: 112.5,
    competencyScores: {
      stat_survey_sampling: 4,
      stat_national_accounts: 3, // Gap for Dep Dir
      stat_price_statistics: 3, // Gap
      stat_labour_statistics: 4,
      stat_industrial_stats: 3, // Gap
      stat_sdg_indicators: 4,
      stat_data_quality: 4,
      tech_python_stats: 5,
      tech_r_econometrics: 4,
      tech_sql_databases: 4,
      tech_gis_spatial: 3,
      tech_data_viz: 4,
      tech_ai_ml: 4,
      tech_cloud_apis: 4,
      gov_cybersecurity: 4,
      gov_data_privacy: 4,
      gov_dpi_cloud: 4,
      gov_eoffice_workflows: 4,
      mgmt_ethics_conduct: 5,
      mgmt_project_management: 3, // Gap for Dep Dir
      mgmt_communication_briefs: 4,
      mgmt_leadership_change: 3 // Gap for Dep Dir
    }
  }
];
