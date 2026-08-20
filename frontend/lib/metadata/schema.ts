export function generateOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'QRS',
    url: 'https://qrs.io',
    logo: 'https://qrs.io/logo.png',
    description: 'The Intelligent QRS Platform for enterprise portfolio intelligence',
    sameAs: [
      'https://twitter.com/qrs',
      'https://linkedin.com/company/qrs',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'Customer Support',
      email: 'support@qrs.io',
      telephone: '+1-555-123-4567',
    },
  }
}

export function generateBreadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      name: item.name,
      item: item.url,
    })),
  }
}

export function generateSoftwareApplicationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'QRS Platform',
    description: 'Enterprise QRS monitoring and portfolio intelligence platform',
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web',
    offers: {
      '@type': 'Offer',
      price: 'Contact for pricing',
      priceCurrency: 'USD',
    },
  }
}

export function getMetadataJson(type: 'org' | 'breadcrumb' | 'app', data?: any) {
  switch (type) {
    case 'org':
      return generateOrganizationSchema()
    case 'app':
      return generateSoftwareApplicationSchema()
    case 'breadcrumb':
      return generateBreadcrumbSchema(data || [])
    default:
      return {}
  }
}
