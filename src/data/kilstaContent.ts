export interface ServiceItem {
  id: string;
  category: 'business' | 'ict' | 'training';
  title: string;
  shortDesc: string;
  fullDesc: string;
  deliverables: string[];
  estimatedTime: string;
  priceEstimate: string;
  badge?: string;
}

export interface TrainingCourse {
  id: string;
  title: string;
  level: string;
  duration: string;
  targetAudience: string;
  overview: string;
  modules: string[];
  costPerParticipant: string;
  certificate: boolean;
}

export interface IndustrySolution {
  id: string;
  title: string;
  iconName: string;
  description: string;
  challenges: string[];
  solutions: string[];
  milneBayExample: string;
}

export const COMPANY_DETAILS = {
  name: 'KILSTA Business & ICT Consultants',
  legalName: 'KILSTA Business and ICT Consultancy Services',
  location: 'Alotau, Milne Bay Province, Papua New Guinea',
  address: 'Town Centre Commercial District, Alotau, MBP',
  phone: '+675 82545274',
  phoneRaw: '67582545274',
  email: 'kilsta2023@gmail.com',
  ipaNumber: 'IPA 6-129295384',
  tinNumber: 'TIN 502603269',
  operatingHours: 'Monday – Friday: 8:00 AM – 5:00 PM | Sat: 8:30 AM – 1:00 PM',
  youtube: 'https://youtube.com/@stalloneyabom9353',
  tagline: 'Empowering Milne Bay Businesses Through Pragmatic ICT & Strategic Business Compliance',
  founded: '2023',
};

export const CORE_PILLARS = [
  {
    id: 'business',
    title: 'Business Advisory & SME Compliance',
    subtitle: 'From IPA business registration to IRC tax compliance and reliable financial records.',
    icon: 'Briefcase',
    color: 'emerald',
    highlights: ['IPA Business Name & Company Setup', 'IRC TIN & Certificate of Compliance (COC)', 'Bookkeeping & Cash Flow Ledgers', 'Bank Loan & Grant Business Proposals'],
  },
  {
    id: 'ict',
    title: 'ICT Systems & Infrastructure',
    subtitle: 'Enterprise-grade networking, CCTV surveillance, hardware repair, and cloud backup.',
    icon: 'Server',
    color: 'blue',
    highlights: ['Structured LAN & Long-Range Wi-Fi', 'IP CCTV Night-Vision Surveillance', 'Automated Cloud & Local Data Backup', 'Hardware Sourcing, Repair & Upgrades'],
  },
  {
    id: 'training',
    title: 'Certified ICT & Skills Training',
    subtitle: 'Practical, hands-on computer workshops that build real workplace competencies.',
    icon: 'GraduationCap',
    color: 'teal',
    highlights: ['Microsoft Excel for Business & Finance', 'Digital Literacy for Office Staff', 'Accounting & Invoicing Software', 'Custom Corporate & NGO Modules'],
  },
];

