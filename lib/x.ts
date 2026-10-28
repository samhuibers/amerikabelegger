import { createHmac, randomBytes } from "node:crypto";

/*
 * Posten op X als @amerikabelegger: een kaart uploaden en een post maken. Meer
 * doet deze site niet met X (zie de use case in docs/decisions.md, 27 oktober).
 *
 * Inloggen met OAuth 1.0a: vier sleutels die niet verlopen, uit de
 * omgevingsvariabelen. OAuth 2.0 zou elke twee uur een nieuw token vragen dat
 * ergens opgeslagen moet worden, en een database hebben we niet.
 */

const API = "https://api.x.com/2";

/** Procent-codering volgens RFC 3986. `encodeURIComponent` laat ! ' ( ) * staan; OAuth codeert ze wel. */
function encode(value: string) {
  return encodeURIComponent(value).replace(/[!'()*]/g, (c) => `%${c.charCodeAt(0).toString(16).toUpperCase()}`);
}

/**
 * Wat ondertekend wordt: methode, URL en alle parameters, gesorteerd en
 * gecodeerd. Een body in JSON of multipart telt niet mee, alleen een
 * formulier-body zou dat doen, en die gebruiken we niet.
 */
export function signatureBase(method: string, url: string, params: Record<string, string>) {
  const pairs = Object.entries(params)
    .map(([key, value]) => [encode(key), encode(value)])
    .sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0))
    .map(([key, value]) => `${key}=${value}`)
    .join("&");
  return [method.toUpperCase(), encode(url), encode(pairs)].join("&");
}

/** HMAC-SHA1 over de basis, met beide geheimen als sleutel. Getest tegen het voorbeeld van X. */
export function oauthSignature(base: string, consumerSecret: string, tokenSecret: string) {
  return createHmac("sha1", `${encode(consumerSecret)}&${encode(tokenSecret)}`).update(base).digest("base64");
}

function credentials() {
  const keys = {
    apiKey: process.env.X_API_KEY,
    apiSecret: process.env.X_API_SECRET,
    accessToken: process.env.X_ACCESS_TOKEN,
    accessTokenSecret: process.env.X_ACCESS_TOKEN_SECRET,
  };
  const missing = Object.entries(keys).filter(([, value]) => !value);
  if (missing.length) throw new Error(`X-sleutels ontbreken: ${missing.map(([name]) => name).join(", ")}`);
  return keys as Record<keyof typeof keys, string>;
}

/** De Authorization-header voor één verzoek. Elke keer een nieuwe nonce en tijd, zodat X een herhaling weigert. */
function authorization(method: string, url: string) {
  const keys = credentials();
  const oauth = {
    oauth_consumer_key: keys.apiKey,
    oauth_nonce: randomBytes(16).toString("hex"),
    oauth_signature_method: "HMAC-SHA1",
    oauth_timestamp: String(Math.floor(Date.now() / 1000)),
    oauth_token: keys.accessToken,
    oauth_version: "1.0",
  };
  const signature = oauthSignature(signatureBase(method, url, oauth), keys.apiSecret, keys.accessTokenSecret);
  const fields = { ...oauth, oauth_signature: signature };
  return `OAuth ${Object.entries(fields)
    .map(([key, value]) => `${encode(key)}="${encode(value)}"`)
    .join(", ")}`;
}

async function call(path: string, body: FormData | object) {
  const url = `${API}${path}`;
  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: authorization("POST", url),
      ...(body instanceof FormData ? {} : { "Content-Type": "application/json" }),
    },
    body: body instanceof FormData ? body : JSON.stringify(body),
  });
  const result = await response.json().catch(() => null);
  if (!response.ok) throw new Error(`X ${path} gaf ${response.status}: ${JSON.stringify(result)}`);
  return result;
}

/** Uploadt een kaart-PNG en geeft het media-id terug, voor `createPost`. */
export async function uploadImage(png: Blob) {
  const form = new FormData();
  form.append("media", png, "kaart.png");
  form.append("media_category", "tweet_image");
  return (await call("/media/upload", form)).data.id as string;
}

/** Plaatst de post met de kaart en geeft het id van de post terug. */
export async function createPost(text: string, mediaId: string) {
  return (await call("/tweets", { text, media: { media_ids: [mediaId] } })).data.id as string;
}
