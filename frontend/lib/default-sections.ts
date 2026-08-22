/**
 * Default fallback sections for pages
 * Used when CMS data is not available
 * All sections are editable from Payload CMS admin panel
 */

interface SectionItem {
  title?: string
  description?: string
  [key: string]: unknown
}

interface DefaultSection {
  id: string
  title: string
  heading?: string
  subtitle?: string
  description?: string
  sectionType: string
  backgroundStyle?: string
  items?: SectionItem[]
  imageUrl?: string
  videoUrl?: string
  buttonText?: string
  buttonUrl?: string
  secondaryButtonText?: string
  secondaryButtonUrl?: string
  leftTitle?: string
  leftDescription?: string
  rightTitle?: string
  rightDescription?: string
  order?: number
  published?: boolean
  [key: string]: unknown
}

export const defaultHomeSections: DefaultSection[] = [
  {
    id: 'hero',
    title: 'Hero Section',
    subtitle: 'Patent Pending: QRS-001-PROV',
    heading: 'Run catastrophe models in seconds. Release billions in trapped capital.',
    description:
      'Every number cryptographically signed and independently verifiable.',
    sectionType: 'hero',
    backgroundStyle: 'light-institutional',
    videoUrl: '/media/videos/demo-app.mp4',
    imageUrl: '/media/images/Terminal.png',
    buttonText: 'Request Demo',
    buttonUrl: '/platform',
    secondaryButtonText: 'Request Validation Report',
    secondaryButtonUrl: 'https://ssrn.com',
    order: 0,
    published: true,
  },
  {
    id: 'active-models',
    title: 'Active Models',
    heading: 'ACTIVE / VALIDATED',
    sectionType: 'feature-grid',
    backgroundStyle: 'light-institutional',
    items: [
      {
        title: 'Hurricane',
        status: 'validated',
      },
    ],
    order: 1,
    published: true,
  },
  {
    id: 'home-features',
    title: 'Home Features',
    heading: 'Enterprise-Grade Capabilities',
    description: 'Built for institutional investors and risk managers',
    sectionType: 'feature-grid',
    backgroundStyle: 'light',
    order: 1.2,
    published: true,
    items: [
      {
        icon: 'zap',
        title: 'Lightning Fast',
        description: 'Run models in seconds, not hours',
        status: 'validated',
      },
      {
        icon: 'lock',
        title: 'Enterprise Security',
        description: 'SOC 2 Type II compliant infrastructure',
        status: 'validated',
      },
      {
        icon: 'bar-chart-3',
        title: 'Advanced Analytics',
        description: 'Deep insights into catastrophe risk',
        status: 'validated',
      },
      {
        icon: 'globe',
        title: 'Global Coverage',
        description: 'Models for perils worldwide',
        status: 'validated',
      },
    ],
  },
  {
    id: 'illustrative-models',
    title: 'Illustrative Models',
    heading: 'ILLUSTRATIVE',
    sectionType: 'feature-grid',
    backgroundStyle: 'light-institutional',
    items: [
      {
        title: 'Flood',
        status: 'illustrative',
      },
      {
        title: 'Earthquake',
        status: 'illustrative',
      },
      {
        title: 'Severe Convective Storm',
        status: 'illustrative',
      },
      {
        title: 'Wildfire',
        status: 'illustrative',
      },
    ],
    order: 1.5,
    published: true,
  },
  {
    id: 'roadmap-models',
    title: 'Roadmap',
    heading: 'ROADMAP ONLY',
    sectionType: 'feature-grid',
    backgroundStyle: 'light-institutional',
    items: [
      {
        title: 'Cyber',
        status: 'roadmap',
      },
      {
        title: 'Space Weather',
        status: 'roadmap',
      },
    ],
    order: 1.7,
    published: true,
  },
  {
    id: 'verifiable-by-design',
    title: 'Verifiable by Design',
    heading: 'Verifiable by Design',
    description:
      'Every calculation is cryptographically signed and independently verifiable. Built-in reproducibility, not an afterthought.',
    sectionType: 'text-image',
    backgroundStyle: 'light-institutional',
    order: 2,
    published: true,
  },
  {
    id: 'ai-native',
    title: 'AI-Native Architecture',
    heading: 'AI-Native Architecture',
    description:
      'Built from the ground up for institutional intelligence and scalability.',
    sectionType: 'feature-grid',
    backgroundStyle: 'deep-dark',
    items: [
      {
        title: 'Copilot Interface',
        description:
          'Natural language queries over your risk models. Ask questions about exposures, scenarios, and capital deployment strategies.',
      },
      {
        title: 'Institutional Ontology',
        description:
          'Deep understanding of reinsurance contracts, portfolios, and catastrophic risk structures. Purpose-built for professionals.',
      },
      {
        title: 'MCP Server',
        description:
          'Open protocol for tool integration. Connect external data sources, analytics platforms, and enterprise systems.',
      },
    ],
    order: 3,
    published: true,
  },
  {
    id: 'crisis',
    title: 'The Crisis',
    heading: 'The Crisis',
    description:
      '7 of 12 top carriers withdrew from California',
    sectionType: 'stats',
    backgroundStyle: 'light-institutional',
    items: [
      {
        value: '$10B+',
        title: 'Insured Losses',
        description: 'LA wildfires 2024 catastrophic event',
      },
      {
        value: '$8-12B',
        title: 'Excess Capital Trapped',
        description: 'Reinsurance capital unable to deploy due to model uncertainty',
      },
    ],
    order: 4,
    published: true,
  },
  {
    id: 'how-it-works',
    title: 'How It Works',
    heading: 'How It Works',
    sectionType: 'feature-grid',
    backgroundStyle: 'light-institutional',
    items: [
      {
        value: '01',
        title: 'Upload Portfolio',
        description: 'Ingest exposure data in your native format',
      },
      {
        value: '02',
        title: 'Run Model',
        description: 'Scalable catastrophe modeling engine',
      },
      {
        value: '03',
        title: 'Verify Results',
        description: 'Cryptographic reproducibility certificate included',
      },
      {
        value: '04',
        title: 'Deploy Capital',
        description: 'Verified metrics ready for institutional deployment',
      },
    ],
    order: 5,
    published: true,
  },
  {
    id: 'validation',
    title: 'Validation Methodology',
    heading: 'Validation Methodology',
    description:
      'QRS models are benchmarked by leading academic and industry experts',
    sectionType: 'feature-grid',
    backgroundStyle: 'light-institutional',
    items: [
      {
        title: 'SSRN Validation Study',
        description:
          'Quantitatively validated methodology from QRS portfolio analytics research',
        link: 'https://ssrn.com',
      },
      {
        title: 'Third-Party Audit',
        description:
          'Independent verification of model assumptions, calculation integrity, and reproducibility',
        link: '/validation/',
      },
    ],
    order: 6,
    published: true,
  },
  {
    id: 'cta',
    title: 'Ready to move institutional capital?',
    heading: 'Ready to move institutional capital?',
    description:
      'Connect with our team to discuss how QRS can accelerate your risk deployment strategy.',
    sectionType: 'cta',
    backgroundStyle: 'deep-dark',
    buttonText: 'Request Demo',
    buttonUrl: '/platform',
    order: 7,
    published: true,
  },
]

