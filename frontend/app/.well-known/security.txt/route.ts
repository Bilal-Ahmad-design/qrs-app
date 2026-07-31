import { NextResponse } from 'next/server';

export async function GET() {
  // RFC 9116 Vulnerability Disclosure Policy
  // Expires: 2027-07-02 (12 months from 2026-07-02)
  // TODO: Refresh this date before expiry and add a calendar reminder
  // for renewal.
  const body = `Contact: mailto:security@qrsrisk.com
Expires: 2027-07-02T00:00:00.000Z
Policy: https://qrsrisk.com/security/vdp/
Preferred-Languages: en
`;

  return new NextResponse(body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
    },
  });
}
