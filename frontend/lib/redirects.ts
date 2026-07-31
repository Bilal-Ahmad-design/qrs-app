// M2 Note: Redirect manager queries the Redirects collection via Payload Local API.
// Same DATABASE_URL blocker as lib/payload.ts.
//
// TODO: Activate once DATABASE_URL exists.

// import { getPayloadClient } from './payload';
//
// export async function resolveRedirect(path: string) {
//   try {
//     const payload = await getPayloadClient();
//     const redirect = await payload.findByID({
//       collection: 'redirects',
//       id: path,
//       overrideAccess: true,
//     });
//     return redirect;
//   } catch {
//     return null;
//   }
// }

export async function resolveRedirect(path: string) {
  // TODO: Implement once DATABASE_URL exists
  return null;
}
