// app/api/shots/route.ts
import { vizBaseUrl } from "../../../lib/visualizer.ts";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = searchParams.get("page") ?? "1";
  const limit = searchParams.get("limit") ?? "50";

  const data = await fetch(`${vizBaseUrl()}/shots?limit=${limit}&page=${page}`)
    .then((r) => r.json())
    .catch(() => null);

  if (!data) return Response.json({ error: "Failed to fetch shots" }, { status: 500 });
  return Response.json(data);
}
