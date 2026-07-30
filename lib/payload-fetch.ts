// Fetch content from Payload CMS via REST API
const PAYLOAD_API = process.env.NEXT_PUBLIC_PAYLOAD_URL || 'http://localhost:3000';

interface PageData {
  id: string;
  slug: string;
  title: string;
  content?: any;
  seoTitle?: string;
  seoDescription?: string;
}

export async function getPageBySlug(slug: string): Promise<PageData | null> {
  try {
    const response = await fetch(`${PAYLOAD_API}/api/pages?where[slug][equals]=${slug}`, {
      next: { revalidate: 3600 }, // Revalidate every hour
    });

    if (!response.ok) {
      // API unavailable - fallback content will be used
      if (process.env.NODE_ENV === 'development') {
        console.log(`[Payload API] Using fallback content (${response.statusText})`);
      }
      return null;
    }

    const data = await response.json();
    return data.docs?.[0] || null;
  } catch (error) {
    console.error('Error fetching page:', error);
    return null;
  }
}

export async function getAllPages(): Promise<PageData[]> {
  try {
    const response = await fetch(`${PAYLOAD_API}/api/pages?limit=100`, {
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      // API unavailable - fallback content will be used
      if (process.env.NODE_ENV === 'development') {
        console.log(`[Payload API] Using fallback content (${response.statusText})`);
      }
      return [];
    }

    const data = await response.json();
    return data.docs || [];
  } catch (error) {
    console.error('Error fetching pages:', error);
    return [];
  }
}
