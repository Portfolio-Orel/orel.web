"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ActivityFeed } from "@/components/dashboard/activity-feed";
import { BotCard } from "@/components/dashboard/bot-card";
import { BotDrawer } from "@/components/dashboard/bot-drawer";
import { LiveIndicator } from "@/components/dashboard/live-indicator";
import { NeedsYou } from "@/components/dashboard/needs-you";
import { DashboardSkeleton } from "@/components/dashboard/skeletons";
import { SummaryStrip } from "@/components/dashboard/summary-strip";
import { actionKey, apiPath, isStale, safeClientError } from "@/lib/format";
import type { ActionRecord, ActionType, BotStatus, FloorSnapshot } from "@/lib/types";

const POLL_MS = 12000;

const STATUS_ORDER: Record<BotStatus, number> = {
  waiting_on_orel: 0,
  error: 1,
  blocked: 2,
  working: 3,
  idle: 4,
};

type LiveState = "live" | "paused" | "offline";

type ActionRequest = {
  botId: string;
  type: ActionType;
  itemId?: string;
  text?: string;
};

const toastFor = (action: ActionRecord): string => {
  if (action.status === "delivered") return "Sent. The bot has it.";
  if (action.deliveryError) return "Saved. Delivery failed, so it stays pending.";
  return "Saved. Waiting for the bot to pick it up.";
};

