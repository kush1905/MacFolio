import { entityDataset } from "@/lib/agriGraph";

export function GET() {
  return Response.json(entityDataset, {
    headers: {
      "Cache-Control": "public, max-age=3600",
    },
  });
}
