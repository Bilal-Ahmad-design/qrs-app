const CMS_API = process.env.NEXT_PUBLIC_CMS_URL || 'http://localhost:3001';

function normalizeDoc(doc: any) {
  if (!doc) {
    return null;
  }

  const attributes = doc?.attributes ?? doc;
  return {
    id: doc?.id ?? attributes?.id ?? '',
    slug: attributes?.slug ?? '',
    title: attributes?.title ?? '',
    content: attributes?.content ?? '',
  };
}

export async function getPageBySlug(slug: string) {
  try {
    const params = new URLSearchParams({
      'filters[slug][$eq]': slug,
      populate: '*',
    });

    const response = await fetch(`${CMS_API}/api/pages?${params.toString()}`, {
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    const docs = Array.isArray(data?.data) ? data.data : [];
    return normalizeDoc(docs[0]) ?? null;
  } catch (error) {
    console.error(`Error fetching page "${slug}":`, error);
    return null;
  }
}

export async function getAllPages() {
  try {
    const response = await fetch(`${CMS_API}/api/pages?pagination[pageSize]=100&populate=*`, {
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      return [];
    }

    const data = await response.json();
    const docs = Array.isArray(data?.data) ? data.data : [];
    return docs.map(normalizeDoc).filter(Boolean);
  } catch (error) {
    console.error('Error fetching pages:', error);
    return [];
  }
}

export async function getPerilStatus() {
  return [];
}

export async function getValidationReports() {
  return [];
}

export async function resolveRedirect(sourcePath: string) {
  return null;
}
