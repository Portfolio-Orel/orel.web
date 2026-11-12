"use client";

import { useState } from "react";
import { actionKey, cn, formatRelative, KIND_LABEL, safeHttpUrl } from "@/lib/format";
import type { ActionRecord, ActionType, BotRecord, NeedKind } from "@/lib/types";

type ActionRequest = {
  botId: string;
  type: ActionType;
  itemId?: string;
  text?: string;
};

const kindEdge: Record<NeedKind, string> = {
  approval: "border-l-amber-200",
  question: "border-l-sky-300",
  fyi: "border-l-zinc-400",
};

const kindRank: Record<NeedKind, number> = { approval: 0, question: 1, fyi: 2 };

const statusLine = (action: ActionRecord): string => {
  if (action.status === "handled") return action.resultNote ? `Handled · ${action.resultNote}` : "Handled";
  if (action.status === "delivered") return "Delivered";
  if (action.deliveryError) return "Pending · delivery failed";
  return "Pending";
};

export const NeedsYou = ({
  bots,
  actions,
  pendingKeys,
  onAction,
  onOpenBot,
}: {
  bots: BotRecord[];
  actions: ActionRecord[];
  pendingKeys: string[];
  onAction: (input: ActionRequest) => void;
  onOpenBot: (botId: string) => void;
}) => {
  const [replyKey, setReplyKey] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");

  const items = bots
    .flatMap((bot) => bot.needsOrel.map((item) => ({ bot, item })))
    .sort(
      (a, b) =>
        kindRank[a.item.kind] - kindRank[b.item.kind] || a.bot.name.localeCompare(b.bot.name),
    );

  const handleReply = (botId: string, itemId: string) => {
    const text = replyText.trim();
    if (!text) return;
    onAction({ botId, type: "message", itemId, text });
    setReplyText("");
    setReplyKey(null);
  };

  return (
    <section id="needs-you" aria-labelledby="needs-you-heading" className="scroll-mt-6">
      <div className="mb-3 flex items-baseline justify-between gap-3">
        <h2 id="needs-you-heading" className="text-sm font-medium text-zinc-100">
          Needs you
        </h2>
        <span className="text-xs text-zinc-500">{items.length === 0 ? "Clear" : `${items.length} open`}</span>
      </div>
      {items.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-white/10 px-4 py-8 text-sm text-zinc-500">
          Nothing needs you right now.
        </div>
      ) : (
        <ul className="space-y-2">
          {items.map(({ bot, item }) => {
            const key = `${bot.botId}:${item.id}`;
            const latest = actions
              .filter((action) => action.botId === bot.botId && action.itemId === item.id)
              .sort((a, b) => b.createdAt.localeCompare(a.createdAt))[0];
            const link = item.link ? safeHttpUrl(item.link) : null;
            const approveKey = actionKey({ botId: bot.botId, type: "approve", itemId: item.id });
            const rejectKey = actionKey({ botId: bot.botId, type: "reject", itemId: item.id });
            const messageKey = actionKey({ botId: bot.botId, type: "message", itemId: item.id });
            const replyOpen = replyKey === key;
            return (
              <li
                key={key}
                className={cn(
                  "rounded-2xl border border-white/10 border-l-2 bg-white/[0.03] p-4",
                  kindEdge[item.kind],
                )}
              >
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] uppercase tracking-[0.14em] text-zinc-500">
                  <span className="text-zinc-300">{KIND_LABEL[item.kind]}</span>
                  <button
                    type="button"
                    onClick={() => onOpenBot(bot.botId)}
                    className="normal-case tracking-normal text-zinc-300 underline-offset-4 hover:text-white hover:underline"
                  >
                    {bot.name}
                    {bot.title ? <span className="text-zinc-500"> · {bot.title}</span> : null}
                  </button>
                  <time dateTime={bot.updatedAt} className="ml-auto normal-case tracking-normal">
                    {formatRelative(bot.updatedAt)}
                  </time>
                </div>
                <h3 className="mt-2 text-[15px] font-medium tracking-tight text-zinc-50">{item.title}</h3>
                {item.detail ? <p className="mt-1 text-sm leading-6 text-zinc-400">{item.detail}</p> : null}
                {link ? (
                  <a
                    href={link}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="mt-2 inline-block text-sm text-zinc-300 underline-offset-4 hover:underline"
                  >
                    Open link
                  </a>
                ) : null}
                <div className="mt-3 flex flex-wrap gap-2">
                  <button
                    type="button"
                    disabled={pendingKeys.includes(approveKey)}
                    onClick={() => onAction({ botId: bot.botId, type: "approve", itemId: item.id })}
                    className="h-10 rounded-full bg-white px-3.5 text-sm font-medium text-zinc-950 disabled:opacity-60"
                  >
                    Approve
                  </button>
                  <button
                    type="button"
                    disabled={pendingKeys.includes(rejectKey)}
                    onClick={() => onAction({ botId: bot.botId, type: "reject", itemId: item.id })}
                    className="h-10 rounded-full border border-white/15 px-3.5 text-sm text-zinc-100 hover:bg-white/5 disabled:opacity-60"
                  >
                    Reject
                  </button>
                  <button
                    type="button"
                    aria-expanded={replyOpen}
                    onClick={() => {
                      setReplyKey(replyOpen ? null : key);
                      setReplyText("");
                    }}
                    className="h-10 rounded-full border border-white/15 px-3.5 text-sm text-zinc-100 hover:bg-white/5"
                  >
                    Reply
                  </button>
                </div>
                {replyOpen ? (
                  <form
                    className="mt-3 flex flex-col gap-2 sm:flex-row"
                    onSubmit={(event) => {
                      event.preventDefault();
                      handleReply(bot.botId, item.id);
                    }}
                  >
                    <label className="sr-only" htmlFor={`reply-${key}`}>
                      Reply to {bot.name}
                    </label>
                    <input
                      id={`reply-${key}`}
                      value={replyText}
                      onChange={(event) => setReplyText(event.target.value)}
                      maxLength={2000}
                      placeholder="Write a short note"
                      className="h-10 flex-1 rounded-xl border border-white/10 bg-black/30 px-3 text-sm outline-none focus:border-white/30"
                    />
                    <button
                      type="submit"
                      disabled={pendingKeys.includes(messageKey) || replyText.trim().length === 0}
                      className="h-10 rounded-full bg-white px-4 text-sm font-medium text-zinc-950 disabled:opacity-60"
                    >
                      Send
                    </button>
                  </form>
                ) : null}
                {latest ? <p className="mt-3 text-xs text-zinc-400">{statusLine(latest)}</p> : null}
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
};
