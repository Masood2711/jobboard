// lib/indexing.ts
import prisma from "@/lib/db";
import { SITE } from "@/config/site";

export type IndexNotificationType = "URL_UPDATED" | "URL_DELETED";

/**
 * Google Indexing API notifier
 * Allows job postings to be crawled and indexed by Google within minutes of publishing
 */
export async function notifyGoogleIndexing(jobSlug: string, type: IndexNotificationType = "URL_UPDATED"): Promise<{ success: boolean; message: string }> {
  const jobUrl = `${SITE.url}/jobs/${jobSlug}`;
  const serviceAccountJson = process.env.GOOGLE_INDEXING_SERVICE_ACCOUNT_JSON;

  if (!serviceAccountJson) {
    // In local dev or when key not yet configured, log gracefully without breaking the flow
    console.log(`[Google Indexing API (Mock)] Notified ${type} for ${jobUrl}`);
    return {
      success: true,
      message: `[MOCK] Successfully notified Google Indexing API: ${type} for ${jobUrl}`,
    };
  }

  try {
    const creds = JSON.parse(serviceAccountJson);
    const token = await getGoogleOAuth2Token(creds);

    const res = await fetch("https://indexing.googleapis.com/v3/urlNotifications:publish", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        url: jobUrl,
        type: type,
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error(`[Google Indexing API Error] status ${res.status}:`, errText);
      return { success: false, message: `Google API returned status ${res.status}` };
    }

    // Update indexNotifiedAt on the Job record if database is live
    try {
      await prisma.job.updateMany({
        where: { slug: jobSlug },
        data: { indexNotifiedAt: new Date() },
      });
    } catch {
      // ignore db errors in fallback mode
    }

    console.log(`[Google Indexing API] Successfully sent ${type} for ${jobUrl}`);
    return { success: true, message: `Notified Google of ${type}` };
  } catch (err: any) {
    console.error("[Google Indexing API Exception]:", err.message || err);
    return { success: false, message: err.message || "Failed to notify Google Indexing API" };
  }
}

/**
 * Generates OAuth2 access token for Google Service Account using pure Web Crypto
 */
async function getGoogleOAuth2Token(creds: { client_email: string; private_key: string }): Promise<string> {
  const iat = Math.floor(Date.now() / 1000);
  const exp = iat + 3600;

  const header = {
    alg: "RS256",
    typ: "JWT",
  };

  const claimSet = {
    iss: creds.client_email,
    scope: "https://www.googleapis.com/auth/indexing",
    aud: "https://oauth2.googleapis.com/token",
    exp,
    iat,
  };

  const toBase64Url = (str: string) =>
    Buffer.from(str)
      .toString("base64")
      .replace(/=/g, "")
      .replace(/\+/g, "-")
      .replace(/\//g, "_");

  const unsignedToken = `${toBase64Url(JSON.stringify(header))}.${toBase64Url(JSON.stringify(claimSet))}`;

  // Sign using Node crypto
  const crypto = await import("crypto");
  const signer = crypto.createSign("RSA-SHA256");
  signer.update(unsignedToken);
  const signature = signer.sign(creds.private_key, "base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");

  const jwt = `${unsignedToken}.${signature}`;

  const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion: jwt,
    }),
  });

  if (!tokenRes.ok) {
    const errorText = await tokenRes.text();
    throw new Error(`Failed to exchange JWT for Google access token: ${errorText}`);
  }

  const tokenData = await tokenRes.json();
  return tokenData.access_token;
}
