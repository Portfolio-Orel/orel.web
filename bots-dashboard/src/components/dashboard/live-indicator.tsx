"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/format";

type LiveState = "live" | "paused" | "offline";

const stateWord: Record<LiveState, string> = {
  live: "Live",
  paused: "Paused",
  offline: "Offline",
};

const labelFor = (state: LiveState, fetchedAt: number | null, now: number): string => {
  if (state === "offline") return "Reconnecting";
  if (!fetchedAt) return state === "paused" ? "Tab hidden" : "Connecting";
  const seconds = Math.max(0, Math.round((now - fetchedAt) / 1000));
  return `Updated ${seconds}s ago`;
};

export const LiveIndicator = ({ state, fetchedAt }: { state: LiveState; fetchedAt: number | null }) => {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-1 text-[11px] text-zinc-300">
      <span
        aria-hidden
        className={cn(
          "h-1.5 w-1.5 rounded-full",
          state === "live" && "bg-emerald-300 shadow-[0_0_8px_rgba(110,231,183,0.9)] motion-safe:animate-pulse",
          state === "paused" && "bg-zinc-500",
          state === "offline" && "bg-amber-300",
        )}
      />
      <span className="font-medium tracking-wide">{stateWord[state]}</span>
      <span className="text-zinc-500">{labelFor(state, fetchedAt, now)}</span>
    </span>
  );
};