export const SERVICES_CATALOG: ServiceItem[] = [
  // Business Advisory
  {
    id: 'ipa-registration',
    category: 'business',
    title: 'IPA Business Registration & Annual Returns',
    shortDesc: 'Official incorporation of Business Names, Companies, Associations, and filing of overdue annual returns with the Investment Promotion Authority.',
    fullDesc: 'We guide Milne Bay entrepreneurs through complete legal formalization. Whether you are launching a sole proprietorship, partnership, cooperative or private company, we handle name reservations, statutory forms, and regulatory filings.',
    deliverables: [
      'Official IPA Certificate of Incorporation',
      'Certified Extract and Statutory Form copies',
      'Name reservation & clearance verification',
      'Overdue annual returns rectification & penalty reduction guidance'
    ],
    estimatedTime: '3 – 5 business days',
    priceEstimate: 'From K250 PGK',
    badge: 'Popular for Startups'
  },
  {
    id: 'irc-tin-coc',
    category: 'business',
    title: 'IRC Tax Setup, TIN & Certificate of Compliance (COC)',
    shortDesc: 'Acquisition of Tax Identification Numbers (TIN) and Certificates of Compliance needed to bid for provincial tenders and government contracts.',
    fullDesc: 'Ensure your business is fully tax compliant with the Internal Revenue Commission. We prepare your Statement of Affairs, lodge your TIN applications, and assist with Goods and Services Tax (GST) and Salary or Wages Tax (SWT) setup.',
    deliverables: [
      'Official IRC Tax Identification Number (TIN)',
      'Certificate of Compliance (COC) for tender bidding',
      'GST & SWT tax registration documentation',
      'Tax compliance calendar & advisory'
    ],
    estimatedTime: '5 – 10 business days',
    priceEstimate: 'From K350 PGK',
    badge: 'Essential for Tenders'
  },
  {
    id: 'sme-bookkeeping',
    category: 'business',
    title: 'SME Bookkeeping & Financial Records Setup',
    shortDesc: 'Establish clean, audit-ready bookkeeping ledgers, invoice templates, payroll tracking, and monthly expense statements.',
    fullDesc: 'Stop running your business from memory or scattered receipts. We install and configure customized Excel or dedicated accounting software templates tailored to Milne Bay retail, tourism, and agriculture operations.',
    deliverables: [
      'Customized computerized ledger & cashbook',
      'Professional branded invoice & receipt templates',
      'Profit & loss and monthly cash flow summary sheets',
      'Staff training on daily record keeping (2 hours)'
    ],
    estimatedTime: '2 – 4 business days',
    priceEstimate: 'From K500 PGK'
  },
  {
    id: 'business-plans',
    category: 'business',
    title: 'Business Profiles, Plans & Bank Proposals',
    shortDesc: 'High-impact company profiles and bankable business plans formatted for BSP SME loans, NDB funding, and donor grant applications.',
    fullDesc: 'A professionally written profile gives your business instant credibility with commercial banks, government agencies, and corporate clients. We draft comprehensive market analyses, operational workflows, and 3-year financial projections.',
    deliverables: [
      'Full PDF & printed Corporate Business Profile (12-20 pages)',
      '3-Year Financial Model & Cash Flow Forecasts',
      'Executive Summary tailored for BSP / NDB / Grant officers',
      'Editable Word & PDF master copies'
    ],
    estimatedTime: '7 – 10 business days',
    priceEstimate: 'From K850 PGK'
  },

  // ICT Services
  {
    id: 'network-infrastructure',
    category: 'ict',
    title: 'Structured Network Cabling & Managed Wi-Fi',
    shortDesc: 'High-reliability Cat6 LAN cabling, mesh Wi-Fi access points, router firewalls, and guest network captive portals for offices and lodges.',
    fullDesc: 'Slow, unstable internet costs your organization valuable time. We design, cable, and configure high-performance local networks that maximize Digicel, Telikom, and Starlink satellite bandwidth across multi-room buildings.',
    deliverables: [
      'Cat6 structured cabling with neat cable management & patch panels',
      'Dual-band Gigabit Wi-Fi access point deployment',
      'VLAN isolation for staff and guest Wi-Fi',
      'Network speed test & coverage verification report'
    ],
    estimatedTime: '1 – 3 days (depending on building size)',
    priceEstimate: 'Custom quotation based on site survey',
    badge: 'Enterprise Grade'
  },
  {
    id: 'cctv-surveillance',
    category: 'ict',
    title: 'IP CCTV Security & Surveillance Systems',
    shortDesc: 'High-definition 1080p/4K night-vision security cameras with remote smartphone viewing and local secure NVR recording.',
    fullDesc: 'Protect your business premises, retail stores, wharves, and warehouses 24/7. We install vandal-proof, weatherproof IP cameras with crystal-clear infrared night vision and motion alerts sent directly to your mobile phone.',
    deliverables: [
      '4, 8, or 16-channel Network Video Recorder (NVR) with 2TB+ storage',
      'High-resolution indoor & outdoor night-vision cameras',
      'Remote monitoring app configured on your smartphone / tablet',
      'UPS battery backup integration for uninterrupted power'
    ],
    estimatedTime: '2 – 4 days',
    priceEstimate: 'From K2,800 PGK (Complete 4-camera kit installed)',
    badge: 'Popular for Retail'
  },
  {
    id: 'cloud-data-backup',
    category: 'ict',
    title: 'Automated Data Backup & Disaster Recovery',
    shortDesc: 'Never lose critical financial files, patient records, or customer databases to power surges, ransomware, or disk failures.',
    fullDesc: 'Power fluctuations in Milne Bay are a frequent cause of corrupted hard drives. We deploy automated hybrid backup systems that mirror your critical files both to an on-site encrypted storage drive and to secure cloud storage.',
    deliverables: [
      'Automated daily scheduled backup software installation',
      'External shockproof USB storage configured with versioning',
      'Cloud storage synchronization (Google Drive / OneDrive)',
      'Emergency recovery simulation & documentation'
    ],
    estimatedTime: '1 day',
    priceEstimate: 'From K450 PGK'
  },
  {
    id: 'hardware-support',
    category: 'ict',
    title: 'PC Hardware Repair, Upgrades & Fleet Servicing',
    shortDesc: 'Diagnostic troubleshooting, SSD speed upgrades, thermal servicing, virus eradication, and genuine software licensing.',
    fullDesc: 'Is your computer running painfully slow? In 95% of cases, upgrading your traditional mechanical hard drive to a Solid State Drive (SSD) and cleaning cooling fans speeds up your PC by 500% at a fraction of the cost of a new machine.',
    deliverables: [
      'Comprehensive hardware diagnostics & dusting',
      'SSD solid-state drive cloning & installation',
      'Malware & spyware removal with premium antivirus installation',
      'Operating system update & licensing check'
    ],
    estimatedTime: '24 – 48 hours',
    priceEstimate: 'From K180 PGK'
  },

  // Training
  {
    id: 'training-excel',
    category: 'training',
    title: 'Microsoft Excel for Business & Administration',
    shortDesc: 'Hands-on practical training in formulas, data organization, payroll calculation, inventory ledgers, and pivot summaries.',
    fullDesc: 'Equip your staff with the single most valuable administrative skill in modern commerce. Taught by experienced practitioners using real-world Milne Bay business scenarios.',
    deliverables: [
      'Interactive classroom / lab training (12 hours total)',
      'Printed reference guidebook & digital sample spreadsheets',
      'Practical assessment & certificate of completion',
      '1-month post-training tutor support'
    ],
    estimatedTime: '2 weeks (evening or weekend cohorts)',
    priceEstimate: 'K400 PGK per participant',
    badge: 'Most Requested'
  },
  {
    id: 'training-digital-literacy',
    category: 'training',
    title: 'Digital Literacy & Computer Basics for Beginners',
    shortDesc: 'Designed for beginners, community leaders, and mature learners seeking confident keyboard, mouse, Windows, and internet skills.',
    fullDesc: 'Gain complete confidence navigating a PC. We cover typing fundamentals, managing folders, creating documents, browsing the internet safely, writing professional emails, and using flash drives.',
    deliverables: [
      'Step-by-step paced instruction with individual workstations',
      'Basic keyboarding & typing speed practice',
      'Personal email setup & professional communication guidelines',
      'Certificate of Attendance'
    ],
    estimatedTime: '10 hours (5 sessions)',
    priceEstimate: 'K300 PGK per participant'
  },
  {
    id: 'training-corporate-bespoke',
    category: 'training',
    title: 'Custom Corporate & NGO Workforce Workshops',
    shortDesc: 'On-site training tailored to your company workflow, record keeping procedures, and specialized software needs.',
    fullDesc: 'We come directly to your office, hospital, or school premises anywhere in Milne Bay Province. We assess your teams skill gaps and deliver targeted curriculum that immediately boosts daily productivity.',
    deliverables: [
      'Pre-training skills assessment survey',
      'Tailored workbook reflecting your organizations templates',
      'Group cohort training at your site or our Alotau facility',
      'Management completion report & individual certificates'
    ],
    estimatedTime: 'Flexible (1 – 3 days intensive)',
    priceEstimate: 'Group package rates available'
  }
];

