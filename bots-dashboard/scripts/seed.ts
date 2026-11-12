import { rm } from "node:fs/promises";
import path from "node:path";
import { createId } from "../src/lib/ids";
import { FileDriver } from "../src/lib/storage/file-driver";
import { JsonBotStore } from "../src/lib/storage/store";
import type { ActionRecord, BotRecord, HistoryEvent } from "../src/lib/types";

const minutesAgo = (minutes: number): string => new Date(Date.now() - minutes * 60 * 1000).toISOString();

const bots: BotRecord[] = [
  {
    botId: "jarvis",
    name: "Jarvis",
    title: "Head of Growth",
    status: "waiting_on_orel",
    summary: "Example: the Tuesday growth memo is drafted and waiting on a yes.",
    lastDone: "Example: pulled last week's channel numbers into the memo.",
    nextUp: "Example: send it once you approve.",
    needsOrel: [
      {
        id: "memo",
        title: "Send the Tuesday growth memo?",
        detail: "Example copy only. It recommends doubling the partner newsletter test.",
        link: "https://example.com/growth-memo",
        kind: "approval",
      },
    ],
    links: [{ label: "Example draft", url: "https://example.com/growth-memo" }],
    updatedAt: minutesAgo(4),
  },
  {
    botId: "analytics-bob",
    name: "Analytics Bob",
    title: "Analytics",
    status: "working",
    summary: "Example: reconciling signup cohorts against the warehouse.",
    lastDone: "Example: flagged a 6% dip in activated trials.",
    nextUp: "Example: chart the dip by landing page.",
    needsOrel: [],
    links: [{ label: "Example board", url: "https://example.com/analytics" }],
    updatedAt: minutesAgo(2),
  },
  {
    botId: "notes-bob",
    name: "Notes Bob",
    title: "Notes",
    status: "idle",
    summary: "Example: inbox is clear. Waiting for the next meeting.",
    lastDone: "Example: filed yesterday's founder notes.",
    nextUp: "Example: prep Thursday's one-pager.",
    needsOrel: [],
    links: [],
    updatedAt: minutesAgo(40),
  },
  {
    botId: "seo-aeo-jim",
    name: "SEO & AEO Jim",
    title: "Search",
    status: "waiting_on_orel",
    summary: "Example: glossary structure is ready, blocked on the canonical domain.",
    lastDone: "Example: clustered 40 question pages.",
    nextUp: "Example: publish the first ten once you pick a domain.",
    needsOrel: [
      {
        id: "domain",
        title: "Which domain should the glossary live on?",
        detail: "Example question. The two options are the apex, or a /glossary path.",
        kind: "question",
      },
    ],
    links: [{ label: "Example map", url: "https://example.com/glossary" }],
    updatedAt: minutesAgo(18),
  },
  {
    botId: "lifecycle-bob",
    name: "Lifecycle Bob",
    title: "Lifecycle",
    status: "working",
    summary: "Example: rewriting the day-3 activation email.",
    lastDone: "Example: shipped the welcome sequence fix.",
    nextUp: "Example: QA the new subject lines.",
    needsOrel: [],
    links: [],
    updatedAt: minutesAgo(11),
  },
  {
    botId: "data-pr-bob",
    name: "Data PR Bob",
    title: "Data PR",
    status: "idle",
    summary: "Example: no open data requests.",
    lastDone: "Example: closed the attribution export.",
    nextUp: "Example: wait for the next ask.",
    needsOrel: [],
    links: [],
    updatedAt: minutesAgo(300),
  },
  {
    botId: "partnerships-bob",
    name: "Partnerships Bob",
    title: "Partnerships",
    status: "blocked",
    summary: "Example: Acme wants a call, and the calendar hold is missing.",
    lastDone: "Example: sent the intro note.",
    nextUp: "Example: book Thursday once you confirm.",
    needsOrel: [
      {
        id: "acme",
        title: "Acme replied and asked for Thursday",
        detail: "Example FYI. They want 20 minutes, afternoon Israel time.",
        kind: "fyi",
      },
    ],
    links: [{ label: "Example thread", url: "https://example.com/acme" }],
    updatedAt: minutesAgo(27),
  },
  {
    botId: "reddit-bob",
    name: "Reddit Bob",
    title: "Community",
    status: "working",
    summary: "Example: drafting a reply in r/startups. Nothing posted yet.",
    lastDone: "Example: skipped two threads that were off-brief.",
    nextUp: "Example: queue one helpful comment.",
    needsOrel: [],
    links: [],
    updatedAt: minutesAgo(8),
  },
  {
    botId: "support-coder-bob",
    name: "Support Coder Bob",
    title: "Support engineering",
    status: "error",
    summary: "Example: the staging checkout spec failed to open.",
    lastDone: "Example: reproduced the coupon bug.",
    nextUp: "Example: retry the spec after a token refresh.",
    needsOrel: [],
    links: [{ label: "Example issue", url: "https://example.com/checkout-bug" }],
    updatedAt: minutesAgo(6),
  },
  {
    botId: "video-bob",
    name: "Video Bob",
    title: "Video",
    status: "idle",
    summary: "Example: last cut is exported. No new brief since yesterday.",
    lastDone: "Example: exported the 30s cut.",
    nextUp: "Example: wait for the next brief.",
    needsOrel: [],
    links: [],
    updatedAt: minutesAgo(190),
  },
  {
    botId: "paid-media-bob",
    name: "Paid Media Bob",
    title: "Paid media",
    status: "waiting_on_orel",
    summary: "Example: retargeting is capped and leaving cheap impressions on the table.",
    lastDone: "Example: paused the fatigued creative.",
    nextUp: "Example: raise the cap if you approve.",
    needsOrel: [
      {
        id: "cap",
        title: "Raise the retargeting cap to $400/day?",
        detail: "Example approval. CPA has been under target for nine days.",
        kind: "approval",
      },
    ],
    links: [{ label: "Example sheet", url: "https://example.com/paid" }],
    updatedAt: minutesAgo(15),
  },
  {
    botId: "live-to-email-bob",
    name: "Live-to-Email Bob",
    title: "Live to email",
    status: "working",
    summary: "Example: turning this morning's live notes into a letter.",
    lastDone: "Example: pulled the three quotes worth keeping.",
    nextUp: "Example: draft the opening.",
    needsOrel: [],
    links: [],
    updatedAt: minutesAgo(1),
  },
];