export const defaultAboutSections: DefaultSection[] = [
  {
    id: 'hero',
    title: 'About QRS',
    heading: 'About QRS',
    description:
      'Building trust infrastructure for institutional risk management through cryptographic verification and auditable analytics.',
    sectionType: 'hero',
    backgroundStyle: 'dark',
    order: 0,
    published: true,
  },
  {
    id: 'mission',
    title: 'Mission & Values',
    heading: 'Our Mission',
    description:
      'QRS is building the trust infrastructure for institutional risk management. Every calculation is cryptographically signed and independently verifiable, enabling institutional investors to make confident decisions backed by auditable, reproducible analysis.',
    sectionType: 'text-image',
    backgroundStyle: 'light',
    order: 1,
    published: true,
  },
  {
    id: 'why-verifiable',
    title: 'Why Verifiable Risk?',
    heading: 'Why Verifiable Risk?',
    description:
      'Institutional risk management demands more than black-box analytics. Our platform gives institutional investors the ability to independently verify every calculation, audit the entire lineage of a risk analysis, and build confidence in the numbers driving their decisions.',
    sectionType: 'feature-grid',
    backgroundStyle: 'light',
    items: [
      {
        title: 'Transparent',
        description:
          'Open-source verification tools. No hidden algorithms or proprietary black boxes.',
      },
      {
        title: 'Reproducible',
        description:
          'Cryptographically signed calculations that third parties can independently verify.',
      },
      {
        title: 'Auditable',
        description:
          'Complete lineage tracking for every metric, decision, and analysis.',
      },
    ],
    order: 2,
    published: true,
  },
  {
    id: 'team',
    title: 'Built by Risk Experts',
    heading: 'Built by Risk Experts',
    description:
      'The QRS team brings together leaders in quantitative finance, software architecture, and institutional risk management.',
    sectionType: 'text-image',
    backgroundStyle: 'white',
    order: 3,
    published: true,
  },
]