export const TRAINING_COURSES: TrainingCourse[] = [
  {
    id: 'excel-pro',
    title: 'Microsoft Excel Masterclass for Business',
    level: 'Beginner to Intermediate',
    duration: '2 Weeks (12 Hours)',
    targetAudience: 'Office administrators, accounts clerks, store managers, project officers',
    overview: 'Learn to design practical business spreadsheets, calculate wages, track stock, generate invoices, and automate calculations using IF, VLOOKUP, SUMIFS, and Pivot Tables.',
    modules: [
      'Module 1: Excel Interface, Cell Referencing & Data Formatting',
      'Module 2: Essential Formulas (SUM, AVERAGE, COUNTIF, IF, AND/OR)',
      'Module 3: Advanced Lookups (VLOOKUP, XLOOKUP) & Error Handling',
      'Module 4: Designing Business Templates: Invoicing & Stock Ledgers',
      'Module 5: Data Analysis, Charts & Pivot Table Reports',
      'Module 6: Protecting Workbooks, Printing Setup & Practical Exam'
    ],
    costPerParticipant: 'K400 PGK',
    certificate: true
  },
  {
    id: 'digital-starter',
    title: 'Core Digital Literacy & Workplace Computing',
    level: 'Beginner',
    duration: '1 Week (10 Hours)',
    targetAudience: 'School leavers, entrepreneurs, SME owners, front-desk staff',
    overview: 'Build unshakeable foundational confidence in Windows OS, typing, document formatting in MS Word, email etiquette, file organization, and safe internet browsing.',
    modules: [
      'Module 1: Understanding Hardware, Mouse, Keyboard & Windows Navigation',
      'Module 2: File Management: Folders, Renaming, USB Flash Drives & Search',
      'Module 3: Microsoft Word Essentials: Formatting Letters, Notices & Forms',
      'Module 4: Internet Browsing, Online Forms & Search Skills',
      'Module 5: Gmail/Email: Composing, Attachments & Spam Safety',
      'Module 6: Introduction to Scanning, Printing & PDF Documents'
    ],
    costPerParticipant: 'K300 PGK',
    certificate: true
  },
  {
    id: 'cyber-safety',
    title: 'Small Business Cybersecurity & Data Protection',
    level: 'All Levels',
    duration: '1 Day Intensive (6 Hours)',
    targetAudience: 'Business owners, managers, IT point-of-contacts, bank account handlers',
    overview: 'Learn how to protect your organization from mobile money scams, phishing emails, ransomware, social engineering, and unauthorized password access.',
    modules: [
      'Module 1: Modern Threat Landscape in PNG (Phishing, WhatsApp scams, Malware)',
      'Module 2: Strong Password Strategies & Multi-Factor Authentication (2FA)',
      'Module 3: Safe Electronic Banking & Mobile Money Procedures',
      'Module 4: Recognizing Suspicious Email Attachments & Malicious Links',
      'Module 5: Backup Routines & Emergency Incident Response Steps'
    ],
    costPerParticipant: 'K250 PGK',
    certificate: true
  }
];

