import { cn, STATUS_LABEL } from "@/lib/format";
import type { BotStatus } from "@/lib/types";

const tone: Record<BotStatus, string> = {
  working: "bg-emerald-400/10 text-emerald-200 ring-emerald-300/25",
  idle: "bg-white/[0.05] text-zinc-300 ring-white/10",
  waiting_on_orel: "bg-amber-300/10 text-amber-100 ring-amber-200/30",
  blocked: "bg-orange-400/10 text-orange-100 ring-orange-300/30",
  error: "bg-rose-400/10 text-rose-100 ring-rose-300/30",
};

const dot: Record<BotStatus, string> = {
  working: "bg-emerald-300 shadow-[0_0_8px_rgba(110,231,183,0.9)]",
  idle: "bg-zinc-400",
  waiting_on_orel: "bg-amber-200 shadow-[0_0_8px_rgba(252,211,77,0.7)]",
  blocked: "bg-orange-300",
  error: "bg-rose-300 shadow-[0_0_8px_rgba(251,113,133,0.7)]",
};

export const StatusPill = ({ status }: { status: BotStatus }) => (
  <span
    className={cn(
      "inline-flex items-center gap-1.5 rounded-full px-2 py-1 text-[11px] font-medium ring-1",
      tone[status],
    )}
  >
    <span
      aria-hidden
      className={cn("h-1.5 w-1.5 rounded-full", dot[status], status === "working" && "motion-safe:animate-pulse")}
    />
    {STATUS_LABEL[status]}
  </span>
);
