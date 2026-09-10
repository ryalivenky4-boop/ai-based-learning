// National Statistical Systems Training Academy (NSSTA, Greater Noida)
// Training Programme Approval Committee (TPAC) Recommended Training Calendar 2025-26

export const NSSTA_TPAC_PROGRAMMES = [
  {
    id: 'nssta_tpac_01',
    code: 'NSSTA-TPAC-2025-01',
    title: 'Induction Training Programme for SSS Officers (Batch 2024-25)',
    category: 'Induction',
    targetCadre: 'Subordinate Statistical Service (SSS) - JSO',
    competencyId: 'stat_survey_sampling',
    durationDays: 14,
    venue: 'NSSTA Campus, Plot No. 22, Knowledge Park II, Greater Noida (Residential)',
    mode: 'Residential Classroom & Field Lab',
    startDate: '2025-10-06',
    endDate: '2025-10-20',
    capacity: 45,
    nominatedCount: 38,
    tpacApprovalStatus: 'Approved by DG (CSO) MoSPI',
    syllabusFocus: [
      'NSS Survey Design, Sampling Methodology & Household Listing',
      'CAPI Tablet Hands-on: Android Survey Application & Sync Protocols',
      'Field Scrutiny Rules for PLFS and Annual Survey of Industries',
      'Civil Services Conduct Rules & Professional Ethics'
    ],
    prerequisite: 'Fresh appointment as Junior Statistical Officer',
    director: 'Shri B. K. Sahoo, Additional Director General, NSSTA'
  },
  {
    id: 'nssta_tpac_02',
    code: 'NSSTA-TPAC-2025-02',
    title: 'National Workshop on Advanced System of National Accounts (SNA 2008 & 2025 Updates)',
    category: 'Advanced Refresher',
    targetCadre: 'ISS Officers & SSS (SSO/JSO in NAD/ESD)',
    competencyId: 'stat_national_accounts',
    durationDays: 5,
    venue: 'NSSTA Greater Noida & Hybrid Video Link',
    mode: 'Hybrid (Classroom + Video Conference)',
    startDate: '2025-11-10',
    endDate: '2025-11-14',
    capacity: 35,
    nominatedCount: 29,
    tpacApprovalStatus: 'Approved by DG (CSO) MoSPI',
    syllabusFocus: [
      'Compilation of Gross Value Added (GVA) across Primary, Secondary, Tertiary sectors',
      'Supply and Use Tables (SUT) Balances & Input-Output Multipliers',
      'Integration of Corporate MCA21 financial data with National Accounts',
      'Measuring the Digital Economy: Crypto assets, AI services, Data assets in SNA 2025'
    ],
    prerequisite: 'Prior experience in National Accounts or Price Statistics',
    director: 'Dr. S. K. Gupta, Deputy Director General (NAD)'
  },
  {
    id: 'nssta_tpac_03',
    code: 'NSSTA-TPAC-2025-03',
    title: 'Executive Workshop on Big Data, AI/ML & Natural Language Processing in Official Surveys',
    category: 'Specialized Technical',
    targetCadre: 'ISS Officers & DIID Systems Specialists',
    competencyId: 'tech_ai_ml',
    durationDays: 5,
    venue: 'NSSTA Greater Noida (Computer Lab 1)',
    mode: 'Hands-on Computer Lab',
    startDate: '2025-12-01',
    endDate: '2025-12-05',
    capacity: 30,
    nominatedCount: 26,
    tpacApprovalStatus: 'Approved by DG (CSO) MoSPI',
    syllabusFocus: [
      'Automated NLP classification of economic activity text into 5-digit NIC codes',
      'Satellite imagery processing for early crop acreage & yield estimation',
      'Anomaly detection algorithms for real-time survey falsification checks',
      'Deploying open-source LLMs on secure government cloud infrastructure'
    ],
    prerequisite: 'Basic familiarity with Python or R',
    director: 'Dr. R. K. Maurya, Director (DIID)'
  },
  {
    id: 'nssta_tpac_04',
    code: 'NSSTA-TPAC-2025-04',
    title: 'Hands-on Laboratory on Python for Official Microdata Analysis & SDMX Dissemination',
    category: 'In-Service Technical',
    targetCadre: 'SSS (SSO/JSO) & Assistant Directors',
    competencyId: 'tech_python_stats',
    durationDays: 5,
    venue: 'NSSTA Greater Noida (Advanced Analytics Lab)',
    mode: 'Hands-on Residential Lab',
    startDate: '2026-01-12',
    endDate: '2026-01-16',
    capacity: 40,
    nominatedCount: 32,
    tpacApprovalStatus: 'Approved by DG (CSO) MoSPI',
    syllabusFocus: [
      'Pandas for large-scale PLFS, ASI, and Consumer Expenditure microdata',
      'Applying Multi-Stage Sampling Weights and calculating domain variances',
      'Building automated data validation scripts to replace manual scrutiny',
      'Generating SDMX-ML and SDMX-JSON structured metadata artifacts'
    ],
    prerequisite: 'Basic computer proficiency',
    director: 'Smt. Vandana Marwah, Joint Director (NSSTA)'
  },
  {
    id: 'nssta_tpac_05',
    code: 'NSSTA-TPAC-2025-05',
    title: 'Specialized Workshop on Small Area Estimation (SAE) for District-Level Statistics',
    category: 'Specialized Methodology',
    targetCadre: 'ISS Officers, State DES Directors, Academic Researchers',
    competencyId: 'stat_survey_sampling',
    durationDays: 5,
    venue: 'NSSTA Greater Noida in collaboration with ISI Kolkata',
    mode: 'Classroom & Computational Lab',
    startDate: '2026-02-09',
    endDate: '2026-02-13',
    capacity: 30,
    nominatedCount: 21,
    tpacApprovalStatus: 'Approved by DG (CSO) MoSPI',
    syllabusFocus: [
      'Fay-Herriot Area-Level Models & Empirical Best Linear Unbiased Prediction (EBLUP)',
      'Combining survey sample data with administrative and satellite covariates',
      'Estimating district-level poverty, unemployment, and malnutrition rates',
      'Validation of small area estimates and mean squared error (MSE) computation'
    ],
    prerequisite: 'Knowledge of Linear Models and R programming',
    director: 'Prof. A. K. Biswas, Guest Faculty (ISI Kolkata)'
  },
  {
    id: 'nssta_tpac_06',
    code: 'NSSTA-TPAC-2025-06',
    title: 'Workshop on QGIS & Remote Sensing for Urban Frame Survey (UFS) and Sampling Blocks',
    category: 'In-Service Technical',
    targetCadre: 'Field Operations Division (FOD) Supervisors & JSO/SSO',
    competencyId: 'tech_gis_spatial',
    durationDays: 4,
    venue: 'NSSTA Greater Noida (GIS Laboratory)',
    mode: 'Practical GIS Workstations',
    startDate: '2026-03-02',
    endDate: '2026-03-05',
    capacity: 35,
    nominatedCount: 28,
    tpacApprovalStatus: 'Approved by DG (CSO) MoSPI',
    syllabusFocus: [
      'Georeferencing Urban Frame Survey (UFS) block maps in QGIS',
      'Overlaying high-resolution satellite imagery on municipal wards',
      'Creating digital enumeration boundaries to prevent boundary overlap',
      'Exporting GeoPackage files for mobile CAPI integration'
    ],
    prerequisite: 'Basic computer operations',
    director: 'Shri Amit Verma, Deputy Director (SDRD)'
  },
  {
    id: 'nssta_tpac_07',
    code: 'NSSTA-TPAC-2025-07',
    title: 'Mid-Career Training Programme (MCTP Phase-II) for Senior Statistical Officers',
    category: 'Leadership & Management',
    targetCadre: 'Senior Statistical Officers (SSO) with 6+ years service',
    competencyId: 'mgmt_leadership_change',
    durationDays: 10,
    venue: 'NSSTA Greater Noida & IIM Lucknow (Noida Campus)',
    mode: 'Executive Residential Seminar',
    startDate: '2026-03-16',
    endDate: '2026-03-27',
    capacity: 35,
    nominatedCount: 30,
    tpacApprovalStatus: 'Approved by DG (CSO) MoSPI',
    syllabusFocus: [
      'Strategic leadership in transitioning to modernized statistical systems',
      'Public Financial Management System (PFMS) & GFR-2017 compliance',
      'Drafting executive policy briefs and Cabinet notes',
      'Conflict resolution, stress management, and emotional intelligence in field supervision'
    ],
    prerequisite: 'Minimum 6 years completed in SSS cadre',
    director: 'Director General (CSO), MoSPI'
  }
];
