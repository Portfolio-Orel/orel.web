"use client";

import { useEffect, useId, useRef, useState } from "react";
import { actionKey, actionPhrase, formatJerusalem, formatRelative, isStale, safeHttpUrl, STATUS_LABEL } from "@/lib/format";
import type { ActionRecord, ActionType, BotRecord, HistoryEvent } from "@/lib/types";
import { StatusPill } from "@/components/dashboard/status-pill";

type ActionRequest = {
  botId: string;
  type: ActionType;
  itemId?: string;
  text?: string;
};

const FOCUSABLE = 'button, [href], textarea, input, select, [tabindex]:not([tabindex="-1"])';

export const BotDrawer = ({
  bot,
  events,
  actions,
  pendingKeys,
  onAction,
  onClose,
}: {
  bot: BotRecord;
  events: HistoryEvent[];
  actions: ActionRecord[];
  pendingKeys: string[];
  onAction: (input: ActionRequest) => void;
  onClose: () => void;
}) => {
  const titleId = useId();
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const [note, setNote] = useState("");
  const messageKey = actionKey({ botId: bot.botId, type: "message" });
  const history = events.filter((event) => event.botId === bot.botId).slice(0, 30);
  const botActions = actions.filter((action) => action.botId === bot.botId).slice(0, 12);
  const stale = isStale(bot.updatedAt);

  useEffect(() => {
    const previouslyFocused = document.activeElement;
    closeRef.current?.focus();
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }
      if (event.key !== "Tab" || !dialogRef.current) return;
      const focusable = [...dialogRef.current.querySelectorAll<HTMLElement>(FOCUSABLE)].filter(
        (element) => !element.hasAttribute("disabled"),
      );
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (!first || !last) return;
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = originalOverflow;
      if (previouslyFocused instanceof HTMLElement) previouslyFocused.focus();
    };
  }, [onClose]);

  const handleSend = () => {
    const text = note.trim();
    if (!text) return;
    onAction({ botId: bot.botId, type: "message", text });
    setNote("");
  };

  return (
    <div className="fixed inset-0 z-40">
      <button type="button" aria-label="Close details" className="absolute inset-0 bg-black/70" onClick={onClose} />
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="absolute inset-y-0 right-0 flex w-full max-w-[440px] flex-col border-l border-white/10 bg-[#0c0d11] shadow-[0_0_80px_rgba(0,0,0,0.45)]"
      >
        <div className="flex items-start justify-between gap-3 border-b border-white/10 px-5 py-4">
          <div className="min-w-0">
            <p className="text-[11px] uppercase tracking-[0.16em] text-zinc-500">{bot.title || "Assistant"}</p>
            <h2 id={titleId} className="mt-1 truncate text-xl font-medium tracking-tight">
              {bot.name}
            </h2>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <StatusPill status={bot.status} />
              <time dateTime={bot.updatedAt} className="text-xs text-zinc-500">
                {formatJerusalem(bot.updatedAt)} · {formatRelative(bot.updatedAt)}
                {stale ? " · stale" : ""}
              </time>
            </div>
          </div>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/10 text-zinc-300 hover:bg-white/5"
          >
            ×
          </button>
        </div>
        <div className="flex-1 space-y-6 overflow-y-auto px-5 py-5">
          <p className="text-sm leading-6 text-zinc-200">{bot.summary}</p>
          <dl className="space-y-3 text-sm">
            <div>
              <dt className="text-[11px] uppercase tracking-[0.16em] text-zinc-500">Last done</dt>
              <dd className="mt-1 text-zinc-200">{bot.lastDone || "—"}</dd>
            </div>
            <div>
              <dt className="text-[11px] uppercase tracking-[0.16em] text-zinc-500">Next up</dt>
              <dd className="mt-1 text-zinc-200">{bot.nextUp || "—"}</dd>
            </div>
          </dl>
          {bot.links.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {bot.links.map((link) => {
                const href = safeHttpUrl(link.url);
                if (!href) return null;
                return (
                  <a
                    key={`${link.label}-${href}`}
                    href={href}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="rounded-full border border-white/10 px-3 py-1.5 text-xs text-zinc-200 hover:border-white/30"
                  >
                    {link.label}
                  </a>
                );
              })}
            </div>
          ) : null}
          <form
            className="space-y-2"
            onSubmit={(event) => {
              event.preventDefault();
              handleSend();
            }}
          >
            <label htmlFor="bot-note" className="text-[11px] uppercase tracking-[0.16em] text-zinc-500">
              Note to {bot.name}
            </label>
            <textarea
              id="bot-note"
              value={note}
              onChange={(event) => setNote(event.target.value)}
              rows={3}
              maxLength={2000}
              placeholder="Ask for a change, or answer something they raised."
              className="w-full resize-none rounded-2xl border border-white/10 bg-black/30 px-3 py-2 text-sm outline-none focus:border-white/30"
            />
            <button
              type="submit"
              disabled={pendingKeys.includes(messageKey) || note.trim().length === 0}
              className="h-10 rounded-full bg-white px-4 text-sm font-medium text-zinc-950 disabled:opacity-60"
            >
              Send note
            </button>
          </form>
          <section>
            <h3 className="text-[11px] uppercase tracking-[0.16em] text-zinc-500">What you sent</h3>
            {botActions.length === 0 ? (
              <p className="mt-2 text-sm text-zinc-500">No notes yet.</p>
            ) : (
              <ul className="mt-2 space-y-2">
                {botActions.map((action) => (
                  <li key={action.id} className="rounded-xl border border-white/8 px-3 py-2">
                    <p className="text-sm text-zinc-200">{actionPhrase(action)}</p>
                    <p className="mt-1 text-xs text-zinc-500">
                      {action.status}
                      {action.deliveryError ? " · delivery failed" : ""}
                      {action.resultNote ? ` · ${action.resultNote}` : ""}
                      {" · "}
                      {formatRelative(action.createdAt)}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </section>
          <section>
            <h3 className="text-[11px] uppercase tracking-[0.16em] text-zinc-500">History</h3>
            {history.length === 0 ? (
              <p className="mt-2 text-sm text-zinc-500">No history yet.</p>
            ) : (
              <ol className="mt-3 space-y-3 border-l border-white/10 pl-4">
                {history.map((event) => (
                  <li key={event.id} className="relative">
                    <span className="absolute -left-[21px] top-1.5 h-1.5 w-1.5 rounded-full bg-zinc-500" />
                    <p className="text-sm text-zinc-200">{event.summary}</p>
                    <p className="mt-0.5 text-xs text-zinc-500">
                      {STATUS_LABEL[event.status]} · {formatJerusalem(event.at)}
                    </p>
                  </li>
                ))}
              </ol>
            )}
          </section>
        </div>
      </div>
    </div>
  );
};