export const INDUSTRIES_SERVED: IndustrySolution[] = [
  {
    id: 'agriculture',
    title: 'Agriculture, Cocoa & Copra Cooperatives',
    iconName: 'Sprout',
    description: 'Empowering farmer associations and commodities traders across Milne Bay islands with offline-resilient inventory records, solar-compatible ICT, and statutory cooperative compliance.',
    challenges: [
      'Remote locations with unreliable grid electricity and limited cellular coverage',
      'Disorganized handwritten weigh-bills and bag intake records causing cash leakage',
      'Difficulty maintaining IPA cooperative registration and opening commercial bank accounts'
    ],
    solutions: [
      'Ruggedized solar-powered laptop setups with offline spreadsheet ledgers',
      'Standardized farmer payout receipts and weigh-bridge reconciliation sheets',
      'Complete IPA Association and Cooperative Society registration & IRC TIN documentation'
    ],
    milneBayExample: 'Tailored for cocoa farmer associations and agricultural cooperatives across Suau and Samarai-Murua seeking computerized buying ledgers and IPA compliance.'
  },
  {
    id: 'tourism',
    title: 'Tourism, Eco-Lodges & Marine Diving',
    iconName: 'Palmtree',
    description: 'Connecting world-class Milne Bay dive resorts, island bungalows, and tour operators with guest Wi-Fi, online booking workflows, and TPA grant compliance.',
    challenges: [
      'Guests demanding reliable Wi-Fi across beachfront chalets and dive shops',
      'Managing reservation calendars and international wire payments',
      'Strict regulatory requirements for Tourism Promotion Authority (TPA) certification'
    ],
    solutions: [
      'Long-range weatherproof Ubiquiti Wi-Fi mesh covering coastal properties',
      'Digital booking templates and secure guest database management',
      'IPA annual returns update and IRC Certificate of Compliance for tourism funding'
    ],
    milneBayExample: 'Designed for eco-resorts and island guest houses needing multi-point Wi-Fi and updated statutory compliance for tourism grants.'
  },
  {
    id: 'retail',
    title: 'Retail Stores, Wholesalers & Bakeries',
    iconName: 'ShoppingBag',
    description: 'Modernizing Alotau retail merchants with point-of-sale setups, IP CCTV surveillance, and daily cash-drawer audit procedures.',
    challenges: [
      'Stock shrinkage, unaccounted inventory, and shoplifting in busy retail aisles',
      'Staff struggling with manual calculations and receipt reconciliation',
      'Lack of clear daily profit-and-loss visibility'
    ],
    solutions: [
      'Full-coverage 4K IP CCTV cameras with night vision and remote phone viewing',
      'Barcode scanner integration and computerized daily sales tally ledgers',
      'Cashier staff training on till reconciliation and digital invoicing'
    ],
    milneBayExample: 'Configured for general dealers and bakeries in Alotau seeking shrinkage prevention and accurate daily cash reconciliation.'
  },
  {
    id: 'education',
    title: 'Schools, Training Colleges & Health Clinics',
    iconName: 'Building2',
    description: 'Supporting educational institutions and health authorities with student computer labs, administrative record keeping, and staff capacity building.',
    challenges: [
      'Computer labs with viruses, unactivated software, and non-working hardware',
      'Teachers and health workers lacking formal computer productivity training',
      'Difficulty safeguarding sensitive student marks and patient medical folders'
    ],
    solutions: [
      'Refurbishment, memory upgrades, and clean operating system deployment for lab PCs',
      'Structured on-site Microsoft Excel and Office workshops for teachers and nursing staff',
      'Centralized automated backup routines preventing data loss'
    ],
    milneBayExample: 'Curated for local community schools and provincial health clinics needing computer lab servicing and staff spreadsheet capacity building.'
  },
  {
    id: 'maritime',
    title: 'Maritime, Boat Operators & Coastal Shipping',
    iconName: 'Anchor',
    description: 'Providing logistical support, vessel charter documentation, communication setups, and business advisory for Milne Bay maritime operators.',
    challenges: [
      'Coordinating dinghy and coastal vessel charters across maritime island clusters',
      'Fuel consumption and charter expense tracking',
      'Complying with National Maritime Safety Authority (NMSA) and commercial registry requirements'
    ],
    solutions: [
      'Trip manifest and vessel operating cost tracking templates in Excel',
      'Branded charter quotation and invoice design for corporate clients',
      'IPA company registration and tax compliance for boat charter fleets'
    ],
    milneBayExample: 'Structured for passenger dinghies and cargo boat operators seeking to formalize business names and qualify for corporate charter work.'
  }
];