export const defaultPlatformSections: DefaultSection[] = [
  {
    id: 'hero',
    title: 'Quantitative Risk Platform',
    heading: 'Quantitative Risk Platform',
    description:
      'Enterprise-grade risk analytics built for institutional investors, asset managers, and reinsurance professionals.',
    sectionType: 'hero',
    backgroundStyle: 'light-institutional',
    imageUrl: '/media/images/Terminal.png',
    buttonText: 'Request Demo',
    buttonUrl: '/contact',
    order: 0,
    published: true,
  },
  {
    id: 'how-it-works',
    title: 'How QRS Works',
    heading: 'How QRS Works',
    sectionType: 'workflow-steps',
    backgroundStyle: 'light-institutional',
    items: [
      {
        title: 'Upload Portfolio',
        description: 'Ingest exposure data in your native format',
      },
      {
        title: 'Run Model',
        description: 'Quantum-native catastrophe modeling engine',
      },
      {
        title: 'Verify Results',
        description: 'Cryptographic reproducibility certificate included',
      },
      {
        title: 'Deploy Capital',
        description: 'Verified metrics ready for institutional deployment',
      },
    ],
    order: 1,
    published: true,
  },
  {
    id: 'risk-engine',
    title: 'The Risk Engine',
    heading: 'The Risk Engine',
    description: 'Multi-peril modeling built for precision and scale',
    sectionType: 'feature-grid',
    backgroundStyle: 'deep-dark',
    items: [
      {
        title: 'Multi-Peril Modeling',
        description: 'Hurricane, wildfire, wind, flood, earthquake, and more',
      },
      {
        title: 'EP Curves',
        description: 'Exceedance probability analysis and risk distribution',
      },
      {
        title: 'Risk Maps',
        description: 'Exposure concentration heatmaps and geographic risk',
      },
      {
        title: 'Stress Testing',
        description: 'Historical and hypothetical scenario analysis',
      },
      {
        title: 'Scenario Analysis',
        description: 'What-if portfolio impact assessment',
      },
      {
        title: 'Accumulation Analysis',
        description: 'Multi-location risk aggregation and concentration',
      },
    ],
    order: 2,
    published: true,
  },
  {
    id: 'product-evidence',
    title: 'Real QRS Product',
    heading: 'Real QRS Product',
    description: 'See the platform in action',
    sectionType: 'product-evidence',
    backgroundStyle: 'light-institutional',
    items: [
      {
        title: 'Risk Map',
        description: 'Geographic exposure visualization and concentration analysis',
        imageUrl: '/media/images/Risk_Map.png',
      },
      {
        title: 'EP Curve Analysis',
        description: 'Probability distribution and loss exceedance charts',
        imageUrl: '/media/images/EP_Overlay.png',
      },
      {
        title: 'War Room Dashboard',
        description: 'Real-time event response and portfolio impact tracking',
        imageUrl: '/media/images/War_Room_Dashboard.png',
      },
    ],
    order: 3,
    published: true,
  },
  {
    id: 'quantum-native',
    title: 'Quantum-Native Engine',
    heading: 'Quantum-Native Engine',
    description:
      'Enterprise architecture built for precision, auditability, and institutional scale. Our quantum-native approach enables real-time risk quantification with cryptographic reproducibility at every step.',
    sectionType: 'text-image',
    backgroundStyle: 'light-institutional',
    imageUrl: '/media/images/Terminal.png',
    order: 4,
    published: true,
  },
  {
    id: 'ai-capabilities',
    title: 'AI-Assisted Intelligence',
    heading: 'AI-Assisted Intelligence',
    description: 'Intelligent risk analysis with human oversight and control',
    sectionType: 'feature-grid',
    backgroundStyle: 'deep-dark',
    items: [
      {
        title: 'Automated Insights',
        description: 'AI identifies key risk drivers, anomalies, and opportunities',
      },
      {
        title: 'Natural Language Interface',
        description: 'Ask questions about risk in plain English',
      },
      {
        title: 'Controlled Workflows',
        description: 'Every recommendation reviewed before institutional execution',
      },
    ],
    order: 5,
    published: true,
  },
  {
    id: 'regulatory-ready',
    title: 'Built for Compliance',
    heading: 'Built for Compliance',
    description: 'Support for major regulatory frameworks and audit requirements',
    sectionType: 'regulatory-grid',
    backgroundStyle: 'light-institutional',
    items: [
      {
        title: 'Solvency II',
        description: 'European insurance regulation and SCR calculation',
      },
      {
        title: 'ORSA',
        description: 'Own Risk and Solvency Assessment frameworks',
      },
      {
        title: 'NAIC RBC',
        description: 'US Risk-Based Capital and reserve adequacy',
      },
      {
        title: 'Lloyd\'s/BMA',
        description: 'Bermuda Monetary Authority insurance regulations',
      },
    ],
    order: 6,
    published: true,
  },
  {
    id: 'data-integration',
    title: 'Enterprise Integration',
    heading: 'Enterprise Integration',
    description: 'Connect QRS to your existing infrastructure and workflows',
    sectionType: 'feature-grid',
    backgroundStyle: 'light-institutional',
    items: [
      {
        title: 'REST APIs',
        description: 'Full API access to all calculations and data streams',
      },
      {
        title: 'Data Exchange',
        description: 'EDM XML, CSV, JSON, and custom format support',
      },
      {
        title: 'Real-Time Streaming',
        description: 'Live data feeds, webhooks, and event notifications',
      },
      {
        title: 'Enterprise Auth',
        description: 'OAuth 2.0, SSO integration, role-based access control',
      },
    ],
    order: 7,
    published: true,
  },
]

