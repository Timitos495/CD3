// app/api/shot/route.ts
import { vizBaseUrl } from "../../../lib/visualizer";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) return Response.json({ error: "Missing id" }, { status: 400 });

  const shot = await fetch(`${vizBaseUrl()}/shots/${id}`)
    .then((r) => r.json())
    .catch(() => null);

  if (!shot) return Response.json({ error: "Failed to fetch shot" }, { status: 500 });
  return Response.json(shot);
}
