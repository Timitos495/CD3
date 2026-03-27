import { vizHeaders } from "../../../lib/visualizer";

export const dynamic = "force-dynamic";

export async function GET() {
  const headers = vizHeaders();
  
  // Test 1: /me endpoint
  const me = await fetch("https://visualizer.coffee/api/me", { headers })
    .then((r) => r.json())
    .catch((e) => ({ error: e.message }));
  
  // Test 2: /shots with auth
  const shots = await fetch("https://visualizer.coffee/api/shots?limit=3", { headers })
    .then((r) => r.json())
    .catch((e) => ({ error: e.message }));

  return Response.json({ me, firstShotId: shots.data?.[0]?.id });
}