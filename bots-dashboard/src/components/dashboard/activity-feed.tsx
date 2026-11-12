import { actionPhrase, formatJerusalem, formatRelative } from "@/lib/format";
import type { ActionRecord, HistoryEvent } from "@/lib/types";
import { StatusPill } from "@/components/dashboard/status-pill";

type FeedItem =
  | { kind: "event"; at: string; id: string; event: HistoryEvent }
  | { kind: "action"; at: string; id: string; action: ActionRecord };

const statusText: Record<ActionRecord["status"], string> = {
  pending: "Pending",
  delivered: "Delivered",
  handled: "Handled",
};

export const ActivityFeed = ({ events, actions }: { events: HistoryEvent[]; actions: ActionRecord[] }) => {
  const items: FeedItem[] = [
    ...events.map((event) => ({ kind: "event" as const, at: event.at, id: event.id, event })),
    ...actions.map((action) => ({ kind: "action" as const, at: action.createdAt, id: action.id, action })),
  ]
    .sort((a, b) => b.at.localeCompare(a.at))
    .slice(0, 40);

  return (
    <section aria-labelledby="activity-heading">
      <div className="mb-3 flex items-baseline justify-between">
        <h2 id="activity-heading" className="text-sm font-medium text-zinc-100">
          Recent activity
        </h2>
        <span className="text-xs text-zinc-500">Asia/Jerusalem</span>
      </div>
      {items.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-white/10 px-4 py-8 text-sm text-zinc-500">
          Activity will show up as bots report in.
        </div>
      ) : (
        <ol className="divide-y divide-white/8 overflow-hidden rounded-2xl border border-white/10">
          {items.map((item) => (
            <li key={`${item.kind}-${item.id}`} className="flex flex-col gap-2 bg-white/[0.02] px-4 py-3 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0">
                {item.kind === "event" ? (
                  <>
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-sm font-medium text-zinc-100">{item.event.name}</p>
                      <StatusPill status={item.event.status} />
                    </div>
                    <p className="mt-1 text-sm text-zinc-400">{item.event.summary}</p>
                  </>
                ) : (
                  <>
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-sm font-medium text-zinc-100">You</p>
                      <span className="rounded-full bg-white/5 px-2 py-0.5 text-[11px] text-zinc-300">
                        {statusText[item.action.status]}
                        {item.action.deliveryError ? " · delivery failed" : ""}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-zinc-400">{actionPhrase(item.action)}</p>
                    {item.action.resultNote ? (
                      <p className="mt-1 text-sm text-zinc-300">{item.action.resultNote}</p>
                    ) : null}
                  </>
                )}
              </div>
              <time dateTime={item.at} className="shrink-0 text-xs text-zinc-500" title={formatJerusalem(item.at)}>
                {formatRelative(item.at)}
              </time>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
};
