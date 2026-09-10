// Official MoSPI & NSSTA Reference Materials for AI Assessment Engine
// Contains authentic excerpts, formulas, definitions, and survey protocols for generating MCQs and Quizzes

export const SAMPLE_MOSPI_DOCUMENTS = [
  {
    id: 'doc_plfs_methodology',
    title: 'Methodology & Sampling Design of Periodic Labour Force Survey (PLFS)',
    author: 'Survey Design and Research Division (SDRD), MoSPI',
    category: 'Survey Sampling & Labour Statistics',
    publishedYear: '2024',
    sourceUrl: 'mospi.gov.in/sites/default/files/plfs_methodology.pdf',
    competencyId: 'stat_labour_statistics',
    content: `GOVERNMENT OF INDIA
MINISTRY OF STATISTICS AND PROGRAMME IMPLEMENTATION
PERIODIC LABOUR FORCE SURVEY (PLFS) - METHODOLOGY AND ESTIMATION PROCEDURE

1. Introduction and Objectives
The Periodic Labour Force Survey (PLFS) was launched by the National Statistical Office (NSO) in April 2017 to achieve two primary objectives:
(a) To estimate key employment and unemployment indicators (such as Worker Population Ratio, Labour Force Participation Rate, and Unemployment Rate) in the short interval of three months for urban areas only in Current Weekly Status (CWS).
(b) To estimate employment and unemployment indicators in both 'Usual Status' (ps+ss) and CWS in both rural and urban areas annually.

2. Sampling Design
A rotational panel sampling design is adopted in urban areas. In this design, each selected Urban Frame Survey (UFS) block is visited four times: once initially and three times subsequently in consecutive quarters. This ensures 75% rotation of sample households across successive quarters, providing high precision for quarter-to-quarter change estimates while avoiding respondent fatigue.
In rural areas, there is no rotational panel; each selected First Stage Unit (FSU) is visited only once in the survey year.

3. Sampling Frame and First Stage Units (FSUs)
- Rural FSUs: The 2011 Population Census villages constitute the sampling frame for rural areas.
- Urban FSUs: Urban Frame Survey (UFS) blocks constitute the sampling frame for urban areas.
Stratification: Within each district of a State/UT, two basic strata are formed:
- Rural stratum: comprising all rural areas of the district.
- Urban stratum: comprising all urban areas of the district.

4. Second Stage Stratification (SSS) in Sample FSUs
Within each selected FSU (village or UFS block), after household listing, households are stratified into three Second Stage Strata (SSS) based on educational attainment:
- SSS 1: Households having at least one member with educational attainment 'post-graduate and above'. (Allocation: 2 households).
- SSS 2: Households having at least one member with educational attainment 'graduate' or 'diploma / technical certificate below graduate level', but excluding SSS 1. (Allocation: 4 households).
- SSS 3: Other remaining households. (Allocation: 2 households).
A total of 8 households are surveyed in each sample village or UFS block.

5. Key Activity Status Concepts
- Usual Principal Activity Status (UPS): The activity status on which a person spent relatively long time (major time criterion) during the 365 days preceding the date of survey.
- Usual Subsidiary Economic Activity Status (SS): A non-economic or economic person who pursued some economic activity for 30 days or more during the reference year.
- Usual Status (ps+ss): The combination of Usual Principal Status and Subsidiary Economic Status.
- Current Weekly Status (CWS): Activity status during a reference period of 7 days preceding the date of survey. A person is considered employed if they worked for at least 1 hour on any day during the 7-day reference week.

6. Key Indicator Formulas
(1) Labour Force Participation Rate (LFPR):
    LFPR = (Total Labour Force [Employed + Unemployed] / Total Population) * 100
(2) Worker Population Ratio (WPR):
    WPR = (Total Number of Employed Persons / Total Population) * 100
(3) Unemployment Rate (UR):
    UR = (Total Number of Unemployed Persons / Total Labour Force) * 100`
  },
  {
    id: 'doc_national_accounts_gva',
    title: 'Handbook of National Accounts Statistics: Gross Value Added (GVA) Compilation',
    author: 'National Accounts Division (NAD), MoSPI',
    category: 'National Accounts & Macroeconomics',
    publishedYear: '2023',
    sourceUrl: 'mospi.gov.in/handbook_national_accounts_sna2008.pdf',
    competencyId: 'stat_national_accounts',
    content: `MINISTRY OF STATISTICS AND PROGRAMME IMPLEMENTATION
CENTRAL STATISTICS OFFICE - NATIONAL ACCOUNTS DIVISION
GUIDELINES ON COMPILATION OF GROSS VALUE ADDED (GVA) AND GDP UNDER SNA 2008

1. Conceptual Framework
Under the System of National Accounts 2008 (SNA 2008), the measure of production activity at the sector/industry level is expressed as Gross Value Added (GVA) at Basic Prices, whereas the headline aggregate for the whole economy is Gross Domestic Product (GDP) at Market Prices.

2. Relationship between GVA at Basic Prices and GDP at Market Prices
GVA at Basic Prices is defined as output valued at basic prices less intermediate consumption valued at purchaser prices.
Basic Price is the amount receivable by the producer from the purchaser for a unit of a good or service produced, minus any tax payable on that unit as a consequence of its production or sale (i.e. product taxes), plus any subsidy receivable on that unit (i.e. product subsidies). It excludes any transport charges invoiced separately by the producer.

The fundamental identity connecting GVA and GDP is:
GDP at Market Prices = Sum of GVA at Basic Prices + Product Taxes - Product Subsidies
Where:
- Product Taxes include Goods and Services Tax (GST), Excise Duties, Customs Duties, Stamp Duty, and Sales Tax.
- Product Subsidies include Food Subsidies, Fertilizer Subsidies, Petroleum Subsidies, and Interest Subventions.

3. Production Taxes and Production Subsidies vs Product Taxes and Subsidies
SNA 2008 draws a strict distinction between production taxes/subsidies and product taxes/subsidies:
- Production Taxes: Taxes that establishments incur as a result of engaging in production, regardless of the volume or value of goods produced (e.g., Land Revenue, Stamp and Registration fees, Professional Tax, Factory License fees).
- Production Subsidies: Subsidies that cannot be identified on each unit of output (e.g., Subsidies to small scale industries, input subsidies on electricity, railways concessions).
- GVA at Factor Cost = GVA at Basic Prices - (Production Taxes - Production Subsidies).

4. Treatment of Financial Intermediation Services Indirectly Measured (FISIM)
Financial intermediaries typically do not charge explicitly for all their services; instead, they operate with an interest rate spread—borrowing at lower interest rates and lending at higher rates. FISIM is estimated as the difference between interest receivable and interest payable, adjusted for a reference risk-free rate of interest.
FISIM is treated as intermediate consumption by user industries or as final consumption by households and government.

5. Supply and Use Tables (SUT)
Supply and Use Tables provide a comprehensive accounting framework showing the origin of goods and services (domestic output vs imports) and how they are used (intermediate consumption vs final demand: private consumption, government consumption, capital formation, exports).
The SUT framework ensures statistical consistency:
For each product: Total Supply at Purchaser Prices = Total Use at Purchaser Prices.`
  },
  {
    id: 'doc_asi_scrutiny_manual',
    title: 'Annual Survey of Industries (ASI): Field Inspection & Schedule Scrutiny Manual',
    author: 'Economic Statistics Division (ESD) & FOD, MoSPI',
    category: 'Industrial Statistics',
    publishedYear: '2024',
    sourceUrl: 'mospi.gov.in/asi_instruction_manual_vol1.pdf',
    competencyId: 'stat_industrial_stats',
    content: `GOVERNMENT OF INDIA
MINISTRY OF STATISTICS AND PROGRAMME IMPLEMENTATION
ANNUAL SURVEY OF INDUSTRIES (ASI) - INSTRUCTIONS TO FIELD OFFICERS

1. Coverage and Statutory Basis
The Annual Survey of Industries (ASI) is conducted under the statutory provisions of the Collection of Statistics Act 2008 and Rules 2011. It covers:
(a) All factories registered under Sections 2(m)(i) and 2(m)(ii) of the Factories Act 1948 (employing 10 or more workers with power, or 20 or more workers without power).
(b) Bidi and cigar manufacturing establishments registered under the Bidi and Cigar Workers (Conditions of Employment) Act 1966.
(c) Electricity undertakings not registered with the Central Electricity Authority (CEA).

2. Sampling and Census Sector Classification
- Census Sector: Units with 100 or more workers in non-five states, all units in 5 industrially less-developed states (Manipur, Meghalaya, Nagaland, Tripura, A&N Islands), joint returns, and units with significant investment are surveyed on a complete enumeration basis.
- Sample Sector: Remaining registered units are sampled using stratified circular systematic sampling based on 4-digit NIC-2008 classifications.

3. Key Schedule Blocks and Scrutiny Criteria
- Block A & B: Identification, National Industrial Classification (NIC-2008) 5-digit code, and operational status.
  * Check: Ensure 5-digit NIC matches primary manufactured output (>50% of total gross turnover).
- Block C: Fixed Assets.
  * Scrutiny Rule: Opening Gross Value + Additions during the year - Deductions/Disposals = Closing Gross Value.
  * Depreciation: Must be consistent with the Companies Act 2013 schedule or Income Tax rate schedules.
- Block D: Working Capital & Loans.
  * Working Capital = Total Current Assets (Inventories, Cash, Receivables) minus Total Current Liabilities (Creditors, Short-term advances).
- Block E: Employment and Labour Cost.
  * Distinction: Directly employed workers vs Contract workers.
  * Mandays worked must equal the sum of mandays worked across all operating shifts.
- Block H & I: Materials Consumed & Ex-Factory Value of Output.
  * Gross Output = Ex-factory value of products manufactured + Industrial services rendered + Value of electricity sold + Net addition to work-in-progress.
  * Net Value Added (NVA) = Gross Output - Total Inputs (raw materials, fuels, stores, non-industrial services) - Depreciation.`
  },
  {
    id: 'doc_dqaf_sdmx_standards',
    title: 'MoSPI Data Quality Assurance Framework (DQAF) & SDMX Metadata Guidelines',
    author: 'Data Informatics & Innovation Division (DIID), MoSPI',
    category: 'Data Governance & Standards',
    publishedYear: '2023',
    sourceUrl: 'mospi.gov.in/dqaf_sdmx_handbook.pdf',
    competencyId: 'stat_data_quality',
    content: `MINISTRY OF STATISTICS AND PROGRAMME IMPLEMENTATION
DATA INFORMATICS AND INNOVATION DIVISION (DIID)
NATIONAL DATA QUALITY ASSURANCE FRAMEWORK (NDQAF) AND SDMX METADATA PROTOCOLS

1. Background and Purpose
In line with the United Nations National Quality Assurance Frameworks (UN-NQAF) and the IMF Special Data Dissemination Standard (SDDS), MoSPI has established the National Data Quality Assurance Framework (NDQAF) to govern data generation, validation, and dissemination across the Indian Statistical System.

2. Dimensions of Statistical Quality
The NDQAF evaluates official statistics across six core quality dimensions:
(1) Relevance: Degree to which statistics meet current and potential user needs (policymakers, researchers, international agencies).
(2) Accuracy and Reliability: Closeness of estimates to true values, minimizing both sampling errors (standard errors, CVs) and non-sampling errors (coverage, non-response, measurement).
(3) Timeliness and Punctuality: Time lag between reference period and publication date, strict adherence to Advance Release Calendars (ARC).
(4) Accessibility and Clarity: Ease with which users can locate, retrieve, and understand statistics, including availability of microdata under open licenses.
(5) Coherence and Comparability: Statistics must be consistent across time periods, geographical regions, and different sub-domains (e.g., IIP vs ASI manufacturing growth).
(6) Credibility and Integrity: Production of statistics based strictly on scientific methodologies without political interference, adhering to the UN Fundamental Principles of Official Statistics.

3. Statistical Data and Metadata Exchange (SDMX) Standards
SDMX (ISO 17369) is the global technical standard for exchanging statistical data and metadata.
Core components of SDMX architecture:
- Data Structure Definition (DSD): Defines dimensions (e.g., Country, Indicator, Frequency, Time), attributes (e.g., Unit of Measure, Decimals, Observation Status), and measures (numeric value).
- Concept Schemes: Standardized concepts like TIME_PERIOD, REF_AREA, FREQ, OBS_VALUE.
- Code Lists: Predefined enumerations (e.g., CL_FREQ: A=Annual, Q=Quarterly, M=Monthly).
MoSPI mandates that all headline indicators (CPI, IIP, GDP, PLFS) must be exposed via SDMX-RESTful endpoints supporting SDMX-ML and SDMX-JSON payloads.`
  },
  {
    id: 'doc_cpi_methodology',
    title: 'Consumer Price Index (CPI): Basket Selection, Weighting & Index Compilation',
    author: 'Price Statistics Division, MoSPI',
    category: 'Price Statistics',
    publishedYear: '2024',
    sourceUrl: 'mospi.gov.in/cpi_guidelines_revised.pdf',
    competencyId: 'stat_price_statistics',
    content: `GOVERNMENT OF INDIA
MINISTRY OF STATISTICS AND PROGRAMME IMPLEMENTATION
TECHNICAL MANUAL ON CONSUMER PRICE INDEX (CPI - RURAL, URBAN, COMBINED)

1. Scope and Objective
The All-India Consumer Price Index (CPI) measures changes over time in the general level of prices of a fixed basket of goods and services that a reference population consumes, uses, or pays for. It serves as the primary nominal anchor for inflation targeting by the Reserve Bank of India (Monetary Policy Committee - MPC).

2. Basket Weights and Data Sources
Item weighting diagrams for CPI are derived from the Consumer Expenditure Survey (CES) conducted by the NSO. The percentage share of expenditure on an item relative to total household consumption expenditure determines the weight of that item.
The basket is structured into 6 primary groups:
- Group 1: Food and Beverages (highest weight, ~45.86% in Combined CPI)
- Group 2: Pan, Tobacco and Intoxicants
- Group 3: Clothing and Footwear
- Group 4: Housing (Urban only; Rural housing is excluded due to lack of rental market)
- Group 5: Fuel and Light
- Group 6: Miscellaneous (Transport, Communication, Education, Health, Personal Care)

3. Price Collection Operations
- Rural Markets: Prices are collected weekly from 1,181 selected village markets across India by Department of Posts personnel.
- Urban Markets: Prices are collected weekly from 1,114 selected urban markets across 310 towns by NSO (FOD) field investigators.
Prices are transmitted electronically using dedicated mobile applications with geo-tagging and time-stamping.

4. Index Formula
CPI compilation utilizes the chained modified Laspeyres formula:
I_t = Sum [ w_0 * (P_t / P_0) ] / Sum [ w_0 ]
Where:
- I_t is the index at time t.
- w_0 is the base period weight of the item.
- P_t is the price in current period t.
- P_0 is the price in base period 0.
Elementary aggregates are calculated as geometric means (Jevons index) to mitigate substitution bias before aggregating via Laspeyres.`
  }
];
