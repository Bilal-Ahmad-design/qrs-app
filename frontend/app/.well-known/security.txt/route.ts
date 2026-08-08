export async function GET() {
  const expiryDate = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
    .toISOString()
    .split('T')[0];

  const securityTxt = `Contact: security@qrsrisk.com
Expires: ${expiryDate}T00:00Z
Preferred-Languages: en
Policy: https://qrsrisk.com/security/vdp/
`;

  return new Response(securityTxt, {
    headers: { 'Content-Type': 'text/plain' },
  });
}