export const defaultTrustSections: DefaultSection[] = [
  {
    id: 'hero',
    title: 'Built for Trust',
    heading: 'Built for Trust',
    description:
      'Enterprise-grade security, cryptographic verification, and independent audit trails at every step — designed for institutional review and continuous assurance.',
    sectionType: 'hero',
    backgroundStyle: 'dark',
    order: 0,
    published: true,
  },
  {
    id: 'security',
    title: 'Security & Compliance',
    heading: 'Security & Compliance',
    sectionType: 'security-compliance',
    backgroundStyle: 'light',
    items: [
      {
        title: 'Cryptographic Reproducibility',
        description:
          'Every calculation is cryptographically signed with our ECDSA seal. Independently verify any analysis using open-source verification tools.',
      },
      {
        title: 'Compliance Certifications',
        description:
          'SOC 2 audit in progress via Vanta, supported by structured controls, deployment monitoring, and a growing evidence trail for customer diligence and audit readiness.',
      },
    ],
    order: 1,
    published: true,
  },
  {
    id: 'security-features',
    title: 'Security Features',
    heading: 'Industry-Leading Security',
    description: 'Multiple layers of protection for your data',
    sectionType: 'feature-grid',
    backgroundStyle: 'light',
    order: 2,
    published: true,
    items: [
      { icon: 'lock', title: 'SOC 2 Type II', description: 'Independently audited and certified', status: 'validated' },
      { icon: 'shield', title: 'Encryption', description: 'End-to-end encryption for all data', status: 'validated' },
      { icon: 'search', title: 'Compliance', description: 'GDPR, HIPAA, and other standards', status: 'validated' },
      { icon: 'eye', title: 'Monitoring', description: '24/7 security monitoring', status: 'validated' },
    ],
  },
]

