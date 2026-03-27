// app/api/index/route.ts
import { vizHeaders } from "../../../lib/visualizer";

export const dynamic = "force-dynamic";

let cachedShots: any[] = [];
let lastBuilt = 0;
const CACHE_TTL = 60 * 60 * 1000;

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const forceRebuild = searchParams.get("rebuild") === "true";

  if (!forceRebuild && cachedShots.length > 0 && Date.now() - lastBuilt < CACHE_TTL) {
    console.log(`Serving ${cachedShots.length} cached shots`);
    return Response.json({ shots: cachedShots, total: cachedShots.length, cached: true });
  }

  const headers = vizHeaders(); // ← declared once, at the top

  console.log("Building index...");

  const page1 = await fetch("https://visualizer.coffee/api/shots?limit=100&page=1", { headers })
    .then((r) => r.json())
    .catch(() => ({ data: [] }));

  console.log(`Page 1: ${page1.data?.length ?? 0} IDs, total pages: ${page1.paging?.pages}`);

  await wait(1500);

  const page2 = await fetch("https://visualizer.coffee/api/shots?limit=100&page=2", { headers })
    .then((r) => r.json())
    .catch(() => ({ data: [] }));

  console.log(`Page 2: ${page2.data?.length ?? 0} IDs`);

  const allIds: string[] = [
    ...(page1.data ?? []).map((s: any) => s.id),
    ...(page2.data ?? []).map((s: any) => s.id),
  ];

  console.log(`Total IDs: ${allIds.length}`);

  const shots: any[] = [];

  for (let i = 0; i < allIds.length; i++) {
    await wait(1300);

    const shot = await fetch(`https://visualizer.coffee/api/shots/${allIds[i]}`, { headers })
      .then((r) => r.json())
      .catch(() => null);

    if (!shot || shot.error) {
      console.log(`Shot ${i} failed: ${shot?.error ?? "null"}`);
      continue;
    }

    console.log(`[${i + 1}/${allIds.length}] user: ${shot.user_id} bean: ${shot.bean_type}`);
    shots.push(shot);
  }

  cachedShots = shots;
  lastBuilt = Date.now();

  console.log(`Done! ${shots.length} shots`);
  return Response.json({ shots, total: shots.length, cached: false });
}
