import type { ActionRecord, ActionType, BotStatus, NeedKind } from "@/lib/types";

export const BASE_PATH = "/admin";

export const apiPath = (path: string): string => `${BASE_PATH}${path}`;

export const STATUS_LABEL: Record<BotStatus, string> = {
  working: "Working",
  idle: "Idle",
  waiting_on_orel: "Waiting on you",
  blocked: "Blocked",
  error: "Error",
};

export const KIND_LABEL: Record<NeedKind, string> = {
  approval: "Approval",
  question: "Question",
  fyi: "FYI",
};

export const ACTION_LABEL: Record<ActionType, string> = {
  approve: "Approve",
  reject: "Reject",
  message: "Note",
  refresh: "Refresh",
};

const STALE_MS = 2 * 60 * 60 * 1000;

export const formatJerusalem = (iso: string): string => {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Jerusalem",
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
    timeZoneName: "short",
  }).format(date);
};

export const formatRelative = (iso: string, now = Date.now()): string => {
  const time = new Date(iso).getTime();
  if (Number.isNaN(time)) return "—";
  const delta = Math.round((now - time) / 1000);
  if (delta < -60) return formatJerusalem(iso);
  if (delta < 10) return "just now";
  if (delta < 60) return `${delta}s ago`;
  const minutes = Math.round(delta / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 48) return `${hours}h ago`;
  const days = Math.round(hours / 24);
  return `${days}d ago`;
};

export const isStale = (iso: string, now = Date.now()): boolean => {
  const time = new Date(iso).getTime();
  if (Number.isNaN(time)) return true;
  return now - time > STALE_MS;
};

export const safeHttpUrl = (value: string): string | null => {
  try {
    const url = new URL(value);
    if (url.protocol !== "http:" && url.protocol !== "https:") return null;
    return url.toString();
  } catch {
    return null;
  }
};

export const actionKey = (input: { botId: string; type: string; itemId?: string }): string =>
  `${input.botId}:${input.type}:${input.itemId ?? ""}`;

export const actionPhrase = (action: ActionRecord): string => {
  if (action.type === "refresh") return action.botId === "all" ? "Refresh the floor" : `Refresh ${action.botId}`;
  if (action.type === "message") return action.text ?? "Sent a note";
  if (action.type === "approve") return `Approved ${action.itemId ?? "an item"}`;
  return `Rejected ${action.itemId ?? "an item"}`;
};

export const safeClientError = (value: unknown): string | null => {
  if (!value || typeof value !== "object" || !("error" in value)) return null;
  const message = (value as { error: unknown }).error;
  if (typeof message !== "string") return null;
  if (message.length > 140) return null;
  if (/token|secret|password|bearer|blob/i.test(message)) return null;
  return message;
};

export const cn = (...parts: Array<string | false | null | undefined>): string =>
  parts.filter(Boolean).join(" ");
