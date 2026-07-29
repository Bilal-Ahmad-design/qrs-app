import type { Payload } from 'payload';
import config from '@/cms/payload.config';

// Singleton instance to avoid re-initialization
let payloadInstance: Payload | null = null;

// Lazy-load Payload client (same pattern as M1)
export async function getPayloadClient(): Promise<Payload> {
  if (payloadInstance) {
    return payloadInstance;
  }

  try {
    const { getPayload } = await import('payload');
    payloadInstance = await getPayload({ config });
    return payloadInstance;
  } catch (error) {
    console.error('Failed to initialize Payload client:', error);
    throw error;
  }
}

// Fetch a page by slug
export async function getPageBySlug(slug: string) {
  try {
    const payload = await getPayloadClient();
    const result = await payload.find({
      collection: 'pages',
      where: {
        slug: {
          equals: slug,
        },
      },
      limit: 1,
    });

    return result.docs?.[0] || null;
  } catch (error) {
    console.error(`Error fetching page "${slug}":`, error);
    return null;
  }
}

// Fetch all published pages
export async function getAllPages() {
  try {
    const payload = await getPayloadClient();
    const result = await payload.find({
      collection: 'pages',
      where: {
        status: {
          equals: 'published',
        },
      },
      limit: 100,
    });

    return result.docs || [];
  } catch (error) {
    console.error('Error fetching pages:', error);
    return [];
  }
}

// Fetch peril status for active models display
export async function getPerilStatus() {
  try {
    const payload = await getPayloadClient();
    const result = await payload.find({
      collection: 'peril-status',
      limit: 100,
      sort: 'order',
    });

    return result.docs || [];
  } catch (error) {
    console.error('Error fetching peril status:', error);
    return [];
  }
}

// Fetch validation reports
export async function getValidationReports() {
  try {
    const payload = await getPayloadClient();
    const result = await payload.find({
      collection: 'validation-reports',
      where: {
        status: {
          equals: 'published',
        },
      },
      limit: 100,
    });

    return result.docs || [];
  } catch (error) {
    console.error('Error fetching validation reports:', error);
    return [];
  }
}

// Resolve a redirect
export async function resolveRedirect(sourcePath: string) {
  try {
    const payload = await getPayloadClient();
    const result = await payload.find({
      collection: 'redirects',
      where: {
        sourcePath: {
          equals: sourcePath,
        },
      },
      limit: 1,
      overrideAccess: true,
    });

    return result.docs?.[0] || null;
  } catch (error) {
    console.error(`Error resolving redirect for "${sourcePath}":`, error);
    return null;
  }
}
