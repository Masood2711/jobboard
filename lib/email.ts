// lib/email.ts
import { SITE } from "@/config/site";

export interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
  from?: string;
}

export async function sendEmail({ to, subject, html, from }: SendEmailOptions): Promise<{ success: boolean; id?: string }> {
  const apiKey = process.env.RESEND_API_KEY;
  const sender = from || process.env.EMAIL_FROM || `${SITE.name} <hello@${SITE.domain}>`;

  if (!apiKey || apiKey.includes("placeholder")) {
    console.log(`[Email Mock] To: ${to} | Subject: "${subject}"`);
    console.log(`[Email Mock HTML snippet]: ${html.slice(0, 150)}...`);
    return { success: true, id: `mock-email-${Date.now()}` };
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        from: sender,
        to,
        subject,
        html,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error("[Email Error - Resend]:", err);
      return { success: false };
    }

    const data = await res.json();
    return { success: true, id: data.id };
  } catch (error) {
    console.error("[Email Exception]:", error);
    return { success: false };
  }
}
