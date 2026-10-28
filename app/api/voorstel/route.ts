import { timingSafeEqual } from "node:crypto";
import { amsterdamDate, todaysPost } from "@/lib/posts";
import { sendProposal } from "@/lib/telegram";

/*
 * Aangeroepen door de cron job in vercel.json, elke werkdag tussen 12:00 en
 * 12:59 UTC: zet de post van vandaag als voorstel in de Telegram-groep. Vercel
 * stuurt "Bearer <CRON_SECRET>" mee; zonder dat gebeurt er niets.
 *
 * Met de hand (een gemiste cron, of testen) kan het ook, met hetzelfde geheim:
 *   curl -H "Authorization: Bearer $CRON_SECRET" https://amerikabelegger.vercel.app/api/voorstel
 * `?datum=2026-11-13` stuurt het voorstel van een andere dag. Plaatsen kan dan
 * niet: de webhook plaatst alleen een voorstel van vandaag.
 */
export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  const given = Buffer.from(request.headers.get("authorization") ?? "");
  const expected = Buffer.from(`Bearer ${secret}`);
  if (!secret || given.length !== expected.length || !timingSafeEqual(given, expected)) {
    return new Response("Niet toegestaan", { status: 401 });
  }

  const url = new URL(request.url);
  const date = url.searchParams.get("datum") ?? amsterdamDate(new Date());
  const post = await todaysPost(date);
  if (post) await sendProposal(post, url.origin);
  return Response.json({ date, type: post?.type ?? null });
}