export const Dashboard = () => {
  const router = useRouter();
  const [floor, setFloor] = useState<FloorSnapshot | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [live, setLive] = useState<LiveState>("live");
  const [fetchedAt, setFetchedAt] = useState<number | null>(null);
  const [openBotId, setOpenBotId] = useState<string | null>(null);
  const [pendingKeys, setPendingKeys] = useState<string[]>([]);
  const [toast, setToast] = useState("");

  const load = useCallback(async () => {
    try {
      const response = await fetch(apiPath("/api/bots"), { cache: "no-store" });
      if (response.status === 401) {
        router.push("/login");
        return;
      }
      const body: unknown = await response.json().catch(() => null);
      if (!response.ok) {
        setError(safeClientError(body) ?? "Can't reach the floor. Retrying.");
        setLive("offline");
        return;
      }
      setFloor(body as FloorSnapshot);
      setFetchedAt(Date.now());
      setError("");
      setLive(document.visibilityState === "visible" ? "live" : "paused");
    } catch {
      setError("Can't reach the floor. Retrying.");
      setLive("offline");
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    let stopped = false;
    let timer = 0;
    const tick = async () => {
      if (stopped) return;
      if (document.visibilityState === "visible") await load();
      if (stopped) return;
      timer = window.setTimeout(() => {
        void tick();
      }, POLL_MS);
    };
    const handleVisibility = () => {
      if (document.visibilityState === "hidden") {
        setLive("paused");
        return;
      }
      void load();
    };
    void tick();
    document.addEventListener("visibilitychange", handleVisibility);
    return () => {
      stopped = true;
      window.clearTimeout(timer);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, [load]);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(""), 4200);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const bots = useMemo(() => floor?.bots ?? [], [floor]);
  const sortedBots = useMemo(() => {
    return [...bots].sort((a, b) => {
      const staleDelta = Number(isStale(a.updatedAt)) - Number(isStale(b.updatedAt));
      if (staleDelta !== 0) return staleDelta;
      const statusDelta = STATUS_ORDER[a.status] - STATUS_ORDER[b.status];
      if (statusDelta !== 0) return statusDelta;
      return a.name.localeCompare(b.name);
    });
  }, [bots]);
  const needsCount = floor?.bots.reduce((sum, bot) => sum + bot.needsOrel.length, 0) ?? 0;
  const openBot = bots.find((bot) => bot.botId === openBotId) ?? null;
  const refreshKey = actionKey({ botId: "all", type: "refresh" });

  const handleAction = async (input: ActionRequest) => {
    const key = actionKey(input);
    setPendingKeys((current) => (current.includes(key) ? current : [...current, key]));
    try {
      const response = await fetch(apiPath("/api/action"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });
      if (response.status === 401) {
        router.push("/login");
        return;
      }
      const body: unknown = await response.json().catch(() => null);
      const action =
        body && typeof body === "object" && "action" in body ? (body as { action: ActionRecord }).action : null;
      if (!response.ok || !action) {
        setToast(safeClientError(body) ?? "Could not send that.");
        return;
      }
      setFloor((current) =>
        current
          ? { ...current, actions: [action, ...current.actions.filter((item) => item.id !== action.id)] }
          : current,
      );
      setToast(toastFor(action));
    } catch {
      setToast("Could not reach the floor.");
    } finally {
      setPendingKeys((current) => current.filter((item) => item !== key));
    }
  };

  const handleRefresh = () => {
    void handleAction({ botId: "all", type: "refresh" });
  };

  const handleSignOut = async () => {
    await fetch(apiPath("/api/auth/logout"), { method: "POST" }).catch(() => undefined);
    router.push("/login");
    router.refresh();
  };

  const handleClose = useCallback(() => setOpenBotId(null), []);

  if (loading && !floor) return <DashboardSkeleton />;

  if (!floor) {
    return (
      <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-6">
        <h1 className="text-2xl font-medium tracking-tight">The floor is quiet.</h1>
        <p className="mt-2 text-sm text-zinc-400">{error || "Could not load bots."}</p>
        <button
          type="button"
          onClick={() => {
            void load();
          }}
          className="mt-6 h-11 w-fit rounded-full bg-white px-5 text-sm font-medium text-zinc-950"
        >
          Retry
        </button>
      </main>
    );
  }

  return (
    <main className="relative min-h-screen">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-72 bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.07),transparent_60%)]"
      />
      <div className="relative mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-6 sm:px-6 sm:py-10">
        <header className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-zinc-500">Private floor</p>
            <div className="mt-2 flex flex-wrap items-center gap-3">
              <h1 className="text-[1.7rem] font-medium tracking-tight text-zinc-50">Bot status</h1>
              <LiveIndicator state={live} fetchedAt={fetchedAt} />
            </div>
            <p className="mt-1 text-sm text-zinc-400">What your assistants are doing.</p>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleRefresh}
              disabled={pendingKeys.includes(refreshKey)}
              className="h-10 flex-1 rounded-full bg-white px-4 text-sm font-medium text-zinc-950 disabled:opacity-60 sm:flex-none"
            >
              {pendingKeys.includes(refreshKey) ? "Sending…" : "Refresh now"}
            </button>
            <button
              type="button"
              onClick={() => {
                void handleSignOut();
              }}
              className="h-10 flex-1 rounded-full border border-white/15 px-4 text-sm text-zinc-200 hover:bg-white/5 sm:flex-none"
            >
              Sign out
            </button>
          </div>
        </header>

        {error ? (
          <p role="status" className="rounded-2xl border border-amber-200/20 bg-amber-200/10 px-4 py-3 text-sm text-amber-100">
            {error}
          </p>
        ) : null}

        <SummaryStrip bots={bots} needsCount={needsCount} />
        <NeedsYou
          bots={bots}
          actions={floor.actions}
          pendingKeys={pendingKeys}
          onAction={(input) => {
            void handleAction(input);
          }}
          onOpenBot={setOpenBotId}
        />

        <section aria-labelledby="bots-heading">
          <div className="mb-3 flex items-baseline justify-between">
            <h2 id="bots-heading" className="text-sm font-medium text-zinc-100">
              Assistants
            </h2>
            <span className="text-xs text-zinc-500">{bots.length === 0 ? "None yet" : `${bots.length} reporting`}</span>
          </div>
          {sortedBots.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-white/10 px-4 py-12 text-sm text-zinc-500">
              No bots reporting yet. They show up here as soon as they push a status.
            </div>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {sortedBots.map((bot) => (
                <BotCard key={bot.botId} bot={bot} onOpen={setOpenBotId} />
              ))}
            </div>
          )}
        </section>

        <ActivityFeed events={floor.events} actions={floor.actions} />
      </div>

      {openBot ? (
        <BotDrawer
          bot={openBot}
          events={floor.events}
          actions={floor.actions}
          pendingKeys={pendingKeys}
          onAction={(input) => {
            void handleAction(input);
          }}
          onClose={handleClose}
        />
      ) : null}

      {toast ? (
        <div
          role="status"
          className="fixed bottom-4 left-1/2 z-50 w-[min(24rem,calc(100%-2rem))] -translate-x-1/2 rounded-full border border-white/10 bg-zinc-900/95 px-4 py-2 text-center text-sm text-zinc-100 shadow-2xl"
        >
          {toast}
        </div>
      ) : null}
    </main>
  );
};
