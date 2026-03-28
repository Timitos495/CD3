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
      return Response.json({ shots: cached.shots, total: cached.shots.length, cached: true });
    }
  }

  const headers = vizHeaders();
  console.log("Building index...");

  // Step 1: Collect ALL IDs across all pages
  const firstPage = await fetch("https://visualizer.coffee/api/shots?limit=100&page=1", { headers })
    .then((r) => r.json())
    .catch(() => ({ data: [], paging: {} }));

  const totalPages: number = firstPage.paging?.pages ?? 1;
  const allIds: string[] = (firstPage.data ?? []).map((s: any) => s.id);
  console.log(`Total pages: ${totalPages}, first page IDs: ${allIds.length}`);

  for (let i = 2; i <= totalPages; i++) {
    await wait(1300);
    const result = await fetch(`https://visualizer.coffee/api/shots?limit=100&page=${i}`, { headers })
      .then((r) => r.json())
      .catch(() => ({ data: [] }));
    if (result.error) {
      console.log(`Page ${i} error: ${result.error}`);
      continue;
    }
    allIds.push(...(result.data ?? []).map((s: any) => s.id));
    console.log(`Page ${i}/${totalPages} — IDs: ${allIds.length}`);
  }

  console.log(`Total IDs collected: ${allIds.length}`);

  // Step 2: Resume from partial if available
  const partial = readPartial();
  const remainingIds = allIds.filter((id) => !partial.completedIds.includes(id));
  const shots: any[] = [...partial.shots];
  const completedIds: string[] = [...partial.completedIds];

  console.log(`Already fetched: ${shots.length}, remaining: ${remainingIds.length}`);

  for (let i = 0; i < remainingIds.length; i++) {
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

  // Save final cache and clear partial
  writeCache(shots);
  clearPartial();

  console.log(`Done! ${shots.length} shots`);
  return Response.json({ shots, total: shots.length, cached: false });
}