export interface WorkingStep {
  step: string;
  title: string;
  desc: string;
  iconName: string;
}

export const HOW_WE_WORK_STEPS: WorkingStep[] = [
  {
    step: '01',
    title: 'Free Initial Assessment & Listening Session',
    desc: 'We visit your premises in Alotau or review your documents at no charge. We listen to your specific operational goals, pain points, and budget.',
    iconName: 'Search'
  },
  {
    step: '02',
    title: 'Transparent, Plain-Language Scope',
    desc: 'No confusing technical jargon or surprise invoices. You receive an itemized proposal in PNG Kina (PGK) detailing deliverables, timelines, and exact costs.',
    iconName: 'FileText'
  },
  {
    step: '03',
    title: 'Hands-On Local Implementation',
    desc: 'We do the work locally on-site in Milne Bay—whether wiring network cables, setting up CCTV cameras, or submitting statutory IPA forms.',
    iconName: 'Wrench'
  },
  {
    step: '04',
    title: 'Post-Launch Support & Follow-Up Guarantee',
    desc: 'As a newly launched local firm, your success defines our reputation. Every project includes a 30-day follow-up check-in and ongoing support.',
    iconName: 'ShieldCheck'
  }
];

export const FOUNDING_OFFERS = [
  {
    title: 'Free Initial Systems & Compliance Audit',
    desc: 'Available for Milne Bay businesses, cooperatives, schools, and lodges ready to upgrade their tech or formalize registrations.',
    actionText: 'Book Free Audit'
  },
  {
    title: 'Founding Client Introductory Rates',
    desc: 'Special discounted consultation packages for our first cohort of Milne Bay enterprises and training candidates.',
    actionText: 'Request Quote'
  },
  {
    title: 'Direct Founder & Local Team Access',
    desc: 'Work directly with founder Stallone Yabom and local Alotau consultants with zero red tape or remote delays.',
    actionText: 'Contact Office'
  }
];

