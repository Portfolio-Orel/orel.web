import { formatJerusalem, formatRelative } from "@/lib/format";
import type { BotRecord, BotStatus } from "@/lib/types";

const ORDER: BotStatus[] = ["working", "idle", "waiting_on_orel", "blocked", "error"];

const LABELS: Record<BotStatus, string> = {
  working: "Working",
  idle: "Idle",
  waiting_on_orel: "Waiting",
  blocked: "Blocked",
  error: "Error",
};

const TONES: Record<BotStatus, string> = {
  working: "text-emerald-200",
  idle: "text-zinc-100",
  waiting_on_orel: "text-amber-100",
  blocked: "text-orange-100",
  error: "text-rose-200",
};

export const SummaryStrip = ({ bots, needsCount }: { bots: BotRecord[]; needsCount: number }) => {
  const counts = Object.fromEntries(ORDER.map((status) => [status, 0])) as Record<BotStatus, number>;
  for (const bot of bots) counts[bot.status] += 1;
  const newest = bots.reduce<string | null>((latest, bot) => {
    if (!latest) return bot.updatedAt;
    return bot.updatedAt > latest ? bot.updatedAt : latest;
  }, null);

  const handleNeeds = () => {
    document.getElementById("needs-you")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <section aria-label="Status summary" className="space-y-3">
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
        {ORDER.map((status) => (
          <div key={status} className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3">
            <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-zinc-500">{LABELS[status]}</p>
            <p className={`mt-2 font-mono text-2xl tracking-tight ${TONES[status]}`}>{counts[status]}</p>
          </div>
        ))}
        <button
          type="button"
          onClick={handleNeeds}
          className="rounded-2xl border border-amber-200/20 bg-amber-200/[0.05] px-4 py-3 text-left transition hover:bg-amber-200/[0.08]"
        >
          <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-amber-100/70">Needs you</p>
          <p className="mt-2 font-mono text-2xl tracking-tight text-amber-100">{needsCount}</p>
        </button>
      </div>
      <p className="text-xs text-zinc-500">
        Last update{" "}
        <time dateTime={newest ?? undefined} className="text-zinc-300">
          {newest ? `${formatJerusalem(newest)} · ${formatRelative(newest)}` : "—"}
        </time>
      </p>
    </section>
  );
};
