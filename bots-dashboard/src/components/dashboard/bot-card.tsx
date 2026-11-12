import { cn, formatRelative, isStale, safeHttpUrl } from "@/lib/format";
import type { BotRecord } from "@/lib/types";
import { StatusPill } from "@/components/dashboard/status-pill";

export const BotCard = ({ bot, onOpen }: { bot: BotRecord; onOpen: (botId: string) => void }) => {
  const stale = isStale(bot.updatedAt);
  const handleOpen = () => onOpen(bot.botId);

  return (
    <article
      className={cn(
        "relative flex flex-col rounded-2xl border border-white/10 bg-white/[0.03] transition hover:border-white/20 hover:bg-white/[0.045]",
        stale && "opacity-55",
      )}
    >
      <button
        type="button"
        onClick={handleOpen}
        aria-label={`Open details for ${bot.name}`}
        className="absolute inset-0 z-0 rounded-2xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/70"
      />
      <div className="pointer-events-none relative z-10 flex flex-1 flex-col p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="truncate text-[15px] font-medium tracking-tight text-zinc-50">{bot.name}</h3>
            <p className="mt-0.5 truncate text-xs text-zinc-500">{bot.title || "Assistant"}</p>
          </div>
          <StatusPill status={bot.status} />
        </div>
        <p className="mt-3 line-clamp-2 text-sm leading-6 text-zinc-300">{bot.summary}</p>
        <dl className="mt-4 space-y-1.5 text-sm">
          {bot.lastDone ? (
            <div className="grid grid-cols-[3rem_1fr] gap-2">
              <dt className="text-xs uppercase tracking-[0.14em] text-zinc-500">Last</dt>
              <dd className="line-clamp-2 text-zinc-300">{bot.lastDone}</dd>
            </div>
          ) : null}
          {bot.nextUp ? (
            <div className="grid grid-cols-[3rem_1fr] gap-2">
              <dt className="text-xs uppercase tracking-[0.14em] text-zinc-500">Next</dt>
              <dd className="line-clamp-2 text-zinc-300">{bot.nextUp}</dd>
            </div>
          ) : null}
        </dl>
        <p className="mt-4 text-xs text-zinc-500">
          <time dateTime={bot.updatedAt}>{formatRelative(bot.updatedAt)}</time>
          {stale ? <span className="ml-2 text-zinc-400">Stale</span> : null}
        </p>
      </div>
      {bot.links.length > 0 ? (
        <div className="relative z-10 flex flex-wrap gap-2 px-4 pb-4">
          {bot.links.map((link) => {
            const href = safeHttpUrl(link.url);
            if (!href) return null;
            return (
              <a
                key={`${link.label}-${href}`}
                href={href}
                target="_blank"
                rel="noreferrer noopener"
                className="rounded-full border border-white/10 px-2.5 py-1 text-xs text-zinc-300 hover:border-white/25 hover:text-white"
              >
                {link.label}
              </a>
            );
          })}
        </div>
      ) : null}
    </article>
  );
};
