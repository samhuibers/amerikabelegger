import { timingSafeEqual } from "node:crypto";
import { isoDate } from "@/lib/content";
import { formatDate, formatTime } from "@/lib/format";
import { amsterdamDate, postFingerprint, postFor } from "@/lib/posts";
import { answerTap, removeButtons, sendProposal, setCaption } from "@/lib/telegram";
import { createPost, uploadImage } from "@/lib/x";

/*
 * De webhook: Telegram roept dit aan als iemand in de groep op "Plaats" of
 * "Overslaan" tikt. Goedkeuren is plaatsen; er staat niets opgeslagen. De knop
 * zegt welke post het was, en die wordt hier opnieuw uitgerekend.
 *
 * Vier controles voordat er iets gebeurt: Telegrams geheime header (ingesteld
 * met setWebhook, zie docs/handover.md), de juiste groep, een goedkeurder uit
 * TELEGRAM_APPROVERS, en bij plaatsen: de post is van vandaag en onveranderd.
 *
 * Telegram krijgt altijd 200 terug, ook als er iets misgaat: bij een fout
 * stuurt Telegram dezelfde tik opnieuw, en een herhaalde tik mag nooit een
 * tweede poging tot plaatsen worden. Fouten staan in het bericht en in de logs.
 */
export async function POST(request: Request) {
  const secret = process.env.TELEGRAM_WEBHOOK_SECRET;
  const given = Buffer.from(request.headers.get("x-telegram-bot-api-secret-token") ?? "");
  if (!secret || given.length !== Buffer.byteLength(secret) || !timingSafeEqual(given, Buffer.from(secret))) {
    return new Response("Niet toegestaan", { status: 401 });
  }

  const tap = (await request.json()).callback_query;
  const chatId = String(tap?.message?.chat?.id);
  if (!tap || chatId !== process.env.TELEGRAM_CHAT_ID) return new Response("ok");

  try {
    await handleTap(tap, chatId, new URL(request.url).origin);
  } catch (error) {
    console.error("Telegram-tik mislukt:", error);
  }
  return new Response("ok");
}

type Tap = {
  id: string;
  from: { id: number; first_name: string };
  message: { message_id: number; caption?: string };
  data?: string;
};

async function handleTap(tap: Tap, chatId: string, origin: string) {
  const approvers = (process.env.TELEGRAM_APPROVERS ?? "").split(",").map((id) => id.trim());
  if (!approvers.includes(String(tap.from.id))) {
    await answerTap(tap.id, "Je staat niet op de lijst van goedkeurders.");
    return;
  }

  const [action, type, date, fingerprint] = (tap.data ?? "").split("|");
  const messageId = tap.message.message_id;
  const caption = tap.message.caption ?? "";
  const who = tap.from.first_name;

  // Eerst de knoppen weg: wie daarna nog tikt, vindt niets meer (het slot, zie removeButtons).
  try {
    await removeButtons(chatId, messageId);
  } catch {
    await answerTap(tap.id, "Dit voorstel is al afgehandeld.");
    return;
  }

  if (action === "overslaan") {
    await answerTap(tap.id, "Overgeslagen");
    await setCaption(chatId, messageId, `${caption}\n\nOvergeslagen door ${who}.`);
    return;
  }
  if (action !== "plaats") return;

  await answerTap(tap.id, "Bezig met plaatsen…");
  const today = amsterdamDate(new Date());
  if (date !== today) {
    await setCaption(
      chatId,
      messageId,
      `${caption}\n\nNiet geplaatst: dit voorstel is voor ${formatDate(isoDate(date))}, niet voor vandaag.`,
    );
    return;
  }

  const post = await postFor(type, date);
  if (!post || postFingerprint(post) !== fingerprint) {
    await setCaption(chatId, messageId, `${caption}\n\nNiet geplaatst: de post is veranderd sinds dit voorstel. Het nieuwe voorstel staat hieronder.`);
    if (post) await sendProposal(post, origin);
    return;
  }

  try {
    const card = await fetch(new URL(post.card, origin));
    if (!card.ok) throw new Error(`kaart ${post.card} gaf ${card.status}`);
    const id = await createPost(post.text, await uploadImage(await card.blob()));
    await setCaption(
      chatId,
      messageId,
      `${caption}\n\nGeplaatst door ${who} om ${formatTime(new Date())}: https://x.com/amerikabelegger/status/${id}`,
    );
  } catch (error) {
    // Een nieuw voorstel, zodat iemand het opnieuw kan proberen. Weigert X omdat de
    // post al bestaat ("duplicate content"), dan staat dat in de melding.
    const reason = error instanceof Error ? error.message : String(error);
    await setCaption(chatId, messageId, `${caption}\n\nNiet geplaatst: ${reason.slice(0, 300)}`);
    await sendProposal(post, origin);
  }
}
