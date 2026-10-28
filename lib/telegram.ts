import { isoDate } from "@/lib/content";
import { formatDate } from "@/lib/format";
import { postFingerprint, postTypes, X_LIMIT, xLength, type Post } from "@/lib/posts";

/*
 * De bot in de goedkeuringsgroep: een voorstel sturen, het bericht bijwerken en
 * een tik op een knop beantwoorden. Gewone fetch-aanroepen naar de Bot API; een
 * bibliotheek zou voor vier aanroepen meer meebrengen dan hij oplost.
 */

async function call(method: string, params: object) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) throw new Error("TELEGRAM_BOT_TOKEN ontbreekt");
  const response = await fetch(`https://api.telegram.org/bot${token}/${method}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params),
  });
  const result = await response.json();
  // De foutmelding noemt alleen de methode: de URL bevat het token.
  if (!result.ok) throw new Error(`Telegram ${method}: ${result.description}`);
  return result.result;
}

/**
 * Stuurt een post als voorstel naar de groep: kaart, tekst en twee knoppen.
 * Elke knop draagt actie, type, datum en vingerafdruk (samen ruim onder de 64
 * bytes die Telegram toestaat), zodat de tik zonder opslag te controleren is.
 */
export async function sendProposal(post: Post, origin: string) {
  const id = `${post.type}|${post.date}|${postFingerprint(post)}`;
  // De vingerafdruk in de URL: Telegram bewaart foto's per URL, en een kaart kan veranderen.
  const photo = new URL(`${post.card}?v=${postFingerprint(post)}`, origin).href;
  const caption = [
    `Voorstel voor ${formatDate(isoDate(post.date))} · ${postTypes[post.type].label}`,
    "",
    post.text,
    "",
    `${xLength(post.text)} van ${X_LIMIT} tekens`,
  ].join("\n");

  await call("sendPhoto", {
    chat_id: process.env.TELEGRAM_CHAT_ID,
    photo,
    caption,
    reply_markup: {
      inline_keyboard: [
        [
          { text: "Plaats", callback_data: `plaats|${id}` },
          { text: "Overslaan", callback_data: `overslaan|${id}` },
        ],
      ],
    },
  });
}

/** Vervangt het onderschrift van een voorstel, zonder knoppen. */
export function setCaption(chatId: string, messageId: number, caption: string) {
  return call("editMessageCaption", { chat_id: chatId, message_id: messageId, caption });
}

/**
 * Haalt de knoppen weg. Lukt dat niet, dan had iemand anders al getikt: Telegram
 * weigert een tweede keer met "message is not modified". Dat maakt dit het slot
 * tegen dubbel plaatsen.
 */
export function removeButtons(chatId: string, messageId: number) {
  return call("editMessageReplyMarkup", {
    chat_id: chatId,
    message_id: messageId,
    reply_markup: { inline_keyboard: [] },
  });
}

/** Beantwoordt de tik, zodat het knopje stopt met laden. `text` verschijnt kort bovenin. */
export function answerTap(callbackQueryId: string, text: string) {
  return call("answerCallbackQuery", { callback_query_id: callbackQueryId, text });
}
