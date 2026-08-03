/**
 * Fetch content from Payload CMS
 */

const CMS_URL = process.env.NEXT_PUBLIC_CMS_URL || 'http://localhost:3001';

interface CMSPage {
  id: string;
  title: string;
  slug: string;
  content?: string;
  description?: string;
  layout?: Array<Record<string, any>>;
  seo?: {
    title?: string;
    description?: string;
    keywords?: Array<{ keyword: string }>;
    image?: { url: string };
  };
}

export async function getPageBySlug(slug: string): Promise<CMSPage | null> {
  try {
    const response = await fetch(
      `${CMS_URL}/api/pages?where[slug][equals]=${slug}`,
      {
        cache: 'revalidate',
        revalidateTTL: 3600, // Cache for 1 hour
      }
    );

    if (!response.ok) {
      console.warn(`CMS fetch failed for slug "${slug}":`, response.statusText);
      return null;
    }

    const data = await response.json();
    return data.docs?.[0] || null;
  } catch (error) {
    console.warn(`CMS fetch error for slug "${slug}":`, error);
    return null;
  }
}

export async function getAllPages(): Promise<CMSPage[]> {
  try {
    const response = await fetch(
      `${CMS_URL}/api/pages?where[status][equals]=published&limit=100`,
      {
        cache: 'revalidate',
        revalidateTTL: 3600,
      }
    );

    if (!response.ok) {
      console.warn('CMS fetch failed for pages:', response.statusText);
      return [];
    }

    const data = await response.json();
    return data.docs || [];
  } catch (error) {
    console.warn('CMS fetch error for pages:', error);
    return [];
  }
}

export async function getValidationReports() {
  try {
    const response = await fetch(
      `${CMS_URL}/api/validation-reports?where[status][equals]=published&limit=100`,
      {
        cache: 'revalidate',
        revalidateTTL: 3600,
      }
    );

    if (!response.ok) {
      return [];
    }

    const data = await response.json();
    return data.docs || [];
  } catch (error) {
    console.warn('CMS fetch error for validation reports:', error);
    return [];
  }
}

export async function getPerilStatuses() {
  try {
    const response = await fetch(
      `${CMS_URL}/api/peril-status?sort=-order`,
      {
        cache: 'revalidate',
        revalidateTTL: 3600,
      }
    );

    if (!response.ok) {
      return [];
    }

    const data = await response.json();
    return data.docs || [];
  } catch (error) {
    console.warn('CMS fetch error for peril statuses:', error);
    return [];
  }
}

export async function getRedirectBySource(sourcePath: string) {
  try {
    const response = await fetch(
      `${CMS_URL}/api/redirects?where[sourcePath][equals]=${encodeURIComponent(sourcePath)}`,
      {
        cache: 'revalidate',
        revalidateTTL: 300, // Cache redirects for 5 minutes
      }
    );

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    return data.docs?.[0] || null;
  } catch (error) {
    console.warn(`CMS fetch error for redirect "${sourcePath}":`, error);
    return null;
  }
}

export async function getTrustCenter() {
  try {
    const response = await fetch(
      `${CMS_URL}/api/globals/trust-center`,
      {
        cache: 'revalidate',
        revalidateTTL: 3600,
      }
    );

    if (!response.ok) {
      return null;
    }

    return await response.json();
  } catch (error) {
    console.warn('CMS fetch error for trust center:', error);
    return null;
  }
}