const events: HistoryEvent[] = [
  ["jarvis", "Jarvis", "working", "Example: started the Tuesday memo.", 50],
  ["jarvis", "Jarvis", "waiting_on_orel", "Example: the Tuesday growth memo is drafted and waiting on a yes.", 4],
  ["analytics-bob", "Analytics Bob", "working", "Example: reconciling signup cohorts against the warehouse.", 2],
  ["seo-aeo-jim", "SEO & AEO Jim", "waiting_on_orel", "Example: glossary structure is ready, blocked on the canonical domain.", 18],
  ["support-coder-bob", "Support Coder Bob", "error", "Example: the staging checkout spec failed to open.", 6],
  ["paid-media-bob", "Paid Media Bob", "waiting_on_orel", "Example: retargeting is capped and leaving cheap impressions on the table.", 15],
  ["live-to-email-bob", "Live-to-Email Bob", "working", "Example: turning this morning's live notes into a letter.", 1],
  ["lifecycle-bob", "Lifecycle Bob", "working", "Example: rewriting the day-3 activation email.", 11],
].map(([botId, name, status, summary, minutes], index) => ({
  id: `evt-seed-${index}`,
  botId: String(botId),
  name: String(name),
  status: status as HistoryEvent["status"],
  summary: String(summary),
  at: minutesAgo(Number(minutes)),
}));

const actions: ActionRecord[] = [
  {
    id: createId("act"),
    botId: "analytics-bob",
    type: "message",
    text: "Example: focus on the trial dip before the glossary.",
    status: "delivered",
    createdAt: minutesAgo(30),
    deliveredAt: minutesAgo(30),
  },
  {
    id: createId("act"),
    botId: "notes-bob",
    type: "approve",
    itemId: "archive",
    text: undefined,
    status: "handled",
    createdAt: minutesAgo(90),
    deliveredAt: minutesAgo(90),
    handledAt: minutesAgo(80),
    resultNote: "Example: archived the old notes and left a pointer.",
  },
];

const seed = async (): Promise<void> => {
  if (process.env.NODE_ENV === "production" || process.env.BLOB_READ_WRITE_TOKEN?.trim()) {
    console.error(
      "Refusing to seed. This script writes fictional local files only. Unset BLOB_READ_WRITE_TOKEN and do not run it in production.",
    );
    process.exit(1);
  }

  const root = path.join(process.cwd(), ".data");
  await rm(root, { recursive: true, force: true });
  const store = new JsonBotStore(new FileDriver(root));
  for (const record of bots) await store.upsertBot(record);
  await store.appendEvents(events);
  for (const record of actions) await store.appendAction(record);
  console.log(`Seeded ${bots.length} fictional bots into ${root}. Nothing was written to Blob.`);
};

seed().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : "Seed failed";
  console.error(message);
  process.exit(1);
});
