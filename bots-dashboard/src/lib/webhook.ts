import type { ActionRecord, NeedsOrelItem } from "@/lib/types";

export type DeliveryResult = {
  delivered: boolean;
  error?: string;
};

export const webhookPayload = (
  action: ActionRecord,
  item?: Pick<NeedsOrelItem, "title" | "link">,
): Record<string, unknown> => {
  const payload: Record<string, unknown> = {
    id: action.id,
    botId: action.botId,
    type: action.type,
    itemId: action.itemId ?? null,
    text: action.text ?? null,
    createdAt: action.createdAt,
  };
  if (action.type === "done") {
    payload.action = "done";
    payload.title = item?.title ?? null;
    payload.link = item?.link ?? null;
  }
  return payload;
};

export const deliverAction = async (
  action: ActionRecord,
  item?: Pick<NeedsOrelItem, "title" | "link">,
): Promise<DeliveryResult> => {
  const url = process.env.BOTDASH_WEBHOOK_URL?.trim();
  if (!url) return { delivered: false };
  const auth = process.env.BOTDASH_WEBHOOK_AUTH;
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (auth) headers.Authorization = auth;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers,
      body: JSON.stringify(webhookPayload(action, item)),
      signal: AbortSignal.timeout(8000),
    });
    if (!response.ok) return { delivered: false, error: `Webhook returned ${response.status}` };
    return { delivered: true };
  } catch {
    return { delivered: false, error: "Webhook request failed" };
  }
};
