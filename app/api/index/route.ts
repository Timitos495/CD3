// app/api/index/route.ts
import { vizBaseUrl } from "../../../lib/visualizer.ts";

export const dynamic = "force-dynamic";

// In-memory cache — persists between requests on same Vercel instance
let cachedShots: any[] = [];
let lastBuilt = 0;
const CACHE_TTL = 60 * 60 * 1000; // 1 hour

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const forceRebuild = searchParams.get("rebuild") === "true";

  if (!forceRebuild && cachedShots.length > 0 && Date.now() - lastBuilt < CACHE_TTL) {
    console.log(`Serving ${cachedShots.length} cached shots`);
    return Response.json({ shots: cachedShots, total: cachedShots.length, cached: true });
  }

  const base = vizBaseUrl();
  console.log("Building index...");

  // Step 1: Fetch first 2 pages of IDs (200 newest shots)
  const page1 = await fetch(`${base}/shots?limit=100&page=1`)
    .then((r) => r.json())
    .catch(() => ({ data: [] }));

  console.log(`Page 1: ${page1.data?.length ?? 0} IDs, total pages: ${page1.paging?.pages}`);

  await wait(1500);

  const page2 = await fetch(`${base}/shots?limit=100&page=2`)
    .then((r) => r.json())
    .catch(() => ({ data: [] }));

  console.log(`Page 2: ${page2.data?.length ?? 0} IDs`);

  const allIds: string[] = [
    ...(page1.data ?? []).map((s: any) => s.id),
    ...(page2.data ?? []).map((s: any) => s.id),
  ];

  console.log(`Total IDs: ${allIds.length}`);

  // Step 2: Fetch full shot details one by one
  const shots: any[] = [];

  for (let i = 0; i < allIds.length; i++) {
    await wait(1300);

    const shot = await fetch(`${base}/shots/${allIds[i]}`)
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
