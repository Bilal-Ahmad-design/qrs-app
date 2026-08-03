/**
 * Default fallback sections for pages
 * Used when CMS data is not available
 * All sections are editable from Payload CMS admin panel
 */

export const defaultHomeSections = [
  {
    id: 'hero',
    title: 'Hero Section',
    subtitle: 'Patent Pending: QRS-001-PROV',
    heading: 'Run catastrophe models in seconds. Release billions in trapped capital.',
    description:
      'Every number cryptographically signed and independently verifiable.',
    sectionType: 'hero',
    backgroundStyle: 'dark',
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
    heading: 'ACTIVE MODELS',
    sectionType: 'feature-grid',
    backgroundStyle: 'light',
    items: [
      {
        title: 'North Atlantic Hurricane',
        icon: '🌀',
      },
      {
        title: 'California Wildfire',
        icon: '🔥',
      },
      {
        title: 'European Wind',
        icon: '💨',
      },
      {
        title: 'Japan Typhoon',
        icon: '🌊',
      },
    ],
    order: 1,
    published: true,
  },
  {
    id: 'verifiable-by-design',
    title: 'Verifiable by Design',
    heading: 'Verifiable by Design',
    description:
      'Every calculation is cryptographically signed and independently verifiable. Built-in reproducibility, not an afterthought.',
    sectionType: 'text-image',
    backgroundStyle: 'white',
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
    backgroundStyle: 'dark',
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
    backgroundStyle: 'white',
    items: [
      {
        value: '$10B+',
        title: 'Insured Losses',
        description: '2023-2024 catastrophic events driving capital constraints',
      },
      {
        value: '$8-12B',
        title: 'Excess Capital Trapped',
        description: 'Reinsurance capital unable to deploy due to model uncertainty',
      },
      {
        value: '300%',
        title: 'FAIR Plan Surge',
        description: 'State insurance of last resort reaching capacity limits',
      },
      {
        value: '14x',
        title: 'Model Divergence',
        description: 'Vendor modeling outputs diverge by factor of 14 on same exposure',
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
    backgroundStyle: 'light',
    items: [
      {
        value: '01',
        title: 'Upload Portfolio',
        description: 'Ingest exposure data in your native format',
      },
      {
        value: '02',
        title: 'Run Model',
        description: 'Quantum-optimized catastrophe modeling engine',
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
    title: 'Independently Validated',
    heading: 'Independently Validated',
    description:
      'QRS models are independently verified by leading academic and industry experts',
    sectionType: 'feature-grid',
    backgroundStyle: 'white',
    items: [
      {
        title: 'SSRN Validation Study',
        description:
          'Peer-reviewed quantitative validation of QRS portfolio analytics methodology',
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
    backgroundStyle: 'dark',
    buttonText: 'Request Demo',
    buttonUrl: '/platform',
    order: 7,
    published: true,
  },
]

export const defaultAboutSections = [
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

export const defaultPlatformSections = [
  {
    id: 'hero',
    title: 'Quantitative Risk Platform',
    heading: 'Quantitative Risk Platform',
    description:
      'Enterprise-grade risk analytics built for institutional investors, asset managers, and reinsurance professionals.',
    sectionType: 'hero',
    backgroundStyle: 'dark',
    order: 0,
    published: true,
  },
  {
    id: 'capabilities',
    title: 'Core Capabilities',
    heading: 'Core Capabilities',
    sectionType: 'feature-grid',
    backgroundStyle: 'light',
    items: [
      {
        title: 'Portfolio Analytics',
        description:
          'Real-time VaR, TVaR, and scenario analysis across multi-asset portfolios with instant recalculation.',
      },
      {
        title: 'Stress Testing',
        description:
          'Historical and hypothetical scenarios with cryptographic reproducibility for audit compliance.',
      },
      {
        title: 'Risk Reporting',
        description:
          'Auditable risk reports with verified calculations and complete lineage tracking for every metric.',
      },
    ],
    order: 1,
    published: true,
  },
]

export const defaultTrustSections = [
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
    sectionType: 'feature-grid',
    backgroundStyle: 'light',
    items: [
      {
        title: 'Cryptographic Reproducibility',
        description:
          'Every calculation is cryptographically signed with our ECDSA seal. Independently verify any analysis using open-source verification tools.',
        icon: '🔐',
      },
      {
        title: 'Compliance Certifications',
        description:
          'SOC 2 audit in progress via Vanta, supported by structured controls, deployment monitoring, and a growing evidence trail for customer diligence and audit readiness.',
        icon: '✓',
      },
    ],
    order: 1,
    published: true,
  },
]

export const defaultValidationSections = [
  {
    id: 'hero',
    title: 'Independently Verified',
    heading: 'Independently Verified',
    description:
      'QRS models have been independently validated by leading academic and industry experts to ensure calculation accuracy and methodological rigor.',
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

export const defaultSectionsByPage: Record<string, any[]> = {
  home: defaultHomeSections,
  about: defaultAboutSections,
  platform: defaultPlatformSections,
  trust: defaultTrustSections,
  validation: defaultValidationSections,
}

export function getDefaultSections(page: string) {
  return defaultSectionsByPage[page] || []
}