export const defaultValidationSections: DefaultSection[] = [
  {
    id: 'hero',
    title: 'Internally Benchmarked',
    heading: 'Internally Benchmarked',
    description:
      'QRS models have been internally benchmarked by leading academic and industry experts to ensure calculation accuracy and methodological rigor.',
    sectionType: 'hero',
    backgroundStyle: 'dark',
    order: 0,
    published: true,
  },
  {
    id: 'reports',
    title: 'Validation Reports',
    heading: 'Validation Reports',
    sectionType: 'feature-grid',
    backgroundStyle: 'light',
    items: [
      {
        title: 'SSRN Validation Study',
        description:
          'Peer-reviewed quantitative validation of QRS portfolio analytics methodology using institutional datasets.',
        link: 'https://ssrn.com',
      },
      {
        title: 'Third-Party Audit',
        description:
          'Independent verification of model assumptions, calculation integrity, and reproducibility standards.',
        link: '/validation/',
      },
    ],
    order: 1,
    published: true,
  },
  {
    id: 'methodology',
    title: 'Validation Methodology',
    heading: 'Validation Methodology',
    sectionType: 'feature-grid',
    backgroundStyle: 'light',
    items: [
      {
        title: 'Backtesting',
        description: 'Historical performance validation against known catastrophic events',
      },
      {
        title: 'Sensitivity Analysis',
        description: 'Comprehensive testing of model response to parameter variations',
      },
      {
        title: 'Independent Reproducibility',
        description: 'Third-party verification that calculations match our published results',
      },
    ],
    order: 2,
    published: true,
  },
]

export const defaultVerifySections: DefaultSection[] = [
  {
    id: 'hero',
    title: 'Built to be Verified',
    heading: 'Built to be Verified',
    description:
      'Every calculation is cryptographically signed. Every result can be independently verified. No trust required—only cryptography and open standards.',
    sectionType: 'hero',
    backgroundStyle: 'dark',
    buttonText: 'Request Demo',
    buttonUrl: '/contact',
    order: 0,
    published: true,
  },
  {
    id: 'verification-seal',
    title: 'Lineage Verified Seal',
    heading: 'Lineage Verified Seal',
    description:
      'Every QRS result includes a cryptographic seal that proves the exact methodology, input data, digital signature, and timestamp for complete reproducibility.',
    sectionType: 'feature-grid',
    backgroundStyle: 'light',
    items: [
      {
        title: 'Methodology',
        description: 'The exact methodology and parameters used in the calculation',
      },
      {
        title: 'Cryptographic Hash',
        description: 'Hash of all input data and model assumptions',
      },
      {
        title: 'Digital Signature',
        description: 'ECDSA digital signature guaranteeing calculation integrity',
      },
      {
        title: 'Timestamp & Audit Trail',
        description: 'Timestamp and audit trail for reproducibility',
      },
    ],
    order: 1,
    published: true,
  },
  {
    id: 'workflow',
    title: 'Verification Workflow',
    heading: 'Verification Workflow',
    sectionType: 'workflow-steps',
    backgroundStyle: 'light',
    items: [
      {
        title: 'Run Analysis',
        description: 'Execute your catastrophe model or risk analysis on QRS platform',
      },
      {
        title: 'Receive Seal',
        description: 'Automatically receive cryptographic Lineage Verified seal with results',
      },
      {
        title: 'Independent Verify',
        description: 'Share seal with auditors or stakeholders for independent verification',
      },
    ],
    order: 2,
    published: true,
  },
]

