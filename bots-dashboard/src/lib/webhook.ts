import type { ActionRecord } from "@/lib/types";

export type DeliveryResult = {
  delivered: boolean;
  error?: string;
};

export const deliverAction = async (action: ActionRecord): Promise<DeliveryResult> => {
  const url = process.env.BOTDASH_WEBHOOK_URL?.trim();
  if (!url) return { delivered: false };
  const auth = process.env.BOTDASH_WEBHOOK_AUTH;
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (auth) headers.Authorization = auth;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers,
      body: JSON.stringify({
        id: action.id,
        botId: action.botId,
        type: action.type,
        itemId: action.itemId ?? null,
        text: action.text ?? null,
        createdAt: action.createdAt,
      }),
      signal: AbortSignal.timeout(8000),
    });
    if (!response.ok) return { delivered: false, error: `Webhook returned ${response.status}` };
    return { delivered: true };
  } catch {
    return { delivered: false, error: "Webhook request failed" };
  }
};
