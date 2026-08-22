import 'dotenv/config'
import { getPayload } from 'payload'
import config from './payload.config'

// Verify DATABASE_URL
if (!process.env.DATABASE_URL) {
  console.error('❌ DATABASE_URL not set!')
  console.error('Check .env.local or environment variables')
  process.exit(1)
}

console.warn('[Seed] Database URL configured:', process.env.DATABASE_URL.substring(0, 50) + '...')

const sections = [
  // HOME PAGE
  {
    page: 'home',
    sectionType: 'hero',
    title: 'Home Hero',
    subtitle: 'Enterprise Risk Platform',
    heading: 'Run catastrophe models in seconds',
    description: 'Release billions in trapped capital',
    backgroundStyle: 'light-institutional',
    order: 1,
    published: true,
    videoUrl: '/uploads/hero-background.mp4',
    imageUrl: '/uploads/dashboard-screenshot.png',
    buttonText: 'Start Free Trial',
    buttonUrl: '/signup',
    secondaryButtonText: 'Learn More',
    secondaryButtonUrl: '/platform',
  },
  {
    page: 'home',
    sectionType: 'feature-grid',
    title: 'Home Features',
    heading: 'Enterprise-Grade Capabilities',
    description: 'Built for institutional investors and risk managers',
    backgroundStyle: 'light',
    order: 2,
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
    page: 'home',
    sectionType: 'cta',
    title: 'Home CTA',
    heading: 'Ready to transform your risk analysis?',
    description: 'Join leading institutions using QRS for better decisions',
    backgroundStyle: 'deep-dark',
    order: 3,
    published: true,
    buttonText: 'Get Started Free',
    buttonUrl: '/signup',
  },

  // PLATFORM PAGE
  {
    page: 'platform',
    sectionType: 'hero',
    title: 'Platform Hero',
    subtitle: 'Advanced Platform',
    heading: 'Powerful Risk Modeling Platform',
    description: 'Integrated tools for catastrophe risk analysis',
    backgroundStyle: 'light-institutional',
    order: 1,
    published: true,
    imageUrl: '/uploads/platform-dashboard.png',
    buttonText: 'Explore Features',
    buttonUrl: '#features',
  },
  {
    page: 'platform',
    sectionType: 'feature-grid',
    title: 'Platform Features',
    heading: 'Complete Risk Management Suite',
    description: 'Everything you need for comprehensive catastrophe risk analysis',
    backgroundStyle: 'light',
    order: 2,
    published: true,
    items: [
      {
        icon: 'trending-up',
        title: 'Portfolio Analysis',
        description: 'Analyze risk across your entire portfolio',
        status: 'validated',
      },
      {
        icon: 'search',
        title: 'Detailed Reports',
        description: 'Comprehensive risk reports and metrics',
        status: 'validated',
      },
      {
        icon: 'link-2',
        title: 'API Integration',
        description: 'Integrate with your existing systems',
        status: 'validated',
      },
      {
        icon: 'settings',
        title: 'Customization',
        description: 'Tailor the platform to your needs',
        status: 'validated',
      },
    ],
  },

  // SOLUTIONS PAGE
  {
    page: 'solutions',
    sectionType: 'hero',
    title: 'Solutions Hero',
    subtitle: 'Industry Solutions',
    heading: 'Solutions for Every Risk Profile',
    description: 'Tailored approaches for different institutional needs',
    backgroundStyle: 'light-institutional',
    order: 1,
    published: true,
    buttonText: 'View Solutions',
    buttonUrl: '#solutions',
  },
  {
    page: 'solutions',
    sectionType: 'feature-grid',
    title: 'Solutions Grid',
    heading: 'Industry-Specific Solutions',
    description: 'Purpose-built for insurance, reinsurance, and alternative risk transfer',
    backgroundStyle: 'light',
    order: 2,
    published: true,
    items: [
      {
        icon: 'building-2',
        title: 'Insurance Solutions',
        description: 'Underwriting and portfolio management',
        status: 'validated',
      },
      {
        icon: 'globe',
        title: 'Reinsurance',
        description: 'Treaty evaluation and pricing',
        status: 'validated',
      },
      {
        icon: 'briefcase',
        title: 'Asset Owners',
        description: 'Portfolio risk assessment',
        status: 'validated',
      },
      {
        icon: 'target',
        title: 'Capital Markets',
        description: 'Securitization and risk transfer',
        status: 'validated',
      },
    ],
  },

  // REGULATORY PAGE
  {
    page: 'regulatory',
    sectionType: 'hero',
    title: 'Regulatory Hero',
    subtitle: 'Compliance & Regulation',
    heading: 'Meet Global Regulatory Requirements',
    description: 'Compliant with major international frameworks',
    backgroundStyle: 'light-institutional',
    order: 1,
    published: true,
    buttonText: 'View Compliance',
    buttonUrl: '#compliance',
  },
  {
    page: 'regulatory',
    sectionType: 'feature-grid',
    title: 'Regulatory Frameworks',
    heading: 'Supporting Major Regulations',
    description: 'Comprehensive support for global regulatory requirements',
    backgroundStyle: 'light',
    order: 2,
    published: true,
    items: [
      {
        icon: '✓',
        title: 'Solvency II',
        description: 'EU insurance regulation compliant',
        status: 'validated',
      },
      {
        icon: '✓',
        title: 'NAIC Model Law',
        description: 'US insurance regulatory framework',
        status: 'validated',
      },
      {
        icon: '✓',
        title: 'Basel III',
        description: 'Banking capital requirements',
        status: 'validated',
      },
      {
        icon: '✓',
        title: 'EIOPA Guidelines',
        description: 'European supervisory guidelines',
        status: 'validated',
      },
    ],
  },

  // TRUST PAGE
  {
    page: 'trust',
    sectionType: 'hero',
    title: 'Trust Hero',
    subtitle: 'Trust & Security',
    heading: 'Enterprise-Grade Security & Compliance',
    description: 'Your data security is our top priority',
    backgroundStyle: 'light-institutional',
    order: 1,
    published: true,
    buttonText: 'Read Security Report',
    buttonUrl: '/security',
  },
  {
    page: 'trust',
    sectionType: 'feature-grid',
    title: 'Security Features',
    heading: 'Industry-Leading Security',
    description: 'Multiple layers of protection for your data',
    backgroundStyle: 'light',
    order: 2,
    published: true,
    items: [
      {
        icon: 'lock',
        title: 'SOC 2 Type II',
        description: 'Independently audited and certified',
        status: 'validated',
      },
      {
        icon: 'shield',
        title: 'Encryption',
        description: 'End-to-end encryption for all data',
        status: 'validated',
      },
      {
        icon: 'search',
        title: 'Compliance',
        description: 'GDPR, HIPAA, and other standards',
        status: 'validated',
      },
      {
        icon: 'eye',
        title: 'Monitoring',
        description: '24/7 security monitoring',
        status: 'validated',
      },
    ],
  },

  // VERIFY PAGE
  {
    page: 'verify',
    sectionType: 'hero',
    title: 'Verify Hero',
    subtitle: 'Verification & Validation',
    heading: 'Model Validation & Verification',
    description: 'Rigorous testing and validation processes',
    backgroundStyle: 'light-institutional',
    order: 1,
    published: true,
    buttonText: 'View Reports',
    buttonUrl: '#reports',
  },
  {
    page: 'verify',
    sectionType: 'feature-grid',
    title: 'Verification Methods',
    heading: 'Comprehensive Validation',
    description: 'Our models undergo rigorous testing',
    backgroundStyle: 'light',
    order: 2,
    published: true,
    items: [
      {
        icon: 'microscope',
        title: 'Scientific Testing',
        description: 'Peer-reviewed validation',
        status: 'validated',
      },
      {
        icon: 'bar-chart-3',
        title: 'Backtesting',
        description: 'Historical accuracy verification',
        status: 'validated',
      },
      {
        icon: 'target',
        title: 'Industry Benchmarks',
        description: 'Compared against industry standards',
        status: 'validated',
      },
      {
        icon: 'check-circle',
        title: 'Continuous Improvement',
        description: 'Regular model updates and refinements',
        status: 'validated',
      },
    ],
  },

  // ABOUT PAGE
  {
    page: 'about',
    sectionType: 'hero',
    title: 'About Hero',
    subtitle: 'About QRS',
    heading: 'Transforming Risk Management',
    description: 'Leading innovation in catastrophe risk modeling',
    backgroundStyle: 'light-institutional',
    order: 1,
    published: true,
    buttonText: 'Contact Us',
    buttonUrl: '/contact',
  },
  {
    page: 'about',
    sectionType: 'feature-grid',
    title: 'About Points',
    heading: 'Why Choose QRS',
    description: 'What sets us apart in the industry',
    backgroundStyle: 'light',
    order: 2,
    published: true,
    items: [
      {
        icon: 'rocket',
        title: 'Innovation',
        description: 'Cutting-edge risk modeling technology',
        status: 'validated',
      },
      {
        icon: 'users',
        title: 'Expertise',
        description: 'Team of world-class scientists',
        status: 'validated',
      },
      {
        icon: 'globe',
        title: 'Global Reach',
        description: 'Serving clients worldwide',
        status: 'validated',
      },
      {
        icon: 'lightbulb',
        title: 'Thought Leadership',
        description: 'Advancing the industry forward',
        status: 'validated',
      },
    ],
  },
]

async function seedSections() {
  try {
    console.warn('[Seed] Connecting to Payload...')
    const payload = await getPayload({ config })

    console.warn(`[Seed] Creating ${sections.length} page sections...`)

    for (const section of sections) {
      try {
        const result = await payload.create({
          collection: 'page-sections',
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          data: section as any,
        })
        console.warn(`✓ Created: ${result.page} - ${result.title}`)
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown error'
        console.warn(`✗ Failed to create ${section.title}: ${message}`)
      }
    }

    console.warn('[Seed] ✅ Seeding complete!')
    process.exit(0)
  } catch (error) {
    console.error('[Seed] ❌ Error:', error)
    process.exit(1)
  }
}

seedSections()