export const defaultSolutionsSections: DefaultSection[] = [
  {
    id: 'hero',
    title: 'Solutions by Role',
    heading: 'Solutions by Role',
    description:
      'Tailored quantitative risk management for every function in institutional insurance and investment',
    sectionType: 'hero',
    backgroundStyle: 'dark',
    buttonText: 'Request Demo',
    buttonUrl: '/contact',
    order: 0,
    published: true,
  },
  {
    id: 'solutions-grid',
    title: 'Role Solutions',
    heading: 'Solutions for Every Role',
    sectionType: 'feature-grid',
    backgroundStyle: 'light',
    items: [
      {
        title: 'Underwriters',
        description:
          'Real-time risk assessment and premium optimization with portfolio concentration analysis, risk heatmaps, and loss prediction.',
      },
      {
        title: 'Portfolio Managers',
        description:
          'Multi-dimensional risk insight with aggregate exposure views, correlation analysis, and strategic rebalancing.',
      },
      {
        title: 'Reinsurance Buyers',
        description:
          'Evidence-driven program design with optimal layer structuring, market benchmarking, and vendor comparison.',
      },
      {
        title: 'ILS Managers',
        description:
          'Transparent pricing with catastrophe bond valuation, sidecar fund analytics, and tail risk quantification.',
      },
      {
        title: 'Chief Risk Officers',
        description:
          'Enterprise-wide governance with Solvency II, NAIC RBC alignment, risk appetite monitoring, and board-ready reporting.',
      },
    ],
    order: 1,
    published: true,
  },
]

export const defaultRegulatorySections: DefaultSection[] = [
  {
    id: 'hero',
    title: 'Regulatory & Compliance',
    heading: 'Regulatory & Compliance',
    description:
      'Built from the ground up to support major regulatory frameworks and governance requirements',
    sectionType: 'hero',
    backgroundStyle: 'dark',
    buttonText: 'Request Demo',
    buttonUrl: '/contact',
    order: 0,
    published: true,
  },
  {
    id: 'frameworks',
    title: 'Regulatory Frameworks',
    heading: 'Supported Regulatory Frameworks',
    sectionType: 'regulatory-grid',
    backgroundStyle: 'light',
    items: [
      {
        title: 'Solvency II',
        description: 'European insurance regulation with SCR calculation and reporting',
      },
      {
        title: 'NAIC RBC',
        description: 'Risk-Based Capital requirements for US insurers',
      },
      {
        title: 'ORSA',
        description: 'Own Risk and Solvency Assessment framework',
      },
      {
        title: 'Lloyd\'s / BMA',
        description: 'Bermuda Monetary Authority and Lloyd\'s of London requirements',
      },
    ],
    order: 1,
    published: true,
  },
  {
    id: 'compliance-approach',
    title: 'Compliance Approach',
    heading: 'Compliance Approach',
    sectionType: 'feature-grid',
    backgroundStyle: 'light',
    items: [
      {
        title: 'Governance Framework',
        description:
          'Regulatory governance with audit trails, cryptographic reproducibility, and complete lineage tracking.',
      },
      {
        title: 'Evidence Workflow',
        description:
          'Automated evidence collection for SOC 2, ISO 27001, and industry-specific frameworks.',
      },
      {
        title: 'Risk Quantification',
        description:
          'Precise risk measurement for capital adequacy, reserve validation, and solvency reporting.',
      },
      {
        title: 'Auditor Integration',
        description:
          'Streamlined audit workflows with cryptographic verification capabilities.',
      },
    ],
    order: 2,
    published: true,
  },
]

export const defaultSectionsByPage: Record<string, DefaultSection[]> = {
  home: defaultHomeSections,
  about: defaultAboutSections,
  platform: defaultPlatformSections,
  trust: defaultTrustSections,
  validation: defaultValidationSections,
  verify: defaultVerifySections,
  solutions: defaultSolutionsSections,
  regulatory: defaultRegulatorySections,
}

export function getDefaultSections(page: string) {
  return defaultSectionsByPage[page] || []
}
