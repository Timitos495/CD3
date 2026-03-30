// app/api/index/route.ts
import { vizHeaders } from "../../../lib/visualizer";
import fs from "fs";
import path from "path";

export const dynamic = "force-dynamic";

const CACHE_FILE = path.join(process.cwd(), ".cache", "shots.json");
const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours
const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

function readCache(): { shots: any[]; builtAt: number } | null {
  try {
    if (!fs.existsSync(CACHE_FILE)) return null;
    const data = JSON.parse(fs.readFileSync(CACHE_FILE, "utf-8"));
    if (Date.now() - data.builtAt > CACHE_TTL) return null;
    return data;
  } catch {
    return null;
  }
}

function writeCache(shots: any[]) {
  const dir = path.dirname(CACHE_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(CACHE_FILE, JSON.stringify({ shots, builtAt: Date.now() }), "utf-8");
}

function readPartial(): { shots: any[]; completedIds: string[] } {
  try {
    const file = path.join(process.cwd(), ".cache", "partial.json");
    if (!fs.existsSync(file)) return { shots: [], completedIds: [] };
    return JSON.parse(fs.readFileSync(file, "utf-8"));
  } catch {
    return { shots: [], completedIds: [] };
  }
}

function writePartial(shots: any[], completedIds: string[]) {
  const file = path.join(process.cwd(), ".cache", "partial.json");
  const dir = path.dirname(file);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(file, JSON.stringify({ shots, completedIds }), "utf-8");
}

function clearPartial() {
  const file = path.join(process.cwd(), ".cache", "partial.json");
  if (fs.existsSync(file)) fs.unlinkSync(file);
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const forceRebuild = searchParams.get("rebuild") === "true";

  // Serve from cache if available
  if (!forceRebuild) {
    const cached = readCache();
    if (cached) {
      console.log(`Serving ${cached.shots.length} cached shots from disk`);
      // Limit to 100 shots for now
      const limitedShots = cached.shots.slice(0, 100);
      return Response.json({ shots: limitedShots, total: cached.shots.length, cached: true, limited: true });
    }
  }

  const headers = vizHeaders();
  console.log("Building index with 100 shot limit...");

  // Step 1: Collect first 100 IDs only (items param per Visualizer API docs)
  const firstPage = await fetch("https://visualizer.coffee/api/shots?items=100&page=1", { headers })
    .then((r) => r.json())
    .catch(() => ({ data: [], paging: {} }));

  const allIds: string[] = (firstPage.data ?? []).slice(0, 100).map((s: any) => s.id); // Limit to 100 IDs
  console.log(`Limited to first 100 IDs: ${allIds.length}`);

  // Step 2: Resume from partial if available (but limit to 100 total)
  const partial = readPartial();
  const remainingIds = allIds.filter((id) => !partial.completedIds.includes(id)).slice(0, 100 - partial.shots.length);
  const shots: any[] = [...partial.shots].slice(0, 100); // Limit existing shots
  const completedIds: string[] = [...partial.completedIds];

  console.log(`Already fetched: ${shots.length}, remaining: ${remainingIds.length} (limited to 100 total)`);

  for (let i = 0; i < remainingIds.length && shots.length < 100; i++) {
    await wait(1300);

    const shot = await fetch(`https://visualizer.coffee/api/shots/${remainingIds[i]}`, { headers })
      .then((r) => r.json())
      .catch(() => null);

    if (!shot || shot.error) {
      console.log(`Shot ${i} failed: ${shot?.error ?? "null"}`);
      continue;
    }

    shots.push(shot);
    completedIds.push(remainingIds[i]);

    // Save progress every 50 shots so we can resume if interrupted
    if (i % 50 === 0) {
      writePartial(shots, completedIds);
      console.log(`Progress: ${shots.length} / ${allIds.length}`);
    }
  }

  // Save final cache (limited to 100) and clear partial
  const limitedShots = shots.slice(0, 100);
  writeCache(limitedShots);
  clearPartial();

  console.log(`Done! Limited to ${limitedShots.length} shots (first 100)`);
  return Response.json({ shots: limitedShots, total: limitedShots.length, cached: false, limited: true });
}