export const FAQS = [
  {
    q: 'Where is KILSTA Business & ICT Consultants located?',
    a: 'We are based locally right in Alotau Town, Milne Bay Province, Papua New Guinea. We serve clients across Alotau Urban, Suau, Samarai-Murua, Esaala, and Kiriwina-Goodenough.'
  },
  {
    q: 'Is KILSTA an officially registered business in Papua New Guinea?',
    a: 'Yes, absolutely. KILSTA is fully registered with the Investment Promotion Authority under IPA Registration 6-129295384, and with the Internal Revenue Commission under TIN 502603269.'
  },
  {
    q: 'What does the Free IT & Business Systems Audit include?',
    a: 'Our systems audit is a complimentary assessment where we inspect your existing computer hardware, network reliability, data backup safety, and IPA/IRC statutory compliance. We provide a plain-language summary report highlighting vulnerabilities, cost-saving recommendations, and an action plan.'
  },
  {
    q: 'Do you offer on-site computer training for companies and schools?',
    a: 'Yes. While we hold regular scheduled training sessions in Alotau, we frequently deliver custom on-site group workshops for organizations, health facilities, schools, and NGOs throughout Milne Bay.'
  },
  {
    q: 'How long does an IPA Business Name or Company registration take?',
    a: 'Once all applicant details and National Identification (NID) / ID cards are verified, name reservation and statutory lodgement with the IPA typically takes 3 to 5 business days.'
  }
];
