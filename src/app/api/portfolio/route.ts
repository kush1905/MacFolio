import { portfolioPayload } from "@/lib/db/portfolio";

export const runtime = "nodejs";

export async function GET() {
  const payload = await portfolioPayload();
  return Response.json(payload);
}
