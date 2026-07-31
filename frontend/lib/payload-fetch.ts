// Fetch content from the dedicated CMS app.
const CMS_API = process.env.NEXT_PUBLIC_CMS_URL || 'http://localhost:3001';

interface PageData {
  id: string;
  slug: string;
  title: string;
  content?: unknown;
  seoTitle?: string;
  seoDescription?: string;
}

function normalizePage(doc: any): PageData | null {
  if (!doc) {
    return null;
  }

  const attributes = doc?.attributes ?? doc;

  return {
    id: String(doc?.id ?? attributes?.id ?? ''),
    slug: attributes?.slug ?? '',
    title: attributes?.title ?? '',
    content: attributes?.content ?? attributes?.body ?? '',
    seoTitle: attributes?.seoTitle ?? '',
    seoDescription: attributes?.seoDescription ?? '',
  };
}

export async function getPageBySlug(slug: string): Promise<PageData | null> {
  try {
    const params = new URLSearchParams({
      'filters[slug][$eq]': slug,
      populate: '*',
    });

    const response = await fetch(`${CMS_API}/api/pages?${params.toString()}`, {
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      if (process.env.NODE_ENV === 'development') {
        console.log(`[CMS API] Using fallback content (${response.statusText})`);
      }
      return null;
    }

    const data = await response.json();
    const docs = Array.isArray(data?.docs) ? data.docs : Array.isArray(data?.data) ? data.data : [];
    return normalizePage(docs[0]) ?? null;
  } catch (error) {
    console.error('Error fetching page:', error);
    return null;
  }
}

export async function getAllPages(): Promise<PageData[]> {
  try {
    const params = new URLSearchParams({
      'pagination[pageSize]': '100',
      populate: '*',
    });

    const response = await fetch(`${CMS_API}/api/pages?${params.toString()}`, {
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      if (process.env.NODE_ENV === 'development') {
        console.log(`[CMS API] Using fallback content (${response.statusText})`);
      }
      return [];
    }

    const data = await response.json();
    const docs = Array.isArray(data?.docs) ? data.docs : Array.isArray(data?.data) ? data.data : [];
    return docs
      .map((doc: unknown) => normalizePage(doc as Record<string, unknown>))
      .filter((page: PageData | null): page is PageData => Boolean(page));
  } catch (error) {
    console.error('Error fetching pages:', error);
    return [];
  }
}
