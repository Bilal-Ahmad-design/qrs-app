// M2 Note: This file attempts to use Payload's Local API to fetch CMS content.
// However, importing payload.config.ts triggers Turbopack's drizzle-kit native-module
// resolution failure (same blocker as M1's admin/api stubs).
//
// TODO: Activate this once DATABASE_URL exists and a real Postgres is reachable.
// In the meantime, pages import data directly from placeholder data instead.

// import { getPayload } from 'payload';
// import config from '@/cms/payload.config';
//
// let payloadInstance: Awaited<ReturnType<typeof getPayload>> | null = null;
//
// export async function getPayloadClient() {
//   if (!payloadInstance) {
//     payloadInstance = await getPayload({ config });
//   }
//   return payloadInstance;
// }

// Stub for now:
export async function getPayloadClient() {
  throw new Error(
    'Payload Local API requires DATABASE_URL. Placeholder data being used for now.',
  );
}
